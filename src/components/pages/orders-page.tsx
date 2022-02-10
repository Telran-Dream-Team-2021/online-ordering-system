import React from 'react';
import AddOrderForm from "../add-order-form";
import {addOrderAction} from "../../redux/actions";
import {useDispatch} from "react-redux";

const OrdersPage = () => {
    const dispatch = useDispatch()
    return (
        <div>
            <h1>OrdersPage</h1>
            <AddOrderForm addOrderFn={(order)=>dispatch(addOrderAction(order))}></AddOrderForm>
        </div>
    );
};

export default OrdersPage;