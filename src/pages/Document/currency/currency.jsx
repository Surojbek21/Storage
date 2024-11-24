import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Table,
    Drawer,
    Form,
    Input,
    InputNumber,
    Select,
    message,
    Popconfirm,
} from 'antd';

const Currency = () => {
    const [currencyData, setCurrencyData] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [currency, setCurrency] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3000/currency/all'
            );
            const formattedData = response.data.currency || response.data;
            setCurrencyData(formattedData);
        } catch (error) {
            console.error("Valyuta ma'lumotlarini olishda xato:", error);
            message.error("Valyuta ma'lumotlarini olishda xato.");
        }
    };

    const handleAdd = async (values) => {
        try {
            await axios.post('http://localhost:3000/currency/insert', values);
            fetchData();
            message.success("Valyuta muvaffaqiyatli qo'shildi!");
            setIsDrawerOpen(false);
        } catch (error) {
            console.error("Valyuta qo'shishda xato:", error);
            message.error("Valyuta qo'shishda xato.");
        }
    };

    const handleEdit = async (values) => {
        try {
            if (editingItem) {
                await axios.put(
                    `http://localhost:3000/currency/updated/${editingItem.id}`,
                    values
                );
                fetchData();
                setCurrency(response.data),
                setEditingItem(null);
                setIsDrawerOpen(false);
                message.success('Valyuta muvaffaqiyatli yangilandi!');
            }
        } catch (error) {
            console.error('Valyutani yangilashda xato:', error);
            message.error('Valyutani yangilashda xato.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/currency/deleted/${id}`);
            fetchData();
            message.success("Valyuta muvaffaqiyatli o'chirildi!");
        } catch (error) {
            console.error("Valyutani o'chirishda xato:", error);
            message.error("Valyutani o'chirishda xato.");
        }
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            if (editingItem) {
                handleEdit(values);
            } else {
                handleAdd(values);
            }
        });
    };

    const openEditDrawer = (item) => {
        setEditingItem(item);
        setIsDrawerOpen(true);
        form.setFieldsValue(item);
    };

    const openAddDrawer = () => {
        setEditingItem(null);
        setIsDrawerOpen(true);
        form.resetFields();
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Exchange Rate',
            dataIndex: 'exchange_rate',
            key: 'exchange_rate',
        },
        {
            title: 'Edit',
            key: 'edit',
            render: (_, record) => (
                <Button onClick={() => openEditDrawer(record)} type='link'>
                    Tahrirlash
                </Button>
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_, record) => (
                <Popconfirm
                    title="Bu valyutani o'chirishni tasdiqlaysizmi?"
                    onConfirm={() => handleDelete(record.id)}
                    okText='Ha'
                    cancelText="Yo'q">
                    <Button type='link' danger>
                        O'chirish
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <Button
                type='primary'
                onClick={openAddDrawer}
                style={{ marginBottom: '16px', float: 'right' }}>
                New Add
            </Button>
            <Table columns={columns} dataSource={currencyData} rowKey='id' />

            <Drawer
                title={
                    editingItem
                        ? 'Valyutani Tahrirlash'
                        : "Yangi Valyuta Qo'shish"
                }
                open={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    form.resetFields();
                }}
                width={400}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            onClick={() => setIsDrawerOpen(false)}
                            style={{ marginRight: 8 }}>
                            Bekor qilish
                        </Button>
                        <Button onClick={handleSubmit} type='primary'>
                            {editingItem ? 'Yangilash' : 'Yuborish'}
                        </Button>
                    </div>
                }>
                <Form form={form} layout='vertical'>
                    <Form.Item
                        name='currency'
                        label='Valyuta Turi'
                        rules={[
                            {
                                required: true,
                                message: 'Valyuta turini tanlang!',
                            },
                        ]}>
                        <Select>
                            {currency.map((currency) => (
                                <Select.Option
                                    key={currency.id}
                                    value={currency.id}>
                                    {currency.name} ({currency.code}
                                    )
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='exchange_rate'
                        label='Valyuta Kursi'
                        rules={[
                            {
                                required: true,
                                message: 'Valyuta kursini kiriting!',
                            },
                        ]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Currency;
