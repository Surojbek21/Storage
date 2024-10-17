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
    Popover,
    DatePicker,
    Pagination,
} from 'antd';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const InputPro = () => {
    const [getData, setGetData] = useState([]);
    const [results, setResults] = useState([]);
    const [counterparty, setCounterparty] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [editingRecord, setEditingRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);

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
            const formattedData = response.data.input;
            setCounterparty(formattedData);
        } catch (error) {
            console.error("Counterparty ma'lumotlarini olishda xato:", error);
            message.error("Counterparty ma'lumotlarini olishda xato.");
        }
    };

    const handleSearch = (value = '') => {
        const searchValue = value.trim().toLowerCase();
        const filteredData = getData.filter((item) => {
            const isMatch = item.name.toLowerCase().includes(searchValue);
            const isInRange =
                dateRange.length === 2
                    ? new Date(item.yaratilgan_sana) >= dateRange[0] &&
                      new Date(item.yaratilgan_sana) <= dateRange[1]
                    : true;
            return isMatch && isInRange;
        });
        setResults(filteredData);
        setCurrentPage(1);
    };

    const handleRangePickerChange = (dates) => {
        setDateRange(dates || []);
    };

    const handleSearchWithDate = () => {
        handleSearch();
    };

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    const paginatedResults = results.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const openDrawer = (record) => {
        setEditMode(!!record);
        setEditingRecord(record);
        form.setFieldsValue(record || {}); // Formani to'ldirish
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        form.resetFields();
        setEditingRecord(null);
    };

    const handleAdd = async (values) => {
        try {
            // Ma'lumotlarni tekshirish va formatlash
            const formattedValues = {
                ...values,
                product_soni: values.product_soni || 0,
                jami_soni: values.jami_soni || 0,
                narx_dollar: values.narx_dollar || 0,
                narx_sum: values.narx_sum || 0,
            };

            // API ga so'rov yuborish
            await axios.post(
                'http://localhost:3000/input_pro/insert',
                formattedValues
            );
            message.success("Ma'lumot muvaffaqiyatli qo'shildi!");

            // Ma'lumotlarni yangilash
            fetchData();

            // Drawer'ni yopish
            closeDrawer();
        } catch (error) {
            console.error("Ma'lumotni qo'shishda xato:", error);
            message.error("Ma'lumotni qo'shishda xato.");
        }
    };

    const handleUpdate = async (values) => {
        try {
            // Ma'lumotlarni tekshirish va formatlash
            const formattedValues = {
                ...values,
                product_soni: values.product_soni || 0,
                jami_soni: values.jami_soni || 0,
                narx_dollar: values.narx_dollar || 0,
                narx_sum: values.narx_sum || 0,
            };

            // API orqali yangilash
            await axios.put(
                `http://localhost:3000/input_pro/update/${editingRecord.id}`,
                formattedValues
            );
            message.success("Ma'lumot muvaffaqiyatli yangilandi!");

            // Ma'lumotlarni yangilash
            fetchData();

            // Drawer'ni yopish
            closeDrawer();
        } catch (error) {
            console.error("Ma'lumotni yangilashda xato:", error);
            message.error("Ma'lumotni yangilashda xato.");
        }
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/input_pro/delete/${id}`);
            message.success("Ma'lumot muvaffaqiyatli o'chirildi!");
            fetchData(); // Yangilanish
        } catch (error) {
            console.error("Ma'lumotni o'chirishda xato:", error);
            message.error("Ma'lumotni o'chirishda xato.");
        }
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
                    <Popover
                        content={
                            <>
                                <RangePicker
                                    onChange={handleRangePickerChange}
                                    value={dateRange}
                                    format='YYYY-MM-DD'
                                />
                                <Button
                                    type='primary'
                                    style={{ marginTop: '8px' }}
                                    onClick={handleSearchWithDate}>
                                    Qidirish
                                </Button>
                            </>
                        }
                        title='Sanalarni tanlang'
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
                <>
                    <Table
                        columns={columns}
                        dataSource={paginatedResults}
                        pagination={false}
                    />
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={results.length}
                        onChange={handleChangePage}
                        style={{
                            marginTop: '16px',
                            textAlign: 'right',
                            justifyContent: 'end',
                        }}
                    />
                </>
            )}

            <Drawer
                title={
                    editMode
                        ? "Ma'lumotni yangilash"
                        : "Yangi ma'lumot qo'shish"
                }
                open={drawerVisible}
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
                                            handleUpdate(values); // Yangilash uchun handleUpdate chaqiriladi
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
                        <Select
                            placeholder='Counterparty ni tanlang'
                            showSearch
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }>
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
