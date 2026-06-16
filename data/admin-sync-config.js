/* Eignungstest-Trainer · Firebase UserDatabase Konfiguration
   G33.5 Demo Gates + Highscore Profile: UserDatabase läuft über Firebase/Firestore; Zugangscode-Generator speichert echte Codes in Firestore. Avatarbilder bleiben lokal auf dem Gerät.
   Ohne gültige Firebase-Konfiguration fällt die App kontrolliert in den lokalen Offline-Cache zurück,
   damit die PWA nicht unbenutzbar wird. */
window.EGT_SYNC_CONFIG = {
  enabled: true,
  mode: 'firebase-firestore',
  provider: 'firebase',
  database: 'firestore',
  sdkVersion: '12.14.0',
  courseId: 'course_2026_gk',
  courseTitle: '2026-GK',
  learnerCodePrefix: '2026-GK-A',
  // Admin-E-Mails: diese Accounts bekommen nach Firebase-Login automatisch Admin-Rechte
  // auch ohne Firestore-Profil (Bootstrapping-Mechanismus für den App-Eigentümer)
  adminEmails: ['ugurcan.boz@googlemail.com'],
  learnerCodeStart: 1,
  learnerCodeDigits: 3,
  maxRecentAttemptsPerLearner: 80,
  maxRecentEventsPerLearner: 160,
  useAnonymousAuth: true,
  requireRemoteUserDatabase: false,
  accessCodeRequireFirebase: true,

  // Firebase Web-App-Konfiguration.
  // Wichtig: Die Werte stehen zusätzlich auf Top-Level, weil ältere Sync-/Deploy-Checks
  // direkt window.EGT_SYNC_CONFIG.apiKey/authDomain/projectId/appId prüfen.
  apiKey: 'AIzaSyCGvAoIdTqCNHSuI9Kc-0W3pGRv5iBLRlE',
  authDomain: 'bbq-userdatabase.firebaseapp.com',
  databaseURL: 'https://bbq-userdatabase-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'bbq-userdatabase',
  storageBucket: 'bbq-userdatabase.firebasestorage.app',
  messagingSenderId: '610377924739',
  appId: '1:610377924739:web:191c5114b3ec8034c0dbb6',
  measurementId: 'G-9QNBMWBTCR',

  firebaseConfig: {
    apiKey: 'AIzaSyCGvAoIdTqCNHSuI9Kc-0W3pGRv5iBLRlE',
    authDomain: 'bbq-userdatabase.firebaseapp.com',
    databaseURL: 'https://bbq-userdatabase-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'bbq-userdatabase',
    storageBucket: 'bbq-userdatabase.firebasestorage.app',
    messagingSenderId: '610377924739',
    appId: '1:610377924739:web:191c5114b3ec8034c0dbb6',
    measurementId: 'G-9QNBMWBTCR'
  },
  syncConfig: {
    apiKey: 'AIzaSyCGvAoIdTqCNHSuI9Kc-0W3pGRv5iBLRlE',
    authDomain: 'bbq-userdatabase.firebaseapp.com',
    databaseURL: 'https://bbq-userdatabase-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'bbq-userdatabase',
    storageBucket: 'bbq-userdatabase.firebasestorage.app',
    messagingSenderId: '610377924739',
    appId: '1:610377924739:web:191c5114b3ec8034c0dbb6',
    measurementId: 'G-9QNBMWBTCR'
  },
  collections: {
    courses: 'courses',
    learners: 'learners',
    accessCodes: 'accessCodes',
    attempts: 'attempts',
    progress: 'progress',
    events: 'events'
  }
};
