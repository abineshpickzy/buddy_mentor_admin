
import React , { useRef ,useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from "lucide-react";

/* ------------------ MENU ITEM ------------------ */

const MenuItem = ({ label, node, openPaths, setOpenPaths, path = '', isRoot = false }) => {
  const currentPath = path ? `${path}/${label}` : label;
  const children = Object.keys(node);
  const hasChildren = children.length > 0;
  const isOpen = openPaths.includes(currentPath);

  const handleClick = () => {
    if (hasChildren) {
      setOpenPaths(prev => {
        if (isOpen) {
          return prev.filter(p => !p.startsWith(currentPath));
        } else {
          const parentPath = path;
          const filtered = prev.filter(p => {
            const pParts = p.split('/');
            const cParts = currentPath.split('/');
            return pParts.length !== cParts.length || 
                   !p.startsWith(parentPath) ||
                   p === currentPath;
          });
          return [...filtered, currentPath];
        }
      });
    } else {
      // Handle end node click
      console.log('Selected item:', currentPath);
      let endpath=currentPath.split('/');
      console.log('End path parts:', endpath[endpath.length - 1]);
      // You can add your custom logic here, e.g.:
      // onItemSelect?.(currentPath);
      // navigate to specific page
      // show item details
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between px-4 py-2 mb-2 
        border-2 border-blue-100 rounded cursor-pointer transition-colors
        ${isOpen ? 'bg-blue-100 border-blue-300' : 'bg-white hover:bg-blue-50 hover:border-blue-300'}`}
        onClick={handleClick}
      >
        <span className="text-sm text-blue-700 font-medium">{label}</span>
        {hasChildren && (
          isOpen ? <ChevronDown size={20} className="text-blue-700 " /> : <ChevronRight size={20}  className="text-blue-700"/>
        )}
      </div>

      {isOpen && hasChildren && (
        <div
          className={`absolute left-full ml-3 w-[220px]
          border-2 border-blue-700 rounded bg-white shadow-lg p-2 z-50
          ${isRoot ? 'top-0' : '-top-2'}`}
        >
          {children.map(child => (
            <MenuItem
              key={child}
              label={child}
              node={node[child]}
              openPaths={openPaths}
              setOpenPaths={setOpenPaths}
              path={currentPath}
              isRoot={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

  export default MenuItem;