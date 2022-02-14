import Login from "../components/pages/registration-auth-page";
import {RouteType} from "../models/common/route-type";
import AssortmentPage from "../components/pages/assortment-page";
import BasketPage from "../components/pages/basket-page";
import OrdersPage from "../components/pages/orders-page";
import ListingPage from "../components/pages/listing-page";

export const PATH_ASSORTMENT = "/assortment";
export const PATH_LOGIN = "/login";
export const PATH_LOGIN_STEP_2 = "/login/step2";
export const PATH_BASKET = "/basket";
export const PATH_ORDERS = "/orders";
export const PATH_LISTING = "/listing";

export const routes: RouteType[] = [
    {path: PATH_ASSORTMENT, element: <AssortmentPage/>, label: 'Assortment', adminOnly: true},
    {path: PATH_BASKET, element: <BasketPage/>, label: 'Basket', authenticated: true},
    {path: PATH_ORDERS, element: <OrdersPage/>, label: 'Orders', authenticated: true},
    {path: PATH_LISTING, element: <ListingPage/>, label: 'Listing'},
    {path: PATH_LOGIN, element: <Login/>, label: 'Login', authenticated: false},
]
export const developmentRoutes: RouteType[] = []

