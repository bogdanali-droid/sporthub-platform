-- ============================================================
-- Migrare 008: Superadmin portal — user cu acces la toate modulele
-- Email: admin@sporthub.ro / parola: Sport##1234
-- ============================================================

INSERT OR REPLACE INTO users (id, club_id, email, password_hash, role, first_name, last_name, is_active)
VALUES (
  'superadmin-000-0000-0000-000000000001',
  'demo-club-0000-0000-0000-000000000001',
  'admin@sporthub.ro',
  'pbkdf2:3a7f129e4bc50188d26af3449c71e82d:c1d211d6a5494f165c123a109b129d03fb03b61058d8a3dab18e37ae12e386b1',
  'SUPERADMIN',
  'Admin',
  'SportHub',
  1
);
