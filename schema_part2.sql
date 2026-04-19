-- ============================================================
-- SportHub — Schema Part 2: Operational Tables
-- Append to schema.sql (sau ruleaza dupa Part 1)
-- ============================================================

-- ============================================================
-- TRAININGS
-- ============================================================
CREATE TABLE IF NOT EXISTS trainings (
  id         TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id    TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  team_id    TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  coach_id   TEXT REFERENCES users(id) ON DELETE SET NULL,
  title      TEXT NOT NULL,
  location   TEXT,
  start_time TEXT NOT NULL,
  end_time   TEXT,
  notes      TEXT,
  status     TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED','COMPLETED','CANCELLED')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_trainings_club ON trainings(club_id);
CREATE INDEX IF NOT EXISTS idx_trainings_team ON trainings(team_id);
CREATE INDEX IF NOT EXISTS idx_trainings_date ON trainings(start_time);

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  training_id TEXT NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  player_id   TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  status      TEXT NOT NULL CHECK (status IN ('PRESENT','ABSENT','INJURED','EXCUSED')),
  notes       TEXT,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at  TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(training_id, player_id)
);
CREATE INDEX IF NOT EXISTS idx_attendance_tr ON attendance(training_id);
CREATE INDEX IF NOT EXISTS idx_attendance_pl ON attendance(player_id);

-- ============================================================
-- CHECKIN TOKENS (QR-based, no player login)
-- ============================================================
CREATE TABLE IF NOT EXISTS checkin_tokens (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  training_id TEXT NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  club_id     TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE DEFAULT (hex(randomblob(16))),
  expires_at  TEXT NOT NULL,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(training_id)
);
CREATE INDEX IF NOT EXISTS idx_checkin_token ON checkin_tokens(token);

-- ============================================================
-- ATTENDANCE TOKENS (parent one-click response)
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance_tokens (
  id                TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  training_id       TEXT NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  player_id         TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id           TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  token             TEXT NOT NULL UNIQUE DEFAULT (hex(randomblob(32))),
  reminder_sent_24h INTEGER DEFAULT 0,
  reminder_sent_12h INTEGER DEFAULT 0,
  reminder_sent_6h  INTEGER DEFAULT 0,
  responded_at      TEXT,
  response_status   TEXT CHECK (response_status IN ('PRESENT','ABSENT','INJURED','EXCUSED')),
  created_at        TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(training_id, player_id)
);
CREATE INDEX IF NOT EXISTS idx_att_tokens_token ON attendance_tokens(token);
CREATE INDEX IF NOT EXISTS idx_att_tokens_training ON attendance_tokens(training_id);

-- ============================================================
-- MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS matches (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id       TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  team_id       TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  opponent_name TEXT NOT NULL,
  match_date    TEXT NOT NULL,
  location      TEXT,
  is_home       INTEGER DEFAULT 1,
  competition   TEXT,
  score_home    INTEGER,
  score_away    INTEGER,
  -- period_data: JSON with sport-specific period scores (innings, sets, quarters)
  period_data   TEXT,
  status        TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED','LIVE','FINISHED','CANCELLED')),
  notes         TEXT,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_matches_club ON matches(club_id);
CREATE INDEX IF NOT EXISTS idx_matches_team ON matches(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);

-- ============================================================
-- MATCH EVENTS (live scoring — event_type resolved via sport_event_types)
-- ============================================================
CREATE TABLE IF NOT EXISTS match_events (
  id           TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  match_id     TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  club_id      TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  period       INTEGER,           -- inning (baseball), set (volei), quarter (baschet), half (fotbal)
  minute       INTEGER,           -- for time-based sports
  event_type   TEXT NOT NULL,     -- e.g. TRY, GOAL, HOME_RUN, STRIKEOUT — per sport
  team         TEXT NOT NULL CHECK (team IN ('HOME','AWAY')),
  player_id    TEXT REFERENCES players(id),
  player_name  TEXT,
  points       INTEGER DEFAULT 0,
  description  TEXT,
  created_by   TEXT REFERENCES users(id),
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_match_events_match ON match_events(match_id);

-- ============================================================
-- MATCH SELECTIONS (convocări / squad)
-- ============================================================
CREATE TABLE IF NOT EXISTS match_selections (
  id              TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  match_id        TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id       TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  role            TEXT,
  position_played TEXT,
  stat_data       TEXT,    -- JSON: sport-specific stats (minutes, goals, innings pitched, etc.)
  notes           TEXT,
  created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(match_id, player_id)
);

-- ============================================================
-- MATCH AVAILABILITY
-- ============================================================
CREATE TABLE IF NOT EXISTS match_availability (
  id           TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  match_id     TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id    TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id      TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  token        TEXT NOT NULL UNIQUE DEFAULT (hex(randomblob(32))),
  response     TEXT CHECK (response IN ('AVAILABLE','UNAVAILABLE','MAYBE')),
  notified_at  TEXT,
  responded_at TEXT,
  notes        TEXT,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(match_id, player_id)
);
CREATE INDEX IF NOT EXISTS idx_match_avail_token ON match_availability(token);
CREATE INDEX IF NOT EXISTS idx_match_avail_match ON match_availability(match_id);

-- ============================================================
-- MEDICAL VISITS
-- ============================================================
CREATE TABLE IF NOT EXISTS medical_visits (
  id                  TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id           TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id             TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  visit_date          TEXT NOT NULL,
  valid_until         TEXT,
  height_cm           REAL,
  weight_kg           REAL,
  grip_strength_left  INTEGER,
  grip_strength_right INTEGER,
  blood_pressure      TEXT,
  heart_rate          INTEGER,
  doctor_name         TEXT,
  clinic_name         TEXT,
  document_url        TEXT,
  notes               TEXT,
  created_by          TEXT REFERENCES users(id),
  created_at          TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_medical_player ON medical_visits(player_id);
CREATE INDEX IF NOT EXISTS idx_medical_valid ON medical_visits(valid_until);

-- ============================================================
-- PHYSICAL TESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS physical_tests (
  id         TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id  TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id    TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  test_date  TEXT NOT NULL,
  height_cm  REAL,
  weight_kg  REAL,
  sprint_10m REAL,
  sprint_30m REAL,
  sprint_50m REAL,
  broad_jump REAL,
  push_ups   INTEGER,
  pull_ups   INTEGER,
  yo_yo_test REAL,
  -- extra_data: JSON for sport-specific tests
  extra_data TEXT,
  notes      TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_physical_player ON physical_tests(player_id);

-- ============================================================
-- PLAYER EVALUATIONS v2 (abstract key/value per sport attribute)
-- ============================================================
CREATE TABLE IF NOT EXISTS player_evaluations (
  id           TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id    TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id      TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  evaluated_by TEXT NOT NULL REFERENCES users(id),
  eval_date    TEXT NOT NULL,
  season       TEXT,
  overall_score REAL,
  notes        TEXT,
  is_shared    INTEGER DEFAULT 0,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player_evaluation_scores (
  id              TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  evaluation_id   TEXT NOT NULL REFERENCES player_evaluations(id) ON DELETE CASCADE,
  attribute_code  TEXT NOT NULL,    -- references sport_evaluation_attributes.code
  score           INTEGER NOT NULL,
  UNIQUE(evaluation_id, attribute_code)
);

CREATE INDEX IF NOT EXISTS idx_eval_player ON player_evaluations(player_id);
CREATE INDEX IF NOT EXISTS idx_eval_scores ON player_evaluation_scores(evaluation_id);

-- ============================================================
-- INJURIES
-- ============================================================
CREATE TABLE IF NOT EXISTS injuries (
  id              TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id       TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id         TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  injury_type     TEXT NOT NULL,
  body_part       TEXT,
  severity        TEXT CHECK (severity IN ('MINOR','MODERATE','SEVERE')),
  injury_date     TEXT NOT NULL,
  description     TEXT,
  rtp_stage       INTEGER DEFAULT 1,
  rtp_stage_date  TEXT,
  expected_return TEXT,
  actual_return   TEXT,
  cleared_by      TEXT,
  status          TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','RECOVERED','CHRONIC')),
  created_by      TEXT REFERENCES users(id),
  created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_injuries_player ON injuries(player_id);
CREATE INDEX IF NOT EXISTS idx_injuries_status ON injuries(status);

CREATE TABLE IF NOT EXISTS injury_notes (
  id         TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  injury_id  TEXT NOT NULL REFERENCES injuries(id) ON DELETE CASCADE,
  note       TEXT NOT NULL,
  rtp_stage  INTEGER,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id     TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  player_id   TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  amount      REAL NOT NULL,
  currency    TEXT DEFAULT 'RON',
  status      TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','PAID','OVERDUE','CANCELLED')),
  method      TEXT,
  reference   TEXT,
  description TEXT,
  due_date    TEXT,
  paid_at     TEXT,
  created_by  TEXT REFERENCES users(id),
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at  TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payments_club ON payments(club_id);
CREATE INDEX IF NOT EXISTS idx_payments_player ON payments(player_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================================
-- PLAYER DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS player_documents (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id   TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id     TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('MEDICAL_FORM','LICENSE','GDPR_CONSENT','PARENT_CONSENT','IDENTITY','CONTRACT','OTHER')),
  file_url    TEXT NOT NULL,
  file_name   TEXT NOT NULL,
  file_size   INTEGER,
  mime_type   TEXT,
  uploaded_by TEXT REFERENCES users(id),
  uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at  TEXT
);

-- ============================================================
-- GDPR CONSENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS gdpr_consents (
  id           TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  player_id    TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  club_id      TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  given_by     TEXT NOT NULL REFERENCES users(id),
  purpose      TEXT NOT NULL,
  accepted_at  TEXT DEFAULT CURRENT_TIMESTAMP,
  withdrawn_at TEXT,
  ip_address   TEXT,
  notes        TEXT
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id    TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT,
  type       TEXT DEFAULT 'INFO' CHECK (type IN ('INFO','WARNING','ALERT','TRAINING','PAYMENT','MEDICAL')),
  is_read    INTEGER DEFAULT 0,
  link       TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);

-- ============================================================
-- CALENDAR EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id           TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id      TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  team_id      TEXT REFERENCES teams(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('TRAINING','MATCH','ADMIN','MEDICAL','OTHER')),
  title        TEXT NOT NULL,
  description  TEXT,
  start_time   TEXT NOT NULL,
  end_time     TEXT,
  location     TEXT,
  reference_id TEXT,
  created_by   TEXT REFERENCES users(id),
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_calendar_club ON calendar_events(club_id);

-- ============================================================
-- FEDERATIONS & ASSOCIATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS federations (
  id         TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  sport_code TEXT NOT NULL REFERENCES sports(code),
  name       TEXT NOT NULL,
  country    TEXT DEFAULT 'RO',
  acronym    TEXT,
  website    TEXT,
  email      TEXT,
  logo_url   TEXT,
  is_active  INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS associations (
  id            TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  federation_id TEXT NOT NULL REFERENCES federations(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  acronym       TEXT,
  region        TEXT,
  email         TEXT,
  phone         TEXT,
  logo_url      TEXT,
  is_active     INTEGER DEFAULT 1,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- PLATFORM USERS (super admins, federation/association admins)
-- ============================================================
CREATE TABLE IF NOT EXISTS platform_users (
  id             TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  email          TEXT UNIQUE NOT NULL,
  password_hash  TEXT NOT NULL,
  role           TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN','FEDERATION_ADMIN','ASSOCIATION_ADMIN')),
  federation_id  TEXT REFERENCES federations(id) ON DELETE SET NULL,
  association_id TEXT REFERENCES associations(id) ON DELETE SET NULL,
  first_name     TEXT,
  last_name      TEXT,
  is_active      INTEGER DEFAULT 1,
  totp_enabled   INTEGER DEFAULT 0,
  totp_secret    TEXT,
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- FEDERATION COMPETITIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS federation_competitions (
  id             TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  federation_id  TEXT REFERENCES federations(id),
  association_id TEXT REFERENCES associations(id),
  sport_code     TEXT NOT NULL REFERENCES sports(code),
  name           TEXT NOT NULL,
  season         TEXT NOT NULL,
  age_group      TEXT,
  start_date     TEXT,
  end_date       TEXT,
  description    TEXT,
  is_active      INTEGER DEFAULT 1,
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competition_teams (
  id             TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  competition_id TEXT NOT NULL REFERENCES federation_competitions(id) ON DELETE CASCADE,
  club_id        TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  team_id        TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  points         INTEGER DEFAULT 0,
  matches_played INTEGER DEFAULT 0,
  wins           INTEGER DEFAULT 0,
  draws          INTEGER DEFAULT 0,
  losses         INTEGER DEFAULT 0,
  score_for      INTEGER DEFAULT 0,
  score_against  INTEGER DEFAULT 0,
  UNIQUE(competition_id, team_id)
);

CREATE TABLE IF NOT EXISTS competition_matches (
  id             TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  competition_id TEXT NOT NULL REFERENCES federation_competitions(id) ON DELETE CASCADE,
  home_team_id   TEXT NOT NULL REFERENCES teams(id),
  away_team_id   TEXT NOT NULL REFERENCES teams(id),
  home_club_id   TEXT NOT NULL REFERENCES clubs(id),
  away_club_id   TEXT NOT NULL REFERENCES clubs(id),
  match_date     TEXT NOT NULL,
  location       TEXT,
  score_home     INTEGER,
  score_away     INTEGER,
  period_data    TEXT,   -- JSON pentru innings/seturi/reprize
  status         TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED','LIVE','FINISHED','CANCELLED')),
  round          TEXT,
  reported_by    TEXT REFERENCES platform_users(id),
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- REGISTRATION FORMS (online inscrieri)
-- ============================================================
CREATE TABLE IF NOT EXISTS registration_forms (
  id                      TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id                 TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  slug                    TEXT NOT NULL UNIQUE,
  is_active               INTEGER DEFAULT 1,
  welcome_message         TEXT,
  require_medical_consent INTEGER DEFAULT 1,
  require_gdpr_consent    INTEGER DEFAULT 1,
  require_image_consent   INTEGER DEFAULT 0,
  available_teams         TEXT,
  min_age                 INTEGER,
  max_age                 INTEGER,
  deadline                TEXT,
  created_at              TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registration_submissions (
  id                TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  form_id           TEXT NOT NULL REFERENCES registration_forms(id) ON DELETE CASCADE,
  club_id           TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  birth_date        TEXT NOT NULL,
  gender            TEXT,
  parent_name       TEXT NOT NULL,
  parent_email      TEXT NOT NULL,
  parent_phone      TEXT,
  preferred_team_id TEXT REFERENCES teams(id),
  notes             TEXT,
  consent_medical   INTEGER DEFAULT 0,
  consent_gdpr      INTEGER DEFAULT 0,
  consent_image     INTEGER DEFAULT 0,
  signature_name    TEXT NOT NULL,
  signed_at         TEXT DEFAULT CURRENT_TIMESTAMP,
  ip_address        TEXT,
  status            TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','DUPLICATE')),
  player_id         TEXT REFERENCES players(id),
  reviewed_by       TEXT REFERENCES users(id),
  reviewed_at       TEXT,
  review_notes      TEXT,
  created_at        TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ANALYTICS (pre-aggregated)
-- ============================================================
CREATE TABLE IF NOT EXISTS player_attendance_stats (
  player_id       TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  club_id         TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  total_trainings INTEGER DEFAULT 0,
  present_count   INTEGER DEFAULT 0,
  absent_count    INTEGER DEFAULT 0,
  injured_count   INTEGER DEFAULT 0,
  excused_count   INTEGER DEFAULT 0,
  attendance_rate REAL,
  last_updated    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  club_id     TEXT NOT NULL,
  user_id     TEXT,
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  details     TEXT,
  ip_address  TEXT,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_log(resource);
