import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ProductDisplay from "../Shop/ProductDisplay";
import { store } from "../redux/store";

const item = {
  id: "pdp-test",
  name: "Demo Jacket",
  title: "Demo Jacket",
  price: 49.99,
  description: "A demo product for option controls.",
  category: "men's clothing",
  img: "demo.jpg",
  rating: 4.5,
  ratingCount: 12,
};

const renderPdp = (notify = vi.fn()) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductDisplay item={item} notify={notify} />
      </MemoryRouter>
    </Provider>
  );

describe("product detail options", () => {
  it("selects a colour and size from dropdown menus", () => {
    renderPdp();

    fireEvent.click(screen.getByRole("button", { name: /select a colour/i }));
    fireEvent.click(screen.getByRole("option", { name: "Blue" }));
    expect(screen.getByRole("button", { name: /colour blue/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /select a size/i }));
    fireEvent.click(screen.getByRole("option", { name: "M" }));
    expect(screen.getByRole("button", { name: /size m/i })).toBeInTheDocument();
  });

  it("shows discount pricing, offers, delivery, payment and key features", () => {
    renderPdp();

    expect(screen.getByText("$62.49")).toBeInTheDocument();
    expect(screen.getByText("20% OFF")).toBeInTheDocument();
    expect(screen.getByText("Delivery by")).toBeInTheDocument();
    expect(screen.getByText("Offers")).toBeInTheDocument();
    expect(screen.getByText("SAVE10")).toBeInTheDocument();
    expect(screen.getByText("Payment options")).toBeInTheDocument();
    expect(screen.getByText("Key features")).toBeInTheDocument();
  });

  it("increments quantity and includes selected options in confirmation", () => {
    const notify = vi.fn();
    renderPdp(notify);

    fireEvent.click(screen.getByRole("button", { name: /select a colour/i }));
    fireEvent.click(screen.getByRole("option", { name: "Black" }));
    fireEvent.click(screen.getByRole("button", { name: /select a size/i }));
    fireEvent.click(screen.getByRole("option", { name: "L" }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));

    expect(screen.getByRole("spinbutton", { name: /quantity/i })).toHaveValue(2);

    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(notify).toHaveBeenCalledWith(
      "Added 2 × “Demo Jacket” (Size L, Black) to cart"
    );
  });
});
