import "server-only";
import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";

const maxRequests = 20;
let lastCleanupAt = 0;

export async function checkNotificationRateLimit(ipAddress: string) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error("RATE_LIMIT_SECRET is not configured.");

  const ipHash = createHmac("sha256", secret).update(ipAddress).digest("hex");
  const now = Date.now();

  if (now - lastCleanupAt > 60_000) {
    lastCleanupAt = now;
    await prisma.notificationRateLimit.deleteMany({
      where: { expiresAt: { lt: new Date(now) } },
    });
  }

  const [result] = await prisma.$queryRaw<Array<{ requestCount: number }>>`
    INSERT INTO "notification_rate_limits" ("ipHash", "requestCount", "windowStartedAt", "expiresAt")
    VALUES (${ipHash}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '15 minutes')
    ON CONFLICT ("ipHash") DO UPDATE SET
      "requestCount" = CASE
        WHEN "notification_rate_limits"."expiresAt" <= CURRENT_TIMESTAMP THEN 1
        ELSE "notification_rate_limits"."requestCount" + 1
      END,
      "windowStartedAt" = CASE
        WHEN "notification_rate_limits"."expiresAt" <= CURRENT_TIMESTAMP THEN CURRENT_TIMESTAMP
        ELSE "notification_rate_limits"."windowStartedAt"
      END,
      "expiresAt" = CASE
        WHEN "notification_rate_limits"."expiresAt" <= CURRENT_TIMESTAMP
          THEN CURRENT_TIMESTAMP + INTERVAL '15 minutes'
        ELSE "notification_rate_limits"."expiresAt"
      END
    RETURNING "requestCount"
  `;

  return result.requestCount <= maxRequests;
}
