import {useEffect, useState} from "react";
import lodash from "lodash"
import {Book} from "./Book"
import { Button } from "@mui/material";
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import './BookStore.css'


const booksPerPage = 20;
const booksPerRow = 5;

interface BookType {
    isbn: string
}

// Determines if two multi dimensional arrays are equal
const arraysEqual = (arr1:BookType[][], arr2:BookType[][]) => {
    return lodash.isEmpty(lodash.differenceWith(
        lodash.flatten(arr1),
        lodash.flatten(arr2),
        lodash.isEqual
    ));
}


export const BookStore = () => {

    // states
    const [page, setPage] = useState(0);
    const [books, setBooks] = useState<BookType[][] | undefined>(undefined);

    // Gets the page by using offsets and limit and getting a different set of books to set into our books state
    const getPage = async () => {
        const response = await fetch(`http://localhost:5000/books?offset=${page*booksPerPage}&limit=${booksPerPage}`);
        const jsonData = await response.json();
        const bookChunks:BookType[][] = lodash.chunk(jsonData["rows"], booksPerRow);
        if (books === undefined)
            setBooks(bookChunks);
        else if (!arraysEqual(books, bookChunks))
            setBooks(bookChunks);
    };

    // When the nextPage button is clicked, advance one page
    const nextPage = () => {
        if (lodash.flatten(books).length < booksPerPage) return
        setPage(page + 1);
    }

    // When the previouspage button is clicked, go back one page.
    const prevPage = () => {
        if (page == 0) return;
        setPage(page - 1);
    }

    // Update page/book store content per each book/page change
    useEffect(() => {
        getPage();
    }, [books, page]);

    const isbnReducer = (previous:string, current:BookType) => {return previous + current.isbn};

    return (
        <div className="container-fluid">
            {/*display of books, books contains chunks of books of which are all books that will be used for a specific row*/}
            <div className="container">
                {books && books.map(bookrow => {
                    return <div className="row" key={bookrow.reduce(isbnReducer, "")}>
                            {bookrow.map(book => {
                                return <div className="col" key={`col-${book.isbn}`}>
                                        <Book ISBN={book.isbn}></Book>
                                    </div>
                            })}
                    </div>
                })}
            </div>

            {/*Footer */}
            <div className="container text-center">
                <hr className="hr-text" data-content="Navigation" />
                <Button variant="outlined" size="large" startIcon={<WestIcon />} onClick={prevPage}>Previous</Button>
                <span style={{margin:"1rem"}}></span>
                <Button variant="outlined" size="large" endIcon={<EastIcon />} onClick={nextPage}>Next</Button>
                <span style={{marginLeft:"2.5rem"}}></span>
                <hr className="hr-text"></hr>
            </div> 
        </div>
    )
};