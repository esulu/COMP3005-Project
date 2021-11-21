SELECT ISBN, title, year, genre, page_count, price, commission, url, quantity, is_purchasable, publisher_ID, publisher_name, author_name
FROM book
NATURAL JOIN publisher
NATURAL JOIN written_by
NATURAL JOIN author
LIMIT $1
OFFSET $2;