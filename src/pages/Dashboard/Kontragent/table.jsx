

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
