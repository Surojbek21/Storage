import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import { Drawer, Button, Input, Form, Table } from 'antd';

const Kategoriya = () => {
    const [data, setData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [form] = Form.useForm();

    // Ma'lumotlarni yuklash
    useEffect(() => {
        const fetchData = async () => {
            try {
                const req = await axios.get(
                    'http://localhost:3000/category/all'
                );
                setData(req.data.categoriy);
                
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        form.resetFields();
        setEditMode(false);
        setCurrentId(null);
    };

    // Yangi kategoriya qo'shish
    const handlePost = async () => {
        try {
            const values = await form.validateFields();
            if (editMode && currentId !== null) {
                await axios.post(
                    `http://localhost:3000/category/update/${currentId}`,
                    values
                );
                alert('Kategoriya yangilandi');
            } else {
                await axios.post(
                    'http://localhost:3000/category/insert',
                    values
                );
                alert('Kategoriya yaratildi');
            }
            closeDrawer();
            window.location.reload(); // Ma'lumotlar yangilanishi uchun sahifani qayta yuklash
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

    const handleEdit = (record) => {
        form.setFieldsValue(record);
        setCurrentId(record.id);
        setEditMode(true);
        setDrawerVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/category/delete/${id}`);
            alert("Kategoriya o'chirildi");
            window.location.reload();
        } catch (err) {
            console.error(
                'Xato bor',
                err.response ? err.response.data : err.message
            );
            alert('Xato');
        }
    };

    return (
        <div>
            <Button
                type='primary'
                icon={<PlusOutlined />}
                className='mb-10 py-1 ml-[90%] text-xl'
                onClick={showDrawer}></Button>
            <Table columns={columns} dataSource={data} rowKey='id' />

            <Drawer
                title={
                    editMode
                        ? 'Kategoriya Tahrirlash'
                        : 'Yangi Kategoriya Qoʻshish'
                }
                width={400}
                onClose={closeDrawer}
                open={drawerVisible}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            onClick={closeDrawer}
                            style={{ marginRight: 8 }}>
                            Bekor qilish
                        </Button>
                        <Button onClick={handlePost} type='primary'>
                            {editMode ? 'Yangilash' : "Qo'shish"}
                        </Button>
                    </div>
                }>
                <Form form={form} layout='vertical' name='categoryForm'>
                    <Form.Item
                        name='name'
                        label='Kategoriya nomi'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, kategoriya nomini kiriting!',
                            },
                        ]}>
                        <Input placeholder='Kategoriya nomini kiriting' />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Kategoriya;
