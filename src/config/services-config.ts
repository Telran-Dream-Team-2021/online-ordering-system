import ProductServiceFire from "../service/product-service-fire";
import Catalog from "../service/catalog";
import AuthServiceFire from "../service/auth-service-fire";
import UserServiceFire from "../service/user-service-fire";
import BasketServiceFire from "../service/basket-service-fire";
import Basket from "../service/basket";

/*** Product Service Config ***/
const productService = new ProductServiceFire("products");
export const catalog: Catalog = new Catalog(productService);

/*** Auth Service Config ***/
export const authService = new AuthServiceFire();

/*** Users Service Config ***/
export const userService = new UserServiceFire("users");

/*** Basket Service config***/
export const basketService = new BasketServiceFire("baskets");
export const basket: Basket = new Basket(basketService);