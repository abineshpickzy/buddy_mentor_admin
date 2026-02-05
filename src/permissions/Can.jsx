import { usePermission } from "./usePermission";

const Can = ({ permission, children, fallback = null }) => {
  const allowed = usePermission(permission);

  if (!allowed) return fallback;

  return children;
};

export default Can;
