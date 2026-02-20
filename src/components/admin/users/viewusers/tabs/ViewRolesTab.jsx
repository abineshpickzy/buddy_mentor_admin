import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRoles } from "@/features/roles/roleThunk";
import { useOutletContext } from "react-router-dom";

const ViewRolesTab = () => {
  const { user } = useOutletContext();
  const dispatch = useDispatch();
  const {roles} = useSelector((state) => state.roles);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    if(!roles.length)
      dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => { 
    const filtered = roles.filter((r) => user?.roles?.includes(r._id));
    const roleIds = filtered.map(r => r._id);
    setSelectedRoles(roleIds);
  }, [roles, user]);

  return (
    <div className="p-6">
      <div className="space-y-3">
        {roles.map((role) => (
          <label key={role._id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedRoles.includes(role._id)}
              disabled
            />
            {role.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ViewRolesTab;
