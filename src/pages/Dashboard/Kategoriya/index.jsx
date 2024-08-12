// Kategoriya.js
import { Table } from 'antd';
import React from 'react';
import { data } from './Table';

const Kategoriya = () => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: '',
            dataIndex: '',
        },
        {
            title: '',
            dataIndex: '',
        },
    ];
    return (
        <div>
            <Table columns={columns} dataSource={data} rowKey='key' />
        </div>
    );
};

export default Kategoriya;
