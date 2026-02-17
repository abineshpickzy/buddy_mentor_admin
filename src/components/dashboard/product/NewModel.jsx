import React, { useState } from "react";
import { X } from "lucide-react";
import Input from "@/components/ui/Input";

const NewModel = ({ open, onCancel, onSubmit }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    const data = { name, price: price || undefined };
    onSubmit(data);
    setName("");
    setPrice("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[480px] rounded shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-700">New</h2>
          <X
            size={18}
            className="cursor-pointer text-gray-500"
            onClick={onCancel}
          />
        </div>

        {/* Body */}
        <div className="mb-6 space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />

          <Input
            label="Price (Optional)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
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
            onClick={handleSubmit}
            disabled={!name}
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewModel;
