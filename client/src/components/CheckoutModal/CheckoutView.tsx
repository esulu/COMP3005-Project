import { useState } from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AlertBox, AlertProps } from "../Fragments/AlertBox";
import { CheckoutProp } from "..";

// Style for every box
const boxStyle = {
    p: 2,
    border: 1,
    padding: 2,
    borderRadius: 4,
    borderColor: "primary.main"
}

// Style for evert text field
const textFieldStyle = {
    width: "17.5rem"
}

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

// Function provides a view for a checkout
// The user can enter information and confirm checkout to the server
export const CheckoutView = (props: CheckoutProp) => {
    // states
    const [address, setAddress] = useState("");
    const [bankNumber, setBankNumber] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState<AlertProps | undefined>(undefined);

    // gets the token (and thus user_id) of the current user
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString || '{}');
        return userToken?.token;
    }

    // Function occurs when the confirm button is pressed
    const onConfirm = async () => {

        // First try to validate the user's password that was provided with their token/user_id
        let verifyResponse = await fetch("http://localhost:5000/verifyUser", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "token": getToken(),
                password
            })
        }).catch(e => {
            setAlert({ alertType: "error", alertTitle: "Internal Server Error", alertDescription: e.message, isOpen: true });
        })
        if (!verifyResponse) return;

        let verifyRes = await verifyResponse.json()
        // User had wrong password
        if (verifyRes.status !== 200) {
            setAlert({ alertType: "error", alertTitle: "Authentication Error", alertDescription: "Incorrect password", isOpen: true });
            return;
        }

        // Now perform the checkout process by providing all the data given in this view
        // to the server of which will generate a response if it was successful or not
        let checkoutResponse = await fetch("http://localhost:5000/checkout", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: getToken(),
                address: address,
                bankNumber: bankNumber,
            })
        }).catch(e => {
            setAlert({
                alertType: "error",
                alertTitle: "Internal Server Error",
                alertDescription: e.message,
                isOpen: true
            });
        });
        if (!checkoutResponse) return;

        let checkoutRes = await checkoutResponse.json();

        // Wasn't successful, if this was a server error the message will be long, for messages for the user
        // they are quite short in length
        if (checkoutRes.status !== 200) {
            setAlert({
                alertType: "error",
                alertTitle: `Server Error ${checkoutRes.status}`,
                alertDescription: checkoutRes.error.length >= 50 ? "A server issue occurred while checking out" : checkoutRes.error,
                isOpen: true
            });
            return;
        }

        setAlert({
            alertType: "success",
            alertTitle: "Order completed",
            alertDescription: "The order has been successfully completed!",
            isOpen: true
        });

        // Call the parent function to alert of a successful order
        await sleep(2500);
        props.onCheckout();

    }

    // Callback function for when the alert is closed
    const onAlertClose = () => {
        setAlert(undefined); // reset the state
    }

    return (
        <div>
            <Typography variant="h3" align="center" gutterBottom>
                Checkout
            </Typography>

            {/* Box container for address field */}
            <Box sx={boxStyle} m={1}>
                <Typography gutterBottom>
                    Enter address:
                </Typography>
                <TextField
                    sx={textFieldStyle}
                    required
                    className="filled-required"
                    label="Required"
                    variant="filled"
                    onChange={event => setAddress(event.target.value)}
                />
            </Box>

            {/* Box container for bank number field */}
            <Box sx={boxStyle} m={1}>
                <Typography gutterBottom>
                    Enter Bank account number:
                </Typography>
                <TextField
                    sx={textFieldStyle}
                    required
                    className="filled-required"
                    label="Required"
                    variant="filled"
                    onChange={event => setBankNumber(event.target.value)}
                />
            </Box>

            {/* Box container for password field */}
            <Box sx={boxStyle} m={1}>
                <Typography gutterBottom>
                    Re-enter password for verification:
                </Typography>
                <TextField
                    sx={textFieldStyle}
                    id="filled-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="filled"
                    onChange={event => setPassword(event.target.value)}
                />
            </Box>

            {/* Button on confirm*/}
            <Typography align='center' sx={{ marginBottom: 2 }}>
                <Button variant="outlined" onClick={onConfirm}>Confirm checkout</Button>
            </Typography>

            {/* The alert popup when the user presses the confirm checkout button */}
            {alert && <AlertBox alertProps={alert} onClose={onAlertClose}></AlertBox>}
        </div>
    )
}