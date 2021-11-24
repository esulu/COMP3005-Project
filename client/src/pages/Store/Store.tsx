import React, { Fragment } from "react";
import { BookStore, SearchBar } from "../../components";

export const Store = () => {
    return (
        <Fragment>
            <SearchBar />
            <span style={{ margin: "5rem" }}></span>
            <BookStore></BookStore>
        </Fragment>
    )
}