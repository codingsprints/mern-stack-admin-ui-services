import cartReducer, {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from "@/store/cartSlice";

describe("Cart Slice", () => {
  const initialState = { items: [] };
  const product = {
    id: 1,
    title: "Shirt",
    price: 100,
    description: "Cotton shirt",
    image: "shirt.jpg",
  };

  it("should add a new product to cart", () => {
    const state = cartReducer(initialState, addToCart(product));
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(1);
    expect(state.items[0].product.id).toBe(1);
  });

  it("should increment quantity if product already exists", () => {
    let state = cartReducer(initialState, addToCart(product));
    state = cartReducer(state, addToCart(product));
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("should remove a product from cart", () => {
    let state = cartReducer(initialState, addToCart(product));
    state = cartReducer(state, removeFromCart(product.id));
    expect(state.items.length).toBe(0);
  });

  it("should increment quantity", () => {
    let state = cartReducer(initialState, addToCart(product));
    state = cartReducer(state, incrementQuantity(product.id));
    expect(state.items[0].quantity).toBe(2);
  });

  it("should decrement quantity but not below 1", () => {
    let state = cartReducer(initialState, addToCart(product));
    state = cartReducer(state, decrementQuantity(product.id));
    expect(state.items[0].quantity).toBe(1);
  });

  it("should clear the cart", () => {
    let state = cartReducer(initialState, addToCart(product));
    state = cartReducer(state, clearCart());
    expect(state.items.length).toBe(0);
  });
});
