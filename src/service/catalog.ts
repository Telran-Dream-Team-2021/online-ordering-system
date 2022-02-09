import DataProvider from "./data-provider";
import {ProductData} from "../models/product-data";
import {Observable} from "rxjs";


export default class Catalog {
    constructor(private productService: DataProvider<ProductData>) {}
    addProduct(product: ProductData): Promise<ProductData> {
        return this.productService.add(product);
    }
    updateProduct(productId: number, newProductData: ProductData): Promise<ProductData> {
        return this.productService.update(productId, newProductData);
    }
    removeProduct(productId: number): Promise<ProductData> {
        return this.productService.remove(productId);
    }
    getProduct(productId: number): Promise<ProductData> {
        return this.productService.get(productId) as Promise<ProductData>;
    }
    getAllProducts(): Observable<ProductData[]> {
        return this.productService.get() as Observable<ProductData[]>;
    }
}