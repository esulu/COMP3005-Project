import {useEffect, useState} from "react";
import lodash from "lodash"
import {Book} from "./Book"
const booksPerPage = 20;
const booksPerRow = 4;

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
    const [books, setBooks] = useState<BookType[][]>([[{"isbn":""}]]);

    const getPage = async () => {
        const response = await fetch(`http://localhost:5000/books?offset=${page*booksPerPage}&limit=${(page+1)*booksPerPage}`);
        const jsonData = await response.json();
        const bookChunks:BookType[][] = lodash.chunk(jsonData["rows"], booksPerRow);
        if (!arraysEqual(books, bookChunks)) {
            console.log("set books to bookchunks");
            setBooks(bookChunks);
        }
            
        
    };

    useEffect(() => {
        getPage();
    }, [books]);

    return (
        <div className="container-fluid">
            <div className="container">
                {books.map(bookrow => {
                    return <div className="row">
                            {bookrow.map(book => {
                                return <div className="col">
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