export function hasPermission(auth, permissionPath) {

  if (!auth?.user?.privileges || !permissionPath) return false;



  const keys = permissionPath.split(".");
  let current = auth.user.privileges;

  for (let i = 0; i < keys.length - 1; i++) {
    current = current?.[keys[i]];
    if (!current) return false;
  }

  const action = keys[keys.length - 1];

  return Array.isArray(current) && current.includes(action);
}
