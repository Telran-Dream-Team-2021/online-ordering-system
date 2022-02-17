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
import {authService, basket, catalog, userDataProcessor} from "./config/services-config";
import ErrorCode from "./models/common/error-code";
import {logoutAction, setBasket, setCatalog, setErrorCode, setUserData} from "./redux/actions";

function getRelevantRoutes(userData: UserData): RouteType[] {
    let resRoutes: RouteType[] = routes;

    if (process.env.NODE_ENV === 'development') {
        resRoutes = resRoutes.concat(developmentRoutes);
    }

    return resRoutes.filter((route) => {
        return (route.authenticated === undefined && route.adminOnly === undefined)
            || (!!userData.username && route.authenticated)
            || (userData.isAdmin && route.adminOnly === true)
            || (!userData.username && !route.authenticated && !route.adminOnly);
    });
}

const App: FC = () => {
    const userData: UserData = useSelector(userDataSelector);
    const errorCode: ErrorCode = useSelector(errorCodeSelector);
    const dispatch = useDispatch();
    const [relevantRoutes, setRelevantRoutes] = useState<RouteType[]>(routes);
    const [navigateTo, setNavigateTo] = useState<string>('');

    useEffect(() => {
        if (authService.isLoginLink()) {
            authService.completeLogin().then(() => {
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
            console.log(userData.username)
            return basket.getBasket(userData.username).subscribe({
                next(bd) {
                    console.log("basket next");
                    console.log(bd)
                    dispatch(setErrorCode(ErrorCode.NO_ERROR));
                    dispatch(setBasket(bd));
                },
                error(err) {
                    console.log('error basket observable')
                    console.log(err)
                    dispatch(setErrorCode(err));
                }
            });

        }
        if (!!userData.username) {
            subscriptionBasketData = getBasketData();
            return () => {
                console.log('unsubscribe')
                return subscriptionBasketData.unsubscribe();
            }
        }
    }, [userData.username]);// eslint-disable-line react-hooks/exhaustive-deps

    async function logout() {
         dispatch(logoutAction());
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
                {<NavigatorResponsive items={relevantRoutes}
                                     logoutFn={!!userData.username ? logout : undefined}/>}
                <Routes>
                    {getRoutes()}
                    {!!navigateTo && <Route path={'*'} element={<Navigate to={navigateTo}/>}/>}
                    <Route path={'/'} element={<Navigate to={PATH_LISTING}/>}/>
                </Routes>
            </BrowserRouter>}
    </ThemeProvider>
}
export default App;