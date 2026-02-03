import Layout from '@/components/layout/Layout';
import { adminSidebarItems } from '@/data/sidebarData';
import { Routes, Route } from 'react-router-dom';
import MentoringCategory from './tabs/MentoringCategory';
import AddMentoringCategory from '@/components/admin/mentoringcategory/AddMentoringCategory';
import Roles from './tabs/Roles';
import Users from './tabs/users/Users';
import AddUserPage from './tabs/users/AddUserPage';
import EditUserPage from './tabs/users/EditUserPage';

const AdminPage = () => {
  return (
    <Layout sidebarItems={adminSidebarItems}>
       <Routes>
                    <Route path="mentoring-category" element={<MentoringCategory />} />
                    <Route path="mentoring-category/add" element={<AddMentoringCategory />} />

                    <Route path="roles-permissions" element={<Roles />} />

                    <Route path="users" element={<Users />} />
                    <Route path="users/new" element={<AddUserPage />} />
                    <Route path="users/:userId" element={<EditUserPage />} />    
                    
                    <Route path="settings" element={<div>Settings</div>} />

                </Routes>
    </Layout>
  );
};

export default AdminPage;
