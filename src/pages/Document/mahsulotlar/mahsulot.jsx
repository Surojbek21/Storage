import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button,
    Table,
    message,
    Drawer,
    Form,
    Input,
    Popconfirm,
    Select,
} from 'antd';

const { Option } = Select;

const Mahsulot = () => {
    const [mahsulotlar, setMahsulotlar] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingRecord, setEditingRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [counterparty, setCounterparty] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMahsulotlar(); // Komponent yuklangan paytda mahsulotlarni olamiz
        fetchCounterparties(); // Counterparties ma'lumotlarini olamiz
    }, []);

    // Mahsulotlar ro'yxatini olish (barcha mahsulotlar)
    const fetchMahsulotlar = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost:3000/orders/all'
            );
            const allMahsulotlar = response.data.orders;
            setMahsulotlar(allMahsulotlar);
            setSearchResults(allMahsulotlar);
        } catch (error) {
            console.error("mahsulot ma'lumotlarini olishda xato:", error);
            message.error("mahsulot ma'lumotlarini olishda xato.");
        } finally {
            setLoading(false);
        }
    };

    // Counterparties ma'lumotlarini olish
    const fetchCounterparties = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3000/counterparty/all'
            );
            setCounterparty(response.data.counterparty || []);
        } catch (error) {
            console.error("Counterparties ma'lumotlarini olishda xato:", error);
            message.error("Counterparties ma'lumotlarini olishda xato.");
        }
    };

    // Qidiruv funksiyasi (alohida API chaqiruv)
    const handleSearch = async (query) => {
        setSearchQuery(query); // Qidiruv so'zini saqlaymiz
        setLoading(true); // Yuklash holati
        try {
            const response = await axios.get(
                `http://localhost:3000/orders/search`,
                {
                    params: { search: query },
                }
            );
            const searchResults = response.data.orders || [];
            setSearchResults(searchResults); // Qidiruv natijalarini o'rnatamiz
        } catch (error) {
            console.error('Qidiruvda xato:', error);
            message.error('Qidiruvda xato.');
        } finally {
            setLoading(false); // Yuklash holatini tugatamiz
        }
    };

    const handleAdd = async (values) => {
        try {
            await axios.post('http://localhost:3000/orders/insert', values);
            message.success("Mahsulot muvaffaqiyatli qo'shildi!");
            fetchMahsulotlar(); // Ro'yxatni yangilaymiz
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
            fetchMahsulotlar(); // Ro'yxatni yangilaymiz
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
            fetchMahsulotlar(); // Ro'yxatni yangilaymiz
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
            title: 'Yaratilgan Sana',
            dataIndex: 'yaratilgan_sana',
            key: 'yaratilgan_sana',
            render: (text) => new Date(text).toLocaleDateString(), // Sana formatini o'zgartirish
        },
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
                onSearch={handleSearch} // Qidiruv uchun API chaqiruvini ishlatamiz
                style={{ width: 300, marginBottom: 16 }}
                allowClear
            />
            <Button
                type='primary'
                onClick={() => openDrawer()}
                style={{ marginBottom: 16 }}>
                Qo'shish
            </Button>

            <Table
                dataSource={searchResults} // Filtirlangan natijalar yoki barcha mahsulotlar
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
                        name='counterparty'
                        label='Counterparty'
                        rules={[
                            {
                                required: true,
                                message: 'Counterparty ni tanlang!',
                            },
                        ]}>
                        <Select
                            placeholder='Counterparty tanlang yoki yozing'
                            showSearch
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }>
                            {counterparty.map((counterparty) => (
                                <Option
                                    key={counterparty.id}
                                    value={counterparty.name}>
                                    {counterparty.name}
                                </Option>
                            ))}
                        </Select>
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
