-- Parameters: $1 - address, $2 - bank number, $3 - shipping_ID, $4- user_ID, $5- cart_ID
-- Inserts a tuple into orders, and returns the tuple that was created.
INSERT INTO orders(order_address, order_bank_number, shipping_ID, user_ID, cart_ID) 
    VALUES($1, $2, $3, $4, $5) RETURNING *