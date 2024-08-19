// import { Table, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import axios from 'axios';
import { Table } from 'antd';
import { data12 } from './Table';

const Kategoriya = () => {
    const [data, setData] = useState([]);

   useEffect(() => {
       const fetchData = async () => {
           try {
               const req = await axios.get('http://localhost:3000/category');
               setData(req.data.category);
               alert(req.data.message);
           } catch (error) {
               console.error(error);
           }
       };

       fetchData();
   }, []);

    let editingKey;

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
            <Table columns={columns} dataSource={data12} rowKey='id' />
            {data12.map((item) => (
                <div key={item.id}>{item.name}</div>
            ))}
        </div>
    );
};

export default Kategoriya;
