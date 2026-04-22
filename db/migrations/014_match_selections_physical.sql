-- ============================================================
-- Migration 014: match_selections Baseball5 + physical_test_types
-- ============================================================

-- Coloane noi în match_selections pentru Baseball5
ALTER TABLE match_selections ADD COLUMN batting_order INTEGER DEFAULT NULL;
ALTER TABLE match_selections ADD COLUMN innings_played INTEGER DEFAULT 0;
ALTER TABLE match_selections ADD COLUMN runs_scored INTEGER DEFAULT 0;
ALTER TABLE match_selections ADD COLUMN outs_made INTEGER DEFAULT 0;
ALTER TABLE match_selections ADD COLUMN hits INTEGER DEFAULT 0;
ALTER TABLE match_selections ADD COLUMN safe_reaches INTEGER DEFAULT 0;

-- Tipuri de teste fizice specifice Baseball5/Softball
CREATE TABLE IF NOT EXISTS physical_test_types (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  sport_code  TEXT NOT NULL,
  code        TEXT NOT NULL,
  name_ro     TEXT NOT NULL,
  unit        TEXT NOT NULL,
  lower_is_better INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  UNIQUE(sport_code, code)
);

INSERT OR IGNORE INTO physical_test_types (sport_code, code, name_ro, unit, lower_is_better, display_order)
VALUES
  ('BASEBALL5', 'sprint_20m',       'Sprint 20m',         's',   1, 1),
  ('BASEBALL5', 'broad_jump_cm',    'Săritură în lungime', 'cm',  0, 2),
  ('BASEBALL5', 'grip_strength_kg', 'Forța de prindere',  'kg',  0, 3),
  ('BASEBALL5', 'height_cm',        'Înălțime',           'cm',  0, 4),
  ('BASEBALL5', 'weight_kg',        'Greutate',           'kg',  0, 5),
  ('SOFTBALL',  'sprint_20m',       'Sprint 20m',         's',   1, 1),
  ('SOFTBALL',  'broad_jump_cm',    'Săritură în lungime', 'cm', 0, 2),
  ('SOFTBALL',  'grip_strength_kg', 'Forța de prindere',  'kg',  0, 3),
  ('SOFTBALL',  'pitch_speed_kmh',  'Viteză aruncare',    'km/h',0, 4),
  ('SOFTBALL',  'height_cm',        'Înălțime',           'cm',  0, 5),
  ('SOFTBALL',  'weight_kg',        'Greutate',           'kg',  0, 6);

-- Indexuri utile
CREATE INDEX IF NOT EXISTS idx_match_events_inning ON match_events (match_id, inning, half);
CREATE INDEX IF NOT EXISTS idx_players_club_status ON players (club_id, status);
