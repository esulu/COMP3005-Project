import { Fragment, useEffect, useState } from "react";
import { Alert, Button, Collapse, Grid, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { BookData } from "..";

// Types for the prop
interface BookProp {
    ISBN: string,
    quantity: number,
    cart_ID: number,
    onDelete: () => Promise<void>;
    updateTotal: (bookTotal: number) => void;
}

export const BookCartView = (props: BookProp) => {
    // Alert button
    const [open, setOpen] = useState(false);

    const [bookData, setBookData] = useState<undefined | BookData>(undefined);

    const [quantity, setQuantity] = useState(props.quantity);

    // Get json book data and set the state and thereby changing the book's elements
    const getBookData = async () => {
        const response = await fetch(`http://localhost:5000/book/${props.ISBN}`);
        const jsonData = await response.json();
        setBookData(jsonData);

        // Set the initial grand total amount for the cart
        props.updateTotal(quantity * jsonData.price);
    }

    // Increase the quantity up to the maximum available copies
    const incrementQuantity = () => {
        if (bookData !== undefined && quantity < bookData.quantity) {
            setQuantity(quantity + 1);
            props.updateTotal(bookData.price);
        }
    }

    // Decrement the quantity down to 1
    const decrementQuantity = () => {
        if (bookData !== undefined && quantity > 1) {
            setQuantity(quantity - 1);
            props.updateTotal(-1 * bookData.price);
        }
    }

    // Update the quantity for this book
    const updateQuantity = async () => {
        await fetch(`http://localhost:5000/addToCart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_id: props.cart_ID, isbn: props.ISBN, quantity })
        });
        setOpen(true);
    }

    // Remove this book from the cart
    const removeBook = async () => {
        await fetch(`http://localhost:5000/removeFromCart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_id: props.cart_ID, isbn: props.ISBN })
        });

        // Call parent function to update the cart list
        props.onDelete();

        // Remove current book from the grand total
        if (bookData !== undefined)
            props.updateTotal(-1 * quantity * bookData.price);
    }

    useEffect(() => {
        getBookData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            {bookData !== undefined &&
                <Fragment>
                    <Typography id="title" variant="h5">
                        {bookData.title}
                    </Typography>

                    <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <img src={bookData.url} alt="" height="350" width="230"></img>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography id="cart-text" variant='h6' sx={{ mt: 2 }}>
                                Quantity
                            </Typography>
                            <Typography id="cart-information" sx={{ mt: 2 }}>
                                Price: ${bookData.price}
                            </Typography>
                            <Typography id="cart-information" sx={{ mt: 2 }}>
                                Total: ${(quantity * bookData.price).toFixed(2)}
                            </Typography>
                            <Stack spacing={2}>
                                <Stack spacing={2} direction="row" sx={{ mt: 2, justifyContent: "space-between" }}>
                                    <Button
                                        size="small"
                                        disableElevation
                                        variant="contained"
                                        onClick={() => decrementQuantity()}
                                    >
                                        -
                                    </Button>
                                    <p>{quantity}</p>
                                    <Button
                                        size="small"
                                        disableElevation
                                        variant="contained"
                                        onClick={() => incrementQuantity()}
                                    >
                                        +
                                    </Button>
                                </Stack>
                                <Button variant="outlined" onClick={updateQuantity}>
                                    Update Quantity
                                </Button>
                                <Button variant="contained" color="error" onClick={removeBook}>
                                    Remove From Cart
                                </Button>
                                <Collapse in={open}>
                                    <Alert
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setOpen(false);
                                                }}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                        sx={{ mb: 2 }}
                                    >
                                        Success!
                                    </Alert>
                                </Collapse>
                            </Stack>
                        </Grid>
                    </Grid>
                </Fragment>
            }
        </Fragment>
    );
}