import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  fetchRoles } from "@/features/roles/roleThunk";
import { editUser } from "@/features/users/userThunk";
import { useParams, useOutletContext } from "react-router-dom";
import { addToast } from "@/features/toast/toastSlice";
import { showLoader, hideLoader } from "@/features/loader/loaderSlice";


const RolesTab = () => {
  const { userId } = useParams();
  const { user, refetchUser } = useOutletContext();
  console.log(user)
  
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [originalRoles, setOriginalRoles] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  
 const dispatch = useDispatch();
 const {roles} = useSelector((state) => state.roles);
  
 useEffect(()=>{ 
     const filtered = roles.filter((r)=>user?.roles?.includes(r._id));
     const roleIds = filtered.map(r=>r._id);
     setSelectedRoles(roleIds);
     setOriginalRoles(roleIds);
 },[roles,user]);

 useEffect(() => {
    if(!roles.length)
     dispatch(fetchRoles());
  }, [dispatch]);

   
  useEffect(() => {
    const selectedSorted = [...selectedRoles].sort();
    const originalSorted = [...originalRoles].sort();
    setHasChanges(JSON.stringify(selectedSorted) !== JSON.stringify(originalSorted));
  }, [selectedRoles, originalRoles]);

  const toggleRole = (roleId) => {
    const role = roles.find(r => r._id === roleId);
    
    // If selecting a super admin role, uncheck all others
    if (role?.is_super_admin && !selectedRoles.includes(roleId)) {
      setSelectedRoles([roleId]);
      return;
    }
    
    // If unchecking a super admin role
    if (role?.is_super_admin && selectedRoles.includes(roleId)) {
      setSelectedRoles([]);
      return;
    }
    
    // Normal toggle for non-super admin roles
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    dispatch(showLoader());
    try {
      await dispatch(editUser({ userId: userId, userData: { roles: selectedRoles } })).unwrap();
      dispatch(addToast({ type: "success", message: "User assigned roles successfully!" }));
      await refetchUser();
      await dispatch(fetchRoles());
    } catch (error) {
      console.error("Failed to update roles:", error);
      dispatch(addToast({ type: "error", message: "Failed to update roles" }));
    } finally {
      dispatch(hideLoader());
    }
  };

  const hasSuperAdminSelected = selectedRoles.some(roleId => {
    const role = roles.find(r => r._id === roleId);
    return role?.is_super_admin;
  });

  return (
    <div className="p-6">
      {/* Roles list */}
      <div className="space-y-3">
        {roles.map((role) => (
          <label
            key={role._id}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedRoles.includes(role._id)}
              onChange={() => toggleRole(role._id)}
              disabled={hasSuperAdminSelected && !role.is_super_admin}
            />
            {role.name}
          </label>
        ))}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!hasChanges}
        className="mt-8 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Save
      </button>
    </div>
  );
};

export default RolesTab;
