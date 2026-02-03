import React, { useState } from "react";
import { X } from "lucide-react";

const UnassignConfirmModal = ({ open, onCancel, onConfirm, availableEmails = [] }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);

  if (!open) return null;

  const handleEmailToggle = (email) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleConfirm = () => {
    if (selectedEmails.length === 0) return;
    onConfirm(selectedEmails);
    setSelectedEmails([]);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[480px] rounded shadow-lg p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Unassign Admins
          </h2>
          <X
            size={18}
            className="cursor-pointer text-gray-500"
            onClick={onCancel}
          />
        </div>

        {/* Body */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">
            Select admin(s) to unassign from this role:
          </p>

          {availableEmails.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No admins assigned to this role
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto border rounded p-2">
              {availableEmails.map((admin) => (
                <label key={admin.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(admin.email)}
                    onChange={() => handleEmailToggle(admin.email)}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{admin.name}</div>
                    <div className="text-xs text-gray-500">{admin.email}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="border px-4 py-2 text-sm rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedEmails.length === 0}
            className="bg-red-600 text-white px-4 py-2 text-sm rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Unassign ({selectedEmails.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnassignConfirmModal;
