export type UserData = {
    uid: string | number;
    isAdmin: boolean;
    displayName: string;
    deliveryAddress?: string;
    email: string;
}
export const DISPLAY_NAME_ERROR = 'error'
export const nonAuthorizedUser: UserData = {
    uid: '',
    isAdmin: false,
    displayName: '',
    email: '',
};
export const unavailableServiceUser: UserData = {
    uid: 'error', isAdmin: false,
    displayName: DISPLAY_NAME_ERROR,
    email: '',
}