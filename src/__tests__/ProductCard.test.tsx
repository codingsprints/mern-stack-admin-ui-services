import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "@/components/ProductCard";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Product } from "@/lib/models/Product";

const renderWithProvider = (ui: React.ReactNode) =>
  render(<Provider store={store}>{ui}</Provider>);

describe("ProductCard", () => {
  it("renders product and adds to cart", () => {
    const product = new Product(1, "Shirt", 100, "Cotton shirt", "shirt.jpg");

    renderWithProvider(<ProductCard product={product} />);
    expect(screen.getByText("Shirt")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add to Cart"));
    const state = store.getState().cart.items;
    expect(state.length).toBeGreaterThan(0);
  });
});
