import { Table, Button, Drawer, Form, Input, InputNumber, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { TabPane } = Tabs;

export function Counterparty() {
    const [customersData, setCustomersData] = useState([]);
    const [providersData, setProvidersData] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('customers');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3000/counterparty/all'
            );
            console.log(response.data.counterparty);
            const counterpartyData = response.data.counterparty;

            if (activeTab === 'customers') {
                const filteredCustomers = counterpartyData.filter(
                    (item) => item.who === 1
                );
                setCustomersData(filteredCustomers);
            } else {
                const filteredProviders = counterpartyData.filter(
                    (item) => item.who === 2
                );
                setProvidersData(filteredProviders);
            }
        } catch (error) {
            console.error("Ma'lumotlarni olishda xato:", error);
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

            fetchData();
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const handleEdit = async (values) => {
        try {
            if (editingItem) {
                await axios.put(
                    `http://localhost:3000/counterparty/update/${editingItem.id}`,
                    values
                );

                fetchData();
                setEditingItem(null);
                setIsDrawerOpen(false);
            }
        } catch (error) {
            console.error('Error editing data:', error);
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
            fetchData();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Region', dataIndex: 'region', key: 'region' },
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
                <TabPane tab='Customers' key='customers'>
                    <Button type='primary' onClick={openAddDrawer}>
                        Add New Customer
                    </Button>
                    <Table
                        columns={columns}
                        dataSource={customersData}
                        rowKey='id'
                    />
                </TabPane>

                <TabPane tab='Providers' key='providers'>
                    <Button type='primary' onClick={openAddDrawer}>
                        Add New Provider
                    </Button>
                    <Table
                        columns={columns}
                        dataSource={providersData}
                        rowKey='id'
                    />
                </TabPane>
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
                    <Form.Item name='region' label='Region'>
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
