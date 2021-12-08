-- Parameters: $1- ISBN, $2 - title, $3 - year, $4 - genre, $5 - page_count, $6 - price, $7 - commission
--             $8 - url, $9 - quantity, $10 - warehouse_ID $11 - publisher_ID,  $12 - is_purchasable

-- Add a new book to the database/store 
-- If the ISBN already exists, then update the is_purchaseable value and the quantity
INSERT INTO book 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
ON CONFLICT (ISBN)
DO UPDATE SET is_purchasable=true, quantity=$9;