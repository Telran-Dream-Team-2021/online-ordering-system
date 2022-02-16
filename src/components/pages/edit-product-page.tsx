import React, {FC} from 'react';
import {dummyProduct, ProductData} from "../../models/product-data";
import {Box} from "@mui/material";
import EditProductForm from "../edit-product-form";
import {useDispatch, useSelector} from "react-redux";
import {catalogSelector} from "../../redux/store";
import assortmentConfig from "../../config/assortment-config.json"
import {addProductAction, removeProductAction, updateProductAction} from "../../redux/actions";
import {useParams} from "react-router-dom";
import {PATH_PRODUCT} from "../../config/routes-config";

const EditProductPage: FC = () => {
    const params = useParams();
    const productId = parseInt(params[PATH_PRODUCT.substring(1)] as string);
    const assortment: ProductData[] = useSelector(catalogSelector);
    const dispatch = useDispatch();

    function getProductData(): ProductData {
        let res = dummyProduct;
        const productFromAssortment = assortment.find(p => p.productId === productId);
        if(productFromAssortment) {
            res = productFromAssortment;
        }
        return res;
    }

    const product: ProductData = getProductData();
    const {minProductNameLength, maxProductNameLength, maxProductDescriptionLength,
        minProductPrice, maxProductPrice} = assortmentConfig;

    return (
        <Box>
            {/*Кнопка возврата на страницу Ассортимент*/}
            <Box>
            </Box>
            {/*Кнопка для удаления карточки товара из Ассортимента*/}
            <Box>
            </Box>
            <EditProductForm
                 initialProductState={product}
                 validateProductIdFn={function (productId: number): string {
                     const initialProductIndex = assortment.indexOf(product);
                     const newProductIndex = assortment.findIndex(p => p.productId === productId);
                    if(newProductIndex < 0 || newProductIndex === initialProductIndex) {
                        return "";
                    } else {
                        return `Product with id ${productId} already exists in assortment`
                    }
                }} validateProductNameFn={function (productName: string): string {
                    if(productName.length < minProductNameLength || productName.length > maxProductNameLength) {
                        return `Product name length must be within range ${minProductNameLength} - 
                            ${maxProductNameLength} symbols`
                    } else {
                        return "";
                    }
                }} validateProductDescriptionFn={function (productDescription: string): string {
                    if(productDescription.length > maxProductDescriptionLength) {
                        return `Product description length must be less then 
                                ${maxProductNameLength} symbols`
                    } else {
                        return "";
                    }
                }} validateProductPriceFn={function (productPrice: number): string {
                    if(productPrice < minProductPrice || productPrice > maxProductPrice) {
                        return `Product price must be within range ${minProductPrice} - 
                                ${maxProductPrice}`
                    } else {
                        return "";
                    }
                }} submitProductFn={function (productState: ProductData): void {

                    // add new product
                    if (product == dummyProduct) {
                        dispatch(addProductAction(productState));
                    //   update product without productId change
                    } else if(productState.productId === product.productId) {
                        dispatch(updateProductAction(product.productId as number, productState));
                    // update product with productId change
                    } else {
                        dispatch(addProductAction(productState));
                        dispatch(removeProductAction(product.productId as number));
                    }
                }}
            />
        </Box>
    );
};

export default EditProductPage;