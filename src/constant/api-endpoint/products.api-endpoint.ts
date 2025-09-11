import { CATALOG_SERVICE } from "../constant";

export const productEndPoint = {
  createProducts: `${CATALOG_SERVICE}/products`,
  fetchProducts: `${CATALOG_SERVICE}/products/`,
  fetchSingleProduct: (productId: string) =>
    `${CATALOG_SERVICE}/products/${productId}`,
  updateProducts: (productId: string) =>
    `${CATALOG_SERVICE}/products/${productId}`,
  deleteProducts: (productId: string) =>
    `${CATALOG_SERVICE}/products/${productId}`,
};
