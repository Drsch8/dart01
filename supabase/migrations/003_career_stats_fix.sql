-- Recreate career_stats view:
-- 1. Exclude placeholder names "Player 1" / "Player 2"
-- 2. Add missing total_100s column

DROP VIEW IF EXISTS career_stats;

CREATE VIEW career_stats AS
SELECT
  name,
  COUNT(*)                                            AS matches,
  SUM(wins)                                           AS wins,
  SUM(legs_won)                                       AS legs_won,
  ROUND(AVG(avg_score) FILTER (WHERE avg_score IS NOT NULL), 1) AS avg_score,
  ROUND(AVG(first9)    FILTER (WHERE first9    IS NOT NULL), 1) AS first9_avg,
  ROUND(AVG(co_pct)    FILTER (WHERE co_pct    IS NOT NULL), 1) AS co_pct,
  SUM(s180s)                                          AS total_180s,
  SUM(s140s)                                          AS total_140s,
  SUM(s100s)                                          AS total_100s
FROM (
  SELECT
    p1_name       AS name,
    CASE WHEN winner = p1_name THEN 1 ELSE 0 END AS wins,
    p1_legs_won   AS legs_won,
    p1_avg        AS avg_score,
    p1_first9     AS first9,
    p1_co_pct     AS co_pct,
    p1_180s       AS s180s,
    p1_140s       AS s140s,
    p1_100s       AS s100s
  FROM match_summaries
  WHERE p1_name NOT IN ('Player 1', 'Player 2')

  UNION ALL

  SELECT
    p2_name,
    CASE WHEN winner = p2_name THEN 1 ELSE 0 END,
    p2_legs_won, p2_avg, p2_first9, p2_co_pct, p2_180s, p2_140s, p2_100s
  FROM match_summaries
  WHERE p2_name NOT IN ('Player 1', 'Player 2')
) t
GROUP BY name
ORDER BY avg_score DESC NULLS LAST;
