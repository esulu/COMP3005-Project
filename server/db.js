const Pool = require("pg").Pool;
fs = require("fs");

const dbName = "bookstore"

/* Credentials to the local postgresql database */
const pool = new Pool({
    user: "postgres",
    password: "2",
    host: "localhost",
    port: 5432,
    database: dbName
});

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

module.exports = pool;
