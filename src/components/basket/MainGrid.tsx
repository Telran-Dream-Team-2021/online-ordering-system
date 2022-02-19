import React, {FC} from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams, GridColDef} from "@mui/x-data-grid";
import {Avatar} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {BasketData} from "../../models/basket-data";
import Quantity from "../common/quantity-form";
import {updateBasketAction} from "../../redux/actions";
import {ProductData} from "../../models/product-data";

const MainGrid: FC<{basketData: BasketData, catalogData: ProductData[]}> = (props) => {
    const {basketData, catalogData} = props;
    const dispatch = useDispatch()
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
                        col4: (i.quantity * i.pricePerUnit).toFixed(2)
                    }

            }
        )
    }


    const columns: GridColDef[] = [
        {
            field: 'col0', headerName: '', width: 150, renderCell: (params) => {
                return <Avatar
                    alt=""
                    src={params.value}
                    sx={{width: 56, height: 56}}/>
            }
        },
        {field: 'col1', headerName: 'Product', width: 150},
        {field: 'col2', headerName: 'Qty', width: 150,
            renderCell: (params)=><Quantity item={params.value} setItemsStateFn={()=>{dispatch(updateBasketAction(basketData))}}/>},
        {field: 'col3', headerName: 'Price per unit', width: 150},
        {field: 'col4', headerName: 'Price', width: 150},
    ];

    return (
        <div style={{height: '100%', minHeight:'309px', width: '100%'}}>
            <DataGrid autoHeight rows={getRows(basketData)}  columns={columns}
                      pageSize={15}/>
        </div>
    );
};

export default MainGrid;