import Kategoriya from '../pages/Dashboard/Kategoriya';
import Product from '../pages/Dashboard/Kategoriya/product';
import Tovarlar from '../pages/Dashboard/Kategoriya/tovarlar';
import Counterparty from '../pages/Dashboard/Kontragent/kontr';
import Currency from '../pages/Document/currency/currency';
import Get from '../pages/Document/get';
import Mahsulot from '../pages/Document/mahsulotlar/mahsulot';
import InputComponent from '../pages/Document/olish';
import Return from '../pages/Document/return/return';
import ReturnTwo from '../pages/Document/return/returnTwo';
import Orders from '../pages/Document/zakaz/orders';
import OrderTwo from '../pages/Document/zakaz/ordersTwo';

export const menuList = [
   
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
        path: '/get/olish/:id',
        element: <InputComponent />,
    },
    {
        id: 9,
        path: '/mahsulotlar',
        element: <Mahsulot />,
    },  
    {
        id:10,
        path: '/orders',
        element: <Orders />,
    },
    {
        id:11,
        path: '/orders/orders/:id',
        element: <OrderTwo />,
    },
    {
        id: 12,
        path: '/return',
        element: <Return/>
    },
    {
        id: 13,
        path: '/return/return/:id',
        element: <ReturnTwo/>
    }
];
