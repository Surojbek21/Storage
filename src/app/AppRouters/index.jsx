import { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
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
        <Layout style={{ height: '100% auto' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className='h-screen '>
                <div className='demo-logo-vertical' />
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '15px',
                        padding: '15px',
                    }}>
                    <img
                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVEq3T-zCMkXMwhVBfF9UjrFlHrUjuOjE2Q&s'
                        alt='logo'
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%' }}
                    />

                    <span
                        style={{
                            color: 'white',
                            marginLeft: '20px',
                            fontWeight: 'bold',
                            fontSize: '20px',
                        }}>
                        Storage
                    </span>
                </div>
                <Menu
                    theme='dark'
                    mode='inline'
                    defaultSelectedKeys={['1']}
                    items={menu.map(({ id, name, path, children, img }) => {
                        if (children) {
                            return {
                                key: id,
                                label: (
                                    <Link to={path} className='flex gap-2'>
                                        {img}
                                        {name}
                                    </Link>
                                ),
                                children: children.map(
                                    ({ title, path, id, icon }) => ({
                                        key: id,
                                        icon: icon,
                                        label: <Link to={path}>{title}</Link>,
                                    })
                                ),
                            };
                        }
                        return {
                            key: id,
                            label: <Link to={path}>{name}</Link>,
                            path: path,
                        };
                    })}
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
