import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { Plus } from "lucide-react";

const CategoryTree = ({ value = [], onChange }) => {
  const [categories, setCategories] = useState(value);
  const [rootName, setRootName] = useState("");

  useEffect(() => {
    // Convert tree to flat path format like Bayfay
    const flatPaths = convertTreeToPaths(categories);
    onChange?.(flatPaths);
  }, [categories]);

  const convertTreeToPaths = (tree, parentPath = "") => {
    const paths = [];
    
    tree.forEach(node => {
      const currentPath = parentPath ? `${parentPath}/${node.name}` : `/${node.name}`;
      
      if (node.children && node.children.length > 0) {
        paths.push(...convertTreeToPaths(node.children, currentPath));
      } else {
        paths.push(currentPath);
      }
    });
    
    return paths;
  };

  const addRoot = () => {
    if (!rootName.trim()) return;
    setCategories(prev => [
      ...prev,
      { id: Date.now().toString(), name: rootName, children: [] }
    ]);
    setRootName("");
  };

  const addChild = (tree, id, name) =>
    tree.map(n =>
      n.id === id
        ? {
            ...n,
            children: [...n.children, { id: Date.now(), name, children: [] }]
          }
        : { ...n, children: addChild(n.children, id, name) }
    );

  const editNode = (tree, id, name) =>
    tree.map(n =>
      n.id === id
        ? { ...n, name }
        : { ...n, children: editNode(n.children, id, name) }
    );

  const deleteNode = (tree, id) =>
    tree
      .filter(n => n.id !== id)
      .map(n => ({
        ...n,
        children: deleteNode(n.children, id)
      }));

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      setCategories(prev => deleteNode(prev, id));
    }
  };

return (
  <div className="w-full max-w-[450px] lg:w-[450px]">
    {/* Add root */}
    <div className="flex items-center gap-2 mb-2">
      <input
        className="w-full bg-white border border-gray-300 px-3 py-2 text-sm 
        focus:outline-none focus:ring-1 focus:ring-gray-500"
        placeholder="Add category name"
        value={rootName}
        onChange={e => setRootName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && addRoot()}
      />
      <Plus
        size={18}
        className="text-green-600 cursor-pointer shrink-0"
        onClick={addRoot}
      />
    </div>

    {/* Tree box */}
    <div className="border border-gray-300 mr-6 bg-white p-2 mt-4">
      {categories.length === 0 && (
        <div className="text-xs text-gray-400 px-1">
          No categories added
        </div>
      )}

      {categories.map(cat => (
        <CategoryItem
          key={cat.id}
          node={cat}
          onAdd={(id, name) =>
            setCategories(prev => addChild(prev, id, name))
          }
          onEdit={(id, name) =>
            setCategories(prev => editNode(prev, id, name))
          }
          onDelete={handleDelete}
        />
      ))}
    </div>

    {/* Debug */}
    {/* {categories.length > 0 && (
      <div className="mt-3 p-2 bg-gray-100 rounded text-xs break-words">
        <strong>Generated paths:</strong>
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(convertTreeToPaths(categories), null, 2)}
        </pre>
      </div>
    )} */}
  </div>
);


};

export default CategoryTree;
