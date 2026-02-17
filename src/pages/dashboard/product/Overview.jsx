import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';

const Overview = () => {
     const {productId}=useParams();
      const { product } = useOutletContext();
    return (
        <div>
            <h1 className=' text-lg font-normal'>Product Overview id : {product?.product._id}</h1>
            <p  className=' text-lg font-normal' >Product Name : {product?.product.name}</p>
        </div>
    );
};

export default Overview;