-- ============================================================
-- Migration 013: Baseball5 & Softball schema completare
-- Positions, evaluation attributes, match fields, player fields
-- ============================================================

-- ---- sport_positions ----
INSERT OR IGNORE INTO sport_positions (sport_code, code, name_ro, abbreviation, display_order)
VALUES
  ('BASEBALL5', 'FIRST_BASE',   'Prima Bază',    '1B',  1),
  ('BASEBALL5', 'SECOND_BASE',  'A Doua Bază',   '2B',  2),
  ('BASEBALL5', 'MIDFIELDER',   'Mijlocaș',       'MID', 3),
  ('BASEBALL5', 'SHORTSTOP',    'Opri-Scurt',    'SS',  4),
  ('BASEBALL5', 'THIRD_BASE',   'A Treia Bază',  '3B',  5);

INSERT OR IGNORE INTO sport_positions (sport_code, code, name_ro, abbreviation, display_order)
VALUES
  ('SOFTBALL', 'PITCHER',       'Pitcher',       'P',   1),
  ('SOFTBALL', 'CATCHER',       'Catcher',       'C',   2),
  ('SOFTBALL', 'FIRST_BASE',    'Prima Bază',    '1B',  3),
  ('SOFTBALL', 'SECOND_BASE',   'A Doua Bază',   '2B',  4),
  ('SOFTBALL', 'THIRD_BASE',    'A Treia Bază',  '3B',  5),
  ('SOFTBALL', 'SHORTSTOP',     'Opri-Scurt',    'SS',  6),
  ('SOFTBALL', 'LEFT_FIELD',    'Stânga',        'LF',  7),
  ('SOFTBALL', 'CENTER_FIELD',  'Centru',        'CF',  8),
  ('SOFTBALL', 'RIGHT_FIELD',   'Dreapta',       'RF',  9);

-- ---- sport_evaluation_attributes ----
INSERT OR IGNORE INTO sport_evaluation_attributes (sport_code, code, name_ro, display_order)
VALUES
  ('BASEBALL5', 'batting_power',    'Putere la Lovit',    1),
  ('BASEBALL5', 'batting_accuracy', 'Precizie la Lovit',  2),
  ('BASEBALL5', 'fielding',         'Apărare/Prindere',   3),
  ('BASEBALL5', 'throwing',         'Aruncare',           4),
  ('BASEBALL5', 'speed',            'Viteză',             5),
  ('BASEBALL5', 'agility',          'Agilitate',          6),
  ('BASEBALL5', 'decision',         'Decizie',            7),
  ('BASEBALL5', 'leadership',       'Lider',              8);

INSERT OR IGNORE INTO sport_evaluation_attributes (sport_code, code, name_ro, display_order)
VALUES
  ('SOFTBALL', 'pitching',          'Pitching',           1),
  ('SOFTBALL', 'batting_power',     'Putere la Lovit',    2),
  ('SOFTBALL', 'batting_accuracy',  'Precizie la Lovit',  3),
  ('SOFTBALL', 'fielding',          'Apărare',            4),
  ('SOFTBALL', 'throwing',          'Aruncare',           5),
  ('SOFTBALL', 'speed',             'Viteză',             6),
  ('SOFTBALL', 'agility',           'Agilitate',          7),
  ('SOFTBALL', 'leadership',        'Lider',              8);

-- ---- sport_event_types ----
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, points, category)
VALUES
  ('BASEBALL5', 'HIT',         'Lovitură (H)',      0, 'BATTING'),
  ('BASEBALL5', 'SAFE',        'Safe (S)',          0, 'BATTING'),
  ('BASEBALL5', 'OUT',         'Out (X)',           0, 'OUT'),
  ('BASEBALL5', 'RUN_SCORED',  'Run Marcat',        1, 'SCORING'),
  ('BASEBALL5', 'RUNNER_OUT',  'Runner Eliminat',   0, 'OUT'),
  ('BASEBALL5', 'INNING_END',  'Sfârșit Inning',    0, 'ADMIN'),
  ('SOFTBALL',  'HIT',         'Lovitură',          0, 'BATTING'),
  ('SOFTBALL',  'HOME_RUN',    'Home Run',          1, 'SCORING'),
  ('SOFTBALL',  'OUT',         'Out',               0, 'OUT'),
  ('SOFTBALL',  'RUN_SCORED',  'Run Marcat',        1, 'SCORING'),
  ('SOFTBALL',  'WALK',        'Walk (BB)',         0, 'BATTING'),
  ('SOFTBALL',  'STRIKEOUT',   'Strikeout (K)',     0, 'OUT'),
  ('SOFTBALL',  'INNING_END',  'Sfârșit Inning',    0, 'ADMIN');

-- ---- Coloane noi în players ----
ALTER TABLE players ADD COLUMN cnp TEXT DEFAULT NULL;
ALTER TABLE players ADD COLUMN license_date TEXT DEFAULT NULL;
ALTER TABLE players ADD COLUMN photo_url TEXT DEFAULT NULL;

-- ---- Coloane Baseball5 în match_events ----
ALTER TABLE match_events ADD COLUMN inning INTEGER DEFAULT 1;
ALTER TABLE match_events ADD COLUMN half TEXT DEFAULT 'TOP';

-- ---- Coloane Baseball5 în matches ----
ALTER TABLE matches ADD COLUMN box_score TEXT DEFAULT NULL;
ALTER TABLE matches ADD COLUMN innings_count INTEGER DEFAULT 5;
ALTER TABLE matches ADD COLUMN current_inning INTEGER DEFAULT 1;
ALTER TABLE matches ADD COLUMN current_half TEXT DEFAULT 'TOP';
ALTER TABLE matches ADD COLUMN outs_count INTEGER DEFAULT 0;
ALTER TABLE matches ADD COLUMN video_url TEXT DEFAULT NULL;
ALTER TABLE matches ADD COLUMN video_type TEXT DEFAULT NULL;
