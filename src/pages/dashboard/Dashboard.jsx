import Layout from '@/components/layout/Layout';
// import { dashboardSidebarItems } from '@/data/sidebarData';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Box ,LayoutDashboard,} from 'lucide-react';
import ProductLayout from '../../components/layout/productlayout/ProductLayout';
import Overview from './product/Overview';
import Basis from './product/Basis';
import Program from './product/Program';
import Settings from './product/Settings';
import { listProducts } from '@/features/products/productThunk';

const Dashboard = () => {
 
  const dispatch = useDispatch();
  const { productlist } = useSelector((state) => state.products);

  const dashboardSidebarItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      link: "/dashboard/overview",
    },
    ...productlist.map(product => ({
      label: product.name,
      icon: Box,
      link: `/dashboard/${product._id}`,
    }))
  ];

  useEffect(() => {
    if (productlist.length === 0) {
       dispatch(listProducts());
    }
  }, [dispatch]);

  return (
    <Layout sidebarItems={dashboardSidebarItems}>
      <Routes>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="/overview" element={<div>Dashboard Overview Page</div>} />
      
      <Route path="/:productId" element={<ProductLayout />}>
      <Route index element={<Navigate to="overview" replace />} />  
      <Route path="overview" element={<Overview />} />
      <Route path="basis" element={<Basis />} />
      <Route path="program" element={<Program/>} />
      <Route path="settings" element={<Settings/>} />
    </Route>
      </Routes>
    </Layout>
  );
};


export default Dashboard;