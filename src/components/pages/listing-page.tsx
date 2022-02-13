import {Box, Grid, Paper} from '@mui/material';
import React, {FC, useMemo} from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams} from "@mui/x-data-grid";
import {ProductData} from "../../models/product-data";
import {useSelector} from "react-redux";
import {userDataSelector, catalogSelector} from "../../redux/store";
import {UserData} from "../../models/common/user-data";
import {ShoppingBasket, ShoppingCart, Visibility} from "@mui/icons-material";
import Badge from "@mui/material/Badge";

function getRows(products: ProductData[]): GridRowsProp {
    return products.map(product => product);
}

const ListingPage: FC = () => {
    const [count, setCount] = React.useState(1);

    const userData: UserData = useSelector(userDataSelector);
    const products: ProductData[] = useSelector(catalogSelector);
    console.log(products);
    const rows = useMemo(() => getRows(products), [products]);
    console.log(rows);

    function getColumns(userData: UserData): GridColumns {
        return [
            {
                field: "imageUrl",
                headerName: "Image",
                flex: 50, align: 'center', headerAlign: 'center',
                renderCell: (params) => <img src={params.value} height={50}/>
            },
            {field: 'name', headerName: 'Product', flex: 350, align: 'center', headerAlign: 'center'},
            {field: 'categoryName', headerName: 'Category', align: 'center', headerAlign: 'center', flex: 150},
            {field: 'price', headerName: 'Price', flex: 50, align: 'center', headerAlign: 'center'},
            {field: 'unitOfMeasurement', headerName: 'Unit', flex: 50, align: 'center', headerAlign: 'center'},
            {
                field: 'actions', type: 'actions', width: 100, getActions: (params: GridRowParams) => {
                    const actionItems = [
                        <GridActionsCellItem icon={<Visibility/>} label='Details'
                            // onClick={() => showDetails(params.id as number)}
                        />];

                    actionItems.push(<GridActionsCellItem icon={
                        <Badge color="secondary" badgeContent={count}>
                            <ShoppingCart/>
                        </Badge>
                    } label='Basket' onClick={() => {
                        badgeHandler();
                    }}
                    />)

                    return actionItems;
                }

            }
        ]
    }

    function badgeHandler() {
        if (count == 0) {
            setCount(count + 1);
        } else {
            setCount(Math.max(count - 1, 0));
        }
    }

    return <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        '& .Mui-error': {bgcolor: '#FF9494', color: 'white', width: '100%', height: '100%'}
    }}>
        <Paper sx={{width: {xs: '100vw', sm: '80vw'}, height: '80vh', marginTop: '2vh'}}>
            <DataGrid getRowId={(row) => row.productId} rows={rows} columns={getColumns(userData)}/>
        </Paper>
    </Box>
};

export default ListingPage;


