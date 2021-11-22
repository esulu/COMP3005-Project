import { request } from 'http';
import React, { useEffect, useState } from 'react';

interface BookProp {
    ISBN: string
}

interface BookData {
    ISBN: string,
    url: string,
    title: string,
    price: number
}

// defined outside to supress react-hooks/exhaustive-deps
async function requestBookData(isbn:string, setData:React.Dispatch<React.SetStateAction<BookData | undefined>>) {
    

}

export const Book = (props:BookProp) => {
    
    const [bookData, setBookData] = useState<undefined | BookData>(undefined);

    const getBookData = async () => {
        const response = await fetch(`http://localhost:5000/book/${props.ISBN}`);
        const jsonData = await response.json();
        setBookData(jsonData);
    }

    useEffect(() => {getBookData()}, []);

    return (
        <div key={props.ISBN} className="container text-center border border-primary rounded center">
        {bookData !== undefined &&
            <>
                
                <img src={bookData.url} alt="" className="center"></img>
                <p>{bookData.title}</p>
                <p>CAD ${bookData.price}</p>
            </>
        }
        </div>
    );
};