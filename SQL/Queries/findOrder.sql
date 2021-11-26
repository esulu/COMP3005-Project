--- gets the order date, adddress and shipping company and status of order
--- params $1 - the order_id

SELECT order_date, order_address, company_name, status
FROM orders
NATURAL JOIN shipping
WHERE order_id = $1;
