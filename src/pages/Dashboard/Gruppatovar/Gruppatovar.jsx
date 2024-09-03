import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { Button, Table } from 'antd';
import GruppatovarDrawer from './Drawer';
import useDrawer from '../../../hooks/useDrawer';

const Gruppatovar = () => {
    const [data, setData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null); // Record for editing
    const { open, handleOpen, handleClose } = useDrawer();

    // Fetch data from server
    const fetchData = async () => {
        try {
            const req = await axios.get('http://localhost:3000/group/all');
            setData(req.data.group_product);
            console.log(req.data.group_product);
            
        } catch (error) {
            console.error("Ma'lumotlarni olishda xato:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePageChange = (page, pageSize) => {
        // Implement page change logic if needed
    };

    const showDrawer = (record = null) => {
        setCurrentRecord(record);
        setEditMode(!!record);
        handleOpen();
    };

    const handleEdit = (record) => {
        showDrawer(record);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/group/delete/${id}`);
            alert("Kategoriya o'chirildi");
            fetchData();
        } catch (err) {
            console.error('Xato bor', err);
            alert('Xato');
        }
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category ID',
            dataIndex: 'categoriy_id',
            key: 'category_id',
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
            render: (text) => {
                if (!text) return "Noma'lum vaqt";
                const date = new Date(text);
                return isNaN(date.getTime()) ? text : date.toLocaleString();
            },
        },
        {
            title: 'Изменить',
            key: 'edit',
            render: (text, record) => (
                <EditFilled
                    className='cursor-pointer w-10 rounded-md py-1.5 text-green-500'
                    onClick={() => handleEdit(record)}
                />
            ),
        },
        {
            title: 'Удалить',
            key: 'delete',
            render: (text, record) => (
                <DeleteFilled
                    className='cursor-pointer text-red-500'
                    onClick={() => handleDelete(record.id)}
                />
            ),
        },
    ];

    return (
        <>
            <div>
                <Button
                    type='primary'
                    className='mb-10 py-1 ml-[90%] text-xl'
                    onClick={() => showDrawer()}>
                    Add
                </Button>
                <Table columns={columns} dataSource={data} rowKey='id' />

                <GruppatovarDrawer
                    open={open}
                    handleClose={handleClose}
                    fetchData={fetchData} // Pass fetchData function
                    editMode={editMode}
                    record={currentRecord} // Pass current record
                />
            </div>
        </>
    );
};

export default Gruppatovar;
