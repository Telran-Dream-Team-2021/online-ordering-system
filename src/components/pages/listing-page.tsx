import {Avatar, Box, Grid, Paper, Tooltip} from '@mui/material';
import React, {FC, useMemo, useRef, useState} from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams} from "@mui/x-data-grid";
import {ProductData} from "../../models/product-data";
import {useDispatch, useSelector} from "react-redux";
import {userDataSelector, catalogSelector, basketSelector} from "../../redux/store";
import {UserData} from "../../models/common/user-data";
import {Visibility} from "@mui/icons-material";
import InfoModal from "../common/info-modal";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import {BasketData} from "../../models/basket-data";
import {addBasketItemAction, removeBasketItemAction, setBasket} from "../../redux/actions";

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
    return products.filter(p => p.isActive);
}

const ListingPage: FC = () => {
    const dispatch = useDispatch();
    const [basket0, setBasket0] = React.useState(new Set());
    const userData: UserData = useSelector(userDataSelector);
    const products: ProductData[] = useSelector(catalogSelector);
    const basket: BasketData = useSelector(basketSelector);
    const rows = useMemo(() => getRows(products), [products]);
    const [modalVisible, setModalVisible] = useState(false);
    const textModal = useRef<string[]>(['']);
    const imgUrlModal = useRef<string>('');

    function getColumns(): GridColumns {
        return [
            {
                field: "imageUrl",
                headerName: "Image",
                flex: 50, align: 'center', headerAlign: 'center',
                renderCell: (params) => <Avatar src={params.value}/>
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
                    actionItems.push(<GridActionsCellItem
                        icon={
                            !isItemInCart(+params.id)
                                ?
                                <AddToShoppingCart/>
                                :
                                <RemoveFromShoppingCart/>
                        }
                        label='Basket'
                        onClick={() => {
                            badgeHandler(params.id as number);
                        }}
                    />)
                    return actionItems;
                }
            }
        ]
    }

    function isItemInCart(itemId: number) {
        return basket.basketItems.find(i => i.productId == itemId) ? true : false;
    }

    function badgeHandler(id: any) {
        const product = products.find(e => e.productId === +id);
        if (isItemInCart(id)) {
            dispatch(removeBasketItemAction(basket, id));
        } else {
            //на тот случай, когда корзины еще нет, насильно записываем в нее юзер айди, чтобы она успешно создалась
            // dispatch(setBasket({...basket, userId: userData.username}));
            dispatch(addBasketItemAction(basket, product!));
            console.log(basket)
        }
    }

    function showDetails(id: number | string) {
        const product = products.find(e => e.productId === +id);
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
            <DataGrid getRowId={(row) => row.productId} rows={rows} columns={getColumns()}/>
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



