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

export const CheckoutAlert = (props:CheckOutAlertSignature) => {


    const [open, setOpen] = useState(true);

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