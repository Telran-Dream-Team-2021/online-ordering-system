import {OrderData} from "../models/order-data";
import {FC, useState} from "react";
import {getRandomOrder} from "../utils/random";

type AddOrderForm = {
    addOrderFn: (order: OrderData) => void
}

const AddOrderForm: FC<AddOrderForm> = (props)=>{
    const {addOrderFn} = props
    const [orderState, setOrderState] = useState<OrderData>(getRandomOrder())
    return (
        <button onClick={()=>addOrderFn(orderState)}>add random order</button>
    )
}

export default AddOrderForm