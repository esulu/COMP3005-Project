INSERT INTO orders(order_address, order_bank_number, shipping_ID, user_ID, cart_ID) 
    VALUES($1, $2, $3, $4, $5) RETURNING *