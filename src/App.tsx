import React, {FC, ReactNode, useEffect, useState} from 'react';
import './App.css';
import {Alert, ThemeProvider} from "@mui/material";
import {theme} from "./config/theme";
import NavigatorResponsive from "./components/common/navigator-responsive";
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {RouteType} from "./models/common/route-type";
import {routes} from "./config/routes-config";
import {Subscription} from "rxjs";
import {catalogSelector} from "./redux/store";
import {catalog} from "./config/services-config";
import {setCatalog, setErrorCode} from "./redux/actions";
import {useDispatch} from "react-redux";
import ErrorCode from "./models/common/error-code";

const App: FC = () => {
    const dispatch = useDispatch();
    const [flErrorServer, setFlErrorServer] = useState<boolean>(false);
    const [relevantRoutes, setRelevantRoutes] = useState<RouteType[]>(routes);
    // useEffect(() => {
    //     setRelevantRoutes(getRelevantRoutes((userData)));
    //
    // }, [userData])

    function getRoutes(): ReactNode[] {
        return relevantRoutes.map((r: RouteType) => <Route key={r.path} path={r.path} element={r.element}/>)
    }

    useEffect(() => {
        let subscription: any;
        subscription = getData();

        function getData(): Subscription {
            subscription && subscription.unsubscribe();
            return catalog.getAllProducts().subscribe({
                next(arr) {
                    dispatch(setErrorCode(ErrorCode.NO_ERROR));
                    dispatch(setCatalog(arr))
                },
                error(err) {
                    dispatch(setErrorCode(err));
                    setTimeout(() => {
                        subscription = getData()
                    }, 2000);
                }
            })
        }

        return () => subscription.unsubscribe();
    }, [])

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
