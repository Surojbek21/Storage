// import { Table, Input } from 'antd';
import React, { useEffect, useState } from 'react';
// import { DeleteFilled, EditFilled } from '@ant-design/icons';
import axios from 'axios';
import { Table } from 'antd';

const Kategoriya = () => {
    const [data, setData] = useState([]);
    // const [editingKey, setEditingKey] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/category'
                );
                setData(response.data.categoriy);
                console.log(response.data.categoriy);
                alert('Data fetched successfully');
                
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data');
            }
        };

        fetchData();
    }, []);

    const handleEdit = (record) => {
        setEditingKey({ key: record.id, value: record.name });
    };

    const handleSave = (id) => {
        const newData = data.map((item) => {
            if (item.id === id) {
                return { ...item, name: editingKey.value };
            }
            return item;
        });
        setData(newData);
        setEditingKey(null); // Clear editing key after saving
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
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
            title: 'Изменить',
            key: 'edit',
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
            key: 'delete',
            render: () => (
                <button
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
            <Table columns={columns} dataSource={data} rowKey='id' />
            {data.name}
        </div>
    );
};

export default Kategoriya;
