import {Tabs, Tab, IconButton} from "@mui/material";
import {useState, FC, ReactNode, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import {RouteType} from "../../models/common/route-type";
import LogoutIcon from "@mui/icons-material/Logout";
import * as React from 'react';
import Badge, {BadgeProps} from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {BasketData} from "../../models/basket-data";
import {useSelector} from "react-redux";
import {basketSelector} from "../../redux/store";

function getInitialActiveTabIndex(path: string, items: RouteType[]): number {
    let res = items.findIndex(item => path === item.path);

    return res < 0 ? 0 : res

}

const NavigatorWeb: FC<{ items: RouteType[], logoutFn?: () => void }> = (props) => {
    const basket: BasketData = useSelector(basketSelector);
    const location = useLocation();

    const [activeTabIndex, setActiveTab] = useState(getInitialActiveTabIndex(location.pathname, props.items));
    useEffect(() => {
        setActiveTab(getInitialActiveTabIndex(location.pathname, props.items));
    }, [props.items])

    function getTabs(): ReactNode[] {
        return props.items.map(item => <Tab key={item.label} component={Link} to={item.path} label={item.label}/>)
    }

    function onChangeHandler(event: any, newValue: number) {
        setActiveTab(newValue);
    }

    return <Tabs value={activeTabIndex >= props.items.length ? 0 : activeTabIndex} onChange={onChangeHandler}>
        {getTabs()}
        {<IconButton aria-label="cart">
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