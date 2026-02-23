import Layout from '@/components/layout/Layout';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookText, LayoutDashboard, } from 'lucide-react';
import ProductLayout from '../../components/layout/productlayout/ProductLayout';
import DashboardOverview from './overview/Overview';
import Overview from './product/overview/Overview';

import Basis from './product/basics/Basis';
import BasisDetail from './product/basics/BasisDetail';
import ProgramDetails from './product/program/ProgramDetails';
import Program from './product/program/Program';
import Settings from './product/settings/Settings';
import CoreFoundationSettings from './product/settings/CoreFoundationSettings';
import ProgramSettings from './product/settings/ProgramSettings';
import { listProducts } from '@/features/products/productThunk';
import Review from '@/pages/dashboard/product/review/Review';


const Dashboard = () => {

  const dispatch = useDispatch();
  const { productlist } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const colors = [ 'text-green-600',  'text-pink-600', 'text-black', 'text-yellow-600','text-blue-600','text-purple-600','text-indigo-600'];

  const dashboardSidebarItems = [
    {
      label: "Dashboard",

      icon: LayoutDashboard,
      link: "/dashboard/overview",
      isdefault: true
    },
    ...productlist
      .filter(product => user?.product?.includes(product._id))
      .map((product, index) => ({
        label: product.name,
        icon: BookText,
        link: `/dashboard/${product._id}`,
        iconClass: colors[index % colors.length],
      }))
  ];

  const fetchProductlist = async () => {
    try {
      await dispatch(listProducts()).unwrap();
    } catch (error) {
      console.error("Error fetching product list:", error);
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
        <Route path="/overview" element={<DashboardOverview />} />

        <Route path="/:productId" element={<ProductLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="basis" element={<Basis />} />
          <Route path="basis/:nodeId" element={<BasisDetail />} />
          <Route path="program" element={<Program />} />
          <Route path="program/:nodeId" element={<ProgramDetails />} />
          <Route path="review" element={<Review/>} />
          <Route path="settings" element={<Settings />}>
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