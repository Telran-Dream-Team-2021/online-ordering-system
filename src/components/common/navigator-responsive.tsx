import {useMediaQuery, useTheme} from "@mui/material";
import {FC} from "react";
import {RouteType} from "../../models/common/route-type";
import NavigatorWeb from "./navigator-web";
import NavigatorDrawer from "./navigator-mobile";

const NavigatorResponsive: FC<{ items: RouteType[] }> = (props) => {
    const theme = useTheme();
    const isMobileOrLaptop = useMediaQuery(theme.breakpoints.up('md'));
    return <div>
        {isMobileOrLaptop ? <NavigatorWeb items={props.items}></NavigatorWeb> :
            <NavigatorDrawer items={props.items}></NavigatorDrawer>}
    </div>
}
export default NavigatorResponsive;


