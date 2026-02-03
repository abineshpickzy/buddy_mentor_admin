import Layout from '@/components/layout/Layout';
// import { dashboardSidebarItems } from '@/data/sidebarData';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  useEffect, useState } from 'react';
import { Box ,LayoutDashboard,} from 'lucide-react';
import ProductLayout from '../../components/layout/productlayout/ProductLayout';
import Overview from './product/Overview';
import Basis from './product/Basis';
import Program from './product/Program';
import Settings from './product/Settings';

const products=[
    {id:"1", name:"Product 1"},
    {id:"2", name:"Product 2"},
    {id:"3", name:"Product 3"},
];



const Dashboard = () => {
  const dashboardSidebarItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      link: "/dashboard/overview",
    },
    ...products.map(product => ({
      label: product.name,
      icon: Box,
      link: `/dashboard/${product.id}`,
    }))
  ];

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