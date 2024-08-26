import { Table } from 'antd';
import { columns, Kontrtable } from './table';

const Kontragent = () => {

    
    return (
        <div>
            <button className='bg-green-500 text-white px-4 py-1 rounded-[10px] mb-6 ml-[90%] text-3xl'>+</button>
            <Table columns={columns} dataSource={Kontrtable} />
        </div>
    );

};

export default Kontragent;
