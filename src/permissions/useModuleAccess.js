import { useSelector } from "react-redux";
import { useCallback } from "react";
import { hasModuleAccess } from "./hasModuleAccess";

const useModuleAccess = () => {
  const privileges = useSelector(
    (state) => state.auth.user?.privileges
  );

  const checkModule = useCallback(
    (modulePath) => {
      return hasModuleAccess(privileges, modulePath);
    },
    [privileges]
  );

  return checkModule;
};

export default useModuleAccess;
