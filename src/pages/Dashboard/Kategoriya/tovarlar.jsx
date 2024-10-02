import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Spin,
    Button,
    Drawer,
    Form,
    Input,
    message,
    Table,
    Select,
} from 'antd';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const Tovarlar = () => {
    const [tovarlar, setTovarlar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [currentTovar, setCurrentTovar] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currency, setCurrency] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]); // Status options state
    const [form] = Form.useForm();
    const [statusFilter, setStatusFilter] = useState(null);
    const { productId } = useParams();

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };


    const fetchTovarlar = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/product/all/${productId}`
            );
            let filteredTovarlar = response.data.product;

            if (statusFilter !== null) {
                filteredTovarlar = filteredTovarlar.filter(
                    (item) => item.status === statusFilter
                );
            }

            setTovarlar(filteredTovarlar);
            console.log(filteredTovarlar);
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Tovarlarni yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCurrencyAndStatus = async () => {
            try {
                const currencyRequest = await axios.get(
                    'http://localhost:3000/currency/all'
                );
                setCurrency(currencyRequest.data.currency);

                const statusRequest = await axios.get(
                    'http://localhost:3000/status/all'
                );
                setStatusOptions(statusRequest.data.status);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCurrencyAndStatus();
    }, []);

    useEffect(() => {
        fetchTovarlar();
    }, [productId, statusFilter]);

    const openDrawer = (tovar = null) => {
        setCurrentTovar(tovar);
        if (tovar) {
            form.setFieldsValue({
                ...tovar,
                price_1: tovar.price_1 || '',
                price_2: tovar.price_2 || '',
                price_3: tovar.price_3 || '',
                currency_id: tovar.currency_id || 'USD',
            });
            setEditMode(true);
        } else {
            form.resetFields();
            setEditMode(false);
        }
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setCurrentTovar(null);
    };

    const handleSave = async (values) => {
        try {
            await axios.put(
                `http://localhost:3000/product/update/${currentTovar.id}`,
                {
                    ...values,
                    price_1: values.price_1 || '0',
                    price_2: values.price_2 || '0',
                    price_3: values.price_3 || '0',
                }
            );
            message.success('Tovar muvaffaqiyatli tahrirlandi');
            setTovarlar((prev) =>
                prev.map((item) =>
                    item.id === currentTovar.id ? { ...item, ...values } : item
                )
            );
            closeDrawer();
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Xatolik yuz berdi');
        }
    };

    const handleAdd = async (values) => {
        try {
            const response = await axios.post(
                `http://localhost:3000/product/insert/${productId}`,
                {
                    ...values,
                    price_1: values.price_1 || '0',
                    price_2: values.price_2 || '0',
                    price_3: values.price_3 || '0',
                }
            );
            const newProduct = response.data.product;
            message.success("Yangi tovar muvaffaqiyatli qo'shildi");

            const updatedTovarlar = [...tovarlar, newProduct];
            setTovarlar(updatedTovarlar);

            form.resetFields();
            closeDrawer();
        } catch (error) {
            console.error('Xato bor:', error);
            message.error('Xatolik yuz berdi');
        }
    };


    const handleDelete = async (tovarId) => {
        try {
            await axios.delete(
                `http://localhost:3000/product/delete/${tovarId}`
            );
            message.success("Tovar muvaffaqiyatli o'chirildi");
            setTovarlar((prev) => prev.filter((item) => item.id !== tovarId));
        } catch (error) {
            console.error('Xato bor:', error);
            message.error("Tovarni o'chirishda xatolik yuz berdi");
        }
    };

  const handleStatusChange = async (tovarId, newStatus) => {
      try {
          await axios.post(`http://localhost:3000/product/status/${tovarId}`, {
              status: newStatus,
          });
          message.success(`Status muvaffaqiyatli o'zgartirildi`);
          setTovarlar((prev) =>
              prev.map((item) =>
                  item.id === tovarId ? { ...item, status: newStatus } : item
              )
          );
      } catch (error) {
          console.error('Xato bor:', error);
          message.error("Statusni o'zgartirishda xatolik yuz berdi");
      }
  };


    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        fetchTovarlar();
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price 1',
            dataIndex: 'price_1',
            key: 'price_1',
            render: (text) => text ?? "Noma'lum",
        },
        {
            title: 'Price 2',
            dataIndex: 'price_2',
            key: 'price_2',
            render: (text) => text ?? "Noma'lum",
        },
        {
            title: 'Price 3',
            dataIndex: 'price_3',
            key: 'price_3',
            render: (text) => text ?? "Noma'lum",
        },
        {
            title: 'Currency',
            dataIndex: 'currency_id',
            key: 'currency_id',
            render: (currencyId) => {
                const currencyItem = currency.find((c) => c.id === currencyId);
                return currencyItem ? currencyItem.name : 'Noma’lum';
            },
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
            render: (text) => formatDateTime(text),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    value={status} 
                    onChange={(newStatus) =>
                        handleStatusChange(record.id, newStatus)
                    }>
                    <Option className='bg-red-500' value={0}>X</Option> {/* 0 statusi uchun */}
                    <Option className='bg-green-500' value={1}>✓</Option> {/* 1 statusi uchun */}
                </Select>
            ),
        },

        {
            title: 'Tahrirlash',
            key: 'tahrirlash',
            render: (_, record) => (
                <Button type='link' onClick={() => openDrawer(record)}>
                    Tahrirlash
                </Button>
            ),
        },
        {
            title: "O'chirish",
            key: 'ochirish',
            render: (_, record) => (
                <Button
                    type='link'
                    danger
                    onClick={() => handleDelete(record.id)}>
                    O'chirish
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1
                className='cursor-pointer h-10 text-3xl'
                onClick={() => window.history.back()}>
                <i className='fa-solid fa-arrow-left text-5xl '>←</i>
            </h1>

            <Button
                className='ml-[92%]'
                type='primary'
                onClick={() => openDrawer()}>
                qo'shish
            </Button>

            {loading ? (
                <Spin />
            ) : (
                <Table columns={columns} dataSource={tovarlar} rowKey='id' />
            )}

            <Drawer
                title={editMode ? 'Mahsulotni Tahrirlash' : "Mahsulot Qo'shish"}
                open={drawerVisible}
                onClose={closeDrawer}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            onClick={closeDrawer}
                            style={{ marginRight: 8 }}>
                            Bekor qilish
                        </Button>
                        <Button
                            type='primary'
                            onClick={() => {
                                window.location.reload();
                                form.validateFields()
                                    .then((values) => {
                                        if (editMode) {
                                            handleSave(values);
                                        } else {
                                            handleAdd(values);
                                        }
                                    })
                                    .catch((info) =>
                                        console.log(
                                            'Form validatsiyasida xato bor:',
                                            info
                                        )
                                    );
                            }}>
                            {editMode ? 'Yangilash' : "Qo'shish"}
                        </Button>
                    </div>
                }>
                <Form form={form} layout='vertical'>
                    <Form.Item
                        name='name'
                        label='Mahsulot nomi'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, mahsulot nomini kiriting!',
                            },
                        ]}>
                        <Input placeholder='Mahsulot nomini kiriting' />
                    </Form.Item>
                    <Form.Item
                        name='price_1'
                        label='Price_1'
                        initialValue={currentTovar?.price_1 || '0'}
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, narxni kiriting!',
                            },
                        ]}>
                        <Input placeholder='Narxni kiriting' />
                    </Form.Item>
                    <Form.Item
                        name='price_2'
                        label='Price_2'
                        initialValue={currentTovar?.price_2 || '0'}
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, narxni kiriting!',
                            },
                        ]}>
                        <Input placeholder='Narxni kiriting' />
                    </Form.Item>
                    <Form.Item
                        name='price_3'
                        label='Price_3'
                        initialValue={currentTovar?.price_3 || '0'}
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, narxni kiriting!',
                            },
                        ]}>
                        <Input placeholder='Narxni kiriting' />
                    </Form.Item>

                    <Form.Item
                        name='currency_id'
                        label='Valyuta'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, valyutani tanlang!',
                            },
                        ]}>
                        <Select placeholder='Valyutani tanlang'>
                            {currency.map((option) => (
                                <Option key={option.id} value={option.id}>
                                    {option.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Tovarlar;
