import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import CreateRoleModal from "@/components/admin/roles/CreateRoleModal";
import AssignAdminModal from "@/components/admin/roles/AssignAdminModal";
import UnassignConfirmModal from "@/components/admin/roles/UnassignConfirmModal";
import Admins from "@/components/admin/roles/tabs/Admins";
import Privileges from "@/components/admin/roles/tabs/Privileges";
import { useDispatch, useSelector } from "react-redux";
import { setActiveRole } from "@/features/roles/roleSlice";
import { createRole, unassignAdminsFromRole, assignAdminsToRole, updateRole, deleteRole } from "@/features/roles/roleThunk";
import { fetchRoles, defaultPrivilegesStructure } from "@/features/roles/roleThunk";
import { addToast } from "@/features/toast/toastSlice";
import { Can } from "@/permissions";
import { PERMISSIONS } from "@/permissions/permissions";


const Roles = () => {


  const dispatch = useDispatch();
  const { roles, activeRole, defaultPrvillages } = useSelector((state) => state.roles);

  const [SystemRoles, setSystemRoles] = useState([]);
  const [CustomRoles, setCustomRoles] = useState([]);

  const [activeTab, setActiveTab] = useState("admins");
  const [showCreate, setShowCreate] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showUnassign, setShowUnassign] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState([]);

  useEffect(() => {
    if (!roles.length) {
      dispatch(fetchRoles());
    }

    if (!defaultPrvillages.length) {
      dispatch(defaultPrivilegesStructure());
    }

  }, [dispatch]);


  useEffect(() => {
    const systemRoles = roles?.filter(role => role.is_default) || [];
    const customRoles = roles?.filter(role => !role.is_default) || [];
    setSystemRoles(systemRoles);
    setCustomRoles(customRoles);
  }, [roles]);

  const user = useSelector((state) => state.auth.user);

  console.log("Roles", roles)
  console.log("Active Role", activeRole)

  const createrole = async (roleData) => {
    if (editMode) {
      try {
        await dispatch(updateRole({ roleId: activeRole._id, roleData })).unwrap();
        dispatch(addToast({ type: "success", message: "Role updated successfully" }));
        setShowCreate(false);
        setEditMode(false);
      } catch (error) {
        dispatch(addToast({ type: "error", message: "Failed to update role" }));
      }
    } else {
      const roleWithCreator = { ...roleData, created_by: user._id };
      dispatch(createRole(roleWithCreator));
      dispatch(addToast({ type: "success", message: "Role created successfully" }));
      setShowCreate(false);
    }
  };

  const assignAdmin = async (selectedUserIds) => {
    console.log("Selected user IDs to assign:", selectedUserIds);
    try {
      await dispatch(assignAdminsToRole({ roleId: activeRole._id, users: selectedUserIds })).unwrap();
      setShowAssign(false);
    } catch (error) {
      console.error(error);
    }
  };

  const unassignAdmin = async () => {
    console.log("Selected admin IDs to unassign:", selectedAdmins);
    setShowUnassign(false);
    try {
      await dispatch(unassignAdminsFromRole({ roleId: activeRole._id, users: selectedAdmins })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRole = async () => {
    setShowDeleteConfirm(false);
    try {
      await dispatch(deleteRole(activeRole._id)).unwrap();
      dispatch(addToast({ type: "success", message: "Role deleted successfully" }));
      dispatch(setActiveRole(null));
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to delete role" }));
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

          <Can permission={PERMISSIONS.ROLES_CREATE}>
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
            {!activeRole?.is_default && (

              <div className="flex gap-3">
                <Can permission={PERMISSIONS.ROLES_EDIT}>
                  <Pencil
                    size={18}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      setEditMode(true);
                      setShowCreate(true);
                    }}
                  />
                </Can>
                <Can permission={PERMISSIONS.ROLES_DELETE}>
                  <Trash2
                    size={18}
                    className="text-red-500 cursor-pointer"
                    onClick={() => setShowDeleteConfirm(true)}
                  />
                </Can>
              </div>

            )}
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
                  className={`border border-gray-300 rounded px-3 py-1 text-sm  ${selectedAdmins.length === 0
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
            <Privileges />
          )}
        </div>
      </div>





      <CreateRoleModal
        open={showCreate}
        onClose={() => {
          setShowCreate(false);
          setEditMode(false);
        }}
        onCreate={createrole}
        editMode={editMode}
        initialData={editMode ? activeRole : null}
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

      <UnassignConfirmModal
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteRole}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${activeRole?.name}"?`}
      />
    </div>
  );
};

export default Roles;
