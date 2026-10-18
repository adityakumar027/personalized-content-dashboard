import { describe, it, expect } from "vitest";
import reducer, { reorderItems, addLiveItem, orderedItems, resetFeed, ContentState } from "@/store/contentSlice";
import { MOCK_ITEMS } from "@/lib/mockData";

const base: ContentState = {
  items: MOCK_ITEMS.slice(0, 3),
  status: "succeeded",
  error: null,
  page: 1,
  hasMore: false,
  order: [],
};

describe("contentSlice", () => {
  it("reorders items by id list", () => {
    const ids = [base.items[2].id, base.items[0].id, base.items[1].id];
    const s = reducer(base, reorderItems(ids));
    expect(orderedItems(s).map((i) => i.id)).toEqual(ids);
  });

  it("keeps unordered items after ordered ones (edge case)", () => {
    const s = reducer(base, reorderItems([base.items[1].id]));
    const result = orderedItems(s).map((i) => i.id);
    expect(result[0]).toBe(base.items[1].id);
    expect(result).toHaveLength(3);
  });

  it("does not duplicate live items", () => {
    const s = reducer(base, addLiveItem(base.items[0]));
    expect(s.items).toHaveLength(3);
    const s2 = reducer(base, addLiveItem({ ...base.items[0], id: "new-id" }));
    expect(s2.items[0].id).toBe("new-id");
  });

  it("resetFeed clears state", () => {
    const s = reducer(base, resetFeed());
    expect(s.items).toEqual([]);
    expect(s.page).toBe(1);
    expect(s.status).toBe("idle");
  });
});
