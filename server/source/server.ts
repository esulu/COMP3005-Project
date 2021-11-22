import express from 'express'
import cors from 'cors'
import {getDB} from './db'

const port = 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

let db = getDB();
function getIntParamater(parameter:any, defaultValue:number, min:number = 0, max:number = 10000): number {
    try {
        let parm = parseInt(parameter) || defaultValue;
        if (parm < min) return min;
        if (parm > max) return max;
        return parm;
    } catch(error) {
        return defaultValue;
    }
}

// -------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------

app.get('/authors', (req, res) => {

    let limit = getIntParamater(req.query.limit, 10000);
    let offset = getIntParamater(req.query.offset, 0);

    try {
        db.runPredefinedQuery("authors", [limit, offset])
          .then(query_result => {
              res.json(query_result)
          });
    } catch(error:any) {
        console.log(error.message);
    }
});

app.get('/books', (req,res) => {
    let limit = getIntParamater(req.query.limit, 10000);
    let offset = getIntParamater(req.query.offset, 0);

    try {
        db.runPredefinedQuery("books", [limit, offset])
          .then(query_result => {
              res.json(query_result)
          });
    } catch(error:any) {
        console.log(error.message);
    }
});

app.get('/book/:isbn', (req, res) => {
    try {
        db.runPredefinedQuery("book", [req.params.isbn])
          .then(query_result => {
              // no need to have number of rows or row array if are looking for the isbn
              res.json(query_result["rowCount"] == 0 ? {} :query_result["rows"][0]);
          });
    } catch(error:any) {
        console.log(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

