import {Box, useMediaQuery, useTheme} from "@mui/material";
import {FC} from "react";
import {RouteType} from "../../models/common/route-type";
import NavigatorWeb from "./navigator-web";
import NavigatorDrawer from "./navigator-mobile";


const NavigatorResponsive: FC<{ items: RouteType[], logoutFn?: () => void }> = (props) => {
    const theme = useTheme();
    const isMobileOrLaptop = useMediaQuery(theme.breakpoints.up('md'));
    return <Box sx={{height: '10vh'}}>
        {isMobileOrLaptop ? <NavigatorWeb items={props.items} logoutFn={props.logoutFn}/>
            : <NavigatorDrawer items={props.items} logoutFn={props.logoutFn}/>}
    </Box>
}
export default NavigatorResponsive;


