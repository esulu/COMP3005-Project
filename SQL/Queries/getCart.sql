-- Parameters: 1 - user_ID

-- Get book data for the given user ID, 
-- retrieves both the books in the cart and information regarding the user requesting it.
SELECT * 
FROM users
NATURAL JOIN contains
WHERE user_ID =$1;