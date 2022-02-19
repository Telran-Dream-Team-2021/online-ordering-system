import React, {FC} from 'react';
import Button from '@mui/material/Button';
import {UserData} from "../../models/common/user-data";
import {BasketData} from "../../models/basket-data";
import {getTotalSum} from "../../utils/calculatign";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const SummaryCheckoutBlock: FC<{ makeOrderFn: () => void, userState: UserData, basket: BasketData }> = (props) => {
    const {makeOrderFn, userState, basket} = props;
    const [open, setOpen] = React.useState(false);

    function handleState() {
        setOpen(!open)
    }

    return (
        <div style={{
            borderRadius: '3px',
            alignSelf: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignContent: "center",
            alignItems:'center',
            justifyContent: "center",

        }}>
            <div style={{ padding:'12px', alignContent: "center", justifyContent: "center", height: '68px', }}>
                <h2><span style={{color:'#9F5E39'}} >TOTAL:</span> ${getTotalSum(basket.basketItems)}</h2>
            </div>
            <div style={{wordWrap: 'break-word', padding:'12px', alignItems: "center", justifyContent: "center",height: '88px'}}>
                <p style={{margin:'30px', textAlign: 'justify'}}>Address: <LocationOnIcon fontSize='medium'/> {userState.deliveryAddress}</p>
            </div>
            <div style={{margin:'5px',alignSelf: 'center', alignContent:"center",alignItems: "center", justifyContent: "center",height: '100px'}}>
                <Button disabled={!basket.basketItems.length} onClick={() => {
                    makeOrderFn();
                    handleState();
                }} size="large" variant="contained"
                        style={{justifyContent: "center", alignItems:'center', width: '320px', height:'97px'}}>
                    CREATE ORDER
                </Button>
            </div>
        </div>
    );
};

export default SummaryCheckoutBlock;