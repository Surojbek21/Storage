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
    Input,
} from 'antd';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const InputComponent = () => {
    const [inputList, setInputList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [products, setProducts] = useState([]);
    const [fetchingProducts, setFetchingProducts] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalNumber, setTotalNumber] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const [form] = Form.useForm();
    const { id } = useParams();

    // Input data va mahsulotlar ro'yxatini olish
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
            setInputList(data.input);

            const totalNum = data.input.reduce(
                (sum, item) => sum + item.number,
                0
            );
            const totalPrc = data.input.reduce(
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

   const fetchProductsData = async () => {
       setFetchingProducts(true);
       try {
           const { data } = await axios.get(
               'http://localhost:3000/input/product'
           );
           console.log('Fetched products data:', data.input); // data.input ni tekshirish
           setProducts(data.input); // data.input bilan ishlash
       } catch (error) {
           console.error('Mahsulotlarni olishda xato:', error);
           message.error('Mahsulotlarni olishda xato yuz berdi');
       } finally {
           setFetchingProducts(false);
       }
   };



    const insertInput = async (id, values) => {
        try {
            await axios.post(
                `http://localhost:3000/input/insert/${id}`,
                values
            );
            message.success("Ma'lumot muvaffaqiyatli qo'shildi!");
        } catch (error) {
            console.error('Insert API xatosi:', error);
            message.error('Ma`lumotni qo`shishda xato yuz berdi.');
            throw error;
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            // Product ID ni olamiz
            const productId = values.product;

            // Agar mavjud yozuvni tahrirlayotgan bo'lsak
            if (editingRecord) {
                await axios.put(
                    `http://localhost:3000/input/update/${editingRecord.id}`, // Backenddagi URL
                    {
                        ...values,
                        product_id: productId, // Mahsulot ID
                        status: 1, // Majburiy qiymat
                    }
                );
            } else {
                // Yangi yozuv qo'shayotganda
                await insertInput(id, {
                    ...values,
                    number: values.number || 1, // Default qiymat: 1
                    price: values.price || 0, // Default qiymat: 0
                    product_id: productId, // Mahsulot ID
                    status: 1, // Default qiymat
                });
            }

            // Ma'lumotlarni qaytadan yuklaymiz
            await fetchInput();
            message.success('Amaliyot muvaffaqiyatli bajarildi!');
        } catch (error) {
            // Xatolikni konsolda ko'rsatamiz
            console.error('Xato:', error.response?.data || error.message);
            message.error(
                error.response?.data?.error || 'Amaliyotda xato yuz berdi.'
            );
        } finally {
            // Forma tozalanadi va boshqa sozlamalar tiklanadi
            form.resetFields();
            setDrawerVisible(false);
            setEditingRecord(null);
        }
    };


    const openEditDrawer = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            product: record.product.id,
            number: record.number,
            price: record.price,
        });
        setDrawerVisible(true);
    };

    const handleDeleteInput = async (inputId) => {
        try {
            await axios.delete(`http://localhost:3000/input/delete/${inputId}`);
            fetchInput();
            message.success('Mahsulot o‘chirildi');
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Mahsulotni o‘chirishda xato yuz berdi');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            // render: (product) => {
            //     console.log('Product:', product); // product obyektini tekshirish
            //     return product?.name || 'Mahsulot nomi mavjud emas'; // Mahsulot nomini ko'rsatish
            // },
        },

        { title: 'Number', dataIndex: 'number', key: 'number' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Currency', dataIndex: 'currency', key: 'currency' },
        {
            title: 'Tahrirlash',
            render: (_, record) => (
                <Button type='link' onClick={() => openEditDrawer(record)}>
                    Tahrirlash
                </Button>
            ),
        },
        {
            title: "O'chirish",
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
                onClick={() => setDrawerVisible(true)}
                className='ml-[85%] mb-5'>
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
                title={
                    editingRecord ? 'Mahsulot tahrirlash' : "Mahsulot qo'shish"
                }
                width={400}
                onClose={() => {
                    setDrawerVisible(false);
                    setEditingRecord(null);
                }}
                visible={drawerVisible}>
                <Form layout='vertical' form={form} onFinish={handleFormSubmit}>
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

                    <Form.Item
                        name='number'
                        label='Soni'
                        rules={[
                            { required: true, message: 'Sonini kiriting' },
                        ]}>
                        <Input min={1} />
                    </Form.Item>
                    <Form.Item
                        name='price'
                        label='Narxi'
                        rules={[
                            { required: true, message: 'Narxini kiriting' },
                        ]}>
                        <Input min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                        name='currency_id'
                        label='Currency ID'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, valyuta ID ni tanlang!',
                            },
                        ]}>
                        <Select placeholder='ID tanlang'>
                            <Option value={1}>$$</Option>
                            <Option value={2}>Milliy valyuta</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='ml-[70%]'>
                            {editingRecord ? 'Tahrirlash' : "Qo'shish"}
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
                    marginLeft: '80%',
                }}
            />
        </div>
    );
};

export default InputComponent;
