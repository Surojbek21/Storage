import Dashboard from '../pages/Dashboard/Dashboard';
import Kategoriya from '../pages/Dashboard/Kategoriya';
import Product from '../pages/Dashboard/Kategoriya/product';
import Tovarlar from '../pages/Dashboard/Kategoriya/tovarlar';
import Kontragent from '../pages/Dashboard/Kontragent/kontr';

export const menuList = [
    {
        id: 1,
        path: '/dashboard',
        element: <Dashboard />,
    },

    {
        id: 2,
        path: '/catalog',
        element: <Kategoriya />,
    },

    {
        id: 3,
        path: '/kontragent',
        element: <Kontragent />,
    },
    {
        id: 4,
        path: '/catalog/:id',
        element: <Product />,
    },
    {
        id: 5,
        path: '/catalog/:id/product/:productId',
        element: <Tovarlar />,
    },
    {
        id: 6,
        path: "/kontr"
    },

];
