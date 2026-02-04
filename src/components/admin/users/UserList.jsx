import React from "react";
import UserRow from "./UserRow";
import { useSelector } from "react-redux";

const UserList = () => {
  const {users} = useSelector((state) => state.users);
  return (
    <div className="bg-white border rounded overflow-x-auto">
      <table className="w-full text-sm">
        
        {/* Table Head */}
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-2">S.no</th>
            <th className="p-2">Profile</th>
            <th className="p-2">Action</th>
            <th className="p-2 text-left">First name</th>
            <th className="p-2 text-left">Last name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Admin ID</th>
            <th className="p-2">Last Connection</th>
            <th className="p-2">Created</th>
            <th className="p-2">Status</th>
            <th className="p-2">Lock</th>
            <th className="p-2">Delete</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {users.map((user, index) => (
            <UserRow
              key={user._id}
              user={user}
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
