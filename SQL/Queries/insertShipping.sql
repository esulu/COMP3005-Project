-- Parameters: $1 - company name, $2 - status of the shipping, $3 - warehouse_ID
-- Inserts a tuple into the shipping relation
-- Returns back the inserted tuple
INSERT INTO shipping(company_name, status, warehouse_ID) 
VALUES($1, $2, $3) RETURNING *