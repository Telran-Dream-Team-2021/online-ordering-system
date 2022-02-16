import React, {useEffect, useRef, useState} from 'react';
import AddOrderForm from "../add-order-form";
import {addOrderAction, setOrders} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {orders} from "../../config/services-config";
import {Subscription} from "rxjs";
import {ordersSelector} from "../../redux/store";
import {Box, Container, Grid, Paper, styled, Typography} from "@mui/material";
import OrderForm from "../common/order-form";

const OrdersPage = () => {
    const dispatch = useDispatch()
    const ordersState = useSelector(ordersSelector)
    useEffect(() => {
        let subscription:any;
        subscription = getData();
        function getData(): Subscription {
            subscription && subscription.unsubscribe();
            return orders.getAllOrders().subscribe({

                next(arr) {
                    // handleError(ErrorCode.NO_ERROR);

                    dispatch(setOrders(arr))
                },
                error(err) {
                    // handleError(err);
                    setTimeout(() => { subscription = getData() }, 2000);
                }

            })
        }

        return () => subscription.unsubscribe();
    }, [])

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    function getColumns(){
        return <Container sx={{backgroundColor: "#eaeaea"}}>
            <Grid container spacing={2} sx={{p:1}}>
                <Grid item md={3}>
                    <Item>
                        <Typography>Order id / address</Typography>
                    </Item>
                </Grid>
                <Grid item md={2}>
                    <Item>Can edit</Item>
                </Grid>
                <Grid item md={2}>
                    <Item>Will arrive</Item>
                </Grid>
                <Grid item md={3}>
                    <Item>
                        Status
                    </Item>
                </Grid>
                <Grid item md={2}>
                    <Item>Total $</Item>
                </Grid>

            </Grid>
            {getAccordions()}
        </Container>


    }

    function getAccordions(){
        return ordersState.map(order=><OrderForm key={order.orderId} order={order}/>)
    }

    return (
        <div>
            <h1>OrdersPage</h1>
            <AddOrderForm addOrderFn={(basket)=>dispatch(addOrderAction(basket))}></AddOrderForm>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                '& .Mui-error': { bgcolor: '#FF9494', color: 'white', width: '100%', height: '100%' } }}>
                {getColumns()}
            </Box>
        </div>
    );
};

export default OrdersPage;