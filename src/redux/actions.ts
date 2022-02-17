import {Dispatch, PayloadAction} from '@reduxjs/toolkit'
import {UserData} from "../models/common/user-data";
import ErrorCode from "../models/common/error-code";
import {ProductData} from "../models/product-data";
import {basket, catalog, userDataProcessor, orders} from "../config/services-config";
import {BasketData} from "../models/basket-data";
import {OrderData} from "../models/order-data";
import {LoginData} from "../models/common/login-data";

export const SET_USER_DATA = "set_user_data";
export const SET_ERROR_CODE = "set_error_code";
export const SET_CATALOG = "set_catalog";
export const SET_BASKET = "set_basket";
export const SET_ORDERS = "set_orders";

type ActionType<T> = (data: T) => PayloadAction<T>;

export const setUserData: ActionType<UserData> = userData => (
    {payload: userData, type: SET_USER_DATA}
)
export const setErrorCode: ActionType<ErrorCode> = errorCode => (
    {payload: errorCode, type: SET_ERROR_CODE}
)
export const setCatalog: ActionType<ProductData[]> = catalog => (
    {payload: catalog, type: SET_CATALOG}
)
export const setBasket: ActionType<BasketData> = basket => (
    {payload: basket, type: SET_BASKET}
)

export const setOrders: ActionType<OrderData[]> = orders => (
    {payload: orders, type: SET_ORDERS}
)

async function action(handlerFn: any, dispatch: Dispatch) {
    try {
        await handlerFn();
        dispatch(setErrorCode(ErrorCode.NO_ERROR));
    } catch (error: any) {
        console.log(error)
        dispatch(setErrorCode(error));
    }
}

export const addProductAction = function (product: ProductData): (dispatch: any) => void {
    return action.bind(null, catalog.addProduct.bind(catalog, product));
}
export const removeProductAction = function (productId: number): (dispatch: any) => void {
    return action.bind(null, catalog.removeProduct.bind(catalog, productId));
}
export const updateProductAction = function (productId: number, newProduct: ProductData): (dispatch: any) => void {
    return action.bind(null, catalog.updateProduct.bind(catalog, productId, newProduct));
}
export const addBasketItemAction = function (basketData: BasketData, productData: ProductData): (dispatch: any) => void {
    return action.bind(null, basket.addItem.bind(basket, basketData, productData));
}
export const removeBasketItemAction = function (basketData: BasketData, productId: number): (dispatch: any) => void {
    return action.bind(null, basket.removeItem.bind(basket, basketData, productId));
}
export const removeBasketAction = function (basketData: BasketData): (dispatch: any) => void {
    return action.bind(null, basket.removeBasket.bind(basket, basketData));
}
export const getBasketAction = function (id: string): (dispatch: any) => void {
    return action.bind(null, basket.getBasket.bind(basket, id));
}

export const updateUserDataAction = function (userData: UserData): (dispatch: any) => void {
    // return action.bind(null, userDataProcessor.updateData.bind(userDataProcessor, userData));
    return async dispatch => {
        try {
            await userDataProcessor.updateData(userData);
            dispatch(setUserData(userData));
            dispatch(setErrorCode(ErrorCode.NO_ERROR));
        } catch (error: any) {
            dispatch(setErrorCode(error));
        }
    }
}
export const logoutAction = function (): (dispatch: any) => void {
    return action.bind(null, userDataProcessor.logout.bind(userDataProcessor));
}
export const loginAction = function (loginData: LoginData): (dispatch: any) => void {
    return action.bind(null, userDataProcessor.login.bind(userDataProcessor, loginData));
}

export const addOrderAction = function(basket: BasketData, userData: UserData): (dispatch: any) => void {
    return action.bind(null, orders.addOrder.bind(orders, basket, userData));
}
