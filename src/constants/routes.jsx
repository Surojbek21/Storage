import Dashboard from '../pages/Dashboard/Dashboard';
import Kategoriya from '../pages/Dashboard/Katalog';
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
    }
   
];
