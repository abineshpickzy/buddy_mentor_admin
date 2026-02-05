import { useSelector } from "react-redux";
import { hasPermission } from "./hasPermission";

export function usePermission(permission) {
  const auth = useSelector((state) => state.auth);

  return hasPermission(auth, permission);
}

export default usePermission;
