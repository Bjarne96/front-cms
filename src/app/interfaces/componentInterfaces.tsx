import { ReactElement } from "react";

//Interface for route object
export interface IRouteObject {
    path: string,
    component: (props?) => ReactElement<any,any>,
    title: string,
    exact: boolean,
    showInSidebar: boolean
}
//Interface for routes array
export interface IRouteArray extends Array<IRouteObject>{}