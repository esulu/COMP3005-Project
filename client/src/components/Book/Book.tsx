import { Card, CardActionArea, CardContent, CardMedia, Modal, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Fragment, useEffect, useState } from 'react';
import { BookView } from './BookView';

// Types for the prop
interface BookProp {
    ISBN: string
}

// The data we expect from the json response
export interface BookData {
    author_names: (string)[],
    genre: string,
    ISBN: string,
    page_count: number,
    price: number,
    publisher_name: string,
    quantity: number,
    title: string,
    url: string,
    year: number
}

export const Book = (props: BookProp) => {
    // States
    const [bookData, setBookData] = useState<undefined | BookData>(undefined);

    // ModaL
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Get json book data and set the state and thereby changing the book's elements
    const getBookData = async () => {
        const response = await fetch(`http://localhost:5000/book/${props.ISBN}`);
        const jsonData = await response.json();
        setBookData(jsonData);
    }

    // Truncate book titles
    const truncate = (str: string) => {
        return str.length > 35 ? str.substring(0, 32) + "..." : str;
    }

    // Only change the state once
    useEffect(() => { getBookData() }, []);

    return (
        <div key={props.ISBN}>
            {bookData !== undefined && // only display if we have book data
                <Fragment>
                    <Tooltip title={bookData.title}>
                        <Card sx={{ width: 198, height: 350 }} >
                            <CardActionArea onClick={handleOpen} sx={{ height: 350 }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={bookData.url}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {truncate(bookData.title)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        CAD ${bookData.price}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Tooltip>

                    {/* Book view modal */}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '60%',
                            bgcolor: 'background.paper',
                            border: '2px solid #1976d2',
                            boxShadow: 24,
                            p: 4,
                            background: 'white'
                        }}>
                            <BookView bookData={bookData} />
                        </Box>
                    </Modal>
                </Fragment>
            }
        </div>
    );
};