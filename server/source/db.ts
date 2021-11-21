import pg from 'pg'
import fs from 'fs'

const dbName = "bookstore"
const SQLFolder = '../SQL'
/* Credentials to the local postgresql database */
const pool = new pg.Pool({
    user: "postgres",
    password: "2",
    host: "localhost",
    port: 5432,
    database: dbName
});

/* Creates tables in the bookstore database and populates them if needed*/
fs.readFile(`${SQLFolder}/DDL.sql`, "utf-8", async function(err, data) {
    if (err) {
        console.error(err);
        process.exit(-1);
    }

    let populateDB = () => {
        /* populates the db if empty */
        fs.readFile(`${SQLFolder}/populate.sql`, "utf-8", async function(err, pop_data) {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            const authors = await pool.query("SELECT * FROM author LIMIT 1");
        
            if (authors.rowCount == 1) return;

            pool.query(pop_data)
                .then(() => console.log(`Added ${pop_data.split(/\r\n|\r|\n/).length} tuples`))
                .catch(err => console.log(err.stack));
            
        });
    }

    pool.query(data)
        .then(() => console.log("Successfully created database tables"))
        .then(populateDB)
        .catch(err => console.log(err.stack));
});

class Database {
    pool: pg.Pool;

    constructor(pool: pg.Pool) {
        this.pool = pool;
    }
}

const db = new Database(pool);

export function getDB() {
    return db;
}