-- Parameters: $1 - user_id, $2- password
-- Returns the user_id, username and password of a given user and password combination
-- used for verification, if given the combo doesn't return anything thus auth failure.
SELECT user_id, username, password
FROM users
WHERE user_id = $1 AND password = $2