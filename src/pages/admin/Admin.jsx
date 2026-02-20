import Layout from '@/components/layout/Layout';
import { adminSidebarItems } from '@/data/sidebarData';
import { Routes, Route } from 'react-router-dom';
import MentoringCategory from './tabs/MentoringCategory';
import AddMentoringCategory from '@/components/admin/mentoringcategory/AddMentoringCategory';
import Roles from './tabs/Roles';
import Users from './tabs/users/Users';
import AddUserPage from './tabs/users/AddUserPage';
import EditUserPage from './tabs/users/EditUserPage';
import UserTab from '@/components/admin/users/editusers/tabs/UserTab';
import RolesTab from '@/components/admin/users/editusers/tabs/RolesTab';
import LocationsTab from '@/components/admin/users/editusers/tabs/LocationsTab';
import MentoringTab from '@/components/admin/users/editusers/tabs/MentoringTab';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import EditMentoringCategory from '../../components/admin/mentoringcategory/EditMentoringCategory';

let adminDataFetched = false;

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  

  
  // Fetch admin data on mount if not already loaded
  
  
  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/mentoring-product', { replace: true });
    }
  }, [location.pathname, navigate]);


  return (
    <Layout sidebarItems={adminSidebarItems}>
       <Routes>
          <Route path="mentoring-product" element={<MentoringCategory />} />
          <Route path="mentoring-product/add" element={<AddMentoringCategory />} />
          <Route path="mentoring-product/edit/:productId" element={<EditMentoringCategory />} />
          
          <Route path="roles-permissions" element={<Roles />} />

          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<AddUserPage />} />
          <Route path="users/edit/:userId" element={<EditUserPage />}>
            <Route path="user" element={<UserTab />} />
            <Route path="roles" element={<RolesTab />} />
            <Route path="locations" element={<LocationsTab />} />
            <Route path="mentoring" element={<MentoringTab />} />
          </Route>

          <Route path="settings" element={<div>Settings</div>} />
        </Routes>
    </Layout>
  );
};

export default AdminPage;
