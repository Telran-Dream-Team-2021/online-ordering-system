import {Tabs, Tab, IconButton} from "@mui/material";
import {useState, FC, ReactNode, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {RouteType} from "../../models/common/route-type";
import LogoutIcon from "@mui/icons-material/Logout";
import * as React from 'react';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {BasketData} from "../../models/basket-data";
import {useSelector} from "react-redux";
import {basketSelector, userDataSelector} from "../../redux/store";
import {PATH_BASKET, PATH_LOGIN} from "../../config/routes-config";
import {UserData} from "../../models/common/user-data";

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
        return props.items.map(item => <Tab key={item.label} component={Link} to={item.path} label={item.label}/>)
    }

    function onChangeHandler(event: any, newValue: number) {
        setActiveTab(newValue);
    }

    return <Tabs value={activeTabIndex >= props.items.length ? 0 : activeTabIndex} onChange={onChangeHandler}>
        {getTabs()}
        {(!!userData.username && !userData.isAdmin)
            && <IconButton aria-label="cart" onClick={() => navigate(!props.logoutFn ? PATH_LOGIN : PATH_BASKET)}>
            <Badge color="secondary" badgeContent={basket.basketItems.length}>
                <ShoppingCartIcon/>
            </Badge>
        </IconButton>}
        {!!props.logoutFn && <IconButton edge="end" onClick={props.logoutFn}>
            <LogoutIcon/>
        </IconButton>}
    </Tabs>
}
export default NavigatorWeb;