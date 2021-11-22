import React from "react";
import { BookStore } from "../../components"; 

export const Store = () => {
    // Display name
    const name = 'Store';

    return (
        <>
            <span style={{margin:"5rem"}}></span>
            <BookStore></BookStore>
        </>
    )
}