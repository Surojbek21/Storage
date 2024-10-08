import {
    Table,
    Button,
    Drawer,
    Form,
    Input,
    InputNumber,
    Tabs,
    message,
    Spin,
} from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function Counterparty() {
    const [data, setData] = useState({ customers: [], providers: [] });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('customers');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost:3000/counterparty/all'
            );
            const counterparties = response.data.counterparty;
            const customers = counterparties.filter((item) => item.who == 1);
            const providers = counterparties.filter((item) => item.who == 2);
            console.log(customers);
            

            setData({ customers, providers });
        } catch (error) {
            console.error("Ma'lumotlarni olishda xato:", error);
            message.error("Ma'lumotlarni olishda xato");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (values) => {
        try {
            const whoValue = activeTab === 'customers' ? 1 : 2;
            await axios.post('http://localhost:3000/counterparty/insert', {
                ...values,
                who: whoValue,
                status: 1,
            });

            message.success("Yangi ma'lumot qo'shildi");
            fetchData();
            setIsDrawerOpen(false);
        } catch (error) {
            console.error("Ma'lumot qo'shishda xato:", error);
            message.error("Ma'lumot qo'shishda xato");
        }
    };

    const handleEdit = async (values) => {
        if (!editingItem) return;
        try {
            await axios.put(
                `http://localhost:3000/counterparty/update/${editingItem.id}`,
                values
            );
            message.success("Ma'lumot yangilandi");
            fetchData();
            setEditingItem(null);
            setIsDrawerOpen(false);
        } catch (error) {
            console.error("Ma'lumot yangilashda xato:", error);
            message.error("Ma'lumot yangilashda xato");
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:3000/counterparty/delete/${id}`
            );
            message.success("Ma'lumot o'chirildi");
            fetchData();
        } catch (error) {
            console.error("Ma'lumot o'chirishda xato:", error);
            message.error("Ma'lumot o'chirishda xato");
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Region', dataIndex: 'regions', key: 'regions' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Inn', dataIndex: 'inn', key: 'inn' },
        { title: 'stir', dataIndex: 'stir', key: 'stir' },
        { title: 'mfo', dataIndex: 'mfo', key: 'mfo' },
        { title: 'email', dataIndex: 'email', key: 'email' },
        { title: 'created', dataIndex: 'created', key: 'created' },
        { title: 'status', dataIndex: 'status', key: 'status' },
        {
            title: 'Edit',
            key: 'edit',
            render: (_, record) => (
                <Button onClick={() => openEditDrawer(record)} type='link'>
                    Edit
                </Button>
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_, record) => (
                <Button
                    onClick={() => handleDelete(record.id)}
                    type='link'
                    danger>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                {[
                    {
                        key: 'customers',
                        title: 'Customers',
                        data: data.customers,
                        buttonLabel: 'Add New Customer',
                    },
                    {
                        key: 'providers',
                        title: 'Providers',
                        data: data.providers,
                        buttonLabel: 'Add New Provider',
                    },
                ].map((tab) => (
                    <Tabs.TabPane tab={tab.title} key={tab.key}>
                        <Button type='primary' onClick={openAddDrawer}>
                            {tab.buttonLabel}
                        </Button>
                        <Spin spinning={loading}>
                            <Table
                                columns={columns}
                                dataSource={tab.data}
                                rowKey='id'
                            />
                        </Spin>
                    </Tabs.TabPane>
                ))}
            </Tabs>

            <Drawer
                title={editingItem ? 'Edit Item' : 'Add New Item'}
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            onClick={() => setIsDrawerOpen(false)}
                            style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} type='primary'>
                            {editingItem ? 'Update' : 'Submit'}
                        </Button>
                    </div>
                }>
                <Form form={form} layout='vertical'>
                    <Form.Item
                        name='name'
                        label='Name'
                        rules={[
                            {
                                required: true,
                                message: 'Please input the name!',
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='first_name' label='First Name'>
                        <Input />
                    </Form.Item>
                    <Form.Item name='regions' label='Region'>
                        <Input />
                    </Form.Item>
                    <Form.Item name='address' label='Address'>
                        <Input />
                    </Form.Item>
                    <Form.Item name='phone' label='Phone'>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}

export default Counterparty;
