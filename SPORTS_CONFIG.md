# Cum se adaugă un sport nou în SportHub

SportHub folosește un sistem declarativ: fiecare sport este configurat în baza de date (tabele `sport_*`), nu în cod hardcodat.

## Pașii pentru un sport nou

### 1. Adaugă sportul în `seed.sql`

```sql
INSERT INTO sports (code, name_ro, name_en, category, icon, display_order)
VALUES ('HANDBAL', 'Handbal', 'Handball', 'TEAM', '🛑', 50);
```

### 2. Configurează categoriile de vârstă

```sql
INSERT INTO sport_age_groups (sport_code, code, name, min_age, max_age) VALUES
  ('HANDBAL','U12','U12 Juniori',10,12),
  ('HANDBAL','U14','U14 Juniori',13,14),
  ('HANDBAL','SENIOR','Senior',18,99);
```

### 3. Configurează pozițiile

```sql
INSERT INTO sport_positions (sport_code, code, name_ro, abbreviation) VALUES
  ('HANDBAL','PORTAR','Portar','POR'),
  ('HANDBAL','EXTREM_STANGA','Extrem Stanga','ES'),
  ('HANDBAL','INTERSECTOR','Intersector','INT');
```

### 4. Configurează evenimentele de meci

```sql
INSERT INTO sport_event_types (sport_code, code, name_ro, default_points) VALUES
  ('HANDBAL','GOAL','Gol',1),
  ('HANDBAL','PENALTY_GOAL','Penalti transformat',1),
  ('HANDBAL','YELLOW_CARD','Carton Galben',0),
  ('HANDBAL','RED_CARD','Eliminare',0),
  ('HANDBAL','7M_MISS','Penalti ratat',0);
```

### 5. Configurează atributele de evaluare

```sql
INSERT INTO sport_evaluation_attributes (sport_code, code, name_ro, category) VALUES
  ('HANDBAL','ARUNCARE','Tehnica de aruncare','TECHNICAL'),
  ('HANDBAL','APARARE','Aparare individuala','TECHNICAL'),
  ('HANDBAL','VITEZA','Viteza','PHYSICAL'),
  ('HANDBAL','TACTICA','Intelegere tactica','TACTICAL');
```

### 6. Setează modul de scoring în `sport-config.ts`

Adaugă în `SCORING_MODES`:
```ts
HANDBAL: { scoringMode: 'TIME', periodsLabel: 'Repriza', periodsCount: 2 },
```

### 7. Creează un club cu sportul nou

```sql
INSERT INTO clubs (sport_code, name, city) VALUES ('HANDBAL', 'CSM Handbal', 'Bucuresti');
```

**Gata!** Tot UI-ul (formulare, tabele, live scoring, evaluari) se adaptează automat la configurația din DB.

## Sporturi cu specific aparte

| Sport | Particularitate |
|---|---|
| Baseball5 / Softball | `scoring_mode = INNINGS` — folosim `period_data JSON` pentru box score |
| Volei | `scoring_mode = SETS` — 5 seturi, puncte per set |
| Rugby | Categorie vârstă U6-U18 + retur la joc RFC (6 etape) |
| Fotbal | Autogol, penalti, VAR events |

## Checklist complet pentru sport nou

- [ ] Insert în `sports`
- [ ] Insert în `sport_age_groups`
- [ ] Insert în `sport_positions`
- [ ] Insert în `sport_event_types`
- [ ] Insert în `sport_evaluation_attributes`
- [ ] Insert în `sport_drill_categories`
- [ ] Update `SCORING_MODES` în `sport-config.ts`
- [ ] Verifică UI admin (formulare, tabele, live scoring)
