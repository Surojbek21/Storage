import { Button, Drawer, Form, Input, Select } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

const GruppatovarDrawer = ({
    open,
    handleClose,
    fetchData,
    editMode,
    record,
}) => {
    const [data, setData] = useState([]);
    const [select, setSelect] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const handleGet = async () => {
            try {
                const req = await axios.get(
                    'http://localhost:3000/category/all'
                );
                setData(req.data.categoriy);
                console.log(req.data);
            } catch (error) {
                console.error(error);
            }
        };
        handleGet();
    }, []);

    useEffect(() => {
        if (editMode && record) {
            form.setFieldsValue(record);
        } else {
            form.resetFields();
        }
    }, [editMode, record, form]);

    const handlePost = async (values) => {
        try {
            if (editMode && record?.id) {
                await axios.post(
                    `http://localhost:3000/group/update/${record.id}`,
                    values
                );
                alert('Kategoriya yangilandi');
            } else {
                await axios.post('http://localhost:3000/group/insert', values);
                alert('Kategoriya yaratildi');
            }
            handleClose();
            fetchData(); 
            console.log(values);
            
        } catch (err) {
            console.error('Xato bor', err);
            alert('Xato');
        }
    };

    const handleSelect = (e) => {
        setSelect(e.target.value)
    }

    return (
        <Drawer
            open={open}
            onClose={handleClose}
            width={400}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={handleClose} style={{ marginRight: 8 }}>
                        Bekor qilish
                    </Button>
                    <Button
                        type='primary'
                        htmlType='submit'
                        form='categoryForm'>
                        OK
                    </Button>
                </div>
            }>
            <Form
                form={form}
                layout='vertical'
                name='categoryForm'
                onFinish={handlePost}>
                <Form.Item
                    name='category_id'
                    label='Kategoriya nomi'
                    rules={[
                        {
                            required: true,
                            message: 'Iltimos, kategoriya nomini tanlang!',
                        },
                    ]}>
                    <Select placeholder='Kategoriya nomini tanlang' value={select} onChange={handleSelect}>
                        {data.map((item) => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default GruppatovarDrawer;
