/* Eignungstest-Trainer.0.2 · Cloud Highscore Config
   Zentrale Supabase-Konfiguration. Nur diese Datei anpassen, nie direkt in app.js. */
window.CLOUD_HIGHSCORE_CONFIG = {
  enabled: true,
  provider: "supabase",
  supabaseUrl: "https://ejlpxdjariucuxqlvepe.supabase.co",
  anonKey: "sb_publishable_KlOL5T8u1hvcJgZFwTRDCA_KiKfc1pJ",
  table: "highscores",
  limit: 20,
  allowAnonymous: true,
  classCode: "default"
};
