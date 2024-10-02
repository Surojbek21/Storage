import Dashboard from '../pages/Dashboard/Dashboard';
import Kategoriya from '../pages/Dashboard/Kategoriya';
import Product from '../pages/Dashboard/Kategoriya/product';
import Tovarlar from '../pages/Dashboard/Kategoriya/tovarlar';
import Counterparty from '../pages/Dashboard/Kontragent/kontr';
import Currency from '../pages/Document/currency/currency';
import Get from '../pages/Document/get';
import InputComponent from '../pages/Document/olish';

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
        path: '/counterparty',
        element: <Counterparty />, // Updated path for customers and providers
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
        path: '/currency',
        element: <Currency />,
    },
    {
        id: 7,
        path: '/get',
        element: <Get />,
    },
    {
        id: 8,
        path: '/get/:id',
        element: <InputComponent />,
    },
];
