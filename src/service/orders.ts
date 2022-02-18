import DataProvider from "./data-provider";
import {Observable} from "rxjs";
import {OrderData, statuses} from "../models/order-data";
import {BasketData} from "../models/basket-data";
import {getUuidByOrder} from "../utils/uuid";
import {basketService} from "../config/services-config";
import {UserData} from "../models/common/user-data";


export default class Orders {
    constructor(private ordersService: DataProvider<OrderData>) {}

    async addOrder(basket: BasketData, userData: UserData): Promise<OrderData> {
        console.log('addOrder')
        console.log(basket)
        const order: OrderData = {
            orderId: getUuidByOrder(),
            orderItems: basket.basketItems,
            userId: basket.userId,
            deliveryAddress: userData.deliveryAddress || 'Beer Sheva',
            status: statuses[statuses.created],
            deliveryDate: getDeliveryDate(),
            lastEditionDate: getLastEditionDate()
        }
        return this.ordersService.add(order);
    }

    updateOrder(productId: string | number, newOrderData: OrderData): Promise<OrderData> {
        return this.ordersService.update(productId, newOrderData);
    }
    removeOrder(productId: number): Promise<OrderData> {
        return this.ordersService.remove(productId);
    }
    getOrder(productId: number): Promise<OrderData> {
        return this.ordersService.get(productId) as Promise<OrderData>;
    }
    getAllOrders(id?: string | number): Observable<OrderData[]> {
        return this.ordersService.get(id) as Observable<OrderData[]>;
    }
}

const getLastEditionDate = ()=>{
    const res = new Date()
    res.setDate(res.getDate() + 1)
    return res
}

const getDeliveryDate = ()=>{
    const res = new Date()
    res.setDate(res.getDate() + 2)
    return res
}