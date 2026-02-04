import React, { useEffect, useState } from "react";
import UserList from "@/components/admin/users/UserList";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "@/features/users/userThunk";
import { fetchRoleList } from "@/features/roles/roleThunk";

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
        <NavLink to="/admin/users/new" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
          + New User
        </NavLink>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded p-4 mb-4 flex flex-wrap gap-4 items-center">
        <select 
          className="border px-3 py-1 text-sm rounded"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select 
          className="border px-3 py-1 text-sm rounded"
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
        >
          <option value="">All Roles</option>
          {rolelist.map((role) => (
            <option key={role._id} value={role._id}>{role.name}</option>
          ))}
        </select>

        <div className="flex items-center border rounded px-2">
          <input
            placeholder="Search users..."
            className="outline-none text-sm px-2 py-1"
            value={filters.text}
            onChange={(e) => handleFilterChange('text', e.target.value)}
          />
          <Search size={16} className="text-gray-400" />
        </div>
      </div>

      {/* User List */}
      <UserList/>
    </div>
  );
};

export default Users;
