import React from 'react';
import { useParams } from 'react-router-dom';
const Overview = () => {
     const {productId}=useParams();
    return (
        <div>
            <h1>Product Overview id : {productId}</h1>
        </div>
    );
};

export default Overview;