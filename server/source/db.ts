import pg from 'pg'
import fs from 'fs'

const dbName = "bookstore"
const SQLFolder = '../SQL/Queries'

/* Credentials to the local postgresql database */
const pool = new pg.Pool({
    user: "postgres",
    password: "2",
    host: "localhost",
    port: 5432,
    database: dbName
});

// All queries defined in /server/SQL/Queries
// key is the actual SQL code in said file.
let preDefinedQueries: Map<string, string> = new Map();

/**
 * Function gets all the queries of /server/SQL/Queries
 * And populates the map preDefinedQueries
 */
async function generateSQLQueries() {
    await fs.readdir(SQLFolder, async (err, files) => {
        if (err) {
            console.log(err);
            process.exit(-1);
        }
        files.forEach(file => {
            fs.readFile(`${SQLFolder}/${file}`, "utf-8", (err, data) => {
                preDefinedQueries.set(file.split('.')[0], data);
            });
        });
    });
}

// https://www.typescriptlang.org/docs/handbook/advanced-types.html
const isPGQueryResult = (res:string[] | pg.QueryResult<any>): res is pg.QueryResult<any> => {
    return (res as pg.QueryResult<any>).rows !== undefined;
}

export function makeResponse(queryResult:string[] | pg.QueryResult<any>) {
    if (isPGQueryResult(queryResult)) {
        return {
            "rowCount": queryResult.rowCount,
            "rows": queryResult.rows
        }
    }
    return {
        "rowCount": queryResult.length,
        "rows": queryResult
    }
}

// Interface for a transaction
// provide EITHER rawQuery OR predefinedQuery, do not provide both.
export interface Transaction {
    rawQuery?:string,
    predefinedQuery?:string,
    parameters:[...any]
}

class Database {
    pool: pg.Pool;
    sqlQueries: Map<string, string>;
    constructor(pool: pg.Pool) {
        this.pool = pool;
        if (Object.keys(preDefinedQueries).length == 0) {
            generateSQLQueries();
        }
        this.sqlQueries = preDefinedQueries;
    }

    public async runPredefinedQuery(queryName: string, parameters: [...any]) {
        if (!this.sqlQueries.has(queryName)) {
            throw new Error(`Query "${queryName}" does not exist!`);
        }
        try {
            return makeResponse(await pool.query(this.sqlQueries.get(queryName)!, parameters));
            
        } catch(error) {
            console.log(error);
            return makeResponse([])
        }
    }

    /**
     * Function runs multiple queries (transactions) in one go, this function provides database
     * consistency as any error defined in transaction will result in a rollback of the database
     * prior to any transaction
     * Function can throw exceptions
     * @param transactions The queries to run
     * @returns A one to one mapping of transactions where each element is the result of said query
     */
    public async runTransaction(transactions:Transaction[]): Promise<[...any]> {
        const client = await pool.connect();

        let promises = []

        try {
            // start a transaction history
            await client.query('BEGIN');

            // for each transaction, map it to a promise to furfill the query
            promises = transactions.map(async transaction => {
                // raw query, just apply it directly
                if (transaction.rawQuery) {
                    return makeResponse(await client.query(transaction.rawQuery, transaction.parameters));
                }
                // query is defined in /SQL/Queries, run this predefined query if it exists
                if (transaction.predefinedQuery) {

                    if (!this.sqlQueries.has(transaction.predefinedQuery))
                        throw new Error(`Query "${transaction.predefinedQuery}" does not exist!`);
                    return makeResponse(await client.query(this.sqlQueries.get(transaction.predefinedQuery)!, transaction.parameters));

                }
                throw new Error("Transaction has no query to compute");
            });

            await client.query('COMMIT')
        } 
        catch(e) {
            await client.query('ROLLBACK')
            throw e
        }
        finally {
            client.release()
        }

        // Decompose all the promises and map them to actual data
        let results:[...any] = []
        await Promise.all(promises).then( (promiseResult) => {
            results.push(promiseResult);
        })
        
        return results;
    }

}

const db = new Database(pool);

export function getDB() {
    return db;
}