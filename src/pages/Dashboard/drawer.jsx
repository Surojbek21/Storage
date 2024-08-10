import React from 'react';
import { Drawer as AntDrawer } from 'antd';

const Drawer = ({ open, onClose }) => {


    
    return (
        <AntDrawer open={open} onClose={onClose}>
            <div className='drawer '>
                <div className='p-3'>
                    <input
                        type='name'
                        placeholder='Name'
                        className='border-2 border-black mb-3 pl-1'
                    />
                    <input
                        type='name'
                        placeholder='Roli'
                        className='border-2 border-black mb-3 pl-1'
                    />
                    <input
                        type='name'
                        placeholder='Email'
                        className='border-2 border-black mb-3 pl-1'
                    />
                    <input
                        type='name'
                        placeholder='Phone'
                        className='border-2 border-black mb-3 pl-1'
                    />
                </div>
                <button className='rounded-md bg-[red] text-white py-2 px-2'>
                    O'chirish
                </button>
                <button className='ml-20 rounded-md bg-[green] text-white py-2 px-2'>
                    Qo'shish
                </button>
            </div>
        </AntDrawer>
    );
};

export default Drawer;
