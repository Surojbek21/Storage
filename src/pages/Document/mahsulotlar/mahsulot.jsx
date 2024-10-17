import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, message, Drawer, Form, Input, Popconfirm } from 'antd';

const Mahsulot = () => {
    const [mahsulotlar, setMahsulotlar] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingRecord, setEditingRecord] = useState(null); // Tahrirlash
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMahsulotlar();
    }, []);

    // Mahsulotlar ro'yxatini olish
    const fetchMahsulotlar = async (query = '') => {
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost:3000/orders/all'
            );
            const allMahsulotlar = response.data.orders;

            if (query) {
                const filteredResults = allMahsulotlar.filter((order) =>
                    order.name.toLowerCase().includes(query.toLowerCase())
                );
                setSearchResults(filteredResults);
            } else {
                setSearchResults(allMahsulotlar);
            }
            setMahsulotlar(allMahsulotlar);
        } catch (error) {
            console.error("Ma'lumotlarni olishda xato:", error);
            message.error("Ma'lumotlarni olishda xato.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        fetchMahsulotlar(value);
    };

    const handleAdd = async (values) => {
        try {
            await axios.post('http://localhost:3000/orders/insert', values);
            message.success("Mahsulot muvaffaqiyatli qo'shildi!");
            fetchMahsulotlar();
            closeDrawer(); // Yangi mahsulotdan keyin Drawer ni yopish
        } catch (error) {
            console.error("Mahsulotni qo'shishda xato:", error);
            message.error("Mahsulotni qo'shishda xato.");
        }
    };

    const handleUpdate = async (values) => {
        try {
            await axios.post(
                `http://localhost:3000/orders/update/${editingRecord.id}`,
                values
            );
            message.success('Mahsulot muvaffaqiyatli yangilandi!');
            fetchMahsulotlar();
            closeDrawer(); // Tahrirlashdan keyin Drawer ni yopish
        } catch (error) {
            console.error('Mahsulotni yangilashda xato:', error);
            message.error('Mahsulotni yangilashda xato.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/orders/delete/${id}`);
            message.success("Mahsulot muvaffaqiyatli o'chirildi!");
            fetchMahsulotlar();
        } catch (error) {
            console.error("Mahsulotni o'chirishda xato:", error);
            message.error("Mahsulotni o'chirishda xato.");
        }
    };

    const openDrawer = (record = null) => {
        setDrawerVisible(true);
        if (record) {
            form.setFieldsValue(record); // Agar tahrirlash bo'lsa, formaga qiymatni o'rnatamiz
            setEditingRecord(record); // Tahrirlash holatini saqlab qolish
        } else {
            form.resetFields(); // Yangi mahsulot qo'shayotganimizda formani tozalash
        }
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        form.resetFields();
        setEditingRecord(null); // Tahrirlashni tozalash
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Nomi', dataIndex: 'name', key: 'name' },
        { title: 'Product Soni', dataIndex: 'prduct_soni', key: 'prduct_soni' },
        { title: 'Jami Soni', dataIndex: 'jami_soni', key: 'jami_soni' },
        { title: 'Doller', dataIndex: 'narx_dollar', key: 'narx_dollar' },
        { title: "So'm", dataIndex: 'narx_sum', key: 'narx_sum' },
        {
            title: 'Tahrirlash',
            key: 'edit',
            render: (_, record) => (
                <Button type='link' onClick={() => openDrawer(record)}>
                    Tahrirlash
                </Button>
            ),
        },
        {
            title: 'Oʻchirish',
            key: 'delete',
            render: (_, record) => (
                <Popconfirm
                    title="Mahsulotni o'chirishni tasdiqlaysizmi?"
                    onConfirm={() => handleDelete(record.id)}
                    okText='Ha'
                    cancelText="Yo'q">
                    <Button type='link' danger>
                        Oʻchirish
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <Input.Search
                placeholder='Qidiruv...'
                onSearch={handleSearch}
                style={{ width: 300, marginBottom: 16 }}
                allowClear
            />
            <Button
                type='primary'
                onClick={() => openDrawer()}
                className='ml-[88%]'>
                Qo'shish
            </Button>

            <Table
                dataSource={searchResults}
                columns={columns}
                rowKey='id'
                loading={loading}
            />

            {/* Yangi mahsulot qo'shish va tahrirlash uchun Drawer */}
            <Drawer
                title={editingRecord ? 'Tahrirlash' : "Qo'shish"}
                visible={drawerVisible}
                onClose={closeDrawer}
                width={400}>
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={editingRecord ? handleUpdate : handleAdd}>
                    <Form.Item
                        name='name'
                        label='Mahsulot Nomi'
                        rules={[
                            { required: true, message: 'Nomini kiriting!' },
                        ]}>
                        <Input placeholder='Nomini kiriting' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            {editingRecord ? 'Yangilash' : "Qo'shish"}
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Mahsulot;
