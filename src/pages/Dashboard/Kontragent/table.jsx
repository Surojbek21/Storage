import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { render } from 'react-dom';

export const Kontrtable = [
    {
        id: 1,
        key: 1,
        наименование: 'Конторгенатор',
        имя: 'azamat',
        регион: 'Хорезм',
        телефон: '+998 93 868 24 48',
        стир: '384492',
        мфо: '384492',
        инн: '494922',
        електронная_почта: 'qgX9v@example.com',
        адрес: 'Ургенч',
        прочее: 'Прочие',
        категория: 'Конторгенатор',
        изменить: <EditOutlined />,
        удалить: <DeleteOutlined />,
    },
    {
        id: 1,
        key: 2,
        наименование: 'Конторгенатор',
        имя: 'azamat',
        регион: 'Хорезм',
        телефон: '+998 93 868 24 48',
        стир: '384492',
        мфо: '384492',
        инн: '494922',
        електронная_почта: 'qgX9v@example.com',
        адрес: 'Ургенч',
        прочее: 'Прочие',
        категория: 'Конторгенатор',
        изменить: <EditOutlined />,
        удалить: <DeleteOutlined />,
    },
    {
        id: 1,
        key: 3,
        наименование: 'Конторгенатор',
        имя: 'azamat',
        регион: 'Хорезм',
        телефон: '+998 93 868 24 48',
        стир: '384492',
        мфо: '384492',
        инн: '494922',
        електронная_почта: 'qgX9v@example.com',
        адрес: 'Ургенч',
        прочее: 'Прочие',
        категория: 'Конторгенатор',
        изменить: <EditOutlined />,
        удалить: <DeleteOutlined />,
    },
];
export const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Наименование',
        dataIndex: 'наименование',
    },
    {
        title: 'ИМЯ',
        dataIndex: 'имя',
    },
    {
        title: 'Регион',
        dataIndex: 'регион',
    },
    {
        title: 'Телефон',
        dataIndex: 'телефон',
    },
    {
        title: 'СТИР',
        dataIndex: 'стир',
    },
    {
        title: 'МФО',
        dataIndex: 'мфо',
    },
    {
        title: 'ИНН',
        dataIndex: 'инн',
    },
    {
        title: 'Електроннаяпочта',
        dataIndex: 'електронная_почта',
    },
    {
        title: 'Адрес',
        dataIndex: 'адрес',
    },
    {
        title: 'Прочее',
        dataIndex: 'прочее',
    },
    {
        title: 'Изменить',
        dataIndex: 'изменить',
        render: (btn) => {
            return (
                <button className='bg-green-500 px-5 py-1 rounded'>
                    {btn}
                </button>
            );
        },
    },
    {
        title: 'Удалить',
        dataIndex: 'удалить',
        render: (btn) => {
            return (
                <button className='bg-red-500 px-5 py-1 rounded'>
                    {btn}
                </button>
            );
        },
    },
];
