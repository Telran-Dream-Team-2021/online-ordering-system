import ProductServiceFire from "../service/product-service-fire";
import Catalog from "../service/catalog";

/*** Product Service Config ***/
const productService = new ProductServiceFire("products");
export const catalog: Catalog = new Catalog(productService);