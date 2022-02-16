import React, {useEffect} from 'react';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MainGrid from "../common/UI/basket/MainGrid";
import SummaryCheckoutBlock from "../common/UI/basket/SummaryCheckoutBlock";
import {Box, Button, Grid, Paper, styled} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, userDataSelector} from "../../redux/store";
import {BasketData} from "../../models/basket-data";
import {ProductData} from "../../models/product-data";
import {setBasket} from "../../redux/actions";
import {UserData} from "../../models/common/user-data";
import {basket} from "../../config/services-config";


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
            // console.log(bd);
            dispatch(setBasket({...bd}));
        })
        // dispatch(addBasketItemAction(basketData, product));
    }

    return (
        <div style={{justifyContent: "center", alignItems: "center"}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                <div style={{alignItems: "stretch", width: "50px"}}><ShoppingBasketIcon/></div>
                <div><h1>Shopping Cart</h1></div>
            </div>
            <div>
                <Button size="large" onClick={addToCart}>Add to cart</Button>
                <Button size="large" onClick={removeFromCart}>Remove</Button>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div style={{width: "80%"}}>
                    <MainGrid/>
                </div>
                <div style={{width: "40%"}}>
                    <SummaryCheckoutBlock/>
                </div>
            </div>
            {JSON.stringify(basketData)}
        </div>
    )
        ;
};

export default BasketPage;

