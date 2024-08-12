import React from 'react';
import useDrawer from '../../../hooks/useDrawer';
import ProductDrawer from '../Drawer';
import { Table } from 'antd';
import { FileImageTwoTone } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { Tabletovar } from './table'; 

const Tovar = () => {
    const TovarData = [
        {
            title: <Checkbox />,
            dataIndex: 'checkbox',
        },
        {
            title: <FileImageTwoTone />,
            dataIndex: 'img',
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
            title: 'Action', // Adding a meaningful title for the action column
            dataIndex: 'action',
        },
    ];

    const { open, handleOpen, handleClose } = useDrawer();

    return (
        <div>
            <ProductDrawer open={open} onClosed={handleClose} />
            <Table
                columns={TovarData}
                dataSource={Tabletovar}
                rowKey='id'
            />{' '}
        </div>
    );
};

export default Tovar;
