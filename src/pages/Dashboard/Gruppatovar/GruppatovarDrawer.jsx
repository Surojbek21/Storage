import React, { useState } from 'react';

const DrawerGruppatovar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button
                onClick={toggleDrawer}
                className='px-4 py-2 bg-blue-500 text-white rounded-md'>
                Open Drawer
            </button>

            <div
                className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform transition-transform z-10 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className='p-4'>
                    <div className='mt-4'>
                        <p>Drawer Content</p>
                        <input type='text' placeholder='Наименование' />
                    </div>
                    <div className=' flex gap-20'>
                        <button
                            onClick={toggleDrawer}
                            className='px-4 py-2 bg-red-500 text-white rounded-md'>
                            Close
                        </button>
                        <button
                            onClick={toggleDrawer}
                            className='px-4 py-2 bg-green-500 text-white rounded-md'>
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawerGruppatovar;
