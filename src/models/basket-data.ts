import {ItemData} from "./item-data";

export type BasketData = {
    basketItems: ItemData[],
    userId: string
}
export const emptyBasket: BasketData = {
    basketItems: [], userId: ""
}