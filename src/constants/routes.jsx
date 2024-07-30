import Dashboard from "../pages/Dashboard/Dashboard";
import Tovar from "../pages/Dashboard/Tovar";
import Statics from "../pages/statics";

export const menuList = [
    {
        id: 0,
        path: '/storage',
        element: <Storage />
    },
    {
        id: 1,
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        id: 2,
        path: '/statics',
        element: <Statics />
    },
    {
        id: 3,
        path: '/tovar',
        element: <Tovar />
    }
]