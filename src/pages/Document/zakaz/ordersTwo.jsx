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
    const [product, setProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [price, setPriceList] = useState([]);
    const pageSize = 5;
    const [form] = Form.useForm();
    const { id } = useParams();

    useEffect(() => {
        fetchInput();
        fetchProductsData();
        fetchExchangeRate();
    }, []);

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

    const handleProductChange = (productId) => {
        const selectedProduct = product.find((item) => item.id === productId);
        if (selectedProduct) {
            const priceOptions = [
                { id: 'price_1', name: `${selectedProduct.price_1}` },
                { id: 'price_2', name: `${selectedProduct.price_2}` },
                { id: 'price_3', name: `${selectedProduct.price_3}` },
            ].filter((price) => price.name !== 'Price: null');
            setPriceList(priceOptions);
        } else {
            setPriceList([]);
        }
    };

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            const price = values.selected_price || values.entered_price;
            await axios.post(`http://localhost:3000/input/insert/${id}`, {
                ...values,
                price,
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

    const totalUSD = inputList.reduce((sum, item) => {
        if (item.currency_id === 1) {
            return sum + item.number * item.price;
        }
        return sum;
    }, 0);

    const totalSOM = inputList.reduce((sum, item) => {
        if (item.currency_id === 2) {
            return sum + item.number * item.price;
        }
        return sum;
    }, 0);

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

    return (
        <div>
            <h1 onClick={() => window.history.back()} className='cursor-pointer text-6xl'>
                <i className='fa-solid fa-arrow-left'>←</i>
            </h1>
            <Button
                type='primary'
                onClick={() => setDrawerVisible(true)}
                style={{ marginBottom: 16,  marginLeft: '80%' }}>
                Add New
            </Button>
            {loading ? (
                <Spin />
            ) : (
                <Table
                    columns={columns}
                    dataSource={inputList}
                    rowKey='id'
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total: inputList.length,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />
            )}
            <Drawer
                title='Add Product'
                width={400}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}>
                <Form layout='vertical' form={form} onFinish={handleAdd}>
                    <Form.Item
                        name='product_id'
                        label='Product'
                        rules={[{ required: true }]}>
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
                    <Form.Item label='Price' required>
                        <Input.Group compact>
                            <Form.Item name='selected_price' noStyle>
                                <Select placeholder='Select Price'>
                                    {price.map((option) => (
                                        <Option
                                            key={option.id}
                                            value={option.name}>
                                            {option.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name='entered_price' noStyle>
                                <Input
                                    placeholder='Or enter price'
                                    type='number'
                                />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                    <Form.Item
                        name='number'
                        label='Number'
                        rules={[{ required: true }]}>
                        <Input type='number' />
                    </Form.Item>
                    <Button type='primary' htmlType='submit'>
                        Add
                    </Button>
                </Form>
            </Drawer>
        </div>
    );
};

export default OrderTwo;
