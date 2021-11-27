-- Parameters: $1 - ISBN, $2 - author_id

-- Add a writer for a specific book
INSERT INTO written_by VALUES($1, $2);