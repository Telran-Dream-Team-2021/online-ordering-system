import Login from "../components/pages/registration-auth-page";
import {RouteType} from "../models/common/route-type";
import AssortmentPage from "../components/pages/assortment-page";
import BasketPage from "../components/pages/basket-page";
import OrdersPage from "../components/pages/orders-page";
import ListingPage from "../components/pages/listing-page";
import EditProductPage from "../components/pages/edit-product-page";
import CatalogPage from "../components/pages/catalog-page";

export const PATH_ASSORTMENT = "/assortment";
export const PATH_LOGIN = "/login";
export const PATH_LOGIN_STEP_2 = "/login/step2";
export const PATH_BASKET = "/basket";
export const PATH_ORDERS = "/orders";
export const PATH_LISTING = "/listing";
export const PATH_PRODUCT = ":productId";

export const routes: RouteType[] = [
    {path: PATH_ASSORTMENT, element: <CatalogPage/>, label: 'Assortment', adminOnly: true,
        indexElement: <AssortmentPage/>,
        childRoutes: [
            {path: PATH_PRODUCT, element: <EditProductPage/>, label: "Product page", adminOnly: true}
        ]
    },
    {path: PATH_BASKET, element: <BasketPage/>, label: 'Shopping Cart', authenticated: true, adminOnly: false},
    {path: PATH_ORDERS, element: <OrdersPage/>, label: 'Orders', authenticated: true},
    {path: PATH_LISTING, element: <ListingPage/>, label: 'Catalog'},
    {path: PATH_LOGIN, element: <Login/>, label: 'Login', authenticated: false},
]
export const developmentRoutes: RouteType[] = []

