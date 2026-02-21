import Layout from '@/components/layout/Layout';
import { adminSidebarItems } from '@/data/sidebarData';
import { Routes, Route } from 'react-router-dom';
import MentoringCategory from './tabs/MentoringCategory';
import AddMentoringCategory from '@/components/admin/mentoringcategory/AddMentoringCategory';
import EditMentoringCategory from '../../components/admin/mentoringcategory/EditMentoringCategory';
import ViewMentoringCategory from '../../components/admin/mentoringcategory/ViewMentoringCategory';
import Roles from './tabs/Roles';
import Users from './tabs/users/Users';
import AddUserPage from './tabs/users/AddUserPage';
import EditUserPage from './tabs/users/EditUserPage';
import ViewUserPage from './tabs/users/ViewUserPage';
import UserTab from '@/components/admin/users/editusers/tabs/UserTab';
import RolesTab from '@/components/admin/users/editusers/tabs/RolesTab';
import LocationsTab from '@/components/admin/users/editusers/tabs/LocationsTab';
import MentoringTab from '@/components/admin/users/editusers/tabs/MentoringTab';
import ViewUserTab from '@/components/admin/users/viewusers/tabs/ViewUserTab';
import ViewRolesTab from '@/components/admin/users/viewusers/tabs/ViewRolesTab';
import ViewLocationsTab from '@/components/admin/users/viewusers/tabs/ViewLocationsTab';
import ViewMentoringTab from '@/components/admin/users/viewusers/tabs/ViewMentoringTab';
import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useModuleAccess from '@/permissions/useModuleAccess';

let adminDataFetched = false;

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkModule = useModuleAccess();

  const firstAvailableRoute = useMemo(() => {
    const availableItem = adminSidebarItems.find(item => 
      !item.module || checkModule(item.module)
    );
    return availableItem?.link || '/admin';
  }, [checkModule]);

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate(firstAvailableRoute, { replace: true });
    }
  }, [location.pathname, navigate, firstAvailableRoute]);


  return (
    <Layout sidebarItems={adminSidebarItems}>
       <Routes>
          <Route path="mentoring-product" element={<MentoringCategory />} />
          <Route path="mentoring-product/add" element={<AddMentoringCategory />} />
          <Route path="mentoring-product/edit/:productId" element={<EditMentoringCategory />} />
          <Route path="mentoring-product/view/:productId" element={<ViewMentoringCategory />} />
          
          <Route path="roles-permissions" element={<Roles />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<AddUserPage />} />
          <Route path="users/edit/:userId" element={<EditUserPage />}>
            <Route path="user" element={<UserTab />} />
            <Route path="roles" element={<RolesTab />} />
            <Route path="locations" element={<LocationsTab />} />
            <Route path="mentoring" element={<MentoringTab />} />
          </Route>
          <Route path="users/view/:userId" element={<ViewUserPage />}>
            <Route path="user" element={<ViewUserTab />} />
            <Route path="roles" element={<ViewRolesTab />} />
            <Route path="locations" element={<ViewLocationsTab />} />
            <Route path="mentoring" element={<ViewMentoringTab />} />
          </Route>

          <Route path="settings" element={<div>Settings</div>} />
        </Routes>
    </Layout>
  );
};

export default AdminPage;
