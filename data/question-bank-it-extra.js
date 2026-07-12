window.QUESTION_BANK_EXTERNAL = window.QUESTION_BANK_EXTERNAL || [];
window.QUESTION_BANK_EXTERNAL.push(
  {
    "id": "it_net_001",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "medium",
    "question": "Auf welcher Schicht des OSI-Referenzmodells arbeitet ein IP-Router primär?",
    "answers": [
      "Schicht 3 (Netzwerkschicht / Network Layer)",
      "Schicht 2 (Sicherungsschicht / Data Link Layer)",
      "Schicht 4 (Transportschicht / Transport Layer)",
      "Schicht 7 (Anwendungsschicht / Application Layer)"
    ],
    "correct": 0,
    "explanation": "Router arbeiten auf Schicht 3 (Network Layer) und leiten Pakete anhand von IP-Adressen weiter.",
    "tags": [
      "it-fisi",
      "osi",
      "netzwerk"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "netzwerk",
      "difficulty": 3,
      "skill": "netzwerkschichten_oder_protokolle_bestimmen",
      "expectedTimeMs": 18000,
      "trap": "protokoll_oder_port_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Schicht 3 (Netzwerkschicht / Network Layer)",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Schicht 2 (Sicherungsschicht / Data Link Layer)",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Schicht 4 (Transportschicht / Transport Layer)",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Schicht 7 (Anwendungsschicht / Application Layer)",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_net_002",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "hard",
    "question": "Wie viele nutzbare Host-IP-Adressen stehen in einem Subnetz mit der CIDR-Notation /26 zur Verfügung?",
    "answers": [
      "62",
      "64",
      "30",
      "126"
    ],
    "correct": 0,
    "explanation": "/26 bedeutet eine Subnetzmaske von 255.255.255.192. Das Netz hat 2^(32-26) = 64 Adressen. Abzüglich Netzadresse und Broadcastadresse bleiben 62 nutzbare Host-IPs.",
    "tags": [
      "it-fisi",
      "subnetting",
      "netzwerk"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "netzwerk",
      "difficulty": 4,
      "skill": "netzwerkschichten_oder_protokolle_bestimmen",
      "expectedTimeMs": 27000,
      "trap": "protokoll_oder_port_verwechselt",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "62",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "64",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "30",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "126",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_net_003",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "easy",
    "question": "Welches Protokoll ordnet IP-Adressen dynamisch den Geräten in einem Netzwerk zu?",
    "answers": [
      "DHCP",
      "DNS",
      "ARP",
      "HTTP"
    ],
    "correct": 0,
    "explanation": "DHCP (Dynamic Host Configuration Protocol) dient der automatischen Zuweisung von IP-Konfigurationen.",
    "tags": [
      "it-fisi",
      "dhcp",
      "netzwerk"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "netzwerk",
      "difficulty": 2,
      "skill": "netzwerkschichten_oder_protokolle_bestimmen",
      "expectedTimeMs": 12600,
      "trap": "protokoll_oder_port_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "DHCP",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "DNS",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "ARP",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "HTTP",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_net_004",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "medium",
    "question": "Welchen Port nutzt das sichere Übertragungsprotokoll HTTPS standardmäßig?",
    "answers": [
      "443",
      "80",
      "22",
      "8080"
    ],
    "correct": 0,
    "explanation": "HTTPS nutzt standardmäßig Port 443. Port 80 ist für unverschlüsseltes HTTP, Port 22 für SSH.",
    "tags": [
      "it-fisi",
      "ports",
      "sicherheit"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "netzwerk",
      "difficulty": 3,
      "skill": "netzwerkschichten_oder_protokolle_bestimmen",
      "expectedTimeMs": 18000,
      "trap": "protokoll_oder_port_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "443",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "80",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "22",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "8080",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_net_005",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "hard",
    "question": "Was unterscheidet TCP von UDP im Kern?",
    "answers": [
      "TCP ist verbindungsorientiert und garantiert die Zustellung, UDP ist verbindungslos und schneller",
      "TCP arbeitet auf Schicht 3, UDP auf Schicht 4",
      "UDP verschlüsselt die Daten automatisch, TCP nicht",
      "TCP kann nur Text übertragen, UDP nur Multimedia"
    ],
    "correct": 0,
    "explanation": "TCP stellt eine Verbindung her und sichert Daten durch Bestätigungen und Sequenznummern ab; UDP sendet Pakete unbestätigt (best-effort) ab.",
    "tags": [
      "it-fisi",
      "tcp",
      "udp"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "netzwerk",
      "difficulty": 4,
      "skill": "netzwerkschichten_oder_protokolle_bestimmen",
      "expectedTimeMs": 27000,
      "trap": "protokoll_oder_port_verwechselt",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "TCP ist verbindungsorientiert und garantiert die Zustellung, UDP ist verbindungslos und schneller",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "TCP arbeitet auf Schicht 3, UDP auf Schicht 4",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "UDP verschlüsselt die Daten automatisch, TCP nicht",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "TCP kann nur Text übertragen, UDP nur Multimedia",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_os_001",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "easy",
    "question": "Mit welchem Befehl in der Linux-Shell (z.B. Bash) ändert man die Zugriffsrechte einer Datei?",
    "answers": [
      "chmod",
      "chown",
      "ls -l",
      "rm"
    ],
    "correct": 0,
    "explanation": "chmod (change mode) ändert Berechtigungen (z.B. chmod 755 datei.sh). chown ändert den Besitzer.",
    "tags": [
      "it-fisi",
      "linux",
      "berechtigungen"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "betriebssystem",
      "difficulty": 2,
      "skill": "betriebssystem_grundlagen_verstehen",
      "expectedTimeMs": 12600,
      "trap": "befehl_oder_verzeichnis_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "chmod",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "chown",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "ls -l",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "rm",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_os_002",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "medium",
    "question": "Was beschreibt eine Gruppenrichtlinie (GPO) in einer Windows Server Active Directory Umgebung?",
    "answers": [
      "Ein Werkzeug zur zentralen Konfiguration und Verwaltung von Benutzer- und Computer-Einstellungen",
      "Ein Antiviren-Programm für Arbeitsgruppen",
      "Ein Tool zur Überwachung der Prozessorauslastung",
      "Eine Richtlinie zur Zusammensetzung von Arbeitsgruppen"
    ],
    "correct": 0,
    "explanation": "Group Policy Objects (GPOs) erlauben es Administratoren, Richtlinien für Rechner und Benutzer im AD zentral zu konfigurieren.",
    "tags": [
      "it-fisi",
      "windows-server",
      "active-directory"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "betriebssystem",
      "difficulty": 3,
      "skill": "betriebssystem_grundlagen_verstehen",
      "expectedTimeMs": 18000,
      "trap": "befehl_oder_verzeichnis_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Ein Werkzeug zur zentralen Konfiguration und Verwaltung von Benutzer- und Computer-Einstellungen",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Ein Antiviren-Programm für Arbeitsgruppen",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Ein Tool zur Überwachung der Prozessorauslastung",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Eine Richtlinie zur Zusammensetzung von Arbeitsgruppen",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_os_003",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "easy",
    "question": "Wie lautet das Windows-Gegenstück zum Linux-Befehl `ping` in der Eingabeaufforderung (CMD)?",
    "answers": [
      "ping",
      "ipconfig",
      "nslookup",
      "tracert"
    ],
    "correct": 0,
    "explanation": "Der Befehl `ping` existiert und funktioniert auf beiden Betriebssystemen identisch.",
    "tags": [
      "it-fisi",
      "cmd",
      "netzwerk"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "netzwerk",
      "difficulty": 2,
      "skill": "netzwerkschichten_oder_protokolle_bestimmen",
      "expectedTimeMs": 12600,
      "trap": "protokoll_oder_port_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "ping",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "ipconfig",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "nslookup",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "tracert",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_os_004",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "medium",
    "question": "Welches Linux-Verzeichnis enthält standardmäßig globale Konfigurationsdateien des Systems?",
    "answers": [
      "/etc",
      "/var",
      "/bin",
      "/usr"
    ],
    "correct": 0,
    "explanation": "Im Ordner `/etc` liegen fast alle Systemkonfigurationen von Linux.",
    "tags": [
      "it-fisi",
      "linux",
      "dateisystem"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "betriebssystem",
      "difficulty": 3,
      "skill": "betriebssystem_grundlagen_verstehen",
      "expectedTimeMs": 18000,
      "trap": "befehl_oder_verzeichnis_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "/etc",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "/var",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "/bin",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "/usr",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_db_001",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "easy",
    "question": "Mit welchem SQL-Schlüsselwort sortiert man das Ergebnis einer Abfrage?",
    "answers": [
      "ORDER BY",
      "GROUP BY",
      "SORT BY",
      "HAVING"
    ],
    "correct": 0,
    "explanation": "ORDER BY sortiert Ergebnisse auf- oder absteigend. GROUP BY gruppiert Zeilen.",
    "tags": [
      "it-fisi",
      "sql",
      "datenbanken"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "datenbanken",
      "difficulty": 2,
      "skill": "datenbank_abfragen_oder_relationen_bestimmen",
      "expectedTimeMs": 12600,
      "trap": "join_art_oder_relationenfehler",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "ORDER BY",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "GROUP BY",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "SORT BY",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "HAVING",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_db_002",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "medium",
    "question": "Was beschreibt ein Fremdschlüssel (Foreign Key) in einer relationalen Datenbank?",
    "answers": [
      "Ein Attribut in einer Tabelle, das auf den Primärschlüssel einer anderen Tabelle verweist, um Beziehungen darzustellen",
      "Ein Schlüssel, der von außen in die Datenbank kopiert wird",
      "Ein Passfahrtschlüssel zur Ver- und Entschlüsselung",
      "Ein Feld, das keinen Wert enthalten darf"
    ],
    "correct": 0,
    "explanation": "Der Fremdschlüssel stellt die referenzielle Integrität zwischen zwei Tabellen her, indem er auf einen Primärschlüssel verweist.",
    "tags": [
      "it-fisi",
      "sql",
      "beziehungen"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "datenbanken",
      "difficulty": 3,
      "skill": "datenbank_abfragen_oder_relationen_bestimmen",
      "expectedTimeMs": 18000,
      "trap": "join_art_oder_relationenfehler",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Ein Attribut in einer Tabelle, das auf den Primärschlüssel einer anderen Tabelle verweist, um Beziehungen darzustellen",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Ein Schlüssel, der von außen in die Datenbank kopiert wird",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Ein Passfahrtschlüssel zur Ver- und Entschlüsselung",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Ein Feld, das keinen Wert enthalten darf",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_db_003",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "hard",
    "question": "Welche SQL Join-Art gibt alle Datensätze der linken Tabelle zurück, auch wenn in der rechten Tabelle keine Übereinstimmung existiert?",
    "answers": [
      "LEFT JOIN",
      "INNER JOIN",
      "RIGHT JOIN",
      "FULL OUTER JOIN"
    ],
    "correct": 0,
    "explanation": "Ein LEFT (OUTER) JOIN liefert alle Zeilen der linken Tabelle. Gibt es rechts keine Treffer, werden NULL-Werte ausgegeben.",
    "tags": [
      "it-fisi",
      "sql",
      "joins"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "datenbanken",
      "difficulty": 4,
      "skill": "datenbank_abfragen_oder_relationen_bestimmen",
      "expectedTimeMs": 27000,
      "trap": "join_art_oder_relationenfehler",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "LEFT JOIN",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "INNER JOIN",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "RIGHT JOIN",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "FULL OUTER JOIN",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_sec_001",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "medium",
    "question": "Welcher Angriffstyp zielt darauf ab, legitimen Nutzern den Zugriff auf einen Server durch Überlastung der Netzwerk-Ressourcen zu verwehren?",
    "answers": [
      "DDoS (Distributed Denial of Service)",
      "Phishing",
      "Man-in-the-Middle",
      "SQL Injection"
    ],
    "correct": 0,
    "explanation": "DDoS-Angriffe senden massenhaft Anfragen von vielen verteilten Systemen, um die Kapazitätsgrenzen des Ziels zu überschreiten.",
    "tags": [
      "it-fisi",
      "security",
      "ddos"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "it_sicherheit",
      "difficulty": 3,
      "skill": "it_sicherheit_und_bedrohungen_erkennen",
      "expectedTimeMs": 18000,
      "trap": "angriffstyp_oder_schutzmassnahme_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "DDoS (Distributed Denial of Service)",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Phishing",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Man-in-the-Middle",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "SQL Injection",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_sec_002",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "easy",
    "question": "Was versteht man unter 'Zwei-Faktor-Authentisierung' (2FA)?",
    "answers": [
      "Die Anmeldung durch Kombination zweier verschiedener Identitätsnachweise (z.B. Passwort und SMS-Token)",
      "Die Eingabe von zwei unterschiedlichen Passwörtern nacheinander",
      "Die doppelte Speicherung von Passwörtern auf Servern",
      "Das Anmelden von zwei Benutzern an demselben Rechner"
    ],
    "correct": 0,
    "explanation": "2FA kombiniert zwei Faktoren aus den Bereichen Wissen (z. B. Passwort), Besitz (z. B. Smartphone/Token) oder Inhärenz (z. B. Fingerabdruck).",
    "tags": [
      "it-fisi",
      "security",
      "2fa"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "it_sicherheit",
      "difficulty": 2,
      "skill": "it_sicherheit_und_bedrohungen_erkennen",
      "expectedTimeMs": 12600,
      "trap": "angriffstyp_oder_schutzmassnahme_verwechselt",
      "examTarget": "assessments",
      "distractors": [
        {
          "value": "Die Anmeldung durch Kombination zweier verschiedener Identitätsnachweise (z.B. Passwort und SMS-Token)",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Die Eingabe von zwei unterschiedlichen Passwörtern nacheinander",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Die doppelte Speicherung von Passwörtern auf Servern",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Das Anmelden von zwei Benutzern an demselben Rechner",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  },
  {
    "id": "it_sec_003",
    "source": "it-extra-bank-v9",
    "category": "IT/FISI",
    "group": "IT/FISI",
    "subtype": "it_scenario",
    "difficulty": "hard",
    "question": "Was beschreibt ein 'Man-in-the-Middle'-Angriff am treffendsten?",
    "answers": [
      "Ein Angreifer klinkt sich unbemerkt in die Kommunikation zweier Partner ein und kann Daten abfangen oder manipulieren",
      "Ein physischer Einbruch in den Serverraum während der Mittagspause",
      "Das Erraten von Passwörtern durch Ausprobieren gängiger Wörter",
      "Das Lahmlegen von Servern durch das Ziehen des Stromkabels"
    ],
    "correct": 0,
    "explanation": "Bei MitM-Angriffen steht der Angreifer logisch zwischen Sender und Empfänger und leitet Daten manipuliert weiter, ohne dass diese es merken.",
    "tags": [
      "it-fisi",
      "security",
      "mitm"
    ],
    "verified": true,
    "status": "verified",
    "dna": {
      "category": "it",
      "subtype": "it_sicherheit",
      "difficulty": 4,
      "skill": "it_sicherheit_und_bedrohungen_erkennen",
      "expectedTimeMs": 27000,
      "trap": "angriffstyp_oder_schutzmassnahme_verwechselt",
      "examTarget": "novuraExams",
      "distractors": [
        {
          "value": "Ein Angreifer klinkt sich unbemerkt in die Kommunikation zweier Partner ein und kann Daten abfangen oder manipulieren",
          "index": 0,
          "errorPath": "correct"
        },
        {
          "value": "Ein physischer Einbruch in den Serverraum während der Mittagspause",
          "index": 1,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Das Erraten von Passwörtern durch Ausprobieren gängiger Wörter",
          "index": 2,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        },
        {
          "value": "Das Lahmlegen von Servern durch das Ziehen des Stromkabels",
          "index": 3,
          "errorPath": "wrong_choice",
          "hint": "Unpassende technologische Komponente oder falsches Protokoll."
        }
      ]
    }
  }
);
