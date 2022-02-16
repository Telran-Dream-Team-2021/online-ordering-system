import DataProvider from "./data-provider";
import {Observable} from "rxjs";
import {OrderData} from "../models/order-data";


export default class Orders {
    constructor(private productService: DataProvider<OrderData>) {}
    addOrder(product: OrderData): Promise<OrderData> {
        return this.productService.add(product);
    }
    updateOrder(productId: string | number, newOrderData: OrderData): Promise<OrderData> {
        return this.productService.update(productId, newOrderData);
    }
    removeOrder(productId: number): Promise<OrderData> {
        return this.productService.remove(productId);
    }
    getOrder(productId: number): Promise<OrderData> {
        return this.productService.get(productId) as Promise<OrderData>;
    }
    getAllOrders(): Observable<OrderData[]> {
        return this.productService.get() as Observable<OrderData[]>;
    }
}