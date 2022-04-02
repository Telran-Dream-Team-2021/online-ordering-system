import Catalog from "../service/catalog";
import Basket from "../service/basket";
import UserDataProcessor from "../service/user-data-processor";
import Orders from "../service/orders";
import AuthServiceJava from "../service/auth-service-java";
import UserServiceJava from "../service/user-service-java";
import ProductServiceJava from "../service/product-service-java";
import BasketServiceJava from "../service/basket-service-java";
import OrdersServiceJava from "../service/orders-service-java";

export const AUTH_TOKEN = 'auth_token';
export const JAVA_DOMAIN = 'https://oos-12345.herokuapp.com';
const API_V1 = '/api/v1'
export const JAVA_WS_DOMAIN = 'https://oos-12345.herokuapp.com';

/*** Product Service Config ***/
const productService = new ProductServiceJava(JAVA_DOMAIN + API_V1 + "/products", JAVA_WS_DOMAIN);
export const catalog: Catalog = new Catalog(productService);

/*** Auth & UserData Services Config ***/
const authService = new AuthServiceJava(JAVA_DOMAIN + API_V1);
const userService = new UserServiceJava(JAVA_DOMAIN + API_V1 + '/users');
export const userDataProcessor = new UserDataProcessor(authService, userService);

/*** Basket Service config***/
export const basketService = new BasketServiceJava(JAVA_DOMAIN + API_V1 + "/baskets", JAVA_WS_DOMAIN);
export const basket: Basket = new Basket(basketService);

/*** Orders Service config***/
export const ordersServiceJava = new OrdersServiceJava(JAVA_DOMAIN + API_V1 + "/orders", JAVA_WS_DOMAIN)
export const orders = new Orders(ordersServiceJava)