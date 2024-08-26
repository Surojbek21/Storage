import { Table, Input, Drawer, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import axios from 'axios';

const Gruppatovar = () => {
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        наименование: '',
        категория: '',
    });

    // Ma'lumotlarni yuklash
    useEffect(() => {
        const fetchData = async () => {
            try {
                const req = await axios.get('http://localhost:3000/group/all');
                setData(req.data.group_product);
                alert('Ma`lumotlarni yuklandi');
            } catch (error) {
                console.error(error);
                alert('Xatolik yuz berdi');
            }
        };

        fetchData();
    }, []);

    const handleEdit = (record) => {
        setEditingKey({
            key: record.id,
            value: record.наименование,
        });
    };

    const handleSave = (key) => {
        const newData = data.map((item) => {
            if (item.id === key) {
                return { ...item, наименование: editingKey.value };
            }
            return item;
        });
        setData(newData);
        setEditingKey(null);
    };

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleDelete = (key) => {
        const newData = data.filter((item) => item.id !== key);
        setData(newData);
    };

    const handleAddItem = () => {
        const newData = [...data, { id: Date.now(), ...newItem }];
        setData(newData);
        setNewItem({ наименование: '', категория: '' });
        handleCloseDrawer();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Наименование',
            dataIndex: 'наименование',
            render: (text, record) =>
                record.id === editingKey?.key ? (
                    <Input
                        value={editingKey.value}
                        onChange={(e) =>
                            setEditingKey({
                                ...editingKey,
                                value: e.target.value,
                            })
                        }
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'Категория',
            dataIndex: 'категория',
        },
        {
            title: 'Изменить',
            dataIndex: 'изменить',
            render: (text, record) =>
                record.id === editingKey?.key ? (
                    <button
                        onClick={() => handleSave(record.id)}
                        style={{
                            border: 'none',
                            width: '70px',
                            height: '30px',
                            borderRadius: '5px',
                            backgroundColor: 'blue',
                            color: 'white',
                            cursor: 'pointer',
                        }}>
                        Saqlash
                    </button>
                ) : (
                    <button
                        onClick={() => handleEdit(record)}
                        style={{
                            border: 'none',
                            width: '70px',
                            height: '30px',
                            borderRadius: '5px',
                            backgroundColor: 'green',
                            color: 'white',
                            cursor: 'pointer',
                        }}>
                        <EditFilled />
                    </button>
                ),
        },
        {
            title: 'Удалить',
            dataIndex: 'удалить',
            render: (text, record) => (
                <button
                    onClick={() => handleDelete(record.id)}
                    style={{
                        border: 'none',
                        width: '60px',
                        height: '30px',
                        borderRadius: '5px',
                        backgroundColor: 'red',
                        color: 'white',
                        cursor: 'pointer',
                    }}>
                    <DeleteFilled />
                </button>
            ),
        },
    ];

    return (
        <div>
            <Button
                type='primary'
                onClick={handleOpenDrawer}
                style={{ marginBottom: '16px', marginLeft: '90%' }}>
                Add
            </Button>

            <Drawer
                width={300}
                onClose={handleCloseDrawer}
                open={isDrawerOpen}
                bodyStyle={{ paddingBottom: 80 }}>
                <input
                    type='text'
                    name='наименование'
                    placeholder='наименование'
                    value={newItem.наименование}
                    onChange={handleInputChange}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginTop: '50px',
                        marginBottom: '16px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                    }}
                />
                <input
                    type='text'
                    name='категория'
                    placeholder='категория'
                    value={newItem.категория}
                    onChange={handleInputChange}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginTop: '16px',
                        marginBottom: '16px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                    }}
                />
                <Button
                    type='default'
                    onClick={() =>
                        setNewItem({ наименование: '', категория: '' })
                    }
                    style={{
                        width: '45%',
                        backgroundColor: 'gray',
                        color: 'white',
                        marginTop: '26px',
                        marginRight: '10px',
                    }}>
                    Clear
                </Button>
                <Button
                    type='primary'
                    onClick={handleAddItem}
                    style={{ width: '45%' }}>
                    Save
                </Button>
            </Drawer>

            <Table columns={columns} dataSource={data} rowKey='id' />
        </div>
    );
};

export default Gruppatovar;
