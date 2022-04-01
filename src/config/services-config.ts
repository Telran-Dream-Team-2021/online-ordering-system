import ProductServiceFire from "../service/product-service-fire";
import Catalog from "../service/catalog";
import BasketServiceFire from "../service/basket-service-fire";
import Basket from "../service/basket";
import UserDataProcessor from "../service/user-data-processor";
import OrdersServiceFire from "../service/orders-service-fire";
import Orders from "../service/orders";
import AuthServiceJava from "../service/auth-service-java";
import UserServiceJava from "../service/user-service-java";
import OrdersServiceJava from "../service/orders-service-java";

export const AUTH_TOKEN = 'auth_token';
export const JAVA_DOMAIN = 'http://localhost:8080';
const API_V1 = '/api/v1'
export const JAVA_WS_DOMAIN = 'http://localhost:8080';

/*** Product Service Config ***/
const productService = new ProductServiceFire("products");
export const catalog: Catalog = new Catalog(productService);

/*** Auth & UserData Services Config ***/
const authService = new AuthServiceJava(JAVA_DOMAIN + API_V1);
const userService = new UserServiceJava(JAVA_DOMAIN + API_V1 + '/users');
export const userDataProcessor = new UserDataProcessor(authService, userService);

/*** Basket Service config***/
export const basketService = new BasketServiceFire("baskets");
export const basket: Basket = new Basket(basketService);

/*** Orders Service config***/
export const ordersServiceJava = new OrdersServiceJava(JAVA_DOMAIN + API_V1 + "/orders", JAVA_WS_DOMAIN)
export const orders = new Orders(ordersServiceJava)