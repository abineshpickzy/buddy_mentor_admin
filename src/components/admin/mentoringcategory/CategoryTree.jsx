import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { Plus } from "lucide-react";

const CategoryTree = ({ value = [], onChange }) => {
  const [rootName, setRootName] = useState("");

  // Parent is the source of truth
  const categories = value;

  const setCategories = (newTree) => {
    onChange?.(newTree);
  };



  // ---------- TREE OPERATIONS ----------

  const addRoot = () => {
    if (!rootName.trim()) return;

    setCategories([
      ...categories,
      {
        id: crypto.randomUUID(),
        name: rootName,
        children: []
      }
    ]);

    setRootName("");
  };

  const addChild = (tree, id, name) =>
    tree.map((node) =>
      node.id === id
        ? {
            ...node,
            children: [
              ...node.children,
              { id: crypto.randomUUID(), name, children: [] }
            ]
          }
        : {
            ...node,
            children: addChild(node.children, id, name)
          }
    );

  const editNode = (tree, id, name) =>
    tree.map((node) =>
      node.id === id
        ? { ...node, name }
        : {
            ...node,
            children: editNode(node.children, id, name)
          }
    );

  const deleteNode = (tree, id) =>
    tree
      .filter((node) => node.id !== id)
      .map((node) => ({
        ...node,
        children: deleteNode(node.children, id)
      }));

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      setCategories(deleteNode(categories, id));
    }
  };

  return (
    <div className="w-full md:min-w-[400px] lg:min-w-[550px]">
      {/* Add root */}
      <div className="flex items-center gap-2 mb-2">
        <input
          className="w-full bg-white border border-gray-300 px-3 py-2 text-sm 
          focus:outline-none focus:ring-1 focus:ring-gray-500"
          placeholder="Add Program or Category name"
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addRoot()}
        />
        <Plus
          size={18}
           
            strokeWidth={5}
          className="text-green-500 cursor-pointer shrink-0"
          onClick={addRoot}
        />
      </div>

      {/* Tree */}
      <div className="border border-gray-300 mr-6 bg-white py-4 pr-4 mt-4 overflow-x-auto">
        {categories.length === 0 && (
          <div className="text-sm text-gray-400 px-1 text-center">
            No Programs added
      </div>
        )}

        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            node={cat}
            onAdd={(id, name) =>
              setCategories(addChild(categories, id, name))
            }
            onEdit={(id, name) =>
              setCategories(editNode(categories, id, name))
            }
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryTree;
