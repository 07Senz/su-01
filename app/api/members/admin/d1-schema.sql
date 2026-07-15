-- D1 schema for members table
-- Run via your Cloudflare D1 migration tool.

-- Roles removed; only Core is supported.
-- Keep existing rows that may have G.M/E.M by allowing them during migration if needed.
-- If you want strict enforcement, change CHECK to only 'Core'.

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  memberType TEXT NOT NULL CHECK (memberType IN ('Core'))
);

