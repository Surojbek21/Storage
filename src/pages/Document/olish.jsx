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

const InputComponent = () => {
    const [inputList, setInputList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [product, setProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const [form] = Form.useForm();
    const { id } = useParams();

    useEffect(() => {
        fetchInput();
        fetchProductsData();
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
    const handleAdd = async (values) => {
        try {
            const { product, number, price, currency } = values;
            const parsedNumber = Number(number);
            const parsedPrice = String(price);

            let totalPrice = 0;

            // Faqat dollar yoki so'm qiymatini saqlash
            if (currency === 'dollar') {
                totalPrice = parsedPrice; // Dollar qiymatini saqlash
            } else if (currency === 'sum') {
                totalPrice = parsedPrice; // So'm qiymatini saqlash
            }

            await axios.post(`http://localhost:3000/input/insert/${id}`, {
                product_id: product,
                number: parsedNumber,
                price: totalPrice, // faqat kerakli valuta qiymatini yuborish
                status: currency === 'dollar' ? 1 : 2,
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

    const handleDeleteInput = async (inputId) => {
        try {
            const { data } = await axios.delete(
                `http://localhost:3000/input/delete/${inputId}`
            );
            if (data.success) {
                fetchInput();
                message.success('Product deleted');
            } else {
                message.error('This item has already been deleted');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            message.error('Error deleting product');
        }
    };
    const calculateTotals = () => {
        const exchangeRate = 11000; // 1 USD = 11,000 so'm
        const totalNum = inputList.reduce((acc, item) => acc + item.number, 0);

        const totalDollar = inputList
            .filter((item) => item.status === 1)
            .reduce((acc, item) => acc + parseFloat(item.price || 0), 0); // faqat dollar qiymatlari

        const totalSum = inputList
            .filter((item) => item.status === 2)
            .reduce((acc, item) => acc + parseFloat(item.price || 0), 0); // faqat so'm qiymatlari

        const totalObshiy = totalDollar + totalSum / exchangeRate;

        return { totalNum, totalDollar, totalSum, totalObshiy };
    };
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Product', dataIndex: 'product', key: 'product' },
        { title: 'Number', dataIndex: 'number', key: 'number' },
        {
            title: 'Dollar',
            render: (_, record) =>
                record.status === 1 ? `$${record.price}` : '-',
        },
        {
            title: 'So’m',
            render: (_, record) =>
                record.status === 2 ? `${record.price} so'm` : '-',
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

    const paginatedData = inputList.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totals = calculateTotals();

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
                <>
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
                    />
                    <div
                        style={{
                            display: 'flex',
                            marginTop: '20px',
                            justifyContent: 'space-evenly',
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>
                        <p>Total Number: {totals.totalNum}</p>
                        <p>Total Dollar: ${totals.totalDollar.toFixed(2)}</p>
                        <p>Total So’m: {totals.totalSum.toFixed(2)} so'm</p>
                    </div>
                </>
            )}

            <Drawer
                title='Add Product'
                width={400}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}>
                <Form layout='vertical' form={form} onFinish={handleAdd}>
                    <Form.Item
                        name='product'
                        label='Product Name'
                        rules={[
                            {
                                required: true,
                                message: 'Please select a product',
                            },
                        ]}>
                        <Select showSearch placeholder='Select Product'>
                            {product.map((product) => (
                                <Option key={product.id} value={product.id}>
                                    {product.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='number'
                        label='Quantity'
                        rules={[
                            {
                                required: true,
                                message: 'Please enter quantity',
                            },
                        ]}>
                        <Input type='number' min={1} />
                    </Form.Item>

                    <Form.Item
                        name='price'
                        label='Price'
                        rules={[
                            { required: true, message: 'Please enter price' },
                        ]}>
                        <Input type='number' min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item
                        name='currency'
                        label='Currency'
                        rules={[
                            {
                                required: true,
                                message: 'Please select a currency',
                            },
                        ]}>
                        <Select placeholder='Select Currency'>
                            <Option value='dollar'>Dollar</Option>
                            <Option value='sum'>So’m</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='ml-[70%]'>
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default InputComponent;
