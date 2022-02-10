import {PayloadAction} from '@reduxjs/toolkit'
import { UserData } from "../models/common/user-data";
import ErrorCode from "../models/common/error-code";
import {ProductData} from "../models/product-data";
export const SET_USER_DATA = "set_user_data";
export const SET_ERROR_CODE = "set_error_code";
export const SET_PRODUCT_DATA = "set_product_data";

type ActionType<T> = (data: T)=>PayloadAction<T>;

export const setUserData: ActionType<UserData> = userData => (
    {payload: userData, type: SET_USER_DATA}
)
export const setErrorCode: ActionType<ErrorCode> = errorCode => (
    {payload: errorCode, type: SET_ERROR_CODE}
)
export const setProductData: ActionType<ProductData> = product => (
    {payload: product, type: SET_PRODUCT_DATA}
)