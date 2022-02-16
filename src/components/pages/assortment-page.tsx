import React, {useState, FC, useMemo, useRef} from 'react';
import {ProductData} from "../../models/product-data";
import {useDispatch, useSelector} from "react-redux";
import {catalogSelector, userDataSelector} from "../../redux/store";
import {UserData} from "../../models/common/user-data";
import {Avatar, Box, IconButton, Paper, Switch} from '@mui/material';
import {DataGrid, GridActionsCellItem, GridColumns, GridRowsProp} from "@mui/x-data-grid";
import {Delete, Visibility} from "@mui/icons-material";
import ConfirmDialog from "../common/confirm-dialog";
import {ConfirmationDataType, initialConfirmationData} from "../../models/common/confirmation-data-type";
import {removeProductAction, updateProductAction} from "../../redux/actions";
import {Link} from "react-router-dom";


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
    const columns = getColumns();
    const confirmationDialog = useRef<ConfirmationDataType>(initialConfirmationData);
    const [isConfDialogVisible, setIsConfDialogVisible] = useState(false);

    function getColumns(): GridColumns {
        return [
            {field: 'imageUrl', headerName: 'Image', flex: 1, headerAlign: "center", align: "center",
                renderCell: params => {
                    return <Avatar
                        src={params.value}
                        sx={{ width: 48, height: 48 }}
                        variant={'rounded'}
                    />
                }
            },
            {field: 'productId', headerName: 'Product ID', flex: 1},
            {field: 'name', headerName: 'Product name', flex: 6},
            {field: 'categoryName', headerName: 'Category', flex: 2},
            {field: 'isActive', headerName: '', flex: 0.1, align:"center",
                renderCell: params => {
                    return (
                        <Switch
                            checked={params.value}
                            onChange={() => switchProductActivity(params.id as number)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    );
                }
            },
            {field: 'edit', flex: 0.1, align:"center", headerName: '',
                renderCell: params => {
                    return (
                        <IconButton
                            aria-label="edit product"
                            component={Link}
                            to={`/assortment/${params.id}`}
                        >
                            <Visibility />
                        </IconButton>
                    );
                }
            },
            {field: 'actions', flex: 0.1, align:"center", type: "actions", getActions(params) {
                    return [
                        <GridActionsCellItem icon={<Delete />}
                                             onClick={() => {
                                                 showDeleteProductDialog(params.id as number)
                                             }} label="Delete"/>
                    ]
                }
            }
        ]
    }
    function switchProductActivity(productId: number) {
        const product = getProduct(productId);
        product.isActive = !product.isActive;
        dispatch(updateProductAction(productId, product));
    }

    function showDeleteProductDialog(productId: number) {
        confirmationDialog.current.title = "Delete product";
        confirmationDialog.current.message = `Are you sure that you want to delete ${productId}
            ${getProduct(productId).name} from assortment?`
        confirmationDialog.current.handler = removeProduct.bind(null, productId);
        setIsConfDialogVisible(true);
    }
    function getProduct(productId: number): ProductData {
        const product =  assortment.find(product => product.productId === productId);
        if(!product) {
            throw `No product with id ${productId} in the assortment`
        }
        return product;
    }
    function removeProduct(productId: number) {
        dispatch(removeProductAction(productId));
        setIsConfDialogVisible(false);
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
                <DataGrid rows={rows} getRowId={(row) => row.productId} columns={columns} />
            </Paper>
            {isConfDialogVisible && <ConfirmDialog data={confirmationDialog.current} open={isConfDialogVisible}/>}
        </Box>
    );
};

export default AssortmentPage;