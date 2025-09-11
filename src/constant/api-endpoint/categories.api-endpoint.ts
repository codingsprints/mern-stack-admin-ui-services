import { CATALOG_SERVICE } from "../constant";

export const categoriesEndPoint = {
  createCategories: `${CATALOG_SERVICE}/categories`,
  fetchCategories: `${CATALOG_SERVICE}/categories`,
  fetchSingleCategory: (categoryId: string) =>
    `${CATALOG_SERVICE}/categories/${categoryId}`,
  updateCategories: (categoryId: string) =>
    `${CATALOG_SERVICE}/categories/${categoryId}`,
  deleteCategories: (categoryId: string) =>
    `${CATALOG_SERVICE}/categories/${categoryId}`,
};
