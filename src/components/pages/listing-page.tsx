import {Box, Grid, Paper, Tooltip} from '@mui/material';
import React, {FC, useMemo, useRef, useState} from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams} from "@mui/x-data-grid";
import {ProductData} from "../../models/product-data";
import {useSelector} from "react-redux";
import {userDataSelector, catalogSelector} from "../../redux/store";
import {UserData} from "../../models/common/user-data";
import {Visibility} from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import InfoModal from "../common/info-modal";
import {ItemData} from "../../models/item-data";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

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
    const [basket, setBasket] = React.useState(new Set());
    const userData: UserData = useSelector(userDataSelector);
    const products: ProductData[] = useSelector(catalogSelector);
    const rows = useMemo(() => getRows(products), [products]);
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
                        <GridActionsCellItem
                            icon={
                                <DetailedInfo/>
                            }
                            label='Details'
                            onClick={() => showDetails(params.id as number)}
                        />];
                    actionItems.push(<GridActionsCellItem icon={
                        !basket.has(params.id)
                            ?
                            <AddToShoppingCart/>
                            :
                            <RemoveFromShoppingCart/>
                    } label='Basket' onClick={() => {
                        badgeHandler(params.id as number);
                    }}
                    />)
                    return actionItems;
                }
            }
        ]
    }

    function badgeHandler(id: any) {
        if (basket.has(id)) {
            console.log("удаляем из корзины " + id);
            basket.delete(id);
            setBasket(new Set(basket));
        } else {
            console.log("добавляем в корзину " + id);
            basket.add(id);
            setBasket(new Set(basket));
        }
        const itemData: ItemData = {pricePerUnit: 0, productId: 0, quantity: 0};
        const product = products.find(e => e.productId === +id);
        if (!!product) {
            itemData.productId = product.productId;
            itemData.pricePerUnit = product.price;
            itemData.quantity = 1;
        }
    }

    function showDetails(id: number | string) {
        const product = products.find(e => e.productId == +id);
        console.log(product);
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

const AddToShoppingCart = () => {
    return (
        <Tooltip
            title="Add to the shopping cart"
        >
            <AddShoppingCartIcon color={"success"}/>
        </Tooltip>
    );
};
const RemoveFromShoppingCart = () => {
    return (
        <Tooltip
            title="Remove from the shopping cart"
        >
            <RemoveShoppingCartIcon color={"error"}/>
        </Tooltip>
    );
};
const DetailedInfo = () => {
    return (
        <Tooltip
            title="Show detailed info"
        >
            <Visibility/>
        </Tooltip>
    );
};

export default ListingPage;



