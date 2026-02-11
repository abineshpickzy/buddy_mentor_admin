import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import CreateRoleModal from "@/components/admin/roles/CreateRoleModal";
import AssignAdminModal from "@/components/admin/roles/AssignAdminModal";
import UnassignConfirmModal from "@/components/admin/roles/UnassignConfirmModal";
import Admins from "@/components/admin/roles/tabs/Admins";
import Privileges from "@/components/admin/roles/tabs/Privileges";
import { useDispatch,useSelector } from "react-redux";
import { setActiveRole } from "@/features/roles/roleSlice";
import { createRole,unassignAdminsFromRole,assignAdminsToRole} from "@/features/roles/roleThunk";
import { addToast } from "@/features/toast/toastSlice";
import { showLoader, hideLoader } from "@/features/loader/loaderSlice";
import {Can} from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";

const Roles = () => {


  const dispatch = useDispatch();
  const {roles, activeRole} = useSelector((state) => state.roles);

  const [SystemRoles, setSystemRoles] = useState([]);
  const [CustomRoles, setCustomRoles] = useState([]);

  const [activeTab, setActiveTab] = useState("admins");
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showUnassign, setShowUnassign] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState([]);

  
useEffect(() => {
    const systemRoles = roles?.filter(role => role.is_default) || [];
    const customRoles = roles?.filter(role => !role.is_default) || [];
    setSystemRoles(systemRoles);
    setCustomRoles(customRoles);
  }, [roles]);

  const user=useSelector((state) => state.auth.user);



  const createrole = async (roleData) => {
    const roleWithCreator = { ...roleData, created_by: user._id };
    dispatch(createRole(roleWithCreator));
    dispatch(addToast({ type: "success", message: "Role created successfully" }));
    setShowCreate(false);
  };

  const assignAdmin = async (selectedUserIds) => {
    console.log("Selected user IDs to assign:", selectedUserIds);
    dispatch(showLoader());
    try {
      await dispatch(assignAdminsToRole({ roleId: activeRole._id, users: selectedUserIds })).unwrap();
      setShowAssign(false);
    } finally {
      dispatch(hideLoader());
    }
  };

  const unassignAdmin = async () => {
    console.log("Selected admin IDs to unassign:", selectedAdmins);
    setShowUnassign(false);
    dispatch(showLoader());
    try {
      await dispatch(unassignAdminsFromRole({ roleId: activeRole._id, users: selectedAdmins })).unwrap();
    } finally {
      dispatch(hideLoader());
    }
  };


  return (
    <div className=" p-6">
      <div className=" flex">

        {/* LEFT PANEL */}
        <div className="w-[260px] border-r-2 border-gray-300 pr-4">
          <h2 className="text-lg font-semibold text-primary mb-3">
            Roles & Permissions
          </h2>

          <Can  permission={PERMISSIONS.ROLES_CREATE}>
              <button className="w-full border border-gray-300 rounded px-3 py-1 text-sm mb-4" onClick={() => setShowCreate(true)}>
            + New role
          </button>
          </Can>

          <ul className="text-sm">

            {/* SYSTEM ROLES */}
                <li
                className={`px-3 py-2 cursor-pointer bg-gray-200 font-semibold text-gray-700
                    : "hover:bg-gray-100"
                  }`}
              >
                System Roles
               </li>
        
            {SystemRoles.map(role => (
              <li
                key={role._id}
                onClick={() => dispatch(setActiveRole(role))}
                className={`px-3 py-2 cursor-pointer ${activeRole?._id === role._id
                    ? "bg-blue-100 "
                    : "hover:bg-gray-100"
                  }`}
              >
                {role.name}
              </li>
            ))}

            {/* User ROLES */}
                <li
                className={`px-3 py-2 cursor-pointer bg-gray-200 font-semibold text-gray-700
                    : "hover:bg-gray-100"
                  }`}
              >
               User Created Roles
               </li>
       
            {CustomRoles.map(role => (
              <li
                key={role._id}
                onClick={() => dispatch(setActiveRole(role))}
                className={`px-3 py-2 cursor-pointer ${activeRole?._id === role._id
                    ? "bg-blue-100"
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
             <Can permission={PERMISSIONS.ROLES_EDIT}>
                <div className="flex gap-3">
              <Pencil size={18} className="text-blue-500 cursor-pointer" />
              <Trash2 size={18} className="text-red-500 cursor-pointer" />
            </div>
             </Can>
          </div>

          {/* TABS */}
           <div className=" mb-6">
         <div className="flex ">
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-8 py-1 bg-gray-200 text-primary border border-gray-300 border-b-white rounded-t-sm ${activeTab === "admins"
                  ? "bg-white"
                  : "border"
                }`}
            >
              Admin
            </button>

            <button
              onClick={() => setActiveTab("privileges")}
              className={`px-8 py-1 bg-gray-200 text-primary border border-gray-300 border-b-white rounded-t-sm ${activeTab === "privileges"
                  ? "bg-white"
                  : "border"
                }`}
            >
              Privileges
            </button>
          </div>
          </div>

        

          {/* ACTION BUTTONS */}
          {activeTab === "admins" && (
            <Can permission={PERMISSIONS.ROLES_EDIT}>
            <div className="flex gap-3 mb-4">
              <button className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50 cursor-pointer" onClick={() => setShowAssign(true)}>
                Assign Admins
              </button>
              <button 
                className={`border border-gray-300 rounded px-3 py-1 text-sm  ${
                  selectedAdmins.length === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-gray-50 cursor-pointer'
                }`}
                disabled={selectedAdmins.length === 0}
                onClick={() => setShowUnassign(true)}
              >
                UnAssign Admins
              </button>
            </div>
            </Can>
          )}

          {/* ADMINS TABLE */}
          {activeTab === "admins" && activeRole && (
            <Admins onSelectionChange={setSelectedAdmins} />
          )}

          {/* PRIVILEGES TAB */}
          {activeTab === "privileges" && (
            <Privileges/>
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
      />

      <UnassignConfirmModal
        open={showUnassign}
        onCancel={() => setShowUnassign(false)}
        onConfirm={unassignAdmin}
        
      />
    </div>
  );
};

export default Roles;
