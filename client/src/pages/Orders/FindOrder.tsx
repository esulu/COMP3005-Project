import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

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

    const [orderNumber, setOrderNumber] = useState("");
    const [order, setOrder] = useState<OrderInterface | undefined>(undefined);

    const onFind = async () => {
        let response = await fetch(`http://localhost:5000/findOrder?order_id=${orderNumber}`);
    };

    useEffect(() => {
        onFind();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderNumber]);

    return (
        <div>
            <Typography variant="h3" align="center" gutterBottom>
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
            { order && 
                <Box>
                    <List>
                        <ListItem>
                            <ListItemText primary="order id:" secondary={orderNumber} />
                        </ListItem>
                        <Divider />
                        {Object.entries(order).map( entry => {
                            const [key, value] = entry;
                            return (
                                <ListItem>
                                    <ListItemText primary={key} secondary={value} />
                                </ListItem>)
                            }
                        )}
                    </List>
                </Box>
            }
        </div>
    )    
}