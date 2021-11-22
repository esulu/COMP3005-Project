import {useEffect, useState} from "react";
import lodash from "lodash"
import {Book} from "./Book"
const booksPerPage = 25;
const booksPerRow = 5;

interface BookType {
    isbn: string
}

const arraysEqual = (arr1:BookType[][], arr2:BookType[][]) => {
    return lodash.isEmpty(lodash.differenceWith(
        lodash.flatten(arr1),
        lodash.flatten(arr2),
        lodash.isEqual
    ));
}


export const BookStore = () => {

    const [page, setPage] = useState(0);
    const [books, setBooks] = useState<BookType[][] | undefined>(undefined);

    const getPage = async () => {
        const response = await fetch(`http://localhost:5000/books?offset=${page*booksPerPage}&limit=${(page+1)*booksPerPage}`);
        const jsonData = await response.json();
        const bookChunks:BookType[][] = lodash.chunk(jsonData["rows"], booksPerRow);
        if (books === undefined)
            setBooks(bookChunks);
        else if (!arraysEqual(books, bookChunks))
            setBooks(bookChunks);
            
        
    };

    useEffect(() => {
        getPage();
    }, [books]);

    const isbnReducer = (previous:string, current:BookType) => {return previous + current.isbn};

    return (
        <div className="container-fluid">
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
            <div></div> {/* TODO footer */}
        </div>
    )
};