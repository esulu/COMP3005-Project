-- Parameters: $1- cart_id, $2 - user_id
-- Sets a user's cart to the specified cart_id
UPDATE users
SET cart_id = $1
WHERE user_id = $2