import React, { useState } from 'react';
import useDrawer from '../../../hooks/useDrawer';
import ProductDrawer from '../Drawer';
import { Table } from 'antd';
import { FileImageTwoTone } from '@ant-design/icons';
import { Checkbox } from 'antd';

// Assuming you have Tabletovar data like this:
const Tabletovar = [
    {
        key: 1,
        img: 'https://via.placeholder.com/150',
        name: 'Product 1',
        soni: 10,
        status: 'Available',
        sana: '2024-08-14',
    },
    {
        key: 2,
        img: 'https://via.placeholder.com/150',
        name: 'Product 2',
        soni: 5,
        status: 'Unavailable',
        sana: '2024-08-14',
    },
    {
        key: 3,
        img: 'https://via.placeholder.com/150',
        name: 'Product 3',
        soni: 8,
        status: 'Available',
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
                            ); // Select all
                        } else {
                            setSelectedRowKeys([]); // Deselect all
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
            title: <FileImageTwoTone />,
            dataIndex: 'img',
            render: (img) => (
                <img src={img} alt='product' style={{ width: 50 }} />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Soni',
            dataIndex: 'soni',
        },
        {
            title: 'Status',
            dataIndex: 'status',
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
