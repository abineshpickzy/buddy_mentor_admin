import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { Plus } from "lucide-react";
import ConfirmModal from "./ConfirmModel";

const CategoryTree = ({ value = [], onChange, editMode = false, onDeleteNode, nodeType }) => {
  const [rootName, setRootName] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, path: null, name: "", nodeId: null });

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
        name: rootName,
        children: []
      }
    ]);

    setRootName("");
  };

  const addChild = (tree, path, name) => {
    if (path.length === 0) return tree;
    const [index, ...rest] = path;
    return tree.map((node, i) =>
      i === index
        ? rest.length === 0
          ? {
              ...node,
              children: [...node.children, { name, children: [] }]
            }
          : {
              ...node,
              children: addChild(node.children, rest, name)
            }
        : node
    );
  };

  const editNode = (tree, path, name) => {
    if (path.length === 0) return tree;
    const [index, ...rest] = path;
    return tree.map((node, i) =>
      i === index
        ? rest.length === 0
          ? { ...node, name }
          : {
              ...node,
              children: editNode(node.children, rest, name)
            }
        : node
    );
  };

  const deleteNode = (tree, path) => {
    if (path.length === 0) return tree;
    const [index, ...rest] = path;
    if (rest.length === 0) {
      return tree.filter((_, i) => i !== index);
    }
    return tree.map((node, i) =>
      i === index
        ? {
            ...node,
            children: deleteNode(node.children, rest)
          }
        : node
    );
  };

  const handleDelete = (path, name, nodeId) => {
    setDeleteModal({ open: true, path, name, nodeId });
  };

  const confirmDelete = async () => {
    const { path, nodeId } = deleteModal;
    if (editMode && nodeId && onDeleteNode) {
      await onDeleteNode(nodeId, nodeType);
    }
    setCategories(deleteNode(categories, path));
    setDeleteModal({ open: false, path: null, name: "", nodeId: null });
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

        {categories.map((cat, index) => (
          <CategoryItem
            key={index}
            node={cat}
            path={[index]}
            editMode={editMode}
            onAdd={(path, name) =>
              setCategories(addChild(categories, path, name))
            }
            onEdit={(path, name) =>
              setCategories(editNode(categories, path, name))
            }
            onDelete={handleDelete}
          />
        ))}
      </div>

      <ConfirmModal
        name={deleteModal.name}
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, path: null, name: "", nodeId: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CategoryTree;
