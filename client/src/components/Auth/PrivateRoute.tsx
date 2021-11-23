import React from "react";
import { Redirect, Route } from "react-router";

/**
 * Handles the redirect to the login page if the user is not authenticated
 * NOTE: this is the other method of doing the login page. 
 * it's a bit dubious since all pages will be directed from this component 
 * another concern is that this method requires an authentication service
 * leaving it for now, but will remove it later 
 * TODO: remove this if we're satisfied with the token sessions
 */
export const PrivateRoute = ({ path, render, ...rest }: { path: string, render: (props: any) => JSX.Element }) => {

    const isLoggedIn = false;

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn
                    ? <Route render={render} {...props} />
                    : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
        />
    );
}