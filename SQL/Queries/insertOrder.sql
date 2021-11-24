INSERT INTO (order_date, order_address, order_bank_number, shipping_ID, userID, cartID)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *