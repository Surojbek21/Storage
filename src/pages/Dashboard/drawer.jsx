import { Drawer } from 'antd';
import { useState } from 'react';

const ProductDrawer = () => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div
                className='w-[60px] h-[44px] bg-green-700 rounded-[10px] mt-4px] ml-[90%] cursor-pointer'
                onClick={showDrawer}>
                <div className=''>
                    <button className=' ml-[22px] mt-1 text-2xl text-white'>
                        +
                    </button>
                </div>
            </div>
            <input
                placeholder='search'
                className='absloute rounded-[12px] -translate-y-7 text-white ml-2 px-12 mb-5 mt-[-100px] bg-gray-300 py-2 '
            />
            <Drawer
                style={{
                    background: '#343743',
                    color: 'white',
                    paddingTop: '10px',
                }}
                onClose={onClose}
                open={open}>
                <div className='mt-[6px]'>
                    <form className='grid mt-[6px]'>
                        <input
                            type='text'
                            placeholder='Name'
                            className='mt-2 w-full h-[36px] bg-[#272A30] pl-3 rounded-[20px] border-none outline-none'
                        />
                    </form>
                    <form className='grid mt-[36px]'>
                        <input
                            type='text'
                            placeholder='Roli'
                            className='mt-2 w-full h-[36px] bg-[#272A30] pl-3 rounded-[20px] border-none outline-none'
                        />
                    </form>
                    <form className='grid mt-[36px]'>
                        <input
                            type='text'
                            placeholder='Eamil'
                            className='mt-2 w-full h-[36px] bg-[#272A30] pl-3 rounded-[20px] border-none outline-none'
                        />
                    </form>
                    <form className='grid mt-[36px]'>
                        <input
                            type='text'
                            placeholder='Login'
                            className='mt-2 w-full h-[36px] bg-[#272A30] pl-3 rounded-[20px] border-none outline-none'
                        />
                    </form>
                    <form className='grid mt-[36px]'>
                        <input
                            type='text'
                            placeholder='Password'
                            className='mt-2 w-full h-[36px] bg-[#272A30] pl-3 rounded-[20px] border-none outline-none'
                        />
                    </form>
                    <form className='grid mt-[36px]'>
                        <input
                            type='text'
                            placeholder='Phone'
                            className='mt-2 w-full h-[36px] bg-[#272A30] pl-3 rounded-[20px] border-none outline-none'
                        />
                    </form>
                    <button className='ml-4 px-3.5 py-2.5 rounded-[10px] bg-red-800'>
                        O`chirish
                    </button>
                    <button className='ml-32 mt-10 px-3.5 py-2.5 rounded-[10px] bg-green-800'>
                        Qo`shish
                    </button>
                </div>
            </Drawer>
        </div>
    );
};

export default ProductDrawer;
