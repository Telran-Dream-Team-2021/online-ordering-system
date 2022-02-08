import { PayloadAction } from "@reduxjs/toolkit";
import ErrorCode from "../models/common/error-code";
import { nonAuthorizedUser, UserData } from "../models/common/user-data";
import { SET_ERROR_CODE, SET_USER_DATA } from "./actions";

export const userDataReducer = (userData: UserData = nonAuthorizedUser,
                                action: PayloadAction<UserData>): UserData => {
    return action.type === SET_USER_DATA ? action.payload : userData
}
export const errorCodeReducer = (errorCode: ErrorCode = ErrorCode.NO_ERROR,
                                 action: PayloadAction<ErrorCode>): ErrorCode => {
    return action.type === SET_ERROR_CODE ? action.payload : errorCode;
}