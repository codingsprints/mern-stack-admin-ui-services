import { AUTH_SERVICE } from "../constant";

export const authEndpoint = {
  login: `${AUTH_SERVICE}/auth/login`,
  self: `${AUTH_SERVICE}/auth/self`,
  selfRoot: `${AUTH_SERVICE}/auth/self`,
  logout: `${AUTH_SERVICE}/auth/logout`,
};
