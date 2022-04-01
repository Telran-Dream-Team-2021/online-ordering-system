import React, {FC, ReactNode, useEffect, useState} from 'react';
import './App.css';
import {Alert, ThemeProvider} from "@mui/material";
import {theme} from "./config/theme";
import NavigatorResponsive from "./components/common/navigator-responsive";
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {RouteType} from "./models/common/route-type";
import {developmentRoutes, PATH_LISTING, routes} from "./config/routes-config";
import {UserData} from "./models/common/user-data";
import {useDispatch, useSelector} from "react-redux";
import {errorCodeSelector, userDataSelector} from "./redux/store";
import process from "process";
import {Subscription} from "rxjs";
import {basket, catalog, userDataProcessor} from "./config/services-config";
import ErrorCode from "./models/common/error-code";
import {logoutAction, setBasket, setCatalog, setErrorCode, setUserData} from "./redux/actions";

function getRelevantRoutes(userData: UserData): RouteType[] {
    let resRoutes: RouteType[] = routes;

    if (process.env.NODE_ENV === 'development') {
        resRoutes = resRoutes.concat(developmentRoutes);
    }

    return resRoutes.filter((route) => {
        if (route.authenticated === undefined && route.adminOnly === undefined) {
            return true;
        }

        if (!userData.uid) {
            return route.authenticated === false;
        } else {
            let res = route.authenticated !== false;

            if (userData.isAdmin) {
                return res && route.adminOnly !== false;
            } else {
                return res && route.adminOnly !== true;
            }
        }
    });
}

const App: FC = () => {
    const userData: UserData = useSelector(userDataSelector);
    const errorCode: ErrorCode = useSelector(errorCodeSelector);
    const dispatch = useDispatch();
    const [relevantRoutes, setRelevantRoutes] = useState<RouteType[]>(routes);
    const [navigateTo, setNavigateTo] = useState<string>('');

    useEffect(() => {
        if (userDataProcessor.isLoginLink()) {
            userDataProcessor.completeLogin().then(() => {
                setNavigateTo(PATH_LISTING);
            });
        }

        setRelevantRoutes(getRelevantRoutes((userData)));
    }, [userData])

    useEffect(() => {
        let subscriptionUserData: Subscription;
        subscriptionUserData = getUserData();

        function getUserData(): Subscription {
            subscriptionUserData && subscriptionUserData.unsubscribe();
            return userDataProcessor.getUserData().subscribe({
                next(ud) {
                    console.log(ud);
                    dispatch(setErrorCode(ErrorCode.NO_ERROR));
                    dispatch(setUserData(ud));
                },
                error(err) {
                    dispatch(setErrorCode(err));
                }
            });
        }

        return () => subscriptionUserData.unsubscribe();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let subscriptionBasketData: any
        function getBasketData(): Subscription {
            return basket.getBasket(userData.uid).subscribe({
                next(bd) {
                    dispatch(setErrorCode(ErrorCode.NO_ERROR));
                    dispatch(setBasket(bd));
                },
                error(err) {
                    dispatch(setErrorCode(err));
                }
            });

        }
        if (!!userData.uid) {
            subscriptionBasketData = getBasketData();
            return () => {
                return subscriptionBasketData.unsubscribe();
            }
        }
    }, [userData.uid]);// eslint-disable-line react-hooks/exhaustive-deps

    async function logout() {
         dispatch(logoutAction());
         setNavigateTo(PATH_LISTING);
    }

    function getRoutes(): ReactNode[] {
        return relevantRoutes.map((r: RouteType) => {
            return <Route key={r.path} path={r.path} element={r.element}>
                {r.indexElement && <Route index element={r.indexElement}/>}
                {r.childRoutes && r.childRoutes.map(r =>
                    <Route key={r.path} path={r.path} element={r.element}/>)}
            </Route>
        });
    }

    useEffect(() => {
        let subscription: any;
        subscription = getCatalogData();

        function getCatalogData(): Subscription {
            subscription && subscription.unsubscribe();
            return catalog.getAllProducts().subscribe({
                next(arr) {
                    dispatch(setErrorCode(ErrorCode.NO_ERROR));
                    dispatch(setCatalog(arr))
                },
                error(err) {
                    dispatch(setErrorCode(err));
                    setTimeout(() => {
                        subscription = getCatalogData()
                    }, 2000);
                }
            })
        }

        return () => subscription.unsubscribe();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    return <ThemeProvider theme={theme}>
        {errorCode === ErrorCode.SERVER_UNAVAILABLE ? <Alert severity='error'>Server is unavailable</Alert> :
            <BrowserRouter>
                {<NavigatorResponsive items={relevantRoutes} isAdmin={userData.isAdmin}
                                     logoutFn={!!userData.uid ? logout : undefined}/>}
                <Routes>
                    {getRoutes()}
                    {!!navigateTo && <Route path={'*'} element={<Navigate to={navigateTo}/>}/>}
                    <Route path={'/'} element={<Navigate to={PATH_LISTING}/>}/>
                </Routes>
            </BrowserRouter>}
    </ThemeProvider>
}
export default App;