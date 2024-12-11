import {
    ApiTwoTone,
    CalculatorTwoTone,
    DiffTwoTone,
    FolderOpenTwoTone,
    FundTwoTone,
    SettingTwoTone,
} from '@ant-design/icons';

export const menu = [
    {
        id: 1,
        name: 'Справочник',
        path: '/dashboard',
        img: <FolderOpenTwoTone />,
        children: [
            {
                id: 2,
                title: 'Товары',
                path: '/catalog',
            },

            {
                id: 5,
                title: 'Контрагенты',
                path: '/counterparty',
            },
        ],
    },

    {
        id: 9,
        name: 'документы',
        path: '/hujjatlar',
        img: <DiffTwoTone />,
        children: [
            {
                id: 10,
                title: 'продукты',
                path: '/mahsulotlar',
            },
            {
                id: 11,
                title: 'курс валюты',
                path: '/currency',
            },
            {
                id: 14,
                title: 'Заказы',
                path: '/orders',
            },

            {
                id: 15,
                title: 'Получитъ',
                path: '/get',
            },
        ],
    },
    {
        id: 16,
        name: 'отчеты',
        path: '/statics',
        img: <FundTwoTone />,
        children: [
            {
                id: 17,
                title: 'Продажи',
                path: '/sotish',
            },
            {
                id: 18,
                title: 'Резльтаты',
                path: '/natijalar',
            },
            {
                id: 19,
                title: 'Долги',
                path: '/qarzlar',
            },

            {
                id: 20,
                title: 'Затраты',
                path: '/narxi',
            },

            {
                id: 21,
                title: 'Остатки',
                path: '/qolganlari',
            },

            {
                id: 22,
                title: 'Оборот товара',
                path: '/aylanma',
            },

            {
                id: 23,
                title: 'Запас',
                path: '/zapas',
            },
        ],
    },
    {
        id: 24,
        name: 'Анализи',
        path: '/tahlil',
        img: <CalculatorTwoTone />,
        children: [
            {
                id: 25,
                title: 'Акция',
                path: '/aksiya',
            },
        ],
    },
    {
        id: 26,
        name: 'сервис',
        path: '/server',
        img: <ApiTwoTone />,
        children: [
            {
                id: 27,
                title: 'Журнал',
                path: '/jurnal',
            },
            {
                id: 28,
                title: 'Настройки',
                path: '/nastroyka',
            },
            {
                id: 29,
                title: 'Телеграм',
                path: '/telegram',
            },
            {
                id: 30,
                title: 'Зарплатыа',
                path: '/ish haqi',
            },
            {
                id: 31,
                title: 'Полъзователи',
                path: '/Foydalanuvchilar',
            },

            {
                id: 32,
                title: 'FAQ',
                path: '/yordam',
            },
            {
                id: 33,
                title: 'Регистрация',
                path: '/',
            },
            {
                id: 34,
                title: 'O программе',
                path: '/',
            },
        ],
    },
    {
        id: 35,
        name: 'Settings',
        path: '/settings',
        img: <SettingTwoTone />,
        children: [],
    },
];
