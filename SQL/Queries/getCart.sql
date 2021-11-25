-- Parameters: 1 - cart_ID

-- Get book data for the given cart ID
SELECT * FROM contains
WHERE cart_ID=$1