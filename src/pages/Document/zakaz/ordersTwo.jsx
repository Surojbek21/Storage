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
    const [priceList, setPriceList] = useState([]); 
    const pageSize = 5;

    const [form] = Form.useForm();
    const { id } = useParams();

    useEffect(() => {
        fetchInput();
        fetchProductsData();
        fetchExchangeRate();
        fetchPrice();
    }, []);

    const fetchInput = async () => {
        setLoading(true);
        console.log(id);

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
        } catch (error) {}
    };

    const fetchPrice = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3000/input/price'
            );
            setPriceList(response.data.input ); // Price ma'lumotlarini holatga saqlash
        } catch (error) {
            console.error('Error fetching price:', error);
            message.error('Error fetching price');
        }
    };


    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values:', values);
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
            return sum + item.number * item.price; // Faqat USD mahsulotlarni hisoblash
        }
        return sum;
    }, 0);

    const totalSOM = inputList.reduce((sum, item) => {
        if (item.currency_id === 2) {
            return sum + item.number * item.price; // Faqat so'm mahsulotlarni hisoblash
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
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
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
                if (record.currency_id == 1) {
                    const totalSom = record.price * exchangeRate; // Faqat narxni ishlatyapmiz
                    return `${totalSom.toLocaleString()} so’m`;
                }
                const totalSom = record.price; // Faqat narxni ishlatyapmiz
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
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }>
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
                            {
                                required: true,
                                message: 'Please select a price',
                            },
                        ]}>
                        <Select
                            placeholder='Select Price'
                            showSearch
                            optionFilterProp='children'
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }>
                            {price.map((price) => (
                                <Option key={price.id} value={price.price}>
                                    {price.name} - ${price.price}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    ;
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

export default OrderTwo;
