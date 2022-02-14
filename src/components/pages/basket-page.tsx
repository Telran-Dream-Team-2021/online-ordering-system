import React, {useEffect} from 'react';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MainGrid from "../common/UI/basket/MainGrid";
import SummaryCheckoutBlock from "../common/UI/basket/SummaryCheckoutBlock";
import {Box, Button, Grid, Paper, styled} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, userDataSelector} from "../../redux/store";
import {BasketData} from "../../models/basket-data";
import {ProductData} from "../../models/product-data";
import {addBasketItemAction} from "../../redux/actions";
import {UserData} from "../../models/common/user-data";

const BasketPage = () => {
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


    function addToCart() {
        const product: ProductData = {
            categoryName: "Test",
            description: "Test",
            imageUrl: "http://localhost",
            isActive: false,
            name: "Gavr",
            price: 7770,
            productId: 444,
            unitOfMeasurement: "kg"
        };
        if (!basketData.userId) {
            basketData.userId = userData.username;
        }
        dispatch(addBasketItemAction(basketData, product));
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2}>
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
                    <Item><SummaryCheckoutBlock/></Item>
                </Grid>
                <Grid>
                    <Button size="large" onClick={addToCart}>Add to cart</Button>
                </Grid>
            </Grid>
            {JSON.stringify(basketData)}
        </Box>
    );
};

export default BasketPage;