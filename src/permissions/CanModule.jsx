import useModuleAccess from "./useModuleAccess";

const CanModule = ({ module, children, fallback = null }) => {
  const checkModule = useModuleAccess();
  const allowed = checkModule(module);

  if (!allowed) return fallback;

  return children;
};

export default CanModule;