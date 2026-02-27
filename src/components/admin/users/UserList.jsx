import React, { useState, useMemo } from "react";
import UserRow from "./UserRow";
import { Can } from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

const UserList = ({ users }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null, // "asc" | "desc"
  });

  /* ================= SORT FUNCTION ================= */
  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return users;

    const sorted = [...users].sort((a, b) => {
      let aValue;
      let bValue;

      switch (sortConfig.key) {
        case "sno":
          const aIndex = users.indexOf(a);
          const bIndex = users.indexOf(b);
          return sortConfig.direction === "asc"
            ? aIndex - bIndex
            : bIndex - aIndex;

        case "first_name":
          aValue = a.first_name?.toLowerCase() || "";
          bValue = b.first_name?.toLowerCase() || "";
          break;

        case "last_name":
          aValue = a.last_name?.toLowerCase() || "";
          bValue = b.last_name?.toLowerCase() || "";
          break;

        case "email":
          aValue = (a.email_id || a.email || "").toLowerCase();
          bValue = (b.email_id || b.email || "").toLowerCase();
          break;

        case "last_connection":
          aValue = a.log?.recent ? new Date(a.log.recent).getTime() : 0;
          bValue = b.log?.recent ? new Date(b.log.recent).getTime() : 0;
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;

        case "created":
          aValue = a.created?.at ? new Date(a.created.at).getTime() : 0;
          bValue = b.created?.at ? new Date(b.created.at).getTime() : 0;
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;

        case "status":
          aValue = a.log?.is_active ? "active" : "inactive";
          bValue = b.log?.is_active ? "active" : "inactive";
          break;

        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [users, sortConfig]);

  /* ================= HANDLE SORT ================= */
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  /* ================= SORT ICON ================= */
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown size={14} className="inline ml-1 opacity-80" />;
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUp strokeWidth={2} size={14} className="inline ml-1" />
    ) : (
      <ChevronDown strokeWidth={2} size={14} className="inline ml-1" />
    );
  };

  return (
    <div className="bg-white overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#9e9e9e] text-sm text-left text-white">

            {/* S.no */}
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("sno")}
            >
              S.no {renderSortIcon("sno")}
            </th>

            <th className="p-2">Profile</th>
            <th className="p-2">Action</th>

            {/* First Name */}
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("first_name")}
            >
              First name {renderSortIcon("first_name")}
            </th>

            {/* Last Name */}
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("last_name")}
            >
              Last name {renderSortIcon("last_name")}
            </th>

            {/* Email */}
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Email {renderSortIcon("email")}
            </th>

            {/* <th className="p-2">Admin ID</th> */}
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("last_connection")}
            >
              Last Connection {renderSortIcon("last_connection")}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("created")}
            >
              Created {renderSortIcon("created")}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status {renderSortIcon("status")}
            </th>
            <th className="p-2">Lock</th>

            {/* <Can permission={PERMISSIONS.USERS_DELETE}>
              <th className="p-2">Delete</th>
            </Can> */}
          </tr>
        </thead>

        <tbody>
          {sortedUsers?.length === 0 ? (
            <tr>
              <td colSpan="12" className="p-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            sortedUsers?.map((user) => (
              <UserRow key={user._id} user={user} index={users.indexOf(user)} />
            ))
          )}
        </tbody>
      </table>
      <div className="w-full h-10 bg-[#424242] px-4 flex items-center ">
        <p className="text-white text-sm">Total Users: {users.length}</p>
      </div>
    </div>
  );
};

export default UserList;