import {Avatar, Box, Paper, Tooltip} from '@mui/material';
import React, {FC, useMemo, useRef, useState} from 'react';
import {DataGrid, GridActionsCellItem, GridColumns, GridRowParams, GridRowsProp} from "@mui/x-data-grid";
import {ProductData} from "../../models/product-data";
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, catalogSelector, userDataSelector} from "../../redux/store";
import {UserData} from "../../models/common/user-data";
import {Visibility} from "@mui/icons-material";
import InfoModal from "../common/info-modal";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import {BasketData} from "../../models/basket-data";
import {addBasketItemAction, removeBasketLineAction} from "../../redux/actions";
import {PATH_LOGIN} from "../../config/routes-config";
import {Navigate} from "react-router-dom";

function getInfo(product: ProductData): string[] {
    return [
        `Product ID  : ${product.productId}`,
        `Product Name: ${product.name}`,
        `Category   : ${product.categoryName}`,
        `Price      : ${product.price}`,
        `Unit : ${product.unitOfMeasurement}`,
        `Description : ${product.description}`,
    ];
}

function getRows(products: ProductData[]): GridRowsProp {
    return products.filter(p => p.isActive);
}

const ListingPage: FC = () => {
    const [flNavigate, setFlNavigate] = useState<boolean>(false);
    const dispatch = useDispatch();
    const basket: BasketData = useSelector(basketSelector);
    const userData: UserData = useSelector(userDataSelector);
    const products: ProductData[] = useSelector(catalogSelector);
    const rows = useMemo(() => getRows(products), [products]);
    const [modalVisible, setModalVisible] = useState(false);
    const textModal = useRef<string[]>(['']);
    const imgUrlModal = useRef<string>('');
    const [addRemoveFns, setAddRemoveFns] = useState<any>();
    const [flag, setFlag] = useState<boolean>(false)

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

                    if (!userData.isAdmin) {
                        actionItems.push(<GridActionsCellItem
                            icon={
                                !isItemInCart(params.id as number)
                                    ? <AddToShoppingCart/>
                                    : <RemoveFromShoppingCart/>}
                            label='Basket'
                            onClick={() => {
                                badgeHandler(params.id as number);
                            }}
                        />)
                    }
                    return actionItems;
                }
            }
        ]
    }


    function badgeHandler(id: any) {
        if (!userData.uid) {
            setFlNavigate(true);
        }
        const product = products.find(e => e.productId === +id);
        if (isItemInCart(id)) {
            dispatch(removeBasketLineAction(basket, id));
            console.log(basket);
        } else {
            dispatch(addBasketItemAction(userData.uid, product!));
            console.log(basket)
        }
    }

    function showDetails(id: number | string) {
        const product = products.find(e => e.productId === +id);
        if (!!product) {
            textModal.current = getInfo(product);
            imgUrlModal.current = product.imageUrl;
            setFlag(isItemInCart(+id))
            setAddRemoveFns({
                    remove: ()=>dispatch(removeBasketLineAction(basket, +id)),
                    add: ()=>dispatch(addBasketItemAction(userData.uid, product))
                })
        } else {
            textModal.current = ["Not found"];
        }
        setModalVisible(true);
    }

    function isItemInCart(itemId: number) {
        return !!basket.basketItems.find(i => i.productId.toString() === itemId.toString());
    }

    return <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        '& .Mui-error': {bgcolor: '#FF9494', color: 'white', width: '100%', height: '100%'}
    }}>
        <Paper sx={{width: {xs: '100vw', sm: '80vw'}, height: '80vh', marginTop: '2vh'}}>
            <DataGrid getRowId={(row) => row.productId} rows={rows} columns={getColumns()}/>
        </Paper>
        <InfoModal title={"Detailed information about the product"}
                   message={textModal.current}
                   open={modalVisible}
                   onClose={() => setModalVisible(false)}
                   imageUrl={imgUrlModal.current}
                   addRemove={{addRemoveFns, setFlag, flag}}
        />
        {flNavigate && <Navigate to={PATH_LOGIN}/>}
    </Box>

};

export const AddToShoppingCart = () => {
    return (
        <Tooltip
            title="Add to the shopping cart"
        >
            <AddShoppingCartIcon color={"success"}/>
        </Tooltip>
    );
};
export const RemoveFromShoppingCart = () => {
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