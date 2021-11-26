import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Alert } from "@mui/material";

// Style for every box
const boxStyle = {
    p: 2,
    border: 1,
    padding: 2,
    borderRadius: 4,
    borderColor: "primary.main"
}


interface OrderInterface {
    order_date: string,
    order_address: string,
    company_name: string,
    status: string
}

export const FindOrder = () => {

    // Order 
    const [orderNumber, setOrderNumber] = useState("");
    const [order, setOrder] = useState<OrderInterface | undefined>(undefined);

    // dialogs open
    const [alertOpen, setAlertOpen] = useState(false);    
    const [orderOpen, setOrderOpen] = useState(false);

    // Find the order based on the orderNumber and set it respectively, also change dialogs
    const onFind = async () => {
        try {
            let response = await fetch(`http://localhost:5000/findOrder?order_id=${orderNumber}`);
            let jsonData = await response.json();
            if (jsonData.rowCount === 0) {
                setAlertOpen(true);
                return;
            }
            let obj = jsonData.rows[0];
            obj.order_date = new Date(obj.order_date).toDateString(); // fix the date
            setOrder(obj);
            setOrderOpen(true);
        } catch(error) {
            console.log(error);
        }
        
    };

    // from https://www.freecodecamp.org/news/how-to-capitalize-words-in-javascript/
    const upperCaseLettersForWords = (s:string) => {
        return s.replace(/_/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    }

    // Close both dialogs when order number is changed
    useEffect(() => {
        setAlertOpen(false);
        setOrderOpen(false);
    }, [orderNumber]);
    return (
        <>
            <Typography variant="h4" align="center" gutterBottom>
                Find Order
            </Typography>
            {/* Box container for find order field */}
            <Box sx={boxStyle} m={1}>
                <Typography gutterBottom>
                    Enter Order Number:
                </Typography>
                <TextField
                    sx={{width:"17.5rem"}}
                    required
                    id="filled-required"
                    label="Required"
                    variant="filled"
                    onChange={event => setOrderNumber(event.target.value)}
                />
            </Box>
            {/* Button on confirm*/}
            <Typography align='center' sx={{marginBottom:2}}>
                <Button variant="outlined" onClick={onFind}>Find order</Button>
            </Typography>

            {/* Output all order data based on the order object itself */}
            { order && orderOpen && 
                <Box sx={boxStyle}>
                    <List>
                        <ListItem >
                            <ListItemText sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} primary={`Order Number:\t${orderNumber.toString()}`} />
                        </ListItem>
                        <Divider />
                        {Object.entries(order).map( entry => {
                            const [key, value] = entry;
                            return (
                                <ListItem key={`lt-${key} ${value}`}>
                                    <ListItemText primary={`${upperCaseLettersForWords(key)}:\t${value}`} key={`${key}-${value}`} />
                                </ListItem>)
                            }
                        )}
                    </List>
                </Box>
            }
            { alertOpen &&
                <Alert severity="error">
                    {orderNumber === "" ?
                     "An order number is required" :
                      "An order with this order number does not exist!"}
                </Alert>
            }
        </>
    )    
}