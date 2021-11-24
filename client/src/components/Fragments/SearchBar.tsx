import { ChangeEvent, useState, SyntheticEvent, useEffect, Fragment } from "react";
import { Autocomplete, Button, CircularProgress, Grid, MenuItem, TextField } from "@mui/material";
import { Box } from "@mui/system";

interface SearchFill {
    result: string;
}

interface StrToStr {
    [key: string]: string
}

const searchItemToKey: StrToStr = {
    title: 'title',
    author: 'author_name',
    isbn: 'isbn',
    genre: 'genre'
}

// The item for the search
const searchItems = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'isbn', label: 'ISBN' },
    { value: 'genre', label: 'Genre' }
];

// Autofill results 
let results = [
    { result: 'Sample Book' }
];


/**
 * Search bar component
 */
export const SearchBar = () => {
    const defaultItem = 'title';

    // Search bar entry
    const [searchQuery, setSearchQuery] = useState('');

    // The search item i.e., title, author, etc.
    const [searchItem, setSearchItem] = useState(defaultItem);

    // Required for the asynchronous search bar
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<readonly SearchFill[]>([]);
    const loading = open && options.length === 0;

    // Update search item
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchItem(event.target.value);
    }

    // Update search query
    const handleQueryChange = (event: SyntheticEvent<Element, Event>, value: string) => {
        setSearchQuery(value);
    }

    // Get data for the autofill
    const getAutofillInfo = async (item: string) => {
        const bookAttribute = item.charAt(0).toUpperCase() + item.slice(1);
        const response = await fetch(`http://localhost:5000/get${bookAttribute}s`);
        const jsonData = await response.json();
        results = jsonData.map(function (element: any) {
            return { result: element[searchItemToKey[item]] };
        })
    }

    // Search result handler
    const search = async () => {
        console.log(searchItem + ": " + searchQuery);
        const response = await fetch(`http://localhost:5000/books?${searchItem}=${searchQuery}`);
        const jsonResponse = await response.json();
        // TODO: display the returned books, somehow
        console.log(jsonResponse);
    }

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await getAutofillInfo(searchItem);

            if (active) {
                setOptions([...results]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading, searchItem]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '50ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <Grid container justifyContent="center">
                <TextField
                    id="search-item"
                    select
                    label="Search Item"
                    value={searchItem}
                    onChange={handleChange}
                >
                    {searchItems.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Autocomplete
                    id="search-bar"
                    freeSolo
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.result === value.result}
                    getOptionLabel={(option) => option.result}
                    options={options}
                    loading={loading}
                    onInputChange={handleQueryChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </Fragment>
                                ),
                            }}
                        />
                    )}
                />
                <Button
                    variant="contained"
                    sx={{ height: '3rem', top: '.7rem' }}
                    onClick={search}
                >
                    Search
                </Button>
            </Grid>
        </Box >
    );
}