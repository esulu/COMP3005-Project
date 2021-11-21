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


let preDefinedQueries: Map<string, string> = new Map();

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

    public async runPredefinedQuery(queryName: string, paramaters: [...any]) {
        if (!this.sqlQueries.has(queryName)) {
            console.log(this.sqlQueries);
            throw new Error(`Query "${queryName}" does not exist!`);
        }
        try {
            let queryRet = await pool.query(this.sqlQueries.get(queryName)!, paramaters);
            return {
                "rowCount": queryRet.rowCount,
                "rows": queryRet.rows
            }
        } catch(error) {
            console.log(error);
        }
        
    }

}

const db = new Database(pool);

export function getDB() {
    return db;
}