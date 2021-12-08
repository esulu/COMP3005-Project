-- Inserts a tuple into the cart, the only entry is the auto-incrementing primary key
-- so to auto-increment we use DEFAULT VALUES.
-- Returns back the tuple.
INSERT INTO cart 
DEFAULT VALUES RETURNING *