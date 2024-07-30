import React from 'react';
import { Drawer as AntDrawer } from 'antd';

const Drawer = ({ open, onClose }) => {
    return (
        <AntDrawer visible={open} onClose={onClose}>
            <div className='drawer'>
                <div className='drawer-input'>
                    <input type='name' placeholder='Name' />
                    <input type='name' placeholder='Roli' />
                    <input type='name' placeholder='Email' />
                    <input type='name' placeholder='Phone' />
                </div>
                <button className='drawertwo-btn'>O'chirish</button>
                <button className='drawer-btn'>Qo'shish</button>
            </div>
        </AntDrawer>
    );
};

export default Drawer;
