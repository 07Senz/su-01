-- D1 schema for members table
-- Run via your Cloudflare D1 migration tool.

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  memberType TEXT NOT NULL CHECK (memberType IN ('G.M','E.M','Core'))
);

