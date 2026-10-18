import { test, expect } from "@playwright/test";

test.describe("Personalized Content Dashboard", () => {
  test("loads the feed and shows content cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Your feed" })).toBeVisible();
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("debounced search filters content", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("chipmakers");
    await page.waitForTimeout(500); // debounce + fetch
    await expect(page.locator("article")).toHaveCount(1);
  });

  test("favorites flow: save a card and see it under Favorites", async ({ page }) => {
    await page.goto("/");
    const first = page.locator("article").first();
    await expect(first).toBeVisible();
    await first.getByRole("button", { name: "Add to favorites" }).click();
    await page.getByRole("button", { name: "Favorites", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Your favorites" })).toBeVisible();
    await expect(page.locator("article")).toHaveCount(1);
  });

  test("dark mode toggles the dark class on the root element", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("settings persist across reloads", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await page.getByRole("button", { name: "sports" }).click();
    await page.reload();
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await expect(page.getByRole("button", { name: "sports" })).toHaveAttribute("aria-pressed", "false");
  });

  test("drag-and-drop reorders feed cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("article");
    await expect(cards.nth(1)).toBeVisible();
    const firstTitle = await cards.nth(0).locator("h3").innerText();
    const secondTitle = await cards.nth(1).locator("h3").innerText();
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    await page.mouse.move(first!.x + 40, first!.y + 40);
    await page.mouse.down();
    await page.mouse.move(second!.x + 40, second!.y + 120, { steps: 12 });
    await page.mouse.up();
    // After the drag, the previous second card should no longer be strictly after the first.
    const titles = await cards.locator("h3").allInnerTexts();
    expect(titles.indexOf(secondTitle)).toBeLessThan(titles.indexOf(firstTitle));
  });
});
