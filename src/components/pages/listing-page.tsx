import {Box, Grid, Paper} from '@mui/material';
import React, {FC, useMemo, useRef, useState} from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams} from "@mui/x-data-grid";
import {ProductData} from "../../models/product-data";
import {useSelector} from "react-redux";
import {userDataSelector, catalogSelector} from "../../redux/store";
import {UserData} from "../../models/common/user-data";
import {ShoppingCart, Visibility} from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import InfoModal from "../common/info-modal";

function getInfo(product: ProductData): string[] {
    const res: string[] = [
        `Product ID  : ${product.productId}`,
        `Product Name: ${product.name}`,
        `Category   : ${product.categoryName}`,
        `Price      : ${product.price}`,
        `Unit : ${product.unitOfMeasurement}`,
        `isActive : ${product.isActive}`,
    ];
    return res;
}

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

    const [modalVisible, setModalVisible] = useState(false);

    const textModal = useRef<string[]>(['']);
    const imgUrlModal = useRef<string>('');

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
                                             onClick={() => showDetails(params.id as number)}
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
    };

    function badgeHandler() {
        if (count == 0) {
            setCount(count + 1);
        } else {
            setCount(Math.max(count - 1, 0));
        }
    }

    function showDetails(id: any) {
        const product = products.find(e => e.productId === +id);
        if (!!product) {
            textModal.current = getInfo(product);
            imgUrlModal.current = product.imageUrl;
        } else {
            textModal.current = ["Not found"];
        }
        setModalVisible(true);
    }

    return <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        '& .Mui-error': {bgcolor: '#FF9494', color: 'white', width: '100%', height: '100%'}
    }}>
        <Paper sx={{width: {xs: '100vw', sm: '80vw'}, height: '80vh', marginTop: '2vh'}}>
            <DataGrid getRowId={(row) => row.productId} rows={rows} columns={getColumns(userData)}/>
        </Paper>
        <InfoModal title={"Detailed information about the product"}
                   message={textModal.current} open={modalVisible}
                   onClose={() => setModalVisible(false)}
                   imageUrl={imgUrlModal.current}
        />
    </Box>
};

export default ListingPage;


