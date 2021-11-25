SELECT user_id, cart_id
FROM users
NATURAL JOIN cart
WHERE user_id = $1