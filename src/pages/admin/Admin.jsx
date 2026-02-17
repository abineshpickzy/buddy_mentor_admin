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
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '@/features/users/userThunk';
import { fetchRoles, defaultPrivilegesStructure,fetchRoleList } from '@/features/roles/roleThunk';

import { showLoader,hideLoader } from '@/features/loader/loaderSlice';
import EditMentoringCategory from '../../components/admin/mentoringcategory/EditMentoringCategory';

let adminDataFetched = false;

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const {users, initialFetchDone} = useSelector((state) => state.users);
  const {roles, rolelist, defaultPrvillages} = useSelector((state) => state.roles);

  
  // Fetch admin data on mount if not already loaded
  useEffect(() => {
 
    
    const fetchData = async () => {
      dispatch(showLoader());
      try {
        if (users.length === 0) await dispatch(fetchUsers());
        if (roles.length === 0) await dispatch(fetchRoles());
        if (rolelist.length === 0) await dispatch(fetchRoleList());
        if (defaultPrvillages.length === 0) await dispatch(defaultPrivilegesStructure());
      } finally {
        dispatch(hideLoader());
      }
    };
    
    fetchData();
  }, [dispatch]);
  
  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/mentoring-category', { replace: true });
    }
  }, [location.pathname, navigate]);


  return (
    <Layout sidebarItems={adminSidebarItems}>
       <Routes>
          <Route path="mentoring-category" element={<MentoringCategory />} />
          <Route path="mentoring-category/add" element={<AddMentoringCategory />} />
          <Route path="mentoring-category/edit/:productId" element={<EditMentoringCategory />} />
          
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
