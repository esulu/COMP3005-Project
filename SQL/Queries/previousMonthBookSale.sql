-- idea comes from
-- https://stackoverflow.com/questions/37587910/get-data-for-previous-month-in-postgresql
-- Gets the previous month's sale quantity for a book given an isbn
-- param $1 - isbn
SELECT isbn, SUM(quantity) as order_amount
FROM orders
NATURAL JOIN cart
NATURAL JOIN contains
WHERE 
	order_date >= date_trunc('month', current_date - interval '1' month) -- Returns the first day of the previous month
  	AND order_date < date_trunc('month', current_date) -- returns the first day of this month
	-- thus all order_dates in the previous month
GROUP BY isbn
HAVING isbn = $1