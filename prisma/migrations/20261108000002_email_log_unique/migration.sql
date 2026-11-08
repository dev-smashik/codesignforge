-- One EmailLog per campaign recipient (campaign + subscriber + type).
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_campaignId_subscriberId_type_key" UNIQUE ("campaignId", "subscriberId", "type");
