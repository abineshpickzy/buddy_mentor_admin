import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRoleList } from "@/features/roles/roleThunk";
import { useParams } from "react-router-dom";

//  sample data
const ROLES = [
  { id: "super_admin", label: "Super Admin" },
  { id: "program_fp", label: "Program FP" },
  { id: "planning_fp", label: "Planning FP" },
  { id: "accounting_fp", label: "Accounting FP" },
  { id: "mentor_fp", label: "Mentor FP" },
  { id: "tech_fp", label: "Tech FP" },
];

const RolesTab = ({  onSave }) => {
  const { userId } = useParams();
  
  const [selectedRoles, setSelectedRoles] = useState([]);
  
 const dispatch = useDispatch();
 const {rolelist,roles} = useSelector((state) => state.roles);
//  console.log("roles",roles , "rolelist",rolelist);
   
  // set initial roles from user

   useEffect(() => {
    if (roles && roles.length > 0) {
      const initialRoles = roles.filter(role => role.users.map(user => user._id).includes(userId)).map(role => role._id);
      console.log("Initial roles for user:", initialRoles);
      setSelectedRoles(initialRoles);
    }
  }, [roles]);

  useEffect(() => {
    dispatch(fetchRoleList());
  }, []);

  const toggleRole = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = () => {
    onSave(selectedRoles);
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
        className="mt-8 px-6 py-2 bg-gray-400 text-white rounded"
      >
        Save
      </button>
    </div>
  );
};

export default RolesTab;
