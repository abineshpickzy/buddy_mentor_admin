  import React, { useState } from "react";
  import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";

  const CategoryItem = ({ node, onAdd, onEdit, onDelete }) => {
    const [open, setOpen] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [addValue, setAddValue] = useState("");

    return (
      <div className="ml-4">
        {/* Row */}
        <div className="flex items-center justify-between py-[2px]">
          <div className="flex items-center gap-1">
            <button onClick={() => setOpen(!open)}>
              {node.children.length > 0 ? (
                open ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              ) : (
                <span className="inline-block w-[14px]" />
              )}
            </button>

            {!isEditing ? (
              <span className="text-sm text-gray-700">
                {node.name}
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  className="  border border-gray-300 px-3 py-1 text-sm
          focus:outline-none focus:ring-1 focus:ring-gray-500 w-[160px]"
                  value={editValue}
                  autoFocus
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => {
                    setIsEditing(false);
                    setEditValue("");
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && editValue.trim()) {
                      onEdit(node.id, editValue);
                      setIsEditing(false);
                      setEditValue("");
                    }
                    if (e.key === "Escape") {
                      setIsEditing(false);
                      setEditValue("");
                    }
                  }}
                />
                <Plus
                  size={14}
                  className="text-green-600 cursor-pointer"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    if (editValue.trim()) {
                      onEdit(node.id, editValue);
                      setIsEditing(false);
                      setEditValue("");
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Plus
              size={15}
              className="text-green-600 cursor-pointer"
              onClick={() => {
                setIsAdding(true);
                setAddValue("");
              }}
            />
            <Pencil
              size={15}
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setIsEditing(true);
                setEditValue(node.name);
              }}
            />
            <Trash2
              size={15}
              className="text-red-600 cursor-pointer"
              onClick={() => onDelete(node.id, node.name)}
            />
          </div>
        </div>

        {/* Add child */}
        {isAdding && (
          <div className="ml-6 my-1 flex items-center gap-1">
            <input
              className=" border border-gray-300 px-3 py-1 text-sm
          focus:outline-none focus:ring-1 focus:ring-gray-500 w-[200px]"
              placeholder="Sub modules or Chapters"
              value={addValue}
              autoFocus
              onChange={e => setAddValue(e.target.value)}
              onBlur={() => {
                setAddValue("");
                setIsAdding(false);
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && addValue.trim()) {
                  onAdd(node.id, addValue);
                  setAddValue("");
                  setIsAdding(false);
                }
                if (e.key === "Escape") {
                  setAddValue("");
                  setIsAdding(false);
                }
              }}
            />
            <Plus
              size={14}
              className="text-green-600 cursor-pointer"
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                if (addValue.trim()) {
                  onAdd(node.id, addValue);
                  setAddValue("");
                  setIsAdding(false);
                }
              }}
            />
          </div>
        )}

        {/* Children */}
        {open &&
          node.children.map(child => (
            <CategoryItem
              key={child.id}
              node={child}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
      </div>
    );
  };

  export default CategoryItem;
