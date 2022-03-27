import * as React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    MenuItem,
    FormControl,
    Button,
    Grid, Stack, TextField, Avatar, ButtonGroup, SxProps
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
import {useDispatch, useSelector} from "react-redux";
import {ProductData} from "../../models/product-data";
import {getTotalSum} from "../../utils/calculatign";
import {updateOrderAction} from "../../redux/actions";
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';


const OrderForm: FC<{ order: OrderData }> = (props) =>{
    const {order} = props
    const [itemsState, setItemsState] = useState<ItemData[]>(_.cloneDeep(order.orderItems))
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
    const confirmationData = useRef<ConfirmationDataType>(initialConfirmationData);
    const userState = useSelector(userDataSelector)
    const products: ProductData[] = useSelector(catalogSelector);
    const dispatch = useDispatch()


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
                dispatch(updateOrderAction(newOrder.orderId, newOrder))
                setItemsState(_.cloneDeep(newOrder.orderItems))
            }
            setConfirmOpen(false);
        }
        setConfirmOpen(true);
    }

    const onRemoveItem =(item: ItemData)=>{
        const newOrder: OrderData = {...order, orderItems: itemsState.filter(i=>i.productId!==item.productId)}
        setItemsState(_.cloneDeep(newOrder.orderItems))
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
            { field: 'photo', headerName: 'Photo', flex: .5, align: 'center', headerAlign: 'center', renderCell: (params)=> <Avatar
                    alt="Remy Sharp"
                    src={params.value}
                    sx={{ width: 45, height: 45 }}
                />},
            { field: 'productName', headerName: 'Name', flex: 1.5, align: 'center', headerAlign: 'center' },
            { field: 'quantity', headerName: 'Qty', flex: .6, align: 'center', headerAlign: 'center', renderCell: (params)=> {
                    return !userState.isAdmin && new Date(order.lastEditionDate)>=(new Date()) ?<Quantity item={params.value.item} setItemsStateFn={handleSetItemsState}/> : <div>{params.value.item.quantity}</div>
                }},
            { field: 'price', headerName: 'Price ($)', flex: .8, align: 'center', headerAlign: 'center' },
            { field: 'totalSum', headerName: 'Total ($)', flex: .8, align: 'center', headerAlign: 'center' },
            { field: 'removing', headerName: '', flex: .25, align: 'center', headerAlign: 'center', renderCell: (params)=>{
                return !userState.isAdmin && new Date(order.lastEditionDate)>=(new Date())?
                    <Button onClick={() => onRemoveItem(params.value)}>
                        <CloseRoundedIcon/>
                    </Button>
                        :
                    ""
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

    const getBgColor = ()=>{
        let res
        switch (order.status) {
            case statuses[statuses.created]: res = "#F2F5FF"; break;
            case statuses[statuses.inProgress]: res = "#FFF5EC"; break;
            case statuses[statuses.shipped]: res = "#E3FFFF"; break;
            case statuses[statuses.delivered]: res = "#EAFFE8"; break;
            case statuses[statuses.cancelled]: res = "#FFE5E8"; break;
        }
        return res
    }
    const styleSummary: ()=>SxProps = () => ({
        backgroundColor: getBgColor()
    })
    const styleTypography: SxProps = {
        color: 'primary.main',
        fontWeight: 'bold',
        textAlign: 'center'
    }

    return (
            <Accordion sx={{mt: 2, p: 0}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={order.orderId as string}
                    sx={styleSummary()}
                >
                    <Grid container spacing={6}>
                        <Grid item md={3}>
                            <Typography sx={styleTypography}>{order.orderId}</Typography>
                            <Typography sx={{color: 'primary.main', fontSize: '12px'}}><b>Address:</b> {order.deliveryAddress}</Typography>
                        </Grid>
                        <Grid item md={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack component="form" noValidate>
                                        {userState.isAdmin ?
                                            <DesktopDatePicker
                                                inputFormat="MM/dd/yyyy"
                                                value={order.lastEditionDate}
                                                onChange={handleLastEditionDateChange}
                                                renderInput={(params) => <TextField {...params} required/>}
                                               /> :
                                            <Typography sx={styleTypography}>{new Date(order.lastEditionDate).toLocaleDateString()}</Typography>
                                        }
                                    </Stack>
                                </LocalizationProvider>
                        </Grid>
                        <Grid item md={2} >

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack component="form" noValidate>
                                        {userState.isAdmin ?
                                            <DesktopDatePicker
                                                inputFormat="MM/dd/yyyy"
                                                value={order.deliveryDate}
                                                onChange={handleDeliveryDateChange}
                                                renderInput={(params) => <TextField {...params} />}
                                            /> :
                                            <Typography sx={styleTypography}>{new Date(order.deliveryDate).toLocaleDateString()}</Typography>
                                        }
                                    </Stack>
                                </LocalizationProvider>
                        </Grid>
                        <Grid item md={3}>
                                    {userState.isAdmin ?
                                        <FormControl sx={{ minWidth: 120, display: 'flex', justifyContent: 'center' }}>
                                            <Select
                                                defaultValue={order.status}
                                                onChange={handleStatusChange}
                                                sx={{height: 50, fontSize: 16}}
                                            >
                                                <MenuItem defaultChecked={true} value={order.status}>
                                                    {order.status}
                                                </MenuItem>
                                                {getStatuses()}
                                            </Select>
                                        </FormControl>:
                                            <Typography sx={styleTypography}>{order.status}</Typography>
                                    }
                        </Grid>
                        <Grid item md={2}>
                            <Typography sx={styleTypography}>${getTotalSum(itemsState)}</Typography>
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
                        <ButtonGroup sx={{m: '10px'}} variant={"text"}>
                            <Button onClick={()=>onEditQuantityOfItems(itemsState)}>Update order</Button>
                            <Button onClick={()=>setItemsState(_.cloneDeep(order.orderItems))}>Reset</Button>
                        </ButtonGroup>}
                    {userState.isAdmin?"":
                        <div>
                            {order.status != statuses[statuses.cancelled] ? <Button
                                    disabled={(new Date()) > new Date(order.lastEditionDate)}
                                    sx={{float: "right", m: "15px", fontWeight: '600', p: "10px"}}
                                    style={{borderRadius: 5, backgroundColor: "#FFE5E8"}}
                                    endIcon={<CloseRoundedIcon/>}
                                    onClick={() => {
                                        const newOrder = {...order, status: statuses[statuses.cancelled]}
                                        onEdit(order.status, statuses[statuses.cancelled], newOrder)
                                    }}
                                >Cancel order</Button> :
                                <Button
                                    disabled={(new Date()) > new Date(order.lastEditionDate)}
                                    sx={{float: "right", m: "15px", fontWeight: '600', p: "10px"}}
                                    style={{borderRadius: 5, backgroundColor: "#EAFFE8"}}
                                    endIcon={<BackupOutlinedIcon/>}
                                    onClick={() => {
                                        const newOrder = {...order, status: statuses[statuses.created]}
                                        onEdit(order.status, statuses[statuses.created], newOrder)
                                    }}
                                >Return order</Button>
                            }
                        </div>
                    }
                </AccordionDetails>
                <ConfirmDialog data={confirmationData.current} open={confirmOpen} />
            </Accordion>
    );
}

export default OrderForm
