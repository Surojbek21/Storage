import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Drawer, Form, Input, List, Select, Spin, message } from 'antd';
import { Link, useParams } from 'react-router-dom';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]); // "category" o'rniga "categories"
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form] = Form.useForm();
    const { id } = useParams();

    // Backenddan ma'lumotlarni olish
    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/group/all/${id}`
            );
            setProducts(response.data.group);
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Mahsulotlarni yuklashda xato yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    // Mavjud kategoriyalarni olish
    const fetchCategory = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3000/category/all'
            );
            setCategory(response.data.category);
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Kategoriyalarni yuklashda xato yuz berdi');
        }
    };

    useEffect(() => {
        fetchCategory();
        fetchProducts();
    }, [id]); // "id" dependentsiyada qo'shildi

    // Ma'lumot qo'shish yoki yangilash
    const handleAddOrUpdateProduct = async (values) => {
        try {
            if (editMode && selectedProduct) {
                await axios.post(
                    `http://localhost:3000/group/update/${selectedProduct.id}`,
                    values
                );
                message.success('Mahsulot yangilandi');
            } else {
                await axios.post(`http://localhost:3000/group/insert/${id}`, values);
                message.success("Mahsulot qo'shildi");
                
            }
            fetchProducts(); // Sahifani qayta yuklash o'rniga ma'lumotlarni qayta yuklash
            handleCloseDrawer();
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Maʼlumotni saqlashda xato yuz berdi');
        }
    };

    // Mahsulotni o'chirish
    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/group/delete/${id}`);
            fetchProducts(); // Sahifani qayta yuklash o'rniga ma'lumotlarni qayta yuklash
            message.success('Mahsulot o‘chirildi');
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Mahsulotni o‘chirishda xato yuz berdi');
        }
    };

    // Tahrirlash uchun mahsulotni tanlash
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        form.setFieldsValue(product); // Mahsulot ma'lumotlarini formaga yuklash
        setEditMode(true);
        setDrawerOpen(false);
    };

    // Drawer-ni yopish va reset qilish
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        form.resetFields();
        setEditMode(false);
        setSelectedProduct(null);
    };

    return (
        <div>
            <h1
                className='cursor-pointer h-10 text-3xl'
                onClick={() => window.history.back()}>
                <i className='fa-solid fa-arrow-left text-5xl '>←</i>
            </h1>
            <Button
                type='primary'
                className='ml-[90%]'
                onClick={() => {
                    setEditMode(false);
                    setSelectedProduct(null);
                    setDrawerOpen(true);
                }}>
                Qo'shish
            </Button>

            {loading ? (
                <Spin />
            ) : (
                <List
                    dataSource={products}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    onClick={() => handleEditProduct(item)}
                                    type='link'>
                                    Tahrirlash
                                </Button>,
                                <Button
                                    onClick={() => handleDeleteProduct(item.id)}
                                    type='link'
                                    danger>
                                    O'chirish
                                </Button>,
                            ]}>
                            <Link to={`/catalog/${id}/product/${item.id}`}>
                                {item.name}
                            </Link>
                        </List.Item>
                    )}
                />
            )}

            <Drawer
                title={editMode ? 'Mahsulotni Tahrirlash' : "Mahsulot Qo'shish"}
                open={drawerOpen}
                onClose={handleCloseDrawer}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            onClick={handleCloseDrawer}
                            style={{ marginRight: 8 }}>
                            Bekor qilish
                        </Button>
                        <Button
                            type='primary'
                            onClick={() => {
                                form.validateFields()
                                    .then((values) =>
                                        handleAddOrUpdateProduct(values)
                                    )
                                    .catch((info) =>
                                        console.log('Xato bor:', info)
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

                    {category.map(({ id, name }) => (
                        <Select.Option key={id} value={id}>
                            {name}
                        </Select.Option>
                    ))}
                </Form>
            </Drawer>
        </div>
    );
};

export default Product;
