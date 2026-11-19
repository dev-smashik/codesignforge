-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "notification_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_rate_limits" (
    "ipHash" VARCHAR(64) NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 1,
    "windowStartedAt" TIMESTAMPTZ(3) NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "notification_rate_limits_pkey" PRIMARY KEY ("ipHash")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_subscribers_email_key" ON "notification_subscribers"("email");

-- CreateIndex
CREATE INDEX "notification_rate_limits_expiresAt_idx" ON "notification_rate_limits"("expiresAt");
