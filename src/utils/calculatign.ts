import {ItemData} from "../models/item-data";

export function getTotalSum(items: ItemData[]): number {
    const sum = items.reduce((acc, item)=>acc + (item.quantity * item.pricePerUnit), 0)
    return parseFloat(sum.toFixed(2))
}