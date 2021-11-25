SELECT COALESCE(SUM(quantity), 0) AS quantity
FROM cart
NATURAL JOIN contains
WHERE cart_id = $1;