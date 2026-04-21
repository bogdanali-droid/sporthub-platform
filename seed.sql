-- ============================================================
-- SportHub — Seed Data: sporturi + configurari de baza
-- ============================================================

-- SPORTS CATALOG
INSERT OR IGNORE INTO sports (code, name_ro, name_en, category, icon, display_order) VALUES
  ('RUGBY',      'Rugby',      'Rugby',      'TEAM', '🏉', 10),
  ('BASEBALL5',  'Baseball5',  'Baseball5',  'TEAM', '⚾', 20),
  ('SOFTBALL',   'Softball',   'Softball',   'TEAM', '🥎', 30),
  ('FOTBAL',     'Fotbal',     'Football',   'TEAM', '⚽', 40),
  ('HANDBAL',    'Handbal',    'Handball',   'TEAM', '🛑', 50),
  ('BASCHET',    'Baschet',    'Basketball', 'TEAM', '🏀', 60),
  ('VOLEI',      'Volei',      'Volleyball', 'TEAM', '🏐', 70),
  ('TENIS',      'Tenis',      'Tennis',     'RACQUET', '🎾', 80),
  ('ATLETISM',   'Atletism',   'Athletics',  'INDIVIDUAL', '🏃', 90),
  ('INOT',       'Inot',       'Swimming',   'INDIVIDUAL', '🏊', 100);

-- ============================================================
-- RUGBY — configurare
-- ============================================================
INSERT OR IGNORE INTO sport_age_groups (sport_code, code, name, min_age, max_age) VALUES
  ('RUGBY','U6','U6',4,6), ('RUGBY','U8','U8',7,8), ('RUGBY','U10','U10',9,10),
  ('RUGBY','U12','U12',11,12), ('RUGBY','U14','U14',13,14), ('RUGBY','U16','U16',15,16),
  ('RUGBY','U18','U18',17,18), ('RUGBY','SENIOR','Senior',18,99);

INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, display_order) VALUES
  ('RUGBY','TRY','Eseu',5,1), ('RUGBY','CONVERSION','Transformare',2,2),
  ('RUGBY','PENALTY','Penalitate',3,3), ('RUGBY','DROP_GOAL','Drop Goal',3,4),
  ('RUGBY','YELLOW_CARD','Carton Galben',0,5), ('RUGBY','RED_CARD','Carton Rosu',0,6),
  ('RUGBY','SIN_BIN','Sin Bin',0,7), ('RUGBY','SUBSTITUTION','Schimb',0,8);

INSERT OR IGNORE INTO sport_evaluation_attributes (sport_code, code, name_ro, category, display_order) VALUES
  ('RUGBY','VITEZA','Viteza','PHYSICAL',1), ('RUGBY','FORTA','Forta','PHYSICAL',2),
  ('RUGBY','ANDURANTA','Anduranta','PHYSICAL',3), ('RUGBY','TEHNICA','Tehnica','TECHNICAL',4),
  ('RUGBY','TACTICA','Tactica','TACTICAL',5), ('RUGBY','ATITUDINE','Atitudine','MENTAL',6),
  ('RUGBY','LUCRU_ECHIPA','Lucru de echipa','MENTAL',7), ('RUGBY','LIDER','Lider','MENTAL',8);

INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES
  ('RUGBY','ATAC','Atac',1), ('RUGBY','APARARE','Aparare',2), ('RUGBY','LINIUTE','Liniuta',3),
  ('RUGBY','GRAMADA','Gramada',4), ('RUGBY','CONDITIE','Conditie fizica',5),
  ('RUGBY','INCALZIRE','Incalzire',6), ('RUGBY','TEHNICA','Tehnica',7);

-- ============================================================
-- BASEBALL5 — configurare completa (WBSC Rulebook RO 2020)
-- Sursa: Baseball5_Rulebook_RO_03032020_v1.pdf
-- 5 jucatori/echipa, 5 innings, fara pitcher
-- Pozitii defensiv: Baza 1, Baza 2, Baza 3, ShortStop, MidFielder
-- NU exista Walk sau Strikeout (fara pitcher)
-- ============================================================
INSERT OR IGNORE INTO sport_age_groups (sport_code, code, name, min_age, max_age) VALUES
  ('BASEBALL5','U10','U10',8,10), ('BASEBALL5','U12','U12',11,12),
  ('BASEBALL5','U15','U15',13,15), ('BASEBALL5','U18','U18',16,18),
  ('BASEBALL5','OPEN','Open',18,99);

-- Pozitii defensiv confirmate din regulamentul oficial WBSC (pag. 9)
INSERT OR IGNORE INTO sport_positions (sport_code, code, name_ro, abbreviation, display_order) VALUES
  ('BASEBALL5','MIDFIELDER','Mijlocas (MidFielder)','M',1),
  ('BASEBALL5','FIRST_BASE','Baza 1 (First Base)','1B',2),
  ('BASEBALL5','SECOND_BASE','Baza 2 (Second Base)','2B',3),
  ('BASEBALL5','THIRD_BASE','Baza 3 (Third Base)','3B',4),
  ('BASEBALL5','SHORTSTOP','ScurtStop (ShortStop)','SS',5);

-- Evenimente de joc (fara WALK/STRIKEOUT - nu exista pitcher in B5)
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES
  ('BASEBALL5','SINGLE','Single (ajunge la Baza 1)',0,0,1),
  ('BASEBALL5','DOUBLE','Double (ajunge la Baza 2)',0,0,2),
  ('BASEBALL5','TRIPLE','Triple (ajunge la Baza 3)',0,0,3),
  ('BASEBALL5','HOME_RUN','Home Run (circuit complet)',1,0,4),
  ('BASEBALL5','RUN','Punct (Run marcat)',1,0,5),
  ('BASEBALL5','CAUGHT_OUT','Out - prins in zbor (Fly Out)',0,0,6),
  ('BASEBALL5','FORCE_OUT','Out - fortat la baza',0,0,7),
  ('BASEBALL5','TAG_OUT','Out - prin atingere (Tag Out)',0,0,8),
  ('BASEBALL5','OUT','Out - ratat mingea',0,0,9),
  ('BASEBALL5','ERROR','Eroare teren',0,0,10);

INSERT OR IGNORE INTO sport_evaluation_attributes (sport_code, code, name_ro, category, display_order) VALUES
  ('BASEBALL5','BATTING','Batting (lovire cu pumnul/palma)','TECHNICAL',1),
  ('BASEBALL5','FIELDING','Fielding (prindere/aruncare)','TECHNICAL',2),
  ('BASEBALL5','SPEED','Viteza pe baze','PHYSICAL',3),
  ('BASEBALL5','STRATEGY','Intelegere tactica','TACTICAL',4),
  ('BASEBALL5','ATTITUDE','Atitudine si lucru in echipa','MENTAL',5);

INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES
  ('BASEBALL5','BATTING_DRILL','Lovire (Batting)',1),
  ('BASEBALL5','FIELDING_DRILL','Prindere si aruncare (Fielding)',2),
  ('BASEBALL5','BASE_RUNNING','Alergare pe baze',3),
  ('BASEBALL5','TACTICS','Tactica de joc',4),
  ('BASEBALL5','FITNESS','Conditie fizica',5),
  ('BASEBALL5','WARMUP','Incalzire',6);

-- ============================================================
-- SOFTBALL — configurare completa (WBSC Fast-Pitch Rules)
-- Categorii varsta conform structurii competitionale FRBS
-- 9 jucatori/echipa, 7 innings, cu pitcher
-- ============================================================
INSERT OR IGNORE INTO sport_age_groups (sport_code, code, name, min_age, max_age) VALUES
  ('SOFTBALL','U12','U12',10,12), ('SOFTBALL','U14','U14',13,14),
  ('SOFTBALL','U15','U15',13,15), ('SOFTBALL','U18','U18',16,18),
  ('SOFTBALL','OPEN','Open',18,99),
  ('SOFTBALL','SENIOR_F','Senior Feminin',18,99), ('SOFTBALL','SENIOR_M','Senior Masculin',18,99);

INSERT OR IGNORE INTO sport_positions (sport_code, code, name_ro, abbreviation, display_order) VALUES
  ('SOFTBALL','PITCHER','Aruncator (Pitcher)','P',1),
  ('SOFTBALL','CATCHER','Receptor (Catcher)','C',2),
  ('SOFTBALL','FIRST_BASE','Prima baza','1B',3),
  ('SOFTBALL','SECOND_BASE','A doua baza','2B',4),
  ('SOFTBALL','THIRD_BASE','A treia baza','3B',5),
  ('SOFTBALL','SHORTSTOP','ScurtStop','SS',6),
  ('SOFTBALL','LEFT_FIELD','Stanga (Left Field)','LF',7),
  ('SOFTBALL','CENTER_FIELD','Centru (Center Field)','CF',8),
  ('SOFTBALL','RIGHT_FIELD','Dreapta (Right Field)','RF',9);

INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES
  ('SOFTBALL','SINGLE','Single (baza 1)',0,0,1),
  ('SOFTBALL','DOUBLE','Double (baza 2)',0,0,2),
  ('SOFTBALL','TRIPLE','Triple (baza 3)',0,0,3),
  ('SOFTBALL','HOME_RUN','Home Run',1,0,4),
  ('SOFTBALL','RUN','Run (punct marcat)',1,0,5),
  ('SOFTBALL','RBI','RBI (bataie decisiva)',0,0,6),
  ('SOFTBALL','STRIKEOUT','Strikeout (3 strike-uri)',0,0,7),
  ('SOFTBALL','WALK','Walk (4 mingi - baza libera)',0,0,8),
  ('SOFTBALL','STOLEN_BASE','Baza furata',0,0,9),
  ('SOFTBALL','CAUGHT_OUT','Out - prins in zbor',0,0,10),
  ('SOFTBALL','FORCE_OUT','Out - fortat la baza',0,0,11),
  ('SOFTBALL','TAG_OUT','Out - prin atingere',0,0,12),
  ('SOFTBALL','ERROR','Eroare teren',0,0,13);

INSERT OR IGNORE INTO sport_evaluation_attributes (sport_code, code, name_ro, category, display_order) VALUES
  ('SOFTBALL','BATTING','Batting (lovire)','TECHNICAL',1),
  ('SOFTBALL','PITCHING','Pitching (aruncare)','TECHNICAL',2),
  ('SOFTBALL','FIELDING','Fielding (prindere/aruncare camp)','TECHNICAL',3),
  ('SOFTBALL','THROWING','Aruncare (precizie/putere)','TECHNICAL',4),
  ('SOFTBALL','SPEED','Viteza pe baze','PHYSICAL',5),
  ('SOFTBALL','STRENGTH','Forta','PHYSICAL',6),
  ('SOFTBALL','STRATEGY','Tactica','TACTICAL',7),
  ('SOFTBALL','GAME_IQ','Intelegere situatii de joc','TACTICAL',8),
  ('SOFTBALL','ATTITUDE','Atitudine','MENTAL',9),
  ('SOFTBALL','COACHABILITY','Receptivitate la instructiuni','MENTAL',10);

INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES
  ('SOFTBALL','PITCHING_DRILL','Antrenament aruncare (Pitching)',1),
  ('SOFTBALL','BATTING_DRILL','Lovire (Batting)',2),
  ('SOFTBALL','FIELDING_DRILL','Prindere si aruncare (Fielding)',3),
  ('SOFTBALL','BASE_RUNNING','Alergare pe baze',4),
  ('SOFTBALL','CATCHING_DRILL','Antrenament receptor (Catching)',5),
  ('SOFTBALL','TACTICS','Tactica de joc',6),
  ('SOFTBALL','FITNESS','Conditie fizica',7),
  ('SOFTBALL','WARMUP','Incalzire',8);

-- ============================================================
-- FOTBAL — configurare de baza
-- ============================================================
INSERT OR IGNORE INTO sport_age_groups (sport_code, code, name, min_age, max_age) VALUES
  ('FOTBAL','U7','U7',5,7), ('FOTBAL','U9','U9',8,9), ('FOTBAL','U11','U11',10,11),
  ('FOTBAL','U13','U13',12,13), ('FOTBAL','U15','U15',14,15), ('FOTBAL','U17','U17',16,17),
  ('FOTBAL','U19','U19',18,19), ('FOTBAL','SENIOR','Senior',18,99);

INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES
  ('FOTBAL','GOAL','Gol',1,0,1), ('FOTBAL','ASSIST','Pasa decisiva',0,0,2),
  ('FOTBAL','YELLOW_CARD','Carton Galben',0,1,3), ('FOTBAL','RED_CARD','Carton Rosu',0,1,4),
  ('FOTBAL','PENALTY_GOAL','Gol penalti',1,0,5), ('FOTBAL','OWN_GOAL','Autogol',1,0,6),
  ('FOTBAL','SUBSTITUTION','Schimb',0,0,7);
