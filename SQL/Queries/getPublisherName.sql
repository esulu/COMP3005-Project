-- Parameters: $1 - ISBN

-- Retrieve the publisher name given the book ISBN
SELECT publisher_name
FROM book JOIN publisher USING (publisher_ID)
WHERE ISBN=$1;