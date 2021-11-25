SELECT user_id, username, password
FROM users
WHERE user_id = $1 AND password = $2