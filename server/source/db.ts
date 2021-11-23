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
            console.log(this.sqlQueries);
            throw new Error(`Query "${queryName}" does not exist!`);
        }
        try {
            return makeResponse(await pool.query(this.sqlQueries.get(queryName)!, parameters));
            
        } catch(error) {
            console.log(error);
            return makeResponse([])
        }
    }

}

const db = new Database(pool);

export function getDB() {
    return db;
}