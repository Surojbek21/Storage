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
    Pagination, // Pagination komponenti import qilindi
} from 'antd';
import { useLocation } from 'react-router-dom';

const { Option } = Select;

const InputComponent = () => {
    const [inputList, setInputList] = useState([]); // Mahsulotlar ro'yxati
    const [loading, setLoading] = useState(true);
    const [addDrawerVisible, setAddDrawerVisible] = useState(false); // Qo'shish uchun Drawer
    const [editDrawerVisible, setEditDrawerVisible] = useState(false); // Tahrirlash uchun Drawer
    const [editingRecord, setEditingRecord] = useState(null); // Tahrirlanayotgan yozuv
    const [form] = Form.useForm(); // Form instance
    const location = useLocation();
    const id = location.state.id;

    // Pagination holatlari
    const [currentPage, setCurrentPage] = useState(1); // Hozirgi sahifa
    const [pageSize] = useState(5); // Sahifadagi elementlar soni

    // Mahsulotlarni olish
    const fetchInput = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/input/all/${id}`
            );
            setInputList(response.data.input);
            console.log(response.data);
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Mahsulotlarni yuklashda xato yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInput();
    }, [id]);

    // Umumiy summa va sonni hisoblash
    const totalNumber = inputList.reduce(
        (acc, curr) => acc + (curr.number || 0),
        0
    );
    const totalPrice = inputList.reduce(
        (acc, curr) => acc + (curr.price || 0),
        0
    );

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
        setAddDrawerVisible(false); // Qo'shish uchun Drawer-ni yopish
        form.resetFields(); // Formni tozalash
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
        setEditDrawerVisible(false); // Tahrirlash uchun Drawer-ni yopish
        form.resetFields(); // Formni tozalash
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

    // Sahifadagi ma'lumotlarni hisoblash
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

            {/* Qo'shish tugmasi */}
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
                /> // Paginationni o'chirdik
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
                                message: 'Mahsulot nomini kiriting',
                            },
                        ]}>
                        <Input />
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
                    <Form.Item
                        name='currency'
                        label='Valyuta'
                        rules={[
                            { required: true, message: 'Valyutani tanlang' },
                        ]}>
                        <Select>
                            <Option value='USD'>USD</Option>
                            <Option value='UZS'>UZS</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Qo'shish
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            {/* Tahrirlash uchun Drawer */}
            <Drawer
                title='Mahsulotni tahrirlash'
                width={400}
                onClose={() => setEditDrawerVisible(false)}
                visible={editDrawerVisible}>
                <Form layout='vertical' form={form} onFinish={handleEditInput}>
                    <Form.Item
                        name='product'
                        label='Mahsulot nomi'
                        rules={[
                            {
                                required: true,
                                message: 'Mahsulot nomini kiriting',
                            },
                        ]}>
                        <Input />
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
                    <Form.Item
                        name='currency'
                        label='Valyuta'
                        rules={[
                            { required: true, message: 'Valyutani tanlang' },
                        ]}>
                        <Select>
                            <Option value='USD'>USD</Option>
                            <Option value='UZS'>UZS</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Yangilash
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
