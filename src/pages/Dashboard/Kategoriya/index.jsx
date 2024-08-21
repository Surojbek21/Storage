import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Drawer, Button, Input, Form } from 'antd';

const Kategoriya = () => {
    const [data, setData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        axios
            .get('http://localhost:3000/category')
            .then((res) => setData(res.data.categoriy))
            .catch((err) => console.log(err));
    }, []);

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const handlePost = async () => {
        const data12 = {
            name: 'name',
        };
        try {
            const res = await axios.post(
                'http://localhost:3000/category',
                data
            );
            onCreate(data.name.categoriy);
            console.log(res.data);
            alert('Yaratildi');
        } catch (err) {
            console.error('Xato bor', err);
            alert('Xato');
        }
    };

    return (
        <div>
            <Button
                type='primary'
                icon={<PlusOutlined />}
                className='mb-10 py-1 ml-[1050px] text-xl'
                onClick={showDrawer}></Button>

            <table className='w-full justify-between px-2 py-10'>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>наименование</th>
                        <th>Изменить</th>
                        <th>Удалить</th>
                    </tr>
                </thead>
                <tbody className='mt-6'>
                    <tr className='text-center' key={data}>
                        <td>{data.id}</td>
                        <td>{data.name}</td>
                        <td className='cursor-pointer w-10 rounded-md py-1.5 text-green-500'>
                            <EditFilled />
                        </td>
                        <td className='cursor-pointer text-red-500'>
                            <DeleteFilled />
                        </td>
                    </tr>
                </tbody>
            </table>

            <Drawer
                title='Yangi Kategoriya Qoʻshish'
                width={400}
                onClose={closeDrawer}
                visible={drawerVisible}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            onClick={closeDrawer}
                            style={{ marginRight: 8 }}>
                            Bekor qilish
                        </Button>
                        <Button onClick={handlePost} type='primary'>
                            Qo'shish
                        </Button>
                    </div>
                }>
                <Form form={form} layout='vertical' name='categoryForm'>
                    <Form.Item
                        name='name'
                        label='Kategoriya nomi'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos, kategoriya nomini kiriting!',
                            },
                        ]}>
                        <Input placeholder='Kategoriya nomini kiriting' />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Kategoriya;
