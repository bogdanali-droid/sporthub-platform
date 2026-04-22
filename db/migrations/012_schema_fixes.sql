-- ============================================================
-- Migration 012: Schema fixes - add sport_code to players + FK constraints
-- ============================================================

-- Add sport_code column to players (nullable - enables multi-sport legitimation)
ALTER TABLE players ADD COLUMN sport_code TEXT DEFAULT NULL;

-- Add FK constraint: players.sport_code → sports.code
ALTER TABLE players ADD CONSTRAINT fk_players_sport
  FOREIGN KEY (sport_code) REFERENCES sports(code) ON DELETE SET NULL;

-- Add FK constraint: players.federation_id → federations.id (was missing)
ALTER TABLE players ADD CONSTRAINT fk_players_federation
  FOREIGN KEY (federation_id) REFERENCES federations(id) ON DELETE SET NULL;

-- Create federation_sports junction table (FRBS manages multiple sports)
CREATE TABLE IF NOT EXISTS federation_sports (
  federation_id TEXT NOT NULL,
  sport_code TEXT NOT NULL,
  PRIMARY KEY (federation_id, sport_code),
  FOREIGN KEY (federation_id) REFERENCES federations(id) ON DELETE CASCADE,
  FOREIGN KEY (sport_code) REFERENCES sports(code) ON DELETE CASCADE
);

-- Populate federation_sports: FRBS federation has both sports
INSERT OR IGNORE INTO federation_sports (federation_id, sport_code)
VALUES ('frbs-federation', 'BASEBALL5');

INSERT OR IGNORE INTO federation_sports (federation_id, sport_code)
VALUES ('frbs-federation', 'SOFTBALL');
