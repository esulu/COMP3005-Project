import express from 'express'
import cors from 'cors'
import pg from 'pg'
import { getDB, makeResponse, QueryResult, Transaction } from './db'
import _ from 'lodash'

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
function getIntParameter(parameter: any, defaultValue: number, min: number = 0, max: number = 10000): number {
    try {
        let parm = parseInt(parameter) || defaultValue;
        if (parm < min) return min;
        if (parm > max) return max;
        return parm;
    } catch (error) {
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
function getStringParameter(parameter: any, acceptedValues: string[] = [], defaultValue: string = ""): string {
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
    } catch (error: any) {
        console.log(error.message);
        res.json(makeResponse([]));
    }
});

interface BooksType {
    price: number,
    year: number,
    [index: string]: number,

}

interface BookType {
    author_name: string,
    phone_number: string,
    [index: string]: string,
}
/**
 * Endpoint returns a set of books
 * Note: the author field only contains one author in this endpoint.
 */
app.get('/books', async (req, res) => {
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
    let order_by = getStringParameter(req.query.order_by, ["price", "year"]);

    let parameters: any = [];
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
    let addParam = (attribute: string, paramValue: string, paramIsNumber: boolean = false, extra: string = "", extraLocation: string = "left") => {
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
        ${addParam("OFFSET", offset.toString(), true)}
        `;
        let queryData = (await db.pool.query(query, parameters)).rows;
        if (order_by !== "")
            queryData.sort((lhs: BooksType, rhs: BooksType) => {
                return ordering === "asc" ? lhs[order_by] - rhs[order_by] : rhs[order_by] - lhs[order_by];
            });
        res.json(makeResponse(queryData));
    } catch (error: any) {
        console.log(error.message);
        res.json(makeResponse([]));
    }
});


app.get('/book/:isbn', (req, res) => {
    db.runPredefinedQuery("book", [req.params.isbn])
        .then(query_result => {
            // no need to have number of rows or row array if are looking for the isbn
            // however there could be multiple authors of which we should return
            if (query_result.rowCount == 0) {
                res.json(makeResponse([]));
                return;
            }

            let query_return = query_result.rows[0];

            // For any attributes that have many values, we want to return all the values that are possible
            // and place into an array of those values.
            // Generally, we must also change the name of the variable (so we delete it after)
            const reduceMultipleAttributes = (bookTypeKey: string) => {
                const reducer = (list: string[], currentValue: BookType) => {
                    list.push(currentValue[bookTypeKey]);
                    return list;
                }
                let reduced = [... new Set(query_result.rows.reduce(reducer, []))]; // remove any possible duplicates
                delete query_return[bookTypeKey];
                return reduced;
            }

            query_return.author_names = reduceMultipleAttributes("author_name");
            query_return.phone_numbers = reduceMultipleAttributes("phone_number");

            res.json(query_return);
        })
        .catch(error => {
            console.log(error.message);
            res.json(makeResponse([]));
        })
});

// login handler that returns a token if the credentials are valid
app.use('/login', (req, res) => {
    try {
        db.runPredefinedQuery("login", [req.body.username, req.body.password])
            .then(query_result => {
                res.json(query_result["rowCount"] == 0 ? {} : query_result["rows"][0]);
            });
    } catch (error: any) {
        console.log(error.message);
    }
});

// For when after the user has logged in
// token is already known from local storage of the webstie and the user provided the password.
app.use('/verifyUser', (req, res) => {
    db.runPredefinedQuery("verifyUser", [req.body.token, req.body.password])
        .then(query_result => {
            if (query_result["rowCount"] == 0)
                res.json({status:400, text:"Either the provided token doesn't exist or the password is incorrect"});
            else
                res.json({ status:200, text:"" });
        })
        .catch(error => {
            console.log(error);
        });
});

app.use('/checkout', async (req, res) => {
    let user_id = getIntParameter(req.body.token, -1, -1, 10000000);

    async function doCheckout(client:pg.PoolClient) : Promise<[boolean, string]>{
        // Whenever we run a query in our transaction, it shouldn't return an empty table
        let insureIntegrity = (query:QueryResult) => {
            if (query.rowCount === 0)
                throw "Empty data was returned, this is most likely due to the user not having anything in their cart.";
        }
        try {
            // Get the warehouse key
            let warehouses = await db.runPredefinedQuery("warehouses", [], client);
            insureIntegrity(warehouses);
            let warehouse_id = warehouses.rows[0].warehouse_id;

            // Get the cart key
            let carts = await db.runPredefinedQuery("userCarts", [user_id], client);
            insureIntegrity(carts);
            let cart_id = carts.rows[0].cart_id;

            // Create a shipping tuple and get the key
            let insertShipping = await db.runPredefinedQuery("insertShipping", [_.sample(db.shippingCompanies), db.shippingStatuses[0],warehouse_id]);
            insureIntegrity(insertShipping);
            let shipping_id = insertShipping.rows[0].shipping_id;
            // Create a new cart
            let insertCart = await db.runPredefinedQuery("insertCart", [], client);
            insureIntegrity(insertCart);
            let new_cart_id = insertCart.rows[0].cart_id;
            console.log(new_cart_id);
            (await db.runTransactions([{
                // Insert the new order tuple
                predefinedQuery: "insertOrder",
                parameters: [req.body.address, req.body.bankNumber, shipping_id, user_id, cart_id]
            }, {
                // set the user to the new cart
                predefinedQuery: "setUserCart",
                parameters: [new_cart_id, user_id]
            }])).forEach( t => insureIntegrity(t));
        } catch(error:any) {
            return [true, error];
        }
        return [false, ""];
    }

    db.runTransaction(doCheckout)
        .then( () => {
            res.json({ status:200})
        }).catch( err => {
            console.log(err);
            res.json({status:400, error:err})
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

