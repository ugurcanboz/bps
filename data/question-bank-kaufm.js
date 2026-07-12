window.QUESTION_BANK_EXTERNAL = window.QUESTION_BANK_EXTERNAL || [];
window.QUESTION_BANK_EXTERNAL.push(
  {
    "id": "km_rech_001",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Ein Händler gewährt auf eine Ware im Wert von 400 € einen Rabatt von 15 %. Wie hoch ist der ermäßigte Preis?",
    "answers": [
      "340 €",
      "360 €",
      "350 €",
      "330 €"
    ],
    "correct": 0,
    "explanation": "15 % von 400 € sind 60 € (400 * 0,15 = 60). Der neue Preis beträgt 400 € - 60 € = 340 €.",
    "tags": [
      "kaufm-rechnen",
      "rabatt"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 2,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 17500,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "340 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "360 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "350 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "330 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_002",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Eine Rechnung über 1.200 € wird unter Abzug von 2 % Skonto bezahlt. Welcher Betrag muss überwiesen werden?",
    "answers": [
      "1.176 €",
      "1.180 €",
      "1.150 €",
      "1.198 €"
    ],
    "correct": 0,
    "explanation": "2 % Skonto von 1.200 € sind 24 € (1.200 * 0,02 = 24). Der Überweisungsbetrag ist 1.200 € - 24 € = 1.176 €.",
    "tags": [
      "kaufm-rechnen",
      "skonto"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 3,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 25000,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "1.176 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "1.180 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "1.150 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "1.198 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_003",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Drei Kopierer benötigen für einen großen Druckauftrag 6 Stunden. Wie lange würden 4 Kopierer gleicher Leistung für denselben Auftrag benötigen?",
    "answers": [
      "4,5 Stunden",
      "5 Stunden",
      "4 Stunden",
      "8 Stunden"
    ],
    "correct": 0,
    "explanation": "Antiproportionaler Dreisatz: Gesamtleistung entspricht 3 Kopierer * 6 Stunden = 18 Kopiererstunden. 4 Kopierer benötigen 18 / 4 = 4,5 Stunden.",
    "tags": [
      "kaufm-rechnen",
      "dreisatz"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "dreisatz",
      "difficulty": 3,
      "skill": "proportionaler_oder_antiproportionaler_dreisatz",
      "expectedTimeMs": 25000,
      "trap": "proportional_statt_antiproportional_gerechnet",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "4,5 Stunden",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "5 Stunden",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "4 Stunden",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "8 Stunden",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_004",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Wie hoch ist der Bruttobetrag einer Dienstleistung, deren Nettopreis 850 € bei einem Umsatzsteuersatz von 19 % beträgt?",
    "answers": [
      "1.011,50 €",
      "1.025,00 €",
      "990,50 €",
      "1.019,00 €"
    ],
    "correct": 0,
    "explanation": "Die Umsatzsteuer beträgt 19 % von 850 € = 161,50 €. Bruttobetrag: 850 € + 161,50 € = 1.011,50 €.",
    "tags": [
      "kaufm-rechnen",
      "umsatzsteuer"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 3,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 25000,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "1.011,50 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "1.025,00 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "990,50 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "1.019,00 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_005",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "hard",
    "question": "Ein Artikel wird mit 25 % Gewinnspanne auf den Einstandspreis von 80 € kalkuliert. Wie hoch ist der Verkaufspreis ohne Steuern?",
    "answers": [
      "100 €",
      "105 €",
      "95 €",
      "110 €"
    ],
    "correct": 0,
    "explanation": "Der Gewinnaufschlag beträgt 25 % auf den Einstandspreis (Selbstkosten). 80 € * 1,25 = 100 €.",
    "tags": [
      "kaufm-rechnen",
      "kalkulation"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 4,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 37500,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "100 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "105 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "95 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "110 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_006",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Guthaben von 5.000 € wird zu einem Zinssatz von 1,5 % p.a. angelegt. Wie hoch sind die Zinsen nach 9 Monaten (ohne Zinseszins)?",
    "answers": [
      "56,25 €",
      "75,00 €",
      "50,00 €",
      "62,50 €"
    ],
    "correct": 0,
    "explanation": "Jahreszins = 5.000 € * 0,015 = 75 €. Für 9 Monate (9/12 = 0,75 Jahre): 75 € * 0,75 = 56,25 €.",
    "tags": [
      "kaufm-rechnen",
      "zinsrechnen"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 3,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 25000,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "56,25 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "75,00 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "50,00 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "62,50 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_007",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "hard",
    "question": "Ein Büromöbelhersteller senkt den Verkaufspreis eines Schreibtisches um 10 % und gewährt bei Barzahlung nochmals 2 % Skonto. Wie hoch ist der Gesamtrabatt in Prozent?",
    "answers": [
      "11,8 %",
      "12,0 %",
      "11,5 %",
      "10,8 %"
    ],
    "correct": 0,
    "explanation": "Ausgangswert sei 100. Nach 10 % Rabatt bleiben 90. Darauf 2 % Skonto (1,8). Verbleibend 88,2. Gesamtminderung ist 100 - 88,2 = 11,8 %.",
    "tags": [
      "kaufm-rechnen",
      "rabattkette"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 4,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 37500,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "11,8 %",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "12,0 %",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "11,5 %",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "10,8 %",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_008",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Kopierer verbraucht in 30 Tagen bei durchschnittlicher Nutzung 4 Packungen Papier. Wie viele Packungen Papier werden hochgerechnet für 135 Tage benötigt?",
    "answers": [
      "18",
      "16",
      "20",
      "15"
    ],
    "correct": 0,
    "explanation": "Proportionaler Dreisatz: 4 / 30 * 135 = 18 Packungen.",
    "tags": [
      "kaufm-rechnen",
      "dreisatz"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "dreisatz",
      "difficulty": 3,
      "skill": "proportionaler_oder_antiproportionaler_dreisatz",
      "expectedTimeMs": 25000,
      "trap": "proportional_statt_antiproportional_gerechnet",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "18",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "16",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "20",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "15",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_009",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Großhändler kauft Ware für brutto 1.190 € (inkl. 19 % MwSt.). Wie viel Vorsteuer kann er beim Finanzamt geltend machen?",
    "answers": [
      "190 €",
      "226,10 €",
      "170 €",
      "199 €"
    ],
    "correct": 0,
    "explanation": "Nettobetrag = Bruttobetrag / 1,19 = 1.190 / 1,19 = 1.000 €. Die Umsatzsteuer (Vorsteuer) beträgt demnach 190 €.",
    "tags": [
      "kaufm-rechnen",
      "vorsteuer"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 3,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 25000,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "190 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "226,10 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "170 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "199 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_010",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Ein Mitarbeiter erhält 2.800 € Bruttogehalt. Davon werden 20 % für Lohnsteuer und 20 % für Sozialabgaben einbehalten. Wie hoch ist das Nettogehalt?",
    "answers": [
      "1.680 €",
      "1.720 €",
      "1.600 €",
      "1.800 €"
    ],
    "correct": 0,
    "explanation": "Abzüge gesamt = 40 % (20% + 20%). Nettogehalt = 60 % von 2.800 € = 2.800 * 0,60 = 1.680 €.",
    "tags": [
      "kaufm-rechnen",
      "gehaltsabrechnung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 2,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 17500,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "1.680 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "1.720 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "1.600 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "1.800 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_011",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Für die Renovierung von 3 Büroräumen werden 5 Arbeiter für 4 Tage benötigt. Wie viele Tage brauchen 2 Arbeiter gleicher Arbeitsgeschwindigkeit?",
    "answers": [
      "10 Tage",
      "8 Tage",
      "6 Tage",
      "12 Tage"
    ],
    "correct": 0,
    "explanation": "Gesamtaufwand: 5 Arbeiter * 4 Tage = 20 Personentage. 2 Arbeiter benötigen: 20 Personentage / 2 Arbeiter = 10 Tage.",
    "tags": [
      "kaufm-rechnen",
      "dreisatz"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "dreisatz",
      "difficulty": 3,
      "skill": "proportionaler_oder_antiproportionaler_dreisatz",
      "expectedTimeMs": 25000,
      "trap": "proportional_statt_antiproportional_gerechnet",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "10 Tage",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "8 Tage",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "6 Tage",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "12 Tage",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_012",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Einzelhändler kalkuliert den Verkaufspreis einer Ware mit 30 % Handelsspanne auf den Netto-Verkaufspreis von 200 €. Wie hoch sind die Selbstkosten?",
    "answers": [
      "140 €",
      "170 €",
      "150 €",
      "160 €"
    ],
    "correct": 0,
    "explanation": "Eine Handelsspanne von 30 % auf den Verkaufspreis von 200 € entspricht 60 €. Die Selbstkosten liegen bei 200 € - 60 € = 140 €.",
    "tags": [
      "kaufm-rechnen",
      "kalkulation"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 3,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 25000,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "140 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "170 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "150 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "160 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_013",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "hard",
    "question": "Eine Fracht kostet für 240 km Strecke 480 €. Wie viel kostet die Fracht für eine Strecke von 360 km unter der Annahme, dass ab 300 km ein Rabatt von 10 % auf den Gesamtpreis gewährt wird?",
    "answers": [
      "648 €",
      "720 €",
      "680 €",
      "612 €"
    ],
    "correct": 0,
    "explanation": "Preis pro km = 480 € / 240 km = 2 €/km. Standardpreis für 360 km = 720 €. Da über 300 km: 10 % Rabatt auf 720 € = 72 €. Neuer Preis: 648 €.",
    "tags": [
      "kaufm-rechnen",
      "dreisatz",
      "rabatt"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 4,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 37500,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "648 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "720 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "680 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "612 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_014",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Eine Kaffeemaschine kostet brutto 119 € (inkl. 19 % MwSt.). Was kostet sie netto?",
    "answers": [
      "100 €",
      "99 €",
      "101 €",
      "95 €"
    ],
    "correct": 0,
    "explanation": "Netto = Brutto / 1,19 = 119 € / 1,19 = 100 €.",
    "tags": [
      "kaufm-rechnen",
      "mehrwertsteuer"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 3,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 25000,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "100 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "99 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "101 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "95 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_015",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Ein Büromaterial-Lieferant liefert Schreibblöcke für 1,20 € netto das Stück. Bei Abnahme von über 100 Stück sinkt der Preis auf 1,00 € netto. Wie hoch ist die Ersparnis bei 120 Schreibblöcken im Vergleich zum Normalpreis?",
    "answers": [
      "24 €",
      "20 €",
      "12 €",
      "16 €"
    ],
    "correct": 0,
    "explanation": "Normalpreis: 120 * 1,20 € = 144 €. Rabattpreis: 120 * 1,00 € = 120 €. Die Ersparnis beträgt 144 € - 120 € = 24 €.",
    "tags": [
      "kaufm-rechnen",
      "mengenrabatt"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "kopfrechnen",
      "difficulty": 2,
      "skill": "mathe_grundrechnen",
      "expectedTimeMs": 17500,
      "trap": "rechenfehler_durch_zeitdruck",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "24 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "20 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "12 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "16 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_016",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Kaufmann erzielt einen Jahresumsatz von 1.500.000 € bei Gesamtkosten von 1.200.000 €. Wie hoch ist die Umsatzrendite in Prozent?",
    "answers": [
      "20 %",
      "25 %",
      "15 %",
      "30 %"
    ],
    "correct": 0,
    "explanation": "Gewinn = Umsatz - Kosten = 300.000 €. Umsatzrendite = (Gewinn / Umsatz) * 100 = (300.000 / 1.500.000) * 100 = 20 %.",
    "tags": [
      "kaufm-rechnen",
      "kennzahlen"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "kopfrechnen",
      "difficulty": 3,
      "skill": "mathe_grundrechnen",
      "expectedTimeMs": 25000,
      "trap": "rechenfehler_durch_zeitdruck",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "20 %",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "25 %",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "15 %",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "30 %",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_017",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Wie hoch ist der Zinssatz p.a., wenn eine Anlage von 10.000 € in einem halben Jahr 150 € Zinsen abwirft?",
    "answers": [
      "3,0 %",
      "1,5 %",
      "2,0 %",
      "4,0 %"
    ],
    "correct": 0,
    "explanation": "Halbjahreszins = 150 € -> Jahreszins = 300 €. Zinssatz = (300 € / 10.000 €) * 100 = 3,0 % p.a.",
    "tags": [
      "kaufm-rechnen",
      "zinsrechnen"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "kopfrechnen",
      "difficulty": 3,
      "skill": "mathe_grundrechnen",
      "expectedTimeMs": 25000,
      "trap": "rechenfehler_durch_zeitdruck",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "3,0 %",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "1,5 %",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "2,0 %",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "4,0 %",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_018",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Vorrat reicht bei 8 Personen für 15 Tage. Wie viele Tage reicht er bei 6 Personen?",
    "answers": [
      "20 Tage",
      "18 Tage",
      "16 Tage",
      "22 Tage"
    ],
    "correct": 0,
    "explanation": "Gesamttage = 8 Personen * 15 Tage = 120 Tage. Für 6 Personen reicht der Vorrat 120 / 6 = 20 Tage.",
    "tags": [
      "kaufm-rechnen",
      "dreisatz"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "dreisatz",
      "difficulty": 3,
      "skill": "proportionaler_oder_antiproportionaler_dreisatz",
      "expectedTimeMs": 25000,
      "trap": "proportional_statt_antiproportional_gerechnet",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "20 Tage",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "18 Tage",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "16 Tage",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "22 Tage",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_019",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "hard",
    "question": "Eine Aktie steigt am ersten Tag um 10 % und fällt am zweiten Tag um 10 %. Wie hat sich der Wert der Aktie nach zwei Tagen verändert?",
    "answers": [
      "Um 1 % gesunken",
      "Gleich geblieben",
      "Um 1 % gestiegen",
      "Um 2 % gesunken"
    ],
    "correct": 0,
    "explanation": "Wert am Anfang = 100 %. Tag 1: 110 %. Tag 2: 110 % * 0,90 = 99 %. Der Wert ist somit um 1 % gesunken.",
    "tags": [
      "kaufm-rechnen",
      "prozentrechnen"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 4,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 37500,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "Um 1 % gesunken",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Gleich geblieben",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "Um 1 % gestiegen",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "Um 2 % gesunken",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_rech_020",
    "source": "kaufm-bank-v9",
    "category": "Kaufm. Rechnen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Eine Dienstleistung wird für 4.000 € kalkuliert. Der Kunde verhandelt 5 % Rabatt. Welcher Betrag steht nach Abzug des Rabatts auf der Rechnung?",
    "answers": [
      "3.800 €",
      "3.900 €",
      "3.750 €",
      "3.850 €"
    ],
    "correct": 0,
    "explanation": "5 % von 4.000 € sind 200 €. Rechnungsbetrag: 4.000 € - 200 € = 3.800 €.",
    "tags": [
      "kaufm-rechnen",
      "rabatrechnung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "kaufmaennisch",
      "subtype": "prozent",
      "difficulty": 3,
      "skill": "prozentwert_berechnen",
      "expectedTimeMs": 25000,
      "trap": "prozentwert_mit_grundwert_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "3.800 €",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "3.900 €",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "3.750 €",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        },
        {
          "value": "3.850 €",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Rechenfehler oder falsches prozentuales Verhältnis."
        }
      ]
    }
  },
  {
    "id": "km_buero_001",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Welche Abkürzung steht für die Europäische Artikelnummer?",
    "answers": [
      "EAN",
      "ISBN",
      "VAT",
      "USt"
    ],
    "correct": 0,
    "explanation": "EAN steht für European Article Number (heute GTIN). ISBN ist für Bücher, VAT ist Umsatzsteuer (engl.), USt ist Umsatzsteuer (dt.).",
    "tags": [
      "buero-wissen",
      "abkuerzung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "EAN",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "ISBN",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "VAT",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "USt",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_002",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Welches Gesetz regelt die Rechte und Pflichten von Auszubildenden und ausbildenden Betrieben primär?",
    "answers": [
      "Berufsbildungsgesetz (BBiG)",
      "Betriebsverfassungsgesetz (BetrVG)",
      "Arbeitszeitgesetz (ArbZG)",
      "Bürgerliches Gesetzbuch (BGB)"
    ],
    "correct": 0,
    "explanation": "Das Berufsbildungsgesetz (BBiG) regelt die berufliche Ausbildung in Deutschland.",
    "tags": [
      "buero-wissen",
      "recht",
      "ausbildung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Berufsbildungsgesetz (BBiG)",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Betriebsverfassungsgesetz (BetrVG)",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Arbeitszeitgesetz (ArbZG)",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Bürgerliches Gesetzbuch (BGB)",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_003",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Was versteht man unter einer 'Vollmacht', die zu allen banküblichen Geschäften im Rahmen eines Geschäftsbetriebs berechtigt?",
    "answers": [
      "Prokura",
      "Handlungsvollmacht",
      "Generalvollmacht",
      "Einzelvollmacht"
    ],
    "correct": 0,
    "explanation": "Die Prokura ist eine weitgehende geschäftliche Vertretungsmacht, die im Handelsregister eingetragen wird.",
    "tags": [
      "buero-wissen",
      "recht",
      "vollmacht"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Prokura",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Handlungsvollmacht",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Generalvollmacht",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Einzelvollmacht",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_004",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Wo müssen neu gegründete Kapitalgesellschaften (wie z. B. eine GmbH) eingetragen werden, um rechtlich zu entstehen?",
    "answers": [
      "Handelsregister (Abteilung B)",
      "Gewerbeamt",
      "Handelsregister (Abteilung A)",
      "Finanzamt"
    ],
    "correct": 0,
    "explanation": "Kapitalgesellschaften werden in das Handelsregister Abteilung B eingetragen. Personengesellschaften und Einzelkaufleute in Abteilung A.",
    "tags": [
      "buero-wissen",
      "recht",
      "handelsregister"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Handelsregister (Abteilung B)",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Gewerbeamt",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Handelsregister (Abteilung A)",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Finanzamt",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_005",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Wie nennt man die Gegenüberstellung von Vermögen (Aktiva) und Schulden (Passiva) eines Unternehmens zu einem bestimmten Stichtag?",
    "answers": [
      "Bilanz",
      "Gewinn- und Verlustrechnung (GuV)",
      "Cashflow-Rechnung",
      "Betriebswirtschaftliche Auswertung (BWA)"
    ],
    "correct": 0,
    "explanation": "Die Bilanz zeigt die Aktiva (Verwendung der Mittel) und Passiva (Herkunft der Mittel) zu einem Stichtag.",
    "tags": [
      "buero-wissen",
      "rechnungswesen"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Bilanz",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Gewinn- und Verlustrechnung (GuV)",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Cashflow-Rechnung",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Betriebswirtschaftliche Auswertung (BWA)",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_006",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Wie lang ist die gesetzliche Aufbewahrungsfrist für Buchungsbelege und Rechnungen in Deutschland?",
    "answers": [
      "10 Jahre",
      "5 Jahre",
      "6 Jahre",
      "8 Jahre"
    ],
    "correct": 0,
    "explanation": "Nach § 257 HGB und § 147 AO müssen Buchungsbelege und Rechnungen 10 Jahre aufbewahrt werden.",
    "tags": [
      "buero-wissen",
      "recht",
      "aufbewahrung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "10 Jahre",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "5 Jahre",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "6 Jahre",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "8 Jahre",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_007",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Was regelt die DIN 5008 im Büroalltag?",
    "answers": [
      "Schreib- und Gestaltungsregeln für die Textverarbeitung",
      "Die Größe von Aktenordnern",
      "Die Maße von Schreibtischen",
      "Die Struktur von E-Mail-Servern"
    ],
    "correct": 0,
    "explanation": "Die DIN 5008 legt Schreib- und Gestaltungsregeln für Briefe, E-Mails und Textverarbeitung fest.",
    "tags": [
      "buero-wissen",
      "din",
      "briefe"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Schreib- und Gestaltungsregeln für die Textverarbeitung",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Die Größe von Aktenordnern",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Die Maße von Schreibtischen",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Die Struktur von E-Mail-Servern",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_008",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Welche der folgenden Sozialversicherungen gehört in Deutschland NICHT zum Standard-Sozialversicherungssystem?",
    "answers": [
      "Haftpflichtversicherung",
      "Rentenversicherung",
      "Krankenversicherung",
      "Pflegeversicherung"
    ],
    "correct": 0,
    "explanation": "Die Haftpflichtversicherung ist eine private bzw. gewerbliche Sachversicherung, keine gesetzliche Sozialversicherung.",
    "tags": [
      "buero-wissen",
      "sozialversicherung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Haftpflichtversicherung",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Rentenversicherung",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Krankenversicherung",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Pflegeversicherung",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_009",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Wie nennt man den Kaufvertrag, bei dem der Käufer die Ware sofort prüft, bezahlt und mitnimmt?",
    "answers": [
      "Kauf in bar / Barkauf",
      "Ratenkauf",
      "Kauf auf Probe",
      "Kauf auf Ziel"
    ],
    "correct": 0,
    "explanation": "Wenn Zahlung und Übergabe sofort vor Ort erfolgen, spricht man vom klassischen Barkauf.",
    "tags": [
      "buero-wissen",
      "recht",
      "kaufvertrag"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Kauf in bar / Barkauf",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Ratenkauf",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Kauf auf Probe",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Kauf auf Ziel",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_010",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Welche Abkürzung steht für das europäische System zur Abwicklung von Euro-Zahlungsverkehrstransaktionen?",
    "answers": [
      "SEPA",
      "IBAN",
      "SWIFT",
      "BIC"
    ],
    "correct": 0,
    "explanation": "SEPA steht für Single Euro Payments Area.",
    "tags": [
      "buero-wissen",
      "zahlungsverkehr"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "SEPA",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "IBAN",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "SWIFT",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "BIC",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_011",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Zu welchen Gütern gehören Bürostühle und Laptops in der Buchhaltung eines Unternehmens?",
    "answers": [
      "Anlagevermögen",
      "Umlaufvermögen",
      "Eigenkapital",
      "Rechnungsabgrenzungsposten"
    ],
    "correct": 0,
    "explanation": "Gegenstände, die dem Unternehmen dauerhaft dienen, gehören zum Anlagevermögen.",
    "tags": [
      "buero-wissen",
      "buchhaltung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Anlagevermögen",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Umlaufvermögen",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Eigenkapital",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Rechnungsabgrenzungsposten",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_012",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Was bedeutet die Abkürzung 'AGb' im Vertragsrecht?",
    "answers": [
      "Allgemeine Geschäftsbedingungen",
      "Arbeitsgemeinschaft des Bundes",
      "Allgemeines Gesetzbuch",
      "Aktiengesellschaft-Beteiligung"
    ],
    "correct": 0,
    "explanation": "AGB steht für Allgemeine Geschäftsbedingungen.",
    "tags": [
      "buero-wissen",
      "abkuerzung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Allgemeine Geschäftsbedingungen",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Arbeitsgemeinschaft des Bundes",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Allgemeines Gesetzbuch",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Aktiengesellschaft-Beteiligung",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_013",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Welche Angabe muss zwingend auf einer ordnungsgemäßen Rechnung ab 250 € Bruttowert vorhanden sein, nicht aber auf einer Kleinbetragsrechnung?",
    "answers": [
      "Steuernummer oder Umsatzsteuer-Identifikationsnummer des Leistenden",
      "Name und Anschrift des Leistenden",
      "Liefertermin oder Leistungszeitpunkt",
      "Bruttobetrag"
    ],
    "correct": 0,
    "explanation": "Rechnungen über 250 € müssen unter anderem die Steuernummer oder USt-IdNr. des Leistenden und den Empfänger enthalten. Kleinbetragsrechnungen sind hier befreit.",
    "tags": [
      "buero-wissen",
      "recht",
      "rechnung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Steuernummer oder Umsatzsteuer-Identifikationsnummer des Leistenden",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Name und Anschrift des Leistenden",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Liefertermin oder Leistungszeitpunkt",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Bruttobetrag",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_014",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Welcher Rechtsform gehört ein Unternehmen an, dessen Firmenname auf 'e.K.' endet?",
    "answers": [
      "eingetragener Kaufmann / eingetragene Kauffrau",
      "einfaches Konsortium",
      "eingetragene Körperschaft",
      "Einzelunternehmen ohne Handelsregistereintrag"
    ],
    "correct": 0,
    "explanation": "e.K. steht für eingetragener Kaufmann / eingetragene Kauffrau (Handelsregister A).",
    "tags": [
      "buero-wissen",
      "recht",
      "rechtsformen"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "eingetragener Kaufmann / eingetragene Kauffrau",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "einfaches Konsortium",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "eingetragene Körperschaft",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Einzelunternehmen ohne Handelsregistereintrag",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_015",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Welches Programm wird im Büroalltag primär für Tabellenkalkulationen und Datenanalysen verwendet?",
    "answers": [
      "Microsoft Excel",
      "Microsoft Word",
      "Microsoft PowerPoint",
      "Microsoft Outlook"
    ],
    "correct": 0,
    "explanation": "Excel ist das Standardprogramm für Tabellenkalkulation.",
    "tags": [
      "buero-wissen",
      "software"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Microsoft Excel",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Microsoft Word",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Microsoft PowerPoint",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Microsoft Outlook",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_016",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Was beschreibt der Begriff 'Organisationsmittel' im Büro?",
    "answers": [
      "Gegenstände und Medien zur Unterstützung der Arbeitsabläufe",
      "Eine Gehaltserhöhung",
      "Ein Medikament",
      "Ein Gremium von Managern"
    ],
    "correct": 0,
    "explanation": "Organisationsmittel sind Werkzeuge, Dokumente und Hilfsmittel zur Strukturierung der Büroarbeit (z. B. Kalender, Ablagesysteme).",
    "tags": [
      "buero-wissen",
      "organisation"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Gegenstände und Medien zur Unterstützung der Arbeitsabläufe",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Eine Gehaltserhöhung",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Ein Medikament",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Ein Gremium von Managern",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_017",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Wann befindet sich ein Käufer im 'Zahlungsverzug'?",
    "answers": [
      "Wenn er eine fällige Rechnung trotz Mahnung oder nach Ablauf einer Frist nicht zahlt",
      "Sobald er das Paket erhält",
      "Sobald der Vertrag unterschrieben ist",
      "Wenn er per Ratenzahlung zahlt"
    ],
    "correct": 0,
    "explanation": "Zahlungsverzug tritt ein, wenn eine fällige Leistung nicht erbracht wird und Mahnung bzw. Fristen abgelaufen sind (oder 30 Tage nach Rechnungserhalt).",
    "tags": [
      "buero-wissen",
      "recht",
      "verzug"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Wenn er eine fällige Rechnung trotz Mahnung oder nach Ablauf einer Frist nicht zahlt",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Sobald er das Paket erhält",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Sobald der Vertrag unterschrieben ist",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Wenn er per Ratenzahlung zahlt",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_018",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Was ist die Kernaufgabe der Personalabteilung (HR)?",
    "answers": [
      "Personalplanung, -beschaffung, -betreuung und -entwicklung",
      "Der Verkauf von Software-Lizenzen",
      "Die Reparatur von Büromaschinen",
      "Die Reinigung der Büroräume"
    ],
    "correct": 0,
    "explanation": "HR (Human Resources) kümmert sich um alle Belange rund um die Mitarbeiter und deren Organisation im Unternehmen.",
    "tags": [
      "buero-wissen",
      "hr"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Personalplanung, -beschaffung, -betreuung und -entwicklung",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Der Verkauf von Software-Lizenzen",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Die Reparatur von Büromaschinen",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Die Reinigung der Büroräume",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_019",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Welche Behörde überwacht die Einhaltung des Datenschutzes im Unternehmen?",
    "answers": [
      "Die Landesbeauftragten für den Datenschutz",
      "Das Gewerbeamt",
      "Das Bundeskartellamt",
      "Die Bundesnetzagentur"
    ],
    "correct": 0,
    "explanation": "In Deutschland überwachen die Datenschutzbeauftragten der Bundesländer die Einhaltung des Datenschutzes bei Unternehmen.",
    "tags": [
      "buero-wissen",
      "datenschutz",
      "behoerde"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Die Landesbeauftragten für den Datenschutz",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Das Gewerbeamt",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Das Bundeskartellamt",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Die Bundesnetzagentur",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_buero_020",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Was bedeutet das ökonomische Prinzip (Wirtschaftlichkeitsprinzip) im kaufmännischen Denken?",
    "answers": [
      "Mit gegebenen Mitteln das maximale Ziel oder ein Ziel mit minimalen Mitteln erreichen",
      "Immer das billigste Produkt kaufen",
      "Keine Steuern zu zahlen",
      "Jedes Jahr neue Büromöbel anschaffen"
    ],
    "correct": 0,
    "explanation": "Das ökonomische Prinzip teilt sich in das Maximalprinzip (gegebener Aufwand -> maximaler Ertrag) und das Minimalprinzip (gewünschter Ertrag -> minimaler Aufwand).",
    "tags": [
      "buero-wissen",
      "oekonomie"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "buerowissen",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Mit gegebenen Mitteln das maximale Ziel oder ein Ziel mit minimalen Mitteln erreichen",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Immer das billigste Produkt kaufen",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Keine Steuern zu zahlen",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Jedes Jahr neue Büromöbel anschaffen",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_001",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Folgende Briefe müssen sortiert werden. Brief A kam am 12.03. an und betrifft Reklamation. Brief B kam am 10.03. an und ist ein Angebot. Brief C kam am 12.03. an und ist eine Kündigung. Welche Bearbeitungsreihenfolge ist nach Dringlichkeit (Fristen wahren) optimal?",
    "answers": [
      "Kündigung (C), Reklamation (A), Angebot (B)",
      "Angebot (B), Kündigung (C), Reklamation (A)",
      "Kündigung (C), Angebot (B), Reklamation (A)",
      "Reklamation (A), Kündigung (C), Angebot (B)"
    ],
    "correct": 0,
    "explanation": "Kündigungen haben oft strikte Fristen. Reklamationen erfordern ebenfalls zügige Bearbeitung zur Fehlervermeidung. Angebote sind meist etwas flexibler oder werblicher Natur.",
    "tags": [
      "buero-organisation",
      "priorisierung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Kündigung (C), Reklamation (A), Angebot (B)",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Angebot (B), Kündigung (C), Reklamation (A)",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Kündigung (C), Angebot (B), Reklamation (A)",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Reklamation (A), Kündigung (C), Angebot (B)",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_002",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Archiv ist alphabetisch nach Nachnamen geordnet. Wo wird der Ordner von 'Dr. Max de Boer' eingeordnet?",
    "answers": [
      "Unter D (de Boer)",
      "Unter B (Boer)",
      "Unter D (Dr.)",
      "Unter M (Max)"
    ],
    "correct": 1,
    "explanation": "Nach den Regeln der alphabetischen Namenssortierung (z.B. DIN 5007) werden Namensbestandteile wie 'de' oder 'von' dem Hauptnamen nachgestellt (Boer, Max de). Der Ordner wird also unter B eingereiht. Akademische Titel wie 'Dr.' werden ignoriert.",
    "tags": [
      "buero-organisation",
      "archivierung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Unter D (de Boer)",
          "index": 0,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Unter B (Boer)",
          "index": 1,
          "errorPath": "correct"
        },
        {
          "value": "Unter D (Dr.)",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Unter M (Max)",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_003",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "hard",
    "question": "Ein Projektleiter hat 5 Aufgaben. A (Dringend & Wichtig, Frist heute), B (Nicht dringend, Wichtig), C (Dringend, Nicht wichtig), D (Nicht dringend, Nicht wichtig). In welcher Reihenfolge nach dem Eisenhower-Prinzip sollte er vorgehen?",
    "answers": [
      "A -> C -> B -> D",
      "A -> B -> C -> D",
      "C -> A -> B -> D",
      "B -> A -> C -> D"
    ],
    "correct": 0,
    "explanation": "Eisenhower-Prinzip: Zuerst A (sofort erledigen), dann C (delegieren oder schnell einschieben, weil dringend), danach B (terminieren) und zuletzt D (eliminieren oder ganz hinten anstellen).",
    "tags": [
      "buero-organisation",
      "eisenhower"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 4,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 22500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "A -> C -> B -> D",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "A -> B -> C -> D",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "C -> A -> B -> D",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "B -> A -> C -> D",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_004",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Welche Schreibweise entspricht der DIN 5008 für Datumsangaben im Briefkopf?",
    "answers": [
      "2026-05-26",
      "26. Maien 2026",
      "26.05.26",
      "Mai 26, 2026"
    ],
    "correct": 0,
    "explanation": "Die internationale Schreibweise nach DIN 5008 lautet YYYY-MM-DD (z.B. 2026-05-26). Alternativ ist auch '26. Mai 2026' erlaubt.",
    "tags": [
      "buero-wissen",
      "din5008"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "2026-05-26",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "26. Maien 2026",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "26.05.26",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Mai 26, 2026",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_005",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Kunde sendet eine E-Mail mit einer Beschwerde über ein fehlerhaftes Produkt. Wie verhält man sich als Sachbearbeiter professionell?",
    "answers": [
      "Den Eingang bestätigen, den Sachverhalt sachlich prüfen und zeitnah eine lösungsorientierte Antwort senden",
      "Die E-Mail ignorieren",
      "Dem Kunden per Mail mitteilen, dass er selbst schuld ist",
      "Sofort eine unüberlegte Gutschrift senden ohne Prüfung"
    ],
    "correct": 0,
    "explanation": "Kundenorientierte Reklamationsbearbeitung erfordert Höflichkeit, Schnelligkeit und eine sachliche, strukturierte Prüfung.",
    "tags": [
      "buero-wissen",
      "kommunikation"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Den Eingang bestätigen, den Sachverhalt sachlich prüfen und zeitnah eine lösungsorientierte Antwort senden",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Die E-Mail ignorieren",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Dem Kunden per Mail mitteilen, dass er selbst schuld ist",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Sofort eine unüberlegte Gutschrift senden ohne Prüfung",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_006",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Welche Datenstruktur eignet sich am besten, um hierarchische Beziehungen (z.B. die Struktur eines Konzerns mit Abteilungen) grafisch darzustellen?",
    "answers": [
      "Organigramm",
      "Flussdiagramm",
      "Balkendiagramm",
      "Mindmap"
    ],
    "correct": 0,
    "explanation": "Ein Organigramm stellt die Aufbauorganisation und Hierarchien eines Unternehmens übersichtlich dar.",
    "tags": [
      "buero-organisation",
      "visualisierung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Organigramm",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Flussdiagramm",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Balkendiagramm",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Mindmap",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_007",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Welches Dokument dient dazu, Beschlüsse und Diskussionsverlauf eines geschäftlichen Meetings festzuhalten?",
    "answers": [
      "Protokoll",
      "Tagesordnung",
      "Ablaufplan",
      "Einladung"
    ],
    "correct": 0,
    "explanation": "Das Protokoll (Ergebnis- oder Verlaufsprotokoll) dokumentiert ein Meeting rechtssicher und nachvollziehbar.",
    "tags": [
      "buero-organisation",
      "meeting"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Protokoll",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Tagesordnung",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Ablaufplan",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Einladung",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_008",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Lieferant liefert versehentlich 12 statt 10 Kartons Kopierpapier. Der Lieferschein weist 10 Kartons aus. Wie reagiert die Warenannahme?",
    "answers": [
      "Die Abweichung auf dem Lieferschein vermerken, den Fahrer unterschreiben lassen und den Einkauf/Lieferanten informieren",
      "Die 2 Extra-Kartons einfach behalten ohne Nachricht",
      "Die gesamte Lieferung verweigern",
      "Die 2 Extra-Kartons auf der Straße verschenken"
    ],
    "correct": 0,
    "explanation": "Bei Falschlieferungen (Überlieferung) muss dies unverzüglich dokumentiert und dem Lieferanten gemeldet werden (Rügepflicht im Handelsverkehr).",
    "tags": [
      "buero-organisation",
      "warenannahme"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Die Abweichung auf dem Lieferschein vermerken, den Fahrer unterschreiben lassen und den Einkauf/Lieferanten informieren",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Die 2 Extra-Kartons einfach behalten ohne Nachricht",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Die gesamte Lieferung verweigern",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Die 2 Extra-Kartons auf der Straße verschenken",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_009",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Welches Kürzel in einem Brief bedeutet, dass noch weitere Dokumente beigelegt sind?",
    "answers": [
      "Anl.",
      "i.A.",
      "p.P.",
      "z.H."
    ],
    "correct": 0,
    "explanation": "Anl. steht für Anlagen. i.A. heißt 'im Auftrag', p.P. heißt 'per Procura' (Prokura) und z.H. bedeutet 'zu Händen'.",
    "tags": [
      "buero-wissen",
      "abkuerzung"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Anl.",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "i.A.",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "p.P.",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "z.H.",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_010",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "easy",
    "question": "Wie nennt man die zeitliche Erfassung und Planung von zukünftigen Geldeingängen und Geldausgängen im Betrieb?",
    "answers": [
      "Liquiditätsplanung",
      "Bilanzierung",
      "Inventur",
      "Kostenstellenrechnung"
    ],
    "correct": 0,
    "explanation": "Die Liquiditätsplanung sichert die Zahlungsfähigkeit des Unternehmens, indem Zahlungsströme abgeglichen werden.",
    "tags": [
      "buero-wissen",
      "finanzen"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 2,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 10500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Liquiditätsplanung",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Bilanzierung",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Inventur",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "Kostenstellenrechnung",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_011",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "hard",
    "question": "In einer Tabelle sind fünf Produkte nach Umsatz sortiert. A (10.000 €), B (25.000 €), C (5.000 €), D (40.000 €), E (15.000 €). Welche Produkte machen zusammen über 75 % des Gesamtumsatzes aus?",
    "answers": [
      "D, B und E",
      "D und B",
      "A, B und D",
      "E, D und A"
    ],
    "correct": 0,
    "explanation": "Gesamtumsatz = 10k + 25k + 5k + 40k + 15k = 95.000 €. 75 % von 95.000 € = 71.250 €. D + B + E = 40k + 25k + 15k = 80.000 € (über 75 %). D + B ist nur 65k (unter 75 %).",
    "tags": [
      "buero-analyse",
      "tabelle"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 4,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 22500,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "D, B und E",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "D und B",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "A, B und D",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "E, D und A",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  },
  {
    "id": "km_org_012",
    "source": "kaufm-bank-v9",
    "category": "Bürowissen",
    "group": "Kaufmännisch",
    "subtype": "mc",
    "difficulty": "medium",
    "question": "Ein Mitarbeiter arbeitet wöchentlich 40 Stunden. Bei einer 5-Tage-Woche hat er Anspruch auf 30 Tage Urlaub im Jahr. Wie viele Urlaubstage entsprechen einer Arbeitswoche?",
    "answers": [
      "5 Tage",
      "6 Tage",
      "4 Tage",
      "7 Tage"
    ],
    "correct": 0,
    "explanation": "30 Tage Urlaub geteilt durch 6 Arbeitswochen (30 / (30/5)) = 5 Tage Urlaub entsprechen exakt einer vollen Arbeitswoche (5 Arbeitstage).",
    "tags": [
      "buero-wissen",
      "recht",
      "urlaub"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "gemischt",
      "subtype": "mc",
      "difficulty": 3,
      "skill": "gemischt_grundskill",
      "expectedTimeMs": 15000,
      "trap": "denkfehler_oder_voreiliger_schluss",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "5 Tage",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "6 Tage",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "4 Tage",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        },
        {
          "value": "7 Tage",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Ablenkungsantwort gewählt. Bitte Erklärung prüfen."
        }
      ]
    }
  }
);
