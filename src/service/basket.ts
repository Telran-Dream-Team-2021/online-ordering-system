import DataProvider from "./data-provider";
import {BasketData} from "../models/basket-data";
import {basketService} from "../config/services-config";
import {ProductData} from "../models/product-data";
import {ItemData} from "../models/item-data";
import _ from 'lodash'

import {Observable} from "rxjs";

export default class Basket {
    constructor(private basketService: DataProvider<BasketData>) {
    }

    async addItem(userId: string | number, product: ProductData): Promise<BasketData> {
        const item: ItemData = {pricePerUnit: product.price, productId: product.productId, quantity: 1};
        const basket = await basketService.get(userId.toString()) as BasketData
        if (basket) {
            const indexId = basket.basketItems.findIndex((element) => element.productId === item.productId);
            if (-1 === indexId) {
                basket.basketItems.push(item);
            }
             else {
                basket.basketItems[indexId].quantity += 1;
            }
            return await this.basketService.update(basket.userId, _.cloneDeep(basket));
        } else {
            return await this.basketService.add({basketItems: [item], userId: userId.toString()});
        }
    }

    async updateBasket(id: string | number, basket: BasketData): Promise<BasketData>{
        return await this.basketService.update(id, _.cloneDeep(basket))
    }

    removeItem(basket: BasketData, productId: number): Promise<BasketData> {
        const indexId = basket.basketItems.findIndex((element) => element.productId === productId);
        if (-1 !== indexId) {
            if (basket.basketItems[indexId].quantity <= 1) {
                // console.log("qty 1")
                 basket.basketItems.splice(indexId, 1);
                // console.log(basket.basketItems)
            } else {
                basket.basketItems[indexId].quantity -= 1;
            }
        }
        return this.basketService.update(basket.userId, basket);
    }

    getBasket(userId: string): Observable<BasketData> {
        return this.basketService.getFirst(userId)
    }

    removeBasket(basket: BasketData): Promise<BasketData>{
        console.log('removeBasket')
        return this.basketService.remove(basket.userId)
    }

    removeLine(basket: BasketData, productId: number): Promise<BasketData> {
        const indexId = basket.basketItems.findIndex((element) => element.productId === productId);
        if (indexId >=0 ) {
            basket.basketItems.splice(indexId, 1);
        }
        return this.basketService.update(basket.userId, basket);
    }
}