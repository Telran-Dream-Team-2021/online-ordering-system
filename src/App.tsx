import React, {FC, ReactNode, useEffect, useState} from 'react';
import './App.css';
import {Alert, ThemeProvider} from "@mui/material";
import {theme} from "./config/theme";
import NavigatorResponsive from "./components/common/navigator-responsive";
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {RouteType} from "./models/common/route-type";
import {developmentRoutes, PATH_LISTING, routes} from "./config/routes-config";
import {UserData} from "./models/common/user-data";
import {useDispatch, useSelector} from "react-redux";
import {userDataSelector} from "./redux/store";
import process from "process";
import {Subscription} from "rxjs";
import {authService, basket, catalog} from "./config/services-config";
import ErrorCode from "./models/common/error-code";
import {setBasket, setCatalog, setErrorCode, setUserData} from "./redux/actions";
import UserDataModal from "./components/common/user-data-modal";


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
    const dispatch = useDispatch();
    const [flErrorServer, setFlErrorServer] = useState<boolean>(false);
    const [relevantRoutes, setRelevantRoutes] = useState<RouteType[]>(routes);
    const [flStep2ModalOpen, setFlStep2ModalOpen] = useState<boolean>(false);
    const [navigateTo, setNavigateTo] = useState<string>('');

    useEffect(() => {
        if (authService.isLoginLink()) {
            authService.completeLogin().then(() => {
                setNavigateTo(PATH_LISTING);
            });
        } else if (!!userData.username && !userData.deliveryAddress) {
            setFlStep2ModalOpen(true);
        }

        setRelevantRoutes(getRelevantRoutes((userData)));
    }, [userData])

    useEffect(() => {
        let subscriptionUserData = getUserData();

        function getUserData(): Subscription {
            return authService.getUserData().subscribe({
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
        function getBasketData() {
            return basket.getBasket(userData.username).subscribe({
                next(bd) {
                    console.log("bd");
                    dispatch(setErrorCode(ErrorCode.NO_ERROR));
                    dispatch(setBasket(bd));
                },
                error(err) {
                    dispatch(setErrorCode(err));
                }
            });

        }
        if (!!userData.username) {
            let subscriptionBasketData = getBasketData();
            return () => subscriptionBasketData.unsubscribe();
        }
    }, [dispatch, userData.username]);

    async function logout() {
        return await authService.logout();
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
    }, [])

    return <ThemeProvider theme={theme}>
        {flErrorServer ? <Alert severity='error'>Server is unavailable</Alert> :
            <BrowserRouter>
                <NavigatorResponsive items={relevantRoutes}
                                     logoutFn={!!userData.username ? logout : undefined}/>
                <Routes>
                    {getRoutes()}
                    {!!navigateTo && <Route path={'*'} element={<Navigate to={navigateTo}/>}/>}
                </Routes>
                {<UserDataModal onClose={() => setFlStep2ModalOpen(false)} open={flStep2ModalOpen}/>}
            </BrowserRouter>}
    </ThemeProvider>
}

export default App;
