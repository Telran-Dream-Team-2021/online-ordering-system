import DataProvider from "./data-provider";
import {BasketData} from "../models/basket-data";

export default class Basket {
    constructor(private basketService: DataProvider<BasketData>) {}
    addProduct(basket: BasketData): Promise<BasketData> {
        return this.basketService.add(basket);
    }
    updateBasket(basketId: number, newProductData: BasketData): Promise<BasketData> {
        return this.basketService.update(basketId, newProductData);
    }
    removeBasket(basketId: number): Promise<BasketData> {
        return this.basketService.remove(basketId);
    }
    getBasket(basketId: number): Promise<BasketData> {
        return this.basketService.get(basketId) as Promise<BasketData>;
    }
}