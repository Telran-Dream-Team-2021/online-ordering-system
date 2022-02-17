import ProductServiceFire from "../service/product-service-fire";
import Catalog from "../service/catalog";
import AuthServiceFire from "../service/auth-service-fire";
import UserServiceFire from "../service/user-service-fire";
import BasketServiceFire from "../service/basket-service-fire";
import Basket from "../service/basket";
import UserDataProcessor from "../service/user-data-processor";
import OrdersServiceFire from "../service/orders-service-fire";
import Orders from "../service/orders";

/*** Product Service Config ***/
const productService = new ProductServiceFire("products");
export const catalog: Catalog = new Catalog(productService);

/*** Auth & UserData Services Config ***/
export const authService = new AuthServiceFire();
export const userService = new UserServiceFire("users");
export const userDataProcessor = new UserDataProcessor(authService, userService);

/*** Basket Service config***/
export const basketService = new BasketServiceFire("baskets");
export const basket: Basket = new Basket(basketService);

/*** Orders Service config***/
export const ordersServiceFire = new OrdersServiceFire("orders")
export const orders = new Orders(ordersServiceFire)