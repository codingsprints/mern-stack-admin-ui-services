import { AUTH_SERVICE } from "../constant";

export const userApiService = {
  fetchUser: () => `${AUTH_SERVICE}/users`,
};
