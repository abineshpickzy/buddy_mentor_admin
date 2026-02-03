import React, { useState } from "react";
import UserList from "@/components/admin/users/UserList";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";

/* ---------- DUMMY DATA ---------- */
const USERS = [
  {
    id: 1,
    profile: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
    firstName: "Ratheesh",
    lastName: "TR",
    email: "macratheesh@pickzy.com",
    adminId: "EC.PM.001",
    lastConnection: "10/10/2018",
    created: "10/10/2018",
    status: "Active"
  },
  {
    id: 2,
    
    profile: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
    firstName: "Ratheesh",
    lastName: "TR",
    email: "macratheesh@pickzy.com",
    adminId: "EC.PM.001",
    lastConnection: "10/10/2018",
    created: "10/10/2018",
    status: "Inactive"
  }
];
/* -------------------------------- */

const Users = () => {
  const [users, setUsers] = useState(USERS);

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
        <select className="border px-3 py-1 text-sm rounded">
          <option>Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <select className="border px-3 py-1 text-sm rounded">
          <option>Role</option>
          <option>Super Admin</option>
          <option>Program FP</option>
        </select>

        <div className="flex items-center border rounded px-2">
          <input
            placeholder="User"
            className="outline-none text-sm px-2 py-1"
          />
          <Search size={16} className="text-gray-400" />
        </div>
      </div>

      {/* User List */}
      <UserList users={users} />
    </div>
  );
};

export default Users;
