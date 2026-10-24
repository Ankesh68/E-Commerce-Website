import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ShopSidebarExtras from "../Shop/ShopSidebarExtras";

const products = [
  {
    id: "1",
    name: "Everyday Cotton Backpack",
    image: "backpack.jpg",
    price: 45,
    category: "men's clothing",
    rating: 4.1,
  },
  {
    id: "2",
    name: "Premium Leather Jacket",
    image: "jacket.jpg",
    price: 120,
    category: "men's clothing",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Silver Chain Bracelet",
    image: "bracelet.jpg",
    price: 60,
    category: "jewelery",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Wireless Headphones",
    image: "headphones.jpg",
    price: 90,
    category: "electronics",
    rating: 4.6,
  },
];

const renderSidebar = (props = {}) =>
  render(
    <MemoryRouter>
      <ShopSidebarExtras {...props} />
    </MemoryRouter>
  );

describe("shop sidebar extras", () => {
  it("renders API products and sends the selected tag back to the shop", () => {
    const onTagClick = vi.fn();
    renderSidebar({ products, onTagClick, activeTag: "Electronics" });

    expect(screen.getByText("Most Popular Products")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Premium Leather Jacket/i })
    ).toHaveAttribute("href", "/shop/2");
    expect(
      screen.getByRole("button", { name: "Electronics" })
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Backpack" }));
    expect(onTagClick).toHaveBeenCalledWith("Backpack");
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveAttribute(
      "href",
      "/contact"
    );
  });
});
