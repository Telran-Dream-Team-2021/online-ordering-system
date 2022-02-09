import DataProvider from "./data-provider";
import {ProductData} from "../models/product-data";
import {Observable} from "rxjs";


export default class Catalog {
    constructor(private productService: DataProvider<ProductData>) {}
    addProduct(product: ProductData): Promise<ProductData> {
        throw new Error("Method not implemented.");
    }
    updateProduct(productId: number, newProductData: ProductData): Promise<ProductData> {
        throw new Error("Method not implemented.");
    }
    removeProduct(productId: number): Promise<ProductData> {
        throw new Error("Method not implemented.");
    }
    getProduct(productId: number): Promise<ProductData> {
        throw new Error("Method not implemented.");
    }
    getAllProducts(): Observable<ProductData[]> {
        throw new Error("Method not implemented.");
    }
}