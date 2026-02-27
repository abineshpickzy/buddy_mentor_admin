import React, { useState, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Recursive sort
 */
const sortTree = (nodes = []) => {
  return nodes
    .slice()
    .sort((a, b) => a.order_no - b.order_no)
    .map((node) => ({
      ...node,
      children: sortTree(node.children || []),
    }));
};

const CLOSE_DELAY = 1000;

const TreeMenu = ({
  nodes = [],
  level = 0,
  type = "basis",
  hoveredPath,
  setHoveredPath,
}) => {
  const isRoot = level === 0;

  const [internalHoveredPath, setInternalHoveredPath] = useState([]);
  const closeTimer = useRef(null);

  const navigate = useNavigate();
  const { productId } = useParams();

  if (!nodes.length) return null;

  // Root controls shared hover state
  const activePath = hoveredPath ?? internalHoveredPath;
  const updatePath = setHoveredPath ?? setInternalHoveredPath;

  const sortedNodes = isRoot ? sortTree(nodes) : nodes;

  const handleMouseEnter = (nodeId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);

    updatePath((prev) => {
      const newPath = prev.slice(0, level);
      newPath[level] = nodeId;
      return newPath;
    });
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      updatePath((prev) => prev.slice(0, level));
    }, CLOSE_DELAY);
  };

  return (
    <ul
      className={`
        ${
          isRoot
            ? "inline-block rounded-sm"
            : "absolute top-0 left-[calc(100%+12px)] bg-white border-2 border-blue-500 shadow-sm -mt-[1px]"
        }
        min-w-[250px]
        whitespace-nowrap
        z-20
      `}
    >
      {sortedNodes.map((node) => {
        const isHighlighted = activePath[level] === node._id;

        return (
          <li
            key={node._id}
            className={`
              relative
              ${
                level === 0
                  ? "my-4 border-2 border-blue-500 bg-white"
                  : "border-b border-blue-100 last:border-none"
              }
            `}
            onMouseEnter={() => handleMouseEnter(node._id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Clickable Row */}
            <div
              onClick={() =>
                navigate(`/dashboard/${productId}/${type}/${node._id}`)
              }
              className={`
                flex items-center justify-between
                px-4 py-2
                text-[14px]
                font-medium
                cursor-pointer
                transition-all duration-200
                ${
                  isHighlighted
                    ? "bg-blue-50 text-blue-800"
                    : "text-blue-700 hover:bg-blue-50"
                }
              `}
            >
              <span>{node.name}</span>

              {node.children?.length > 0 && (
                <ChevronRight size={16} className="text-blue-400 ml-3" />
              )}
            </div>

            {/* Submenu */}
            {node.children?.length > 0 &&
              activePath[level] === node._id && (
                <>
                  {/* Invisible bridge */}
                  <div className="absolute top-0 left-full w-[12px] h-full" />

                  <TreeMenu
                    nodes={node.children}
                    level={level + 1}
                    type={type}
                    hoveredPath={activePath}
                    setHoveredPath={updatePath}
                  />
                </>
              )}
          </li>
        );
      })}
    </ul>
  );
};

export default TreeMenu;
