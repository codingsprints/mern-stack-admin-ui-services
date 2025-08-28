import { ROLES } from "../constant/constant";
import type { User } from "../store";

export const usePermission = () => {
  const allowedRoles = [ROLES.ADMIN, ROLES.MANAGER];

  const _hasPermisson = (user: User | null) => {
    if (user) {
      return allowedRoles.includes(user.role);
    }
    return false;
  };

  return {
    isAllowed: _hasPermisson,
  };
};
