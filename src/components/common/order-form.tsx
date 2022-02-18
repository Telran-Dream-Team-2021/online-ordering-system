import * as React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    MenuItem,
    FormControl,
    Button,
    Grid, Paper, styled, Stack, TextField, Avatar, ButtonGroup
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {OrderData, statuses} from "../../models/order-data";
import {FC, useRef, useState} from "react";
import {orders} from "../../config/services-config";
import {ConfirmationDataType, initialConfirmationData} from "../../models/common/confirmation-data-type";
import ConfirmDialog from "./confirm-dialog";
import {LocalizationProvider, DesktopDatePicker} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
    DataGrid,
    GridColDef,
    GridRowsProp
} from "@mui/x-data-grid";
import Quantity from "./quantity-form";
import {ItemData} from "../../models/item-data";
import _ from 'lodash'
import {catalogSelector, userDataSelector} from "../../redux/store";
import {useSelector} from "react-redux";
import {ProductData} from "../../models/product-data";
import {getTotalSum} from "../../utils/calculatign";


const OrderForm: FC<{ order: OrderData }> = (props) =>{
    const {order} = props
    const [itemsState, setItemsState] = useState<ItemData[]>(_.cloneDeep(order.orderItems))
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
    const confirmationData = useRef<ConfirmationDataType>(initialConfirmationData);
    const userState = useSelector(userDataSelector)
    const products: ProductData[] = useSelector(catalogSelector);
    const handleStatusChange = (event: SelectChangeEvent) => {
        const oldValue = order.status
        const newOrder = {...order, status: event.target.value}
        onEdit(oldValue, event.target.value, newOrder)
    }

    const handleSetItemsState = ()=>{
        setItemsState([...itemsState])
    }

    const handleDeliveryDateChange = (newValue: Date | null) => {
        const oldValue = new Date(order.deliveryDate).toLocaleDateString()
        const newOrder: OrderData = {...order, deliveryDate: new Date(newValue!)}
        onEdit(oldValue, newValue!.toLocaleDateString(), newOrder)
    };

    const handleLastEditionDateChange = (newValue: Date | null) => {
        const oldValue = new Date(order.lastEditionDate).toLocaleDateString()
        const newOrder: OrderData = {...order, lastEditionDate: new Date(newValue!)}
        onEdit(oldValue, newValue!.toLocaleDateString(), newOrder)
    };

    const onEdit = (oldValue: any, newValue: any, newOrder: OrderData)=>{

        confirmationData.current.title="Update Confirmation";
        confirmationData.current.message = `Old value is "${oldValue}", 
            new value is "${newValue}".
            Confirm the change?`;

        confirmationData.current.handler = (status)=> {
            if (status){
                orders.updateOrder!(newOrder.orderId, newOrder);
                setItemsState(_.cloneDeep(newOrder.orderItems))
            }
            setConfirmOpen(false);
        }
        setConfirmOpen(true);
    }

    const onRemoveItem =(item: ItemData)=>{
        confirmationData.current.title="Remove item";
        confirmationData.current.message = `Do you wanna remove ${item.productId}?`;
        const newOrder: OrderData = {...order, orderItems: itemsState.filter(i=>i.productId!==item.productId)}
        confirmationData.current.handler = (status)=> {
            if (status){
                orders.updateOrder(newOrder.orderId, newOrder).then()
                setItemsState(_.cloneDeep(newOrder.orderItems))
            }
            setConfirmOpen(false);
        }
        setConfirmOpen(true);
    }

    const onEditQuantityOfItems = (items: ItemData[])=>{
        confirmationData.current.title="Updating order";
        const newOrder: OrderData = {...order, orderItems: items.filter(item=>item.quantity>0)}
        confirmationData.current.message = `Old total sum is ${getTotalSum(order.orderItems)}$,
            New total sum is ${getTotalSum(itemsState)}$.
            Confirm the change`
        confirmationData.current.handler = (status)=> {
            if (status){
                orders.updateOrder(newOrder.orderId, newOrder).then()
                setItemsState(_.cloneDeep(newOrder.orderItems))
            }
            setConfirmOpen(false);
        }
        setConfirmOpen(true);
    }


    const getColumns = (): GridColDef[] =>{
        console.log(order)
        console.log(`last = ${new Date(order.lastEditionDate)}> now = ${(new Date())}`)

        console.log(new Date(order.lastEditionDate)>=(new Date()))
        return [
            // { field: 'id', headerName: 'Id', width: 150, align: 'center', headerAlign: 'center' },
            { field: 'photo', headerName: 'Photo', width: 150, align: 'center', headerAlign: 'center', renderCell: (params)=> <Avatar
                    alt="Remy Sharp"
                    src={params.value}
                    sx={{ width: 56, height: 56 }}
                />},
            { field: 'productName', headerName: 'Name', width: 150, align: 'center', headerAlign: 'center' },
            { field: 'quantity', headerName: 'Qty', width: 150, align: 'center', headerAlign: 'center', renderCell: (params)=> {
                    return !userState.isAdmin && new Date(order.lastEditionDate)>=(new Date()) ?<Quantity item={params.value.item} setItemsStateFn={handleSetItemsState}/> : <div>{params.value.item.quantity}</div>
                }},
            { field: 'price', headerName: 'Price ($)', width: 150, align: 'center', headerAlign: 'center' },
            { field: 'totalSum', headerName: 'Total ($)', width: 150, align: 'center', headerAlign: 'center' },
            { field: 'removing', headerName: '', width: 50, align: 'center', headerAlign: 'center', renderCell: (params)=>{
                return !userState.isAdmin && new Date(order.lastEditionDate)>=(new Date())?
                    <Button onClick={() => onRemoveItem(params.value)}>
                        <CloseRoundedIcon/>
                    </Button>
                        :
                    <div></div>
                }}
        ]
    }
    function getRows(): GridRowsProp{
        return itemsState.map(item=>{
            return {
                id: item.productId,
                photo: products.find(p=>p.productId===item.productId)!.imageUrl,
                productName: products.find(p=>p.productId===item.productId)!.name,
                quantity: {item, handleSetItemsState},
                price: parseFloat(item.pricePerUnit.toFixed(2)),
                totalSum: parseFloat((item.quantity*item.pricePerUnit).toFixed(2)),
                removing: item
            }
        })
    }



    function getStatuses(){
        return Object.values(statuses).filter(s=>s!=order.status && typeof s!=="number").map(status=>(
            <MenuItem key={status} value={status}>{status}</MenuItem>
        ))
    }
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <div >
            <Accordion sx={{mt: 2, p: 0}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id={order.orderId.toString()}
                >
                    <Grid container spacing={6}>
                        <Grid item md={3}>
                            <Item>
                                <Typography>{order.orderId}</Typography>
                            </Item>
                            <Item>
                                <Typography fontSize={12}>Address: {order.deliveryAddress}</Typography>
                            </Item>
                        </Grid>
                        <Grid item md={2}>
                            <Item>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack component="form" noValidate>
                                        {userState.isAdmin ?
                                            <DesktopDatePicker
                                                inputFormat="MM/dd/yyyy"
                                                value={order.lastEditionDate}
                                                onChange={handleLastEditionDateChange}
                                                renderInput={(params) => <TextField {...params} />}
                                            /> :
                                            <div>{new Date(order.lastEditionDate).toLocaleDateString()}</div>
                                        }
                                    </Stack>

                                </LocalizationProvider>
                            </Item>
                        </Grid>
                        <Grid item md={2}>
                            <Item>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack component="form" noValidate>
                                        {userState.isAdmin ?
                                            <DesktopDatePicker
                                                inputFormat="MM/dd/yyyy"
                                                value={order.deliveryDate}
                                                onChange={handleDeliveryDateChange}
                                                renderInput={(params) => <TextField {...params} />}
                                            /> :
                                            <div>{new Date(order.deliveryDate).toLocaleDateString()}</div>
                                        }
                                    </Stack>
                                </LocalizationProvider>
                            </Item>
                        </Grid>
                        <Grid item md={3}>
                            <Item>
                                <FormControl sx={{ minWidth: 120 }}>
                                    {userState.isAdmin ? <Select
                                        defaultValue={order.status}
                                        onChange={handleStatusChange}
                                        sx={{height: 40, fontSize: 16}}
                                    >
                                        <MenuItem defaultChecked={true} value={order.status}>
                                            {order.status}
                                        </MenuItem>
                                        {getStatuses()}
                                    </Select> :
                                    <div>{order.status}</div>
                                    }

                            </FormControl>
                            </Item>
                        </Grid>
                        <Grid item md={2}>
                            <Item>${getTotalSum(itemsState)}</Item>
                        </Grid>
                    </Grid>

                </AccordionSummary>
                <AccordionDetails>
                    <div style={{ height: 300, width: '100%' }}>
                        <DataGrid
                            rows={getRows()}
                            columns={getColumns()}
                        />

                    </div>
                    {!_.isEqual(itemsState, order.orderItems) &&
                        <ButtonGroup>
                            <Button onClick={()=>onEditQuantityOfItems(itemsState)}>Update order</Button>
                            <Button onClick={()=>setItemsState(_.cloneDeep(order.orderItems))}>Reset</Button>
                        </ButtonGroup>}
                </AccordionDetails>
            </Accordion>
            <ConfirmDialog data={confirmationData.current} open={confirmOpen} />
        </div>
    );
}

export default OrderForm
