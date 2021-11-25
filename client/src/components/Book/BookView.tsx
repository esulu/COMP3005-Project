import { Grid, Typography } from "@mui/material";
import { Fragment } from "react";
import { BookData } from "..";

interface BookProp {
    bookData: BookData,
}

// Display book info and option to add to the cart
export const BookView = (props: BookProp) => {
    return (
        <Fragment>
            <Typography id="modal-modal-title" variant="h4" component="h2">
                {props.bookData.title}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                    <img src={props.bookData.url} height='100%' width='100%'></img>
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
                </Grid>
                <Grid item xs={4}>
                    {/* TODO: Implement this */}
                    <Typography id="modal-modal-cart-text" variant='h5' sx={{ mt: 2 }}>
                        Add to cart
                    </Typography>
                </Grid>
            </Grid>
        </Fragment>
    );
}