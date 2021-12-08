-- book statistics of a book (non aggregated!) containing the sales and expenditure per said book
-- view contains all book statistics of which were SOLD (i.e. in the order table)
CREATE OR REPLACE VIEW booksalestatistics AS
SELECT isbn, title, genre, contains.quantity, (price*contains.quantity) AS sales, ((price*contains.quantity)*commission) AS expenditure
FROM orders 
NATURAL JOIN cart
NATURAL JOIN contains
INNER JOIN book USING (isbn);

-- View of sales per genre
CREATE OR REPLACE VIEW booksalespergenre AS
SELECT genre, SUM(sales) AS sales
from booksalestatistics
GROUP BY genre;

-- View of Sales per expenditures, per a book
CREATE OR REPLACE VIEW booksaleperexpenditure AS
SELECT title, SUM(sales) AS sales, SUM(expenditure) AS expenditure
FROM booksalestatistics
GROUP BY title;

-- View of sales per author
CREATE OR REPLACE VIEW salesperauthor AS
SELECT author_name, SUM(quantity) AS quantity, SUM(sales) AS sales
FROM booksalestatistics
NATURAL JOIN written_by
NATURAL JOIN author
GROUP BY author_name;
