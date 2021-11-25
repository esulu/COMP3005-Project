import { useState } from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CheckoutAlert, AlertProps } from "./CheckoutAlert";

const boxStyle = {
    p: 2,
    border: 1,
    padding: 2,
    borderRadius: 4,
    borderColor: "primary.main"
}

const textFieldStyle = {
    width: "17.5rem"
}


export const CheckoutView = () => {

    const [address, setAddress] = useState("");
    const [bankNumber, setBankNumber] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState<AlertProps | undefined>(undefined);

    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString || '{}');
        return userToken?.token;
    }


    const onConfirm = async () => {
        let verifyResponse = await fetch("http://localhost:5000/verifyUser", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                "token": getToken(),
                password })
        }).catch( e => {
            setAlert({alertType:"error", alertTitle:"Error", alertDescription:e.message, isOpen:true});
        })
        if (!verifyResponse) return;

        if (verifyResponse["status"] !== 200) {
            setAlert({alertType:"error", alertTitle:"Error", alertDescription:"Incorrect password", isOpen:true});
            return;
        }

        let checkoutResponse = await fetch("http://localhost:5000/checkout", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: getToken(),
                address: address,
                bankNumber: bankNumber,
            })
        }).catch( e => {
            setAlert({alertType:"error", alertTitle:"Error", alertDescription:e.message, isOpen:true});
        });
        if (!checkoutResponse) return;




    }

    const onAlertClose = () => {
        setAlert(undefined);
    }

    return (
        <div>
            <Typography variant="h3" align="center" gutterBottom>
                Checkout
            </Typography>
            <Box sx={boxStyle} m={1}>
                <Typography gutterBottom>
                    Enter address:
                </Typography>
                <TextField
                    sx = {textFieldStyle}
                    required
                    id="filled-required"
                    label="Required"
                    variant="filled"
                    onChange={event => setAddress(event.target.value)}
                />
            </Box>
            
            <Box sx={boxStyle} m={1}>
                <Typography gutterBottom>
                    Enter Bank account number:
                </Typography>
                <TextField
                    sx = {textFieldStyle}
                    required
                    id="filled-required"
                    label="Required"
                    variant="filled"
                    onChange = {event => setBankNumber(event.target.value)}
                />
            </Box>
            <Box sx={boxStyle} m={1}>
                <Typography gutterBottom>
                    Re-enter password for verification:
                </Typography>
                <TextField
                    sx = {textFieldStyle}
                    id="filled-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="filled"
                    onChange = {event => setPassword(event.target.value)}
                />
            </Box>
            <Typography align='center'>
                <Button variant="outlined" onClick={onConfirm}>Confirm checkout</Button>
            </Typography>
            {alert && <CheckoutAlert alertProps={alert} onClose={onAlertClose}></CheckoutAlert>}
        </div>
    )
}