import React from 'react';
import Button from '@mui/material/Button';
import {UserData} from "../../../../models/common/user-data";
import {useDispatch, useSelector} from "react-redux";
import {userDataSelector} from "../../../../redux/store";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const SummaryCheckoutBlock = () => {

    const userData: UserData = useSelector(userDataSelector);
    // const productData: ProductData[] = useSelector(catalogSelector);
    const dispatch = useDispatch();



    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '70%',
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <h2>TOTAL: XXXXX</h2>
            <LocationOnIcon fontSize="medium"/>
            <p>{userData.deliveryAddress}</p>
            <Button size="large" variant="contained">
                MAKE AN ORDER
            </Button>
        </div>
    );
};

export default SummaryCheckoutBlock;