-- Parameters: $1 - cart_id

-- Gets the number of books given a cart_id
-- If there are no books, returns 0
SELECT COALESCE(SUM(quantity), 0) AS quantity
FROM cart
NATURAL JOIN contains
WHERE cart_id = $1;