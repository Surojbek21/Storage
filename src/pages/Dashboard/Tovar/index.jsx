import React from 'react'
import useDrawer from '../../../hooks/useDrawer';
import ProductDrawer from '../Drawer';

const Tovar = () => {
    const {open, handleOpen, handleClose} = useDrawer();
  return (
      <div>
          <button
              className='flex justify-end items-end align-end rounded-md px-3 py-2 border-black bg-red-600 text-white'
              onClick={handleOpen}>
              +
          </button>
          <ProductDrawer open={open} onClosed={handleClose} />
      </div>
  );
}

export default Tovar
