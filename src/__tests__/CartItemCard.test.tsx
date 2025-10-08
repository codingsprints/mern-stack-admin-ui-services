import { render, screen, fireEvent } from "@testing-library/react";
import CartItemCard from "@/components/CartItemCard";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Product } from "@/lib/models/Product";
import { addToCart } from "@/store/cartSlice";

const renderWithProvider = (ui: React.ReactNode) =>
  render(<Provider store={store}>{ui}</Provider>);

describe("CartItemCard", () => {
  it("renders cart item and handles increment/decrement", () => {
    const product = new Product(1, "Shirt", 100, "Cotton shirt", "shirt.jpg");
    store.dispatch(addToCart(product));

    const item = store.getState().cart.items[0];
    renderWithProvider(<CartItemCard item={item} />);

    expect(screen.getByText("Shirt")).toBeInTheDocument();
    fireEvent.click(screen.getByText("+"));
    expect(store.getState().cart.items[0].quantity).toBe(2);

    fireEvent.click(screen.getByText("-"));
    expect(store.getState().cart.items[0].quantity).toBe(1);
  });
});
