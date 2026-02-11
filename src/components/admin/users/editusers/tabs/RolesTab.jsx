import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRoleList, fetchRoles } from "@/features/roles/roleThunk";
import { editUser } from "@/features/users/userThunk";
import { useParams, useOutletContext } from "react-router-dom";
import { addToast } from "@/features/toast/toastSlice";
import { showLoader, hideLoader } from "@/features/loader/loaderSlice";

//  sample data
const ROLES = [
  { id: "super_admin", label: "Super Admin" },
  { id: "program_fp", label: "Program FP" },
  { id: "planning_fp", label: "Planning FP" },
  { id: "accounting_fp", label: "Accounting FP" },
  { id: "mentor_fp", label: "Mentor FP" },
  { id: "tech_fp", label: "Tech FP" },
];

const RolesTab = () => {
  const { userId } = useParams();
  const { user } = useOutletContext();
  
  const [selectedRoles, setSelectedRoles] = useState([]);
  
 const { users } = useSelector((state) => state.users);
  
 const dispatch = useDispatch();
 const {rolelist,roles} = useSelector((state) => state.roles);
  
 useEffect(()=>{ 
     const filtered = rolelist.filter((r)=>user?.roles.includes(r._id));
     setSelectedRoles(filtered.map(r=>r._id))
 },[user,roles,rolelist])

   
  const toggleRole = (roleId) => {
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
      await dispatch(fetchRoles()).unwrap();
      dispatch(addToast({ type: "success", message: "User assigned roles successfully!" }));
     
    } catch (error) {
      console.error("Failed to update roles:", error);
      dispatch(addToast({ type: "error", message: "Failed to update roles" }));
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="p-6">
      {/* Roles list */}
      <div className="space-y-3">
        {rolelist.map((role) => (
          <label
            key={role._id}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedRoles.includes(role._id)}
              onChange={() => toggleRole(role._id)}
            />
            {role.name}
          </label>
        ))}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="mt-8 px-6 py-2 bg-blue-500 hover:bg-blue-600    text-white rounded"
      >
        Save
      </button>
    </div>
  );
};

export default RolesTab;
