import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { menu } from '../../constants/menu';
import { Link, Route, Routes } from 'react-router-dom';
import { menuList } from '../../constants/routes';
const { Header, Sider, Content } = Layout;
const AppRouters = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{height: "100vh"}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className='demo-logo-vertical' />
                <Menu
                    theme='dark'
                    mode='inline'
                    defaultSelectedKeys={['1']}
                    items={menu.map(({ id, name, path}) => ({
                        key: id,
                        label: <Link to={path}>{name}</Link>,
                        path: path,
                      
                    }))}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}>
                    <Button
                        type='text'
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}>
                    <Routes>
                        {menuList.map((item) => (
                            <Route
                                key={item.id}
                                path={item.path}
                                element={item.element}
                            />
                        ))}
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};
export default AppRouters;
