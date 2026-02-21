import React from "react";
import UserRow from "./UserRow";
import { useSelector } from "react-redux";
import {Can} from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";

const UserList = ({ users }) => {
  return (
    <div className="bg-white overflow-x-auto">
      <table className="w-full border-collapse">
        
        {/* Table Head */}
        <thead>
          <tr className="bg-[#9e9e9e] text-sm text-left text-white">
            <th className="p-2">S.no</th>
            <th className="p-2">Profile</th>
            <th className="p-2">Action</th>
            <th className="p-2">First name</th>
            <th className="p-2">Last name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Admin ID</th>
            <th className="p-2">Last Connection</th>
            <th className="p-2">Created</th>
            <th className="p-2">Status</th>
            <th className="p-2">Lock</th>
            <Can permission={PERMISSIONS.USERS_DELETE}><th className="p-2">Delete</th></Can>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {users?.length === 0 ? (
            <tr>
              <td colSpan="11" className="p-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            users?.map((user, index) => (
              <UserRow
                key={user._id}
                user={user}
                index={index}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
