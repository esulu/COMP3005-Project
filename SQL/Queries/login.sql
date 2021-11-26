SELECT DISTINCT user_ID as token, is_owner
FROM users
WHERE username = $1 AND password = $2