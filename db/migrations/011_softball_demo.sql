-- ============================================================
-- Migration 011: Softball demo club + players + teams
-- Also: link Baseball5 players to teams (missing from 010)
-- ============================================================

-- BASEBALL5: link players to teams (10 first → Seniori, last 5 → U15)
INSERT OR REPLACE INTO team_players (team_id, player_id, season)
VALUES
  ('demo-team-s01', 'demo-p01', '2025-2026'),
  ('demo-team-s01', 'demo-p02', '2025-2026'),
  ('demo-team-s01', 'demo-p03', '2025-2026'),
  ('demo-team-s01', 'demo-p04', '2025-2026'),
  ('demo-team-s01', 'demo-p05', '2025-2026'),
  ('demo-team-s01', 'demo-p06', '2025-2026'),
  ('demo-team-s01', 'demo-p07', '2025-2026'),
  ('demo-team-s01', 'demo-p08', '2025-2026'),
  ('demo-team-s01', 'demo-p09', '2025-2026'),
  ('demo-team-s01', 'demo-p10', '2025-2026'),
  ('demo-team-u15', 'demo-p11', '2025-2026'),
  ('demo-team-u15', 'demo-p12', '2025-2026'),
  ('demo-team-u15', 'demo-p13', '2025-2026'),
  ('demo-team-u15', 'demo-p14', '2025-2026'),
  ('demo-team-u15', 'demo-p15', '2025-2026');

-- SOFTBALL CLUB
INSERT OR REPLACE INTO clubs (id, name, sport_code, city, email, phone, is_active)
VALUES (
  'demo-club-softball-0000-0000-000000000001',
  'Club Demo Softball', 'SOFTBALL', 'Cluj-Napoca',
  'softball@clubdemo.ro', '0700000001', 1
);

-- SOFTBALL TEAMS
INSERT OR REPLACE INTO teams (id, club_id, name, age_group, is_active)
VALUES
  ('demo-team-sb-s', 'demo-club-softball-0000-0000-000000000001', 'Seniori Softball', 'SENIORI', 1),
  ('demo-team-sb-u15', 'demo-club-softball-0000-0000-000000000001', 'U15 Softball', 'U15', 1);

-- SOFTBALL PLAYERS (12)
INSERT OR REPLACE INTO players (id, club_id, first_name, last_name, birth_date, position, jersey_number, status, legitimation_status)
VALUES
  ('demo-sb-p01','demo-club-softball-0000-0000-000000000001','Maria','Popescu','2000-04-12','PITCHER',1,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p02','demo-club-softball-0000-0000-000000000001','Ana','Ionescu','1999-06-18','CATCHER',2,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p03','demo-club-softball-0000-0000-000000000001','Elena','Marinescu','2001-09-25','FIRST_BASE',3,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p04','demo-club-softball-0000-0000-000000000001','Diana','Radu','2000-02-08','SECOND_BASE',4,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p05','demo-club-softball-0000-0000-000000000001','Cristina','Stan','1998-11-30','THIRD_BASE',5,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p06','demo-club-softball-0000-0000-000000000001','Andreea','Dumitru','2001-07-14','SHORTSTOP',6,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p07','demo-club-softball-0000-0000-000000000001','Roxana','Munteanu','2002-03-22','LEFT_FIELD',7,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p08','demo-club-softball-0000-0000-000000000001','Bianca','Niculescu','2000-12-05','CENTER_FIELD',8,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p09','demo-club-softball-0000-0000-000000000001','Alexandra','Popa','1999-05-19','RIGHT_FIELD',9,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p10','demo-club-softball-0000-0000-000000000001','Mihaela','Barbu','2008-08-11','PITCHER',10,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p11','demo-club-softball-0000-0000-000000000001','Ioana','Nistor','2009-01-24','CATCHER',11,'ACTIVE','LEGITIMAT'),
  ('demo-sb-p12','demo-club-softball-0000-0000-000000000001','Larisa','Luca','2010-10-03','FIRST_BASE',12,'ACTIVE','NELEGITIMAT');

-- LINK PLAYERS TO TEAMS (Seniori = first 9, U15 = last 3) - season required
INSERT OR REPLACE INTO team_players (team_id, player_id, season)
VALUES
  ('demo-team-sb-s', 'demo-sb-p01', '2025-2026'),
  ('demo-team-sb-s', 'demo-sb-p02', '2025-2026'),
  ('demo-team-sb-s', 'demo-sb-p03', '2025-2026'),
  ('demo-team-sb-s', 'demo-sb-p04', '2025-2026'),
  ('demo-team-sb-s', 'demo-sb-p05', '2025-2026'),
  ('demo-team-sb-s', 'demo-sb-p06', '2025-2026'),
  ('demo-team-sb-s', 'demo-sb-p07', '2025-2026'),
  ('demo-team-sb-s', 'demo-sb-p08', '2025-2026'),
  ('demo-team-sb-s', 'demo-sb-p09', '2025-2026'),
  ('demo-team-sb-u15', 'demo-sb-p10', '2025-2026'),
  ('demo-team-sb-u15', 'demo-sb-p11', '2025-2026'),
  ('demo-team-sb-u15', 'demo-sb-p12', '2025-2026');

-- SOFTBALL TRAININGS
INSERT OR REPLACE INTO trainings (id, club_id, team_id, title, location, start_time, end_time, status)
VALUES
  ('demo-sb-tr01','demo-club-softball-0000-0000-000000000001','demo-team-sb-s','Antrenament tehnic','Sala Sportivă Cluj',datetime('now','+2 days','start of day','+18 hours'),datetime('now','+2 days','start of day','+20 hours'),'SCHEDULED'),
  ('demo-sb-tr02','demo-club-softball-0000-0000-000000000001','demo-team-sb-s','Pitch & catch drills','Teren BS Cluj',datetime('now','+5 days','start of day','+18 hours'),datetime('now','+5 days','start of day','+20 hours'),'SCHEDULED'),
  ('demo-sb-tr03','demo-club-softball-0000-0000-000000000001','demo-team-sb-u15','Antrenament U15','Sala Sportivă Cluj',datetime('now','+3 days','start of day','+17 hours'),datetime('now','+3 days','start of day','+19 hours'),'SCHEDULED');

-- SOFTBALL MATCHES (corrected: opponent_name, no start_time)
INSERT OR REPLACE INTO matches (id, club_id, team_id, opponent_name, match_date, location, is_home, status, score_home, score_away)
VALUES
  ('demo-sb-m01','demo-club-softball-0000-0000-000000000001','demo-team-sb-s','Softball Stars Brașov',date('now','+10 days'),'Teren BS Cluj',1,'SCHEDULED',0,0),
  ('demo-sb-m02','demo-club-softball-0000-0000-000000000001','demo-team-sb-s','Diamond Queens Iași',date('now','+20 days'),'Teren Iași',0,'SCHEDULED',0,0);
