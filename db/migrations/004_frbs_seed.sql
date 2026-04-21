-- ============================================================
-- Migration 004: FRBS Seed Data
-- Federație, platform users CCLTC, asociații județene active
-- ============================================================

-- ============================================================
-- FRBS FEDERATION (multi-sport: Baseball5 + Softball)
-- Folosim un singur rând per sport_code (limitare schemă actuală)
-- ============================================================
INSERT OR IGNORE INTO federations (id, sport_code, name, country, acronym, website, email, is_active)
VALUES
  ('frbs-b5',   'BASEBALL5', 'Federația Română de Baseball și Softball', 'RO', 'FRBS', 'https://baseball-softball.ro', 'federatie@baseball-softball.ro', 1),
  ('frbs-sft',  'SOFTBALL',  'Federația Română de Baseball și Softball', 'RO', 'FRBS', 'https://baseball-softball.ro', 'federatie@baseball-softball.ro', 1);

-- ============================================================
-- PLATFORM USERS — CCLTC & Administrație FRBS
-- Parole: hash-uri placeholder (trebuie resetate la prima logare)
-- Format: pbkdf2:{salt}:{hash} generat cu hashPassword()
-- IMPORTANT: Actualizați parolele înainte de producție!
-- ============================================================
INSERT OR IGNORE INTO platform_users (id, email, password_hash, role, first_name, last_name, federation_id, is_active)
VALUES
  ('frbs-ccltc-001',  'ccltc@baseball-softball.ro',   'pbkdf2:PLACEHOLDER_CHANGE_ME', 'FEDERATION_ADMIN', 'CCLTC',    'FRBS',      'frbs-b5', 1),
  ('frbs-admin-001',  'admin@baseball-softball.ro',   'pbkdf2:PLACEHOLDER_CHANGE_ME', 'FEDERATION_ADMIN', 'Admin',    'FRBS',      'frbs-b5', 1),
  ('frbs-super-001',  'superadmin@baseball-softball.ro', 'pbkdf2:PLACEHOLDER_CHANGE_ME', 'SUPER_ADMIN', 'Super', 'Admin', 'frbs-b5', 1);

-- ============================================================
-- ASOCIAȚII JUDEȚENE ACTIVE (cele cu activitate documentată)
-- ============================================================
INSERT OR IGNORE INTO associations (id, federation_id, name, acronym, region, is_active)
VALUES
  ('aj-bucuresti',  'frbs-b5', 'Asociația Județeană București',      'AJB-BS',  'Muntenia',    1),
  ('aj-ilfov',      'frbs-b5', 'Asociația Județeană Ilfov',          'AJB-IF',  'Muntenia',    1),
  ('aj-cluj',       'frbs-b5', 'Asociația Județeană Cluj',           'AJCJ',    'Transilvania', 1),
  ('aj-iasi',       'frbs-b5', 'Asociația Județeană Iași',           'AJIS',    'Moldova',     1),
  ('aj-botosani',   'frbs-b5', 'Asociația Județeană Botoșani',       'AJBT',    'Moldova',     1),
  ('aj-suceava',    'frbs-b5', 'Asociația Județeană Suceava',        'AJSV',    'Moldova',     1),
  ('aj-neamt',      'frbs-b5', 'Asociația Județeană Neamț',          'AJNT',    'Moldova',     1),
  ('aj-brasov',     'frbs-b5', 'Asociația Județeană Brașov',         'AJBV',    'Transilvania', 1),
  ('aj-calarasi',   'frbs-b5', 'Asociația Județeană Călărași',       'AJCL',    'Muntenia',    1),
  ('aj-teleorman',  'frbs-b5', 'Asociația Județeană Teleorman',      'AJTR',    'Muntenia',    1),
  ('aj-roman',      'frbs-b5', 'Asociația Județeană Roman (Neamț)',  'AJRM',    'Moldova',     1),
  ('aj-timis',      'frbs-b5', 'Asociația Județeană Timiș',          'AJTM',    'Banat',       1),
  ('aj-constanta',  'frbs-b5', 'Asociația Județeană Constanța',      'AJCT',    'Dobrogea',    1),
  ('aj-dolj',       'frbs-b5', 'Asociația Județeană Dolj',           'AJDJ',    'Oltenia',     1),
  ('aj-prahova',    'frbs-b5', 'Asociația Județeană Prahova',        'AJPH',    'Muntenia',    1);

-- Asociații adăugate și pentru softball (aceleași județe, altă federație FK)
INSERT OR IGNORE INTO associations (id, federation_id, name, acronym, region, is_active)
VALUES
  ('aj-bucuresti-sft',  'frbs-sft', 'Asociația Județeană București (Softball)',  'AJB-SFT',  'Muntenia',    1),
  ('aj-cluj-sft',       'frbs-sft', 'Asociația Județeană Cluj (Softball)',        'AJCJ-SFT', 'Transilvania', 1),
  ('aj-brasov-sft',     'frbs-sft', 'Asociația Județeană Brașov (Softball)',      'AJBV-SFT', 'Transilvania', 1);

-- ============================================================
-- ANNOUNCEMENT DE BINE-VENIT
-- ============================================================
INSERT OR IGNORE INTO federation_announcements (id, federation_id, title, content, type, target, is_published)
VALUES (
  'ann-welcome-001',
  'frbs-b5',
  'Bun venit pe platforma digitală FRBS!',
  'Federația Română de Baseball și Softball lansează platforma digitală oficială pentru gestionarea activității sportive. Cluburile afiliate pot accesa portalul pentru legitimări, transferuri și înscrieri la competiții.',
  'INFO',
  'ALL',
  1
);

-- ============================================================
-- COMPETIȚII SEZON 2025 (structura de bază)
-- ============================================================
INSERT OR IGNORE INTO federation_competitions (id, federation_id, sport_code, name, season, age_group, is_active, format, innings_count)
VALUES
  ('comp-b5-cn-sen-2025',  'frbs-b5',  'BASEBALL5', 'Campionat Național Baseball5 Seniori',    '2025', 'OPEN',   1, 'ROUND_ROBIN', 5),
  ('comp-b5-cn-u18-2025',  'frbs-b5',  'BASEBALL5', 'Campionat Național Baseball5 U18',        '2025', 'U18',    1, 'GROUPS_KNOCKOUT', 5),
  ('comp-b5-cn-u15-2025',  'frbs-b5',  'BASEBALL5', 'Campionat Național Baseball5 U15',        '2025', 'U15',    1, 'GROUPS_KNOCKOUT', 5),
  ('comp-b5-cn-u12-2025',  'frbs-b5',  'BASEBALL5', 'Campionat Național Baseball5 U12',        '2025', 'U12',    1, 'GROUPS_KNOCKOUT', 5),
  ('comp-sft-cn-sen-2025', 'frbs-sft', 'SOFTBALL',  'Campionat Național Softball Seniori',     '2025', 'OPEN',   1, 'ROUND_ROBIN', 7),
  ('comp-sft-cn-sf-2025',  'frbs-sft', 'SOFTBALL',  'Campionat Național Softball Senior Feminin', '2025', 'SENIOR_F', 1, 'ROUND_ROBIN', 7);
