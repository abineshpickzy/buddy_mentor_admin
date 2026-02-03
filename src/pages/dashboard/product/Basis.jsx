import React, { useState, useEffect } from "react";
import MenuItem from "@/components/dashboard/product/basis/MenuItem";

/* ------------------ DATA ------------------ */

const paths = [
  "/EPC CORE FOUNDATION/module1/chapter1/section1",
  "/EPC CORE FOUNDATION/module2/chapter1",
  "/EPC CORE FOUNDATION/module2/chapter2",
  "/EPC CORE FOUNDATION/module3/chapter1",
  "/EPC CORE FOUNDATION/module3/chapter2/section1",
  "/EPC CORE FOUNDATION/module3/chapter3/section1",
  "/EPC CORE FOUNDATION/module4/chapter1",
  "/EPC CORE FOUNDATION/module4/chapter2",
  "/EPC CORE FOUNDATION/module5/chapter1/section1",
    "/EPC  FOUNDATION/module5/chapter1/section1",
      "/EPC /module5/chapter1/section1",
 
];

/* ------------------ HELPERS ------------------ */

const pathsToTree = (paths) => {
  const tree = {};
  
  paths.forEach(path => {
    const parts = path.split('/').filter(Boolean);
    let current = tree;
    
    parts.forEach(part => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });
  });
  
  return tree;
};

const treeToPaths = (tree, parentPath = '') => {
  const paths = [];
  
  const traverse = (node, currentPath) => {
    Object.keys(node).forEach(key => {
      const newPath = currentPath ? `${currentPath}/${key}` : `/${key}`;
      
      if (Object.keys(node[key]).length === 0) {
        // Leaf node - add to paths
        paths.push(newPath);
      } else {
        // Has children - continue traversing
        traverse(node[key], newPath);
      }
    });
  };
  
  traverse(tree, parentPath);
  return paths;
};





/* ------------------ MAIN ------------------ */

const Basis = () => {
  const [basisPaths, setBasisPaths] = useState(paths);
  const [loading, setLoading] = useState(false);
  const [openPaths, setOpenPaths] = useState([]);

  // Convert paths to tree structure
  const tree = pathsToTree(basisPaths);
  const rootKeys = Object.keys(tree);

  // TODO: Replace with actual API call
  useEffect(() => {
    // fetchBasisData();
  }, []);

  const fetchBasisData = async () => {
    setLoading(true);
    try {
      // const response = await api.getBasisPaths(productId);
      // setBasisPaths(response.data);
    } catch (error) {
      console.error('Failed to fetch basis data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading basis data...</div>;
  }

  if (!basisPaths.length) {
    return <div className="p-4 text-gray-500">No basis data available</div>;
  }

  return (
   <div className="w-full ">
     <div className="mb-4 flex justify-start items-center gap-6">
     <button
        type="button"
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-sm text-sm font-[500]"
      >
       ADD / UPLOAD
      </button>
     
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm text-sm font-[500]"
      >
    NEW
      </button>
     </div>

     <hr className="my-4 border-gray-300" />

     <div className="w-full max-w-xs">
   
      {rootKeys.map(rootKey => (
        <MenuItem
          key={rootKey}
          label={rootKey}
          node={tree[rootKey]}
          openPaths={openPaths}
          setOpenPaths={setOpenPaths}
          isRoot={true}
        />
      ))}
    </div>
   </div>
  );
};

export default Basis;
