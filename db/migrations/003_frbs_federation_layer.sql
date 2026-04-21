-- ============================================================
-- Migration 003: FRBS Federation Layer
-- Player legitimations, transfers, federation requests,
-- competitions, arbitri, match reports, national teams
-- ============================================================

-- ============================================================
-- PLAYER LEGITIMATIONS (Registrul CCLTC)
-- ============================================================
CREATE TABLE IF NOT EXISTS player_legitimations (
  id                TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id         TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id           TEXT NOT NULL REFERENCES clubs(id),
  federation_id     TEXT NOT NULL DEFAULT 'frbs',
  license_number    TEXT UNIQUE,
  sport_code        TEXT NOT NULL REFERENCES sports(code),
  age_group         TEXT,
  registration_type TEXT NOT NULL DEFAULT 'INITIAL'
                    CHECK (registration_type IN ('INITIAL','RENEWAL','TRANSFER','RETURN','DUBLA')),
  status            TEXT NOT NULL DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE','PENDING','SUSPENDED','EXPIRED','CANCELLED')),
  valid_from        TEXT NOT NULL DEFAULT (date('now')),
  valid_until       TEXT,
  issued_by         TEXT REFERENCES platform_users(id),
  issued_at         TEXT DEFAULT CURRENT_TIMESTAMP,
  notes             TEXT,
  created_at        TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_leg_player  ON player_legitimations(player_id, status);
CREATE INDEX IF NOT EXISTS idx_leg_license ON player_legitimations(license_number);
CREATE INDEX IF NOT EXISTS idx_leg_club    ON player_legitimations(club_id, sport_code);

-- ============================================================
-- PLAYER TRANSFERS
-- ============================================================
CREATE TABLE IF NOT EXISTS player_transfers (
  id               TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id        TEXT NOT NULL REFERENCES players(id),
  from_club_id     TEXT REFERENCES clubs(id),
  to_club_id       TEXT NOT NULL REFERENCES clubs(id),
  from_assoc_id    TEXT REFERENCES associations(id),
  to_assoc_id      TEXT REFERENCES associations(id),
  sport_code       TEXT NOT NULL REFERENCES sports(code),
  transfer_date    TEXT,
  transfer_type    TEXT NOT NULL DEFAULT 'PERMANENT'
                   CHECK (transfer_type IN ('PERMANENT','LOAN','LOAN_RETURN')),
  loan_end_date    TEXT,
  transfer_window  TEXT CHECK (transfer_window IN ('JAN','JUN_AUG')),
  season           TEXT,
  status           TEXT NOT NULL DEFAULT 'PENDING'
                   CHECK (status IN ('PENDING','APPROVED','REJECTED','CANCELLED','RETURNED')),
  approved_by      TEXT REFERENCES platform_users(id),
  approved_at      TEXT,
  notes            TEXT,
  created_at       TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_transfers_player ON player_transfers(player_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON player_transfers(status, sport_code);

-- ============================================================
-- DUBLA LEGITIMARE
-- ============================================================
CREATE TABLE IF NOT EXISTS player_dubla_legitimare (
  id                TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id         TEXT NOT NULL REFERENCES players(id),
  primary_club_id   TEXT NOT NULL REFERENCES clubs(id),
  secondary_club_id TEXT NOT NULL REFERENCES clubs(id),
  primary_sport     TEXT NOT NULL REFERENCES sports(code),
  secondary_sport   TEXT NOT NULL REFERENCES sports(code),
  status            TEXT NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING','APPROVED','REJECTED','REVOKED')),
  approved_by       TEXT REFERENCES platform_users(id),
  valid_from        TEXT,
  valid_until       TEXT,
  notes             TEXT,
  created_at        TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, secondary_club_id, secondary_sport)
);

-- ============================================================
-- FEDERATION REQUESTS (Cereri cluburi → CCLTC)
-- ============================================================
CREATE TABLE IF NOT EXISTS federation_requests (
  id             TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id        TEXT NOT NULL REFERENCES clubs(id),
  player_id      TEXT REFERENCES players(id),
  sport_code     TEXT REFERENCES sports(code),
  request_type   TEXT NOT NULL
                 CHECK (request_type IN (
                   'LEGITIMARE','TRANSFER','DEZLEGARE',
                   'DUBLA_LEGITIMARE','SUSPENDARE',
                   'CONTESTATIE','MODIFICARE_DATE','ALTELE'
                 )),
  subject        TEXT NOT NULL,
  description    TEXT,
  attachments    TEXT DEFAULT '[]',
  status         TEXT NOT NULL DEFAULT 'PENDING'
                 CHECK (status IN ('PENDING','IN_REVIEW','APPROVED','REJECTED','INFO_NEEDED')),
  priority       TEXT NOT NULL DEFAULT 'NORMAL'
                 CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT')),
  assigned_to    TEXT REFERENCES platform_users(id),
  response_notes TEXT,
  resolved_at    TEXT,
  created_by     TEXT NOT NULL REFERENCES users(id),
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at     TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_freq_club   ON federation_requests(club_id, status);
CREATE INDEX IF NOT EXISTS idx_freq_player ON federation_requests(player_id);
CREATE INDEX IF NOT EXISTS idx_freq_type   ON federation_requests(request_type, status);

-- ============================================================
-- FEDERATION REQUEST MESSAGES (thread club ↔ CCLTC)
-- ============================================================
CREATE TABLE IF NOT EXISTS federation_request_messages (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  request_id  TEXT NOT NULL REFERENCES federation_requests(id) ON DELETE CASCADE,
  sender_id   TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('CLUB','FEDERATION')),
  message     TEXT NOT NULL,
  attachments TEXT DEFAULT '[]',
  is_internal INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_freq_msg_req ON federation_request_messages(request_id, created_at);

-- ============================================================
-- COMPETITION GROUPS (grupe round-robin)
-- ============================================================
CREATE TABLE IF NOT EXISTS competition_groups (
  id             TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  competition_id TEXT NOT NULL REFERENCES federation_competitions(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  display_order  INTEGER DEFAULT 1,
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competition_group_teams (
  group_id     TEXT NOT NULL REFERENCES competition_groups(id) ON DELETE CASCADE,
  team_id      TEXT NOT NULL REFERENCES teams(id),
  club_id      TEXT NOT NULL REFERENCES clubs(id),
  points       INTEGER DEFAULT 0,
  wins         INTEGER DEFAULT 0,
  losses       INTEGER DEFAULT 0,
  runs_for     INTEGER DEFAULT 0,
  runs_against INTEGER DEFAULT 0,
  PRIMARY KEY (group_id, team_id)
);

-- ============================================================
-- ARBITRI (Registrul arbitrilor FRBS)
-- ============================================================
CREATE TABLE IF NOT EXISTS arbitri (
  id                  TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  federation_id       TEXT NOT NULL DEFAULT 'frbs',
  first_name          TEXT NOT NULL,
  last_name           TEXT NOT NULL,
  email               TEXT,
  phone               TEXT,
  city                TEXT,
  grade               TEXT CHECK (grade IN ('NATIONAL','REGIONAL','LOCAL','CANDIDATE')),
  sport_codes         TEXT DEFAULT '[]',
  license_number      TEXT,
  license_valid_until TEXT,
  is_active           INTEGER DEFAULT 1,
  notes               TEXT,
  created_at          TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_arbitri_grade ON arbitri(grade, is_active);

-- ============================================================
-- MATCH ARBITERS (delegare arbitri la meciuri)
-- ============================================================
CREATE TABLE IF NOT EXISTS match_arbiters (
  id         TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  match_id   TEXT NOT NULL REFERENCES competition_matches(id) ON DELETE CASCADE,
  arbiter_id TEXT NOT NULL REFERENCES arbitri(id),
  role       TEXT NOT NULL CHECK (role IN ('PLATE','BASE_1','BASE_2','BASE_3','FIELD')),
  confirmed  INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(match_id, arbiter_id)
);

-- ============================================================
-- MATCH REPORTS (Formular Joc Competiții)
-- ============================================================
CREATE TABLE IF NOT EXISTS match_reports (
  id                   TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  competition_match_id TEXT NOT NULL REFERENCES competition_matches(id),
  club_id              TEXT REFERENCES clubs(id),
  sport_code           TEXT NOT NULL REFERENCES sports(code),
  innings_data         TEXT DEFAULT '[]',
  home_lineup          TEXT DEFAULT '[]',
  away_lineup          TEXT DEFAULT '[]',
  home_stats           TEXT DEFAULT '{}',
  away_stats           TEXT DEFAULT '{}',
  notes                TEXT,
  submitted_by         TEXT REFERENCES users(id),
  submitted_at         TEXT,
  approved_by          TEXT REFERENCES platform_users(id),
  approved_at          TEXT,
  status               TEXT DEFAULT 'DRAFT'
                       CHECK (status IN ('DRAFT','SUBMITTED','APPROVED','REJECTED')),
  created_at           TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- NATIONAL TEAMS (Loturi naționale)
-- ============================================================
CREATE TABLE IF NOT EXISTS national_teams (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  federation_id TEXT NOT NULL DEFAULT 'frbs',
  sport_code    TEXT NOT NULL REFERENCES sports(code),
  name          TEXT NOT NULL,
  age_group     TEXT,
  gender        TEXT CHECK (gender IN ('M','F','MIXED')),
  season        TEXT,
  coach_name    TEXT,
  is_active     INTEGER DEFAULT 1,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS national_team_players (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  team_id       TEXT NOT NULL REFERENCES national_teams(id) ON DELETE CASCADE,
  player_id     TEXT NOT NULL REFERENCES players(id),
  club_id       TEXT NOT NULL REFERENCES clubs(id),
  position      TEXT,
  jersey_number INTEGER,
  status        TEXT DEFAULT 'ACTIVE'
                CHECK (status IN ('ACTIVE','RESERVE','INACTIVE')),
  selected_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, player_id)
);

-- ============================================================
-- FEDERATION ANNOUNCEMENTS (Circulare oficiale)
-- ============================================================
CREATE TABLE IF NOT EXISTS federation_announcements (
  id             TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  federation_id  TEXT NOT NULL DEFAULT 'frbs',
  association_id TEXT REFERENCES associations(id),
  title          TEXT NOT NULL,
  content        TEXT NOT NULL,
  type           TEXT NOT NULL DEFAULT 'INFO'
                 CHECK (type IN ('INFO','URGENT','REGULAMENT','CALENDAR','LEGITIMARI','ALTELE')),
  target         TEXT NOT NULL DEFAULT 'ALL'
                 CHECK (target IN ('ALL','CLUBS','ASSOCIATIONS','PLAYERS')),
  is_published   INTEGER NOT NULL DEFAULT 1,
  published_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at     TEXT,
  created_by     TEXT REFERENCES platform_users(id),
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ann_fed ON federation_announcements(federation_id, is_published);

-- ============================================================
-- DRILLS (Biblioteca de exerciții)
-- ============================================================
CREATE TABLE IF NOT EXISTS drills (
  id           TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id      TEXT REFERENCES clubs(id),
  sport_code   TEXT REFERENCES sports(code),
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT,
  difficulty   TEXT CHECK (difficulty IN ('BEGINNER','INTERMEDIATE','ADVANCED')),
  age_group    TEXT,
  duration_min INTEGER,
  players_min  INTEGER,
  players_max  INTEGER,
  diagram_url  TEXT,
  video_url    TEXT,
  tags         TEXT,
  is_public    INTEGER DEFAULT 0,
  created_by   TEXT REFERENCES users(id),
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_drills_club     ON drills(club_id, sport_code);
CREATE INDEX IF NOT EXISTS idx_drills_category ON drills(category);

-- ============================================================
-- ALTER EXISTING TABLES
-- ============================================================

-- players: adaugă legitimation_status
ALTER TABLE players ADD COLUMN legitimation_status TEXT NOT NULL DEFAULT 'NELEGITIMAT'
  CHECK (legitimation_status IN ('NELEGITIMAT','PENDING','LEGITIMAT','SUSPENDAT','EXPIRAT'));

-- federation_competitions: adaugă format și innings_count
ALTER TABLE federation_competitions ADD COLUMN format TEXT DEFAULT 'LEAGUE'
  CHECK (format IN ('LEAGUE','CUP','GROUPS_KNOCKOUT','ROUND_ROBIN'));
ALTER TABLE federation_competitions ADD COLUMN innings_count INTEGER DEFAULT 5;
