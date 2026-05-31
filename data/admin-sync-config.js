/* Eignungstest-Trainer  · Sync Global Learner Config
   Öffentliche Web-App-Konfiguration. Sicherheit läuft über Auth + Firestore Rules. */
window.EGT_SYNC_CONFIG = {
  enabled: true,
  mode: 'firestore',
  courseId: 'course_2026_gk',
  courseTitle: '2026-GK',
  learnerCodePrefix: '2026-GK-A',
  learnerCodeStart: 1,
  learnerCodeDigits: 3,
  maxRecentAttemptsPerLearner: 80,
  maxRecentEventsPerLearner: 160,
  syncConfig: {
    apiKey: 'AIzaSyCGvAoIdTqCNHSuI9Kc-0W3pGRv5iBLRlE',
    authDomain: 'bbq-userdatabase.syncapp.com',
    projectId: 'bbq-userdatabase',
    storageBucket: 'bbq-userdatabase.syncstorage.app',
    messagingSenderId: '610377924739',
    appId: '1:610377924739:web:191c5114b3ec8034c0dbb6',
    measurementId: 'G-9QNBMWBTCR'
  }
};
