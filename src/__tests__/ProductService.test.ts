import { ProductService } from "@/lib/services/ProductService";

describe("ProductService", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("fetches products", async () => {
    const mockData = [
      {
        id: 1,
        title: "Shirt",
        price: 100,
        description: "Cotton",
        image: "img.jpg",
      },
    ];
    // @ts-expect-error: mocking fetch for testing
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    const products = await ProductService.fetchProducts();
    expect(products).toEqual(mockData);
    expect(fetch).toHaveBeenCalled();
  });
});
