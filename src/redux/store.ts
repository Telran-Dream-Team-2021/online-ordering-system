import {applyMiddleware, combineReducers, createStore} from "redux";
import {UserData} from "../models/common/user-data";
import thunk from 'redux-thunk'
import ErrorCode from "../models/common/error-code";
import {errorCodeReducer, userDataReducer} from "./reducers";

type StoreType = {
    userData: UserData,
    errorCode: ErrorCode
}
const reducers = combineReducers<StoreType>(
    {
        userData: userDataReducer,
        errorCode: errorCodeReducer
    }
)
export const store = createStore(reducers, applyMiddleware(thunk));
//selectors in accordance with state
export const userDataSelector = (state: StoreType): UserData => state.userData;
export const errorCodeSelector = (state: StoreType): ErrorCode => state.errorCode;