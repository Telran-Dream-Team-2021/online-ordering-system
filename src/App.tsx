import React, {FC, ReactNode, useState} from 'react';
import './App.css';
import {Alert, ThemeProvider} from "@mui/material";
import {theme} from "./config/theme";
import NavigatorResponsive from "./components/common/navigator-responsive";
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {RouteType} from "./models/common/route-type";
import {routes} from "./config/routes-config";

const App: FC = () => {

    const [flErrorServer, setFlErrorServer] = useState<boolean>(false);
    const [relevantRoutes, setRelevantRoutes] = useState<RouteType[]>(routes);
    // useEffect(() => {
    //     setRelevantRoutes(getRelevantRoutes((userData)));
    //
    // }, [userData])

    function getRoutes(): ReactNode[] {
        return relevantRoutes.map((r: RouteType) => <Route key={r.path} path={r.path} element={r.element}/>)
    }

    return <ThemeProvider theme={theme}>
        {flErrorServer ? <Alert severity='error'>Server is unavailable</Alert> :
            <BrowserRouter>
                <NavigatorResponsive items={relevantRoutes}/>
                : <Routes>
                {getRoutes()}
                <Route path={'*'} element={<Navigate to={relevantRoutes[0].path}/>}/>
            </Routes>
            </BrowserRouter>}
    </ThemeProvider>
}

export default App;
