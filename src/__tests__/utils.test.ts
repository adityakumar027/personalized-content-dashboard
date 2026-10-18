import { describe, it, expect, vi } from "vitest";
import { searchItems, trendingItems, formatRelativeTime, debounce } from "@/lib/utils";
import { MOCK_ITEMS } from "@/lib/mockData";

describe("utils", () => {
  it("searchItems matches title, description, source and category", () => {
    expect(searchItems(MOCK_ITEMS, "chipmakers")).toHaveLength(1);
    expect(searchItems(MOCK_ITEMS, "TMDB").length).toBeGreaterThan(0);
    expect(searchItems(MOCK_ITEMS, "")).toEqual(MOCK_ITEMS);
    expect(searchItems(MOCK_ITEMS, "zz-no-match")).toHaveLength(0);
  });

  it("trendingItems sorts by score and respects limit and category", () => {
    const t = trendingItems(MOCK_ITEMS, undefined, 5);
    expect(t).toHaveLength(5);
    expect(t[0].score).toBeGreaterThanOrEqual(t[1].score);
    expect(trendingItems(MOCK_ITEMS, "sports").every((i) => i.category === "sports")).toBe(true);
  });

  it("formatRelativeTime handles minutes, hours, days and bad input", () => {
    const now = new Date("2026-10-17T12:00:00Z");
    expect(formatRelativeTime("2026-10-17T11:45:00Z", now)).toBe("15m ago");
    expect(formatRelativeTime("2026-10-17T09:00:00Z", now)).toBe("3h ago");
    expect(formatRelativeTime("2026-10-15T09:00:00Z", now)).toBe("2d ago");
    expect(formatRelativeTime("not-a-date", now)).toBe("");
  });

  it("debounce coalesces rapid calls", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d("a");
    d("b");
    d("c");
    vi.advanceTimersByTime(150);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
    vi.useRealTimers();
  });
});
