// Most of the code comes from https://mui.com/components/modal/
// It essentially is just the popup that comes up
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CheckoutView } from "./CheckoutView"

// Types for the prop
export interface CheckoutProp {
    onCheckout: () => Promise<void>;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #1976d2',
    boxShadow: 24,
    p: 4,
};


export const CheckoutModal = (props: CheckoutProp) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button
                onClick={handleOpen}
                variant="contained"
                color="success"
                sx={{
                    width: "60%",
                    marginLeft: "20%"
                }}
            >
                <ShoppingCartIcon />
                Checkout
            </Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <CheckoutView onCheckout={props.onCheckout}></CheckoutView> {/* Inside here is the view of our checkout screen */}
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}