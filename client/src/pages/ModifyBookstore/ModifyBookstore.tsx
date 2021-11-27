import { Fragment, useState } from "react"
import { Button, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { AlertBox, AlertProps } from "../../components"

const boxStyle = {
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #1976d2',
    boxShadow: 24,
    p: 4,
    background: 'white',
    '& .MuiTextField-root': { m: 1, width: '50ch' }
}

/**
 * Allows owners to add and remove books from the store
 */
export const ModifyBookstore = () => {
    // Add book states
    const [addAlert, setAddAlert] = useState<AlertProps | undefined>(undefined);


    // Remove book states
    const [isbnRemove, setIsbnRemove] = useState("");
    const [removeAlert, setRemoveAlert] = useState<AlertProps | undefined>(undefined);


    // Remove the book from the store
    const removeBook = async () => {
        const response = await fetch("http://localhost:5000/removeBook", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isbn: isbnRemove })
        });
        const jsonData = await response.json();
        console.log(jsonData);
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
                    // id="remove-isbn"
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