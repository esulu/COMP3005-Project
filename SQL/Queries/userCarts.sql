-- Parameters: $1 - user_id
-- Gets the user_id and cart_id per a given user_id
-- Essentially retrived the cart_id from a user_id
SELECT user_id, cart_id
FROM users
NATURAL JOIN cart
WHERE user_id = $1