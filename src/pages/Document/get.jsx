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
    Input,
    DatePicker,
    Popover, // Popover import qilindi
} from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Calendar from 'react-calendar'; // Kalendarni import qilish
import 'react-calendar/dist/Calendar.css'; // Kalendar uslublarini import qilish

const { Option } = Select;
const { Search } = Input;

const InputPro = () => {
    const [getData, setGetData] = useState([]);
    const [results, setResults] = useState([]);
    const [counterparty, setCounterparty] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [editingRecord, setEditingRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateValue, setDateValue] = useState(new Date()); // Kalendar uchun holat
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
            const formattedData = response.data.input;
            setGetData(formattedData);
            setResults(formattedData);
        } catch (error) {
            console.error("Ma'lumotlarni olishda xato:", error);
            message.error("Ma'lumotlarni olishda xato.");
        } finally {
            setLoading(false);
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
                yaratilgan_sana: values.yaratilgan_sana.toISOString(), // Sana formatlash
                date: dateValue.toISOString(), // Kalendar sanasi
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
                yaratilgan_sana: values.yaratilgan_sana.toISOString(),
                count: values.count || 0,
                summ: values.summ || 0,
                date: dateValue.toISOString(), // Kalendar sanasi
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
            form.setFieldsValue({
                ...record,
                yaratilgan_sana: record.yaratilgan_sana
                    ? new Date(record.yaratilgan_sana)
                    : null, // `moment` o'rniga to'g'ridan-to'g'ri `Date`
            });
            setDateValue(new Date(record.date)); // Kalendar sanasini o'rnatish
        } else {
            setEditMode(false);
            form.resetFields();
            setDateValue(new Date()); // Kalendar sanasini tozalash
        }
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setEditingRecord(null);
        form.resetFields();
    };

    const handleSearch = (value) => {
        const searchValue = value.trim().toLowerCase();
        if (searchValue) {
            const filteredData = getData.filter((item) =>
                item.name.toLowerCase().includes(searchValue)
            );
            setResults(filteredData);
        } else {
            setResults(getData);
        }
    };

    const handleCalendarChange = (value) => {
        setDateValue(value);
        // Filtering results based on selected date
        const filteredData = getData.filter((item) => {
            const itemDate = new Date(item.yaratilgan_sana).toDateString();
            return itemDate === value.toDateString();
        });
        setResults(filteredData);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link to={`/get/${record.id}`} state={{ id: record.id }}>
                    <span>{text}</span>
                </Link>
            ),
        },
        {
            title: 'cp_id',
            dataIndex: 'counterparty_id',
            key: 'counterparty_id',
        },
        { title: 'Soni', dataIndex: 'product_soni', key: 'product_soni' },
        { title: 'Jami soni', dataIndex: 'jami_soni', key: 'jami_soni' },
        { title: 'Dollar', dataIndex: 'narx_dollar', key: 'narx_dollar' },
        { title: 'Summa', dataIndex: 'narx_sum', key: 'narx_sum' },
        {
            title: 'Дата создания',
            dataIndex: 'yaratilgan_sana',
            key: 'yaratilgan_sana',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Tahrirlash',
            key: 'edit',
            render: (_, record) => (
                <Button type='link' onClick={() => openDrawer(record)}>
                    Tahrirlash
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Search
                        placeholder='Qidiruv...'
                        enterButton
                        onSearch={handleSearch}
                        style={{ width: 400 }}
                    />

                    {/* Popover ichida Calendar */}
                    <Popover
                        content={
                            <Calendar
                                onChange={handleCalendarChange}
                                value={dateValue}
                            />
                        }
                        title='Sanani tanlang'
                        trigger='click'>
                        <Button>Kalendardan tanlash</Button>
                    </Popover>
                </div>
                <Button type='primary' onClick={() => openDrawer(null)}>
                    Qo'shish
                </Button>
            </div>

            {loading ? (
                <Spin />
            ) : (
                <Table columns={columns} dataSource={results} rowKey='id' />
            )}

            <Drawer
                title={editMode ? "Ma'lumotni yangilash" : "Ma'lumot qo'shish"}
                visible={drawerVisible}
                onClose={closeDrawer}
                width={400}
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
                        label='Counterparty'
                        name='counterparty'
                        rules={[{ required: true, message: 'Tanlang' }]}>
                        <Select placeholder='Counterparty ni tanlang'>
                            {counterparty.map((cp) => (
                                <Option key={cp.id} value={cp.id}>
                                    {cp.name}
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
