-- Parameters $1 - cart_id

-- Return the cart and book quantites, along with the isbn, for each book in the cart
SELECT contains.quantity, isbn, book.quantity AS bookquantity
FROM cart NATURAL JOIN contains JOIN book USING (isbn)
WHERE cart_id=$1;