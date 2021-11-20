import express from 'express'
import cors from 'cors'
import {Database} from './db'

const port = 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


app.get('/', async(req, res) => {
    //const authors = await pool.query("SELECT * FROM author");
    //res.json(authors.rows);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});