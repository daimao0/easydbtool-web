import {createBrowserRouter, Navigate} from "react-router-dom";
import {Home, MySQL, MySQLDatabase, MySQLDatasource, MySQLTable} from "./lazy.tsx";
import Guide from "../pages/home/guide";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to={"/home"} replace/>,
    }, {
        path: "*",
        element: <div>404</div>
    },
    {
        path: "/home",
        element: <Home/>,
        children: [{
            index: true,
            element: <Guide/>
        }, {
            path: 'mysql',
            element: <MySQL/>,
            children: [{
                path: "datasource",
                element: <MySQLDatasource/>
            }, {
                path: ":datasourceId/database",
                element: <MySQLDatabase/>
            }, {
                path: ":datasourceId/database/:databaseName/table",
                element: <MySQLTable/>
            }]
        }, {
            path: "a",
            element: <div>aaa</div>
        }, {
            path: "b",
            element: <div>bbb</div>
        }, {
            path: "*",
            element: <Navigate to={"/home"} replace/>
        }]
    }
])

export default router