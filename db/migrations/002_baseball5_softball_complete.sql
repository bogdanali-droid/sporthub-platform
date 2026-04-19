-- ============================================================
-- Migrare 002: Baseball5 & Softball — configurare completa
-- Ruleaza in D1 Console, UN statement pe rand
-- ============================================================

-- PASUL 1: Corecti pozitii Baseball5 (BATTER nu e pozitie de teren in B5)
UPDATE sport_positions SET code='MIDFIELDER', name_ro='Mijlocas', abbreviation='M' WHERE sport_code='BASEBALL5' AND code='BATTER';
UPDATE sport_positions SET code='FIRST_BASE' WHERE sport_code='BASEBALL5' AND code='FIELDER_1';
UPDATE sport_positions SET code='SECOND_BASE' WHERE sport_code='BASEBALL5' AND code='FIELDER_2';
UPDATE sport_positions SET code='THIRD_BASE' WHERE sport_code='BASEBALL5' AND code='FIELDER_3';

-- PASUL 2: Tipuri eveniment noi Baseball5
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('BASEBALL5','CAUGHT_OUT','Prinsa in zbor (out)',0,0,10);
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('BASEBALL5','FORCE_OUT','Out fortat la baza',0,0,11);
INSERT OR IGNORE INTO sport_event_types (sport_code, code, name_ro, default_points, is_discipline, display_order) VALUES ('BASEBALL5','TAG_OUT','Out prin atingere',0,0,12);

-- PASUL 3: Drill categories Baseball5
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','BATTING_DRILL','Lovire (Batting)',1);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','FIELDING_DRILL','Prindere si aruncare',2);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','BASE_RUNNING','Alergare pe baze',3);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','TACTICS','Tactica de joc',4);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','FITNESS','Conditie fizica',5);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('BASEBALL5','WARMUP','Incalzire',6);

-- PASUL 4: Grupa varsta U14 Softball
INSERT OR IGNORE INTO sport_age_groups (sport_code, code, name, min_age, max_age) VALUES ('SOFTBALL','U14','U14',13,14);

-- PASUL 5: Drill categories Softball
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','PITCHING_DRILL','Antrenament aruncare (Pitching)',1);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','BATTING_DRILL','Lovire (Batting)',2);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','FIELDING_DRILL','Prindere si aruncare',3);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','BASE_RUNNING','Alergare pe baze',4);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','CATCHING_DRILL','Antrenament receptor (Catching)',5);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','TACTICS','Tactica de joc',6);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','FITNESS','Conditie fizica',7);
INSERT OR IGNORE INTO sport_drill_categories (sport_code, code, name_ro, display_order) VALUES ('SOFTBALL','WARMUP','Incalzire',8);

-- PASUL 6: Atribute evaluare noi Softball
INSERT OR IGNORE INTO sport_evaluation_attributes (sport_code, code, name_ro, category, display_order) VALUES ('SOFTBALL','GAME_IQ','Intelegere situatii de joc','TACTICAL',8);
INSERT OR IGNORE INTO sport_evaluation_attributes (sport_code, code, name_ro, category, display_order) VALUES ('SOFTBALL','COACHABILITY','Receptivitate la instructiuni','MENTAL',10);

-- VERIFICARE (ruleaza dupa migrare)
-- SELECT code, name_ro, abbreviation FROM sport_positions WHERE sport_code='BASEBALL5';
-- SELECT code, name_ro FROM sport_drill_categories WHERE sport_code IN ('BASEBALL5','SOFTBALL');
-- SELECT code, name FROM sport_age_groups WHERE sport_code='SOFTBALL' ORDER BY min_age;
