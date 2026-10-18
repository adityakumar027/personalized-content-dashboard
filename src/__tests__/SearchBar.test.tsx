import { describe, it, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

describe("SearchBar (debounced search)", () => {
  it("emits the debounced query, not every keystroke", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const box = screen.getByRole("searchbox");
    fireEvent.change(box, { target: { value: "c" } });
    fireEvent.change(box, { target: { value: "cr" } });
    fireEvent.change(box, { target: { value: "cricket" } });
    // Only the initial empty emit so far; keystrokes are debounced.
    expect(onSearch).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(onSearch).toHaveBeenCalledTimes(2);
    expect(onSearch).toHaveBeenLastCalledWith("cricket");
    vi.useRealTimers();
  });

  it("emits again when the query changes", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const box = screen.getByRole("searchbox");
    fireEvent.change(box, { target: { value: "ai" } });
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(onSearch).toHaveBeenLastCalledWith("ai");
    fireEvent.change(box, { target: { value: "" } });
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(onSearch).toHaveBeenLastCalledWith("");
    vi.useRealTimers();
  });
});
