import {Box, Paper} from '@mui/material';
import React, {FC, useMemo} from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams} from "@mui/x-data-grid";
import {ProductData} from "../../models/product-data";
import {useSelector} from "react-redux";
import {userDataSelector, catalogSelector} from "../../redux/store";
import {UserData} from "../../models/common/user-data";
import {Delete, Visibility} from "@mui/icons-material";

function getRows(products: ProductData[]): GridRowsProp {
    return products.map(product => product);
}
const ListingPage: FC = () => {
    const userData: UserData = useSelector(userDataSelector);
    const products: ProductData[] = useSelector(catalogSelector);
    console.log(products);
    const rows = useMemo(() => getRows(products), [products]);
    console.log(rows);
    function getColumns(userData: UserData): GridColumns {
        return [
            { field: 'name', headerName: 'Product', flex: 150, align: 'center', headerAlign: 'center' },
            { field: 'categoryName', headerName: 'Category', editable: !!userData.isAdmin, align: 'center', headerAlign: 'center', flex: 120 },
            { field: 'price', headerName: 'Price', flex: 150, align: 'center', headerAlign: 'center' },
            { field: 'unitOfMeasurement', headerName: 'Unit', flex: 150, align: 'center', headerAlign: 'center' },
        ]
    };
    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
        '& .Mui-error': { bgcolor: '#FF9494', color: 'white', width: '100%', height: '100%' } }}>
        <Paper sx={{ width: { xs: '100vw', sm: '80vw'}, height: '80vh', marginTop: '2vh' }}>
            <DataGrid rows={rows} columns={getColumns(userData)}/>
        </Paper>
    </Box>
};

export default ListingPage;


