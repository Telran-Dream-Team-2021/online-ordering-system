import React, {useEffect, useState} from 'react';
import MainGrid from "../basket/MainGrid";
import SummaryCheckoutBlock from "../basket/SummaryCheckoutBlock";
import {Box, Button, Grid, Paper, styled} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, catalogSelector, userDataSelector} from "../../redux/store";
import {BasketData} from "../../models/basket-data";
import {addOrderAction, removeBasketAction, setBasket, setErrorCode, setOrders} from "../../redux/actions";
import {UserData} from "../../models/common/user-data";
import UserDataModal from "../common/user-data-modal";
import CustomizedSnackbars from "../common/popup-info";
import {PATH_ORDERS} from "../../config/routes-config";
import {useNavigate} from "react-router-dom";

const BasketPage = () => {
    const [flStep2ModalOpen, setFlStep2ModalOpen] = useState<boolean>(false);
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
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
        <Box
            sx={{
                gap:0,
                alignSelf:'center',
                padding: '0',
                margin:'5px',
                width: '85%',
                height: '140px',
                '& > .MuiBox-root > .MuiBox-root': {
                    p: 0,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: '700',
                },
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 0,
                    gridTemplateRows: 'auto',
                    gridTemplateAreas: `"header header header header"
        "main main main sidebar"`,
                }}
            >
                <Box sx={{
                    gridArea: 'header',
                    textAlign: 'center',
                    display: 'flex',
                    gap:0,
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <h2>Shopping Cart
                        details</h2></Box>
                <Box sx={{gridArea: 'main'}}>
                    <MainGrid basketData={basketData}
                              catalogData={catalogData}/></Box>
                <Box sx={{gridArea: 'sidebar', justifyContent: 'center', alignItems: 'center'}}>
                    <SummaryCheckoutBlock
                        basket={basketData} userState={userData}
                        makeOrderFn={() => makeOrder(basketData)}/></Box>
            </Box>
            {<UserDataModal onClose={async () => {
                setFlStep2ModalOpen(false);
                await makeOrder(basketData);
            }} open={flStep2ModalOpen}/>}
            <CustomizedSnackbars message={`Order has been created!`} open={open} handleState={handleState}/>
        </Box>
    );
};
export default BasketPage;