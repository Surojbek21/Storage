import React from 'react';
import { Drawer as AntDrawer } from 'antd';

const Drawer = ({ open, onClose }) => {
    return (
        <AntDrawer open={open} onClose={onClose}>
            <div className='drawer '>
                <div className=''>
                    <input type='name' placeholder='Name' />
                    <input type='name' placeholder='Roli' />
                    <input type='name' placeholder='Email' />
                    <input type='name' placeholder='Phone' />
                </div>
                <button className='rounded-md bg-slate-300 py-2 px-2'>O'chirish</button>
                <button className='ml-20 rounded-md bg-slate-300 py-2 px-2'>Qo'shish</button>
            </div>
        </AntDrawer>
    );
};

export default Drawer;
