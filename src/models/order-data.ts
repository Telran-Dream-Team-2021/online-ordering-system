import {ItemData} from "./item-data";
import {Timestamp} from "firebase/firestore";

export enum statuses {
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
    status: string,
    deliveryDate: Date,
    lastEditionDate: Date,
}