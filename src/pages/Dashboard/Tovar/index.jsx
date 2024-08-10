import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tovar = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/product/all'
                );
                setData(response.data.product);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    console.log(data);

    return <></>;
};

export default Tovar;
