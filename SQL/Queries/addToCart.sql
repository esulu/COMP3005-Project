-- Parameters: 1 - isbn, 2 - cart_ID, 3 - quantity

-- Add books if the user does not already have them in the cart
-- Update book quantity if the user already has the item in their cart
INSERT INTO contains (ISBN, cart_ID, quantity)
VALUES ($1, $2, $3)
ON CONFLICT (ISBN, cart_ID)
DO UPDATE SET quantity=$3;