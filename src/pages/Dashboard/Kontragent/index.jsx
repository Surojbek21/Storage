import React from 'react';
import { Tabs } from 'antd';
import Customer from './kontr/kontr';
import Provider from './kontragent/kontragent';

function App() {
    return (
        <div>
            <Tabs
                className='pt-20'
                defaultActiveKey='1'
                type='card'
                items={[
                    {
                        label: "Customer",
                        key: "customer",
                        children: <Customer />
                    },
                    {
                        label: "Provider",
                        key: "provider",
                        children: <Provider />
                    }
                ]}
            />
        </div>
    );
}

export default App;
