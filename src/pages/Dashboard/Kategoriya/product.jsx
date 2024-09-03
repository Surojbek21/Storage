import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Drawer, Form, Input, List, Select, Spin } from 'antd';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [categoriy, setCategoriy] = useState([]); // Yangi state
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form] = Form.useForm();

    // Backenddan ma'lumotlarni olish
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/group/all/1');
            const products = response.data.group_product.map((product) => ({
                ...product,
                categoriy_id: product.categoriy_id, // categoriy_id ni qo'shish
            }));
            setProducts(products);
        } catch (error) {
            console.error('Xato bor:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mavjud kategoriyalarni olish
    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3000/category/all'
            );
            setCategoriy(response.data.categoriy); // `categories` ni yangilash
        } catch (error) {
            console.error('Xato bor:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    // Ma'lumot qo'shish yoki yangilash
    const handleAddOrUpdateProduct = async (values) => {
        try {
            if (editMode && selectedProduct) {
                await axios.post(
                    `http://localhost:3000/group/update/${selectedProduct.id}`,
                    values
                );
                alert('Mahsulot yangilandi');
            } else {
                await axios.post('http://localhost:3000/group/insert', values);
                alert("Mahsulot qo'shildi");
            }
            fetchProducts(); // Sahifani qayta yuklash o'rniga ma'lumotlarni qayta yuklash
            handleCloseDrawer();
        } catch (error) {
            console.error('Xato bor:', error);
        }
    };

    // Mahsulotni o'chirish
    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/group/delete/${id}`);
            fetchProducts(); // Sahifani qayta yuklash o'rniga ma'lumotlarni qayta yuklash
        } catch (error) {
            console.error('Xato bor:', error);
        }
    };

    // Tahrirlash uchun mahsulotni tanlash
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        form.setFieldsValue({
            ...product,
            categoriy_id: product.categoriy_id, // categoriy_id ni formaga qo'shish
        });
        setEditMode(true);
        setDrawerOpen(true);
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
                            {item.name}
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
                    <Form.Item
                        name='categoriy_id'
                        label='Kategoriya ID'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, kategoriya ID kiriting!',
                            },
                        ]}>
                        <Select placeholder='Kategoriya ID ni tanlang'>
                            {categoriy.map((categoriy) => (
                                <Select.Option
                                    key={categoriy.id}
                                    value={categoriy.id}>
                                    {categoriy.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Product;
