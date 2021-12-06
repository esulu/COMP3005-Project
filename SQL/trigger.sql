-- Purpose: A trigger is created to inform a publisher of the number of books to order 
--			when the book stock falls below a set threshold of 10 books

-- Report to the publisher the number of books to order 
CREATE FUNCTION update_quantity()
	RETURNS trigger
	LANGUAGE plpgsql
	AS $$
	DECLARE newQuantity INT;
 	BEGIN
		NEW.quantity = NEW.quantity + (
			-- from previousMonthBookSale.sql
			SELECT SUM(NEW.quantity) as newQuantity 
				FROM orders
				NATURAL JOIN cart
				NATURAL JOIN contains
				WHERE 
					order_date >= date_trunc('month', current_date - interval '1' month)
					AND order_date < date_trunc('month', current_date)
		);
	RETURN NEW;
	END;
	$$;

-- Create trigger to update book quantity when the quantity falls below 10
CREATE TRIGGER order_books AFTER UPDATE OF quantity ON book
FOR EACH ROW
WHEN (NEW.quantity < 10) -- update condition
EXECUTE PROCEDURE update_quantity();