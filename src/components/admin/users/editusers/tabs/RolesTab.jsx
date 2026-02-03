import { useEffect, useState } from "react";


//  sample data
const ROLES = [
  { id: "super_admin", label: "Super Admin" },
  { id: "program_fp", label: "Program FP" },
  { id: "planning_fp", label: "Planning FP" },
  { id: "accounting_fp", label: "Accounting FP" },
  { id: "mentor_fp", label: "Mentor FP" },
  { id: "tech_fp", label: "Tech FP" },
];

const RolesTab = ({ userRoles = [], onSave }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);

  // set initial roles from user
  useEffect(() => {
    setSelectedRoles(userRoles);
  }, [userRoles]);

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
        {ROLES.map((role) => (
          <label
            key={role.id}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedRoles.includes(role.id)}
              onChange={() => toggleRole(role.id)}
            />
            {role.label}
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
