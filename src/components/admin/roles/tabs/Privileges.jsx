import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { updateRole } from "@/features/roles/roleThunk";

/* ------------------ DATA (UNCHANGED) ------------------ */


/* ------------------ HELPERS ------------------ */

const isObject = (val) =>
  typeof val === "object" && !Array.isArray(val);

/* Collect ONLY leaf permissions */
const collectLeafPaths = (node, basePath = "") => {
  let paths = [];

  Object.entries(node).forEach(([key, value]) => {
    const current = basePath ? `${basePath}.${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((action) =>
        paths.push(`${current}.${action}`)
      );
    } else if (isObject(value)) {
      paths = paths.concat(collectLeafPaths(value, current));
    }
  });

  return paths;
};

/* Collect expandable paths (for default expanded) */
const collectExpandablePaths = (node, basePath = "") => {
  let paths = [];

  Object.entries(node).forEach(([key, value]) => {
    const current = basePath ? `${basePath}.${key}` : key;
    paths.push(current);

    if (isObject(value)) {
      paths = paths.concat(collectExpandablePaths(value, current));
    }
  });

  return paths;
};


/* Collect checked leaf paths from saved activeRolePrivilege */
const collectCheckedFromUserPrivilege = (node, basePath = "") => {
  let paths = [];

  Object.entries(node).forEach(([key, value]) => {
    const current = basePath ? `${basePath}.${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((action) => {
        paths.push(`${current}.${action}`);
      });
    } else if (isObject(value)) {
      paths = paths.concat(
        collectCheckedFromUserPrivilege(value, current)
      );
    }
  });

  return paths;
};
 

/* ------------------ COMPONENT ------------------ */

const Privileges = () => {

  const [activeRolePrivilege, setActiveRolePrivilege] = useState({});
  const defaultPrivileges = useSelector((state) => state.roles.defaultPrvillages);
  const user=useSelector((state) => state.auth.user);

  const { activeRole } = useSelector((state) => state.roles);
  const isEditable = activeRole?.is_editable !== false;

  const dispatch = useDispatch();


  const [checked, setChecked] = useState(new Set());
  const [expanded, setExpanded] = useState(
    new Set(collectExpandablePaths(defaultPrivileges))
  );

  useEffect(() => {
    console.log("Active Role Privileges:", activeRole);
    setActiveRolePrivilege(activeRole?.privileges || {});
  }, [activeRole]);

  useEffect(() => {
    const checkedPaths = collectCheckedFromUserPrivilege(activeRolePrivilege);
    setChecked(new Set(checkedPaths));
  }, [activeRolePrivilege]);

  /* ---------- Expand / Collapse ---------- */

  const toggleExpand = (path) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  /* ---------- Checkbox Logic ---------- */

  const toggleLeaf = (path) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const toggleGroup = (leafPaths) => {
    setChecked((prev) => {
      const next = new Set(prev);
      const allChecked = leafPaths.every((p) => next.has(p));

      leafPaths.forEach((p) =>
        allChecked ? next.delete(p) : next.add(p)
      );

      return next;
    });
  };

  /* ------------------ RENDER TREE ------------------ */

  const renderTree = (node, parentPath = "", level = 0) => {
    const isFlexRow = level === 1;

    return (
      <div
        className={
          isFlexRow
            ? "flex flex-wrap gap-x-12 gap-y-2 mt-2"
            : "space-y-4"
        }
      >
        {Object.entries(node).map(([key, value]) => {
          const currentPath = parentPath
            ? `${parentPath}.${key}`
            : key;

          const leafPaths =
            isObject(value) || Array.isArray(value)
              ? collectLeafPaths({ [key]: value }, parentPath)
              : [];

          const checkedCount = leafPaths.filter((p) =>
            checked.has(p)
          ).length;

          const allChecked =
            leafPaths.length > 0 &&
            checkedCount === leafPaths.length;

          const isIndeterminate =
            checkedCount > 0 &&
            checkedCount < leafPaths.length;

          const isExpanded = expanded.has(currentPath);

          return (
            <div
              key={currentPath}
              className={isFlexRow ? "" : "ml-3"}
            >
              {/* HEADER */}
              <div className="flex items-center gap-2 mb-1">
                {(isObject(value) || Array.isArray(value)) && (
                  <button
                    onClick={() => toggleExpand(currentPath)}
                    className="text-gray-600 hover:text-black"
                  >
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                )}

                {(isObject(value) || Array.isArray(value)) ? (
                  <input
                    type="checkbox"
                    disabled={!isEditable}
                    ref={(el) => {
                      if (!el) return;
                      el.checked = allChecked;
                      el.indeterminate = isIndeterminate;
                    }}
                    onChange={() => toggleGroup(leafPaths)}
                    className="accent-black"
                  />
                ) : null}

                <span className="font-medium text-gray-800 capitalize">
                  {key.replace(/_/g, " ")}
                </span>
              </div>

              {/* ACTIONS */}
              {Array.isArray(value) && isExpanded && (
                <div className="ml-10 space-y-1">
                  {value.map((action) => {
                    const actionPath = `${currentPath}.${action}`;
                    return (
                      <label
                        key={actionPath}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <input
                          type="checkbox"
                          disabled={!isEditable}
                          checked={checked.has(actionPath)}
                          onChange={() => toggleLeaf(actionPath)}
                          className="accent-black"
                        />
                        {action.replace(/_/g, " ")}
                      </label>
                    );
                  })}
                </div>
              )}

              {/* NESTED OBJECT */}
              {isObject(value) && isExpanded && (
                <div className="ml-4">
                  {renderTree(value, currentPath, level + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };



/* ------------------ SAVE (FULL STRUCTURED JSON LIKE defaultPrivileges) ------------------ */

const savePrivileges = () => {
  const buildResult = (node, parentPath = "") => {
    if (Array.isArray(node)) {
      // Include only checked actions, empty array if none
      return node.filter((action) => checked.has(`${parentPath}.${action}`));
    } else if (isObject(node)) {
      const obj = {};
      Object.entries(node).forEach(([key, value]) => {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;
        const result = buildResult(value, currentPath);

        // Always include key
        obj[key] = Array.isArray(value) ? result : result;
      });
      return obj;
    }
    return node;
  };

  const result = buildResult(defaultPrivileges);
  
  console.log("Saved Privileges:", result);
  // Dispatch updateRole with new privileges
  dispatch(updateRole({roleId:activeRole._id,roleData:{
    name:activeRole.name,
    description:activeRole.description,
    modified_by:user?._id,
    privileges:result}}));
  alert(`Privileges saved! Data: ${JSON.stringify(result, null, 2)}`);
};


  /* ------------------ UI ------------------ */

  return (
    <div className="max-w-6xl p-6 bg-white rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        Admin Console Privileges
        <span className="text-gray-400 cursor-pointer">?</span>
      </h3>

      {renderTree(defaultPrivileges)}

      {isEditable && (
        <div className="mt-6">
          <button
            onClick={savePrivileges}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Save Privileges
          </button>
        </div>
      )}
    </div>
  );
};

export default Privileges;
