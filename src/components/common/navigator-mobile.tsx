import {AppBar, Box, Container, Drawer, IconButton, Tab, Tabs, Toolbar, Typography} from '@mui/material';
import {FC, useEffect, useState} from 'react';

import {Link, useLocation} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import {RouteType} from '../../models/common/route-type';
import LogoutIcon from "@mui/icons-material/Logout";


function getInitialActiveTabIndex(path: string, items: RouteType[]): number {
    let res = items.findIndex(item => path === item.path);
    return res < 0 ? 0 : res;

}

const NavigatorDrawer: FC<{ items: RouteType[], logoutFn?: () => void }> = (props) => {
    const {items, logoutFn} = props;
    const path = useLocation().pathname;
    const [activeTabIndex, setActiveTab] = useState(getInitialActiveTabIndex(path, items));
    const [label, setLabel] = useState(items[activeTabIndex].label);

    useEffect(() => {
        setActiveTab(getInitialActiveTabIndex(path, items));
        setLabel(items[activeTabIndex].label);
    }, [items, path])
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
            {items.map((item, index) => (
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
            {!!logoutFn && <IconButton sx={{flexGrow: '1'}} edge="end" onClick={logoutFn}>
                <LogoutIcon/>
            </IconButton>}
        </Toolbar>
    );
};

export default NavigatorDrawer;