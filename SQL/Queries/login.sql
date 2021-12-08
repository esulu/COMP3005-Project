-- Parameters: $1 - username, $2 - password
-- Gets the user_ID and a boolean if the user is the owner
-- Acts as a login query, as we find all users that have the exact same username and password provided
-- Will return no rows (auth failure) if there wasn't a corresponding login combination
SELECT DISTINCT user_ID as token, is_owner
FROM users
WHERE username = $1 AND password = $2