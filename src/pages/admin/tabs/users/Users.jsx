import React, { useEffect, useState } from "react";
import UserList from "@/components/admin/users/UserList";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "@/features/users/userThunk";
import { fetchRoleList } from "@/features/roles/roleThunk";
import {Can} from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";
import { ChevronDown } from "lucide-react";

const Users = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    text: ''
  });

  const { rolelist } = useSelector((state) => state.roles);
  const allUsers = useSelector((state) => state.users.users);

  const filteredUsers = React.useMemo(() => {
    let result = allUsers;

    if (filters.status) {
      result = result.filter(u => u.log?.is_active === (filters.status === 'active'));
    }

    if (filters.role) {
      result = result.filter(u => u.roles?.includes(filters.role));
    }

    if (filters.text) {
      const searchLower = filters.text.toLowerCase();
      result = result.filter(u => 
        u.first_name?.toLowerCase().includes(searchLower) ||
        u.last_name?.toLowerCase().includes(searchLower) ||
        u.email_id?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [allUsers, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6">
      
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
        <div className="flex-2 flex items-center relative" >
          <label className="text-sm font-medium text-gray-600 mr-2">Status</label>
           <select 
          className=" appearance-none border border-gray-300 bg-white px-3 py-2  text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <ChevronDown  className="absolute right-2 pointer-events-none" size={16}  />
        </div>

         <div className="flex-2 flex items-center relative">
          <label className="text-sm font-medium text-gray-600 mr-2">Role</label>
          <select 
          className=" appearance-none border border-gray-300 bg-white px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500" 
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
        >
          <option value="">All Roles</option>
          {rolelist.map((role) => (
            <option key={role._id} value={role._id}>{role.name}</option>
          ))}
        </select>
            <ChevronDown  className="absolute right-2 pointer-events-none" size={16}  />
         </div>

         <div className="flex items-center gap-2 flex-3">
          <label className=" text-sm font-medium text-gray-600 mr-2">User</label>
          <div className="flex items-center border border-gray-300 bg-white px-3  text-base w-full hover:outline-none hover:ring-1 hover:ring-gray-500 " >
          <input
            placeholder="Search users..."
            className="outline-none  px-2 w-full h-full px-3 py-2 "
            value={filters.text}
            onChange={(e) => handleFilterChange('text', e.target.value)}
          />
          <Search size={16} className="text-gray-400" />
        </div>
         </div>
      </div>

      {/* User List */}
      <UserList users={filteredUsers}/>
    </div>
  );
};

export default Users;
