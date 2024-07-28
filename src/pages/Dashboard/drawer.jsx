import React from 'react';
import { Drawer as AntDrawer } from 'antd';

const Drawer = ({ open, onClose }) => {
    return (
        <AntDrawer visible={open} onClose={onClose}>
            salom
        </AntDrawer>
    );
};

export default Drawer;
