-- Ensure gen_random_uuid() is available on older PostgreSQL (< 13).
-- On PostgreSQL >= 13 it is built in; CREATE IF NOT EXISTS is a no-op there.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
