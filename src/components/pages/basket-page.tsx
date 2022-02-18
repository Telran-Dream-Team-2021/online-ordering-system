import React, {useEffect} from 'react';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MainGrid from "../basket/MainGrid";
import SummaryCheckoutBlock from "../basket/SummaryCheckoutBlock";
import {Box, Button, Grid, Paper, styled} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, catalogSelector, userDataSelector} from "../../redux/store";
import {BasketData} from "../../models/basket-data";
import {ProductData} from "../../models/product-data";
import {addOrderAction, removeBasketAction, setBasket, setErrorCode, setOrders} from "../../redux/actions";
import {UserData} from "../../models/common/user-data";
import {basket, orders} from "../../config/services-config";
import {Subscription} from "rxjs";
import ErrorCode from "../../models/common/error-code";


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
    const catalogData = useSelector(catalogSelector);
    const dispatch = useDispatch();

    function removeFromCart() {
        // dispatch(removeBasketItemAction(basketData, 444));
        const res = basket.removeItem(basketData, 444);
        return res.then((bd) => {
            dispatch(setBasket({...bd}));
        })
    }

     const makeOrder = async (_basketData: BasketData) => {
        await dispatch(addOrderAction(_basketData, userData))
         await dispatch(removeBasketAction(_basketData))
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Item><MainGrid basketData={basketData} catalogData={catalogData}/></Item>
                </Grid>
                <Grid item xs={4}>
                    <Item><SummaryCheckoutBlock basket={basketData} userState={userData} makeOrderFn={()=>makeOrder(basketData)}/></Item>
                </Grid>
                <Grid>
                    <Button size="large" onClick={removeFromCart}>Remove</Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BasketPage;