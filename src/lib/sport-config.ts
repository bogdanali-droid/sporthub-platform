// Sport configuration system
// Loads sport-specific config (positions, event types, evaluation attributes)
// from DB cache or fallback to hardcoded defaults.

import type { D1Database } from './db';
import { queryAll } from './db';

export interface SportConfig {
  code: string;
  name_ro: string;
  name_en: string;
  icon: string;
  ageGroups: AgeGroup[];
  positions: SportPosition[];
  eventTypes: SportEventType[];
  evaluationAttributes: EvalAttribute[];
  drillCategories: DrillCategory[];
  scoringMode: 'TIME' | 'INNINGS' | 'SETS' | 'POINTS';
  periodsLabel: string;   // "Inning" / "Set" / "Repriza" / "Sfert"
  periodsCount: number;   // 9 innings softball, 2 reprize fotbal, etc.
}

export interface AgeGroup {
  code: string; name: string; min_age: number | null; max_age: number | null;
}
export interface SportPosition {
  code: string; name_ro: string; abbreviation: string | null;
}
export interface SportEventType {
  code: string; name_ro: string; default_points: number; is_scoring: boolean; is_discipline: boolean;
}
export interface EvalAttribute {
  code: string; name_ro: string; category: string; scale_min: number; scale_max: number;
}
export interface DrillCategory {
  code: string; name_ro: string;
}

// Scoring mode per sport (hardcoded fallback)
const SCORING_MODES: Record<string, Pick<SportConfig, 'scoringMode' | 'periodsLabel' | 'periodsCount'>> = {
  RUGBY:     { scoringMode: 'TIME',    periodsLabel: 'Repriza',  periodsCount: 2 },
  BASEBALL5: { scoringMode: 'INNINGS', periodsLabel: 'Inning',   periodsCount: 5 },
  SOFTBALL:  { scoringMode: 'INNINGS', periodsLabel: 'Inning',   periodsCount: 7 },
  FOTBAL:    { scoringMode: 'TIME',    periodsLabel: 'Repriza',  periodsCount: 2 },
  HANDBAL:   { scoringMode: 'TIME',    periodsLabel: 'Repriza',  periodsCount: 2 },
  BASCHET:   { scoringMode: 'TIME',    periodsLabel: 'Sfert',    periodsCount: 4 },
  VOLEI:     { scoringMode: 'SETS',    periodsLabel: 'Set',      periodsCount: 5 },
};

export async function getSportConfig(
  db: D1Database,
  sportCode: string
): Promise<SportConfig | null> {
  const [sport, ageGroups, positions, eventTypes, evalAttrs, drillCats] = await Promise.all([
    queryAll<any>(db, 'SELECT * FROM sports WHERE code = ?', [sportCode]),
    queryAll<any>(db, 'SELECT * FROM sport_age_groups WHERE sport_code = ? ORDER BY display_order', [sportCode]),
    queryAll<any>(db, 'SELECT * FROM sport_positions WHERE sport_code = ? ORDER BY display_order', [sportCode]),
    queryAll<any>(db, 'SELECT * FROM sport_event_types WHERE sport_code = ? ORDER BY display_order', [sportCode]),
    queryAll<any>(db, 'SELECT * FROM sport_evaluation_attributes WHERE sport_code = ? ORDER BY display_order', [sportCode]),
    queryAll<any>(db, 'SELECT * FROM sport_drill_categories WHERE sport_code = ? ORDER BY display_order', [sportCode]),
  ]);

  if (!sport[0]) return null;

  const modes = SCORING_MODES[sportCode] ?? { scoringMode: 'TIME', periodsLabel: 'Repriza', periodsCount: 2 };

  return {
    code: sport[0].code,
    name_ro: sport[0].name_ro,
    name_en: sport[0].name_en,
    icon: sport[0].icon ?? '',
    ageGroups: ageGroups.map(r => ({ code: r.code, name: r.name, min_age: r.min_age, max_age: r.max_age })),
    positions: positions.map(r => ({ code: r.code, name_ro: r.name_ro, abbreviation: r.abbreviation })),
    eventTypes: eventTypes.map(r => ({ code: r.code, name_ro: r.name_ro, default_points: r.default_points, is_scoring: !!r.is_scoring, is_discipline: !!r.is_discipline })),
    evaluationAttributes: evalAttrs.map(r => ({ code: r.code, name_ro: r.name_ro, category: r.category, scale_min: r.scale_min ?? 1, scale_max: r.scale_max ?? 5 })),
    drillCategories: drillCats.map(r => ({ code: r.code, name_ro: r.name_ro })),
    ...modes,
  };
}

export async function getClubSportConfig(
  db: D1Database,
  clubId: string
): Promise<SportConfig | null> {
  const club = await queryAll<any>(db, 'SELECT sport_code FROM clubs WHERE id = ?', [clubId]);
  if (!club[0]) return null;
  return getSportConfig(db, club[0].sport_code);
}
