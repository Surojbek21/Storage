    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import {
        Button,
        Table,
        message,
        Popconfirm,
        Drawer,
        Form,
        Select,
        Spin,
    } from 'antd';
    import { Link, useNavigate, useParams } from 'react-router-dom';

    const { Option } = Select;

    const InputPro = () => {
        const [getData, setGetData] = useState([]);
        const [counterparty, setCounterparty] = useState([]);
        const [drawerVisible, setDrawerVisible] = useState(false);
        const [editMode, setEditMode] = useState(false);
        const [form] = Form.useForm();
        const [editingRecord, setEditingRecord] = useState(null);
        const [loading, setLoading] = useState(true);
        const navigate = useNavigate();
        const { id } = useParams();

        useEffect(() => {
            fetchData();
            fetchCounterpartyData();
        }, []);

       const fetchData = async () => {
           setLoading(true);
           try {
               const response = await axios.get(
                   'http://localhost:3000/input_pro/all'
               );
               const formattedData = response.data.input
               console.log(formattedData);
               
               setGetData(formattedData);
           } catch (error) {
               console.error("Ma'lumotlarni olishda xato:", error); // Xatoni konsolga chiqaramiz
               message.error("Ma'lumotlarni olishda xato."); // Foydalanuvchiga xabar beramiz
           } finally {
               setLoading(false); // Loading holatini o'zgartiramiz
           }
       };

        

        const fetchCounterpartyData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/input_pro/all1'
                );
                const formattedData = response.data.input || response.data;
                setCounterparty(Array.isArray(formattedData) ? formattedData : []);
            } catch (error) {
                console.error("Counterparty ma'lumotlarini olishda xato:", error);
                message.error("Counterparty ma'lumotlarini olishda xato.");
            }
        };

        const handleAdd = async (values) => {
            try {
                await axios.post('http://localhost:3000/input_pro/insert', {
                    counterparty_id: values.counterparty,
                });
                message.success("Ma'lumot muvaffaqiyatli qo'shildi!");
                fetchData();
                closeDrawer();
            } catch (error) {
                console.error("Ma'lumotlarni qo'shishda xato:", error);
                message.error("Ma'lumotlarni qo'shishda xato.");
            }
        };

        const handleSave = async (values) => {
            try {
                const dataToUpdate = {
                    ...values,
                    count: values.count || 0,
                    summ: values.summ || 0,
                };

                await axios.put(
                    `http://localhost:3000/input_pro/updated/${editingRecord.id}`,
                    dataToUpdate
                );
                message.success("Ma'lumot muvaffaqiyatli yangilandi!");
                fetchData();
                closeDrawer();
            } catch (error) {
                console.error("Ma'lumotlarni yangilashda xato:", error);
                message.error("Ma'lumotlarni yangilashda xato.");
            }
        };

        const handleDelete = async (id) => {
            try {
                await axios.delete(`http://localhost:3000/input_pro/delete/${id}`);
                fetchData();
                message.success("Ma'lumot muvaffaqiyatli o'chirildi!");
            } catch (error) {
                console.error("Ma'lumotni o'chirishda xato:", error);
                message.error("Ma'lumotni o'chirishda xato.");
            }
        };

        const openDrawer = (record) => {
            if (record) {
                setEditMode(true);
                setEditingRecord(record);
                form.setFieldsValue(record);
            } else {
                setEditMode(false);
                form.resetFields();
            }
            setDrawerVisible(true);
        };

        const closeDrawer = () => {
            setDrawerVisible(false);
            setEditingRecord(null);
            form.resetFields(); // Formani tozalash
        };

        const columns = [
            { title: 'ID', dataIndex: 'id', key: 'id' },
            {
                title: 'Имя',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => {
                    return (
                        <Link to={`/get/${record.id}`} state={{ id: record.id }}>
                            <span>{text}</span>
                        </Link>
                    );
                },
            },

            { title: 'cp_id', dataIndex: 'counterparty_id', key: 'counterparty_id' },
            { title: 'soni', dataIndex: 'prduct_soni', key: 'prduct_soni' },
            { title: 'jami soni', dataIndex: 'jami_soni', key: 'jami_soni' },
            { title: 'doller', dataIndex: 'narx_dollar', key: 'narx_dollar' },
            { title: 'summ', dataIndex: 'narx_sum', key: 'narx_sum' },
            {
                title: 'Дата создания',
                dataIndex: 'created',
                key: 'created',
                render: (text) => <p>{text}</p>,
            },
            {
                title: 'Редактировать',
                key: 'edit',
                render: (_, record) => (
                    <Button type='link' onClick={() => openDrawer(record)}>
                        Редактировать
                    </Button>
                ),
            },
            {
                title: 'Удалить',
                key: 'delete',
                render: (_, record) => (
                    <Popconfirm
                        title="Bu ma'lumotni o'chirishni tasdiqlaysizmi?"
                        onConfirm={() => handleDelete(record.id)}
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
                <Button
                    type='primary'
                    onClick={() => openDrawer(null)}
                    style={{ marginLeft: '90%' }}>
                    Qo'shish
                </Button>

                {loading ? (
                    <Spin />
                ) : (
                    <Table columns={columns} dataSource={getData} rowKey='id' />
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
                            name='counterparty'
                            label='Mijoz tanlang'
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos, mijozni tanlang!',
                                },
                            ]}>
                            <Select
                                showSearch
                                placeholder='Mijozni tanlang'
                                optionFilterProp='label'
                                filterOption={(input, option) =>
                                    option?.label
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }>
                                {counterparty.map((option) => (
                                    <Option
                                        key={option.id}
                                        value={option.id}
                                        label={option.name}>
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

    export default InputPro;
