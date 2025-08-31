import type { createUser } from "../../services/user.service";
import { AUTH_SERVICE } from "../constant";

export const userApiService = {
  fetchUser: (perPage: string, currentPage: string) =>
    `${AUTH_SERVICE}/users?perPage=${perPage}&currentPage=${currentPage}`,
  createUser: `${AUTH_SERVICE}/users`,
};
