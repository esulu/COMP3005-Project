import React, { Fragment, useEffect, useState } from 'react';

import { Edit } from './Edit';

export const List = () => {

    const [rows, setRows] = useState<any[]>([]);

    // Delete author function
    const deleteRow = async (id: string) => {
        try {
            const deleteRow = await fetch(`https://localhost:5000/delete/${id}`, {
                method: 'DELETE'
            });

            // TODO: remove this
            console.log(deleteRow);

            // Remove deleted row
            setRows(rows.filter(row => row.author_id !== id));
        } catch (err) {
            console.log(err);
        }
    }

    // Get authors
    const getList = async () => {
        try {
            const response = await fetch('http://localhost:5000/');
            const jsonData = await response.json();

            setRows(jsonData);
        } catch (err) {
            console.log(err);
        }
    };

    // make a single request 
    useEffect(() => {
        getList();
    }, []);

    // TODO; remove this
    console.log(rows);

    return (
        <Fragment>
            {" "}
            <table className="table mt-5 text-center">
                <thead>
                    <tr>
                        <th>Author</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>john@example.com</td>
                    </tr> */}
                    {rows.map(row => (
                        <tr key={row.author_id}>
                            <td>{row.name}</td>
                            <td><Edit row={row} /></td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => deleteRow(row.author_id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
};