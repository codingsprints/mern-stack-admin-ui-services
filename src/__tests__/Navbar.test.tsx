import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { addToCart } from "@/store/cartSlice";

const renderWithProvider = (ui: React.ReactNode) =>
  render(<Provider store={store}>{ui}</Provider>);

describe("Navbar", () => {
  it("shows cart badge when items exist", () => {
    store.dispatch(
      addToCart({
        id: 1,
        title: "Shirt",
        price: 100,
        description: "Cotton",
        image: "shirt.jpg",
      })
    );
    renderWithProvider(<Navbar />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
