import React, {useEffect, useState} from 'react';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MainGrid from "../basket/MainGrid";
import SummaryCheckoutBlock from "../basket/SummaryCheckoutBlock";
import {Box, Button, Grid, Paper, styled} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, userDataSelector} from "../../redux/store";
import {BasketData} from "../../models/basket-data";
import {ProductData} from "../../models/product-data";
import {addOrderAction, removeBasketAction, setBasket, setErrorCode, setOrders} from "../../redux/actions";
import {UserData} from "../../models/common/user-data";
import {basket, orders} from "../../config/services-config";
import UserDataModal from "../common/user-data-modal";
import CustomizedSnackbars from "../common/popup-info";

const BasketPage = () => {
    const [flStep2ModalOpen, setFlStep2ModalOpen] = useState<boolean>(false);
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const basketData: BasketData = useSelector(basketSelector);
    const userData: UserData = useSelector(userDataSelector);
    const dispatch = useDispatch();

    function removeFromCart() {
        // dispatch(removeBasketItemAction(basketData, 444));
        const res = basket.removeItem(basketData, 444);
        return res.then((bd) => {
            dispatch(setBasket({...bd}));
        })
    }

    function addToCart() {
        console.log("startAdd", basketData);
        const product: ProductData = {
            categoryName: "Test",
            description: "Test",
            imageUrl: "http://localhost",
            isActive: false,
            name: "Gavr7",
            price: 7770,
            productId: 444,
            unitOfMeasurement: "kg"
        };
        if (!basketData.userId) {
            basketData.userId = userData.username;
        }
        const res = basket.addItem(basketData, product);
        return res.then((bd) => {
            console.log(bd);
            dispatch(setBasket({...bd}));
        })
        // dispatch(addBasketItemAction(basketData, product));
    }

    const makeOrder = async (_basketData: BasketData) => {
        if (!userData.deliveryAddress) {
            setFlStep2ModalOpen(true);
        } else {
            await dispatch(addOrderAction(_basketData, userData))
            await dispatch(removeBasketAction(_basketData))
            handleState();
        }
    }
    const [open, setOpen] = React.useState(false);

    function handleState() {
        setOpen(!open)
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2}>
                {<UserDataModal onClose={() => setFlStep2ModalOpen(false)} open={flStep2ModalOpen}/>}
                <Grid item xs={1}>
                    <ShoppingBasketIcon/>
                </Grid>
                <Grid item xs={4}>
                    <Item>Shopping Cart</Item>
                </Grid>
                <Grid item xs={8}>
                    <Item><MainGrid/></Item>
                </Grid>
                <Grid item xs={4}>
                    <Item><SummaryCheckoutBlock makeOrderFn={() => makeOrder(basketData)}/></Item>
                </Grid>
                <Grid>
                    <Button size="large" onClick={addToCart}>Add to cart</Button>
                    <Button size="large" onClick={removeFromCart}>Remove</Button>
                </Grid>
                <CustomizedSnackbars  message={`Order has been created!`} open={open} handleState={handleState}/>
            </Grid>
        </Box>
    );
};

export default BasketPage;