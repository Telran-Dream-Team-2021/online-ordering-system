import React, {FC, ReactNode, useEffect, useState} from 'react';
import {dummyProduct, noProductImageUrl, ProductData} from "../models/product-data";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    Switch,
    TextField,
    MenuItem,
    Avatar,
    Button,
    FormControlLabel, Snackbar
} from "@mui/material";
import assortmentConfig from "../config/assortment-config.json";
import {Link} from "react-router-dom";

type EditProductFormType ={
    initialProductState: ProductData,
    validateProductIdFn: (productId: number) => string,
    validateProductNameFn: (productName: string) => string,
    validateProductDescriptionFn: (productDescription: string) => string,
    validateProductPriceFn: (productPrice: number) => string,
    submitProductFn: (productState: ProductData) => void,
}

const EditProductForm: FC<EditProductFormType> = (props) => {
    const {categories, unitsOfMeasurement} = assortmentConfig;
    const {initialProductState, validateProductIdFn, validateProductNameFn,
        validateProductDescriptionFn, validateProductPriceFn, submitProductFn} = props;
    const [productState, setProductState] = useState<ProductData>({...initialProductState});

    const [errorProductIdMessage, setProductIdErrorMessage] = React.useState<string>("");
    const [errorProductNameMessage, setProductNameErrorMessage] = React.useState<string>("");
    const [errorProductDescriptionMessage, setProductDescriptionErrorMessage] = React.useState<string>("");
    const [errorProductPriceMessage, setProductPriceErrorMessage] = React.useState<string>("");
    const [flIsSnackBarOpen, setFlIsSnackBarOpen] = React.useState<boolean>(false);

    const [flValid, setFlValid] = useState<boolean>(false);
    const [flIsProductChanged, setFlIsProductChanged] = useState<boolean>(false);

    useEffect(() => {
        setFlValid(validateAll());
        setFlIsProductChanged(JSON.stringify(productState) != JSON.stringify(initialProductState));
        return () => {}
    }, [productState])
    function validateAll(): boolean {
        return !validateProductIdFn(productState.productId as number)
            && !validateProductNameFn(productState.name)
            && !validateProductDescriptionFn(productState.description)
            && !validateProductPriceFn(productState.price)
            && !!productState.categoryName
            && !!productState.unitOfMeasurement
    }


    function handleProductDataChange(key: string, newValue: any) {
        (productState as any)[key] = newValue;
        setProductState({...productState});
    }

    function handleChangeProductId(event: any) {
        const enteredProductId = parseInt(event.target.value);
        const message = validateProductIdFn(enteredProductId);
        setProductIdErrorMessage(message);
        productState.productId = enteredProductId;
        setProductState({...productState});
    }

    function handleChangeProductName(event: any) {
        const enteredProductName = event.target.value as string;
        const message = validateProductNameFn(enteredProductName);
        setProductNameErrorMessage(message);
        productState.name = enteredProductName;
        setProductState({...productState});
    }

    function handleChangeProductDescription(event: any) {
        const enteredProductDescription = event.target.value as string;
        const message = validateProductDescriptionFn(enteredProductDescription);
        setProductDescriptionErrorMessage(message);
        productState.description = enteredProductDescription;
        setProductState({...productState});
    }

    function handleChangeProductPrice(event: any) {
        const enteredProductPrice = parseInt(event.target.value);
        const message = validateProductPriceFn(enteredProductPrice);
        setProductPriceErrorMessage(message);
        productState.price = enteredProductPrice;
        setProductState({...productState});
    }

    function getSelectItems(options: string[]): ReactNode[] {
        return options.map(o => {
           return <MenuItem key={o} value={o}>{o}</MenuItem>
        })
    }
    function handleSnackBarClose(event: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        setFlIsSnackBarOpen(false);
    }

    function handleNewProductSelect(event: any) {
        setFlIsSnackBarOpen(false);
        setProductState(dummyProduct)
    }

    function resetFn() {
        setProductState({...initialProductState});
    }

    async function onSubmit(event: any) {
        event.preventDefault();
        try {
            await submitProductFn(productState);
            setFlIsSnackBarOpen(true);
            setFlIsProductChanged(false);
        } catch (err) {
            alert("Product can't be save because of error returned by submitProductFn");
        }
    }

    const snackBarAction = (
        <React.Fragment>
            <Button
                color="secondary"
                size="small"
                component={Link}
                to={`/assortment/new_product`}
                onClick={handleNewProductSelect}
            >
                New product
            </Button>
        </React.Fragment>
    );
    return (
        <Box
            component ="form"
            onSubmit={onSubmit}
            sx={{display: "flex", flexDirection: "column", margin: 2}}
        >
            <Box
                sx={{display: "flex", flexDirection: "row"}}
            >
                {/*  Изображение  */}
                <Box

                    sx={{display: "flex", flexDirection: "column", mr: 2}}
                >
                    <Avatar
                        src={productState.imageUrl}
                        sx={{ width: 400, height: 400, mb: 2}}
                        variant={'rounded'}
                    >
                        <Avatar
                            src={noProductImageUrl}
                            sx={{ width: 400, height: 400}}
                            variant={'rounded'}
                        />
                    </Avatar>
                    {/*    imageUrl: string,*/}
                    <TextField
                        id="product-image-url"
                        label="Image URL"
                        variant="outlined"
                        type="url"
                        value={productState.imageUrl}
                        onChange={(event: any) => handleProductDataChange('imageUrl', event.target.value)}
                    />
                </Box>
                {/*  Характеристикик  */}
                <Box
                    sx={{display: "flex", flexDirection: "column", margin: 2}}
                >
                    {/*    isActive: boolean,*/}
                    <FormControlLabel
                        control =
                            {
                                <Switch
                                    checked={productState.isActive}
                                    onChange={() => handleProductDataChange('isActive', !productState.isActive)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                        label ={productState.isActive ? "Active" : "Disabled"}
                    />
                    {/*    productId: number | string,*/}
                    <TextField
                        id="product-id"
                        label="Product Id"
                        variant="outlined"
                        type="number"
                        value={productState.productId}
                        error={!!errorProductIdMessage}
                        helperText={errorProductIdMessage}
                        onChange={handleChangeProductId}
                    />
                    {/*    name: string,*/}
                    <TextField
                        id="product-name"
                        label="Product name"
                        variant="outlined"
                        type="text"
                        value={productState.name}
                        error={!!errorProductNameMessage}
                        helperText={errorProductNameMessage}
                        onChange={handleChangeProductName}
                    />
                    {/*    categoryName: string,*/}
                    <FormControl>
                        <InputLabel id="category-name-label">Select category</InputLabel>
                        <Select
                            required
                            labelId="category-name-label"
                            id="category-name-select"
                            value={productState.categoryName}
                            label="Category"
                            onChange={(event: any) => handleProductDataChange('categoryName', event.target.value)}
                        >
                            {getSelectItems(categories)}
                        </Select>
                    </FormControl>
                    {/*    description: string,*/}
                    <TextField
                        id="product-description"
                        label="Product description"
                        variant="outlined"
                        type="text"
                        value={productState.description}
                        multiline
                        rows={3}
                        error={!!errorProductDescriptionMessage}
                        helperText={errorProductDescriptionMessage}
                        onChange={handleChangeProductDescription}
                    />
                    {/*    price: number,*/}
                    <TextField
                        id="product-price"
                        label="Price"
                        variant="outlined"
                        type="number"
                        value={productState.price}
                        error={!!errorProductPriceMessage}
                        helperText={errorProductPriceMessage}
                        onChange={handleChangeProductPrice}
                    />
                    {/*    unitOfMeasurement: string,*/}
                    <FormControl>
                        <InputLabel id="product-uom-label">Select unit</InputLabel>
                        <Select
                            required
                            labelId="product-uom-label"
                            id="product-uom-select"
                            value={productState.unitOfMeasurement}
                            label="Unit"
                            onChange={(event: any) => handleProductDataChange('unitOfMeasurement', event.target.value)}
                        >
                            {getSelectItems(unitsOfMeasurement)}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            {/*  Кнопки  */}
            <Box
                sx={{marginTop: 2}}
            >
                <Button type="submit" disabled ={!flValid || !flIsProductChanged} variant="contained">Save product</Button>
                <Button onClick={resetFn}>Reset changes</Button>
            </Box>
            <Snackbar
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                open={flIsSnackBarOpen}
                autoHideDuration={3000}
                onClose={handleSnackBarClose}
                message={initialProductState.productId === 0 ? "Product created" : "Changes saved"}
                action={snackBarAction}
            />
        </Box>
    );
};

export default EditProductForm;