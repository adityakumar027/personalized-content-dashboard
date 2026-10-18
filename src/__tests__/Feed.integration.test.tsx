import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import Feed from "@/components/Feed";

function renderFeed(query = "") {
  const store = makeStore();
  return render(
    <Provider store={store}>
      <Feed query={query} />
    </Provider>
  );
}

describe("Feed (integration)", () => {
  it("renders fetched content cards", async () => {
    renderFeed();
    await waitFor(() => expect(screen.getAllByRole("article").length).toBeGreaterThan(0), {
      timeout: 4000,
    });
  });

  it("shows an empty state when the query matches nothing", async () => {
    renderFeed("zzz-definitely-no-match");
    await waitFor(() => expect(screen.getByTestId("empty-feed")).toBeInTheDocument(), {
      timeout: 4000,
    });
  });

  it("filters content by search query", async () => {
    renderFeed("chipmakers");
    await waitFor(
      () => {
        const cards = screen.getAllByRole("article");
        expect(cards).toHaveLength(1);
        expect(cards[0]).toHaveTextContent("Chipmakers");
      },
      { timeout: 4000 }
    );
  });
});
