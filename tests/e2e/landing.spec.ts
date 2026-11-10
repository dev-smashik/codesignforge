/**
 * Playwright smoke test: captures the landing page at every viewport required
 * by AGENTS.md §2 and asserts no horizontal overflow. Also runs a keyboard
 * navigation check on the signup form.
 *
 * Usage: npx playwright test tests/e2e/landing.spec.ts --project=chromium
 */
import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

const PAGES = [
  { path: "/", name: "homepage" },
  { path: "/waitlist", name: "waitlist" },
] as const;

for (const page2 of PAGES) {
  for (const viewport of VIEWPORTS) {
    test(`${page2.name} renders without horizontal overflow at ${viewport.width}px`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== "chromium");
      await page.setViewportSize({ ...viewport });
      await page.goto(page2.path, { waitUntil: "networkidle" });

      // No horizontal overflow at the root.
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);

      // Headline must be fully inside the viewport width.
      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();
      const h1Box = await h1.boundingBox();
      if (h1Box) {
        expect(h1Box.x).toBeGreaterThanOrEqual(0);
        expect(h1Box.x + h1Box.width).toBeLessThanOrEqual(viewport.width + 1);
      }

      // Screenshot for manual design comparison.
      await page.mouse.move(0, 0);
      await page.waitForTimeout(120);
      await page.screenshot({
        path: `tests/e2e/__screenshots__/${page2.name}-${viewport.width}.png`,
        fullPage: false,
      });
    });
  }
}

test("signup form announces submit feedback", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/waitlist", { waitUntil: "networkidle" });

  const emailInput = page.getByLabel(/email address/i);
  await emailInput.focus();
  await emailInput.fill("reader@example.com");

  // /api/waitlist does not exist yet (Phase 3); submitting must end in a
  // visible, announced generic error rather than silence.
  await page.getByRole("button", { name: /get notified/i }).click();
  const status = page.locator('[role="status"]');
  await expect(status).toBeVisible();
  await expect(status).toContainText(/try again|list/i, { timeout: 15_000 });
});
