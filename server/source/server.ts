import express from 'express'
import cors from 'cors'
import {getDB, makeResponse} from './db'

const port = 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

let db = getDB();
function getIntParameter(parameter:any, defaultValue:number, min:number = 0, max:number = 10000): number {
    try {
        let parm = parseInt(parameter) || defaultValue;
        if (parm < min) return min;
        if (parm > max) return max;
        return parm;
    } catch(error) {
        return defaultValue;
    }
}

function getStringParameter(parameter:any, acceptedValues:string[] = [], defaultValue:string = ""): string {
    if (parameter === undefined)
        return defaultValue;
    if (!(typeof parameter === 'string' || parameter instanceof String))
        return defaultValue;
    let param = parameter.toString().trim();

    if (acceptedValues.length === 0 || acceptedValues.indexOf(param) > -1) 
        return param;
    return defaultValue;
    
}

// -------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------

app.get('/authors', (req, res) => {

    let limit = getIntParameter(req.query.limit, 10000);
    let offset = getIntParameter(req.query.offset, 0);

    try {
        db.runPredefinedQuery("authors", [limit, offset])
          .then(query_result => {
              res.json(query_result)
          });
    } catch(error:any) {
        console.log(error.message);
    }
});

app.get('/books', async(req, res) => {
    // query quantifiers
    let limit = getIntParameter(req.query.limit, 10000);
    let offset = getIntParameter(req.query.offset, 0);

    // query searches
    let author = getStringParameter(req.query.author);
    let title = getStringParameter(req.query.title);
    let isbn = getStringParameter(req.query.isbn);
    let genre = getStringParameter(req.query.genre);

    // query sorts
    let ordering = getStringParameter(req.query.ordering, ["ASC", "DESC"], "ASC");
    let order_by = getStringParameter(req.query.order_by, ["price", "year"]);
    if (order_by === "")
        ordering = "";
    
    let parameters:any = [];
    let parameterNumber = 1;

    let addParam = (attribute:string, paramValue:string, paramIsNumber:boolean = false, extra:string = "", extraLocation:string="left") => {
        if (paramValue === "") return "";
        let parameter = "";
        if (extraLocation == "left")
            parameter = `${extra} ${attribute} $${parameterNumber++}`;
        if (extraLocation == "right")
            parameter = `${attribute} $${parameterNumber++} ${extra}`;
        parameters.push(paramIsNumber ? parseInt(paramValue) : paramValue);
        return parameter;
    }

    try {
        // no way we can do this in sql folder
        let query = 
        `
        WITH written_by_no_dups AS
            (SELECT ISBN, MIN(author_ID) AS author_ID
            FROM written_by
            GROUP BY ISBN
        )
        SELECT ISBN, title, year, genre, page_count, price, commission, url, quantity, is_purchasable, publisher_ID, publisher_name, author_id, author_name
        FROM book
        NATURAL JOIN publisher
        NATURAL JOIN written_by_no_dups
        NATURAL JOIN author
        WHERE 1=1 
            ${addParam("author_id =", author, false, "AND")}
            ${addParam("title = ", title, false, "AND")}
            ${addParam("isbn = ", isbn, false, "AND")}
            ${addParam("genre = ", genre, false, "AND")}
        ${addParam("ORDER BY", order_by, false, ordering, "right")}
        ${addParam("LIMIT", limit.toString(), true)}
        ${addParam("OFFSET", offset.toString(), true )}
        `;
        console.log(query);
        console.log(parameters);

        res.json(makeResponse(await db.pool.query(query, parameters)));
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

