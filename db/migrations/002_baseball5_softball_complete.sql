-- ============================================================
-- Migrare 002: Baseball5 & Softball — configurare completa
-- Sursa: regulamente oficiale WBSC + FRBS (docs/research/)
-- Ruleaza in D1 Console, UN statement pe rand
-- ============================================================

-- PASUL 1: Corecti pozitii Baseball5
-- Confirmat din Baseball5_Rulebook_RO_03032020_v1.pdf, pag. 9
-- Pozitii defensiv: Baza 1, Baza 2, Baza 3, ShortStop, MidFielder
UPDATE sport_positions SET code='MIDFIELDER', name_ro='Mijlocas (MidFielder)', abbreviation='M' WHERE sport_code='BASEBALL5' AND code='BATTER';
UPDATE sport_positions SET code='FIRST_BASE', name_ro='Baza 1 (First Base)' WHERE sport_code='BASEBALL5' AND code='FIELDER_1';
UPDATE sport_positions SET code='SECOND_BASE', name_ro='Baza 2 (Second Base)' WHERE sport_code='BASEBALL5' AND code='FIELDER_2';
UPDATE sport_positions SET code='THIRD_BASE', name_ro='Baza 3 (Third Base)' WHERE sport_code='BASEBALL5' AND code='FIELDER_3';

-- PASUL 2: Sterge WALK si STRIKEOUT din Baseball5
-- Baseball5 nu are pitcher, deci nu exista walk sau strikeout
DELETE FROM sport_event_types WHERE sport_code='BASEBALL5' AND code IN ('WALK','STRIKEOUT');

-- PASUL 3: Redenumeste OUT generic in Baseball5 la 'Ratat mingea'
UPDATE sport_event_types SET name_ro='Out - ratat mingea' WHERE sport_code='BASEBALL5' AND code='OUT';

-- PASUL 4: Adauga tipuri eveniment noi Baseball5
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('BASEBALL5','CAUGHT_OUT','Out - prins in zbor (Fly Out)',0,0,6);
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('BASEBALL5','FORCE_OUT','Out - fortat la baza',0,0,7);
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('BASEBALL5','TAG_OUT','Out - prin atingere (Tag Out)',0,0,8);

-- PASUL 5: Drill categories Baseball5
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','BATTING_DRILL','Lovire (Batting)',1);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','FIELDING_DRILL','Prindere si aruncare (Fielding)',2);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','BASE_RUNNING','Alergare pe baze',3);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','TACTICS','Tactica de joc',4);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','FITNESS','Conditie fizica',5);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','WARMUP','Incalzire',6);

-- PASUL 6: Grupa varsta U14 Softball
INSERT OR IGNORE INTO sport_age_groups (sport_code, code, name, min_age, max_age) VALUES ('SOFTBALL','U14','U14',13,14);

-- PASUL 7: Tipuri eveniment suplimentare Softball
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('SOFTBALL','CAUGHT_OUT','Out - prins in zbor',0,0,10);
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('SOFTBALL','FORCE_OUT','Out - fortat la baza',0,0,11);
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('SOFTBALL','TAG_OUT','Out - prin atingere',0,0,12);
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('SOFTBALL','ERROR','Eroare teren',0,0,13);

-- PASUL 8: Drill categories Softball
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','PITCHING_DRILL','Antrenament aruncare (Pitching)',1);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','BATTING_DRILL','Lovire (Batting)',2);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','FIELDING_DRILL','Prindere si aruncare (Fielding)',3);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','BASE_RUNNING','Alergare pe baze',4);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','CATCHING_DRILL','Antrenament receptor (Catching)',5);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','TACTICS','Tactica de joc',6);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','FITNESS','Conditie fizica',7);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','WARMUP','Incalzire',8);

-- PASUL 9: Atribute evaluare suplimentare Softball
INSERT OR IGNORE INTO sport_evaluation_attributes (sport_code, code, name_ro, category, display_order) VALUES ('SOFTBALL','GAME_IQ','Intelegere situatii de joc','TACTICAL',8);
INSERT OR IGNORE INTO sport_evaluation_attributes (sport_code, code, name_ro, category, display_order) VALUES ('SOFTBALL','COACHABILITY','Receptivitate la instructiuni','MENTAL',10);

-- ============================================================
-- VERIFICARE (ruleaza dupa migrare)
-- ============================================================
-- SELECT code, name_ro, abbreviation FROM sport_positions WHERE sport_code='BASEBALL5' ORDER BY display_order;
-- SELECT code, name_ro FROM sport_event_types WHERE sport_code='BASEBALL5' ORDER BY display_order;
-- SELECT code, name_ro FROM sport_drill_categories WHERE sport_code IN ('BASEBALL5','SOFTBALL') ORDER BY sport_code, display_order;
-- SELECT code, name FROM sport_age_groups WHERE sport_code='SOFTBALL' ORDER BY min_age;
