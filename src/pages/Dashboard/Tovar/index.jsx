import React, { useState } from 'react';
import useDrawer from '../../../hooks/useDrawer';
import ProductDrawer from '../Drawer';
import { Table } from 'antd';
import { Checkbox } from 'antd';
import { DeleteFilled, EditOutlined } from '@ant-design/icons';

const Tabletovar = [
    {
        key: 1,
        id: 1,
        наименование: 'Product 1',
        группа: 'Product 1',
        щена: '43.3$',
        sana: '2024-08-14',
    },
    {
        key: 2,
        id: 2,
        наименование: 'Product 1',
        группа: 'Product 2',
        щена: '25$',
        sana: '2024-08-14',
    },
    {
        key: 3,
        id: 3,
        наименование: 'Product 1',
        группа: 'Product 3',
        щена: '19.9$',
        sana: '2024-08-14',
    },

    // Add more products as needed
];

const Tovar = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to manage selected rows
    const [isAllChecked, setIsAllChecked] = useState(false); // State for all checkbox selection

    const TovarData = [
        {
            title: (
                <Checkbox
                    checked={isAllChecked}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setIsAllChecked(checked);
                        if (checked) {
                            setSelectedRowKeys(
                                Tabletovar.map((item) => item.key)
                            );
                        } else {
                            setSelectedRowKeys([]);
                        }
                    }}
                />
            ),
            dataIndex: 'checkbox',
            render: (_, record) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.key)}
                    onChange={() => handleCheckboxChange(record.key)}
                />
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Наименование',
            dataIndex: 'наименование',
        },
        {
            title: 'Группа',
            dataIndex: 'группа',
        },
        {
            title: 'Щена',
            dataIndex: 'щена',
        },

        {
            title: 'Sana',
            dataIndex: 'sana',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <button
                    onClick={() => handleAction(record.key)}
                    className='bg-blue-500 text-white px-3 py-1 rounded'>
                    Action
                </button>
            ),
        },
        {
            title: 'Изменить',
            dataIndex: 'изменить',
            render: (_, record) => (
                <button className='bg-green-500 text-white px-6 py-1 rounded'>
                    <EditOutlined />
                </button>
            ),
        },
        {
            title: 'Удалить',
            dataIndex: 'удалить',
            render: (_, record) => (
                <button className='bg-red-500 text-white px-6 py-1 rounded'>
                    <DeleteFilled />
                </button>
            ),
        },
    ];

    const handleCheckboxChange = (key) => {
        const newSelectedRowKeys = selectedRowKeys.includes(key)
            ? selectedRowKeys.filter((k) => k !== key)
            : [...selectedRowKeys, key];

        setSelectedRowKeys(newSelectedRowKeys);

        // Update the state for the 'select all' checkbox
        setIsAllChecked(newSelectedRowKeys.length === Tabletovar.length);
    };

    const handleAction = (key) => {
        // Implement the action you want to perform with the row's key
        console.log(`Action performed on key: ${key}`);
    };

    const { open, handleOpen, handleClose } = useDrawer();

    return (
        <div>
            <ProductDrawer open={open} onClosed={handleClose} />
            <Table
                columns={TovarData}
                dataSource={Tabletovar}
                rowKey='key' // Ensure your data has a unique 'key' or similar identifier
                pagination={false}
            />
        </div>
    );
};

export default Tovar;
