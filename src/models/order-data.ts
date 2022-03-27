import {ItemData} from "./item-data";

export enum statuses {
    created,
    inProgress,
    shipped,
    delivered,
    cancelled
}

export type OrderData = {
    orderId: number | string,
    orderItems: ItemData[],
    userId: string,
    deliveryAddress?: string,
    status: string,
    deliveryDate: Date,
    lastEditionDate: Date,
}