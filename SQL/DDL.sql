/* Create DB tables for the bookstore */
CREATE TABLE IF NOT EXISTS warehouse
(
    warehouse_ID INT PRIMARY KEY,
    address VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS author
(
  author_ID INT PRIMARY KEY,
  name VARCHAR(40)
);


CREATE TABLE IF NOT EXISTS publisher
(
    publisher_ID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL,
    bank_number VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS inst_phone
(
    publisher_ID INT NOT NULL,
    phone_number VARCHAR(20),
    FOREIGN KEY (publisher_ID) REFERENCES publisher(publisher_ID),
	PRIMARY KEY (publisher_ID, phone_number)
);

CREATE TABLE IF NOT EXISTS cart
(
    cart_ID SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users
(
    user_ID SERIAL PRIMARY KEY,
    cart_ID INT,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address VARCHAR(60) NOT NULL,
    is_owner boolean NOT NULL,
    FOREIGN KEY (cart_ID) REFERENCES cart (cart_ID)
);

CREATE TABLE IF NOT EXISTS shipping
(
    shipping_ID SERIAL PRIMARY KEY,
    company_name VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL,
    warehouse_ID INT NOT NULL,
    FOREIGN KEY (warehouse_ID) REFERENCES warehouse (warehouse_ID)
);

CREATE TABLE IF NOT EXISTS orders
(
    order_ID SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    address VARCHAR(60) NOT NULL,
    bank_number VARCHAR(20) NOT NULL,
    shipping_ID INT NOT NULL,
    user_ID INT NOT NULL,
    cart_ID INT NOT NULL,
    FOREIGN KEY (shipping_ID) REFERENCES shipping (shipping_ID),
    FOREIGN KEY (user_ID) REFERENCES users (user_ID),
    FOREIGN KEY (cart_ID) REFERENCES cart (cart_ID)
);


CREATE TABLE IF NOT EXISTS book
(
    ISBN VARCHAR(13) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    page_count INT NOT NULL,
    price REAL NOT NULL,
    commission REAL NOT NULL,
    url VARCHAR(300) NOT NULL,
    quantity INT NOT NULL,
    warehouse_ID INT,
    publisher_ID INT,
    FOREIGN KEY (warehouse_ID) REFERENCES warehouse (warehouse_ID)
		ON DELETE CASCADE,
    FOREIGN KEY (publisher_ID) REFERENCES publisher (publisher_ID)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contains
(
    ISBN VARCHAR(13) NOT NULL,
    cart_ID INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (ISBN) REFERENCES book(ISBN)
		ON DELETE CASCADE,
    FOREIGN KEY (cart_ID) REFERENCES cart(cart_ID)
		ON DELETE CASCADE,
	PRIMARY KEY (ISBN, cart_ID)
);

CREATE TABLE IF NOT EXISTS written_by
(
  ISBN VARCHAR(13),
  author_ID INT,
  FOREIGN KEY(ISBN) REFERENCES book(ISBN)
	ON DELETE CASCADE,
  FOREIGN KEY (author_ID) REFERENCES author(author_ID)
	ON DELETE CASCADE,
  PRIMARY KEY (ISBN, author_ID)
);
