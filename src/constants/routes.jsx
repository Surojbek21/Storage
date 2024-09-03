import Dashboard from '../pages/Dashboard/Dashboard';
import Gruppatovar from '../pages/Dashboard/Gruppatovar/Gruppatovar';
import Kategoriya from '../pages/Dashboard/Kategoriya';
import Product from '../pages/Dashboard/Kategoriya/product';
import Kontragent from '../pages/Dashboard/Kontragent/kontr';
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
    // {
    //     id: 4,
    //     path: '/gruppa-tovar',
    //     element: <Gruppatovar />,
    // },
    {
        id: 5,
        path: '/kontragent',
        element: <Kontragent/>,
    },
    {
        id: 6,
        path: "/catalog/:id",
        element: <Product />
    }
   
];
