import ProductServiceFire from "../service/product-service-fire";
import Catalog from "../service/catalog";
import AuthServiceFire from "../service/auth-service-fire";
import UserServiceFire from "../service/user-service-fire";
import BasketServiceFire from "../service/basket-service-fire";
import OrdersServiceFire from "../service/orders-service-fire";
import Orders from "../service/orders";

/*** Product Service Config ***/
const productService = new ProductServiceFire("products");
export const catalog: Catalog = new Catalog(productService);

/*** Auth Service Config ***/
export const authService = new AuthServiceFire();

/*** Users Service Config ***/
export const userService = new UserServiceFire();

/*** Basket Service config***/
export const basketService = new BasketServiceFire("users");

/*** Orders Service config***/
export const ordersServiceFire = new OrdersServiceFire("orders")
export const orders = new Orders(ordersServiceFire)