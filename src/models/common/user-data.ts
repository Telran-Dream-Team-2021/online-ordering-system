import {BasketData} from "../basket-data";

export type UserData = {
    username: string;
    isAdmin: boolean;
    displayName: string;
    deliveryAddress?: string;
    basket: BasketData;
}
export const DISPLAY_NAME_ERROR = 'error'
export const nonAuthorizedUser: UserData = {
    username: '',
    isAdmin: false,
    displayName: '',
    basket: {userId: "", basketItems: []}
};
// export const unavailableServiceUser: UserData = {
//     username: 'error', isAdmin: false,
//     displayName: DISPLAY_NAME_ERROR,
// }