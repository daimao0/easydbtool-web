import {lazy} from "react";

export const Home = lazy(() => import("../pages/home"))
export const MySQL = lazy(() => import("../pages/mysql/index"))
export const MySQLDatasource = lazy(() => import("../pages/mysql/datasource"))
export const MySQLDatabase = lazy(() => import("../pages/mysql/database"))
export const MySQLTable = lazy(() => import("../pages/mysql/table"))
