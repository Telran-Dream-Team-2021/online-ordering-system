import {OrderData} from "../models/order-data";
import {FC} from "react";
import {getRandomOrder} from "../utils/random";
import {Button} from "@mui/material";

type AddOrderForm = {
    addOrderFn: (order: OrderData) => void
}

const AddOrderForm: FC<AddOrderForm> = (props)=>{
    const {addOrderFn} = props

    return (
        <Button onClick={()=>addOrderFn(getRandomOrder())}>add random order</Button>
    )
}

export default AddOrderForm