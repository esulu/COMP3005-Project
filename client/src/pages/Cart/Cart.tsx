import { Fragment, useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import { BookCartView, CheckoutModal, UseToken } from "../../components";
import { Box } from "@mui/system";

// The data we want to retrieve from the cart
interface CartType {
    isbn: string,
    quantity: number
}

export const Cart = () => {
    // Get token to link to the correct cart ID
    const { token } = UseToken();

    // Books in the cart
    const [cart, setCart] = useState<CartType[] | undefined>(undefined);

    // Total value in cart
    let tot = 0;
    const [grandTotal, setGrandTotal] = useState(0);

    // Get the books in the user's cart
    const getCart = async () => {
        try {
            const response = await fetch(`http://localhost:5000/getCart?cart_id=${token}`);
            const jsonData = await response.json();
            setCart(jsonData);
        } catch (error) {
            console.log(error);
        }
    }

    // Update grand total
    const updateTotal = (bookTotal: number) => {
        // TODO: find a better method for this...
        console.log(tot + " | " + grandTotal)
        console.log('update: ' + tot + " + " + bookTotal + " = " + (tot + bookTotal))
        tot += bookTotal; 
        setGrandTotal(grandTotal + tot)
        console.log('total now: ' + tot)
    }

    useEffect(() => {
        getCart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <Typography variant="h4" marginTop="2rem" marginLeft="20%">
                Order Summary
            </Typography>
            <div>
                {cart !== undefined && cart.length > 0 ? (
                    <Stack spacing={2} margin="2rem">
                        {cart && cart.map(item => {
                            return (
                                <div key={`col-${item.isbn}`}>
                                    <Box
                                        marginLeft="20%"
                                        marginRight="20%"
                                        sx={{
                                            width: '60%',
                                            bgcolor: 'background.paper',
                                            border: '2px solid #1976d2',
                                            boxShadow: 24,
                                            p: 4,
                                            background: 'white'
                                        }}>
                                        <BookCartView
                                            ISBN={item.isbn}
                                            quantity={item.quantity}
                                            cart_ID={Number(token)}
                                            onDelete={getCart}
                                            updateTotal={updateTotal}
                                        ></BookCartView>
                                    </Box>
                                </div>
                            );
                        })}
                        <Box>
                            <Typography id="cart-grand-total" variant="h5" marginLeft="20%" sx={{ mt: 2 }}>
                                Grand Total: ${grandTotal.toFixed(2)}
                            </Typography>
                        </Box>
                        <CheckoutModal></CheckoutModal>
                    </Stack>
                ) : (
                    <Typography id="cart-information" marginLeft="20%" sx={{ mt: 2 }}>
                        There doesn't seem to be anything here... Why don't you go shopping?
                    </Typography>
                )}
            </div>
        </Fragment>
    )
}