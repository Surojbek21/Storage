import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    message,
    Table,
    Spin,
    List,
    Button,
    Drawer,
    Form,
    Input,
    InputNumber,
    Select,
    Popconfirm,
} from 'antd';
import { useLocation, useParams } from 'react-router-dom';

const { Option } = Select;

const InputComponent = () => {
    const [inputList, setInputList] = useState([]); // Mahsulotlar ro'yxati
    const [loading, setLoading] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false); // Drawer holati
    const [editingRecord, setEditingRecord] = useState(null); // Tahrirlanayotgan yozuv
    const [form] = Form.useForm(); // Form instance
    const location = useLocation();
    const id = location.state.id;

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

    const handleAddOrEditInput = async (values) => {
        if (editingRecord) {
            // Ma'lumotni yangilash
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
        } else {
            // Yangi ma'lumot qo'shish
            try {
                await axios.post(`http://localhost:3000/input/insert/${id}`, values);
                message.success("Ma'lumot muvaffaqiyatli qo'shildi!");
                fetchInput();
            } catch (error) {
                console.error("Ma'lumotlarni qo'shishda xato:", error);
                message.error("Ma'lumotlarni qo'shishda xato.");
            }
        }
        setDrawerVisible(false); // Drawer-ni yopish
        form.resetFields(); // Formni tozalash
    };

    const openDrawer = (record = null) => {
        setEditingRecord(record);
        if (record) {
            form.setFieldsValue({
                product: record.product,
                number: record.number,
                price: record.price,
                currency: record.currency,
            });
        }
        setDrawerVisible(true);
    };

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
                <Button type='link' onClick={() => openDrawer(record)}>
                    Редактировать
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
                        Удалить
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <h1
                className='cursor-pointer h-10 text-3xl'
                onClick={() => window.history.back()}>
                <i className='fa-solid fa-arrow-left text-5xl'>←</i>
            </h1>
            <Button
                type='primary'
                onClick={() => openDrawer()}
                className='ml-[90%]'>
                Add
            </Button>
            {loading ? (
                <Spin />
            ) : (
                <Table columns={columns} dataSource={inputList} rowKey='id' />
            )}

            <Drawer
                title={
                    editingRecord
                        ? 'Mahsulotni tahrirlash'
                        : 'Mahsulot qo‘shish'
                }
                width={400}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}>
                <Form
                    layout='vertical'
                    form={form}
                    onFinish={handleAddOrEditInput}>
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
                        <InputNumber min={1} />
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
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        name='currency'
                        label='Valyuta'
                        rules={[
                            { required: true, message: 'Valyutani tanlang' },
                        ]}>
                        <Select>
                            <Option value='USD'>USD</Option>
                            <Option value='EUR'>EUR</Option>
                            <Option value='UZS'>UZS</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            {editingRecord ? 'Yangilash' : "Qo'shish"}
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default InputComponent;
