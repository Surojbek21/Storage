import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    message,
    Table,
    Spin,
    Button,
    Drawer,
    Form,
    Input,
    Select,
    Popconfirm,
    Pagination,
} from 'antd';
import { useLocation } from 'react-router-dom';

const { Option } = Select;

const InputComponent = () => {
    const [inputList, setInputList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addDrawerVisible, setAddDrawerVisible] = useState(false);
    const [editDrawerVisible, setEditDrawerVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const location = useLocation();
    const id = location.state.id;

    const [products, setProducts] = useState([]);
    const [fetchingProducts, setFetchingProducts] = useState(false);

    // Pagination holatlari
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);

    // Umumiy son va summa holatlari
    const [totalNumber, setTotalNumber] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Mahsulotlarni olish
    const fetchInput = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/input/all/${id}`
            );
            const data = response.data.input;
            setInputList(data);

            // Umumiy son va summani hisoblash
            const totalNum = data.reduce((sum, item) => sum + item.number, 0);
            const totalPrc = data.reduce(
                (sum, item) => sum + item.price * item.number,
                0
            );

            setTotalNumber(totalNum);
            setTotalPrice(totalPrc);
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Mahsulotlarni yuklashda xato yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (searchValue = '') => {
        setFetchingProducts(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/products/search?query=${searchValue}`
            );
            setProducts(response.data.products);
        } catch (error) {
            console.error('Mahsulotlarni olishda xato:', error);
            message.error('Mahsulotlarni olishda xato.');
        } finally {
            setFetchingProducts(false);
        }
    };

    useEffect(() => {
        fetchInput();
        fetchProducts(); // API dan mahsulotlarni yuklash
    }, [id]);

    // Ma'lumot qo'shish
    const handleAddInput = async (values) => {
        try {
            await axios.post(
                `http://localhost:3000/input/insert/${id}`,
                values
            );
            message.success("Ma'lumot muvaffaqiyatli qo'shildi!");
            fetchInput();
        } catch (error) {
            console.error("Ma'lumotlarni qo'shishda xato:", error);
            message.error("Ma'lumotlarni qo'shishda xato.");
        }
        form.resetFields(); // Formni tozalash
        setAddDrawerVisible(false); // Qo'shish uchun Drawer-ni yopish
    };

    // Ma'lumotni yangilash
    const handleEditInput = async (values) => {
        try {
            await axios.put(
                `http://localhost:3000/input/update/${editingRecord.id}`,
                values
            );
            message.success("Ma'lumot muvaffaqiyatli yangilandi!");
            fetchInput();
        } catch (error) {
            console.error("Ma'lumotni yangilashda xato:", error);
            message.error("Ma'lumotni yangilashda xato.");
        }
        form.resetFields(); // Formni tozalash
        setEditDrawerVisible(false); // Tahrirlash uchun Drawer-ni yopish
    };

    // Qo'shish Drawer-ni ochish
    const openAddDrawer = () => {
        setAddDrawerVisible(true);
    };

    // Tahrirlash Drawer-ni ochish
    const openEditDrawer = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            product: record.product,
            number: record.number,
            price: record.price,
            currency: record.currency,
        });
        setEditDrawerVisible(true);
    };

    // Mahsulotni o'chirish
    const handleDeleteInput = async (inputId) => {
        try {
            await axios.delete(`http://localhost:3000/input/delete/${inputId}`);
            fetchInput(); // Mahsulotlarni qayta yuklash
            message.success('Mahsulot o‘chirildi');
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Mahsulotni o‘chirishda xato yuz berdi');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Number',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: 'Tahrirlash',
            dataIndex: 'tahrirlash',
            key: 'tahrirlash',
            render: (_, record) => (
                <Button type='link' onClick={() => openEditDrawer(record)}>
                    Tahrirlash
                </Button>
            ),
        },
        {
            title: "O'chirish",
            key: "o'chirish",
            render: (_, record) => (
                <Popconfirm
                    title="Bu ma'lumotni o'chirishni tasdiqlaysizmi?"
                    onConfirm={() => handleDeleteInput(record.id)}
                    okText='Ha'
                    cancelText="Yo'q">
                    <Button type='link' danger>
                        O'chirish
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    const paginatedData = inputList.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div>
            <h1
                className='cursor-pointer h-10 text-3xl'
                onClick={() => window.history.back()}>
                <i className='fa-solid fa-arrow-left text-5xl'>←</i>
            </h1>
            <Button type='primary' onClick={openAddDrawer} className='ml-[90%]'>
                Qo'shish
            </Button>

            {loading ? (
                <Spin />
            ) : (
                <Table
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey='id'
                    pagination={false}
                />
            )}

            {/* Qo'shish uchun Drawer */}
            <Drawer
                title='Mahsulot qo‘shish'
                width={400}
                onClose={() => setAddDrawerVisible(false)}
                visible={addDrawerVisible}>
                <Form layout='vertical' form={form} onFinish={handleAddInput}>
                    <Form.Item
                        name='product'
                        label='Mahsulot nomi'
                        rules={[
                            {
                                required: true,
                                message: 'Mahsulot nomini tanlang',
                            },
                        ]}>
                        <Select
                            showSearch
                            placeholder='Mahsulot tanlang'
                            onSearch={fetchProducts}
                            notFoundContent={
                                fetchingProducts ? <Spin /> : null
                            }>
                            {products.map((product) => (
                                <Option key={product.id} value={product.name}>
                                    {product.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='number'
                        label='Soni'
                        rules={[
                            {
                                required: true,
                                message: 'Mahsulot sonini kiriting',
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='price'
                        label='Narxi'
                        rules={[
                            {
                                required: true,
                                message: 'Mahsulot narxini kiriting',
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='currency' label='Valyuta'>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Qo'shish
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            {/* Pagination komponenti */}
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={inputList.length}
                onChange={(page) => setCurrentPage(page)}
                style={{
                    textAlign: 'right',
                    marginTop: '20px',
                    justifyContent: 'end',
                }}
            />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '30px',
                    marginBottom: '20px',
                }}>
                <div>
                    <p>
                        <strong>Umumiy son:</strong> {totalNumber}
                    </p>
                </div>
                <div className='ml-5'>
                    <p>
                        <strong>Umumiy summa:</strong> {totalPrice}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InputComponent;
