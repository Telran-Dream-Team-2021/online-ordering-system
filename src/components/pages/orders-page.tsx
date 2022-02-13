import React, {useEffect, useState} from 'react';
import AddOrderForm from "../add-order-form";
import {addOrderAction, setOrders} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {orders} from "../../config/services-config";
import {OrderData} from "../../models/order-data";
import {DataGrid, GridColDef, GridRowsProp, GridValueGetterParams} from "@mui/x-data-grid";
import {Subscription} from "rxjs";
import firebase from "firebase/compat";
import {Timestamp} from "firebase/firestore";
import {ordersSelector} from "../../redux/store";

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

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'items',
            headerName: 'Items',
            width: 100,
            editable: true,
        },
        {
            field: 'userId',
            headerName: 'User Id',
            width: 100,
            editable: true,
        },
        {
            field: 'deliveryAddress',
            headerName: 'delivery address',
            type: 'string',
            width: 200,
            editable: true,
        },
        {
            field: 'status',
            headerName: 'status',
            type: 'string',
            width: 110,
            editable: true,
        },
        {
            field: 'deliveryDate',
            headerName: 'delivery date',
            type: 'date',
            width: 200,
            editable: true,
        },
        {
            field: 'lastEditionDate',
            headerName: 'last edition date',
            type: 'string',
            width: 200,
            editable: true,
        },
        // {
        //     field: 'fullName',
        //     headerName: 'Full name',
        //     description: 'This column has a value getter and is not sortable.',
        //     sortable: false,
        //     width: 160,
        //     valueGetter: (params: GridValueGetterParams) =>
        //         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        // },
    ];

    function getRows () {
        const res = ordersState.map(order=>{
                console.log(order)
                return {
                    id: order.orderId ,
                    items: order.OrderItems.length ,
                    userId: order.userId ,
                    deliveryAddress: order.deliveryAddress ,
                    status: order.status.toString() ,
                    deliveryDate: new Date(order.deliveryDate).toLocaleDateString(),
                    lastEditionDate: new Date(order.lastEditionDate).toLocaleDateString()
                }
            })
        return res
    }

    return (
        <div>
            <h1>OrdersPage</h1>
            <AddOrderForm addOrderFn={(order)=>dispatch(addOrderAction(order))}></AddOrderForm>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={getRows () }
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </div>
    );
};

export default OrdersPage;