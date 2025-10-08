import productsReducer, { fetchProducts } from "@/store/productsSlice";
import { AnyAction } from "@reduxjs/toolkit";

describe("Products Slice", () => {
  const initialState = { items: [], loading: false, error: null };

  it("should handle initial state", () => {
    expect(productsReducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it("should set loading on fetchProducts.pending", () => {
    const action = { type: fetchProducts.pending.type };
    const state = productsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("should set products on fetchProducts.fulfilled", () => {
    const products = [
      {
        id: 1,
        title: "Shirt",
        price: 100,
        description: "Cotton",
        image: "img.jpg",
      },
    ];
    const action = { type: fetchProducts.fulfilled.type, payload: products };
    const state = productsReducer(initialState, action);
    expect(state.items).toEqual(products);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set error on fetchProducts.rejected", () => {
    const action = {
      type: fetchProducts.rejected.type,
      error: { message: "Network error" }, // ✅ Provide error object
    };
    const state = productsReducer(initialState, action);
    expect(state.error).toBe("Network error");
    expect(state.loading).toBe(false);
  });
});
