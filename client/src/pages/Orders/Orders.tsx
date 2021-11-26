
import Box from '@mui/material/Box';
import { OrderTable } from "./OrderTable";
import { FindOrder } from './FindOrder';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

export const Orders = () => {
    return (
        <Box m={2} >
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={5}>
                <Typography variant="h6">
                    Looking for an order based on Tracking Number?
                </Typography>
                <Button variant="outlined" startIcon={<SearchIcon />}>
                    Find Order
                </Button>
            </Stack>
            <span style={{margin:5}}></span>
            <OrderTable />
        </Box>
    );
    
}