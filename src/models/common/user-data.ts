export type UserData = {
    username: string;
    isAdmin: boolean;
    displayName: string;
    deliveryAddress?: string;
}
export const DISPLAY_NAME_ERROR = 'error'
export const nonAuthorizedUser: UserData = {username: '', isAdmin: false, displayName: ''};
export const unavailableServiceUser: UserData = {
    username: 'error', isAdmin: false,
    displayName: DISPLAY_NAME_ERROR
}