import { Table } from 'antd';
import React from 'react';
import { data } from './data';
const Dashboard = () => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Roli',
            dataIndex: 'roli',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            render: (text) => (
                <button
                    style={{
                        border: 'none',
                        width: '70px',
                        height: '30px',
                        borderRadius: '5px',
                        backgroundColor: 'green',
                        color: 'white',
                        cursor: 'pointer',
                    }}>
                    {text}
                </button>
            ),
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            render: (text) => (
                <button
                    style={{
                        border: 'none',
                        width: '60px',
                        height: '30px',
                        borderRadius: '5px',
                        backgroundColor: 'red',
                        color: 'white',
                        cursor: 'pointer',
                    }}>
                    {text}
                </button>
            ),
        },
        {
            title: 'Add',
            dataIndex: 'add',
        },
    ];
    return (    
        <div>
            <Table columns={columns} dataSource={data} />
        </div>
    );

};

export default Dashboard;
