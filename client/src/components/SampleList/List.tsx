import React, { Fragment, useEffect, useState } from 'react';

export const List = () => {

    const [rows, setRows] = useState([]);

    const getList = async () => {
        try {
            const response = await fetch('http://localhost:5000/');
            const jsonData = await response.json();

            console.log(jsonData);
            setRows(jsonData);
        } catch (err) {
            console.log(err);
        }
    };

    // make a single request 
    useEffect(() => {
        getList();
    }, []);

    console.log(rows);

    return (
        <Fragment>
            {" "}
            <table className="table mt-5 text-center">
                <thead>
                    <tr>
                        <th>Description</th>
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
                </tbody>
            </table>
        </Fragment>
    );
};