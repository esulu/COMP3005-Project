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

export const Book = (props:BookProp) => {
    // States
    const [bookData, setBookData] = useState<undefined | BookData>(undefined);

    // Get json book data and set the state and thereby changing the book's elements
    const getBookData = async () => {
        const response = await fetch(`http://localhost:5000/book/${props.ISBN}`);
        const jsonData = await response.json();
        setBookData(jsonData);
    }

    // Only change the state once
    useEffect(() => {getBookData()}, []);

    return (
        <div key={props.ISBN} className="container text-center border border-primary rounded center">
        {bookData !== undefined && // only display if we have book data
            <>
                <img src={bookData.url} alt="" className="center"></img>
                <p>{bookData.title}</p>
                <p>CAD ${bookData.price}</p>
            </>
        }
        </div>
    );
};