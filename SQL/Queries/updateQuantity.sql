-- Parameters: $1 - new quantity, $2 - isbn

-- Update the quantity for the book
UPDATE book 
SET quantity=$1
WHERE isbn=$2;
