-- Add a new book to the database/store 
-- If the ISBN already exists, then update the is_purchaseable value
INSERT INTO book 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
ON CONFLICT (ISBN)
DO UPDATE SET is_purchasable=true