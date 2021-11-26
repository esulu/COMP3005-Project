
import Box from '@mui/material/Box';
import { OrderTable } from "./OrderTable";
import { FindOrder } from './FindOrder';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { Modal, Typography } from '@mui/material';
import { useState } from 'react';


export const Orders = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
        <>
            <Box m={2} >
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={5}>
                    <Typography variant="h6">
                        Looking for an order based on Tracking Number?
                    </Typography>
                    <Button variant="outlined" startIcon={<SearchIcon />} onClick={handleOpen}>
                        Find Order
                    </Button>
                </Stack>
                <span style={{ margin: 5 }}></span>
                <OrderTable />
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '2px solid #1976d2',
                    boxShadow: 24,
                    p: 4,
                    background: 'white'
                }}>
                   <FindOrder />
                </Box>
            </Modal>
        </>
    );

}