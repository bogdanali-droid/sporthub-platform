-- ============================================================
-- SportHub — Multi-Sport Platform Schema (Cloudflare D1 / SQLite)
-- ============================================================
-- Differences vs. Rugby Hub:
--   1. `clubs.sport_type` — each club is assigned a sport
--   2. `sports` catalog table + `sport_*` config tables
--   3. Flexible CHECK constraints (no hardcoded rugby events)
--   4. `player_evaluations_v2` abstract attributes (key/value)
--   5. `match_events.event_type` is a string key resolved against sport_event_types

-- ============================================================
-- SPORTS CATALOG (master list of supported sports)
-- ============================================================
CREATE TABLE IF NOT EXISTS sports (
  code         TEXT PRIMARY KEY,          -- e.g. 'RUGBY', 'BASEBALL5', 'SOFTBALL'
  name_ro      TEXT NOT NULL,
  name_en      TEXT NOT NULL,
  category     TEXT,                       -- TEAM / INDIVIDUAL / RACQUET / etc.
  icon         TEXT,                       -- emoji or SVG name
  is_active    INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 100,
  config_json  TEXT,                       -- JSON: scoring rules, timing, etc.
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SPORT AGE GROUPS (configurable per sport)
-- ============================================================
CREATE TABLE IF NOT EXISTS sport_age_groups (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  sport_code    TEXT NOT NULL REFERENCES sports(code) ON DELETE CASCADE,
  code          TEXT NOT NULL,              -- e.g. 'U8', 'U10', 'CADETI', 'JUNIORI'
  name          TEXT NOT NULL,
  min_age       INTEGER,
  max_age       INTEGER,
  gender        TEXT CHECK (gender IN ('M','F','MIXED')),
  display_order INTEGER DEFAULT 100,
  UNIQUE(sport_code, code, gender)
);

-- ============================================================
-- SPORT POSITIONS (field positions per sport)
-- ============================================================
CREATE TABLE IF NOT EXISTS sport_positions (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  sport_code    TEXT NOT NULL REFERENCES sports(code) ON DELETE CASCADE,
  code          TEXT NOT NULL,              -- e.g. 'PITCHER', 'CATCHER', 'PILIER'
  name_ro       TEXT NOT NULL,
  name_en       TEXT,
  abbreviation  TEXT,                       -- 'P', 'C', '1B'
  display_order INTEGER DEFAULT 100,
  UNIQUE(sport_code, code)
);

-- ============================================================
-- SPORT EVENT TYPES (match events / scoring actions)
-- ============================================================
CREATE TABLE IF NOT EXISTS sport_event_types (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  sport_code    TEXT NOT NULL REFERENCES sports(code) ON DELETE CASCADE,
  code          TEXT NOT NULL,              -- 'TRY', 'HOME_RUN', 'GOAL'
  name_ro       TEXT NOT NULL,
  default_points INTEGER DEFAULT 0,
  is_scoring    INTEGER DEFAULT 1,
  is_discipline INTEGER DEFAULT 0,          -- yellow/red card type events
  display_order INTEGER DEFAULT 100,
  UNIQUE(sport_code, code)
);

-- ============================================================
-- SPORT EVALUATION ATTRIBUTES (coach rating dimensions)
-- ============================================================
CREATE TABLE IF NOT EXISTS sport_evaluation_attributes (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  sport_code    TEXT NOT NULL REFERENCES sports(code) ON DELETE CASCADE,
  code          TEXT NOT NULL,              -- 'SPEED', 'BATTING', 'TACKLING'
  name_ro       TEXT NOT NULL,
  category      TEXT,                       -- 'PHYSICAL', 'TECHNICAL', 'TACTICAL', 'MENTAL'
  scale_min     INTEGER DEFAULT 1,
  scale_max     INTEGER DEFAULT 5,
  display_order INTEGER DEFAULT 100,
  UNIQUE(sport_code, code)
);

-- ============================================================
-- SPORT DRILL CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS sport_drill_categories (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  sport_code    TEXT NOT NULL REFERENCES sports(code) ON DELETE CASCADE,
  code          TEXT NOT NULL,
  name_ro       TEXT NOT NULL,
  display_order INTEGER DEFAULT 100,
  UNIQUE(sport_code, code)
);

-- ============================================================
-- CLUBS (multi-tenant root) — now tied to a sport
-- ============================================================
CREATE TABLE IF NOT EXISTS clubs (
  id              TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  sport_code      TEXT NOT NULL REFERENCES sports(code),
  name            TEXT NOT NULL,
  city            TEXT,
  logo_url        TEXT,
  website         TEXT,
  email           TEXT,
  phone           TEXT,
  address         TEXT,
  is_active       INTEGER DEFAULT 1,
  primary_color   TEXT DEFAULT '#0F4C81',
  secondary_color TEXT DEFAULT '#F4B400',
  sidebar_color   TEXT DEFAULT '#0A1929',
  accent_color    TEXT DEFAULT '#34A853',
  club_motto      TEXT,
  founded_year    INTEGER,
  facebook_url    TEXT,
  instagram_url   TEXT,
  stamp_url       TEXT,
  association_id  TEXT,                   -- FK set below after associations table exists
  created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_clubs_sport ON clubs(sport_code);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id       TEXT REFERENCES clubs(id) ON DELETE CASCADE,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('SUPERADMIN','ADMIN','COACH','PLAYER','PARENT','VIEWER')),
  first_name    TEXT,
  last_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  is_active     INTEGER DEFAULT 1,
  last_login_at TEXT,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_club ON users(club_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used       INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TEAMS (flexible age_group — validated at app layer against sport_age_groups)
-- ============================================================
CREATE TABLE IF NOT EXISTS teams (
  id           TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id      TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  age_group    TEXT NOT NULL,               -- e.g. 'U8', 'CADETI', 'OPEN' — resolved via sport_age_groups
  coach_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  season       TEXT,
  is_active              INTEGER DEFAULT 1,
  description            TEXT,
  logo_url               TEXT,
  jersey_color_primary   TEXT DEFAULT '#0F4C81',
  jersey_color_secondary TEXT DEFAULT '#FFFFFF',
  short_name             TEXT,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_teams_club ON teams(club_id);
CREATE INDEX IF NOT EXISTS idx_teams_coach ON teams(coach_id);

-- ============================================================
-- PLAYERS
-- ============================================================
CREATE TABLE IF NOT EXISTS players (
  id                TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id           TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id           TEXT REFERENCES users(id) ON DELETE SET NULL,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  birth_date        TEXT NOT NULL,
  gender            TEXT CHECK (gender IN ('M','F')),
  position          TEXT,                      -- resolved via sport_positions.code
  jersey_number     INTEGER,
  status            TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE','INJURED','SUSPENDED','TRANSFERRED')),
  license_number    TEXT,
  federation_id     TEXT,
  photo_url         TEXT,
  address           TEXT,
  parent_name       TEXT,
  parent_email      TEXT,
  parent_phone      TEXT,
  player_email      TEXT,
  player_phone      TEXT,
  player_whatsapp   TEXT,
  guardian2_name    TEXT,
  guardian2_email   TEXT,
  guardian2_phone   TEXT,
  emergency_contact TEXT,
  emergency_phone   TEXT,
  notes             TEXT,
  joined_club_at    TEXT,
  created_at        TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at        TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_players_club ON players(club_id);
CREATE INDEX IF NOT EXISTS idx_players_status ON players(status);

CREATE TABLE IF NOT EXISTS team_players (
  team_id   TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season    TEXT NOT NULL,
  joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
  left_at   TEXT,
  PRIMARY KEY (team_id, player_id, season)
);

CREATE TABLE IF NOT EXISTS player_parents (
  id             TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id      TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  parent_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  club_id        TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  relation       TEXT,
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, parent_user_id)
);
