import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import CreateRoleModal from "@/components/admin/roles/CreateRoleModal";
import AssignAdminModal from "@/components/admin/roles/AssignAdminModal";
import UnassignConfirmModal from "@/components/admin/roles/UnassignConfirmModal";

/* ------------------ DUMMY ROLES DATA ------------------ */
const ROLES = [
  {
    id: "super_admin",
    name: "Super Admin",
    admins: [
      { id: 1, name: "Ratheesh", email: "ratheesh@pickzy.com" }
    ]
  },
  {
    id: "program_fp",
    name: "Program FP",
    admins: [
      { id: 2, name: "Test1", email: "test@pickzy.com" }
    ]
  },
  {
    id: "planning_fp",
    name: "Planning FP",
    admins: []
  },
  {
    id: "support_team",
    name: "Support Team",
    admins: [
      { id: 3, name: "Support User", email: "support@pickzy.com" }
    ]
  }
];
/* ----------------------------------------------------- */

const Roles = () => {
  const [roles] = useState(ROLES);
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [activeTab, setActiveTab] = useState("admins");
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showUnassign, setShowUnassign] = useState(false);


  const createrole = (roleData) => {
    console.log("Creating new role:", roleData);
    setShowCreate(false);
    // API call to create role
  };

  const assignAdmin = (admins) => {
    console.log("Assigning admins: ", admins, "to role", activeRole.name);
    setShowAssign(false);
    // API call to assign admins to role
  };

  const unassignAdmin = (emails) => {
    console.log("Unassigning admin from:", emails);
    setShowUnassign(false);
    // API call to unassign admin from role
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded shadow-sm p-4 flex">

        {/* LEFT PANEL */}
        <div className="w-[260px] border-r pr-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">
            Roles & Permissions
          </h2>

          <button className="w-full border border-gray-300 rounded px-3 py-1 text-sm mb-4" onClick={() => setShowCreate(true)}>
            + New role
          </button>

          <ul className="text-sm">
            {roles.map(role => (
              <li
                key={role.id}
                onClick={() => setActiveRole(role)}
                className={`px-3 py-2 cursor-pointer ${activeRole.id === role.id
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-100"
                  }`}
              >
                {role.name}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 pl-6">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Manage User
            </h2>
            <div className="flex gap-3">
              <Pencil size={18} className="text-blue-500 cursor-pointer" />
              <Trash2 size={18} className="text-red-500 cursor-pointer" />
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-4 py-1 text-sm rounded ${activeTab === "admins"
                  ? "bg-gray-200 font-medium"
                  : "border"
                }`}
            >
              Admin
            </button>

            <button
              onClick={() => setActiveTab("privileges")}
              className={`px-4 py-1 text-sm rounded ${activeTab === "privileges"
                  ? "bg-gray-200 font-medium"
                  : "border"
                }`}
            >
              Privileges
            </button>
          </div>

          {/* ACTION BUTTONS */}
          {activeTab === "admins" && (
            <div className="flex gap-3 mb-4">
              <button className="border rounded px-3 py-1 text-sm" onClick={() => setShowAssign(true)}>
                Assign Admins
              </button>
              <button className="border rounded px-3 py-1 text-sm" onClick={() => setShowUnassign(true)}>
                UnAssign Admins
              </button>
            </div>
          )}

          {/* ADMINS TABLE */}
          {activeTab === "admins" && (
            <div className="border rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 w-10">
                      <input type="checkbox" />
                    </th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email id</th>
                  </tr>
                </thead>

                <tbody>
                  {activeRole.admins.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="p-4 text-center text-gray-400"
                      >
                        No admins assigned
                      </td>
                    </tr>
                  ) : (
                    activeRole.admins.map(admin => (
                      <tr key={admin.id} className="border-t">
                        <td className="p-2 text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="p-2">{admin.name}</td>
                        <td className="p-2">{admin.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PRIVILEGES TAB */}
          {activeTab === "privileges" && (
            <div className="border rounded p-4 text-sm text-gray-500">
              Privileges UI will be shown here (dummy content)
            </div>
          )}
        </div>
      </div>



      <CreateRoleModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createrole}
      />

      <AssignAdminModal
        open={showAssign}
        onClose={() => setShowAssign(false)}
        onAssign={assignAdmin}
        availableEmails={ROLES.flatMap(role => role.admins)}
      />

      <UnassignConfirmModal
        open={showUnassign}
        onCancel={() => setShowUnassign(false)}
        onConfirm={unassignAdmin}
        availableEmails={activeRole.admins}
      />
    </div>
  );
};

export default Roles;
