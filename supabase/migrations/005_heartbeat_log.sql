-- Keepalive log, written over a direct Postgres connection.
--
-- The daily PostgREST PATCH on `heartbeat` (004) ran green every day from
-- 2026-09-08 and Supabase still sent pause warnings. The workflow now also
-- opens a real Postgres session through the connection pooler and inserts a
-- row here each run, so the project sees the same kind of traffic a live app
-- produces. Rows older than 30 days are pruned by the same transaction.

CREATE TABLE IF NOT EXISTS heartbeat_log (
  id         BIGSERIAL PRIMARY KEY,
  source     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS on with no policies: the anon and authenticated roles get nothing.
-- The workflow connects as `postgres`, which owns the table and bypasses RLS,
-- so only it can write here — the public anon key cannot spam this table.
ALTER TABLE heartbeat_log ENABLE ROW LEVEL SECURITY;
