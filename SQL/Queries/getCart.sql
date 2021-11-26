-- Parameters: 1 - user_ID

-- Get book data for the given user ID
SELECT * 
FROM users
NATURAL JOIN contains
WHERE user_ID =$1;