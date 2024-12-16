import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    message,
    Table,
    Spin,
    Button,
    Drawer,
    Form,
    Select,
    Popconfirm,
    Input,
} from 'antd';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const OrderTwo = () => {
    const [inputList, setInputList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [product, setProduct] = useState([]); // Mahsulotlar ro'yxati
    const [currentPage, setCurrentPage] = useState(1);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [price, setPriceList] = useState([]); // Narxlar ro'yxati
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const pageSize = 5;

    const [form] = Form.useForm();
    const { id } = useParams();

    useEffect(() => {
        fetchInput();
        fetchProductsData();
        fetchExchangeRate();
    }, []);

    // Input ma'lumotlarini olish
    const fetchInput = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `http://localhost:3000/input/all/${id}`
            );
            setInputList(data.input || []);
        } catch (error) {
            console.error('Error fetching input data:', error);
            message.error('Error fetching input data');
        } finally {
            setLoading(false);
        }
    };

    // Mahsulotlar ro'yxatini olish
    const fetchProductsData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3000/input/product'
            );
            setProduct(response.data.input || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Error fetching products');
        }
    };

   

    // Mahsulot tanlanganda narxlarni yangilash
    const handleProductChange = (productId) => {
        const selectedProduct = product.find((item) => item.id === productId);
        if (selectedProduct) {
            const priceOptions = [
                { id: 'price_1', name: `${selectedProduct.price_1} ` },
                { id: 'price_2', name: `${selectedProduct.price_2} ` },
                { id: 'price_3', name: `${selectedProduct.price_3} ` },
            ].filter(
                (price) => price.name !== 'Price: null' && price.name // Faqat to'g'ri qiymatlarni ko'rsatish
            );
            setPriceList(priceOptions); // Narxlarni yangilash
        } else {
            setPriceList([]); // Agar mahsulot tanlanmagan bo'lsa, narxlar bo'sh
        }
    };

    // Kursni olish
    const fetchExchangeRate = async () => {
        try {
            const { data } = await axios.get(
                'http://localhost:3000/exchange-rate'
            );
            setExchangeRate(data.rate || 0);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        }
    };

    // Yangi mahsulot qo'shish
    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            await axios.post(`http://localhost:3000/input/insert/${id}`, {
                ...values,
                status: 2,
            });
            message.success('Product successfully added!');
            fetchInput();
            setDrawerVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Error adding product:', error);
            message.error('Error adding product');
        }
    };

    // Mahsulotni o'chirish
    const handleDeleteInput = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/input/delete/${id}`);
            message.success('Product successfully deleted!');
            fetchInput();
        } catch (error) {
            console.error('Error deleting product:', error);
            message.error('Error deleting product');
        }
    };

    // USD bo'yicha umumiy summani hisoblash
    const totalUSD = inputList.reduce((sum, item) => {
        if (item.currency_id === 1) {
            return sum + item.number * item.price; // Faqat USD mahsulotlar
        }
        return sum;
    }, 0);

    // So’m bo'yicha umumiy summani hisoblash
    const totalSOM = inputList.reduce((sum, item) => {
        if (item.currency_id === 2) {
            return sum + item.number * item.price; // Faqat so’m mahsulotlar
        }
        return sum;
    }, 0);

    // Jadval ustunlari
    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, rowIndex) =>
                (currentPage - 1) * pageSize + rowIndex + 1,
        },
        { title: 'Product', dataIndex: 'product', key: 'product' },
        { title: 'Number', dataIndex: 'number', key: 'number' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        {
            title: 'Total (USD)',
            key: 'total_usd',
            render: (_, record) =>
                record.currency_id === 1
                    ? `$${(record.number * record.price).toFixed(2)}`
                    : '$0',
        },
        {
            title: 'Total (So’m)',
            key: 'total_som',
            render: (_, record) => {
                const totalSom =
                    record.currency_id === 1
                        ? record.price * exchangeRate
                        : record.price;
                return `${totalSom.toLocaleString()} so’m`;
            },
        },
        {
            title: 'Delete',
            render: (_, record) => (
                <Popconfirm
                    title='Are you sure to delete this item?'
                    onConfirm={() => handleDeleteInput(record.id)}
                    okText='Yes'
                    cancelText='No'>
                    <Button type='link' danger>
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    // Paginatsiya uchun ma'lumotlar
    const paginatedData = inputList.slice(
        (currentPage - 2) * pageSize,
        currentPage * pageSize
    );

    return (
        <div>
            <h1
                className='cursor-pointer h-10 text-3xl'
                onClick={() => window.history.back()}>
                <i className='fa-solid fa-arrow-left text-5xl'>←</i>
            </h1>
            <Button
                type='primary'
                onClick={() => setDrawerVisible(true)}
                className='ml-[85%] mb-5'>
                Add New
            </Button>

            {loading ? (
                <Spin />
            ) : (
                <Table
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey='id'
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: inputList.length,
                        onChange: (page) => setCurrentPage(page),
                    }}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={4}>
                                <b>Obshiy</b>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                <b>${totalUSD.toFixed(2)}</b>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                                <b>{totalSOM.toLocaleString()} so’m</b>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            )}

            {/* Drawer for adding product */}
            <Drawer
                title='Add Product'
                width={400}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}>
                <Form layout='vertical' form={form} onFinish={handleAdd}>
                    <Form.Item
                        name='product_id'
                        label='Product Name'
                        rules={[
                            {
                                required: true,
                                message: 'Please select a product',
                            },
                        ]}>
                        <Select
                            showSearch
                            placeholder='Select Product'
                            onChange={handleProductChange}>
                            {product.map((prod) => (
                                <Option key={prod.id} value={prod.id}>
                                    {prod.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='price'
                        label='Price'
                        rules={[
                            {
                                required: false,
                                message: 'Please select or enter a price',
                            },
                        ]}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Select
                                showSearch
                                placeholder='Select Price'
                                onChange={(value) => {
                                    setSelectedPrice(value);
                                }}>
                                {price.map((option) => (
                                    <Option key={option.id} >
                                        {option.name}
                                    </Option>
                                ))}
                            </Select>
                            {!selectedPrice && (
                                <Input
                                    style={{ marginLeft: 10 }}
                                    placeholder='Or enter price'
                                    onChange={(e) => {
                                        setSelectedPrice(e.target.value); //tepadagi usestatega bog'lanishi kerak
                                    }}
                                />
                            )}
                        </div>
                    </Form.Item>

                    <Form.Item
                        name='number'
                        label='Number'
                        rules={[
                            { required: true, message: 'Please enter number' },
                        ]}>
                        <Input type='number' />
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default OrderTwo;
