import { Card, CardActionArea, CardContent, CardMedia, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

// Types for the prop
interface BookProp {
    ISBN: string
}

// The data we expect from the json response
interface BookData {
    ISBN: string,
    url: string,
    title: string,
    price: number
}

export const Book = (props: BookProp) => {
    // States
    const [bookData, setBookData] = useState<undefined | BookData>(undefined);

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
                <Tooltip title={bookData.title}>
                    <Card sx={{ width: 198, height: 350 }} >
                        <CardActionArea sx={{ height: 350 }}>
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
            }
        </div>
    );
};