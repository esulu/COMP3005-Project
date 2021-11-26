import { Fragment, useState } from "react";
import { Grid, Typography, Button, Stack, Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { BookData } from "..";

interface BookProp {
    bookData: BookData,
    cart_id: string,
}

// Display book info and option to add to the cart
export const BookView = (props: BookProp) => {
    const [quantity, setQuantity] = useState(1);

    // Alert button
    const [open, setOpen] = useState(false);

    // Increase the quantity up to the maximum available copies
    const incrementQuantity = () => {
        if (quantity < props.bookData.quantity)
            setQuantity(quantity + 1);
    }

    // Decrement the quantity down to 1
    const decrementQuantity = () => {
        if (quantity > 1)
            setQuantity(quantity - 1);
    }

    // Add the books to the user's cart
    const addToCart = async () => {
        await fetch(`http://localhost:5000/addToCart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_id: props.cart_id, isbn: props.bookData.isbn, quantity })
        });
        setOpen(true);
    }

    return (
        <Fragment>
            <Typography id="modal-modal-title" variant="h4" component="h2">
                {props.bookData.title}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                    <img src={props.bookData.url} alt="" height='100%' width='100%'></img>
                </Grid>
                <Grid item xs={4}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Author(s):&nbsp;
                        {props.bookData.author_names.map((author, index) => {
                            return (index ? ', ' : '') + author
                        })}
                    </Typography>
                    <Typography id="modal-modal-price" sx={{ mt: 2 }}>
                        Price: ${props.bookData.price}
                    </Typography>
                    <Typography id="modal-modal-genre" sx={{ mt: 2 }}>
                        Genre: {props.bookData.genre}
                    </Typography>
                    <Typography id="modal-modal-publisher" sx={{ mt: 2 }}>
                        Publisher: {props.bookData.publisher_name}
                    </Typography>
                    <Typography id="modal-modal-year" sx={{ mt: 2 }}>
                        Released: {props.bookData.year}
                    </Typography>
                    <Typography id="modal-modal-page-count" sx={{ mt: 2 }}>
                        Page count: {props.bookData.page_count}
                    </Typography>
                    <Typography id="modal-modal-availability" sx={{ mt: 2 }}>
                        Available copies: {props.bookData.quantity}
                    </Typography>
                    <Typography id="modal-modal-isbn" sx={{ mt: 2 }}>
                        ISBN: {props.bookData.isbn}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography id="modal-modal-cart-text" variant='h5' sx={{ mt: 2 }}>
                        Purchase
                    </Typography>
                    <Typography id="modal-modal-cart-information" sx={{ mt: 2 }}>
                        Total: ${(quantity * props.bookData.price).toFixed(2)}
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
                        <Button variant="outlined" onClick={addToCart}>
                            Add to cart
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
        </Fragment >
    );
}