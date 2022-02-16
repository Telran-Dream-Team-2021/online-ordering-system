import {OrderData} from "../models/order-data";
import {FC} from "react";
import {getRandomOrder} from "../utils/random";
import {Button} from "@mui/material";
import {BasketData} from "../models/basket-data";
import {useSelector} from "react-redux";
import {basketSelector} from "../redux/store";

type AddOrderForm = {
    addOrderFn: (basket: BasketData) => void
}

const AddOrderForm: FC<AddOrderForm> = (props)=>{
    const {addOrderFn} = props
    const basket = useSelector(basketSelector)
    console.log('basket', basket)
    return (
        <Button onClick={()=>addOrderFn(basket)}>add my basket</Button>
    )
}

export default AddOrderForm