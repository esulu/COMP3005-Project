-- Parameters: 1 - isbn, 2 - cart_ID

-- Removes a book from the user's cart
DELETE FROM contains
WHERE isbn=$1 AND cart_ID=$2