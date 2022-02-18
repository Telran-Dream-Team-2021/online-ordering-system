import {Tabs, Tab, IconButton, Grid} from "@mui/material";
import {useState, FC, ReactNode, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {RouteType} from "../../models/common/route-type";
import * as React from 'react';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {BasketData} from "../../models/basket-data";
import {useSelector} from "react-redux";
import {basketSelector, userDataSelector} from "../../redux/store";
import {PATH_BASKET, PATH_LOGIN} from "../../config/routes-config";
import {UserData} from "../../models/common/user-data";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function getInitialActiveTabIndex(path: string, items: RouteType[]): number {
    let res = items.findIndex(item => path === item.path);

    return res < 0 ? 0 : res

}

const NavigatorWeb: FC<{ items: RouteType[], logoutFn?: () => void }> = (props) => {
    const basket: BasketData = useSelector(basketSelector);
    const userData: UserData = useSelector(userDataSelector);
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTabIndex, setActiveTab] = useState(getInitialActiveTabIndex(location.pathname, props.items));

    useEffect(() => {
        setActiveTab(getInitialActiveTabIndex(location.pathname, props.items));
    }, [props.items, location])

    function getTabs(): ReactNode[] {
        return props.items.map(item => <Tab icon={item.icon} iconPosition='start' key={item.label} to={item.path}
                                            component={Link} label={item.label} sx={{fontWeight: 600}}/>)
    }

    function onChangeHandler(event: any, newValue: number) {
        setActiveTab(newValue);
    }

    return <Grid container spacing={3} sx={{alignItems: 'center', px: 2}}>
        <Grid item xs={2} sx={{textTransform: 'uppercase', fontFamily: 'Ramaraja', color: 'primary.main', fontWeight: 600}}>
            Tel-ran<br/>Store
        </Grid>
        <Grid item xs={8} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Tabs value={activeTabIndex >= props.items.length ? 0 : activeTabIndex} onChange={onChangeHandler}>
                {getTabs()}
            </Tabs>
        </Grid>

        <Grid item xs={2} sx={{textAlign: 'end'}}>
            {(!!userData.username && !userData.isAdmin)
                && <IconButton aria-label="cart" onClick={() => navigate(!props.logoutFn ? PATH_LOGIN : PATH_BASKET)}>
                    <Badge color="secondary" badgeContent={basket.basketItems.length}>
                        <ShoppingCartIcon/>
                    </Badge>
                </IconButton>}
            {!!props.logoutFn && <IconButton sx={{color: 'primary.main'}} onClick={props.logoutFn}>
                <ExitToAppIcon sx={{mx: 2}}/>
            </IconButton>}
        </Grid>
    </Grid>
}
export default NavigatorWeb;