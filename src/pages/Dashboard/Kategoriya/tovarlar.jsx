import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Spin, Button, Drawer, Form, Input, message, Table } from 'antd';
import { useParams } from 'react-router-dom';

const Tovarlar = () => {
    const [tovarlar, setTovarlar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [currentTovar, setCurrentTovar] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const { productId } = useParams();
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };


    const fetchTovarlar = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/product/all/${productId}`
            );
            setTovarlar(response.data.product);
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Tovarlarni yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTovarlar();
    }, [productId]);

    const openDrawer = (tovar = null) => {
        setCurrentTovar(tovar);
        if (tovar) {
            form.setFieldsValue({
                ...tovar,
                price_1: tovar.price_1 || '',
                price_2: tovar.price_2 || '',
                price_3: tovar.price_3 || '',
                valyuta: tovar.valyuta || 'USD',
            });
            setEditMode(true);
        } else {
            form.resetFields();
            setEditMode(false);
        }
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setCurrentTovar(null);
    };

    const handleSave = async (values) => {
        try {
            if (editMode) {
                await axios.put(
                    `http://localhost:3000/product/update/${currentTovar.id}`,
                    { ...values }
                );
                message.success('Tovar muvaffaqiyatli tahrirlandi');
                setTovarlar((prev) =>
                    prev.map((item) =>
                        item.id === currentTovar.id
                            ? { ...item, ...values }
                            : item
                    )
                );
            } else {
                const response = await axios.post(
                    `http://localhost:3000/product/insert/${productId}`,
                    values
                );
                const newProduct = response.data.product;

                message.success(`Yangi tovar muvaffaqiyatli qo'shildi`);
                setTovarlar((prev) => [...prev, newProduct]);
            }
            closeDrawer();
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Xatolik yuz berdi');
        }
    };

    const handleDelete = async (tovarId) => {
        try {
            await axios.delete(
                `http://localhost:3000/product/delete/${tovarId}`
            );
            message.success("Tovar muvaffaqiyatli o'chirildi");
            setTovarlar((prev) => prev.filter((item) => item.id !== tovarId));
        } catch (error) {
            console.error('Xato bor:', error);
            message.error("Tovarni o'chirishda xatolik yuz berdi");
        }
    };

    const columns = [
        { title: '№', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Price 1',
            dataIndex: 'price_1',
            key: 'price_1',
            render: (text) =>
                text !== null && text !== undefined ? `${text}` : "Noma'lum",
        },
        {
            title: 'Price 2',
            dataIndex: 'price_2',
            key: 'price_2',
            render: (text) =>
                text !== null && text !== undefined ? `${text}` : "Noma'lum",
        },
        {
            title: 'Price 3',
            dataIndex: 'price_3',
            key: 'price_3',
            render: (text) =>
                text !== null && text !== undefined ? `${text}` : "Noma'lum",
        },
        { title: 'Valyuta', dataIndex: 'valyuta', key: 'valyuta' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => formatDateTime(text),
        },
        {
            title: 'Tahrirlash',
            key: 'tahrirlash',
            render: (text, record) => (
                <Button type='link' onClick={() => openDrawer(record)}>
                    Tahrirlash
                </Button>
            ),
        },
        {
            title: "O'chirish",
            key: 'ochirish',
            render: (text, record) => (
                <Button
                    type='link'
                    danger
                    onClick={() => handleDelete(record.id)}>
                    O'chirish
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Button
                className='ml-[90%]'
                type='primary'
                onClick={() => openDrawer()}>
                Qo'shish
            </Button>

            {loading ? (
                <Spin />
            ) : (
                <Table columns={columns} dataSource={tovarlar} rowKey='id' />
            )}

            <Drawer
                title={editMode ? 'Mahsulotni Tahrirlash' : "Mahsulot Qo'shish"}
                open={drawerVisible}
                onClose={closeDrawer}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            onClick={closeDrawer}
                            style={{ marginRight: 8 }}>
                            Bekor qilish
                        </Button>
                        <Button
                            type='primary'
                            onClick={() => {
                                window.location.reload()
                                form.validateFields()
                                    .then((values) => handleSave(values))
                                    .catch((info) =>
                                        console.log(
                                            'Form validatsiyasida xato bor:',
                                            info
                                        )
                                    );
                            }}>
                            {editMode ? 'Yangilash' : "Qo'shish"}
                        </Button>
                    </div>
                }>
                <Form form={form} layout='vertical'>
                    <Form.Item
                        name='name'
                        label='Mahsulot nomi'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, mahsulot nomini kiriting!',
                            },
                        ]}>
                        <Input placeholder='Mahsulot nomini kiriting' />
                    </Form.Item>
                    <Form.Item
                        name='price_1'
                        label='Price_1'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, narxni kiriting!',
                            },
                        ]}>
                        <Input placeholder='Narxni kiriting' />
                    </Form.Item>
                    <Form.Item
                        name='price_2'
                        label='Price_2'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, narxni kiriting!',
                            },
                        ]}>
                        <Input placeholder='Narxni kiriting' />
                    </Form.Item>
                    <Form.Item
                        name='price_3'
                        label='Price_3'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, narxni kiriting!',
                            },
                        ]}>
                        <Input placeholder='Narxni kiriting' />
                    </Form.Item>
                    <Form.Item
                        name='valyuta'
                        label='Valyuta'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, valyutani tanlang!',
                            },
                        ]}>
                        <select className='w-[90%]'>
                            <option value='USD'>USD</option>
                            <option value="SO'M">SO'M</option>
                        </select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Tovarlar;
