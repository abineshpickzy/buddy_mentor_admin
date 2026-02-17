import React, { useState } from "react";
import { X } from "lucide-react";

const CancelConfirmModal = ({ name, open, onCancel, onConfirm }) => {
 
  if (!open) return null;


  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[480px] rounded shadow-lg p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Cancel "{name}"
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
           Are you sure you want to cancel this Upload ?
          </p>

         
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
            className="bg-red-600 text-white px-4 py-2 text-sm rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            ok 
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmModal;
