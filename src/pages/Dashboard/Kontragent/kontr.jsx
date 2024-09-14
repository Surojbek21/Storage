import {
    Table,
    Button,
    Drawer,
    Form,
    Input,
    InputNumber,
    Tabs,
    Select,
} from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Option } = Select;

function Kontragent() {
    const [activeTab, setActiveTab] = useState('customers');
    const [customersData, setCustomersData] = useState([]);
    const [partyData, setPartyData] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // `false` o'rniga `null`
    const [form] = Form.useForm();
    const { counterpartyId } = useParams();

    useEffect(() => {
        fetchData(); // Ma'lumotlarni boshlang'ich yuklash
    }, [activeTab]); // Har safar activeTab o'zgarganda ma'lumotlarni qayta yuklash

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3000/counterparty/all'
            );
            if (activeTab === 'customers') {
                setCustomersData(
                    response.data.counterparty.filter((item) => item.who === 1)
                );
            } else if (activeTab === 'party') {
                setPartyData(
                    response.data.counterparty.filter((item) => item.who === 2)
                );
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAdd = async (values) => {
        try {
            await axios.post('http://localhost:3000/counterparty/insert', {
                ...values,
                who: activeTab === 'customers' ? 1 : 2, // who ni aniqlash
                status: 1, // Default status
            });
            fetchData(); // Yangi ma'lumotni qayta yuklash
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
                setEditingItem(null); // True o'rniga null
                setIsDrawerOpen(false);
            }
        } catch (error) {
            console.error('Error editing data:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:3000/counterparty/delete/${id}`
            );
            fetchData(); // Ma'lumotni yangilash
        } catch (error) {
            console.error('Error deleting data:', error);
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

    // Customers uchun columns
    const customersColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Region', dataIndex: 'region', key: 'region' }, // `region` maydoni qo'shilgan
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Inn', dataIndex: 'inn', key: 'inn' },
        { title: 'Stir', dataIndex: 'stir', key: 'stir' },
        { title: 'Mfo', dataIndex: 'mfo', key: 'mfo' },
        { title: 'Note', dataIndex: 'note', key: 'note' }, // `note` maydoni qo'shilgan
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
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

    // Party uchun columns
    const partyColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Region', dataIndex: 'region', key: 'region' }, // `region` maydoni qo'shilgan
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Inn', dataIndex: 'inn', key: 'inn' },
        { title: 'Stir', dataIndex: 'stir', key: 'stir' },
        { title: 'Mfo', dataIndex: 'mfo', key: 'mfo' },
        { title: 'Note', dataIndex: 'note', key: 'note' }, // `note` maydoni qo'shilgan
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button onClick={() => openEditDrawer(record)} type='link'>
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(record.id)}
                        type='link'
                        danger>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

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

    return (
        <div className='flex'>
            <div className='w-full'>
                <div className='flex justify-between mb-4'>
                    <Button
                        type='primary'
                        onClick={openAddDrawer}
                        className='ml-auto'>
                        Add New
                    </Button>
                </div>
                <div className=''>
                    <div className='flex items-center justify-center'>
                        <Tabs
                            type='card'
                            activeKey={activeTab}
                            onChange={(key) => setActiveTab(key)}
                            items={[
                                {
                                    label: 'поставщик',
                                    key: 'customers',
                                    children: (
                                        <Table
                                            columns={customersColumns}
                                            dataSource={customersData}
                                            rowKey='id'
                                        />
                                    ),
                                },
                                {
                                    label: 'клиент',
                                    key: 'party',
                                    children: (
                                        <Table
                                            columns={partyColumns}
                                            dataSource={partyData}
                                            rowKey='id'
                                        />
                                    ),
                                },
                            ]}
                            size='large'
                            style={{
                                width: '98%',
                                fontSize: '30px',
                                paddingTop: '100px',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                            }}
                        />
                    </div>
                </div>

                <Drawer
                    title={editingItem ? 'Edit Item' : 'Add New Item'}
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    width={400}
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
                        <Form.Item
                            name='first_name'
                            label='First Name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the first name!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='regions'
                            label='Region'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the region!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='address'
                            label='Address'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the address!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='phone'
                            label='Phone'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the phone number!',
                                },
                            ]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name='email'
                            label='Email'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the email!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='inn'
                            label='Inn'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the inn!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='stir'
                            label='Stir'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the stir!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='mfo'
                            label='Mfo'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the mfo!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='note'
                            label='Node'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the node!',
                                },
                            ]}
                            style={{ marginTop: '20px' }}>
                            <Input />
                        </Form.Item>
                        
                    </Form>
                </Drawer>
            </div>
        </div>
    );
}

export default Kontragent;
