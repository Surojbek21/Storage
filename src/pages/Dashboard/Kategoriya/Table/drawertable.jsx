import { Drawer } from 'antd';
import React from 'react'

const DrawerTable = ({open, handleClose}) => {

  return (
    <div>
          <Drawer open={open} onClose={handleClose}>
              dckm  
      </Drawer>
    </div>
  )
}

export default DrawerTable;
