import React, {FC} from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams, GridColDef} from "@mui/x-data-grid";
import {Avatar} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, catalogSelector} from "../../redux/store";
import {BasketData} from "../../models/basket-data";
import Quantity from "../common/quantity-form";
import {updateBasketAction} from "../../redux/actions";
import {basket} from "../../config/services-config";
import {ProductData} from "../../models/product-data";

const MainGrid: FC<{basketData: BasketData, catalogData: ProductData[]}> = (props) => {
    const {basketData, catalogData} = props;

    const getRows: (basketData: BasketData) => GridRowsProp = () => {

        return basketData.basketItems.map(
            (i) => {
                const imageUrl = catalogData.find(product => product.productId === i.productId)
                return {
                        id: i.productId,
                        col0: imageUrl ? imageUrl : '',
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
            renderCell: (params)=><Quantity item={params.value} setItemsStateFn={()=>{basket.updateBasket(basketData.userId, basketData)}}/>},
        {field: 'col3', headerName: 'Price per unit', width: 150},
        {field: 'col4', headerName: 'Price', width: 150},
    ];

    return (
        <div style={{height: 300, width: '100%'}}>
            <DataGrid rows={getRows(basketData)}  columns={columns}
                      pageSize={5}/>
        </div>
    );
};

export default MainGrid;