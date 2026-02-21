import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const CreateRoleModal = ({ open, onClose, onCreate, editMode = false, initialData = null }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (editMode && initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [editMode, initialData, open]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [description]);

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name, description });
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-[50%]  rounded shadow-lg p-5 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            {editMode ? "Edit role" : "Create new role"}
          </h2>
          <X
            size={18}
            className="cursor-pointer text-gray-500"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              className="w-full border  px-3 py-2 text-sm mt-1"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>


          <div>
            <label className="text-sm text-gray-600 ">Description</label>
            <textarea
              ref={textareaRef}
              className="w-full border px-3  py-2 text-sm  mt-1 resize-none overflow-hidden"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="border px-4 py-1 text-sm rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-1 text-sm rounded"
          >
            {editMode ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;
