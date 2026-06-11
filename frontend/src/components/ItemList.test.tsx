import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ItemList from "./ItemList";
import * as itemsApi from "../api/items";
import type { Item } from "../types/item";

vi.mock("../api/items");

const mockGetItems = vi.mocked(itemsApi.getItems);

function renderItemList() {
  return render(
    <MemoryRouter>
      <ItemList />
    </MemoryRouter>
  );
}

describe("ItemList", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("displays items with name and group when items exist", async () => {
    const items: Item[] = [
      { id: 1, name: "Rock", group: "Primary", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, name: "Paper", group: "Secondary", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    ];
    mockGetItems.mockResolvedValue(items);

    renderItemList();

    await waitFor(() => {
      expect(screen.getByText(/Rock/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Rock — Primary/)).toBeInTheDocument();
    expect(screen.getByText(/Paper — Secondary/)).toBeInTheDocument();
  });

  it("shows empty state message when no items exist", async () => {
    mockGetItems.mockResolvedValue([]);

    renderItemList();

    await waitFor(() => {
      expect(screen.getByText("No items available.")).toBeInTheDocument();
    });
  });

  it("shows error message on API fetch failure", async () => {
    mockGetItems.mockRejectedValue(new Error("Network error"));

    renderItemList();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Could not load items.");
    });
  });

  it("shows loading state initially", () => {
    mockGetItems.mockReturnValue(new Promise(() => {})); // never resolves

    renderItemList();

    expect(screen.getByText("Loading items…")).toBeInTheDocument();
  });

  it("renders links to item detail pages", async () => {
    const items: Item[] = [
      { id: 5, name: "Scissors", group: "Primary", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    ];
    mockGetItems.mockResolvedValue(items);

    renderItemList();

    await waitFor(() => {
      expect(screen.getByText(/Scissors/)).toBeInTheDocument();
    });

    const link = screen.getByRole("link", { name: /Scissors — Primary/ });
    expect(link).toHaveAttribute("href", "/items/5");
  });

  it("renders a link to create a new item", async () => {
    mockGetItems.mockResolvedValue([
      { id: 1, name: "Rock", group: "Primary", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
    ]);

    renderItemList();

    await waitFor(() => {
      expect(screen.getByText(/Rock/)).toBeInTheDocument();
    });

    const createLink = screen.getByRole("link", { name: /Create Item/i });
    expect(createLink).toHaveAttribute("href", "/items/new");
  });
});
