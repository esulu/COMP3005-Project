-- Parameters: 1 - user_ID

-- Get cart_id for the given user ID
SELECT cart_id
FROM users
WHERE user_ID =$1;