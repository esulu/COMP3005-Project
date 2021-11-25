-- Paramaters 1 - user_id

-- Returns the user_id and flag if the user_id is an owner

SELECT user_id, is_owner
FROM users
WHERE user_id = $1;