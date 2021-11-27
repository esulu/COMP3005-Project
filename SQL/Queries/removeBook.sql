-- Removes the book with given ISBN from the store
UPDATE book
SET is_purchasable=false
WHERE ISBN=$1;