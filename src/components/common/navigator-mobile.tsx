import {Box, Drawer, IconButton, Tab, Tabs, Toolbar, Typography} from '@mui/material';
import {FC, useEffect, useState} from 'react';

import {Link, useLocation, useNavigate} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import {RouteType} from '../../models/common/route-type';
import LogoutIcon from "@mui/icons-material/Logout";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import * as React from "react";
import {BasketData} from "../../models/basket-data";
import {useSelector} from "react-redux";
import {basketSelector, userDataSelector} from "../../redux/store";
import {PATH_BASKET, PATH_LOGIN} from "../../config/routes-config";
import {UserData} from "../../models/common/user-data";

function getInitialActiveTabIndex(path: string, items: RouteType[]): number {
    let res = items.findIndex(item => path === item.path);
    return res < 0 ? 0 : res;

}

const NavigatorDrawer: FC<{ items: RouteType[], logoutFn?: () => void }> = (props) => {
    const basket: BasketData = useSelector(basketSelector);
    const userData: UserData = useSelector(userDataSelector);
    const {items, logoutFn} = props;
    const path = useLocation().pathname;
    const [activeTabIndex, setActiveTab] = useState(getInitialActiveTabIndex(path, items));
    const [label, setLabel] = useState(items[activeTabIndex].label);
    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(getInitialActiveTabIndex(path, items));
        setLabel(items[activeTabIndex].label);
    }, [items, path]);// eslint-disable-line react-hooks/exhaustive-deps
    document.title = label;

    const [displayDrawer, setStateDrawer] = useState(false);

    const showDrawer = () => {
        setStateDrawer(true);
    }

    const closeDrawer = () => {
        setStateDrawer(false);
    }

    function onChangeHandler(event: React.SyntheticEvent, newValue: number) {
        setActiveTab(newValue);
    }

    const getTabs = (orientation: "vertical" | "horizontal") => (
        <Tabs
            orientation={orientation}
            variant="scrollable"
            value={activeTabIndex}
            onChange={onChangeHandler}
        >
            {items.map((item) => (
                <Tab
                    key={item.label}
                    component={Link}
                    to={item.path}
                    label={item.label}
                    onClick={() => setLabel(item.label)}
                />
            ))}
        </Tabs>
    );

    return (
        <Toolbar disableGutters sx={{backgroundColor: ''}}>
            <Box>
                <Toolbar>
                    <IconButton
                        onClick={showDrawer}
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2, flexGrow: '1'}}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
                <Drawer
                    anchor='left'
                    open={displayDrawer}
                    onClose={closeDrawer}
                >
                    <Box
                        sx={{width: 250}}
                        role="presentation"
                        onClick={closeDrawer}
                        aria-label="Mobile menu"
                    >
                        {getTabs('vertical')}
                    </Box>
                </Drawer>
            </Box>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                    textAlign: 'center',
                    flexGrow: '2'
                }}
            >
                {label}
            </Typography>
            {(!!userData.uid && !userData.isAdmin)
                && <IconButton aria-label="cart" onClick={() => navigate(!props.logoutFn ? PATH_LOGIN : PATH_BASKET)}>
                <Badge color="secondary" badgeContent={basket.basketItems.length}>
                    <ShoppingCartIcon/>
                </Badge>
            </IconButton>}
            {!!logoutFn && <IconButton sx={{flexGrow: '1'}} edge="end" onClick={logoutFn}>
                <LogoutIcon/>
            </IconButton>}

        </Toolbar>
    );
};

export default NavigatorDrawer;