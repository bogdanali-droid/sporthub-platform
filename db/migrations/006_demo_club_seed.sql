-- ============================================================
-- Migrare 006: Club Demo — date demonstrative Baseball5
-- User: bogdanaliciuc@gmail.com / Sport##1234
-- ============================================================

-- CLUB
INSERT OR IGNORE INTO clubs (id, name, sport_code, city, email, phone, is_active)
VALUES (
  'demo-club-0000-0000-0000-000000000001',
  'Club Demo Baseball5',
  'BASEBALL5',
  'București',
  'bogdanaliciuc@gmail.com',
  '0700000000',
  1
);

-- ADMIN USER
INSERT OR IGNORE INTO users (id, club_id, email, password_hash, role, first_name, last_name, is_active)
VALUES (
  'demo-user-0000-0000-0000-000000000001',
  'demo-club-0000-0000-0000-000000000001',
  'bogdanaliciuc@gmail.com',
  'pbkdf2:3a7f129e4bc50188d26af3449c71e82d:c1d211d6a5494f165c123a109b129d03fb03b61058d8a3dab18e37ae12e386b1',
  'ADMIN',
  'Bogdan',
  'Aliciuc',
  1
);

-- TEAMS
INSERT OR IGNORE INTO teams (id, club_id, name, age_group, is_active)
VALUES
  ('demo-team-0000-0000-0000-000000000001', 'demo-club-0000-0000-0000-000000000001', 'Seniori Baseball5', 'SENIORI', 1),
  ('demo-team-0000-0000-0000-000000000002', 'demo-club-0000-0000-0000-000000000001', 'U15 Baseball5', 'U15', 1);

-- PLAYERS (15 jucători)
INSERT OR IGNORE INTO players (id, club_id, first_name, last_name, birth_date, position, jersey_number, legitimation_status)
VALUES
  ('demo-p01', 'demo-club-0000-0000-0000-000000000001', 'Alexandru', 'Ionescu', '2000-03-15', 'FIRST_BASE', 1, 'LEGITIMAT'),
  ('demo-p02', 'demo-club-0000-0000-0000-000000000001', 'Mihai', 'Popescu', '1999-07-22', 'SECOND_BASE', 2, 'LEGITIMAT'),
  ('demo-p03', 'demo-club-0000-0000-0000-000000000001', 'Andrei', 'Constantin', '2001-11-05', 'THIRD_BASE', 3, 'LEGITIMAT'),
  ('demo-p04', 'demo-club-0000-0000-0000-000000000001', 'Cristian', 'Gheorghe', '2000-01-30', 'MIDFIELDER', 4, 'LEGITIMAT'),
  ('demo-p05', 'demo-club-0000-0000-0000-000000000001', 'Radu', 'Dumitrescu', '1998-09-12', 'SHORTSTOP', 5, 'LEGITIMAT'),
  ('demo-p06', 'demo-club-0000-0000-0000-000000000001', 'Stefan', 'Marinescu', '2001-04-18', 'FIRST_BASE', 6, 'LEGITIMAT'),
  ('demo-p07', 'demo-club-0000-0000-0000-000000000001', 'Vlad', 'Niculescu', '2002-06-25', 'SECOND_BASE', 7, 'LEGITIMAT'),
  ('demo-p08', 'demo-club-0000-0000-0000-000000000001', 'George', 'Popa', '1997-12-08', 'THIRD_BASE', 8, 'LEGITIMAT'),
  ('demo-p09', 'demo-club-0000-0000-0000-000000000001', 'Daniel', 'Munteanu', '2000-08-14', 'SHORTSTOP', 9, 'LEGITIMAT'),
  ('demo-p10', 'demo-club-0000-0000-0000-000000000001', 'Florin', 'Stan', '1999-02-20', 'MIDFIELDER', 10, 'LEGITIMAT'),
  ('demo-p11', 'demo-club-0000-0000-0000-000000000001', 'Bogdan', 'Rusu', '2008-05-10', 'FIRST_BASE', 11, 'LEGITIMAT'),
  ('demo-p12', 'demo-club-0000-0000-0000-000000000001', 'Ionut', 'Dumitru', '2009-03-22', 'SECOND_BASE', 12, 'LEGITIMAT'),
  ('demo-p13', 'demo-club-0000-0000-0000-000000000001', 'Cosmin', 'Barbu', '2008-11-17', 'THIRD_BASE', 13, 'LEGITIMAT'),
  ('demo-p14', 'demo-club-0000-0000-0000-000000000001', 'Tudor', 'Nistor', '2009-07-04', 'MIDFIELDER', 14, 'LEGITIMAT'),
  ('demo-p15', 'demo-club-0000-0000-0000-000000000001', 'Razvan', 'Luca', '2010-01-29', 'SHORTSTOP', 15, 'NELEGITIMAT');

-- COACH USER
INSERT OR IGNORE INTO users (id, club_id, email, password_hash, role, first_name, last_name, is_active)
VALUES (
  'demo-coach-000-0000-0000-000000000001',
  'demo-club-0000-0000-0000-000000000001',
  'antrenor@clubdemo.ro',
  'pbkdf2:3a7f129e4bc50188d26af3449c71e82d:c1d211d6a5494f165c123a109b129d03fb03b61058d8a3dab18e37ae12e386b1',
  'COACH',
  'Marian',
  'Tudose',
  1
);

-- LEGITIMARI active pentru primii 14 jucători
INSERT OR IGNORE INTO player_legitimations (id, player_id, club_id, sport_code, registration_type, license_number, status, issued_by)
VALUES
  ('demo-leg-01', 'demo-p01', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000001', 'ACTIVE', NULL),
  ('demo-leg-02', 'demo-p02', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000002', 'ACTIVE', NULL),
  ('demo-leg-03', 'demo-p03', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000003', 'ACTIVE', NULL),
  ('demo-leg-04', 'demo-p04', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000004', 'ACTIVE', NULL),
  ('demo-leg-05', 'demo-p05', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000005', 'ACTIVE', NULL),
  ('demo-leg-06', 'demo-p06', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000006', 'ACTIVE', NULL),
  ('demo-leg-07', 'demo-p07', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000007', 'ACTIVE', NULL),
  ('demo-leg-08', 'demo-p08', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000008', 'ACTIVE', NULL),
  ('demo-leg-09', 'demo-p09', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000009', 'ACTIVE', NULL),
  ('demo-leg-10', 'demo-p10', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000010', 'ACTIVE', NULL),
  ('demo-leg-11', 'demo-p11', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000011', 'ACTIVE', NULL),
  ('demo-leg-12', 'demo-p12', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000012', 'ACTIVE', NULL),
  ('demo-leg-13', 'demo-p13', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000013', 'ACTIVE', NULL),
  ('demo-leg-14', 'demo-p14', 'demo-club-0000-0000-0000-000000000001', 'BASEBALL5', 'INITIAL', 'FRBS-2025-B5-000014', 'ACTIVE', NULL);

UPDATE players SET license_number='FRBS-2025-B5-000001' WHERE id='demo-p01';
UPDATE players SET license_number='FRBS-2025-B5-000002' WHERE id='demo-p02';
UPDATE players SET license_number='FRBS-2025-B5-000003' WHERE id='demo-p03';
UPDATE players SET license_number='FRBS-2025-B5-000004' WHERE id='demo-p04';
UPDATE players SET license_number='FRBS-2025-B5-000005' WHERE id='demo-p05';
UPDATE players SET license_number='FRBS-2025-B5-000006' WHERE id='demo-p06';
UPDATE players SET license_number='FRBS-2025-B5-000007' WHERE id='demo-p07';
UPDATE players SET license_number='FRBS-2025-B5-000008' WHERE id='demo-p08';
UPDATE players SET license_number='FRBS-2025-B5-000009' WHERE id='demo-p09';
UPDATE players SET license_number='FRBS-2025-B5-000010' WHERE id='demo-p10';
UPDATE players SET license_number='FRBS-2025-B5-000011' WHERE id='demo-p11';
UPDATE players SET license_number='FRBS-2025-B5-000012' WHERE id='demo-p12';
UPDATE players SET license_number='FRBS-2025-B5-000013' WHERE id='demo-p13';
UPDATE players SET license_number='FRBS-2025-B5-000014' WHERE id='demo-p14';

-- SUSPENDARE demo-p08 (George Popa)
UPDATE player_legitimations SET status='SUSPENDED' WHERE id='demo-leg-08';
UPDATE players SET legitimation_status='SUSPENDAT' WHERE id='demo-p08';

-- ANTRENAMENTE (trecute + viitoare)
INSERT OR IGNORE INTO trainings (id, club_id, team_id, title, start_time, end_time, location, notes, status)
VALUES
  ('demo-tr-01','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Batting + Fielding','2026-04-01T18:00','2026-04-01T20:00','Complexul Sportiv Titan, București','Antrenament batting + fielding','COMPLETED'),
  ('demo-tr-02','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Tactică ofensivă','2026-04-03T18:00','2026-04-03T20:00','Complexul Sportiv Titan, București','Tactică ofensivă','COMPLETED'),
  ('demo-tr-03','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Alergare baze + apărare','2026-04-07T18:00','2026-04-07T20:00','Complexul Sportiv Titan, București','Alergare baze + apărare','COMPLETED'),
  ('demo-tr-04','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Joc simulat 5v5','2026-04-10T18:00','2026-04-10T20:00','Complexul Sportiv Titan, București','Joc simulat 5v5','COMPLETED'),
  ('demo-tr-05','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Pregătire meci CN','2026-04-14T18:00','2026-04-14T20:00','Complexul Sportiv Titan, București','Pregătire meci CN','COMPLETED'),
  ('demo-tr-06','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Antrenament tehnic','2026-04-24T18:00','2026-04-24T20:00','Complexul Sportiv Titan, București','Antrenament tehnic','SCHEDULED'),
  ('demo-tr-07','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Forță + condiție fizică','2026-04-28T18:00','2026-04-28T20:00','Complexul Sportiv Titan, București','Forță + condiție fizică','SCHEDULED'),
  ('demo-tr-08','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000002','U15 Batting Drill','2026-04-05T10:00','2026-04-05T12:00','Parcul Herăstrău, București','U15 — batting drill','COMPLETED'),
  ('demo-tr-09','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000002','U15 Fielding + Base Running','2026-04-12T10:00','2026-04-12T12:00','Parcul Herăstrău, București','U15 — fielding + base running','COMPLETED');

-- PREZENȚE antrenamente trecute (tr-01..tr-05)
INSERT OR IGNORE INTO attendance (id, player_id, training_id, status)
VALUES
  ('da-001','demo-p01','demo-tr-01','PRESENT'),
  ('da-002','demo-p02','demo-tr-01','PRESENT'),
  ('da-003','demo-p03','demo-tr-01','ABSENT'),
  ('da-004','demo-p04','demo-tr-01','PRESENT'),
  ('da-005','demo-p05','demo-tr-01','PRESENT'),
  ('da-011','demo-p01','demo-tr-02','PRESENT'),
  ('da-012','demo-p02','demo-tr-02','PRESENT'),
  ('da-013','demo-p03','demo-tr-02','PRESENT'),
  ('da-014','demo-p04','demo-tr-02','ABSENT'),
  ('da-015','demo-p05','demo-tr-02','PRESENT'),
  ('da-021','demo-p01','demo-tr-03','PRESENT'),
  ('da-022','demo-p02','demo-tr-03','PRESENT'),
  ('da-023','demo-p03','demo-tr-03','PRESENT'),
  ('da-024','demo-p04','demo-tr-03','EXCUSED'),
  ('da-025','demo-p05','demo-tr-03','PRESENT'),
  ('da-031','demo-p01','demo-tr-04','PRESENT'),
  ('da-032','demo-p02','demo-tr-04','PRESENT'),
  ('da-033','demo-p03','demo-tr-04','PRESENT'),
  ('da-034','demo-p04','demo-tr-04','PRESENT'),
  ('da-035','demo-p05','demo-tr-04','ABSENT'),
  ('da-041','demo-p01','demo-tr-05','PRESENT'),
  ('da-042','demo-p02','demo-tr-05','PRESENT'),
  ('da-043','demo-p03','demo-tr-05','EXCUSED'),
  ('da-044','demo-p04','demo-tr-05','PRESENT'),
  ('da-045','demo-p05','demo-tr-05','PRESENT');

-- MECIURI (3 terminate + 1 live + 2 viitoare)
INSERT OR IGNORE INTO matches (id, club_id, team_id, opponent_name, match_date, location, is_home, competition, score_home, score_away, status, period_data)
VALUES
  ('demo-m01','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Steaua Baseball Club','2026-03-28','Complexul Sportiv Titan',1,'CN Seniori Baseball5 2026',8,5,'FINISHED','[{"inning":1,"top":2,"bottom":3},{"inning":2,"top":1,"bottom":2},{"inning":3,"top":0,"bottom":1},{"inning":4,"top":2,"bottom":1},{"inning":5,"top":0,"bottom":1}]'),
  ('demo-m02','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Dinamo B5 București','2026-04-05','Stadionul Dinamo',0,'CN Seniori Baseball5 2026',4,7,'FINISHED','[{"inning":1,"top":1,"bottom":0},{"inning":2,"top":2,"bottom":1},{"inning":3,"top":1,"bottom":1},{"inning":4,"top":2,"bottom":1},{"inning":5,"top":1,"bottom":1}]'),
  ('demo-m03','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Rapid Baseball5','2026-04-12','Complexul Sportiv Titan',1,'CN Seniori Baseball5 2026',11,3,'FINISHED','[{"inning":1,"top":0,"bottom":4},{"inning":2,"top":1,"bottom":2},{"inning":3,"top":0,"bottom":3},{"inning":4,"top":2,"bottom":1},{"inning":5,"top":0,"bottom":1}]'),
  ('demo-m04','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','CSM București B5','2026-04-19','Complexul Sportiv Titan',1,'CN Seniori Baseball5 2026',3,2,'LIVE','[{"inning":1,"top":1,"bottom":2},{"inning":2,"top":1,"bottom":1}]'),
  ('demo-m05','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Universitatea Cluj B5','2026-04-26','Cluj-Napoca Arena',0,'CN Seniori Baseball5 2026',null,null,'SCHEDULED',null),
  ('demo-m06','demo-club-0000-0000-0000-000000000001','demo-team-0000-0000-0000-000000000001','Politehnica Iași B5','2026-05-10','Complexul Sportiv Titan',1,'CN Seniori Baseball5 2026',null,null,'SCHEDULED',null);

-- CONVOCĂRI meci m01 (Steaua)
INSERT OR IGNORE INTO match_selections (id, match_id, player_id, role, position_played)
VALUES
  ('ms-m01-p01','demo-m01','demo-p01','STARTER','FIRST_BASE'),
  ('ms-m01-p02','demo-m01','demo-p02','STARTER','SECOND_BASE'),
  ('ms-m01-p03','demo-m01','demo-p03','STARTER','THIRD_BASE'),
  ('ms-m01-p04','demo-m01','demo-p04','STARTER','MIDFIELDER'),
  ('ms-m01-p05','demo-m01','demo-p05','STARTER','SHORTSTOP'),
  ('ms-m01-p06','demo-m01','demo-p06','RESERVE','FIRST_BASE'),
  ('ms-m01-p07','demo-m01','demo-p07','RESERVE','SECOND_BASE');

-- CONVOCĂRI meci m04 (live)
INSERT OR IGNORE INTO match_selections (id, match_id, player_id, role, position_played)
VALUES
  ('ms-m04-p01','demo-m04','demo-p01','STARTER','FIRST_BASE'),
  ('ms-m04-p02','demo-m04','demo-p02','STARTER','SECOND_BASE'),
  ('ms-m04-p03','demo-m04','demo-p03','STARTER','THIRD_BASE'),
  ('ms-m04-p04','demo-m04','demo-p04','STARTER','MIDFIELDER'),
  ('ms-m04-p05','demo-m04','demo-p05','STARTER','SHORTSTOP'),
  ('ms-m04-p09','demo-m04','demo-p09','RESERVE','SHORTSTOP'),
  ('ms-m04-p10','demo-m04','demo-p10','RESERVE','MIDFIELDER');

-- EVENIMENTE meci m01
INSERT OR IGNORE INTO match_events (id, match_id, club_id, period, event_type, team, player_id, player_name, points)
VALUES
  ('me-01','demo-m01','demo-club-0000-0000-0000-000000000001',1,'HOME_RUN','HOME','demo-p01','Alexandru Ionescu',1),
  ('me-02','demo-m01','demo-club-0000-0000-0000-000000000001',1,'RUN','HOME','demo-p02','Mihai Popescu',1),
  ('me-03','demo-m01','demo-club-0000-0000-0000-000000000001',2,'HOME_RUN','HOME','demo-p05','Radu Dumitrescu',1),
  ('me-04','demo-m01','demo-club-0000-0000-0000-000000000001',3,'RUN','HOME','demo-p03','Andrei Constantin',1),
  ('me-05','demo-m01','demo-club-0000-0000-0000-000000000001',4,'RUN','AWAY',null,null,1),
  ('me-06','demo-m04','demo-club-0000-0000-0000-000000000001',1,'HOME_RUN','HOME','demo-p01','Alexandru Ionescu',1),
  ('me-07','demo-m04','demo-club-0000-0000-0000-000000000001',1,'RUN','HOME','demo-p04','Cristian Gheorghe',1),
  ('me-08','demo-m04','demo-club-0000-0000-0000-000000000001',2,'RUN','HOME','demo-p02','Mihai Popescu',1);

-- (prezențe la meciuri sunt gestionate prin match_selections)

-- EVALUĂRI jucători
INSERT OR IGNORE INTO player_evaluations (id, player_id, club_id, evaluated_by, eval_date, notes)
VALUES
  ('demo-ev-01','demo-p01','demo-club-0000-0000-0000-000000000001','demo-coach-000-0000-0000-000000000001','2026-04-08','Progres excelent la batting. Lider în teren.'),
  ('demo-ev-02','demo-p02','demo-club-0000-0000-0000-000000000001','demo-coach-000-0000-0000-000000000001','2026-04-08','Bun la fielding, trebuie lucrat la viteza de reacție.'),
  ('demo-ev-03','demo-p03','demo-club-0000-0000-0000-000000000001','demo-coach-000-0000-0000-000000000001','2026-04-08','Potențial ridicat, prezență slabă la antrenamente.'),
  ('demo-ev-04','demo-p01','demo-club-0000-0000-0000-000000000001','demo-coach-000-0000-0000-000000000001','2026-04-15','Cea mai bună formă din sezon.');

-- SCORURI EVALUARE (atribute Baseball5)
INSERT OR IGNORE INTO player_evaluation_scores (id, evaluation_id, attribute_code, score)
VALUES
  -- ev-01 Ionescu
  ('des-01','demo-ev-01','BATTING_TECHNIQUE',5),
  ('des-02','demo-ev-01','FIELDING',4),
  ('des-03','demo-ev-01','BASE_RUNNING',5),
  ('des-04','demo-ev-01','TEAMWORK',5),
  ('des-05','demo-ev-01','ATTITUDE',5),
  -- ev-02 Popescu
  ('des-11','demo-ev-02','BATTING_TECHNIQUE',3),
  ('des-12','demo-ev-02','FIELDING',5),
  ('des-13','demo-ev-02','BASE_RUNNING',4),
  ('des-14','demo-ev-02','TEAMWORK',4),
  ('des-15','demo-ev-02','ATTITUDE',4),
  -- ev-03 Constantin
  ('des-21','demo-ev-03','BATTING_TECHNIQUE',4),
  ('des-22','demo-ev-03','FIELDING',3),
  ('des-23','demo-ev-03','BASE_RUNNING',4),
  ('des-24','demo-ev-03','TEAMWORK',3),
  ('des-25','demo-ev-03','ATTITUDE',2),
  -- ev-04 Ionescu (a 2-a evaluare)
  ('des-31','demo-ev-04','BATTING_TECHNIQUE',5),
  ('des-32','demo-ev-04','FIELDING',5),
  ('des-33','demo-ev-04','BASE_RUNNING',5),
  ('des-34','demo-ev-04','TEAMWORK',5),
  ('des-35','demo-ev-04','ATTITUDE',5);

-- MEDICAL
INSERT OR IGNORE INTO medical_visits (id, player_id, club_id, visit_date, valid_until, doctor_name, notes)
VALUES
  ('demo-med-01','demo-p01','demo-club-0000-0000-0000-000000000001','2026-03-01','2026-09-01','Dr. Vasile Marinescu','Apt sport de performanță'),
  ('demo-med-02','demo-p02','demo-club-0000-0000-0000-000000000001','2026-03-01','2026-09-01','Dr. Vasile Marinescu','Apt sport de performanță'),
  ('demo-med-03','demo-p03','demo-club-0000-0000-0000-000000000001','2026-03-01','2026-09-01','Dr. Vasile Marinescu','Apt sport de performanță'),
  ('demo-med-04','demo-p05','demo-club-0000-0000-0000-000000000001','2026-02-15','2026-04-30','Dr. Ana Ionescu','Entorsă gleznă grad I — repaus 2 săptămâni, bandaj'),
  ('demo-med-05','demo-p08','demo-club-0000-0000-0000-000000000001','2026-04-10',null,null,'Inapt temporar — suspendare disciplinară');

-- PLĂȚI
INSERT OR IGNORE INTO payments (id, player_id, club_id, amount, currency, status, due_date, paid_at, description)
VALUES
  ('demo-pay-01','demo-p01','demo-club-0000-0000-0000-000000000001',150,'RON','PAID','2026-04-01','2026-03-28','Cotizație aprilie 2026'),
  ('demo-pay-02','demo-p02','demo-club-0000-0000-0000-000000000001',150,'RON','PAID','2026-04-01','2026-04-01','Cotizație aprilie 2026'),
  ('demo-pay-03','demo-p03','demo-club-0000-0000-0000-000000000001',150,'RON','PENDING','2026-04-01',null,'Cotizație aprilie 2026'),
  ('demo-pay-04','demo-p04','demo-club-0000-0000-0000-000000000001',150,'RON','PAID','2026-04-01','2026-04-02','Cotizație aprilie 2026'),
  ('demo-pay-05','demo-p05','demo-club-0000-0000-0000-000000000001',150,'RON','OVERDUE','2026-03-01',null,'Cotizație martie 2026 — restantă'),
  ('demo-pay-06','demo-p06','demo-club-0000-0000-0000-000000000001',150,'RON','PAID','2026-04-01','2026-04-03','Cotizație aprilie 2026'),
  ('demo-pay-07','demo-p01','demo-club-0000-0000-0000-000000000001',300,'RON','PAID','2026-03-15','2026-03-14','Echipament complet sezon 2026'),
  ('demo-pay-08','demo-p02','demo-club-0000-0000-0000-000000000001',300,'RON','PENDING','2026-03-15',null,'Echipament complet sezon 2026');

-- DRILLS demo
INSERT OR IGNORE INTO drills (id, title, description, category, difficulty, duration_min, sport_code, club_id)
VALUES
  ('demo-dr-01','Batting Wall Drill','Lovituri repetate cu mingea fixată de perete. 3 serii x 20 repetări.','BATTING_DRILL','BEGINNER',20,'BASEBALL5','demo-club-0000-0000-0000-000000000001'),
  ('demo-dr-02','4-Corner Fielding','Câte un jucător pe fiecare bază, jucătorul de la home aruncă și rotești.','FIELDING_DRILL','INTERMEDIATE',30,'BASEBALL5','demo-club-0000-0000-0000-000000000001'),
  ('demo-dr-03','Sprint Bases Full','Alergare completă toate bazele, 6 repetări cu 90s pauză.','BASE_RUNNING','ADVANCED',25,'BASEBALL5','demo-club-0000-0000-0000-000000000001'),
  ('demo-dr-04','5v5 Situational Play','Joc de situație: runner pe prima bază, lovitură spre second.','TACTICS','INTERMEDIATE',45,'BASEBALL5','demo-club-0000-0000-0000-000000000001');
