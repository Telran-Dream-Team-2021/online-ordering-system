import {OrderData, statuses} from "../models/order-data";
import {ItemData} from "../models/item-data";
import {getUuidByProduct, getUuidByUser} from "./uuid";

export const getRandomOrder: ()=>OrderData = ()=>{
    const order: OrderData = {
        orderId: '',
        orderItems: getRandomItems(5),
        userId: getUuidByUser(),
        deliveryAddress: "Beer Sheva, Sderot 3",
        status: statuses[statuses.created],
        deliveryDate: getLastEditionDate(),
        lastEditionDate: getDeliveryDate()
    };
    return order
}

export const getRandomItems:(count: number)=>ItemData[] = count =>{
    const res: ItemData[] = []
    for(let i=0; i<count; i++){
        res.push({
            productId: getUuidByProduct(),
            pricePerUnit: getRandomPrice(),
            quantity: getRandomQuantity()
        })
    }
    return res
}

function getRandomPrice(): number {
    return getRandomInt(1000)
}

function getRandomQuantity(): number {
    return getRandomInt(10)
}

const getRandomInt = (max: number)=> {
    return Math.floor(Math.random() * max);
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