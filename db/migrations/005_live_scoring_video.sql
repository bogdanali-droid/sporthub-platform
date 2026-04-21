-- Migration 005: Live scoring video integrations
-- Adds video stream URL fields to matches table

ALTER TABLE matches ADD COLUMN youtube_video_id TEXT;
ALTER TABLE matches ADD COLUMN veo_share_url TEXT;
ALTER TABLE matches ADD COLUMN xbotgo_stream_url TEXT;

-- Quick in-match evaluation scores (lightweight, separate from full player_evaluations)
CREATE TABLE IF NOT EXISTS match_eval_scores (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  match_id    TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id   TEXT NOT NULL REFERENCES players(id),
  eval_attr   TEXT NOT NULL,   -- attribute code from sport_evaluation_attributes
  score       INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  coach_id    TEXT REFERENCES users(id),
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(match_id, player_id, eval_attr)
);
CREATE INDEX IF NOT EXISTS idx_match_eval_match ON match_eval_scores(match_id);
