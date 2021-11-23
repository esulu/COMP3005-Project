SELECT DISTINCT user_ID as token
FROM users
WHERE username = $1 AND password = $2