import type { createUser } from "../../services/user.service";
import { AUTH_SERVICE } from "../constant";

export const userApiService = {
  fetchUser: () => `${AUTH_SERVICE}/users`,
  createUser: `${AUTH_SERVICE}/users`,
};
