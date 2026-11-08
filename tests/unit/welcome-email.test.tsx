import { render } from "@react-email/render";
import { describe, expect, it } from "vitest";

import { WelcomeEmail } from "@/emails/welcome";

describe("WelcomeEmail", () => {
  it("renders brand, opt-in framing, and the unsubscribe link", async () => {
    const html = await render(
      <WelcomeEmail
        appUrl="https://example.com"
        unsubscribeUrl="https://example.com/unsubscribe/abc123"
      />,
    );

    expect(html).toContain("https://example.com/unsubscribe/abc123");
    expect(html).toContain("Unsubscribe");
    expect(html).toContain("launch updates");
    // No verification claims anywhere in the rendering.
    expect(html.toLowerCase()).not.toContain("verify");
    expect(html.toLowerCase()).not.toContain("verified");
  });
});
