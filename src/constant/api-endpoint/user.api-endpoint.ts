import type { userQueryParams } from "../../utils/types";
import { AUTH_SERVICE } from "../constant";

export const userApiService = {
  fetchUser: (queryParams: userQueryParams) =>
    `${AUTH_SERVICE}/users?perPage=${queryParams?.perPage || 6}&currentPage=${
      queryParams?.currentPage || 1
    }&q=${queryParams?.q || ""}&role=${queryParams?.role || ""}`,
  createUser: `${AUTH_SERVICE}/users`,
  singleFetchUser: (id: string) => `${AUTH_SERVICE}/users/${id}`,
  updateUser: (id: string) => `${AUTH_SERVICE}/users/${id}`,
  deleteUser: (id: string) => `${AUTH_SERVICE}/users/${id}`,
};
