import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

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
                />
            </Box>
            <Typography align='center'>
                <Button variant="outlined">Confirm checkout</Button>
            </Typography>
        </div>
    )
}