/*const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// --------------------------------------------------------------------------
// Routes
// --------------------------------------------------------------------------

// get authors
app.get("/", async (req, res) => {
    //res.status(200).send("what's up");
    try {
        const authors = await pool.query("SELECT * FROM author");
        pool.newfunction();
        res.json(authors.rows);
    } catch (error) {
        console.error(error.message)
    }
});
*/