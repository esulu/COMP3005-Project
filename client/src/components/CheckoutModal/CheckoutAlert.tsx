import { AlertTitle, Alert, IconButton, Collapse } from '@mui/material';
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

export interface AlertProps {
    alertType: any,
    alertDescription: string,
    alertTitle?: string
    isOpen:boolean
}

interface CheckOutAlertSignature {
    alertProps: AlertProps,
    onClose: () => void
}


// similarities comes from https://mui.com/components/alert/
/**
 * A component for peforming alerts specifically for the checkoutview
 * @param props The alertprops defined as in type and a function onclose when the user pressed the close button 
 */
export const CheckoutAlert = (props:CheckOutAlertSignature) => {

    // states
    const [open, setOpen] = useState(true);

    // call callback function each time user closes 
    useEffect(()=> {
        if (!open)
            props.onClose();
    }, [open]);

    return (
        <Collapse in={open}>
            <Alert
                severity={props.alertProps.alertType}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
            >
            {props.alertProps.alertTitle && 
                <AlertTitle>{props.alertProps.alertTitle}</AlertTitle>}
                {props.alertProps.alertDescription}
            </Alert>
        </Collapse>
    )
}