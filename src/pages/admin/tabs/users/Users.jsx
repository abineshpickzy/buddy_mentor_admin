import React, { useEffect, useState } from "react";
import UserList from "@/components/admin/users/UserList";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "@/features/users/userThunk";
import { fetchRoleList } from "@/features/roles/roleThunk";
import {Can} from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";

const Users = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    text: ''
  });

  const { rolelist } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchRoleList());
   
  }, [dispatch]);

  useEffect(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value)
    );
    dispatch(fetchUsers(activeFilters));
  }, [filters, dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Users</h2>
        <Can permission={PERMISSIONS.USERS_CREATE}>
        <NavLink to="/admin/users/new" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
          + New User
        </NavLink>
        </Can>
      </div>

      {/* Filters */}
      <div className="bg-gray-100 p-4 flex flex-wrap flex-7 gap-8 items-center">
        <div className="flex-2 flex items-center" >
          <label className="text-sm text-gray-600 mr-2">Status</label>
           <select 
          className="border border-gray-300 bg-white px-3 py-1 text-sm w-full"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        </div>

         <div className="flex-2 flex items-center">
          <label className="text-sm text-gray-600 mr-2">Role</label>
          <select 
          className="border border-gray-300 bg-white px-3 py-1 text-sm w-full"
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
        >
          <option value="">All Roles</option>
          {rolelist.map((role) => (
            <option key={role._id} value={role._id}>{role.name}</option>
          ))}
        </select>
         </div>

         <div className="flex items-center gap-2 flex-3">
          <label className=" text-sm text-gray-600 mr-2">User</label>
          <div className="flex items-center border border-gray-300 bg-white px-3 py-1 text-sm w-full" >
          <input
            placeholder="Search users..."
            className="outline-none text-sm px-2 w-full"
            value={filters.text}
            onChange={(e) => handleFilterChange('text', e.target.value)}
          />
          <Search size={16} className="text-gray-400" />
        </div>
         </div>
      </div>

      {/* User List */}
      <UserList/>
    </div>
  );
};

export default Users;
