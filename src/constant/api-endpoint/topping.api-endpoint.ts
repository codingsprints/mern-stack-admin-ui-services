import { CATALOG_SERVICE } from "../constant";

export const toppingEndPoint = {
  createToppings: `${CATALOG_SERVICE}/toppings`,
  fetchToppings: `${CATALOG_SERVICE}/toppings/`,
  fetchSingleTopping: (toppingId: string) =>
    `${CATALOG_SERVICE}/toppings/${toppingId}`,
  updateToppings: (toppingId: string) =>
    `${CATALOG_SERVICE}/toppings/${toppingId}`,
  deleteToppings: (toppingId: string) =>
    `${CATALOG_SERVICE}/toppings/${toppingId}`,
};
