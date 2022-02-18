import React, {useEffect, useState} from 'react';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MainGrid from "../basket/MainGrid";
import SummaryCheckoutBlock from "../basket/SummaryCheckoutBlock";
import {Box, Button, Grid, Paper, styled} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, catalogSelector, userDataSelector} from "../../redux/store";
import {BasketData} from "../../models/basket-data";
import {addOrderAction, removeBasketAction, setBasket, setErrorCode, setOrders} from "../../redux/actions";
import {UserData} from "../../models/common/user-data";
import {basket, orders} from "../../config/services-config";
import UserDataModal from "../common/user-data-modal";
import CustomizedSnackbars from "../common/popup-info";
import {PATH_ORDERS} from "../../config/routes-config";
import {useNavigate} from "react-router-dom";

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
    const catalogData = useSelector(catalogSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const makeOrder = async (_basketData: BasketData) => {
        if (!userData.deliveryAddress) {
            setFlStep2ModalOpen(true);
        } else {
            await dispatch(addOrderAction(_basketData, userData))
            await dispatch(removeBasketAction(_basketData))
            handleState();
            setTimeout(() => {
                navigate(PATH_ORDERS);
            }, 3000);
        }
    }
    const [open, setOpen] = React.useState(false);

    function handleState() {
        setOpen(!open)
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={0}
                  direction="row"
                  justifyContent="center"
                  alignItems="center">
                {<UserDataModal onClose={() => {
                    setFlStep2ModalOpen(false);
                    makeOrder(basketData)
                }} open={flStep2ModalOpen}/>}
                <Grid item xs={1}>
                    <ShoppingBasketIcon/>
                </Grid>
                <Grid item xs={4}>
                    <Item>Shopping Cart</Item>
                </Grid>
                <Grid item xs={8}>
                    <Item><MainGrid basketData={basketData} catalogData={catalogData}/></Item>
                </Grid>
                <Grid item xs={4}>
                    <Item><SummaryCheckoutBlock basket={basketData} userState={userData}
                                                makeOrderFn={() => makeOrder(basketData)}/></Item>
                </Grid>
                <CustomizedSnackbars message={`Order has been created!`} open={open} handleState={handleState}/>
            </Grid>
        </Box>
    );
};

export default BasketPage;