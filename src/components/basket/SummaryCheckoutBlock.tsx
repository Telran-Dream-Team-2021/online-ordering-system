import React, {FC} from 'react';
import Button from '@mui/material/Button';
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, ordersSelector, userDataSelector} from "../../redux/store";
import {UserData} from "../../models/common/user-data";
import {BasketData} from "../../models/basket-data";
import {getTotalSum} from "../../utils/calculatign";
import CustomizedSnackbars from "../common/popup-info";

const SummaryCheckoutBlock: FC<{ makeOrderFn: () => void, userState: UserData, basket: BasketData }> = (props) => {
    const {makeOrderFn, userState, basket} = props;
    const [open, setOpen] = React.useState(false);

    function handleState() {
        setOpen(!open)
    }

    return (
        <div style={{height: 300, width: '100%', alignContent: "center", justifyContent: "center"}}>
            <h2>TOTAL: ${getTotalSum(basket.basketItems)}</h2>
            <p>Address: {userState.deliveryAddress}</p>
            <Button disabled={!basket.basketItems.length} onClick={() => {
                makeOrderFn();
                handleState();
            }} size="large" variant="contained"
                    style={{maxWidth: '150px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}}>
                CREATE ORDER
            </Button>
        </div>
    );
};

export default SummaryCheckoutBlock;