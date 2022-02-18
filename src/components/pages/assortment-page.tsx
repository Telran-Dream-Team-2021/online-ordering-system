import React, {useState, FC, useMemo, useRef} from 'react';
import {ProductData} from "../../models/product-data";
import {useDispatch, useSelector} from "react-redux";
import {catalogSelector} from "../../redux/store";
import {Avatar, Box, Button, IconButton, Paper, Switch} from '@mui/material';
import {DataGrid, GridActionsCellItem, GridColumns, GridRowsProp} from "@mui/x-data-grid";
import {Delete, Visibility, AddRounded, UploadRounded} from "@mui/icons-material";
import ConfirmDialog from "../common/confirm-dialog";
import {ConfirmationDataType, initialConfirmationData} from "../../models/common/confirmation-data-type";
import {addProductAction, removeProductAction, updateProductAction} from "../../redux/actions";
import initialAssortment from "../../config/initial-assortment.json";
import {Link} from "react-router-dom";
import InfoModal from "../common/info-modal";


function getRows(assortment: ProductData[]): GridRowsProp {
    return assortment;
}

const AssortmentPage: FC = () => {
    const dispatch = useDispatch();
    const assortment: ProductData[] = useSelector(catalogSelector);
    console.log(assortment);
    const rows = useMemo(() => {
        return getRows(assortment);
    }, [assortment]);
    const columns = getColumns();
    const confirmationDialog = useRef<ConfirmationDataType>(initialConfirmationData);
    const [isConfDialogVisible, setIsConfDialogVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const textModal = useRef<string[]>(['']);
    const imgUrlModal = useRef<string>('');

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
            {field: 'price', headerName: 'Price', flex: 1},
            {field: 'unitOfMeasurement', headerName: 'Unit', flex: 1},
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
                                                 deleteProduct(params.id as number)
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

    function deleteProduct(productId: number){
        const product = getProduct(productId);
        if(product.isActive){
            showDeleteProductModel(product)
        } else {
            showDeleteProductDialog(productId)
        }
    }

    function showDeleteProductDialog(productId: number) {
        confirmationDialog.current.title = "Delete product";
        confirmationDialog.current.message = `Are you sure that you want to delete ${productId}
            ${getProduct(productId).name} from assortment?`
        confirmationDialog.current.handler = removeProduct.bind(null, productId);
        setIsConfDialogVisible(true);
    }

    function showDeleteProductModel(product: ProductData){
        textModal.current = [`Product - ${product.productId} is active.`, `First you have to deactivate this product`];
        imgUrlModal.current = product.imageUrl;
        setModalVisible(true);
    }

    function getProduct(productId: number): ProductData {
        const product =  assortment.find(product => product.productId === productId);
        if(!product) {
            throw `No product with id ${productId} in the assortment`
        }
        return product;
    }
    function removeProduct(productId: number, isConfirmed: boolean) {
        if (isConfirmed) {
            dispatch(removeProductAction(productId));
        }
        setIsConfDialogVisible(false);
    }

    function uploadInitialAssortment() {
        initialAssortment.products.forEach(product => dispatch(addProductAction(product)))
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
                <Button
                    variant="outlined"
                    startIcon={<AddRounded />}
                    component={Link}
                    to={`/assortment/new_product`}
                    sx={{m: 1}}
                >
                    Add product
                </Button>
                {
                    assortment.length == 0 ?
                        <Button
                            variant="outlined"
                            startIcon={<UploadRounded/>}
                            onClick={() => uploadInitialAssortment()}
                            sx={{m: 1}}
                        >
                            Load assortment
                        </Button>
                        :
                        <DataGrid rows={rows} getRowId={(row) => row.productId} columns={columns}/>
                }
            </Paper>
            {isConfDialogVisible && <ConfirmDialog data={confirmationDialog.current} open={isConfDialogVisible}/>}
            <InfoModal title={"Delete product"}
                       message={textModal.current}
                       open={modalVisible}
                       onClose={() => setModalVisible(false)}
                       imageUrl={imgUrlModal.current}
            />
        </Box>
    );
};

export default AssortmentPage;