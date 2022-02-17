import React, {FC} from 'react';
import Button from '@mui/material/Button';
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, ordersSelector, userDataSelector} from "../../redux/store";

const SummaryCheckoutBlock: FC<{ makeOrderFn: () => void }> = (props) => {
    const basketData = useSelector(basketSelector);
    const orderData = useSelector(ordersSelector);
    const {makeOrderFn} = props;
    const dispatch = useDispatch();
    const userState = useSelector(userDataSelector);


    return (
        <div style={{height: 300, width: '100%', alignContent: "center", justifyContent: "center"}}>
            <h2>TOTAL: XXXXX</h2>
            <p>{userState.deliveryAddress}</p>
            <Button disabled={!basketData.basketItems.length} onClick={() => {
                makeOrderFn();
            }} size="large" variant="contained"
                    style={{maxWidth: '150px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}}>
                ORDER
            </Button>

        </div>
    );
};

export default SummaryCheckoutBlock;