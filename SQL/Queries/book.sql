SELECT ISBN, title, year, genre, page_count, price, commission, url, quantity, is_purchasable, author_name, publisher_name, publisher_address, publisher_email, phone_number
FROM book
NATURAL JOIN publisher
NATURAL JOIN inst_phone
NATURAL JOIN written_by
NATURAL JOIN author
WHERE ISBN = $1;