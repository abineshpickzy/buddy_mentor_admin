import Layout from '@/components/layout/Layout';
// import { dashboardSidebarItems } from '@/data/sidebarData';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Box ,LayoutDashboard,} from 'lucide-react';
import ProductLayout from '../../components/layout/productlayout/ProductLayout';
import Overview from './product/Overview';
import Basis from './product/basics/Basis';
import BasisDetail from './product/basics/BasisDetail';
import ProgramDetails from './product/program/ProgramDetails';
import Program from './product/program/Program';
import Settings from './product/settings/Settings';
import CoreFoundationSettings from './product/settings/CoreFoundationSettings';
import ProgramSettings from './product/settings/ProgramSettings';
import { listProducts } from '@/features/products/productThunk';
import {showLoader,hideLoader} from "@/features/loader/loaderSlice";

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

  const fetchProductlist = async () => {
    try {
      dispatch(showLoader());
      await dispatch(listProducts()).unwrap();
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
    finally{
      dispatch(hideLoader());
    }
    
  };

  useEffect(() => {
    if (productlist.length === 0) {
       fetchProductlist();
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
      <Route path="basis/:nodeId" element={<BasisDetail />} />
      <Route path="program" element={<Program/>} />
      <Route path="program/:nodeId" element={<ProgramDetails/>} />
      <Route path="settings" element={<Settings/>}>
        <Route index element={<Navigate to="core-foundation" replace />} />
        <Route path="core-foundation" element={<CoreFoundationSettings />} />
        <Route path="program" element={<ProgramSettings />} />
      </Route>
    </Route>
      </Routes>
    </Layout>
  );
};


export default Dashboard;