import {ReactNode} from "react";

export type RouteType = {
    path: string;
    element: ReactNode;
    label: string;
    authenticated?: boolean;
    adminOnly?: boolean;
    childRoutes?: RouteType[];
    indexElement?: ReactNode;
}