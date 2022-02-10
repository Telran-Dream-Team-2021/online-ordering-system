import React, {useEffect, useState, FC, useMemo, useRef} from 'react';
import {catalog} from "../../config/services-config";
import {ProductData} from "../../models/product-data";
import {useDispatch, useSelector} from "react-redux";
import {catalogSelector, userDataSelector} from "../../redux/store";
import {UserData} from "../../models/common/user-data";
import {Avatar, Box, Paper} from '@mui/material';
import {DataGrid, GridColumns, GridRowsProp} from "@mui/x-data-grid";


function getRows(assortment: ProductData[]): GridRowsProp {
    return assortment;
}

const AssortmentPage: FC = () => {
    const dispatch = useDispatch();
    const userData: UserData = useSelector(userDataSelector);
    const assortment: ProductData[] = useSelector(catalogSelector);
    console.log(assortment);
    const rows = useMemo(() => {
        return getRows(assortment);
    }, [assortment]);
    const columns = useRef<GridColumns>(getColumns());

    function getColumns(): GridColumns {
        return [
            {field: 'imageUrl', headerName: 'Image', flex: 1, renderCell: params => {
                    return <Avatar
                        src={params.value}
                        sx={{ width: 24, height: 24 }}
                    />
                }
            },
            {field: 'productId', headerName: 'Product ID', flex: 1},
            {field: 'categoryName', headerName: 'Category', flex: 2},
            {field: 'name', headerName: 'Product name', flex: 3},

        ]
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& .Mui-error': { bgcolor: '#FF9494', color: 'white', width: '100%', height: '100%' }
                }}
        >
            <Paper
                sx={{
                    width: { xs: '100vw', sm: '80vw'},
                    height: '80vh', marginTop: '2vh'
                    }}
            >
                <DataGrid rows={rows} getRowId={(row) => row.productId} columns={columns.current} />
            </Paper>
        </Box>
    );
};

export default AssortmentPage;