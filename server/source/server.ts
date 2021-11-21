import express from 'express'
import cors from 'cors'
import {getDB} from './db'

const port = 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


app.get('/', async(req, res) => {
    let db = getDB();
    try {
        const authors = await db.pool.query("SELECT * FROM author");
        res.json(authors.rows);
    } catch (error:any) {
        console.error(error.message)
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});