import React from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams, GridColDef} from "@mui/x-data-grid";
import {Avatar} from "@mui/material";
import {useSelector} from "react-redux";
import {basketSelector, catalogSelector} from "../../redux/store";
import {BasketData} from "../../models/basket-data";

const MainGrid = () => {

    const basketData = useSelector(basketSelector);
    const catalogData = useSelector(catalogSelector);

    console.log(basketData)
    const getRows: (basketData: BasketData) => GridRowsProp = () => {

        return basketData.basketItems.map(
            (i, row) => {
                const prd = catalogData.find(product => product.productId === i.productId)
                return {
                        id: row, col0: prd!.imageUrl ? prd!.imageUrl : '',
                        col1: catalogData.find(p => p.productId === i.productId)!.name,
                        col2: i.quantity,
                        col3: i.pricePerUnit,
                        col4: i.quantity * i.pricePerUnit
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
        {field: 'col1', headerName: 'Product', width: 200},
        {field: 'col2', headerName: 'Qty', width: 200},
        {field: 'col3', headerName: 'Price per unit', width: 200},
        {field: 'col4', headerName: 'Price', width: 200},
    ];

    return (
        <div style={{height: 300, width: '100%'}}>
            <DataGrid rows={getRows(basketData)}  columns={columns} checkboxSelection
                      pageSize={5}/>
            {/*getRowId={this.getRowId}*/}
        </div>
    );
};

export default MainGrid;