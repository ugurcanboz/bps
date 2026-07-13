/* Eignungstest-Trainer · Cloud-Highscore-Konfiguration
   Supabase-Cloud-Highscore aktiviert (G54.7). Ranglisten werden in der
   Supabase-Tabelle "highscores" gespeichert und geräteübergreifend geteilt. */
window.CLOUD_HIGHSCORE_CONFIG = {
  enabled: !(window.EGT_RUNTIME_ENV && ['development','test'].includes(window.EGT_RUNTIME_ENV.name)),
  provider: "supabase",
  supabaseUrl: "https://ejlpxdjariucuxqlvepe.supabase.co",
  anonKey: "sb_publishable_KlOL5T8u1hvcJgZFwTRDCA_KiKfc1pJ",
  table: "highscores",
  limit: 20,
  allowAnonymous: true,
  classCode: "default",
  refreshIntervalMs: 20000
};
