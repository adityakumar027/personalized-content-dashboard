import { describe, it, expect } from "vitest";
import reducer, { toggleFavorite } from "@/store/favoritesSlice";
import { MOCK_ITEMS } from "@/lib/mockData";

describe("favoritesSlice", () => {
  const item = MOCK_ITEMS[0];

  it("adds and removes a favorite", () => {
    let s = reducer({ items: {} }, toggleFavorite(item));
    expect(s.items[item.id]).toBeDefined();
    s = reducer(s, toggleFavorite(item));
    expect(s.items[item.id]).toBeUndefined();
  });
});
