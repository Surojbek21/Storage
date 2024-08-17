import Dashboard from '../pages/Dashboard/Dashboard';
import Gruppatovar from '../pages/Dashboard/Gruppatovar/Gruppatovar';
import Kategoriya from '../pages/Dashboard/Kategoriya';
import Tovar from '../pages/Dashboard/Tovar';



export const menuList = [
    {
        id: 1,
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        id: 2,
        path: '/tovar',
        element: <Tovar />,
    },
    {
        id: 3,
        path: '/catalog',
        element: <Kategoriya />,
    },
    {
        id: 4,
        path: '/gruppa-tovar',
        element: <Gruppatovar />,
    }
   
];
