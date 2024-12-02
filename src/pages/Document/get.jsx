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
    Pagination,
    DatePicker,
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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);

    useEffect(() => {
        fetchData();
        fetchCounterparty();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost:3000/input_pro/all1'
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

    const fetchCounterparty = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3000/input_pro/getcustomer'
            );
            setCounterparty(response.data.input);
        } catch (error) {
            console.error("Counterparty ma'lumotlarini olishda xato:", error);
            message.error("Counterparty ma'lumotlarini olishda xato.");
        }
    };

    const handleSearch = async (value) => {
        const searchValue = value.trim();
        if (!searchValue) {
            setResults(getData);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost:3000/input_pro/search1',
                {
                    params: { name: searchValue },
                }
            );
            const searchResults = response.data.input;
            if (searchResults.length === 0) {
                message.warning('Qidiruv natijalari topilmadi.');
            }
            setResults(searchResults);
            setCurrentPage(1);
        } catch (error) {
            console.error('Qidiruvda xato:', error);
            message.error('Qidiruvda xato yuz berdi.');
        } finally {
            setLoading(false);
        }
    };

    // time

    const handleDateRangeChange = (dates) => {
        if (!dates || dates.length !== 2) return;

        const [startDate, endDate] = dates;

        const formattedStartDate = startDate.startOf('day').toDate();
        const formattedEndDate = endDate.endOf('day').toDate();

        const filteredResults = getData.filter((item) => {
            const itemDate = new Date(item.yaratilgan_sana);
            return (
                itemDate >= formattedStartDate && itemDate <= formattedEndDate
            );
        });

        setResults(filteredResults);
        setCurrentPage(1);
    };

    // Filtrlangan natijalarni sahifalash
    const paginatedResults = results.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };
    const openDrawer = (record) => {
        setEditMode(!!record);
        setEditingRecord(record);
        form.setFieldsValue(record || {});
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        form.resetFields();
        setEditingRecord(null);
    };

    const handleAdd = async (values) => {
        try {
            await axios.post('http://localhost:3000/input_pro/insert', values);
            message.success("Ma'lumot muvaffaqiyatli qo'shildi!");
            fetchData();
            closeDrawer();
        } catch (error) {
            console.error("Ma'lumotni qo'shishda xato:", error);
            message.error("Ma'lumotni qo'shishda xato.");
        }
    };

    const handleUpdate = async (values) => {
        try {
            await axios.put(
                `http://localhost:3000/input_pro/update/${editingRecord.id}`,
                values
            );
            message.success("Ma'lumot muvaffaqiyatli yangilandi!");
            fetchData();
            closeDrawer();
        } catch (error) {
            console.error("Ma'lumotni yangilashda xato:", error);
            message.error("Ma'lumotni yangilashda xato.");
        }
    };
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/input_pro/delete/${id}`
            );

            if (response.status === 200) {
                message.success("Ma'lumot muvaffaqiyatli o'chirildi!");
                fetchData(); // Ma'lumotlarni qayta yuklash
            } else {
                message.error(
                    "Bu element allaqachon o'chirilgan yoki topilmadi."
                );
            }
        } catch (error) {
            console.error("Ma'lumotni o'chirishda xato:", error);
            message.error("Ma'lumotni o'chirishda xato yuz berdi.");
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            render: (link, a) => (
                <Link to={`/get/olish/${a.id}`} state={{ id: a.id }}>
                    {link}
                </Link>
            ),
        },
        {
            title: 'Product Soni',
            dataIndex: 'status_1_product_soni',
            key: 'status_1_product_soni',
        },
        {
            title: 'Jami soni',
            dataIndex: 'status_1_jami_soni',
            key: 'status_1_jami_soni',
        },
        {
            title: 'Dollar',
            dataIndex: 'status_1_narx_dollar',
            key: 'status_1_narx_dollar',
        },
        {
            title: 'Summa',
            dataIndex: 'status_1_narx_sum',
            key: 'status_1_narx_sum',
        },
        {
            title: 'Дата создания',
            dataIndex: 'yaratilgan_sana',
            key: 'yaratilgan_sana',
            render: (text) => new Date(text).toLocaleDateString(),
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
                <div style={{ display: 'flex', marginBottom: 16 }}>
                    <Search
                        placeholder='Qidiruv...'
                        enterButton
                        onSearch={handleSearch}
                        style={{ width: 300, marginRight: '10px' }}
                    />
                    <RangePicker
                        style={{ marginLeft: '30px', width: 'auto' }}
                        onChange={handleDateRangeChange}
                        format='YYYY-MM-DD'
                    />
                </div>

                <Button type='primary' onClick={() => openDrawer(null)}>
                    Qo'shish
                </Button>
            </div>

            <>
                <Table
                    columns={columns}
                    dataSource={paginatedResults}
                    pagination={false}
                />
                <Pagination
                    current={currentPage}
                    className='ml-[75%]'
                    total={results.length}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                />
            </>

            <Drawer
                title={editMode ? 'Tahrirlash' : "Qo'shish"}
                visible={drawerVisible}
                onClose={closeDrawer}
                width={400}>
                <Form
                    form={form}
                    onFinish={editMode ? handleUpdate : handleAdd}
                    initialValues={editingRecord || {}}>
                    <Form.Item
                        label='Nomi'
                        name='counterparty_id'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, nom kiriting!',
                            },
                        ]}>
                        <Select placeholder='Nomini tanlang'>
                            {counterparty.map((counterparty) => (
                                <Option
                                    key={counterparty.id}
                                    value={counterparty.id}>
                                    {counterparty.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='ml-[75%]'>
                            {editMode ? 'Yangilash' : "Qo'shish"}
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default InputPro;
