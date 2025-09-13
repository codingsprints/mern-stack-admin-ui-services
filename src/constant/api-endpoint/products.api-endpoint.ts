import type { productQueryParams } from "../../utils/types";
import { CATALOG_SERVICE } from "../constant";

export const productEndPoint = {
  createProducts: `${CATALOG_SERVICE}/products`,
  fetchProducts: (
    queryParams: productQueryParams,
    productIsPubliced?: boolean
  ) =>
    `${CATALOG_SERVICE}/products?limit=${queryParams?.perPage}&page=${
      queryParams?.currentPage
    }&q=${queryParams?.q}&tenantId=${queryParams?.tenantId || ""}&isPublish=${
      productIsPubliced ?? false
    }&categoryId=${queryParams.categoryId ? queryParams.categoryId : ""} `,
  fetchSingleProduct: (productId: string) =>
    `${CATALOG_SERVICE}/products/${productId}`,
  updateProducts: (productId: string) =>
    `${CATALOG_SERVICE}/products/${productId}`,
  deleteProducts: (productId: string) =>
    `${CATALOG_SERVICE}/products/${productId}`,
};
