import React, {useEffect} from 'react';
import {setOrders} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {orders} from "../../config/services-config";
import {Subscription} from "rxjs";
import {ordersSelector} from "../../redux/store";
import {Container, Grid, SxProps, Typography} from "@mui/material";
import OrderForm from "../common/order-form";
import LocalShippingSharpIcon from '@mui/icons-material/LocalShippingSharp';
import TablePaginationForm from "../common/table-pagination-form";

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
                    dispatch(setOrders(arr))
                },
                error() {
                    setTimeout(() => { subscription = getData() }, 2000);
                }

            })
        }

        return () => subscription.unsubscribe();
    }, [])

    const styleTypography: SxProps = {
        color: 'primary.main',
        fontWeight: 'bold',
        textAlign: 'center'
    }

    function getColumns(){
        return <Grid container sx={{p:1, backgroundColor: 'primary.light', mt: '20px'}} >
                <Grid md={3}>
                    <Typography sx={styleTypography}>Order id / address</Typography>
                </Grid>
                <Grid md={2}>
                    <Typography sx={styleTypography}>Can edit</Typography>
                </Grid>
                <Grid md={2}>
                    <Typography sx={styleTypography}>Will arrive</Typography>
                </Grid>
                <Grid md={3}>
                    <Typography sx={styleTypography}>
                        Status
                    </Typography>
                </Grid>
                <Grid md={2}>
                    <Typography sx={styleTypography}>Total $</Typography>
                </Grid>
            </Grid>
    }

    function getAccordions(){
        return ordersState.map(order=><OrderForm key={order.orderId} order={order}/>)
    }

    return (
        <Container>
            <Typography
                variant={'h2'}
                color={'primary'}
                fontWeight={'500'}
                letterSpacing={'10px'}
            mt={"80px"}>
                Orders
                <LocalShippingSharpIcon sx={{fontSize: '60px', ml: "20px", mb: '-15px'}}/>
            </Typography>
            {getColumns()}
            <TablePaginationForm data={getAccordions()}/>
        </Container>
    );
};

export default OrdersPage;