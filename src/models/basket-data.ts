import {ItemData} from "./item-data";

export type BasketData = {
    basketItems: ItemData[],
    userId: string | number
}
export const emptyBasket: BasketData = {
    basketItems: [], userId: ""
}