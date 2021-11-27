import { Fragment, useEffect, useState } from "react"
import { Autocomplete, Button, CircularProgress, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { AlertBox, AlertProps } from "../../components"

const boxStyle = {
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #1976d2',
    boxShadow: 24,
    p: 4,
    background: 'white',
    mt: 2,
    '& .MuiTextField-root': { m: 1, width: '40%' }
}

interface SelectFill {
    result: string;
}

// Autofill results for warehouses
let warehouses = [
    { result: 'Sample Warehouse' }
];

// Autofill results for publishers
let publishers = [
    { result: 'Sample Publisher' }
];

// Autofill results for authors
let authors = [
    { result: 'Sample Author' }
];

/**
 * Allows owners to add and remove books from the store
 */
export const ModifyBookstore = () => {
    // Add book states
    const [isbn, setIsbn] = useState("");
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [genre, setGenre] = useState("");
    const [pageCount, setPageCount] = useState("");
    const [price, setPrice] = useState("");
    const [commission, setCommission] = useState("");
    const [image, setImage] = useState("");
    const [quantity, setQuantity] = useState("");
    const [warehouse, setWarehouse] = useState("");
    const [publisher, setPublisher] = useState("");
    const [author, setAuthor] = useState("");
    const [addAlert, setAddAlert] = useState<AlertProps | undefined>(undefined);

    // Remove book states
    const [isbnRemove, setIsbnRemove] = useState("");
    const [removeAlert, setRemoveAlert] = useState<AlertProps | undefined>(undefined);

    // Add the book to the store
    const addBook = async () => {
        const response = await fetch("http://localhost:5000/addBook", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                isbn: isbn,
                title: title,
                year: Number(year),
                genre: genre,
                page_count: Number(pageCount),
                price: Number(price),
                commission: Number(commission),
                url: image,
                quantity: Number(quantity),
                warehouse_id: warehouse,
                publisher_id: publisher,
                is_purchasable: true
            })
        });

        const jsonData = await response.json();

        // const authorResponse = await fetch("http://localhost:5000/addWriter", {
        //     method: "POST",
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         isbn: isbn,
        //         author_id: author
        //     })
        // });

        console.log(jsonData)

        // Send response depending on if the response was successful or not
        if (jsonData.rowCount === 0) {
            setAddAlert({
                alertType: "error",
                alertTitle: `Error`,
                alertDescription: "The book cannot be added",
                isOpen: true
            });
            return;
        }

        setAddAlert({
            alertType: "success",
            alertTitle: "Book Added",
            alertDescription: "The book has been successfully added to the store!",
            isOpen: true
        });
    }

    // Remove the book from the store
    const removeBook = async () => {
        const response = await fetch("http://localhost:5000/removeBook", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isbn: isbnRemove })
        });
        const jsonData = await response.json();

        // Send response depending on if the response was successful or not
        if (jsonData.rowCount === 0) {
            setRemoveAlert({
                alertType: "error",
                alertTitle: `Error`,
                alertDescription: "The book with the provided ISBN does not exist",
                isOpen: true
            });
            return;
        }

        setRemoveAlert({
            alertType: "success",
            alertTitle: "Book Removed",
            alertDescription: "The book has been successfully removed from the store!",
            isOpen: true
        });
    }

    // Get the warehouse autofill data
    const getWarehouseData = async () => {
        const response = await fetch('http://localhost:5000/getWarehouses');
        const jsonData = await response.json();
        warehouses = jsonData.map(function (element: any) {
            return { result: element["warehouse_address"] };
        });
    }

    // Get the publisher autofill data
    const getPublisherData = async () => {
        const response = await fetch('http://localhost:5000/getPublishers');
        const jsonData = await response.json();
        publishers = jsonData.map(function (element: any) {
            return { result: element["publisher_name"] };
        });
    }

    // Get the author autofill data
    const getAuthorData = async () => {
        const response = await fetch('http://localhost:5000/getAuthors');
        const jsonData = await response.json();
        authors = jsonData.map(function (element: any) {
            return { result: element["author_name"] };
        });
    }

    // Required for the dropdown menus
    const [openWarehouse, setOpenWarehouse] = useState(false);
    const [openPublisher, setOpenPublisher] = useState(false);
    const [openAuthor, setOpenAuthor] = useState(false);
    const [optionsWarehouse, setOptionsWarehouse] = useState<readonly SelectFill[]>([]);
    const [optionsPublisher, setOptionsPublisher] = useState<readonly SelectFill[]>([]);
    const [optionsAuthor, setOptionsAuthor] = useState<readonly SelectFill[]>([]);
    const loading = (openWarehouse || openPublisher || openAuthor) && optionsWarehouse.length === 0
        && optionsPublisher.length === 0 && optionsAuthor.length === 0;


    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await getWarehouseData();
            await getPublisherData();
            await getAuthorData();

            if (active) {
                setOptionsWarehouse([...warehouses]);
                setOptionsPublisher([...publishers]);
                setOptionsAuthor([...authors]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!openWarehouse) setOptionsWarehouse([]);
        if (!openPublisher) setOptionsPublisher([]);
        if (!openAuthor) setOptionsAuthor([]);
    }, [openWarehouse, openPublisher, openAuthor]);

    return (
        <Fragment>
            <Typography variant="h4" marginTop="2rem" marginLeft="20%">
                Add & Remove Books from the Store
            </Typography>
            {/* Add book */}
            <Box
                marginLeft="20%"
                marginRight="20%"
                marginTop="2rem"
                sx={boxStyle}
            >
                <Typography id="title" variant="h5">
                    Add book
                </Typography>

                <TextField
                    label="ISBN"
                    variant="outlined"
                    onChange={event => setIsbn(event.target.value)} />
                <TextField
                    label="Title"
                    variant="outlined"
                    onChange={event => setTitle(event.target.value)} />
                <TextField
                    label="Year"
                    variant="outlined"
                    onChange={event => setYear(event.target.value)} />
                <TextField
                    label="Genre"
                    variant="outlined"
                    onChange={event => setGenre(event.target.value)} />
                <TextField
                    label="Page Count"
                    variant="outlined"
                    onChange={event => setPageCount(event.target.value)} />
                <TextField
                    label="Price"
                    variant="outlined"
                    onChange={event => setPrice(event.target.value)} />
                <TextField
                    label="Commission"
                    variant="outlined"
                    onChange={event => setCommission(event.target.value)} />
                <TextField
                    label="Image URL"
                    variant="outlined"
                    onChange={event => setImage(event.target.value)} />
                <TextField
                    label="Quantity"
                    variant="outlined"
                    onChange={event => setQuantity(event.target.value)} />
                <Autocomplete
                    open={openWarehouse}
                    onOpen={() => {
                        setOpenWarehouse(true);
                    }}
                    onClose={() => {
                        setOpenWarehouse(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.result === value.result}
                    getOptionLabel={(option) => option.result}
                    options={optionsWarehouse}
                    loading={loading}
                    onInputChange={(event, value) => setWarehouse(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Warehouse"
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
                <Autocomplete
                    open={openPublisher}
                    onOpen={() => {
                        setOpenPublisher(true);
                    }}
                    onClose={() => {
                        setOpenPublisher(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.result === value.result}
                    getOptionLabel={(option) => option.result}
                    options={optionsPublisher}
                    loading={loading}
                    onInputChange={(event, value) => setPublisher(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Publisher"
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
                <Autocomplete
                    open={openAuthor}
                    onOpen={() => {
                        setOpenAuthor(true);
                    }}
                    onClose={() => {
                        setOpenAuthor(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.result === value.result}
                    getOptionLabel={(option) => option.result}
                    options={optionsAuthor}
                    loading={loading}
                    onInputChange={(event, value) => setAuthor(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Author"
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
                    sx={{ height: '3rem', top: '.2rem', m: 1 }}
                    onClick={addBook}
                >
                    Add
                </Button>

                {/* The alert popup */}
                {addAlert && <AlertBox alertProps={addAlert} onClose={() => { setAddAlert(undefined); }}></AlertBox>}
            </Box>

            {/* Remove book */}
            <Box
                marginLeft="20%"
                marginRight="20%"
                marginTop="2rem"
                sx={boxStyle}
            >
                <Typography id="title" variant="h5">
                    Remove book
                </Typography>
                <TextField
                    label="ISBN"
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onChange={event => setIsbnRemove(event.target.value)} />
                <Button
                    variant="contained"
                    sx={{ height: '3rem', top: '.7rem' }}
                    onClick={removeBook}
                >
                    Remove
                </Button>

                {/* The alert popup */}
                {removeAlert && <AlertBox alertProps={removeAlert} onClose={() => { setRemoveAlert(undefined); }}></AlertBox>}
            </Box>
        </Fragment >
    )
}