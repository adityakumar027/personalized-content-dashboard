import { describe, it, expect } from "vitest";
import reducer, { toggleCategory, setCategories, setDarkMode, hydrate, DEFAULT_PREFERENCES } from "@/store/preferencesSlice";

describe("preferencesSlice", () => {
  it("toggles a category off and on", () => {
    let s = reducer(DEFAULT_PREFERENCES, toggleCategory("sports"));
    expect(s.categories).not.toContain("sports");
    s = reducer(s, toggleCategory("sports"));
    expect(s.categories).toContain("sports");
  });

  it("never allows zero categories (edge case)", () => {
    let s = reducer({ categories: ["finance"], darkMode: false }, toggleCategory("finance"));
    expect(s.categories).toEqual(["finance"]);
  });

  it("setCategories ignores an empty list (edge case)", () => {
    const s = reducer(DEFAULT_PREFERENCES, setCategories([]));
    expect(s.categories).toEqual(DEFAULT_PREFERENCES.categories);
  });

  it("toggles dark mode", () => {
    const s = reducer(DEFAULT_PREFERENCES, setDarkMode(true));
    expect(s.darkMode).toBe(true);
  });

  it("hydrates persisted preferences defensively", () => {
    const s = reducer(DEFAULT_PREFERENCES, hydrate({ categories: ["science"], darkMode: true }));
    expect(s.categories).toEqual(["science"]);
    expect(s.darkMode).toBe(true);
    const s2 = reducer(DEFAULT_PREFERENCES, hydrate({ categories: [] }));
    expect(s2.categories).toEqual(DEFAULT_PREFERENCES.categories);
  });
});
