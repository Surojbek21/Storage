import { Table } from 'antd';
import React from 'react';
import { data } from './data';
import useDrawer from '../../hooks/useDrawer';
import Drawer from './Drawer';

const Dashboard = () => {
    const { open, handleOpen, handleClose } = useDrawer();

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
                    }}
                >
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
                    }}
                >
                    {text}
                </button>
            ),
        },
    ];

    return (
        <div>
            <button
                style={{
                    border: 'none',
                    width: '50px',
                    marginLeft: '1180px',
                    height: '30px',
                    fontSize: '20px',
                    borderRadius: '5px',
                    backgroundColor: 'green',
                    color: 'white',
                    cursor: 'pointer',
                }}
                className='btn-modal'
                onClick={handleOpen}
                type='button'
            >
                +
            </button>
            <Drawer open={open} onClose={handleClose} />
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default Dashboard;
