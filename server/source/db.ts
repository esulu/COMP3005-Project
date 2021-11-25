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

export function makeResponse(queryResult:string[] | pg.QueryResult<any>): QueryResult {
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
export interface QueryCreatorReturnType {
    hasErrors:boolean,
    error?:string
}

export interface QueryResult {
    rowCount: number,
    rows: [...any]
}

class Database {
    pool: pg.Pool;
    sqlQueries: Map<string, string>;
    readonly shippingCompanies = ["Intact Courier", "Econofast Shipping", "Canada Post", "USPS", "Fedex"];
    readonly shippingStatuses = ["Received", "In Transit", "Delivered"]
    constructor(pool: pg.Pool) {
        this.pool = pool;
        if (Object.keys(preDefinedQueries).length == 0) {
            generateSQLQueries();
        }
        this.sqlQueries = preDefinedQueries;
    }

    /**
     *  Function runs a predefined query file under /SQL/Queries/queryName and returns the result of the query
     * @param queryName The name of the query under /SQL/Queries/{queryName}
     * @param parameters Any parameters required to be set in the query file
     * @param client Optionally, the client database (pool.client) to ensure a single transaction occurs to the database
     * Only provide this if this function is being used under runTransaction()
     * @returns QueryResult of the predefined query
     */
    public async runPredefinedQuery(queryName: string, parameters: [...any], client:undefined|pg.PoolClient = undefined) {
        if (!this.sqlQueries.has(queryName)) {
            throw new Error(`Query "${queryName}" does not exist!`);
        }
        try {
            if (client)
                return makeResponse(await client.query(this.sqlQueries.get(queryName)!, parameters));
            else
                return makeResponse(await pool.query(this.sqlQueries.get(queryName)!, parameters));
            
        } catch(error) {
            console.log(error);
            return makeResponse([])
        }
    }

    /**
     * Function runs a query defined by query creator in a single transaction. This is done by providing the COMMIT and ROLLBACK
     * functionality to ensure a singular transaction while the querycreator performs the actual queries
     * @param queryCreator A function accepting the client of which is a single connection to the database
     *  pass the client variable to any other function in Database to ensure a single connection
     *  IMPORTANT: The function must be wrapped in a try catch block, this function CANNOT throw! and returns the following:
     *      boolean -> indication of whether it had any errors
     *      string -> the error message
     */
    public async runTransaction(queryCreator: (client:pg.PoolClient) => Promise<QueryCreatorReturnType>) {
        let client = await pool.connect();

        try {
            // start a transaction history
            await client.query('BEGIN');

            // in the case of an error, keep the message outside of the promise functions
            let errorMessage = undefined;

            // run the query the user wants to perform in a single transaction
            await queryCreator(client).then(async doRollBack => {
                if (doRollBack.hasErrors) {
                    errorMessage = doRollBack.error;
                } else {
                    await client.query('COMMIT');
                }
            }).catch( async e => {
                errorMessage = e.message;
            })

            // If at any point we had an error, throw said error, this functionality cannot be in .then or .catch
            if (errorMessage)
                throw errorMessage;
        } 
        catch(e) {
            await client.query('ROLLBACK')
            throw e
        }
        finally {
            client.release();
        }

    }

}

const db = new Database(pool);

export function getDB() {
    return db;
}