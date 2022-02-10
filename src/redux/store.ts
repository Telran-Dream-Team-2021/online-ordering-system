import {applyMiddleware, combineReducers, createStore} from "redux";
import {UserData} from "../models/common/user-data";
import thunk from 'redux-thunk'
import ErrorCode from "../models/common/error-code";
import {errorCodeReducer, userDataReducer, catalogReducer, ordersReducer} from "./reducers";
import {ProductData} from "../models/product-data";
import {OrderData} from "../models/order-data";


type StoreType = {
    userData: UserData,
    errorCode: ErrorCode,
    catalog: ProductData[],
    orders: OrderData[]
}
const reducers = combineReducers<StoreType>(
    {
        userData: userDataReducer,
        errorCode: errorCodeReducer,
        catalog: catalogReducer,
        orders: ordersReducer
    }
)
export const store = createStore(reducers, applyMiddleware(thunk));
//selectors in accordance with state
export const userDataSelector = (state: StoreType): UserData => state.userData;
export const errorCodeSelector = (state: StoreType): ErrorCode => state.errorCode;
export const catalogSelector = (state: StoreType): ProductData[] => state.catalog;