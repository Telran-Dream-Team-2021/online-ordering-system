import {ItemData} from "./item-data";

enum statuses {
    created,
    inProgress,
    shipped,
    delivered,
    cancelled
}

export type OrderData = {
    orderId: number | string,
    OrderItems: ItemData[],
    userId: string,
    deliveryAddress?: string,
    status: statuses,
    deliveryDate: Date,
    lastEditionDate: Date,
}