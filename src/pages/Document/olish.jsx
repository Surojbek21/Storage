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
    Pagination,
} from 'antd';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const InputComponent = () => {
    const [inputList, setInputList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addDrawerVisible, setAddDrawerVisible] = useState(false);
    const [editDrawerVisible, setEditDrawerVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const { id } = useParams();

    const [products, setProducts] = useState([]);
    const [fetchingProducts, setFetchingProducts] = useState(false);

    // Pagination holatlari
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);

    // Umumiy son va summa holatlari
    const [totalNumber, setTotalNumber] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Mahsulotlarni olish
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

    // Mahsulotlarni olish
    const fetchProductsData = async (values) => {
        setFetchingProducts(true);
        try {
            const response = await axios.get(
                'http://localhost:3000/input/product',
                values
            );
            setProducts(response.data.input);
            console.log(values);
        } catch (error) {
            console.error('Mahsulotlarni olishda xato:', error);
            message.error('Mahsulotlarni olishda xato');
        } finally {
            setFetchingProducts(false);
        }
    };

    // Mahsulotlarni qidirish

    useEffect(() => {
        fetchInput();
        fetchProductsData(); // API dan mahsulotlarni yuklash
    }, []);

    // Ma'lumot qo'shish
    const handleAddInput = async (values) => {
        try {
            await axios.post(
                `http://localhost:3000/input/insert/${id}`,
                values
            );
            message.success("Ma'lumot muvaffaqiyatli qo'shildi!");
            // Ma'lumotlarni yangilash
            await fetchInput(); // Yangilangan ma'lumotlar uchun
        } catch (error) {
            console.error("Ma'lumotlarni qo'shishda xato:", error);
            message.error("Ma'lumotlarni qo'shishda xato.");
        } finally {
            form.resetFields(); // Formni tozalash
            setAddDrawerVisible(false); // Qo'shish uchun Drawer-ni yopish
        }
    };

    // Ma'lumotni yangilash
    const handleEditInput = async (values) => {
        try {
            await axios.put(
                `http://localhost:3000/input/update/${editingRecord.id}`,
                values
            );
            message.success("Ma'lumot muvaffaqiyatli yangilandi!");
            fetchInput(); // Yangilangan ma'lumotlarni olish
        } catch (error) {
            console.error("Ma'lumotni yangilashda xato:", error);
            message.error("Ma'lumotni yangilashda xato.");
        } finally {
            form.resetFields(); // Formni tozalash
            setEditDrawerVisible(false); // Tahrirlash uchun Drawer-ni yopish
        }
    };

    // Tahrirlash Drawer-ni ochish
    const openEditDrawer = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            product: record.product,
        });
        setEditDrawerVisible(true);
    };

    useEffect(() => {
        if (editingRecord) {
            form.setFieldsValue({
                product: editingRecord.product,
            });
        }
    }, [editingRecord]);
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
            title: 'Product ID',
            dataIndex: 'product_id',
            key: 'product_id',
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Provider ID',
            dataIndex: 'provider_id',
            key: 'provider_id',
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
            title: 'Currency ID',
            dataIndex: 'currency_id',
            key: 'currency_id',
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
            <Button
                type='primary'
                onClick={() => setAddDrawerVisible(true)}
                className='ml-[90%]'>
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
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Qo'shish
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

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

            <Drawer
                title='Mahsulot tahrirlash'
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
                                message: 'Mahsulot nomini tanlang',
                            },
                        ]}>
                        <Select
                            showSearch
                            placeholder='Mahsulot tanlang'
                            notFoundContent={
                                fetchingProducts ? <Spin /> : null
                            }>
                            {products.map((product) => (
                                <Option key={product.id} value={product.id}>
                                    {product.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Tahrirlash
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default InputComponent;
