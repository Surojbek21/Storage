import { Table, Input } from 'antd';
import React, { useState } from 'react';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { data } from '../Kategoriya/Table';

const Gruppatovar = () => {
    const [editingKey, setEditingKey] = useState(null);

    const handleEdit = (key) => {
        setEditingKey(key);
    };

    const handleSave = (key) => {
        const newData = data.map((item) => {
            if (item.key === key) {
                return { ...item, наименование: editingKey.value };
            }
            return item;
        });
        setData(newData);
        setEditingKey();
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
                record.key === editingKey?.key ? (
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
            render: (text, record) =>
                record.key === editingKey?.key ? (
                    <button
                        onClick={() => handleSave(record.key)}
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
                        onClick={() => handleEdit(record.key)}
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
            render: (text) => (
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
            <Table columns={columns} dataSource={data} rowKey='key' />
            dslo
        </div>
    );
};

export default Gruppatovar;
