-- SQL gets order and shipping info given a user ID

-- param $1 - user_id

SELECT order_id, order_date, order_address, order_bank_number, company_name, status
FROM orders
INNER JOIN users USING (user_id)
NATURAL JOIN shipping
WHERE user_id = $1