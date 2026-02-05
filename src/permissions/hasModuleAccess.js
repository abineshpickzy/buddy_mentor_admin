/**
 * Recursively checks if a module tree
 * contains ANY allowed action.
 */
const hasAnyAction = (node) => {
  if (!node) return false;

  // If it's an action array
  if (Array.isArray(node)) {
    return node.length > 0;
  }

  // Traverse deeper
  if (typeof node === "object") {
    return Object.values(node).some((child) =>
      hasAnyAction(child)
    );
  }

  return false;
};

/**
 * Supports paths like:
 * "admin"
 * "admin.users"
 * "admin.settings.card_charges"
 */
export const hasModuleAccess = (privileges, modulePath) => {
  if (!privileges || !modulePath) return false;

  const keys = modulePath.split(".");

  let current = privileges;

  // Traverse path
  for (const key of keys) {
    current = current?.[key];

    if (!current) return false;
  }

  return hasAnyAction(current);
};
