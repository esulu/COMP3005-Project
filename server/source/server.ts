import express from 'express'
import cors from 'cors'
import {getDB, makeResponse} from './db'

const port = 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

let db = getDB();

// 
/**
 * function takes a parameter from a query string, usually from req.query.(parameter) and returns a number
 * @param parameter The parameter given from req.query.parameter
 * @param defaultValue The default value to give parameter if the given value is invalid
 * @param min The minimum this value can be
 * @param max The maximum this value can be
 * @returns An integer denoting the parameter
 */
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

/**
 * function takes a parameter from a query string, usually from req.query.(parameter) and returns a string
 * @param parameter The parameter given from req.query.parameter
 * @param acceptedValues Acceptable values that the parameter can take the value of
 * @param defaultValue The default value to give parameter if the given value is invalid
 * @returns A string, equal to parameter if it's an accepted value otherwise default value
 */
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
        res.json(makeResponse([]));
    }
});

interface BooksType {
    price: number,
    year: number,
    [index: string]: number,

}
/**
 * Endpoint returns a set of books
 * Note: the author field only contains one author in this endpoint.
 */
app.get('/books', async(req, res) => {
    // query quantifiers
    let limit = getIntParameter(req.query.limit, 10000);
    let offset = getIntParameter(req.query.offset, 0);

    // query searches
    let author = getStringParameter(req.query.author);
    let title = getStringParameter(req.query.title);
    let isbn = getStringParameter(req.query.isbn);
    let genre = getStringParameter(req.query.genre);
    
    // ORDER BY cannot be used in parameterized queries, a limitation of pg-node
    // https://github.com/brianc/node-postgres/issues/300
    // https://stackoverflow.com/questions/67344790/order-by-command-using-a-prepared-statement-parameter-pg-promise
    // https://stackoverflow.com/questions/32425052/using-limit-order-by-with-pg-postgres-nodejs-as-a-parameter
    // Instead, we sort after
    
    let ordering = getStringParameter(req.query.ordering, ["asc", "desc"], "asc");
    let order_by= getStringParameter(req.query.order_by, ["price", "year"]);
    
    let parameters:any = [];
    let parameterNumber = 1;

    /**
     * Function adds a parameter to an SQL query, it directly fills out what parameter number is given ($1,$2...) and writes the query.
     * @param attribute The attribute in the table to reference
     * @param paramValue the value to set the attribute to
     * @param paramIsNumber A boolean, true if the paramValue is an integer otherwise false
     * @param extra Any extra string information
     * @param extraLocation The location the extra string information is put either values "left" or "right"
     * @returns returns a string of "[extra] attributes parameterNumber [extra]
     */
    let addParam = (attribute:string, paramValue:string, paramIsNumber:boolean = false, extra:string = "", extraLocation:string="left") => {
        if (paramValue === "") return "";
        let parameter = extraLocation == "left" ? `${extra} ${attribute} $${parameterNumber}` : `${attribute} $${parameterNumber} ${extra}`;
        ++parameterNumber;
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
        SELECT ISBN, title, year, genre, page_count, price, commission, url, quantity, is_purchasable, author_id, author_name
        FROM book
        NATURAL JOIN written_by_no_dups
        NATURAL JOIN author
        WHERE 1=1 
            ${addParam("author_name =", author, false, "AND")}
            ${addParam("title = ", title, false, "AND")}
            ${addParam("isbn = ", isbn, false, "AND")}
            ${addParam("genre = ", genre, false, "AND")}
        ${""/*addParam("ORDER BY", order_by, false, ordering, "right")*/}
        ${addParam("LIMIT", limit.toString(), true)}
        ${addParam("OFFSET", offset.toString(), true )}
        `;
        let queryData = (await db.pool.query(query, parameters)).rows;
        if (order_by !== "")
            queryData.sort((lhs:BooksType, rhs:BooksType) => {
                return ordering === "asc" ? lhs[order_by] - rhs[order_by] : rhs[order_by] - lhs[order_by];
            });
        res.json(makeResponse(queryData));
    } catch(error:any) {
        console.log(error.message);
       res.json(makeResponse([]));
    }
});

// TODO: perform an inner join with book and author to get the authors
// authors will need to be as a list
app.get('/book/:isbn', (req, res) => {
    try {
        db.runPredefinedQuery("book", [req.params.isbn])
          .then(query_result => {
              // no need to have number of rows or row array if are looking for the isbn
              res.json(query_result["rowCount"] == 0 ? {} :query_result["rows"][0]);
          });
    } catch(error:any) {
        console.log(error.message);
        res.json(makeResponse([]));
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

