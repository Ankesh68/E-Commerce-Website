import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Contact from "../ContactPage/Contact";

const renderContact = () =>
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );

describe("contact form", () => {
  it("validates required fields before showing a success message", () => {
    renderContact();

    fireEvent.click(screen.getByRole("button", { name: /send your message/i }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required")).toBeInTheDocument();
    expect(screen.getByText("Subject is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Your Name *"), {
      target: { value: "Ankesh Raj" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Email *"), {
      target: { value: "ankesh@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mobile Number *"), {
      target: { value: "+91 98765 43210" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Subject *"), {
      target: { value: "Order help" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Message *"), {
      target: { value: "Please help me with my recent order." },
    });

    fireEvent.click(screen.getByRole("button", { name: /send your message/i }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Thanks! Your message has been received."
    );
  });
});
