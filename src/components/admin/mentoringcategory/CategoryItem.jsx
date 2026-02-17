import React, { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";

const CategoryItem = ({ node, path, editMode, onAdd, onEdit, onDelete }) => {
  const [open, setOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [addValue, setAddValue] = useState("");

  return (
    <div className="ml-4">
      {/* Row */}
      <div className="flex items-center justify-between py-[2px]">
        <div className="flex items-center gap-1">
          <button onClick={() => setOpen(!open)}>
            {node.children.length > 0 ? (
              open ? (
                <div className="flex items-center gap-1">
                   <svg width="20" height="20" viewBox="0 0 320 512" fill="#616264">
                <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.7c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
              </svg>
                </div>
              )
                :<svg width="20" height="20" viewBox="0 0 320 512" fill="#616264">
  <path d="M128 96l128 160-128 160c-12.6 12.6-34.1 3.7-34.1-14.1V110.1C93.9 92.3 115.4 83.4 128 96z"></path>
</svg>
            ) : (
              <span className="inline-block w-[14px]" />
            )}
          </button>

          {!isEditing ? (
            <span className="text-sm text-gray-700">{node.name}</span>
          ) : (
            <input
              className="border border-gray-300 px-2 py-1 text-sm w-[160px]
              focus:outline-none focus:ring-1 focus:ring-gray-500"
              value={editValue}
              autoFocus
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && editValue.trim()) {
                  onEdit(path, editValue);
                  setIsEditing(false);
                }
                if (e.key === "Escape") setIsEditing(false);
              }}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Plus
            size={15}
            strokeWidth={5}
            className="text-green-600 cursor-pointer"
            onClick={() => setIsAdding(true)}
          />

          <Pencil
            size={15}
              strokeWidth={3}
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              setIsEditing(true);
              setEditValue(node.name);
            }}
          />

          <Trash2
            size={15}
            strokeWidth={2.5}
            className="text-red-600 cursor-pointer"
            onClick={() => onDelete(path, node.name, node._id)}
          />
        </div>
      </div>

      {/* Add child */}
      {isAdding && (
        <div className="ml-6 my-1 flex items-center gap-1">
          <input
            className="border border-gray-300 px-2 py-1 text-sm w-[200px]
            focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="Sub category"
            value={addValue}
            autoFocus
            onChange={(e) => setAddValue(e.target.value)}
            onBlur={() => {
              setAddValue("");
              setIsAdding(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && addValue.trim()) {
                onAdd(path, addValue);
                setAddValue("");
                setIsAdding(false);
              }
              if (e.key === "Escape") setIsAdding(false);
            }}
          />

          <Plus
            size={14}
            strokeWidth={5}
            className="text-green-600 ml-2 cursor-pointer"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (addValue.trim()) {
                onAdd(path, addValue);
                setAddValue("");
                setIsAdding(false);
              }
            }}
          />
        </div>
      )}

      {/* Children */}
      {open &&
        node.children.map((child, index) => (
          <CategoryItem
            key={index}
            node={child}
            path={[...path, index]}
            editMode={editMode}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
};

export default CategoryItem;
