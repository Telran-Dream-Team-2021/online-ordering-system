import React, {FC, useRef, useState} from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams, GridColDef} from "@mui/x-data-grid";
import {Avatar, Icon} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {BasketData} from "../../models/basket-data";
import Quantity from "../common/quantity-form";
import {removeBasketLineAction, updateBasketAction} from "../../redux/actions";
import {ProductData} from "../../models/product-data";
import {Delete} from "@mui/icons-material";
import {ConfirmationDataType, initialConfirmationData} from "../../models/common/confirmation-data-type";
import ConfirmDialog from "../common/confirm-dialog";

const MainGrid: FC<{ basketData: BasketData, catalogData: ProductData[] }> = (props) => {
    const {basketData, catalogData} = props;
    const dispatch = useDispatch();
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    function showRemoveConfirmation(id: number): void {
        confirmationData.current.message = `Are you sure you want to remove item with ID '${id}'?`
        confirmationData.current.handler = handleRemove.bind(undefined, id);
        confirmationData.current.title = "Remove Confirmation";
        setConfirmOpen(true);
    }

    function handleRemove(id: number, status: boolean): void {
        if (status) {
            dispatch(removeBasketLineAction(basketData, id));
        }
        setConfirmOpen(false);
    }

    const confirmationData = useRef<ConfirmationDataType>(initialConfirmationData);

    const getRows: (basketData: BasketData) => GridRowsProp = () => {

        return basketData.basketItems.map(
            (i) => {
                const product = catalogData.find(product => product.productId === i.productId)
                return {
                    id: i.productId,
                    col0: product ? product.imageUrl : '',
                    col1: catalogData.find(p => p.productId === i.productId)!.name,
                    col2: i,
                    col3: i.pricePerUnit,
                    col4: (i.quantity * i.pricePerUnit).toFixed(2),
                    actions: i.productId,
                }
            }
        )
    }


    const columns: GridColumns = [
        {
            field: 'col0', headerName: '', width: 150, renderCell: (params) => {
                return <Avatar
                    alt=""
                    src={params.value}
                    sx={{width: 56, height: 56}}/>
            }
        },
        {field: 'col1', headerName: 'Product', width: 150},
        {
            field: 'col2', headerName: 'Qty', width: 150,
            renderCell: (params) => <Quantity item={params.value} setItemsStateFn={() => {
                dispatch(updateBasketAction(basketData))
            }}/>
        },
        {field: 'col3', headerName: 'Price per unit', width: 150},
        {field: 'col4', headerName: 'Price', width: 100},
        {
            field: 'actions', type: 'actions', width: 70, getActions: (params: GridRowParams) => {
                const actionItems = [];
                actionItems.push(<GridActionsCellItem icon={<Delete/>} label='Remove'
                                                      onClick={() => showRemoveConfirmation(params.id as number)}/>)
                return actionItems;
            },
        }
    ]

    return (
        <div style={{height: '100%', minHeight: '309px', width: '100%'}}>
            <DataGrid autoHeight rows={getRows(basketData)} columns={columns}
                      pageSize={15}/>
            <ConfirmDialog data={confirmationData.current} open={confirmOpen}/>
        </div>
    );
};

export default MainGrid;