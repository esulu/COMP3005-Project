-- Parameters: $1 - ISBN, $2 - author_id

-- Add a writer for a specific book
-- Do nothing should the entry exist
INSERT INTO written_by VALUES($1, $2) 
ON CONFLICT (ISBN, author_ID) 
DO NOTHING;