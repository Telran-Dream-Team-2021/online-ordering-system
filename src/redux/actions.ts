import {Dispatch, PayloadAction} from '@reduxjs/toolkit'
import { UserData } from "../models/common/user-data";
import ErrorCode from "../models/common/error-code";
import {ProductData} from "../models/product-data";
import {catalog} from "../config/services-config";
export const SET_USER_DATA = "set_user_data";
export const SET_ERROR_CODE = "set_error_code";
export const SET_CATALOG = "set_catalog";

type ActionType<T> = (data: T)=>PayloadAction<T>;

export const setUserData: ActionType<UserData> = userData => (
    {payload: userData, type: SET_USER_DATA}
)
export const setErrorCode: ActionType<ErrorCode> = errorCode => (
    {payload: errorCode, type: SET_ERROR_CODE}
)
export const setCatalog: ActionType<ProductData[]> = catalog => (
    {payload: catalog, type: SET_CATALOG}
)
async function action(handlerFn: any, dispatch: Dispatch) {
    try {
        await handlerFn();
        dispatch(setErrorCode(ErrorCode.NO_ERROR));
    } catch (error: any) {
        dispatch(setErrorCode(error));
    }
}
export const addProductAction = function(product: ProductData): (dispatch:any)=>void {
    return action.bind(null, catalog.addProduct.bind(catalog, product));
}
export const removeProductAction = function(productId: number): (dispatch:any)=>void {
    return action.bind(null, catalog.removeProduct.bind(catalog, productId));
}
export const updateProductAction = function(productId: number, newProduct: ProductData): (dispatch:any)=>void {
    return action.bind(null, catalog.updateProduct.bind(catalog, productId, newProduct));
}