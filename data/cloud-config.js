/* Eignungstest-Trainer · lokale Stable-Konfiguration
   Phase 2: Cloud-Highscore ist bewusst deaktiviert, damit die PWA stabil offline/lokal läuft. */
window.CLOUD_HIGHSCORE_CONFIG = {
  enabled: false,
  provider: "local",
  supabaseUrl: "",
  anonKey: "",
  table: "highscores",
  limit: 20,
  allowAnonymous: true,
  classCode: "default"
};
