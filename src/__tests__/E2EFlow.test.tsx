import { render, screen, fireEvent, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartPage from "@/app/cart/page";
import { Product } from "@/lib/models/Product";
import { clearCart } from "@/store/cartSlice";

const renderWithProvider = (ui: React.ReactNode) =>
  render(<Provider store={store}>{ui}</Provider>);

describe("E2E User Flow", () => {
  beforeEach(() => {
    store.dispatch(clearCart());
  });

  it("adds product → navbar updates → goes to cart → increment/decrement → clears cart", () => {
    const product = new Product(1, "Shirt", 100, "Cotton shirt", "shirt.jpg");

    // Add product
    renderWithProvider(<ProductCard product={product} />);
    fireEvent.click(screen.getByText("Add to Cart"));

    // Navbar badge updates
    renderWithProvider(<Navbar />);
    expect(screen.getByText("1")).toBeInTheDocument();

    // Navigate to cart
    renderWithProvider(<CartPage />);
    const cart = screen.getByRole("main");
    const item = within(cart).getByRole("heading", { name: "Shirt", level: 2 });
    expect(item).toBeInTheDocument();

    // Increment quantity
    const incrementBtn = within(cart).getByText("+");
    fireEvent.click(incrementBtn);
    expect(within(cart).getByText("2")).toBeInTheDocument();
    expect(within(cart).getByText("₹200.00")).toBeInTheDocument();

    // Decrement quantity
    const decrementBtn = within(cart).getByText("-");
    fireEvent.click(decrementBtn);
    expect(within(cart).getByText("1")).toBeInTheDocument();
    expect(within(cart).getByText("₹100.00")).toBeInTheDocument();

    // Clear cart
    const clearBtn = within(cart).getByText("Clear Cart");
    fireEvent.click(clearBtn);
    expect(store.getState().cart.items.length).toBe(0);
    expect(within(cart).queryByText("Shirt")).not.toBeInTheDocument();
    expect(within(cart).getByText(/No items in cart/)).toBeInTheDocument();
  });
});
