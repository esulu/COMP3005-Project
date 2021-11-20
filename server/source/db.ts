import Pool from 'pg'
import fs from 'fs'

const dbName = "bookstore"

/* Credentials to the local postgresql database */
function getPool() {
    return new Pool.Pool({
        user: "postgres",
        password: "2",
        host: "localhost",
        port: 5432,
        database: dbName
    });
}

export class Database {
    dbName = "bookstore"
    pool: Pool.Pool;

    constructor() {
        this.pool = getPool();
        this.initalizeDB();
    }

    /**
     * initalizeDB
     */
    public initalizeDB() {
        /* Creates tables in the bookstore database and populates them if needed*/
        fs.readFile('../SQL/DDL.sql', "utf-8", async function(err, data) {
            if (err) {
                console.error(err);
                process.exit(-1);
            }

            let populateDB = () => {
                /* populates the db if empty */
                fs.readFile('../SQL/populate.sql', "utf-8", async function(err, pop_data) {
                    if (err) {
                        console.error(err);
                        process.exit(-1);
                    }
                    const authors = await this.pool.query("SELECT * FROM author LIMIT 1");
                
                    if (authors.rowCount == 1) return;

                    this.pool.query(pop_data)
                        .then(() => console.log(`Added ${pop_data.split(/\r\n|\r|\n/).length} tuples`))
                        .catch(err => console.log(err.stack));
                    
                });
            }

            this.pool.query(data)
                .then(() => console.log("Successfully created database tables"))
                .then(populateDB)
                .catch(err => console.log(err.stack));
        })
    }
}