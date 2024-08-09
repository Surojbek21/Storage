// src/components/Catalog.js
import React from 'react';

const products = [
    {
        id: 1,
        name: 'Mahsulot 1',
        price: '$10',
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 2,
        name: 'Mahsulot 2',
        price: '$20',
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 3,
        name: 'Mahsulot 3',
        price: '$30',
        image: 'https://via.placeholder.com/150',
    },
    // Qo'shimcha mahsulotlar
];

const Catalog = () => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
            {products.map((product) => (
                <div
                    key={product.id}
                    className='bg-white shadow-md rounded-lg overflow-hidden'>
                    <img
                        src={product.image}
                        alt={product.name}
                        className='w-full h-48 object-cover'
                    />
                    <div className='p-4'>
                        <h2 className='text-lg font-bold'>{product.name}</h2>
                        <p className='mt-2'>{product.price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Catalog;
