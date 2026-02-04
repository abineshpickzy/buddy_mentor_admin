import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useSelector } from "react-redux";

const AssignAdminModal = ({ open, onClose, onAssign }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  
  const { users } = useSelector((state) => state.users);
  const { activeRole } = useSelector((state) => state.roles);

  useEffect(() => {
    if (users && activeRole) {
      // Filter out users who already have this role
      const unassignedUsers = users.filter(user => 
        !activeRole.users.includes(user._id)
      );
      setAvailableUsers(unassignedUsers);
    }
  }, [users, activeRole]);

  if (!open) return null;

  const filteredUsers = availableUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email_id?.toLowerCase().includes(searchLower)
    );
  });

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    if (selectedUsers.length === 0) return;
    console.log("Selected user IDs to assign:", selectedUsers);
    onAssign(selectedUsers);
    setSelectedUsers([]);
    setSearchTerm("");
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchTerm("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[480px] rounded shadow-lg p-5 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Assign Admins to Role
          </h2>
          <X
            size={18}
            className="cursor-pointer text-gray-500"
            onClick={handleClose}
          />
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded px-3 py-2 pl-10 text-sm"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Body */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            Select admin(s) to assign to this role:
          </p>

          {filteredUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              {searchTerm ? "No users found matching search" : "No available users to assign"}
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto border rounded p-2">
              {filteredUsers.map((user) => (
                <label key={user._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserToggle(user._id)}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-xs text-gray-500">{user.email_id}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="border px-4 py-2 text-sm rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={selectedUsers.length === 0}
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Assign ({selectedUsers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignAdminModal;
