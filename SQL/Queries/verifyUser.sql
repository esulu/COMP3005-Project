SELECT user_id, username, password
FROM user
WHERE user_id = $1 AND password = $2