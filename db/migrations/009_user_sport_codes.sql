-- ============================================================
-- Migration 009: sport_codes per user + impersonated_club_id
-- Permite unui user să aibă acces la multiple sporturi
-- ============================================================

ALTER TABLE users ADD COLUMN sport_codes TEXT DEFAULT NULL;
-- JSON array: ["BASEBALL5","SOFTBALL"] sau NULL (fallback la club.sport_code)

ALTER TABLE users ADD COLUMN impersonated_club_id TEXT DEFAULT NULL;
-- Club selectat temporar de federation admin în modul club

-- Superadmin cu acces la ambele sporturi
INSERT OR REPLACE INTO users (id, email, password_hash, role, first_name, last_name, sport_codes, is_active)
VALUES (
  'superadmin-002-0000-0000-000000000001',
  'superadmin@sporthub.ro',
  'pbkdf2:3a7f129e4bc50188d26af3449c71e82d:c1d211d6a5494f165c123a109b129d03fb03b61058d8a3dab18e37ae12e386b1',
  'SUPERADMIN', 'Super', 'Admin',
  '["BASEBALL5","SOFTBALL"]',
  1
);

-- Actualizăm și admin@sporthub.ro cu sport_codes
UPDATE users SET sport_codes = '["BASEBALL5","SOFTBALL"]'
WHERE email = 'admin@sporthub.ro';

-- Demo admin cu ambele sporturi
UPDATE users SET sport_codes = '["BASEBALL5","SOFTBALL"]'
WHERE email = 'bogdanaliciuc@gmail.com';
