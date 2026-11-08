-- Trim to the minimal waitlist model: drop Admin, AdminSession, Campaign,
-- AuditLog; drop campaign/type columns from EmailLog and OutboxJob.
-- Email delivery no longer needs the campaign scaffolding.

ALTER TABLE "EmailLog" DROP COLUMN IF EXISTS "campaignId";
ALTER TABLE "EmailLog" DROP COLUMN IF EXISTS "type";
DROP INDEX IF EXISTS "EmailLog_campaignId_status_idx";
ALTER TABLE "EmailLog" DROP CONSTRAINT IF EXISTS "EmailLog_campaignId_subscriberId_type_key";

ALTER TABLE "OutboxJob" DROP COLUMN IF EXISTS "campaignId";
ALTER TABLE "OutboxJob" DROP COLUMN IF EXISTS "type";
DROP INDEX IF EXISTS "OutboxJob_campaignId_idx";
ALTER TABLE "OutboxJob" DROP CONSTRAINT IF EXISTS "OutboxJob_type_subscriberId_campaignId_key";

DROP TABLE IF EXISTS "AuditLog";
DROP TABLE IF EXISTS "Campaign";
DROP TABLE IF EXISTS "AdminSession";
DROP TABLE IF EXISTS "Admin";

CREATE UNIQUE INDEX "OutboxJob_subscriberId_key" ON "OutboxJob"("subscriberId");

DROP TYPE "CampaignStatus";
DROP TYPE "EmailType";
DROP TYPE "OutboxJobType";
