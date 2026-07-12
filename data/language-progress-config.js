/* Eignungstest-Trainer · Language Progress Supabase Config
   G54.43.9K · explicit config for Sprachtraining progress sync.
   Uses the same Supabase project credentials as cloud-config.js, but writes to a dedicated progress table. */
window.LANGUAGE_PROGRESS_SUPABASE_CONFIG = {
  enabled: true,
  provider: 'supabase',
  supabaseUrl: (window.CLOUD_HIGHSCORE_CONFIG && window.CLOUD_HIGHSCORE_CONFIG.supabaseUrl) || 'https://ejlpxdjariucuxqlvepe.supabase.co',
  anonKey: (window.CLOUD_HIGHSCORE_CONFIG && window.CLOUD_HIGHSCORE_CONFIG.anonKey) || 'sb_publishable_KlOL5T8u1hvcJgZFwTRDCA_KiKfc1pJ',
  table: 'language_progress',
  schemaVersion: '2026-06-22-g54-43-9i',
  allowAnonymous: true,
  offlineFallback: true,
  activeLanguages: ['english'],
  activeLevels: ['A1'],
  mode: 'sprachtraining-progress-only'
};
