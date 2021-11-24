import { Fragment } from "react";
import { Button } from "@mui/material";
import { UseToken } from "..";

/**
 * Header component
 */
export const Header = () => {
    const { token, removeToken } = UseToken();

    // Logout handler
    const logout = () => {
        removeToken();
        window.location.replace("/"); // redirect to login page
    }

    if (token && token !== -1) {  // user is logged in; show logout button
        return (
            <Fragment>
                <Button
                    variant="outlined"
                    sx={{ position: 'absolute', right: '2rem' }}
                    onClick={logout}
                >
                    Logout
                </Button>
                <h1 className="text-center mt-5">Look Inna Book</h1>
            </Fragment>
        );
    } else {   // logged out
        return (
            <h1 className="text-center mt-5">Look Inna Book</h1>
        );
    }
}