import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";

describe("Cart model", () => {
  it("adds products, calculates totals and clears", () => {
    const cart = new Cart();
    const product = new Product(1, "Shirt", 100, "Cotton shirt", "img.jpg");

    cart.addProduct(product);
    expect(cart.getTotalQuantity()).toBe(1);
    expect(cart.getTotalValue()).toBe(100);

    cart.addProduct(product); // increment
    expect(cart.getTotalQuantity()).toBe(2);
    expect(cart.getTotalValue()).toBe(200);

    cart.clear();
    expect(cart.items.length).toBe(0);
  });
});
