/* Language Academy · Phase 30C
   A1 Speaking Content Expansion: Sprechaufgaben parallel zum A1-Kursinhalt. */
(function(){
  'use strict';
  var VERSION='G54.11-phase30d-fix-ios-secure-speech-diagnostics';
  var PROGRESS_KEY='language_academy_course_progress_v2';
  var LEGACY_PROGRESS_KEY='language_academy_course_progress_v1';
  var LEVELS=[
    {id:'a1',label:'A1',title:'Grundlagen',desc:'10 Lektionen · ca. 430 Aufgaben inkl. Sprechen',status:'available',progress:12},
    {id:'a2',label:'A2',title:'Alltag',desc:'Einkaufen, Termine, Wege',status:'locked',progress:0},
    {id:'b1',label:'B1',title:'Kommunikation',desc:'Meinung, Alltag, Arbeit',status:'locked',progress:0},
    {id:'b2',label:'B2',title:'Beruf & Alltag',desc:'Bewerbung, Fachsprache, Diskussion',status:'locked',progress:0},
    {id:'c1',label:'C1',title:'Fortgeschritten',desc:'Argumentieren, Nuancen, Texte',status:'locked',progress:0},
    {id:'c2',label:'C2',title:'Sehr fortgeschritten',desc:'Präzise, sicher, akademisch',status:'locked',progress:0}
  ];
  var STATS={tasks:0,accuracy:0,time:'0h 00m',streak:0};
  var LESSON_TASKS={
    "a1-greetings": [
        {
            "id": "a1-greetings-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Hallo“?",
                "tr": "„Hallo“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Merhaba"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Hallo“ bedeutet „Merhaba“.",
                "tr": "„Hallo“, „Merhaba“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Guten Morgen“?",
                "tr": "„Guten Morgen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Günaydın"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Guten Morgen“ bedeutet „Günaydın“.",
                "tr": "„Guten Morgen“, „Günaydın“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Guten Tag“?",
                "tr": "„Guten Tag“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "İyi günler"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Guten Tag“ bedeutet „İyi günler“.",
                "tr": "„Guten Tag“, „İyi günler“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Guten Abend“?",
                "tr": "„Guten Abend“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "İyi akşamlar"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Guten Abend“ bedeutet „İyi akşamlar“.",
                "tr": "„Guten Abend“, „İyi akşamlar“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Tschüss“?",
                "tr": "„Tschüss“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Hoşçakal"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Tschüss“ bedeutet „Hoşçakal“.",
                "tr": "„Tschüss“, „Hoşçakal“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Bis später“?",
                "tr": "„Bis später“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Görüşürüz"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Bis später“ bedeutet „Görüşürüz“.",
                "tr": "„Bis später“, „Görüşürüz“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Danke“?",
                "tr": "„Danke“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Teşekkür ederim"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Danke“ bedeutet „Teşekkür ederim“.",
                "tr": "„Danke“, „Teşekkür ederim“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Bitte“?",
                "tr": "„Bitte“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Lütfen"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Bitte“ bedeutet „Lütfen“.",
                "tr": "„Bitte“, „Lütfen“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Entschuldigung“?",
                "tr": "„Entschuldigung“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Affedersiniz"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Entschuldigung“ bedeutet „Affedersiniz“.",
                "tr": "„Entschuldigung“, „Affedersiniz“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Ja“?",
                "tr": "„Ja“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Evet"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Ja“ bedeutet „Evet“.",
                "tr": "„Ja“, „Evet“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Nein“?",
                "tr": "„Nein“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Hayır"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Nein“ bedeutet „Hayır“.",
                "tr": "„Nein“, „Hayır“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Gute Nacht“?",
                "tr": "„Gute Nacht“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Begrüßungen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "İyi geceler"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Gute Nacht“ bedeutet „İyi geceler“.",
                "tr": "„Gute Nacht“, „İyi geceler“ anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Begrüßungen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Hallo",
                    "right": "Merhaba"
                },
                {
                    "left": "Guten Morgen",
                    "right": "Günaydın"
                },
                {
                    "left": "Guten Tag",
                    "right": "İyi günler"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-greetings-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Begrüßungen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Guten Abend",
                    "right": "İyi akşamlar"
                },
                {
                    "left": "Tschüss",
                    "right": "Hoşçakal"
                },
                {
                    "left": "Bis später",
                    "right": "Görüşürüz"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-greetings-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Begrüßungen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Danke",
                    "right": "Teşekkür ederim"
                },
                {
                    "left": "Bitte",
                    "right": "Lütfen"
                },
                {
                    "left": "Entschuldigung",
                    "right": "Affedersiniz"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-greetings-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Begrüßungen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Ja",
                    "right": "Evet"
                },
                {
                    "left": "Nein",
                    "right": "Hayır"
                },
                {
                    "left": "Gute Nacht",
                    "right": "İyi geceler"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-greetings-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Guten ___",
                "tr": "Sabah selamlaması."
            },
            "answer": "Morgen",
            "options": [
                "Morgen",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „Morgen“.",
                "tr": "Cümle „Morgen“ ile doğru olur."
            }
        },
        {
            "id": "a1-greetings-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ugurcan",
                "heiße",
                "Ich"
            ],
            "answer": [
                "Ich",
                "heiße",
                "Ugurcan"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-greetings-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Guten ___",
                "tr": "Gündüz selamlaması."
            },
            "answer": "Tag",
            "options": [
                "Tag",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „Tag“.",
                "tr": "Cümle „Tag“ ile doğru olur."
            }
        },
        {
            "id": "a1-greetings-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ugurcan",
                "heiße",
                "Ich"
            ],
            "answer": [
                "Ich",
                "heiße",
                "Ugurcan"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-greetings-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Bis ___",
                "tr": "Sonra görüşmek için kullanılır."
            },
            "answer": "später",
            "options": [
                "später",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „später“.",
                "tr": "Cümle „später“ ile doğru olur."
            }
        },
        {
            "id": "a1-greetings-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ugurcan",
                "heiße",
                "Ich"
            ],
            "answer": [
                "Ich",
                "heiße",
                "Ugurcan"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-greetings-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Gute ___",
                "tr": "Gece ayrılırken kullanılır."
            },
            "answer": "Nacht",
            "options": [
                "Nacht",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „Nacht“.",
                "tr": "Cümle „Nacht“ ile doğru olur."
            }
        },
        {
            "id": "a1-greetings-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ugurcan",
                "heiße",
                "Ich"
            ],
            "answer": [
                "Ich",
                "heiße",
                "Ugurcan"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-greetings-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "___ schön",
                "tr": "Teşekkür ederken kullanılır."
            },
            "answer": "Danke",
            "options": [
                "Danke",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „Danke“.",
                "tr": "Cümle „Danke“ ile doğru olur."
            }
        },
        {
            "id": "a1-greetings-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ugurcan",
                "heiße",
                "Ich"
            ],
            "answer": [
                "Ich",
                "heiße",
                "Ugurcan"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-greetings-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Hallo",
            "back": "Merhaba",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-greetings-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Guten Morgen",
            "back": "Günaydın",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-greetings-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Guten Tag",
            "back": "İyi günler",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-greetings-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Guten Abend",
            "back": "İyi akşamlar",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-greetings-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Tschüss",
            "back": "Hoşçakal",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-greetings-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„Hallo“ bedeutet „Merhaba“.",
                "tr": "„Hallo\", „Merhaba\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-greetings-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„Guten Morgen“ bedeutet „Tisch“.",
                "tr": "„Guten Morgen\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-greetings-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„Guten Tag“ bedeutet „İyi günler“.",
                "tr": "„Guten Tag\", „İyi günler\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-greetings-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„Guten Abend“ bedeutet „Stuhl“.",
                "tr": "„Guten Abend\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-greetings-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Tschüss",
                "tr": "Hoşçakal"
            },
            "audioLabel": {
                "de": "Tschüss",
                "tr": "Hoşçakal"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Hoşçakal"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Tschüss“ gehört. Das passt zu „Hoşçakal“.",
                "tr": "„Tschüss\" duydun. Bu „Hoşçakal\" anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Bis später",
                "tr": "Görüşürüz"
            },
            "audioLabel": {
                "de": "Bis später",
                "tr": "Görüşürüz"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Görüşürüz"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Bis später“ gehört. Das passt zu „Görüşürüz“.",
                "tr": "„Bis später\" duydun. Bu „Görüşürüz\" anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Danke",
                "tr": "Teşekkür ederim"
            },
            "audioLabel": {
                "de": "Danke",
                "tr": "Teşekkür ederim"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Teşekkür ederim"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Danke“ gehört. Das passt zu „Teşekkür ederim“.",
                "tr": "„Danke\" duydun. Bu „Teşekkür ederim\" anlamına gelir."
            }
        },
        {
            "id": "a1-greetings-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Bitte",
                "tr": "Lütfen"
            },
            "audioLabel": {
                "de": "Bitte",
                "tr": "Lütfen"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Lütfen"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Bitte“ gehört. Das passt zu „Lütfen“.",
                "tr": "„Bitte\" duydun. Bu „Lütfen\" anlamına gelir."
            }
        }
    ],
    "a1-introduce": [
        {
            "id": "a1-introduce-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Ich heiße“?",
                "tr": "„Ich heiße“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Benim adım"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Ich heiße“ bedeutet „Benim adım“.",
                "tr": "„Ich heiße“, „Benim adım“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Mein Name ist“?",
                "tr": "„Mein Name ist“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Benim adım"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Mein Name ist“ bedeutet „Benim adım“.",
                "tr": "„Mein Name ist“, „Benim adım“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Ich komme aus“?",
                "tr": "„Ich komme aus“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "...den geliyorum"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Ich komme aus“ bedeutet „...den geliyorum“.",
                "tr": "„Ich komme aus“, „...den geliyorum“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Ich wohne in“?",
                "tr": "„Ich wohne in“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "...de yaşıyorum"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Ich wohne in“ bedeutet „...de yaşıyorum“.",
                "tr": "„Ich wohne in“, „...de yaşıyorum“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Ich bin“?",
                "tr": "„Ich bin“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Ben"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Ich bin“ bedeutet „Ben“.",
                "tr": "„Ich bin“, „Ben“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „du bist“?",
                "tr": "„du bist“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sen"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„du bist“ bedeutet „sen“.",
                "tr": "„du bist“, „sen“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „er ist“?",
                "tr": "„er ist“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "o erkek"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„er ist“ bedeutet „o erkek“.",
                "tr": "„er ist“, „o erkek“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „sie ist“?",
                "tr": "„sie ist“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "o kadın"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„sie ist“ bedeutet „o kadın“.",
                "tr": "„sie ist“, „o kadın“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Deutschland“?",
                "tr": "„Deutschland“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Almanya"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Deutschland“ bedeutet „Almanya“.",
                "tr": "„Deutschland“, „Almanya“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Türkei“?",
                "tr": "„Türkei“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Türkiye"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Türkei“ bedeutet „Türkiye“.",
                "tr": "„Türkei“, „Türkiye“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Ulm“?",
                "tr": "„Ulm“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Ulm"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Ulm“ bedeutet „Ulm“.",
                "tr": "„Ulm“, „Ulm“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Name“?",
                "tr": "„Name“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Sich vorstellen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "isim"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Name“ bedeutet „isim“.",
                "tr": "„Name“, „isim“ anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Sich vorstellen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Ich heiße",
                    "right": "Benim adım"
                },
                {
                    "left": "Mein Name ist",
                    "right": "Benim adım"
                },
                {
                    "left": "Ich komme aus",
                    "right": "...den geliyorum"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-introduce-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Sich vorstellen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Ich wohne in",
                    "right": "...de yaşıyorum"
                },
                {
                    "left": "Ich bin",
                    "right": "Ben"
                },
                {
                    "left": "du bist",
                    "right": "sen"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-introduce-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Sich vorstellen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "er ist",
                    "right": "o erkek"
                },
                {
                    "left": "sie ist",
                    "right": "o kadın"
                },
                {
                    "left": "Deutschland",
                    "right": "Almanya"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-introduce-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Sich vorstellen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Türkei",
                    "right": "Türkiye"
                },
                {
                    "left": "Ulm",
                    "right": "Ulm"
                },
                {
                    "left": "Name",
                    "right": "isim"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-introduce-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich ___ Ugurcan",
                "tr": "Kendini tanıtırken kullanılır."
            },
            "answer": "heiße",
            "options": [
                "heiße",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „heiße“.",
                "tr": "Cümle „heiße“ ile doğru olur."
            }
        },
        {
            "id": "a1-introduce-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ugurcan",
                "heiße",
                "Ich"
            ],
            "answer": [
                "Ich",
                "heiße",
                "Ugurcan"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-introduce-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Mein ___ ist Anna",
                "tr": "Adını söylerken kullanılır."
            },
            "answer": "Name",
            "options": [
                "Name",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „Name“.",
                "tr": "Cümle „Name“ ile doğru olur."
            }
        },
        {
            "id": "a1-introduce-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Anna",
                "ist",
                "Name",
                "Mein"
            ],
            "answer": [
                "Mein",
                "Name",
                "ist",
                "Anna"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-introduce-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich komme ___ der Türkei",
                "tr": "Nereden geldiğini söyler."
            },
            "answer": "aus",
            "options": [
                "aus",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „aus“.",
                "tr": "Cümle „aus“ ile doğru olur."
            }
        },
        {
            "id": "a1-introduce-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "der",
                "aus",
                "komme",
                "Ich"
            ],
            "answer": [
                "Ich",
                "komme",
                "aus",
                "der"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-introduce-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich wohne ___ Ulm",
                "tr": "Nerede yaşadığını söyler."
            },
            "answer": "in",
            "options": [
                "in",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „in“.",
                "tr": "Cümle „in“ ile doğru olur."
            }
        },
        {
            "id": "a1-introduce-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ulm",
                "in",
                "wohne",
                "Ich"
            ],
            "answer": [
                "Ich",
                "wohne",
                "in",
                "Ulm"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-introduce-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich ___ 32 Jahre alt",
                "tr": "Yaşını söylemek için kullanılır."
            },
            "answer": "bin",
            "options": [
                "bin",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „bin“.",
                "tr": "Cümle „bin“ ile doğru olur."
            }
        },
        {
            "id": "a1-introduce-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Jahre",
                "32",
                "bin",
                "Ich"
            ],
            "answer": [
                "Ich",
                "bin",
                "32",
                "Jahre"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-introduce-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Ich heiße",
            "back": "Benim adım",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-introduce-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Mein Name ist",
            "back": "Benim adım",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-introduce-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Ich komme aus",
            "back": "...den geliyorum",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-introduce-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Ich wohne in",
            "back": "...de yaşıyorum",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-introduce-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Ich bin",
            "back": "Ben",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-introduce-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„Ich heiße“ bedeutet „Benim adım“.",
                "tr": "„Ich heiße\", „Benim adım\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-introduce-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„Mein Name ist“ bedeutet „Tisch“.",
                "tr": "„Mein Name ist\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-introduce-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„Ich komme aus“ bedeutet „...den geliyorum“.",
                "tr": "„Ich komme aus\", „...den geliyorum\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-introduce-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„Ich wohne in“ bedeutet „Stuhl“.",
                "tr": "„Ich wohne in\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-introduce-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Ich bin",
                "tr": "Ben"
            },
            "audioLabel": {
                "de": "Ich bin",
                "tr": "Ben"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Ben"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Ich bin“ gehört. Das passt zu „Ben“.",
                "tr": "„Ich bin\" duydun. Bu „Ben\" anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "du bist",
                "tr": "sen"
            },
            "audioLabel": {
                "de": "du bist",
                "tr": "sen"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sen"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „du bist“ gehört. Das passt zu „sen“.",
                "tr": "„du bist\" duydun. Bu „sen\" anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "er ist",
                "tr": "o erkek"
            },
            "audioLabel": {
                "de": "er ist",
                "tr": "o erkek"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "o erkek"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „er ist“ gehört. Das passt zu „o erkek“.",
                "tr": "„er ist\" duydun. Bu „o erkek\" anlamına gelir."
            }
        },
        {
            "id": "a1-introduce-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "sie ist",
                "tr": "o kadın"
            },
            "audioLabel": {
                "de": "sie ist",
                "tr": "o kadın"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "o kadın"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „sie ist“ gehört. Das passt zu „o kadın“.",
                "tr": "„sie ist\" duydun. Bu „o kadın\" anlamına gelir."
            }
        }
    ],
    "a1-numbers": [
        {
            "id": "a1-numbers-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „eins“?",
                "tr": "„eins“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "bir"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„eins“ bedeutet „bir“.",
                "tr": "„eins“, „bir“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „zwei“?",
                "tr": "„zwei“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "iki"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„zwei“ bedeutet „iki“.",
                "tr": "„zwei“, „iki“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „drei“?",
                "tr": "„drei“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "üç"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„drei“ bedeutet „üç“.",
                "tr": "„drei“, „üç“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „vier“?",
                "tr": "„vier“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "dört"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„vier“ bedeutet „dört“.",
                "tr": "„vier“, „dört“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „fünf“?",
                "tr": "„fünf“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "beş"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„fünf“ bedeutet „beş“.",
                "tr": "„fünf“, „beş“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „sechs“?",
                "tr": "„sechs“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "altı"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„sechs“ bedeutet „altı“.",
                "tr": "„sechs“, „altı“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „sieben“?",
                "tr": "„sieben“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yedi"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„sieben“ bedeutet „yedi“.",
                "tr": "„sieben“, „yedi“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „acht“?",
                "tr": "„acht“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sekiz"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„acht“ bedeutet „sekiz“.",
                "tr": "„acht“, „sekiz“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „neun“?",
                "tr": "„neun“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "dokuz"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„neun“ bedeutet „dokuz“.",
                "tr": "„neun“, „dokuz“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „zehn“?",
                "tr": "„zehn“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "on"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„zehn“ bedeutet „on“.",
                "tr": "„zehn“, „on“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „zwanzig“?",
                "tr": "„zwanzig“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yirmi"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„zwanzig“ bedeutet „yirmi“.",
                "tr": "„zwanzig“, „yirmi“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „hundert“?",
                "tr": "„hundert“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Zahlen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yüz"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„hundert“ bedeutet „yüz“.",
                "tr": "„hundert“, „yüz“ anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Zahlen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "eins",
                    "right": "bir"
                },
                {
                    "left": "zwei",
                    "right": "iki"
                },
                {
                    "left": "drei",
                    "right": "üç"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-numbers-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Zahlen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "vier",
                    "right": "dört"
                },
                {
                    "left": "fünf",
                    "right": "beş"
                },
                {
                    "left": "sechs",
                    "right": "altı"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-numbers-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Zahlen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "sieben",
                    "right": "yedi"
                },
                {
                    "left": "acht",
                    "right": "sekiz"
                },
                {
                    "left": "neun",
                    "right": "dokuz"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-numbers-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Zahlen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "zehn",
                    "right": "on"
                },
                {
                    "left": "zwanzig",
                    "right": "yirmi"
                },
                {
                    "left": "hundert",
                    "right": "yüz"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-numbers-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich habe ___ Euro",
                "tr": "Para miktarı belirtir."
            },
            "answer": "zehn",
            "options": [
                "zehn",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „zehn“.",
                "tr": "Cümle „zehn“ ile doğru olur."
            }
        },
        {
            "id": "a1-numbers-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Euro",
                "zehn",
                "habe",
                "Ich"
            ],
            "answer": [
                "Ich",
                "habe",
                "zehn",
                "Euro"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-numbers-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Die Nummer ist ___",
                "tr": "Sayı söyler."
            },
            "answer": "drei",
            "options": [
                "drei",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „drei“.",
                "tr": "Cümle „drei“ ile doğru olur."
            }
        },
        {
            "id": "a1-numbers-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "drei",
                "ist",
                "Nummer",
                "Die"
            ],
            "answer": [
                "Die",
                "Nummer",
                "ist",
                "drei"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-numbers-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich brauche ___ Tickets",
                "tr": "Adet belirtir."
            },
            "answer": "zwei",
            "options": [
                "zwei",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „zwei“.",
                "tr": "Cümle „zwei“ ile doğru olur."
            }
        },
        {
            "id": "a1-numbers-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Tickets",
                "zwei",
                "brauche",
                "Ich"
            ],
            "answer": [
                "Ich",
                "brauche",
                "zwei",
                "Tickets"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-numbers-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Das kostet ___ Euro",
                "tr": "Fiyat söyler."
            },
            "answer": "fünf",
            "options": [
                "fünf",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „fünf“.",
                "tr": "Cümle „fünf“ ile doğru olur."
            }
        },
        {
            "id": "a1-numbers-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Euro",
                "fünf",
                "kostet",
                "Das"
            ],
            "answer": [
                "Das",
                "kostet",
                "fünf",
                "Euro"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-numbers-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich bin ___ Jahre alt",
                "tr": "Yaş belirtir."
            },
            "answer": "zwanzig",
            "options": [
                "zwanzig",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „zwanzig“.",
                "tr": "Cümle „zwanzig“ ile doğru olur."
            }
        },
        {
            "id": "a1-numbers-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Jahre",
                "zwanzig",
                "bin",
                "Ich"
            ],
            "answer": [
                "Ich",
                "bin",
                "zwanzig",
                "Jahre"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-numbers-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "eins",
            "back": "bir",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-numbers-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "zwei",
            "back": "iki",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-numbers-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "drei",
            "back": "üç",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-numbers-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "vier",
            "back": "dört",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-numbers-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "fünf",
            "back": "beş",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-numbers-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„eins“ bedeutet „bir“.",
                "tr": "„eins\", „bir\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-numbers-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„zwei“ bedeutet „Tisch“.",
                "tr": "„zwei\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-numbers-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„drei“ bedeutet „üç“.",
                "tr": "„drei\", „üç\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-numbers-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„vier“ bedeutet „Stuhl“.",
                "tr": "„vier\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-numbers-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "fünf",
                "tr": "beş"
            },
            "audioLabel": {
                "de": "fünf",
                "tr": "beş"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "beş"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „fünf“ gehört. Das passt zu „beş“.",
                "tr": "„fünf\" duydun. Bu „beş\" anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "sechs",
                "tr": "altı"
            },
            "audioLabel": {
                "de": "sechs",
                "tr": "altı"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "altı"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „sechs“ gehört. Das passt zu „altı“.",
                "tr": "„sechs\" duydun. Bu „altı\" anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "sieben",
                "tr": "yedi"
            },
            "audioLabel": {
                "de": "sieben",
                "tr": "yedi"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yedi"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „sieben“ gehört. Das passt zu „yedi“.",
                "tr": "„sieben\" duydun. Bu „yedi\" anlamına gelir."
            }
        },
        {
            "id": "a1-numbers-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "acht",
                "tr": "sekiz"
            },
            "audioLabel": {
                "de": "acht",
                "tr": "sekiz"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sekiz"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „acht“ gehört. Das passt zu „sekiz“.",
                "tr": "„acht\" duydun. Bu „sekiz\" anlamına gelir."
            }
        }
    ],
    "a1-time": [
        {
            "id": "a1-time-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Wie spät ist es?“?",
                "tr": "„Wie spät ist es?“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "Saat kaç?"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Wie spät ist es?“ bedeutet „Saat kaç?“.",
                "tr": "„Wie spät ist es?“, „Saat kaç?“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Uhr“?",
                "tr": "„Uhr“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "saat"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Uhr“ bedeutet „saat“.",
                "tr": "„Uhr“, „saat“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „halb“?",
                "tr": "„halb“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "buçuk"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„halb“ bedeutet „buçuk“.",
                "tr": "„halb“, „buçuk“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Viertel“?",
                "tr": "„Viertel“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "çeyrek"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Viertel“ bedeutet „çeyrek“.",
                "tr": "„Viertel“, „çeyrek“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „morgen“?",
                "tr": "„morgen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sabah"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„morgen“ bedeutet „sabah“.",
                "tr": "„morgen“, „sabah“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „heute“?",
                "tr": "„heute“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "bugün"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„heute“ bedeutet „bugün“.",
                "tr": "„heute“, „bugün“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „jetzt“?",
                "tr": "„jetzt“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "şimdi"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„jetzt“ bedeutet „şimdi“.",
                "tr": "„jetzt“, „şimdi“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „später“?",
                "tr": "„später“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sonra"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„später“ bedeutet „sonra“.",
                "tr": "„später“, „sonra“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Termin“?",
                "tr": "„Termin“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "randevu"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Termin“ bedeutet „randevu“.",
                "tr": "„Termin“, „randevu“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „um acht“?",
                "tr": "„um acht“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "saat sekizde"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„um acht“ bedeutet „saat sekizde“.",
                "tr": "„um acht“, „saat sekizde“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „um zwölf“?",
                "tr": "„um zwölf“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "saat on ikide"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„um zwölf“ bedeutet „saat on ikide“.",
                "tr": "„um zwölf“, „saat on ikide“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „pünktlich“?",
                "tr": "„pünktlich“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Uhrzeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "zamanında"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„pünktlich“ bedeutet „zamanında“.",
                "tr": "„pünktlich“, „zamanında“ anlamına gelir."
            }
        },
        {
            "id": "a1-time-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Uhrzeit“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Wie spät ist es?",
                    "right": "Saat kaç?"
                },
                {
                    "left": "Uhr",
                    "right": "saat"
                },
                {
                    "left": "halb",
                    "right": "buçuk"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-time-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Uhrzeit“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Viertel",
                    "right": "çeyrek"
                },
                {
                    "left": "morgen",
                    "right": "sabah"
                },
                {
                    "left": "heute",
                    "right": "bugün"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-time-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Uhrzeit“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "jetzt",
                    "right": "şimdi"
                },
                {
                    "left": "später",
                    "right": "sonra"
                },
                {
                    "left": "Termin",
                    "right": "randevu"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-time-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Uhrzeit“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "um acht",
                    "right": "saat sekizde"
                },
                {
                    "left": "um zwölf",
                    "right": "saat on ikide"
                },
                {
                    "left": "pünktlich",
                    "right": "zamanında"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-time-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Es ist acht ___",
                "tr": "Saat söylemek için kullanılır."
            },
            "answer": "Uhr",
            "options": [
                "Uhr",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „Uhr“.",
                "tr": "Cümle „Uhr“ ile doğru olur."
            }
        },
        {
            "id": "a1-time-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Uhr",
                "acht",
                "ist",
                "Es"
            ],
            "answer": [
                "Es",
                "ist",
                "acht",
                "Uhr"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-time-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Der Termin ist ___ zehn",
                "tr": "Saat belirtir."
            },
            "answer": "um",
            "options": [
                "um",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „um“.",
                "tr": "Cümle „um“ ile doğru olur."
            }
        },
        {
            "id": "a1-time-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "um",
                "ist",
                "Termin",
                "Der"
            ],
            "answer": [
                "Der",
                "Termin",
                "ist",
                "um"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-time-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Wie ___ ist es?",
                "tr": "Saat sorusudur."
            },
            "answer": "spät",
            "options": [
                "spät",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „spät“.",
                "tr": "Cümle „spät“ ile doğru olur."
            }
        },
        {
            "id": "a1-time-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "es",
                "ist",
                "spät",
                "Wie"
            ],
            "answer": [
                "Wie",
                "spät",
                "ist",
                "es"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-time-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich komme ___",
                "tr": "Zaman bildirir."
            },
            "answer": "später",
            "options": [
                "später",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „später“.",
                "tr": "Cümle „später“ ile doğru olur."
            }
        },
        {
            "id": "a1-time-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "später",
                "komme",
                "Ich"
            ],
            "answer": [
                "Ich",
                "komme",
                "später"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-time-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Wir treffen uns ___ zwölf",
                "tr": "Buluşma saatini belirtir."
            },
            "answer": "um",
            "options": [
                "um",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „um“.",
                "tr": "Cümle „um“ ile doğru olur."
            }
        },
        {
            "id": "a1-time-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "um",
                "uns",
                "treffen",
                "Wir"
            ],
            "answer": [
                "Wir",
                "treffen",
                "uns",
                "um"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-time-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Wie spät ist es?",
            "back": "Saat kaç?",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-time-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Uhr",
            "back": "saat",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-time-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "halb",
            "back": "buçuk",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-time-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Viertel",
            "back": "çeyrek",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-time-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "morgen",
            "back": "sabah",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-time-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„Wie spät ist es?“ bedeutet „Saat kaç?“.",
                "tr": "„Wie spät ist es?\", „Saat kaç?\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-time-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„Uhr“ bedeutet „Tisch“.",
                "tr": "„Uhr\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-time-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„halb“ bedeutet „buçuk“.",
                "tr": "„halb\", „buçuk\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-time-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„Viertel“ bedeutet „Stuhl“.",
                "tr": "„Viertel\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-time-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "morgen",
                "tr": "sabah"
            },
            "audioLabel": {
                "de": "morgen",
                "tr": "sabah"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sabah"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „morgen“ gehört. Das passt zu „sabah“.",
                "tr": "„morgen\" duydun. Bu „sabah\" anlamına gelir."
            }
        },
        {
            "id": "a1-time-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "heute",
                "tr": "bugün"
            },
            "audioLabel": {
                "de": "heute",
                "tr": "bugün"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "bugün"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „heute“ gehört. Das passt zu „bugün“.",
                "tr": "„heute\" duydun. Bu „bugün\" anlamına gelir."
            }
        },
        {
            "id": "a1-time-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "jetzt",
                "tr": "şimdi"
            },
            "audioLabel": {
                "de": "jetzt",
                "tr": "şimdi"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "şimdi"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „jetzt“ gehört. Das passt zu „şimdi“.",
                "tr": "„jetzt\" duydun. Bu „şimdi\" anlamına gelir."
            }
        },
        {
            "id": "a1-time-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "später",
                "tr": "sonra"
            },
            "audioLabel": {
                "de": "später",
                "tr": "sonra"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sonra"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „später“ gehört. Das passt zu „sonra“.",
                "tr": "„später\" duydun. Bu „sonra\" anlamına gelir."
            }
        }
    ],
    "a1-family": [
        {
            "id": "a1-family-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Mutter“?",
                "tr": "„Mutter“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "anne"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Mutter“ bedeutet „anne“.",
                "tr": "„Mutter“, „anne“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Vater“?",
                "tr": "„Vater“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "baba"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Vater“ bedeutet „baba“.",
                "tr": "„Vater“, „baba“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Bruder“?",
                "tr": "„Bruder“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "erkek kardeş"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Bruder“ bedeutet „erkek kardeş“.",
                "tr": "„Bruder“, „erkek kardeş“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Schwester“?",
                "tr": "„Schwester“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "kız kardeş"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Schwester“ bedeutet „kız kardeş“.",
                "tr": "„Schwester“, „kız kardeş“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Kind“?",
                "tr": "„Kind“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "çocuk"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Kind“ bedeutet „çocuk“.",
                "tr": "„Kind“, „çocuk“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Tochter“?",
                "tr": "„Tochter“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "kız çocuk"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Tochter“ bedeutet „kız çocuk“.",
                "tr": "„Tochter“, „kız çocuk“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Sohn“?",
                "tr": "„Sohn“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "erkek çocuk"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Sohn“ bedeutet „erkek çocuk“.",
                "tr": "„Sohn“, „erkek çocuk“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Familie“?",
                "tr": "„Familie“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "aile"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Familie“ bedeutet „aile“.",
                "tr": "„Familie“, „aile“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Oma“?",
                "tr": "„Oma“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "büyükanne"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Oma“ bedeutet „büyükanne“.",
                "tr": "„Oma“, „büyükanne“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Opa“?",
                "tr": "„Opa“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "büyükbaba"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Opa“ bedeutet „büyükbaba“.",
                "tr": "„Opa“, „büyükbaba“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Eltern“?",
                "tr": "„Eltern“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ebeveynler"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Eltern“ bedeutet „ebeveynler“.",
                "tr": "„Eltern“, „ebeveynler“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „verheiratet“?",
                "tr": "„verheiratet“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Familie“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "evli"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„verheiratet“ bedeutet „evli“.",
                "tr": "„verheiratet“, „evli“ anlamına gelir."
            }
        },
        {
            "id": "a1-family-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Familie“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Mutter",
                    "right": "anne"
                },
                {
                    "left": "Vater",
                    "right": "baba"
                },
                {
                    "left": "Bruder",
                    "right": "erkek kardeş"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-family-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Familie“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Schwester",
                    "right": "kız kardeş"
                },
                {
                    "left": "Kind",
                    "right": "çocuk"
                },
                {
                    "left": "Tochter",
                    "right": "kız çocuk"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-family-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Familie“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Sohn",
                    "right": "erkek çocuk"
                },
                {
                    "left": "Familie",
                    "right": "aile"
                },
                {
                    "left": "Oma",
                    "right": "büyükanne"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-family-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Familie“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Opa",
                    "right": "büyükbaba"
                },
                {
                    "left": "Eltern",
                    "right": "ebeveynler"
                },
                {
                    "left": "verheiratet",
                    "right": "evli"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-family-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Meine ___ heißt Ayşe",
                "tr": "Aile üyesini belirtir."
            },
            "answer": "Mutter",
            "options": [
                "Mutter",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „Mutter“.",
                "tr": "Cümle „Mutter“ ile doğru olur."
            }
        },
        {
            "id": "a1-family-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ayşe",
                "heißt",
                "Mutter",
                "Meine"
            ],
            "answer": [
                "Meine",
                "Mutter",
                "heißt",
                "Ayşe"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-family-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Mein ___ heißt Ali",
                "tr": "Aile üyesini belirtir."
            },
            "answer": "Vater",
            "options": [
                "Vater",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „Vater“.",
                "tr": "Cümle „Vater“ ile doğru olur."
            }
        },
        {
            "id": "a1-family-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ali",
                "heißt",
                "Vater",
                "Mein"
            ],
            "answer": [
                "Mein",
                "Vater",
                "heißt",
                "Ali"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-family-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich habe eine ___",
                "tr": "Kız kardeşten bahseder."
            },
            "answer": "Schwester",
            "options": [
                "Schwester",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „Schwester“.",
                "tr": "Cümle „Schwester“ ile doğru olur."
            }
        },
        {
            "id": "a1-family-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Schwester",
                "eine",
                "habe",
                "Ich"
            ],
            "answer": [
                "Ich",
                "habe",
                "eine",
                "Schwester"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-family-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Das ist meine ___",
                "tr": "Aileyi tanıtır."
            },
            "answer": "Familie",
            "options": [
                "Familie",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „Familie“.",
                "tr": "Cümle „Familie“ ile doğru olur."
            }
        },
        {
            "id": "a1-family-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Familie",
                "meine",
                "ist",
                "Das"
            ],
            "answer": [
                "Das",
                "ist",
                "meine",
                "Familie"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-family-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Mein ___ ist fünf Jahre alt",
                "tr": "Çocuktan bahseder."
            },
            "answer": "Kind",
            "options": [
                "Kind",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „Kind“.",
                "tr": "Cümle „Kind“ ile doğru olur."
            }
        },
        {
            "id": "a1-family-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "fünf",
                "ist",
                "Kind",
                "Mein"
            ],
            "answer": [
                "Mein",
                "Kind",
                "ist",
                "fünf"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-family-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Mutter",
            "back": "anne",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-family-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Vater",
            "back": "baba",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-family-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Bruder",
            "back": "erkek kardeş",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-family-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Schwester",
            "back": "kız kardeş",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-family-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Kind",
            "back": "çocuk",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-family-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„Mutter“ bedeutet „anne“.",
                "tr": "„Mutter\", „anne\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-family-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„Vater“ bedeutet „Tisch“.",
                "tr": "„Vater\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-family-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„Bruder“ bedeutet „erkek kardeş“.",
                "tr": "„Bruder\", „erkek kardeş\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-family-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„Schwester“ bedeutet „Stuhl“.",
                "tr": "„Schwester\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-family-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Kind",
                "tr": "çocuk"
            },
            "audioLabel": {
                "de": "Kind",
                "tr": "çocuk"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "çocuk"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Kind“ gehört. Das passt zu „çocuk“.",
                "tr": "„Kind\" duydun. Bu „çocuk\" anlamına gelir."
            }
        },
        {
            "id": "a1-family-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Tochter",
                "tr": "kız çocuk"
            },
            "audioLabel": {
                "de": "Tochter",
                "tr": "kız çocuk"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "kız çocuk"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Tochter“ gehört. Das passt zu „kız çocuk“.",
                "tr": "„Tochter\" duydun. Bu „kız çocuk\" anlamına gelir."
            }
        },
        {
            "id": "a1-family-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Sohn",
                "tr": "erkek çocuk"
            },
            "audioLabel": {
                "de": "Sohn",
                "tr": "erkek çocuk"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "erkek çocuk"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Sohn“ gehört. Das passt zu „erkek çocuk“.",
                "tr": "„Sohn\" duydun. Bu „erkek çocuk\" anlamına gelir."
            }
        },
        {
            "id": "a1-family-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Familie",
                "tr": "aile"
            },
            "audioLabel": {
                "de": "Familie",
                "tr": "aile"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "aile"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Familie“ gehört. Das passt zu „aile“.",
                "tr": "„Familie\" duydun. Bu „aile\" anlamına gelir."
            }
        }
    ],
    "a1-shopping": [
        {
            "id": "a1-shopping-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Brot“?",
                "tr": "„Brot“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ekmek"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Brot“ bedeutet „ekmek“.",
                "tr": "„Brot“, „ekmek“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Milch“?",
                "tr": "„Milch“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "süt"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Milch“ bedeutet „süt“.",
                "tr": "„Milch“, „süt“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Wasser“?",
                "tr": "„Wasser“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "su"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Wasser“ bedeutet „su“.",
                "tr": "„Wasser“, „su“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Kasse“?",
                "tr": "„Kasse“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "kasa"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Kasse“ bedeutet „kasa“.",
                "tr": "„Kasse“, „kasa“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Preis“?",
                "tr": "„Preis“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "fiyat"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Preis“ bedeutet „fiyat“.",
                "tr": "„Preis“, „fiyat“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „teuer“?",
                "tr": "„teuer“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "pahalı"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„teuer“ bedeutet „pahalı“.",
                "tr": "„teuer“, „pahalı“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „billig“?",
                "tr": "„billig“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ucuz"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„billig“ bedeutet „ucuz“.",
                "tr": "„billig“, „ucuz“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „bezahlen“?",
                "tr": "„bezahlen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ödemek"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„bezahlen“ bedeutet „ödemek“.",
                "tr": "„bezahlen“, „ödemek“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „bitte“?",
                "tr": "„bitte“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "lütfen"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„bitte“ bedeutet „lütfen“.",
                "tr": "„bitte“, „lütfen“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Tüte“?",
                "tr": "„Tüte“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "poşet"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Tüte“ bedeutet „poşet“.",
                "tr": "„Tüte“, „poşet“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Supermarkt“?",
                "tr": "„Supermarkt“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "süpermarket"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Supermarkt“ bedeutet „süpermarket“.",
                "tr": "„Supermarkt“, „süpermarket“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Karte“?",
                "tr": "„Karte“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Einkaufen“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "kart"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Karte“ bedeutet „kart“.",
                "tr": "„Karte“, „kart“ anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Einkaufen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Brot",
                    "right": "ekmek"
                },
                {
                    "left": "Milch",
                    "right": "süt"
                },
                {
                    "left": "Wasser",
                    "right": "su"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-shopping-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Einkaufen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Kasse",
                    "right": "kasa"
                },
                {
                    "left": "Preis",
                    "right": "fiyat"
                },
                {
                    "left": "teuer",
                    "right": "pahalı"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-shopping-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Einkaufen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "billig",
                    "right": "ucuz"
                },
                {
                    "left": "bezahlen",
                    "right": "ödemek"
                },
                {
                    "left": "bitte",
                    "right": "lütfen"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-shopping-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Einkaufen“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Tüte",
                    "right": "poşet"
                },
                {
                    "left": "Supermarkt",
                    "right": "süpermarket"
                },
                {
                    "left": "Karte",
                    "right": "kart"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-shopping-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich möchte ein ___",
                "tr": "Alışverişte istek belirtir."
            },
            "answer": "Brot",
            "options": [
                "Brot",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „Brot“.",
                "tr": "Cümle „Brot“ ile doğru olur."
            }
        },
        {
            "id": "a1-shopping-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Brot",
                "ein",
                "möchte",
                "Ich"
            ],
            "answer": [
                "Ich",
                "möchte",
                "ein",
                "Brot"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-shopping-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Was kostet das ___?",
                "tr": "Fiyat sorar."
            },
            "answer": "Wasser",
            "options": [
                "Wasser",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „Wasser“.",
                "tr": "Cümle „Wasser“ ile doğru olur."
            }
        },
        {
            "id": "a1-shopping-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Wasser",
                "das",
                "kostet",
                "Was"
            ],
            "answer": [
                "Was",
                "kostet",
                "das",
                "Wasser"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-shopping-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich zahle mit ___",
                "tr": "Ödeme türünü söyler."
            },
            "answer": "Karte",
            "options": [
                "Karte",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „Karte“.",
                "tr": "Cümle „Karte“ ile doğru olur."
            }
        },
        {
            "id": "a1-shopping-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Karte",
                "mit",
                "zahle",
                "Ich"
            ],
            "answer": [
                "Ich",
                "zahle",
                "mit",
                "Karte"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-shopping-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Wo ist die ___?",
                "tr": "Kasayı sorar."
            },
            "answer": "Kasse",
            "options": [
                "Kasse",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „Kasse“.",
                "tr": "Cümle „Kasse“ ile doğru olur."
            }
        },
        {
            "id": "a1-shopping-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Kasse",
                "die",
                "ist",
                "Wo"
            ],
            "answer": [
                "Wo",
                "ist",
                "die",
                "Kasse"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-shopping-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Eine Tüte, ___",
                "tr": "Kibar rica eder."
            },
            "answer": "bitte",
            "options": [
                "bitte",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „bitte“.",
                "tr": "Cümle „bitte“ ile doğru olur."
            }
        },
        {
            "id": "a1-shopping-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "bitte",
                "Tüte,",
                "Eine"
            ],
            "answer": [
                "Eine",
                "Tüte,",
                "bitte"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-shopping-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Brot",
            "back": "ekmek",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-shopping-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Milch",
            "back": "süt",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-shopping-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Wasser",
            "back": "su",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-shopping-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Kasse",
            "back": "kasa",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-shopping-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Preis",
            "back": "fiyat",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-shopping-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„Brot“ bedeutet „ekmek“.",
                "tr": "„Brot\", „ekmek\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-shopping-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„Milch“ bedeutet „Tisch“.",
                "tr": "„Milch\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-shopping-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„Wasser“ bedeutet „su“.",
                "tr": "„Wasser\", „su\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-shopping-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„Kasse“ bedeutet „Stuhl“.",
                "tr": "„Kasse\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-shopping-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Preis",
                "tr": "fiyat"
            },
            "audioLabel": {
                "de": "Preis",
                "tr": "fiyat"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "fiyat"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Preis“ gehört. Das passt zu „fiyat“.",
                "tr": "„Preis\" duydun. Bu „fiyat\" anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "teuer",
                "tr": "pahalı"
            },
            "audioLabel": {
                "de": "teuer",
                "tr": "pahalı"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "pahalı"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „teuer“ gehört. Das passt zu „pahalı“.",
                "tr": "„teuer\" duydun. Bu „pahalı\" anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "billig",
                "tr": "ucuz"
            },
            "audioLabel": {
                "de": "billig",
                "tr": "ucuz"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ucuz"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „billig“ gehört. Das passt zu „ucuz“.",
                "tr": "„billig\" duydun. Bu „ucuz\" anlamına gelir."
            }
        },
        {
            "id": "a1-shopping-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "bezahlen",
                "tr": "ödemek"
            },
            "audioLabel": {
                "de": "bezahlen",
                "tr": "ödemek"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ödemek"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „bezahlen“ gehört. Das passt zu „ödemek“.",
                "tr": "„bezahlen\" duydun. Bu „ödemek\" anlamına gelir."
            }
        }
    ],
    "a1-doctor": [
        {
            "id": "a1-doctor-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Arzt“?",
                "tr": "„Arzt“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "doktor"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Arzt“ bedeutet „doktor“.",
                "tr": "„Arzt“, „doktor“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Termin“?",
                "tr": "„Termin“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "randevu"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Termin“ bedeutet „randevu“.",
                "tr": "„Termin“, „randevu“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Schmerzen“?",
                "tr": "„Schmerzen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ağrı"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Schmerzen“ bedeutet „ağrı“.",
                "tr": "„Schmerzen“, „ağrı“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „krank“?",
                "tr": "„krank“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "hasta"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„krank“ bedeutet „hasta“.",
                "tr": "„krank“, „hasta“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Medikament“?",
                "tr": "„Medikament“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ilaç"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Medikament“ bedeutet „ilaç“.",
                "tr": "„Medikament“, „ilaç“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Kopf“?",
                "tr": "„Kopf“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "baş"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Kopf“ bedeutet „baş“.",
                "tr": "„Kopf“, „baş“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Bauch“?",
                "tr": "„Bauch“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "karın"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Bauch“ bedeutet „karın“.",
                "tr": "„Bauch“, „karın“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Fieber“?",
                "tr": "„Fieber“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ateş"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Fieber“ bedeutet „ateş“.",
                "tr": "„Fieber“, „ateş“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Hilfe“?",
                "tr": "„Hilfe“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yardım"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Hilfe“ bedeutet „yardım“.",
                "tr": "„Hilfe“, „yardım“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Praxis“?",
                "tr": "„Praxis“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "muayenehane"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Praxis“ bedeutet „muayenehane“.",
                "tr": "„Praxis“, „muayenehane“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „heute“?",
                "tr": "„heute“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "bugün"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„heute“ bedeutet „bugün“.",
                "tr": "„heute“, „bugün“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „morgen“?",
                "tr": "„morgen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Arzt & Termin“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yarın"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„morgen“ bedeutet „yarın“.",
                "tr": "„morgen“, „yarın“ anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Arzt & Termin“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Arzt",
                    "right": "doktor"
                },
                {
                    "left": "Termin",
                    "right": "randevu"
                },
                {
                    "left": "Schmerzen",
                    "right": "ağrı"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-doctor-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Arzt & Termin“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "krank",
                    "right": "hasta"
                },
                {
                    "left": "Medikament",
                    "right": "ilaç"
                },
                {
                    "left": "Kopf",
                    "right": "baş"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-doctor-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Arzt & Termin“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Bauch",
                    "right": "karın"
                },
                {
                    "left": "Fieber",
                    "right": "ateş"
                },
                {
                    "left": "Hilfe",
                    "right": "yardım"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-doctor-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Arzt & Termin“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Praxis",
                    "right": "muayenehane"
                },
                {
                    "left": "heute",
                    "right": "bugün"
                },
                {
                    "left": "morgen",
                    "right": "yarın"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-doctor-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich habe ___",
                "tr": "Şikayeti anlatır."
            },
            "answer": "Schmerzen",
            "options": [
                "Schmerzen",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „Schmerzen“.",
                "tr": "Cümle „Schmerzen“ ile doğru olur."
            }
        },
        {
            "id": "a1-doctor-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Schmerzen",
                "habe",
                "Ich"
            ],
            "answer": [
                "Ich",
                "habe",
                "Schmerzen"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-doctor-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich brauche einen ___",
                "tr": "Randevu ister."
            },
            "answer": "Termin",
            "options": [
                "Termin",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „Termin“.",
                "tr": "Cümle „Termin“ ile doğru olur."
            }
        },
        {
            "id": "a1-doctor-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Termin",
                "einen",
                "brauche",
                "Ich"
            ],
            "answer": [
                "Ich",
                "brauche",
                "einen",
                "Termin"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-doctor-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Mir ist ___",
                "tr": "Durumu anlatır."
            },
            "answer": "krank",
            "options": [
                "krank",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „krank“.",
                "tr": "Cümle „krank“ ile doğru olur."
            }
        },
        {
            "id": "a1-doctor-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "krank",
                "ist",
                "Mir"
            ],
            "answer": [
                "Mir",
                "ist",
                "krank"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-doctor-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich habe ___",
                "tr": "Belirti söyler."
            },
            "answer": "Fieber",
            "options": [
                "Fieber",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „Fieber“.",
                "tr": "Cümle „Fieber“ ile doğru olur."
            }
        },
        {
            "id": "a1-doctor-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Fieber",
                "habe",
                "Ich"
            ],
            "answer": [
                "Ich",
                "habe",
                "Fieber"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-doctor-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Der ___ hilft mir",
                "tr": "Doktoru belirtir."
            },
            "answer": "Arzt",
            "options": [
                "Arzt",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „Arzt“.",
                "tr": "Cümle „Arzt“ ile doğru olur."
            }
        },
        {
            "id": "a1-doctor-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "mir",
                "hilft",
                "Arzt",
                "Der"
            ],
            "answer": [
                "Der",
                "Arzt",
                "hilft",
                "mir"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-doctor-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Arzt",
            "back": "doktor",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-doctor-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Termin",
            "back": "randevu",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-doctor-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Schmerzen",
            "back": "ağrı",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-doctor-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "krank",
            "back": "hasta",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-doctor-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Medikament",
            "back": "ilaç",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-doctor-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„Arzt“ bedeutet „doktor“.",
                "tr": "„Arzt\", „doktor\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-doctor-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„Termin“ bedeutet „Tisch“.",
                "tr": "„Termin\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-doctor-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„Schmerzen“ bedeutet „ağrı“.",
                "tr": "„Schmerzen\", „ağrı\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-doctor-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„krank“ bedeutet „Stuhl“.",
                "tr": "„krank\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-doctor-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Medikament",
                "tr": "ilaç"
            },
            "audioLabel": {
                "de": "Medikament",
                "tr": "ilaç"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ilaç"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Medikament“ gehört. Das passt zu „ilaç“.",
                "tr": "„Medikament\" duydun. Bu „ilaç\" anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Kopf",
                "tr": "baş"
            },
            "audioLabel": {
                "de": "Kopf",
                "tr": "baş"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "baş"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Kopf“ gehört. Das passt zu „baş“.",
                "tr": "„Kopf\" duydun. Bu „baş\" anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Bauch",
                "tr": "karın"
            },
            "audioLabel": {
                "de": "Bauch",
                "tr": "karın"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "karın"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Bauch“ gehört. Das passt zu „karın“.",
                "tr": "„Bauch\" duydun. Bu „karın\" anlamına gelir."
            }
        },
        {
            "id": "a1-doctor-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Fieber",
                "tr": "ateş"
            },
            "audioLabel": {
                "de": "Fieber",
                "tr": "ateş"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ateş"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Fieber“ gehört. Das passt zu „ateş“.",
                "tr": "„Fieber\" duydun. Bu „ateş\" anlamına gelir."
            }
        }
    ],
    "a1-work": [
        {
            "id": "a1-work-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Arbeit“?",
                "tr": "„Arbeit“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "iş"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Arbeit“ bedeutet „iş“.",
                "tr": "„Arbeit“, „iş“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Beruf“?",
                "tr": "„Beruf“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "meslek"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Beruf“ bedeutet „meslek“.",
                "tr": "„Beruf“, „meslek“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Firma“?",
                "tr": "„Firma“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "şirket"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Firma“ bedeutet „şirket“.",
                "tr": "„Firma“, „şirket“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Kollege“?",
                "tr": "„Kollege“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "iş arkadaşı"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Kollege“ bedeutet „iş arkadaşı“.",
                "tr": "„Kollege“, „iş arkadaşı“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Chef“?",
                "tr": "„Chef“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "patron"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Chef“ bedeutet „patron“.",
                "tr": "„Chef“, „patron“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Büro“?",
                "tr": "„Büro“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ofis"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Büro“ bedeutet „ofis“.",
                "tr": "„Büro“, „ofis“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Computer“?",
                "tr": "„Computer“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "bilgisayar"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Computer“ bedeutet „bilgisayar“.",
                "tr": "„Computer“, „bilgisayar“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Pause“?",
                "tr": "„Pause“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "mola"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Pause“ bedeutet „mola“.",
                "tr": "„Pause“, „mola“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Termin“?",
                "tr": "„Termin“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "randevu"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Termin“ bedeutet „randevu“.",
                "tr": "„Termin“, „randevu“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Schicht“?",
                "tr": "„Schicht“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "vardiya"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Schicht“ bedeutet „vardiya“.",
                "tr": "„Schicht“, „vardiya“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „lernen“?",
                "tr": "„lernen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "öğrenmek"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„lernen“ bedeutet „öğrenmek“.",
                "tr": "„lernen“, „öğrenmek“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „arbeiten“?",
                "tr": "„arbeiten“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Beruf & Arbeit“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "çalışmak"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„arbeiten“ bedeutet „çalışmak“.",
                "tr": "„arbeiten“, „çalışmak“ anlamına gelir."
            }
        },
        {
            "id": "a1-work-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Beruf & Arbeit“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Arbeit",
                    "right": "iş"
                },
                {
                    "left": "Beruf",
                    "right": "meslek"
                },
                {
                    "left": "Firma",
                    "right": "şirket"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-work-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Beruf & Arbeit“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Kollege",
                    "right": "iş arkadaşı"
                },
                {
                    "left": "Chef",
                    "right": "patron"
                },
                {
                    "left": "Büro",
                    "right": "ofis"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-work-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Beruf & Arbeit“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Computer",
                    "right": "bilgisayar"
                },
                {
                    "left": "Pause",
                    "right": "mola"
                },
                {
                    "left": "Termin",
                    "right": "randevu"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-work-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Beruf & Arbeit“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Schicht",
                    "right": "vardiya"
                },
                {
                    "left": "lernen",
                    "right": "öğrenmek"
                },
                {
                    "left": "arbeiten",
                    "right": "çalışmak"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-work-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich arbeite in einer ___",
                "tr": "İş yerini söyler."
            },
            "answer": "Firma",
            "options": [
                "Firma",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „Firma“.",
                "tr": "Cümle „Firma“ ile doğru olur."
            }
        },
        {
            "id": "a1-work-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "einer",
                "in",
                "arbeite",
                "Ich"
            ],
            "answer": [
                "Ich",
                "arbeite",
                "in",
                "einer"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-work-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Mein ___ ist Fachinformatiker",
                "tr": "Meslek belirtir."
            },
            "answer": "Beruf",
            "options": [
                "Beruf",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „Beruf“.",
                "tr": "Cümle „Beruf“ ile doğru olur."
            }
        },
        {
            "id": "a1-work-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Fachinformatiker",
                "ist",
                "Beruf",
                "Mein"
            ],
            "answer": [
                "Mein",
                "Beruf",
                "ist",
                "Fachinformatiker"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-work-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich mache eine ___",
                "tr": "İş arasında kullanılır."
            },
            "answer": "Pause",
            "options": [
                "Pause",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „Pause“.",
                "tr": "Cümle „Pause“ ile doğru olur."
            }
        },
        {
            "id": "a1-work-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Pause",
                "eine",
                "mache",
                "Ich"
            ],
            "answer": [
                "Ich",
                "mache",
                "eine",
                "Pause"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-work-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Der ___ ist freundlich",
                "tr": "İş arkadaşını anlatır."
            },
            "answer": "Kollege",
            "options": [
                "Kollege",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „Kollege“.",
                "tr": "Cümle „Kollege“ ile doğru olur."
            }
        },
        {
            "id": "a1-work-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "freundlich",
                "ist",
                "Kollege",
                "Der"
            ],
            "answer": [
                "Der",
                "Kollege",
                "ist",
                "freundlich"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-work-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich lerne am ___",
                "tr": "Araç belirtir."
            },
            "answer": "Computer",
            "options": [
                "Computer",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „Computer“.",
                "tr": "Cümle „Computer“ ile doğru olur."
            }
        },
        {
            "id": "a1-work-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Computer",
                "am",
                "lerne",
                "Ich"
            ],
            "answer": [
                "Ich",
                "lerne",
                "am",
                "Computer"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-work-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Arbeit",
            "back": "iş",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-work-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Beruf",
            "back": "meslek",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-work-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Firma",
            "back": "şirket",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-work-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Kollege",
            "back": "iş arkadaşı",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-work-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Chef",
            "back": "patron",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-work-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„Arbeit“ bedeutet „iş“.",
                "tr": "„Arbeit\", „iş\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-work-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„Beruf“ bedeutet „Tisch“.",
                "tr": "„Beruf\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-work-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„Firma“ bedeutet „şirket“.",
                "tr": "„Firma\", „şirket\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-work-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„Kollege“ bedeutet „Stuhl“.",
                "tr": "„Kollege\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-work-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Chef",
                "tr": "patron"
            },
            "audioLabel": {
                "de": "Chef",
                "tr": "patron"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "patron"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Chef“ gehört. Das passt zu „patron“.",
                "tr": "„Chef\" duydun. Bu „patron\" anlamına gelir."
            }
        },
        {
            "id": "a1-work-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Büro",
                "tr": "ofis"
            },
            "audioLabel": {
                "de": "Büro",
                "tr": "ofis"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "ofis"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Büro“ gehört. Das passt zu „ofis“.",
                "tr": "„Büro\" duydun. Bu „ofis\" anlamına gelir."
            }
        },
        {
            "id": "a1-work-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Computer",
                "tr": "bilgisayar"
            },
            "audioLabel": {
                "de": "Computer",
                "tr": "bilgisayar"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "bilgisayar"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Computer“ gehört. Das passt zu „bilgisayar“.",
                "tr": "„Computer\" duydun. Bu „bilgisayar\" anlamına gelir."
            }
        },
        {
            "id": "a1-work-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Pause",
                "tr": "mola"
            },
            "audioLabel": {
                "de": "Pause",
                "tr": "mola"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "mola"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Pause“ gehört. Das passt zu „mola“.",
                "tr": "„Pause\" duydun. Bu „mola\" anlamına gelir."
            }
        }
    ],
    "a1-traffic": [
        {
            "id": "a1-traffic-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Bus“?",
                "tr": "„Bus“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "otobüs"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Bus“ bedeutet „otobüs“.",
                "tr": "„Bus“, „otobüs“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Bahn“?",
                "tr": "„Bahn“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "tren"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Bahn“ bedeutet „tren“.",
                "tr": "„Bahn“, „tren“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Bahnhof“?",
                "tr": "„Bahnhof“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "tren istasyonu"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Bahnhof“ bedeutet „tren istasyonu“.",
                "tr": "„Bahnhof“, „tren istasyonu“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Haltestelle“?",
                "tr": "„Haltestelle“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "durak"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Haltestelle“ bedeutet „durak“.",
                "tr": "„Haltestelle“, „durak“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Straße“?",
                "tr": "„Straße“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "cadde"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Straße“ bedeutet „cadde“.",
                "tr": "„Straße“, „cadde“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „links“?",
                "tr": "„links“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sol"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„links“ bedeutet „sol“.",
                "tr": "„links“, „sol“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „rechts“?",
                "tr": "„rechts“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sağ"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„rechts“ bedeutet „sağ“.",
                "tr": "„rechts“, „sağ“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „geradeaus“?",
                "tr": "„geradeaus“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "düz"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„geradeaus“ bedeutet „düz“.",
                "tr": "„geradeaus“, „düz“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Ticket“?",
                "tr": "„Ticket“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "bilet"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Ticket“ bedeutet „bilet“.",
                "tr": "„Ticket“, „bilet“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „fahren“?",
                "tr": "„fahren“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "gitmek/sürmek"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„fahren“ bedeutet „gitmek/sürmek“.",
                "tr": "„fahren“, „gitmek/sürmek“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „steigen“?",
                "tr": "„steigen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "binmek"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„steigen“ bedeutet „binmek“.",
                "tr": "„steigen“, „binmek“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „aussteigen“?",
                "tr": "„aussteigen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Verkehr“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "inmek"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„aussteigen“ bedeutet „inmek“.",
                "tr": "„aussteigen“, „inmek“ anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Verkehr“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Bus",
                    "right": "otobüs"
                },
                {
                    "left": "Bahn",
                    "right": "tren"
                },
                {
                    "left": "Bahnhof",
                    "right": "tren istasyonu"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-traffic-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Verkehr“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Haltestelle",
                    "right": "durak"
                },
                {
                    "left": "Straße",
                    "right": "cadde"
                },
                {
                    "left": "links",
                    "right": "sol"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-traffic-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Verkehr“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "rechts",
                    "right": "sağ"
                },
                {
                    "left": "geradeaus",
                    "right": "düz"
                },
                {
                    "left": "Ticket",
                    "right": "bilet"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-traffic-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Verkehr“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "fahren",
                    "right": "gitmek/sürmek"
                },
                {
                    "left": "steigen",
                    "right": "binmek"
                },
                {
                    "left": "aussteigen",
                    "right": "inmek"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-traffic-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich fahre mit dem ___",
                "tr": "Ulaşım aracı belirtir."
            },
            "answer": "Bus",
            "options": [
                "Bus",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „Bus“.",
                "tr": "Cümle „Bus“ ile doğru olur."
            }
        },
        {
            "id": "a1-traffic-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "dem",
                "mit",
                "fahre",
                "Ich"
            ],
            "answer": [
                "Ich",
                "fahre",
                "mit",
                "dem"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-traffic-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Wo ist die ___?",
                "tr": "Durak sorar."
            },
            "answer": "Haltestelle",
            "options": [
                "Haltestelle",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „Haltestelle“.",
                "tr": "Cümle „Haltestelle“ ile doğru olur."
            }
        },
        {
            "id": "a1-traffic-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Haltestelle",
                "die",
                "ist",
                "Wo"
            ],
            "answer": [
                "Wo",
                "ist",
                "die",
                "Haltestelle"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-traffic-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Gehen Sie ___",
                "tr": "Yol tarifi verir."
            },
            "answer": "geradeaus",
            "options": [
                "geradeaus",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „geradeaus“.",
                "tr": "Cümle „geradeaus“ ile doğru olur."
            }
        },
        {
            "id": "a1-traffic-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "geradeaus",
                "Sie",
                "Gehen"
            ],
            "answer": [
                "Gehen",
                "Sie",
                "geradeaus"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-traffic-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich brauche ein ___",
                "tr": "Bilet ister."
            },
            "answer": "Ticket",
            "options": [
                "Ticket",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „Ticket“.",
                "tr": "Cümle „Ticket“ ile doğru olur."
            }
        },
        {
            "id": "a1-traffic-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Ticket",
                "ein",
                "brauche",
                "Ich"
            ],
            "answer": [
                "Ich",
                "brauche",
                "ein",
                "Ticket"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-traffic-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Der Bahnhof ist ___",
                "tr": "Yön söyler."
            },
            "answer": "rechts",
            "options": [
                "rechts",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „rechts“.",
                "tr": "Cümle „rechts“ ile doğru olur."
            }
        },
        {
            "id": "a1-traffic-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "rechts",
                "ist",
                "Bahnhof",
                "Der"
            ],
            "answer": [
                "Der",
                "Bahnhof",
                "ist",
                "rechts"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-traffic-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Bus",
            "back": "otobüs",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-traffic-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Bahn",
            "back": "tren",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-traffic-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Bahnhof",
            "back": "tren istasyonu",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-traffic-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Haltestelle",
            "back": "durak",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-traffic-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "Straße",
            "back": "cadde",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-traffic-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„Bus“ bedeutet „otobüs“.",
                "tr": "„Bus\", „otobüs\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-traffic-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„Bahn“ bedeutet „Tisch“.",
                "tr": "„Bahn\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-traffic-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„Bahnhof“ bedeutet „tren istasyonu“.",
                "tr": "„Bahnhof\", „tren istasyonu\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-traffic-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„Haltestelle“ bedeutet „Stuhl“.",
                "tr": "„Haltestelle\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-traffic-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "Straße",
                "tr": "cadde"
            },
            "audioLabel": {
                "de": "Straße",
                "tr": "cadde"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "cadde"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „Straße“ gehört. Das passt zu „cadde“.",
                "tr": "„Straße\" duydun. Bu „cadde\" anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "links",
                "tr": "sol"
            },
            "audioLabel": {
                "de": "links",
                "tr": "sol"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sol"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „links“ gehört. Das passt zu „sol“.",
                "tr": "„links\" duydun. Bu „sol\" anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "rechts",
                "tr": "sağ"
            },
            "audioLabel": {
                "de": "rechts",
                "tr": "sağ"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "sağ"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „rechts“ gehört. Das passt zu „sağ“.",
                "tr": "„rechts\" duydun. Bu „sağ\" anlamına gelir."
            }
        },
        {
            "id": "a1-traffic-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "geradeaus",
                "tr": "düz"
            },
            "audioLabel": {
                "de": "geradeaus",
                "tr": "düz"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "düz"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „geradeaus“ gehört. Das passt zu „düz“.",
                "tr": "„geradeaus\" duydun. Bu „düz\" anlamına gelir."
            }
        }
    ],
    "a1-everyday": [
        {
            "id": "a1-everyday-mc-1",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „heute“?",
                "tr": "„heute“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "bugün"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„heute“ bedeutet „bugün“.",
                "tr": "„heute“, „bugün“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-2",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „morgen“?",
                "tr": "„morgen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yarın"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„morgen“ bedeutet „yarın“.",
                "tr": "„morgen“, „yarın“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-3",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „gestern“?",
                "tr": "„gestern“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "dün"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„gestern“ bedeutet „dün“.",
                "tr": "„gestern“, „dün“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-4",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „essen“?",
                "tr": "„essen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yemek yemek"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„essen“ bedeutet „yemek yemek“.",
                "tr": "„essen“, „yemek yemek“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-5",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „trinken“?",
                "tr": "„trinken“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "içmek"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„trinken“ bedeutet „içmek“.",
                "tr": "„trinken“, „içmek“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-6",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „gehen“?",
                "tr": "„gehen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "gitmek"
                },
                {
                    "id": "b",
                    "text": "Telefon"
                },
                {
                    "id": "c",
                    "text": "Auto"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„gehen“ bedeutet „gitmek“.",
                "tr": "„gehen“, „gitmek“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-7",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „kommen“?",
                "tr": "„kommen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "gelmek"
                },
                {
                    "id": "b",
                    "text": "Hund"
                },
                {
                    "id": "c",
                    "text": "Fenster"
                },
                {
                    "id": "d",
                    "text": "Lampe"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„kommen“ bedeutet „gelmek“.",
                "tr": "„kommen“, „gelmek“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-8",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „machen“?",
                "tr": "„machen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yapmak"
                },
                {
                    "id": "b",
                    "text": "Auto"
                },
                {
                    "id": "c",
                    "text": "Tisch"
                },
                {
                    "id": "d",
                    "text": "Stuhl"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„machen“ bedeutet „yapmak“.",
                "tr": "„machen“, „yapmak“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-9",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „zu Hause“?",
                "tr": "„zu Hause“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "evde"
                },
                {
                    "id": "b",
                    "text": "Fenster"
                },
                {
                    "id": "c",
                    "text": "Lampe"
                },
                {
                    "id": "d",
                    "text": "Schlüssel"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„zu Hause“ bedeutet „evde“.",
                "tr": "„zu Hause“, „evde“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-10",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „Schule“?",
                "tr": "„Schule“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "okul"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Telefon"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„Schule“ bedeutet „okul“.",
                "tr": "„Schule“, „okul“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-11",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „lernen“?",
                "tr": "„lernen“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "öğrenmek"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„lernen“ bedeutet „öğrenmek“.",
                "tr": "„lernen“, „öğrenmek“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-mc-12",
            "type": "multiple_choice",
            "prompt": {
                "de": "Welche Bedeutung passt zu „müde“?",
                "tr": "„müde“ için hangi anlam uygundur?"
            },
            "instruction": {
                "de": "Wähle die passende Antwort.",
                "tr": "Uygun cevabı seç."
            },
            "hint": {
                "de": "Das Wort gehört zur Lektion „Alltag“.",
                "tr": "Kelime bu dersin konusuyla ilgilidir."
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yorgun"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "„müde“ bedeutet „yorgun“.",
                "tr": "„müde“, „yorgun“ anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-match-1",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Alltag“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "heute",
                    "right": "bugün"
                },
                {
                    "left": "morgen",
                    "right": "yarın"
                },
                {
                    "left": "gestern",
                    "right": "dün"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-everyday-match-4",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Alltag“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "essen",
                    "right": "yemek yemek"
                },
                {
                    "left": "trinken",
                    "right": "içmek"
                },
                {
                    "left": "gehen",
                    "right": "gitmek"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-everyday-match-7",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Alltag“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "kommen",
                    "right": "gelmek"
                },
                {
                    "left": "machen",
                    "right": "yapmak"
                },
                {
                    "left": "zu Hause",
                    "right": "evde"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-everyday-match-10",
            "type": "matching",
            "prompt": {
                "de": "Ordne die Wörter richtig zu.",
                "tr": "Kelimeleri doğru eşleştir."
            },
            "instruction": {
                "de": "Wähle nacheinander passende Paare.",
                "tr": "Sırayla uygun çiftleri seç."
            },
            "hint": {
                "de": "Alle Wörter stammen aus „Alltag“.",
                "tr": "Tüm kelimeler bu dersten geliyor."
            },
            "pairs": [
                {
                    "left": "Schule",
                    "right": "okul"
                },
                {
                    "left": "lernen",
                    "right": "öğrenmek"
                },
                {
                    "left": "müde",
                    "right": "yorgun"
                }
            ],
            "answer": "all",
            "explain": {
                "de": "Alle Wortpaare wurden passend verbunden.",
                "tr": "Tüm kelime çiftleri doğru eşleştirildi."
            }
        },
        {
            "id": "a1-everyday-blank-2",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich ___ Wasser",
                "tr": "İçmek fiilini kullanır."
            },
            "answer": "trinke",
            "options": [
                "trinke",
                "Fenster",
                "Stuhl",
                "Telefon"
            ],
            "explain": {
                "de": "Der Satz passt mit „trinke“.",
                "tr": "Cümle „trinke“ ile doğru olur."
            }
        },
        {
            "id": "a1-everyday-order-2",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Wasser",
                "trinke",
                "Ich"
            ],
            "answer": [
                "Ich",
                "trinke",
                "Wasser"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-everyday-blank-3",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich ___ nach Hause",
                "tr": "Gitmek fiilini kullanır."
            },
            "answer": "gehe",
            "options": [
                "gehe",
                "Tisch",
                "Schlüssel",
                "Hund"
            ],
            "explain": {
                "de": "Der Satz passt mit „gehe“.",
                "tr": "Cümle „gehe“ ile doğru olur."
            }
        },
        {
            "id": "a1-everyday-order-3",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Hause",
                "nach",
                "gehe",
                "Ich"
            ],
            "answer": [
                "Ich",
                "gehe",
                "nach",
                "Hause"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-everyday-blank-4",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Heute ___ ich Deutsch",
                "tr": "Öğrenmek fiilini kullanır."
            },
            "answer": "lerne",
            "options": [
                "lerne",
                "Lampe",
                "Telefon",
                "Auto"
            ],
            "explain": {
                "de": "Der Satz passt mit „lerne“.",
                "tr": "Cümle „lerne“ ile doğru olur."
            }
        },
        {
            "id": "a1-everyday-order-4",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "Deutsch",
                "ich",
                "lerne",
                "Heute"
            ],
            "answer": [
                "Heute",
                "lerne",
                "ich",
                "Deutsch"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-everyday-blank-5",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Ich bin ___",
                "tr": "Duygu/durum anlatır."
            },
            "answer": "müde",
            "options": [
                "müde",
                "Stuhl",
                "Hund",
                "Fenster"
            ],
            "explain": {
                "de": "Der Satz passt mit „müde“.",
                "tr": "Cümle „müde“ ile doğru olur."
            }
        },
        {
            "id": "a1-everyday-order-5",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "müde",
                "bin",
                "Ich"
            ],
            "answer": [
                "Ich",
                "bin",
                "müde"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-everyday-blank-6",
            "type": "fill_blank",
            "prompt": {
                "de": "Ergänze den Satz.",
                "tr": "Cümleyi tamamla."
            },
            "instruction": {
                "de": "Tippe oder wähle das fehlende Wort.",
                "tr": "Eksik kelimeyi yaz veya seç."
            },
            "hint": {
                "de": "Achte auf den natürlichen Satz aus der Lektion.",
                "tr": "Dersteki doğal cümleye dikkat et."
            },
            "sentence": {
                "de": "Morgen ___ ich zur Schule",
                "tr": "Günlük plan belirtir."
            },
            "answer": "gehe",
            "options": [
                "gehe",
                "Schlüssel",
                "Auto",
                "Tisch"
            ],
            "explain": {
                "de": "Der Satz passt mit „gehe“.",
                "tr": "Cümle „gehe“ ile doğru olur."
            }
        },
        {
            "id": "a1-everyday-order-6",
            "type": "sentence_order",
            "prompt": {
                "de": "Bringe den Satz in die richtige Reihenfolge.",
                "tr": "Cümleyi doğru sıraya koy."
            },
            "instruction": {
                "de": "Tippe die Wörter in sinnvoller Reihenfolge an.",
                "tr": "Kelimelere doğru sırayla dokun."
            },
            "hint": {
                "de": "Im Deutschen ist die Wortstellung wichtig.",
                "tr": "Almancada kelime sırası önemlidir."
            },
            "tokens": [
                "zur",
                "ich",
                "gehe",
                "Morgen"
            ],
            "answer": [
                "Morgen",
                "gehe",
                "ich",
                "zur"
            ],
            "explain": {
                "de": "Die Reihenfolge bildet einen natürlichen deutschen Satz.",
                "tr": "Sıralama doğal bir Almanca cümle oluşturur."
            }
        },
        {
            "id": "a1-everyday-flash-1",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "heute",
            "back": "bugün",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-everyday-flash-2",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "morgen",
            "back": "yarın",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-everyday-flash-3",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "gestern",
            "back": "dün",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-everyday-flash-4",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "essen",
            "back": "yemek yemek",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-everyday-flash-5",
            "type": "flashcard",
            "prompt": {
                "de": "Vokabelkarte",
                "tr": "Kelime kartı"
            },
            "instruction": {
                "de": "Präge dir Vorder- und Rückseite ein.",
                "tr": "Kartın ön ve arka yüzünü ezberle."
            },
            "hint": {
                "de": "Sprich das Wort laut aus und prüfe erst danach die Rückseite.",
                "tr": "Kelimeyi yüksek sesle söyle ve sonra arka yüzü kontrol et."
            },
            "front": "trinken",
            "back": "içmek",
            "answer": "known",
            "explain": {
                "de": "Vokabelkarte bearbeitet.",
                "tr": "Kelime kartı işlendi."
            }
        },
        {
            "id": "a1-everyday-tf-1",
            "type": "true_false",
            "prompt": {
                "de": "„heute“ bedeutet „bugün“.",
                "tr": "„heute\", „bugün\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-everyday-tf-2",
            "type": "true_false",
            "prompt": {
                "de": "„morgen“ bedeutet „Tisch“.",
                "tr": "„morgen\", „Tisch\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-everyday-tf-3",
            "type": "true_false",
            "prompt": {
                "de": "„gestern“ bedeutet „dün“.",
                "tr": "„gestern\", „dün\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": true,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-everyday-tf-4",
            "type": "true_false",
            "prompt": {
                "de": "„essen“ bedeutet „Stuhl“.",
                "tr": "„essen\", „Stuhl\" anlamına gelir."
            },
            "instruction": {
                "de": "Entscheide: richtig oder falsch?",
                "tr": "Karar ver: doğru mu yanlış mı?"
            },
            "hint": {
                "de": "Vergleiche beide Sprachen. Die Hilfe verrät die Lösung nicht direkt.",
                "tr": "İki dili karşılaştır. Yardım çözümü doğrudan söylemez."
            },
            "answer": false,
            "explain": {
                "de": "Die Aussage wurde bewertet.",
                "tr": "İfade değerlendirildi."
            }
        },
        {
            "id": "a1-everyday-listen-1",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "trinken",
                "tr": "içmek"
            },
            "audioLabel": {
                "de": "trinken",
                "tr": "içmek"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "içmek"
                },
                {
                    "id": "b",
                    "text": "Tisch"
                },
                {
                    "id": "c",
                    "text": "Stuhl"
                },
                {
                    "id": "d",
                    "text": "Hund"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „trinken“ gehört. Das passt zu „içmek“.",
                "tr": "„trinken\" duydun. Bu „içmek\" anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-listen-2",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "gehen",
                "tr": "gitmek"
            },
            "audioLabel": {
                "de": "gehen",
                "tr": "gitmek"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "gitmek"
                },
                {
                    "id": "b",
                    "text": "Lampe"
                },
                {
                    "id": "c",
                    "text": "Schlüssel"
                },
                {
                    "id": "d",
                    "text": "Auto"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „gehen“ gehört. Das passt zu „gitmek“.",
                "tr": "„gehen\" duydun. Bu „gitmek\" anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-listen-3",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "kommen",
                "tr": "gelmek"
            },
            "audioLabel": {
                "de": "kommen",
                "tr": "gelmek"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "gelmek"
                },
                {
                    "id": "b",
                    "text": "Stuhl"
                },
                {
                    "id": "c",
                    "text": "Telefon"
                },
                {
                    "id": "d",
                    "text": "Fenster"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „kommen“ gehört. Das passt zu „gelmek“.",
                "tr": "„kommen\" duydun. Bu „gelmek\" anlamına gelir."
            }
        },
        {
            "id": "a1-everyday-listen-4",
            "type": "listening_choice",
            "prompt": {
                "de": "Höre dir den Ausdruck an und wähle die passende Bedeutung.",
                "tr": "İfadeyi dinle ve uygun anlamı seç."
            },
            "instruction": {
                "de": "Tippe auf Abspielen. Wähle danach die richtige Bedeutung.",
                "tr": "Oynat düğmesine bas. Sonra doğru anlamı seç."
            },
            "hint": {
                "de": "Achte auf Klang und Situation. Die Lösung wird nicht angezeigt.",
                "tr": "Sese ve duruma dikkat et. Çözüm gösterilmez."
            },
            "audioText": {
                "de": "machen",
                "tr": "yapmak"
            },
            "audioLabel": {
                "de": "machen",
                "tr": "yapmak"
            },
            "choices": [
                {
                    "id": "a",
                    "text": "yapmak"
                },
                {
                    "id": "b",
                    "text": "Schlüssel"
                },
                {
                    "id": "c",
                    "text": "Hund"
                },
                {
                    "id": "d",
                    "text": "Tisch"
                }
            ],
            "answer": "a",
            "explain": {
                "de": "Du hast „machen“ gehört. Das passt zu „yapmak“.",
                "tr": "„machen\" duydun. Bu „yapmak\" anlamına gelir."
            }
        }
    ]
};
  var COURSE_TREE={
    "a1": {
        "title": "Grundlagen",
        "subtitle": "Deutsch A1 · vollständiger Startkurs",
        "status": "available",
        "lessons": [
            {
                "id": "a1-greetings",
                "title": "Begrüßungen",
                "titleI18n": {
                    "de": "Begrüßungen",
                    "tr": "Selamlaşmalar"
                },
                "goal": "Hallo, Guten Morgen und einfache Antworten verstehen.",
                "goalI18n": {
                    "de": "Hallo, Guten Morgen und einfache Antworten verstehen.",
                    "tr": "Selamlaşmaları ve basit cevapları anlamak."
                },
                "vocab": [
                    "Hallo = Merhaba",
                    "Guten Morgen = Günaydın",
                    "Guten Tag = İyi günler",
                    "Guten Abend = İyi akşamlar",
                    "Tschüss = Hoşçakal",
                    "Bis später = Görüşürüz",
                    "Danke = Teşekkür ederim",
                    "Bitte = Lütfen",
                    "Entschuldigung = Affedersiniz",
                    "Ja = Evet",
                    "Nein = Hayır",
                    "Gute Nacht = İyi geceler"
                ],
                "tasks": 39,
                "progress": 12,
                "status": "available"
            },
            {
                "id": "a1-introduce",
                "title": "Sich vorstellen",
                "titleI18n": {
                    "de": "Sich vorstellen",
                    "tr": "Kendini tanıtmak"
                },
                "goal": "Name, Herkunft und Wohnort nennen.",
                "goalI18n": {
                    "de": "Name, Herkunft und Wohnort nennen.",
                    "tr": "İsim, nereden geldiğini ve nerede yaşadığını söylemek."
                },
                "vocab": [
                    "Ich heiße = Benim adım",
                    "Mein Name ist = Benim adım",
                    "Ich komme aus = ...den geliyorum",
                    "Ich wohne in = ...de yaşıyorum",
                    "Ich bin = Ben",
                    "du bist = sen",
                    "er ist = o erkek",
                    "sie ist = o kadın",
                    "Deutschland = Almanya",
                    "Türkei = Türkiye",
                    "Ulm = Ulm",
                    "Name = isim"
                ],
                "tasks": 39,
                "progress": 0,
                "status": "available"
            },
            {
                "id": "a1-numbers",
                "title": "Zahlen",
                "titleI18n": {
                    "de": "Zahlen",
                    "tr": "Sayılar"
                },
                "goal": "Zahlen von 1 bis 100 erkennen und nutzen.",
                "goalI18n": {
                    "de": "Zahlen von 1 bis 100 erkennen und nutzen.",
                    "tr": "1den 100e kadar sayıları tanımak ve kullanmak."
                },
                "vocab": [
                    "eins = bir",
                    "zwei = iki",
                    "drei = üç",
                    "vier = dört",
                    "fünf = beş",
                    "sechs = altı",
                    "sieben = yedi",
                    "acht = sekiz",
                    "neun = dokuz",
                    "zehn = on",
                    "zwanzig = yirmi",
                    "hundert = yüz"
                ],
                "tasks": 39,
                "progress": 0,
                "status": "available"
            },
            {
                "id": "a1-time",
                "title": "Uhrzeit",
                "titleI18n": {
                    "de": "Uhrzeit",
                    "tr": "Saat"
                },
                "goal": "Einfache Uhrzeiten verstehen und sagen.",
                "goalI18n": {
                    "de": "Einfache Uhrzeiten verstehen und sagen.",
                    "tr": "Basit saatleri anlamak ve söylemek."
                },
                "vocab": [
                    "Wie spät ist es? = Saat kaç?",
                    "Uhr = saat",
                    "halb = buçuk",
                    "Viertel = çeyrek",
                    "morgen = sabah",
                    "heute = bugün",
                    "jetzt = şimdi",
                    "später = sonra",
                    "Termin = randevu",
                    "um acht = saat sekizde",
                    "um zwölf = saat on ikide",
                    "pünktlich = zamanında"
                ],
                "tasks": 39,
                "progress": 0,
                "status": "available"
            },
            {
                "id": "a1-family",
                "title": "Familie",
                "titleI18n": {
                    "de": "Familie",
                    "tr": "Aile"
                },
                "goal": "Familienmitglieder benennen.",
                "goalI18n": {
                    "de": "Familienmitglieder benennen.",
                    "tr": "Aile üyelerini adlandırmak."
                },
                "vocab": [
                    "Mutter = anne",
                    "Vater = baba",
                    "Bruder = erkek kardeş",
                    "Schwester = kız kardeş",
                    "Kind = çocuk",
                    "Tochter = kız çocuk",
                    "Sohn = erkek çocuk",
                    "Familie = aile",
                    "Oma = büyükanne",
                    "Opa = büyükbaba",
                    "Eltern = ebeveynler",
                    "verheiratet = evli"
                ],
                "tasks": 39,
                "progress": 0,
                "status": "available"
            },
            {
                "id": "a1-shopping",
                "title": "Einkaufen",
                "titleI18n": {
                    "de": "Einkaufen",
                    "tr": "Alışveriş"
                },
                "goal": "Beim Einkaufen einfache Wörter verstehen.",
                "goalI18n": {
                    "de": "Beim Einkaufen einfache Wörter verstehen.",
                    "tr": "Alışverişte basit kelimeleri anlamak."
                },
                "vocab": [
                    "Brot = ekmek",
                    "Milch = süt",
                    "Wasser = su",
                    "Kasse = kasa",
                    "Preis = fiyat",
                    "teuer = pahalı",
                    "billig = ucuz",
                    "bezahlen = ödemek",
                    "bitte = lütfen",
                    "Tüte = poşet",
                    "Supermarkt = süpermarket",
                    "Karte = kart"
                ],
                "tasks": 39,
                "progress": 0,
                "status": "available"
            },
            {
                "id": "a1-doctor",
                "title": "Arzt & Termin",
                "titleI18n": {
                    "de": "Arzt & Termin",
                    "tr": "Doktor ve randevu"
                },
                "goal": "Beschwerden und Termine einfach ausdrücken.",
                "goalI18n": {
                    "de": "Beschwerden und Termine einfach ausdrücken.",
                    "tr": "Şikayetleri ve randevuları basitçe ifade etmek."
                },
                "vocab": [
                    "Arzt = doktor",
                    "Termin = randevu",
                    "Schmerzen = ağrı",
                    "krank = hasta",
                    "Medikament = ilaç",
                    "Kopf = baş",
                    "Bauch = karın",
                    "Fieber = ateş",
                    "Hilfe = yardım",
                    "Praxis = muayenehane",
                    "heute = bugün",
                    "morgen = yarın"
                ],
                "tasks": 39,
                "progress": 0,
                "status": "available"
            },
            {
                "id": "a1-work",
                "title": "Beruf & Arbeit",
                "titleI18n": {
                    "de": "Beruf & Arbeit",
                    "tr": "Meslek ve iş"
                },
                "goal": "Arbeit, Beruf und einfache Rollen verstehen.",
                "goalI18n": {
                    "de": "Arbeit, Beruf und einfache Rollen verstehen.",
                    "tr": "İş, meslek ve basit rolleri anlamak."
                },
                "vocab": [
                    "Arbeit = iş",
                    "Beruf = meslek",
                    "Firma = şirket",
                    "Kollege = iş arkadaşı",
                    "Chef = patron",
                    "Büro = ofis",
                    "Computer = bilgisayar",
                    "Pause = mola",
                    "Termin = randevu",
                    "Schicht = vardiya",
                    "lernen = öğrenmek",
                    "arbeiten = çalışmak"
                ],
                "tasks": 39,
                "progress": 0,
                "status": "available"
            },
            {
                "id": "a1-traffic",
                "title": "Verkehr",
                "titleI18n": {
                    "de": "Verkehr",
                    "tr": "Ulaşım"
                },
                "goal": "Verkehrsmittel und Wege im Alltag verstehen.",
                "goalI18n": {
                    "de": "Verkehrsmittel und Wege im Alltag verstehen.",
                    "tr": "Ulaşım araçlarını ve günlük yolları anlamak."
                },
                "vocab": [
                    "Bus = otobüs",
                    "Bahn = tren",
                    "Bahnhof = tren istasyonu",
                    "Haltestelle = durak",
                    "Straße = cadde",
                    "links = sol",
                    "rechts = sağ",
                    "geradeaus = düz",
                    "Ticket = bilet",
                    "fahren = gitmek/sürmek",
                    "steigen = binmek",
                    "aussteigen = inmek"
                ],
                "tasks": 39,
                "progress": 0,
                "status": "available"
            },
            {
                "id": "a1-everyday",
                "title": "Alltag",
                "titleI18n": {
                    "de": "Alltag",
                    "tr": "Günlük yaşam"
                },
                "goal": "Einfache Alltagssätze verstehen.",
                "goalI18n": {
                    "de": "Einfache Alltagssätze verstehen.",
                    "tr": "Basit günlük cümleleri anlamak."
                },
                "vocab": [
                    "heute = bugün",
                    "morgen = yarın",
                    "gestern = dün",
                    "essen = yemek yemek",
                    "trinken = içmek",
                    "gehen = gitmek",
                    "kommen = gelmek",
                    "machen = yapmak",
                    "zu Hause = evde",
                    "Schule = okul",
                    "lernen = öğrenmek",
                    "müde = yorgun"
                ],
                "tasks": 39,
                "progress": 0,
                "status": "available"
            }
        ]
    },
    "a2": {
        "title": "Alltag",
        "subtitle": "Deutsch A2 · Alltagssituationen",
        "status": "planned",
        "lessons": [
            {
                "id": "a2-appointments",
                "title": "Termine vereinbaren",
                "goal": "Terminwünsche, Absagen und Rückfragen.",
                "tasks": 12,
                "progress": 0,
                "status": "planned"
            },
            {
                "id": "a2-directions",
                "title": "Wege beschreiben",
                "goal": "Orte, Wege und Verkehrsmittel.",
                "tasks": 12,
                "progress": 0,
                "status": "planned"
            },
            {
                "id": "a2-health",
                "title": "Arztbesuch",
                "goal": "Beschwerden beschreiben und verstehen.",
                "tasks": 12,
                "progress": 0,
                "status": "planned"
            }
        ]
    },
    "b1": {
        "title": "Kommunikation",
        "subtitle": "Deutsch B1 · Gespräche führen",
        "status": "planned",
        "lessons": [
            {
                "id": "b1-opinion",
                "title": "Meinung sagen",
                "goal": "Zustimmen, widersprechen und begründen.",
                "tasks": 12,
                "progress": 0,
                "status": "planned"
            },
            {
                "id": "b1-workday",
                "title": "Arbeitsalltag",
                "goal": "Abläufe und Probleme beschreiben.",
                "tasks": 12,
                "progress": 0,
                "status": "planned"
            }
        ]
    },
    "b2": {
        "title": "Beruf & Alltag",
        "subtitle": "Deutsch B2 · berufliche Sprache",
        "status": "planned",
        "lessons": [
            {
                "id": "b2-application",
                "title": "Bewerbung",
                "goal": "Anschreiben, Gespräch und Berufswörter.",
                "tasks": 14,
                "progress": 0,
                "status": "planned"
            },
            {
                "id": "b2-discussion",
                "title": "Diskussion",
                "goal": "Argumente strukturiert ausdrücken.",
                "tasks": 14,
                "progress": 0,
                "status": "planned"
            }
        ]
    },
    "c1": {
        "title": "Fortgeschritten",
        "subtitle": "Deutsch C1 · präzise Sprache",
        "status": "planned",
        "lessons": [
            {
                "id": "c1-argumentation",
                "title": "Argumentieren",
                "goal": "Komplexe Aussagen klar strukturieren.",
                "tasks": 14,
                "progress": 0,
                "status": "planned"
            }
        ]
    },
    "c2": {
        "title": "Sehr fortgeschritten",
        "subtitle": "Deutsch C2 · sehr hohe Sicherheit",
        "status": "planned",
        "lessons": [
            {
                "id": "c2-nuance",
                "title": "Nuancen",
                "goal": "Feine Bedeutungsunterschiede erkennen.",
                "tasks": 14,
                "progress": 0,
                "status": "planned"
            }
        ]
    }
};


  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function t(key,kind){
    try{var e=window.LanguageAcademyTranslationEngine; if(e&&typeof e.t==='function'){ var out=e.t(key,{kind:kind||'learn'}); if(out && out!==key) return out; }}catch(e){}
    var fb={
      'common.learningLanguage':'Lernsprache','common.helpLanguage':'Hilfssprache','language.de':'Deutsch','language.tr':'Türkisch','common.help':'Hilfe',
      'course.dashboard.title':'Sprachkurs','course.dashboard.subtitle':'Lerne Schritt für Schritt auf deinem Niveau.'
    }; return fb[key]||key;
  }
  function settings(){try{var s=window.LanguageAcademyLanguageStore; if(s&&typeof s.get==='function') return s.get();}catch(e){} return {learningLanguage:'de',helpLanguage:'tr'};}

  function courseCloudSync(){return window.LanguageCourseCloudSync||null;}
  function syncAfterSave(progress){
    try{var s=courseCloudSync(); if(s&&typeof s.queuePush==='function') s.queuePush(progress,{reason:'progress-save',source:'LanguageAcademyCourseEntry'});}catch(e){}
  }
  function syncStatusLabel(){
    try{var s=courseCloudSync(); if(s&&typeof s.status==='function') return s.status();}catch(e){}
    return {ok:false,enabled:false,provider:'nicht geladen',mode:'local-only',pending:0,lastSyncAt:null,lastError:'Cloud-Sync-Adapter nicht geladen'};
  }
  function cloudSyncStatusHtml(){
    var st=syncStatusLabel();
    var tone=st.ok?'ok':(st.enabled?'warn':'danger');
    var last=st.lastSyncAt?String(st.lastSyncAt).replace('T',' ').slice(0,16):'noch nicht synchronisiert';
    var detail=st.lastError?st.lastError:(st.ok?'Cloudfähig · lokaler Fortschritt geschützt':'Lokalmodus aktiv');
    return '<section class="la-card la-cloud-sync-card is-'+esc(tone)+'" data-la-cloud-sync="phase28"><div class="la-cloud-sync-head"><span class="la-section-kicker">Cloud Sync</span><em>'+esc(st.mode||'local-only')+'</em></div><h3>'+esc(st.ok?'Sprachkurs-Sync bereit':'Sprachkurs lokal gesichert')+'</h3><p>'+esc(detail)+'</p><div class="la-cloud-sync-grid"><div><b>'+esc(st.provider||'-')+'</b><small>Provider</small></div><div><b>'+esc(st.pending||0)+'</b><small>Warteschlange</small></div><div><b>'+esc(last)+'</b><small>Letzter Sync</small></div></div><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-sync-push">Sync jetzt</button><button type="button" class="la-secondary" data-ui-action="language-course-sync-pull">Cloud laden</button></div><p class="la-note">Synchronisiert Kurs, Lektionen, Fehler, Vokabelstatus, Wiederholungssets und Coach-Kontext. Highscore, Admin und CTC bleiben getrennt.</p></section>';
  }
  function syncPushNow(){
    var s=courseCloudSync();
    if(!s||typeof s.push!=='function'){openDashboard(); return false;}
    try{Promise.resolve(s.push(getCourseProgress(),{reason:'manual-push'})).finally(function(){openDashboard();});}catch(e){openDashboard();}
    return true;
  }
  function syncPullNow(){
    var s=courseCloudSync();
    if(!s||typeof s.pull!=='function'){openDashboard(); return false;}
    try{Promise.resolve(s.pull({reason:'manual-pull'})).then(function(res){ if(res&&res.progress) saveCourseProgress(res.progress); }).finally(function(){openDashboard();});}catch(e){openDashboard();}
    return true;
  }
  function setLang(kind, lang){try{var s=window.LanguageAcademyLanguageStore; if(!s) return; if(kind==='learn'&&s.setLearningLanguage) s.setLearningLanguage(lang); if(kind==='help'&&s.setHelpLanguage) s.setHelpLanguage(lang);}catch(e){} openDashboard();}
  function profileIdentity(){
    try{
      if(window.EGTProfileAuthDomainEngine && typeof window.EGTProfileAuthDomainEngine.create==='function'){
        var d=window.EGTProfileAuthDomainEngine.create();
        if(d && typeof d.identity==='function') return d.identity() || {};
      }
    }catch(e){}
    try{ if(window.EGTAuthProfileShell && typeof window.EGTAuthProfileShell.highscoreIdentity==='function') return window.EGTAuthProfileShell.highscoreIdentity() || {}; }catch(e){}
    try{ if(window.EGTAuthProfileShell && typeof window.EGTAuthProfileShell.currentSession==='function') return window.EGTAuthProfileShell.currentSession() || {}; }catch(e){}
    return {nickname:'Gast',playerName:'Gast',role:'guest'};
  }
  function initials(name){name=String(name||'G').trim(); return (name[0]||'G').toUpperCase();}
  function roleLabel(role){var map={participant:'Teilnehmer',teacher:'Dozent',dozent:'Dozent',admin:'Admin',demo:'Demo',guest:'Gast'}; return map[String(role||'guest').toLowerCase()]||'Gast';}
  function emptyProgress(){return {schema:'language-course-progress-v3',currentCourse:null,lessonState:{},lessonProgress:{},levelProgress:{},vocabularyState:{},vocabReviewQueue:[],stats:{tasksSolved:0,correctAnswers:0,attempts:0,wrongOpen:0,vocabKnown:0,vocabRepeat:0,learningMinutes:0,streakDays:0,lastActivity:null},updatedAt:null};}
  function getCourseProgress(){
    try{
      var raw=localStorage.getItem(PROGRESS_KEY)||localStorage.getItem(LEGACY_PROGRESS_KEY);
      var p=raw?JSON.parse(raw):{};
      return Object.assign(emptyProgress(), (p&&typeof p==='object'?p:{}));
    }catch(e){return emptyProgress();}
  }
  function calcProgressSnapshot(p){
    p=Object.assign(emptyProgress(),p||{});
    var lessonState=p.lessonState||{}, solved=0, correct=0, attempts=0, wrong=0;
    Object.keys(lessonState).forEach(function(k){var st=lessonState[k]||{}; solved+=Number(st.total||0); correct+=Number(st.score||0); attempts+=Number(st.attempts||0); wrong+=(Array.isArray(st.wrongTaskIds)?st.wrongTaskIds.length:0);});
    p.stats=Object.assign({},p.stats||{}, {tasksSolved:solved,correctAnswers:correct,attempts:attempts,wrongOpen:wrong,lastActivity:(p.stats&&p.stats.lastActivity)||p.updatedAt});
    return p;
  }
  function saveCourseProgress(next){
    try{
      var base=getCourseProgress();
      var merged=Object.assign({},base,next||{}, {schema:'language-course-progress-v3',updatedAt:new Date().toISOString()});
      if(next&&next.stats){merged.stats=Object.assign({},base.stats||{},next.stats||{});}
      merged=calcProgressSnapshot(merged);
      localStorage.setItem(PROGRESS_KEY,JSON.stringify(merged));
      try{localStorage.setItem(LEGACY_PROGRESS_KEY,JSON.stringify(merged));}catch(_e){}
      syncAfterSave(merged);
      return merged;
    }catch(e){return getCourseProgress();}
  }
  function lessonProgressValue(lessonId,fallback){var p=getCourseProgress(); var lp=p.lessonProgress&&p.lessonProgress[lessonId]; return typeof lp==='number'?lp:(fallback||0);}
  function updateLessonProgress(levelId,lessonId,percent,status){
    var p=getCourseProgress(); var lp=Object.assign({},p.lessonProgress||{}), lvl=Object.assign({},p.levelProgress||{});
    lp[lessonId]=Math.max(0,Math.min(100,Math.round(percent||0)));
    lvl[normalizeLevel(levelId)]=Math.max(lvl[normalizeLevel(levelId)]||0, lp[lessonId]);
    saveCourseProgress({lessonProgress:lp,levelProgress:lvl,stats:{lastActivity:new Date().toISOString()},lastCompleted:(status==='completed'?{level:normalizeLevel(levelId),lessonId:lessonId,completedAt:new Date().toISOString()}:p.lastCompleted)});
  }
  function currentCourse(){
    var p=getCourseProgress();
    var cc=Object.assign({course:'Deutsch',level:'A1',lesson:'Begrüßungen',lessonId:'a1-greetings',progress:lessonProgressValue('a1-greetings',12),started:false,lastAction:'Noch keine Lektion gestartet'}, p.currentCourse||{});
    if(cc.lessonId) cc.progress=lessonProgressValue(cc.lessonId,cc.progress||0);
    return cc;
  }
  function hintPreview(){try{var h=window.LanguageAcademyHelpSystem; if(h&&typeof h.getHint==='function') return h.getHint({hint:{de:'Die Hilfe erklärt die Aufgabe, zeigt aber keine Lösung.',tr:'Yardım görevi açıklar, çözümü göstermez.'},answer:'Morgen'});}catch(e){} return 'Yardım görevi açıklar, çözümü göstermez.';}
  function adaptiveEngine(){return window.LanguageAcademyAdaptiveEngine||null;}
  function lessonAnalysis(lessonId){
    var tasks=lessonTasks(lessonId), state=getLessonState(lessonId), eng=adaptiveEngine();
    if(eng&&typeof eng.analyzeLesson==='function') return eng.analyzeLesson(lessonId,state,tasks.length);
    return {accuracy:0,completion:0,wrongOpen:0,difficultyLabel:'Standard',difficultyDescription:'Normale Aufgabenfolge.',readiness:'continue',needsReview:false};
  }
  function adaptiveCardHtml(lessonId){
    var a=lessonAnalysis(lessonId||'a1-greetings'), eng=adaptiveEngine();
    var rec=(eng&&eng.recommendation)?eng.recommendation(a):{title:'Weiterlernen',text:'Bearbeite die aktuelle Lektion weiter.'};
    var diff=(eng&&eng.nextDifficulty)?eng.nextDifficulty(a):{label:'Normal',rule:'regulärer Aufgabenfluss'};
    return '<section class="la-card la-adaptive-card" data-la-adaptive="phase25"><span class="la-section-kicker">Adaptive Lernempfehlung</span><h3>'+esc(rec.title)+'</h3><p>'+esc(rec.text)+'</p><div class="la-adaptive-grid"><div><b>'+esc(a.accuracy||0)+'%</b><small>Trefferquote</small></div><div><b>'+esc(a.wrongOpen||0)+'</b><small>offene Fehler</small></div><div><b>'+esc(diff.label)+'</b><small>'+esc(diff.rule)+'</small></div></div><p class="la-note">Schwierigkeit und Wiederholung werden aus deinem Aufgabenverlauf berechnet. Die Hilfe zeigt weiterhin keine Lösung.</p></section>';
  }
  function statCards(){
    var p=calcProgressSnapshot(getCourseProgress()), st=p.stats||{};
    var acc=st.attempts?Math.round((Number(st.correctAnswers||0)/Number(st.attempts||1))*100):0;
    var mins=Number(st.learningMinutes||0), time=(Math.floor(mins/60))+'h '+String(mins%60).padStart(2,'0')+'m';
    return '<div class="la-stat-grid" aria-label="Sprachkurs-Statistiken">'+
      '<div class="la-stat-card"><b>'+esc(st.tasksSolved||0)+'</b><small>Gelöste Aufgaben</small></div>'+
      '<div class="la-stat-card"><b>'+esc(acc)+'%</b><small>Richtige Antworten</small></div>'+
      '<div class="la-stat-card"><b>'+esc(time)+'</b><small>Lernzeit</small></div>'+
      '<div class="la-stat-card"><b>'+esc(st.wrongOpen||0)+'</b><small>Zu wiederholen</small></div>'+
    '</div>';
  }
  function langSelect(kind, value, label){
    return '<label class="la-language-select"><span>'+esc(label)+'</span><select data-la-lang-select="'+esc(kind)+'" aria-label="'+esc(label)+'"><option value="de"'+(value==='de'?' selected':'')+'>Deutsch</option><option value="tr"'+(value==='tr'?' selected':'')+'>Türkisch</option></select></label>';
  }
  function levelHtml(){
    return LEVELS.map(function(l){
      var locked=l.status==='locked';
      return '<button type="button" class="la-level-card '+(locked?'is-locked':'is-available')+'" data-ui-action="language-course-open-level" data-la-level="'+esc(l.id)+'" '+(locked?'aria-disabled="true"':'')+'>'+ 
        '<span class="la-level-top"><b>'+esc(l.label)+'</b><em>'+esc(locked?'später':'offen')+'</em></span>'+ 
        '<strong>'+esc(l.title)+'</strong><small>'+esc(l.desc)+'</small>'+ 
        '<span class="la-mini-progress"><i style="width:'+esc(l.progress)+'%"></i></span>'+ 
      '</button>';
    }).join('');
  }

  function lessonTitleById(lessonId){
    var lesson=findLesson('a1',lessonId)||{};
    return lesson.title||lessonId||'A1';
  }

  var COACH_TEXTS={
    de:{
      teacher:'KI-Lehrer', teacherRecommendations:'KI-Lehrer Empfehlungen', pill:'v5 · DE/TR', recommendations:'Empfehlungskarten', recommendationsTitle:'Was du jetzt tun solltest', reviewSets:'Wiederholungssets', reviewSetsTitle:'Gezielte Übungspakete', nextPlan:'Nächster Lernplan', nextPlanTitle:'Empfohlene Reihenfolge', taskTypes:'Aufgabentypen', taskTypesTitle:'Schwachstellen nach Typ', lessons:'Lektionen', lessonsTitle:'Schwachstellen nach Lektion', startRecommendation:'Empfehlung starten', allRecommendations:'Alle Empfehlungen', topRecommendation:'Top-Empfehlung starten', dashboard:'Dashboard', start:'Starten', priority:'Priorität', reviewSet:'Wiederholungsset', reason:'Begründung', accuracy:'Trefferquote', openErrors:'offene Fehler', vocab:'Vokabeln', vocabToRepeat:'Vokabeln zu wiederholen', noData:'Noch keine belastbaren {kind}-Daten vorhanden. Der Coach wird genauer, sobald mehr Aufgaben gelöst sind.', activity:'Aktivität', lastLearningState:'letzter Lernstand', justNow:'gerade eben', noActivity:'noch keine Aktivität', minutesAgo:'{n} Min. her', hoursAgo:'{n} Std. her', daysAgo:'{n} Tage her', todayUseful:'Heute sinnvoll', baseText:'Starte mit deiner aktuellen A1-Lektion und halte den Lernfluss kurz und stabil.', continue:'Weiterlernen', baseReason:'Basisempfehlung, solange noch wenig Lernverlauf vorhanden ist.', currentLesson:'Aktuelle Lektion', clearErrors:'Fehler zuerst klären', clearErrorsText:'Der stärkste Schwachpunkt ist aktuell {type} mit {count} offenen Fehler(n). Trainiere zuerst diese Fehler, bevor du neue Aufgaben startest.', startErrorTraining:'Fehlertraining starten', errorReason:'Offene Fehler liefern die klarste Coach-Empfehlung.', vocabRepeat:'Vokabeln wiederholen', vocabRepeatText:'Du hast {count} Wort/Wörter im Wiederholungsstapel. Das ist heute die beste kurze Einheit, bevor du neue Inhalte öffnest.', vocabRepeatReason:'Wiederholungswörter sollten regelmäßig erneut auftauchen.', repeat:'Wiederholen', lowAccuracyText:'Deine Trefferquote liegt bei {accuracy} %. Arbeite mit kurzen Wiederholungsrunden statt direkt weiterzuspringen.', lowAccuracyReason:'Niedrige Trefferquote deutet auf Wiederholungsbedarf hin.', continueReason:'Hohe Trefferquote spricht für kontrollierten Ausbau.', planErrors:'Fehlertraining öffnen', planVocab:'Vokabelrunde bearbeiten', planCurrent:'Aktuelle Lektion fortsetzen', lessonFocus:'Auffällige Lektion festigen', lessonFocusText:'{lesson} hat aktuell die meisten offenen Punkte. Wiederhole sie gezielt.', taskTypeFocus:'Schwachen Aufgabentyp üben', taskTypeFocusText:'Trainiere gezielt {type}, weil dort die meisten Fehler liegen.', dueVocab:'Fällige Vokabeln', dueVocabText:'Wiederhole Wörter, die neu oder als Wiederholen markiert sind.', currentLessonContinue:'Lektion weiterlernen', currentLessonText:'{lesson} fortsetzen.', coachNote:'Der Coach nutzt vorhandene Sprachkursdaten und sortiert Empfehlungen nach Nutzen: Fehler, Vokabeln, Aufgabentypen, Lektionen und Weiterlernen.', reviewErrors:'5 Fehler wiederholen', reviewErrorsText:'Starte mit den wichtigsten offenen Fehlern.', reviewType:'Aufgabentyp festigen', reviewTypeText:'Trainiere gezielt {type}.', reviewLesson:'Fehler-Lektion festigen', reviewLessonText:'{lesson} erneut trainieren.', reviewLessonReason:'Wiederholung direkt in der betroffenen Lektion erhöht den Lerneffekt.', reviewVocabReason:'Kurze Vokabelrunden halten den Wortschatz aktiv.', reviewCurrentReason:'Regelmäßigkeit ist für Sprachlernen entscheidend.', errorsMainReason:'Fehler zuerst zu klären bringt den höchsten Lerneffekt.', typeMainReason:'Aufgabentypen-Training macht Schwachstellen sichtbar.', lessonMainReason:'Die auffällige Lektion bündelt aktuell die meisten offenen Punkte.', vocabMainReason:'Vokabeln bleiben nur stabil, wenn sie kurz und regelmäßig wiederholt werden.', currentMainReason:'Weiterlernen hält den Kursfluss stabil.', errorsTextShort:'Bearbeite offene Fehler, bevor du neue Aufgaben startest.', vocabTextShort:'Wiederhole fällige Wörter kurz und gezielt.', taskTypesKind:'Aufgabentyp', lessonKind:'Lektion', errorWord:'Fehler', hitRate:'Treffer'
    },
    tr:{
      teacher:'Dil Öğretmeni', teacherRecommendations:'Dil Öğretmeni Önerileri', pill:'v5 · DE/TR', recommendations:'Öneri kartları', recommendationsTitle:'Şimdi ne yapmalısın?', reviewSets:'Tekrar setleri', reviewSetsTitle:'Hedefli alıştırma paketleri', nextPlan:'Sonraki öğrenme planı', nextPlanTitle:'Önerilen sıra', taskTypes:'Soru türleri', taskTypesTitle:'Soru türüne göre zayıf noktalar', lessons:'Dersler', lessonsTitle:'Derse göre zayıf noktalar', startRecommendation:'Öneriyi başlat', allRecommendations:'Tüm öneriler', topRecommendation:'En önemli öneriyi başlat', dashboard:'Pano', start:'Başlat', priority:'Öncelik', reviewSet:'Tekrar seti', reason:'Neden', accuracy:'Doğruluk oranı', openErrors:'açık hata', vocab:'Kelime', vocabToRepeat:'tekrar edilecek kelime', noData:'Henüz güvenilir {kind} verisi yok. Daha fazla soru çözdükçe öğretmen daha net öneri verir.', activity:'Aktivite', lastLearningState:'son öğrenme durumu', justNow:'az önce', noActivity:'henüz aktivite yok', minutesAgo:'{n} dk. önce', hoursAgo:'{n} saat önce', daysAgo:'{n} gün önce', todayUseful:'Bugün mantıklı olan', baseText:'Mevcut A1 dersinden kısa ve düzenli şekilde devam et.', continue:'Devam et', baseReason:'Henüz az öğrenme verisi olduğu için temel öneri.', currentLesson:'Mevcut ders', clearErrors:'Önce hataları düzelt', clearErrorsText:'Şu an en güçlü zayıf nokta {type}; {count} açık hata var. Yeni sorulara geçmeden önce bu hataları çalış.', startErrorTraining:'Hata çalışmasını başlat', errorReason:'Açık hatalar öğretmen için en net öneriyi verir.', vocabRepeat:'Kelimeleri tekrar et', vocabRepeatText:'Tekrar bölümünde {count} kelime var. Yeni konuya geçmeden önce bugün en iyi kısa çalışma budur.', vocabRepeatReason:'Tekrar kelimeleri düzenli aralıklarla yeniden görülmelidir.', repeat:'Tekrar et', lowAccuracyText:'Doğruluk oranın %{accuracy}. Hemen ilerlemek yerine kısa tekrar turları yap.', lowAccuracyReason:'Düşük doğruluk oranı tekrar ihtiyacını gösterir.', continueReason:'Yüksek doğruluk kontrollü ilerlemeyi destekler.', planErrors:'Hata çalışmasını aç', planVocab:'Kelime turu yap', planCurrent:'Mevcut derse devam et', lessonFocus:'Zayıf dersi pekiştir', lessonFocusText:'Şu anda en çok açık nokta {lesson} dersinde. Bu dersi hedefli tekrar et.', taskTypeFocus:'Zayıf soru türünü çalış', taskTypeFocusText:'En çok hata burada olduğu için özellikle {type} çalış.', dueVocab:'Tekrar zamanı gelen kelimeler', dueVocabText:'Yeni veya tekrar işaretli kelimeleri çalış.', currentLessonContinue:'Derse devam et', currentLessonText:'{lesson} dersine devam et.', coachNote:'Öğretmen mevcut dil kursu verilerini kullanır ve önerileri faydaya göre sıralar: hatalar, kelimeler, soru türleri, dersler ve devam etme.', reviewErrors:'5 hatayı tekrar et', reviewErrorsText:'En önemli açık hatalarla başla.', reviewType:'Soru türünü pekiştir', reviewTypeText:'Özellikle {type} çalış.', reviewLesson:'Hatalı dersi pekiştir', reviewLessonText:'{lesson} dersini yeniden çalış.', reviewLessonReason:'Doğrudan sorunlu derste tekrar yapmak öğrenmeyi güçlendirir.', reviewVocabReason:'Kısa kelime turları kelime bilgisini canlı tutar.', reviewCurrentReason:'Düzenlilik dil öğrenmede belirleyicidir.', errorsMainReason:'Önce hataları düzeltmek en yüksek öğrenme etkisini sağlar.', typeMainReason:'Soru türü çalışması zayıf noktaları görünür yapar.', lessonMainReason:'Bu ders şu an en çok açık noktayı topluyor.', vocabMainReason:'Kelimeler kısa ve düzenli tekrar ile kalıcı olur.', currentMainReason:'Devam etmek kurs akışını sabit tutar.', errorsTextShort:'Yeni sorulara geçmeden önce açık hataları çalış.', vocabTextShort:'Tekrar zamanı gelen kelimeleri kısa ve hedefli çalış.', taskTypesKind:'soru türü', lessonKind:'ders', errorWord:'hata', hitRate:'doğruluk'
    }
  };
  function coachLanguage(){var s=settings(); return (s.helpLanguage||s.learningLanguage||'de')==='tr'?'tr':'de';}
  function ct(key,vars){var lang=coachLanguage(); var out=(COACH_TEXTS[lang]&&COACH_TEXTS[lang][key])||(COACH_TEXTS.de&&COACH_TEXTS.de[key])||key; vars=vars||{}; return String(out).replace(/\{(\w+)\}/g,function(_,k){return vars[k]!=null?String(vars[k]):'';});}
  function coachPriorityLabel(v){var lang=coachLanguage(); var key=String(v||'normal'); var de={hoch:'hoch',mittel:'mittel',normal:'normal',niedrig:'niedrig'}; var tr={hoch:'yüksek',mittel:'orta',normal:'normal',niedrig:'düşük'}; return (lang==='tr'?tr:de)[key]||key;}
  function coachTaskTypeBreakdown(wrong){
    var out={};
    (wrong||[]).forEach(function(w){
      var key=w.type||'unknown';
      if(!out[key]) out[key]={type:key,label:w.label||((TASK_TYPE_REGISTRY[key]&&TASK_TYPE_REGISTRY[key].label)||key),wrong:0,lessonIds:{}};
      out[key].wrong++;
      if(w.lessonId) out[key].lessonIds[w.lessonId]=true;
    });
    return Object.keys(out).map(function(k){
      var x=out[k]; x.lessonCount=Object.keys(x.lessonIds||{}).length; return x;
    }).sort(function(a,b){return (b.wrong-a.wrong)||(b.lessonCount-a.lessonCount);});
  }
  function coachLessonBreakdown(wrong){
    var p=calcProgressSnapshot(getCourseProgress()), states=p.lessonState||{}, map={};
    Object.keys(states).forEach(function(lessonId){
      var st=states[lessonId]||{};
      var attempts=Number(st.attempts||0), score=Number(st.score||0), total=Number(st.total||0);
      if(!map[lessonId]) map[lessonId]={lessonId:lessonId,title:lessonTitleById(lessonId),attempts:0,score:0,total:0,wrong:0,accuracy:0,completion:0};
      map[lessonId].attempts+=attempts; map[lessonId].score+=score; map[lessonId].total+=total;
      map[lessonId].wrong+=(Array.isArray(st.wrongTaskIds)?st.wrongTaskIds.length:0);
    });
    (wrong||[]).forEach(function(w){
      if(!map[w.lessonId]) map[w.lessonId]={lessonId:w.lessonId,title:w.lessonTitle||lessonTitleById(w.lessonId),attempts:0,score:0,total:0,wrong:0,accuracy:0,completion:0};
      map[w.lessonId].wrong++;
    });
    return Object.keys(map).map(function(k){
      var x=map[k];
      x.accuracy=x.attempts?Math.round((x.score/Math.max(1,x.attempts))*100):0;
      var tasks=lessonTasks(k).length||39;
      x.completion=Math.min(100,Math.round((x.total/Math.max(1,tasks))*100));
      return x;
    }).sort(function(a,b){return (b.wrong-a.wrong)||((a.accuracy||999)-(b.accuracy||999))||(b.completion-a.completion);});
  }
  function coachDataQuality(st, wrong, vs, lessons){
    var score=0;
    if(Number(st.attempts||0)>0) score+=25;
    if(Number(st.attempts||0)>=5) score+=15;
    if((lessons||[]).length>0) score+=20;
    if((wrong||[]).length>0) score+=15;
    if(vs && (Number(vs.known||0)+Number(vs.repeat||0))>0) score+=15;
    if(st.lastActivity) score+=10;
    return Math.max(10,Math.min(100,score));
  }
  function coachActivityLabel(iso){
    if(!iso) return ct('noActivity');
    var diff=Date.now()-Date.parse(iso);
    if(!isFinite(diff)||diff<0) return ct('justNow');
    var mins=Math.round(diff/60000);
    if(mins<60) return ct('minutesAgo',{n:mins});
    var hrs=Math.round(mins/60);
    if(hrs<48) return ct('hoursAgo',{n:hrs});
    return ct('daysAgo',{n:Math.round(hrs/24)});
  }
  function coachInsight(){
    var p=calcProgressSnapshot(getCourseProgress()), st=p.stats||{}, cc=currentCourse();
    var wrong=collectWrongTasks(), vs=vocabStats(), lessonId=cc.lessonId||'a1-greetings';
    var a=lessonAnalysis(lessonId);
    var attempts=Number(st.attempts||0), correct=Number(st.correctAnswers||0);
    var accuracy=attempts?Math.round((correct/Math.max(1,attempts))*100):0;
    var typeRows=coachTaskTypeBreakdown(wrong);
    var lessonRows=coachLessonBreakdown(wrong);
    var topType=typeRows[0]||null;
    var topLesson=lessonRows[0]||{lessonId:lessonId,title:cc.lesson||'Begrüßungen',wrong:0,accuracy:accuracy,completion:Number(a.completion||0)};
    var dataQuality=coachDataQuality(st,wrong,vs,lessonRows);
    var title=ct('todayUseful');
    var text=ct('baseText');
    var action='language-course-continue';
    var actionLabel=ct('continue');
    var reason=ct('baseReason');
    var priority='normal';
    var focus=ct('currentLesson');
    if(wrong.length>0 && topType){
      title=ct('clearErrors');
      text=ct('clearErrorsText',{type:topType.label,count:topType.wrong});
      action='language-course-open-error-training'; actionLabel=ct('startErrorTraining'); reason=ct('errorReason'); priority='hoch'; focus=topType.label;
    } else if(vs.repeat>0){
      title=ct('vocabRepeat');
      text=ct('vocabRepeatText',{count:vs.repeat});
      action='language-course-open-vocabulary'; actionLabel=ct('vocabRepeat'); reason=ct('vocabRepeatReason'); priority='mittel'; focus=ct('vocabRepeat');
    } else if(attempts>=5 && accuracy<70){
      title=ct('repeat');
      text=ct('lowAccuracyText',{accuracy:accuracy});
      action='language-course-repeat-errors'; actionLabel=ct('repeat'); reason=ct('lowAccuracyReason'); priority='mittel'; focus=ct('accuracy');
    } else if(cc.started || Number(cc.progress||0)>0){
      title=ct('currentLessonContinue');
      text=ct('currentLessonText',{lesson:cc.lesson||'A1'});
      action='language-course-continue'; actionLabel=ct('continue'); reason=ct('currentMainReason'); priority='normal'; focus=cc.lesson||'A1';
    } else if(attempts>=10 && accuracy>=85){
      title=ct('continue');
      text=ct('baseText');
      action='language-course-continue'; actionLabel=ct('continue'); reason=ct('continueReason'); priority='niedrig'; focus=ct('continue');
    }
    var plan=[];
    if(wrong.length>0) plan.push('1. '+ct('planErrors'));
    if(vs.repeat>0) plan.push((plan.length+1)+'. '+ct('planVocab'));
    plan.push((plan.length+1)+'. '+(cc.lesson||'A1')+' · '+ct('planCurrent'));
    if(topType) plan.push((plan.length+1)+'. Fokus: '+topType.label);
    var evidence=[
      {label:'Datenbasis',value:dataQuality+'%',note:dataQuality<60?'noch vorsichtig':'ausreichend nutzbar'},
      {label:ct('activity'),value:coachActivityLabel(st.lastActivity||p.updatedAt),note:ct('lastLearningState')},
      {label:'Fokus',value:focus,note:coachPriorityLabel(priority)}
    ];
    return {title:title,text:text,action:action,actionLabel:actionLabel,reason:reason,accuracy:accuracy,wrong:wrong.length,vocabRepeat:vs.repeat,lesson:cc.lesson||'Begrüßungen',level:cc.level||'A1',priority:priority,focus:focus,dataQuality:dataQuality,topType:topType,topLesson:topLesson,typeRows:typeRows,lessonRows:lessonRows,evidence:evidence,plan:plan,attempts:attempts,lastActivity:st.lastActivity||p.updatedAt||''};
  }

  function coachEvidenceHtml(c){
    return '<div class="la-coach-evidence">'+(c.evidence||[]).map(function(e){return '<div><b>'+esc(e.value)+'</b><small>'+esc(e.label)+' · '+esc(e.note)+'</small></div>';}).join('')+'</div>';
  }
  function coachRowsHtml(rows,kind){
    rows=(rows||[]).slice(0,4);
    if(!rows.length) return '<p class="la-note">'+esc(ct('noData',{kind:kind||'Analyse'}))+'</p>';
    return '<div class="la-coach-row-list">'+rows.map(function(r){
      var label=r.label||r.title||r.lessonId||r.type||'Analyse';
      var main=typeof r.wrong==='number'?r.wrong+' '+ct('errorWord'):((r.accuracy||0)+'% '+ct('hitRate'));
      var width=Math.max(8,Math.min(100, r.wrong?Math.min(100,r.wrong*18):(r.accuracy||0)));
      var sub=r.lessonCount? r.lessonCount+' '+ct('lessons') : ((r.completion||0)+'% erledigt');
      return '<div class="la-coach-row"><span><b>'+esc(label)+'</b><small>'+esc(sub)+'</small></span><i><em style="width:'+esc(width)+'%"></em></i><strong>'+esc(main)+'</strong></div>';
    }).join('')+'</div>';
  }
  function coachPlanHtml(c){
    return '<ol class="la-coach-plan">'+(c.plan||[]).slice(0,4).map(function(x){return '<li>'+esc(String(x).replace(/^\d+\.\s*/,''))+'</li>';}).join('')+'</ol>';
  }
  function coachRecommendationCards(c){
    c=c||coachInsight();
    var cards=[];
    function push(id,title,text,action,priority,reason,icon){
      cards.push({id:id,title:title,text:text,action:action,priority:priority||'normal',reason:reason||'',icon:icon||'→'});
    }
    if(Number(c.wrong||0)>0){
      push('errors',ct('clearErrors'),ct('errorsTextShort'),'language-course-open-error-training','hoch',ct('errorsMainReason'),'!');
    }
    if(Number(c.vocabRepeat||0)>0){
      push('vocab',ct('vocabRepeat'),ct('vocabTextShort'),'language-course-start-vocab-review','mittel',ct('vocabMainReason'),'Aa');
    }
    if(c.topType && c.topType.type){
      var label=c.topType.label||c.topType.type;
      push('type-focus',ct('taskTypeFocus'),ct('taskTypeFocusText',{type:label}),'language-course-train-tasktype:'+c.topType.type,'mittel',ct('typeMainReason'),'◎');
    }
    if(c.topLesson && c.topLesson.lessonId){
      push('lesson-focus',ct('lessonFocus'),ct('lessonFocusText',{lesson:(c.topLesson.title||'A1')}),'language-course-open-lesson:'+c.topLesson.lessonId,'normal',ct('lessonMainReason'),'↳');
    }
    push('continue',ct('continue'),ct('currentLessonText',{lesson:c.lesson||'A1'}),'language-course-continue','normal',ct('currentMainReason'),'▶');
    var seen={};
    cards=cards.filter(function(x){ if(seen[x.action]) return false; seen[x.action]=true; return true; }).slice(0,4);
    return cards;
  }
  function coachReviewSets(c){
    c=c||coachInsight();
    var wrong=collectWrongTasks();
    var due=dueVocabularyItems();
    var sets=[];
    function add(id,title,text,action,count,priority,reason,icon){
      sets.push({id:id,title:title,text:text,action:action,count:count||0,priority:priority||'normal',reason:reason||'',icon:icon||'↻'});
    }
    if(wrong.length){
      var first=wrong[0];
      add('error-5',ct('reviewErrors'),ct('reviewErrorsText'),'language-course-repeat-errors',Math.min(5,wrong.length),'hoch',ct('errorsMainReason'),'!');
      if(c.topType&&c.topType.type){
        add('type-'+c.topType.type,ct('reviewType'),ct('reviewTypeText',{type:(c.topType.label||c.topType.type)}),'language-course-train-tasktype:'+c.topType.type,Number(c.topType.wrong||0),'hoch',ct('typeMainReason'),'◎');
      }
      if(first&&first.lessonId){
        add('lesson-'+first.lessonId,ct('reviewLesson'),ct('reviewLessonText',{lesson:(first.lessonTitle||'A1')}),'language-course-open-lesson:'+first.lessonId,wrong.filter(function(w){return w.lessonId===first.lessonId;}).length,'mittel',ct('reviewLessonReason'),'↳');
      }
    }
    if(due.length){
      add('vocab-due',ct('dueVocab'),ct('dueVocabText'),'language-course-start-vocab-review',Math.min(10,due.length),'mittel',ct('reviewVocabReason'),'Aa');
    }
    if(c.topLesson&&c.topLesson.lessonId){
      add('lesson-continue',ct('currentLessonContinue'),ct('currentLessonText',{lesson:(c.topLesson.title||'A1')}),'language-course-open-lesson:'+c.topLesson.lessonId,0,'normal',ct('lessonMainReason'),'▶');
    }
    add('current',ct('continue'),ct('currentLessonText',{lesson:c.lesson||'A1'}),'language-course-continue',0,'normal',ct('reviewCurrentReason'),'→');
    var seen={};
    return sets.filter(function(x){ if(seen[x.id]||seen[x.action]) return false; seen[x.id]=seen[x.action]=true; return true; }).slice(0,5);
  }
  function coachReviewSetsHtml(c){
    var sets=coachReviewSets(c);
    return '<div class="la-coach-review-sets" data-la-coach-review-sets="phase27f">'+sets.map(function(r,idx){
      var count=r.count?'<strong>'+esc(r.count)+'</strong>':'';
      return '<article class="la-coach-rec la-review-set is-'+esc(r.priority)+'"><div class="la-coach-rec-icon">'+esc(r.icon)+'</div><div class="la-coach-rec-copy"><span>'+esc(ct('reviewSet'))+' '+esc(idx+1)+' · '+esc(coachPriorityLabel(r.priority))+'</span><h4>'+esc(r.title)+'</h4><p>'+esc(r.text)+'</p><small>'+esc(r.reason)+'</small></div>'+count+'<button type="button" class="la-secondary" data-ui-action="language-course-coach-start" data-la-coach-action="'+esc(r.action)+'">'+esc(ct('start'))+'</button></article>';
    }).join('')+'</div>';
  }
  function coachRecommendationsHtml(c){
    var cards=coachRecommendationCards(c);
    return '<div class="la-coach-recommendations" data-la-coach-recommendations="phase27f">'+cards.map(function(r,idx){
      return '<article class="la-coach-rec is-'+esc(r.priority)+'"><div class="la-coach-rec-icon">'+esc(r.icon)+'</div><div class="la-coach-rec-copy"><span>'+esc(ct('priority'))+' '+esc(idx+1)+' · '+esc(coachPriorityLabel(r.priority))+'</span><h4>'+esc(r.title)+'</h4><p>'+esc(r.text)+'</p><small>'+esc(r.reason)+'</small></div><button type="button" class="la-secondary" data-ui-action="language-course-coach-start" data-la-coach-action="'+esc(r.action)+'">'+esc(ct('start'))+'</button></article>';
    }).join('')+'</div>';
  }
  function coachPrimaryRecommendation(c){
    var cards=coachRecommendationCards(c);
    return cards[0]||{title:c.title,text:c.text,action:c.action,priority:c.priority,reason:c.reason,icon:'→'};
  }
  function coachCardHtml(){
    var c=coachInsight();
    var primary=coachPrimaryRecommendation(c);
    return '<section class="la-card la-coach-card" data-la-coach="phase27f"><div class="la-coach-head"><span class="la-section-kicker">'+esc(ct('teacher'))+'</span><span class="la-coach-pill">'+esc(ct('pill'))+'</span></div><h3>'+esc(primary.title||c.title)+'</h3><p>'+esc(primary.text||c.text)+'</p>'+coachEvidenceHtml(c)+'<div class="la-coach-metrics"><div><b>'+esc(c.accuracy||0)+'%</b><small>'+esc(ct('accuracy'))+'</small></div><div><b>'+esc(c.wrong)+'</b><small>'+esc(ct('openErrors'))+'</small></div><div><b>'+esc(c.vocabRepeat)+'</b><small>'+esc(ct('vocab'))+'</small></div></div><p class="la-note">'+esc(ct('reason'))+': '+esc(primary.reason||c.reason)+'</p>'+coachRecommendationsHtml(c)+coachReviewSetsHtml(c)+'<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-course-coach-start" data-la-coach-action="'+esc(primary.action||c.action)+'">'+esc(ct('startRecommendation'))+'</button><button type="button" class="la-secondary" data-ui-action="language-course-open-coach">'+esc(ct('allRecommendations'))+'</button></div></section>';
  }
  function openCoachPanel(){
    var c=coachInsight();
    var primary=coachPrimaryRecommendation(c);
    var body='<div class="la-dashboard la-coach-panel" data-la-coach-panel="phase27f"><section class="la-card la-coach-card"><span class="la-section-kicker">'+esc(ct('teacherRecommendations'))+'</span><h3>'+esc(primary.title||c.title)+'</h3><p>'+esc(primary.text||c.text)+'</p>'+coachEvidenceHtml(c)+'<div class="la-coach-metrics"><div><b>'+esc(c.accuracy||0)+'%</b><small>'+esc(ct('accuracy'))+'</small></div><div><b>'+esc(c.wrong)+'</b><small>'+esc(ct('openErrors'))+'</small></div><div><b>'+esc(c.vocabRepeat)+'</b><small>'+esc(ct('vocabToRepeat'))+'</small></div></div><p class="la-note">'+esc(ct('coachNote'))+'</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-course-coach-start" data-la-coach-action="'+esc(primary.action||c.action)+'">'+esc(ct('topRecommendation'))+'</button><button type="button" class="la-secondary" data-ui-action="language-course-open">'+esc(ct('dashboard'))+'</button></div></section><section class="la-card"><span class="la-section-kicker">'+esc(ct('recommendations'))+'</span><h3>'+esc(ct('recommendationsTitle'))+'</h3>'+coachRecommendationsHtml(c)+'</section><section class="la-card"><span class="la-section-kicker">'+esc(ct('reviewSets'))+'</span><h3>'+esc(ct('reviewSetsTitle'))+'</h3>'+coachReviewSetsHtml(c)+'</section><section class="la-card"><span class="la-section-kicker">'+esc(ct('nextPlan'))+'</span><h3>'+esc(ct('nextPlanTitle'))+'</h3>'+coachPlanHtml(c)+'</section><section class="la-card"><span class="la-section-kicker">'+esc(ct('taskTypes'))+'</span><h3>'+esc(ct('taskTypesTitle'))+'</h3>'+coachRowsHtml(c.typeRows,ct('taskTypesKind'))+'</section><section class="la-card"><span class="la-section-kicker">'+esc(ct('lessons'))+'</span><h3>'+esc(ct('lessonsTitle'))+'</h3>'+coachRowsHtml(c.lessonRows,ct('lessonKind'))+'</section></div>';
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-coach',theme:'blue',title:ct('teacher'),kicker:'Language Academy',subtitle:ct('teacherRecommendations'),iconHtml:'🧠',bodyHtml:body}); }catch(e){}
    return true;
  }
  function rememberCoachStart(label){
    try{ saveCourseProgress({stats:{lastActivity:new Date().toISOString()},currentCourse:Object.assign({},currentCourse(),{lastAction:label||'Coach-Empfehlung gestartet'})}); }catch(e){}
  }
  function openTaskTypeTraining(type){
    type=String(type||'multiple_choice');
    var wrong=collectWrongTasks().filter(function(w){return String(w.type||'')===type;});
    if(wrong.length){
      rememberCoachStart('Coach: Aufgabentyp '+type+' aus Fehlern gestartet');
      return openTask(wrong[0].level||'a1', wrong[0].lessonId, wrong[0].taskIndex||0);
    }
    var level=findLevel('a1');
    var lessons=(level&&level.lessons)||[];
    for(var i=0;i<lessons.length;i++){
      var idx=firstTaskIndexByType(lessons[i].id,type);
      var tasks=lessonTasks(lessons[i].id);
      if(tasks[idx] && taskType(tasks[idx])===type){
        rememberCoachStart('Coach: Aufgabentyp '+type+' gestartet');
        return openTask('a1',lessons[i].id,idx);
      }
    }
    rememberCoachStart('Coach: Aufgabentyp-Fallback geöffnet');
    return openErrorTraining();
  }
  function startCoachRecommendation(action){
    action=String(action||coachInsight().action||'language-course-continue');
    if(action.indexOf('language-course-open-lesson:')===0){
      var lessonId=action.split(':')[1]||'a1-greetings';
      rememberCoachStart('Coach: Lektion '+lessonId+' geöffnet');
      return openLesson('a1', lessonId);
    }
    if(action.indexOf('language-course-train-tasktype:')===0){
      return openTaskTypeTraining(action.split(':')[1]||'multiple_choice');
    }
    if(action==='language-course-open-error-training'){ rememberCoachStart('Coach: Fehlertraining geöffnet'); return openErrorTraining(); }
    if(action==='language-course-repeat-errors'){ rememberCoachStart('Coach: offene Fehler wiederholen'); return openRepeatErrors(); }
    if(action==='language-course-open-vocabulary'){ rememberCoachStart('Coach: Vokabelübersicht geöffnet'); return openVocabulary(); }
    if(action==='language-course-start-vocab-review'){ rememberCoachStart('Coach: Vokabeltraining gestartet'); return openVocabularyTraining(0); }
    if(action==='language-course-continue'){ rememberCoachStart('Coach: Weiterlernen gestartet'); return openContinue(); }
    rememberCoachStart('Coach: Fallback Weiterlernen');
    return openContinue();
  }

  function shortcutHtml(){
    var items=[['Weiterlernen','Aktuelle Lektion öffnen','▶','language-course-continue'],['Wiederholen','Offene Fehler wiederholen','↻','language-course-repeat-errors'],['Vokabeln','Wortschatz trainieren','Aa','language-course-open-vocabulary'],['Meine Fehler','Fehler gezielt trainieren','!','language-course-open-error-training']];
    return '<div class="la-shortcut-grid">'+items.map(function(it){return '<button type="button" class="la-shortcut" data-ui-action="'+esc(it[3])+'"><span>'+esc(it[2])+'</span><b>'+esc(it[0])+'</b><small>'+esc(it[1])+'</small></button>';}).join('')+'</div>';
  }
  function openDashboard(){
    var s=settings(), id=profileIdentity(), name=id.playerName||id.nickname||id.displayName||'Gast', cc=currentCourse();
    var body='<div class="la-dashboard la-dashboard-phase24c" data-la-dashboard="phase26c">'+
      '<section class="la-hero-panel">'+
        '<div class="la-avatar" aria-hidden="true">'+esc(initials(name))+'</div><div class="la-hero-copy"><span class="language-course-badge">🌍 Sprachkurs</span><h3>Willkommen zurück, '+esc(name)+'.</h3><p>'+esc(t('course.dashboard.subtitle','learn'))+'</p></div>'+ 
      '</section>'+ 
      '<section class="la-card la-current-course"><div><span class="la-section-kicker">Aktueller Kurs</span><h3>'+esc(cc.course)+' '+esc(cc.level)+'</h3><p>Lektion: <b>'+esc(cc.lesson)+'</b></p><span class="la-progress"><i style="width:'+esc(cc.progress)+'%"></i></span><small>'+esc(cc.progress)+' % Fortschritt · '+esc(cc.lastAction)+'</small></div><button type="button" class="la-primary" data-ui-action="language-course-continue">Weiterlernen</button></section>'+ 
      '<section class="la-card la-language-card"><span class="la-section-kicker">Spracheinstellungen</span><div class="la-language-row">'+langSelect('learn',s.learningLanguage,t('common.learningLanguage','learn'))+langSelect('help',s.helpLanguage,t('common.helpLanguage','learn'))+'</div><div class="la-help-preview"><b>Hilfe-Vorschau:</b> '+esc(hintPreview())+'</div></section>'+ 
      '<section class="la-card"><span class="la-section-kicker">Niveaus</span><div class="la-level-grid">'+levelHtml()+'</div></section>'+ 
      '<section class="la-card"><span class="la-section-kicker">Statistiken</span>'+statCards()+'</section>'+ 
      cloudSyncStatusHtml()+
      coachCardHtml()+
      audioOverviewHtml()+
      speechTrainerStatusHtml()+
      vocabOverviewHtml()+
      wrongTrainingSummaryHtml()+
      '<section class="la-card"><span class="la-section-kicker">Schnellzugriffe</span>'+shortcutHtml()+'</section>'+ 
    '</div>';
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function'){
      var r=window.EGTUILayer.openDeepSheet({type:'language-course-dashboard',theme:'blue',title:'Sprachkurs',kicker:'Language Academy',subtitle:'Dashboard für Deutsch/Türkisch mit Lernsprache und Hilfesprache.',iconHtml:'🌍',bodyHtml:body});
      setTimeout(bindSheetEvents,40); return r;
    }}catch(e){}
    alert('Sprachkurs-Dashboard bereit.'); return true;
  }
  function bindSheetEvents(){
    var root=document.querySelector('[data-la-dashboard="phase26c"]'); if(!root) return;
    root.querySelectorAll('[data-la-lang-select]').forEach(function(sel){
      if(sel.getAttribute('data-la-bound')==='1') return; sel.setAttribute('data-la-bound','1');
      sel.addEventListener('change',function(){setLang(sel.getAttribute('data-la-lang-select'), sel.value);});
    });
  }
  function normalizeLevel(id){ id=String(id||'a1').toLowerCase(); return COURSE_TREE[id]?id:'a1'; }
  function lessonStatusLabel(status){ return status==='available'?'offen':(status==='done'?'abgeschlossen':'vorbereitet'); }
  function levelById(id){ for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id===id) return LEVELS[i]; } return LEVELS[0]; }
  function lessonCards(levelId){
    var data=COURSE_TREE[normalizeLevel(levelId)]||COURSE_TREE.a1;
    return (data.lessons||[]).map(function(lesson,idx){
      var disabled=lesson.status!=='available';
      return '<button type="button" class="la-lesson-card '+(disabled?'is-planned':'is-ready')+'" data-ui-action="language-course-open-lesson" data-la-level="'+esc(levelId)+'" data-la-lesson="'+esc(lesson.id)+'" '+(disabled?'aria-disabled="true"':'')+'>'+ 
        '<span class="la-lesson-index">'+esc(idx+1)+'</span><span class="la-lesson-main"><b>'+esc(lesson.title)+'</b><small>'+esc(lesson.goal)+'</small><em>'+esc(lesson.tasks)+' Aufgaben · '+esc(lessonStatusLabel(lesson.status))+'</em></span><span class="la-lesson-progress"><i style="width:'+esc(lessonProgressValue(lesson.id,lesson.progress||0))+'%"></i></span>'+ 
      '</button>';
    }).join('');
  }
  function openLevel(levelId){
    levelId=normalizeLevel(levelId);
    var meta=levelById(levelId), data=COURSE_TREE[levelId]||COURSE_TREE.a1;
    var isAvailable=meta.status!=='locked';
    var body='<div class="la-dashboard la-level-detail" data-la-level-detail="'+esc(levelId)+'">'+
      '<section class="la-card la-level-detail-hero"><span class="la-section-kicker">Niveau-Auswahl</span><h3>'+esc(meta.label)+' · '+esc(data.title)+'</h3><p>'+esc(data.subtitle)+' — klare Kursnavigation im bestehenden App-Design.</p><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-open">Dashboard</button><button type="button" class="la-primary" data-ui-action="language-course-open-lesson" data-la-level="'+esc(levelId)+'" data-la-lesson="'+esc((data.lessons&&data.lessons[0]&&data.lessons[0].id)||'')+'" '+(!isAvailable?'aria-disabled="true"':'')+'>Erste Lektion öffnen</button></div></section>'+
      '<section class="la-card"><span class="la-section-kicker">Lektionen</span><div class="la-lesson-list">'+lessonCards(levelId)+'</div></section>'+ 
      '<section class="la-card"><span class="la-section-kicker">Kurslogik</span><p class="la-note">A1 enthält jetzt 10 sichtbare Startlektionen. A2-C2 bleiben sichtbar vorbereitet, damit Struktur und Design geprüft werden können, ohne unfertige Lerninhalte vorzutäuschen.</p></section>'+ 
    '</div>';
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-dashboard',theme:'blue',title:meta.label+' '+data.title,kicker:'Sprachkurs',subtitle:'Niveau und Lektionen auswählen.',iconHtml:'📚',bodyHtml:body}); }catch(e){}
    return true;
  }
  function findLesson(levelId, lessonId){
    var data=COURSE_TREE[normalizeLevel(levelId)]||COURSE_TREE.a1;
    var list=data.lessons||[];
    for(var i=0;i<list.length;i++){ if(list[i].id===lessonId) return list[i]; }
    return list[0]||null;
  }
  function getLessonState(lessonId){
    var p=getCourseProgress();
    var st=(p.lessonState&&p.lessonState[lessonId])||{};
    return Object.assign({index:0,answered:false,selected:null,correct:null,score:0,total:0,attempts:0,wrongTaskIds:[],lastFeedback:''},st);
  }
  function saveLessonState(lessonId,next){
    var p=getCourseProgress(); var all=Object.assign({},p.lessonState||{});
    all[lessonId]=Object.assign({},getLessonState(lessonId),next||{}, {updatedAt:new Date().toISOString()});
    saveCourseProgress({lessonState:all});
  }
  function localized(v,kind){
    if(typeof v==='string') return v;
    var s=settings(); var lang=(kind==='help'?s.helpLanguage:s.learningLanguage)||'de';
    return (v&& (v[lang]||v.de||v.tr)) || '';
  }
  function helpLanguageName(){
    var s=settings();
    return ((s.helpLanguage||'tr')==='tr') ? 'Türkisch' : 'Deutsch';
  }
  function lessonTasks(lessonId){ return LESSON_TASKS[lessonId]||[]; }
  function taskById(lessonId,taskId){
    var list=lessonTasks(lessonId);
    for(var i=0;i<list.length;i++){ if(list[i] && list[i].id===taskId) return {task:list[i],index:i}; }
    return null;
  }
  function collectWrongTasks(){
    var p=getCourseProgress(), states=p.lessonState||{}, out=[];
    Object.keys(states).forEach(function(lessonId){
      var st=states[lessonId]||{}, wrong=Array.isArray(st.wrongTaskIds)?st.wrongTaskIds:[];
      if(!wrong.length) return;
      var lesson=findLesson('a1',lessonId)||{id:lessonId,title:lessonId,goal:''};
      wrong.forEach(function(taskId){
        var found=taskById(lessonId,taskId); if(!found) return;
        out.push({level:'a1',lessonId:lessonId,lessonTitle:lesson.title,taskId:taskId,taskIndex:found.index,task:found.task,type:taskType(found.task),label:taskTypeLabel(found.task),updatedAt:st.updatedAt||''});
      });
    });
    return out;
  }
  function wrongTrainingSummaryHtml(){
    var wrong=collectWrongTasks();
    if(!wrong.length){
      return '<section class="la-card la-error-training-card" data-la-error-training="empty"><span class="la-section-kicker">Meine Fehler</span><h3>Keine offenen Fehler</h3><p class="la-note">Sobald du eine Aufgabe falsch beantwortest, erscheint sie hier automatisch im Fehlertraining.</p><button type="button" class="la-secondary" data-ui-action="language-course-continue">Weiterlernen</button></section>';
    }
    var typeCount={}; wrong.forEach(function(w){typeCount[w.type]=(typeCount[w.type]||0)+1;});
    var chips=Object.keys(typeCount).map(function(k){return '<span class="la-error-chip">'+esc((TASK_TYPE_REGISTRY[k]&&TASK_TYPE_REGISTRY[k].label)||k)+': '+esc(typeCount[k])+'</span>';}).join('');
    return '<section class="la-card la-error-training-card" data-la-error-training="phase26e"><span class="la-section-kicker">Meine Fehler</span><h3>'+esc(wrong.length)+' Aufgabe(n) zum Wiederholen</h3><p class="la-note">Falsch beantwortete Aufgaben werden gesammelt. Wenn du sie später richtig löst, verschwinden sie automatisch aus dieser Liste.</p><div class="la-error-chip-row">'+chips+'</div><button type="button" class="la-primary" data-ui-action="language-course-open-error-training">Fehlertraining starten</button></section>';
  }

  function allVocabularyItems(levelId){
    var level=normalizeLevel(levelId||'a1'), data=COURSE_TREE[level]||COURSE_TREE.a1, list=[];
    (data.lessons||[]).forEach(function(lesson){
      (lessonTasks(lesson.id)||[]).forEach(function(task){
        if(task.type==='flashcard' && task.front && task.back){
          list.push({id:task.id,level:level,lessonId:lesson.id,lessonTitle:lesson.title,front:task.front,back:task.back,source:'flashcard'});
        }
        if(task.type==='matching' && Array.isArray(task.pairs)){
          task.pairs.forEach(function(p,idx){
            if(p.left&&p.right){list.push({id:task.id+'-pair-'+idx,level:level,lessonId:lesson.id,lessonTitle:lesson.title,front:p.left,back:p.right,source:'matching'});}
          });
        }
      });
    });
    var seen={};
    return list.filter(function(v){var key=v.front+'|'+v.back; if(seen[key]) return false; seen[key]=true; return true;});
  }
  function vocabState(){var p=getCourseProgress(); return Object.assign({},p.vocabularyState||{});}
  function vocabStats(){
    var items=allVocabularyItems('a1'), st=vocabState(), known=0, repeat=0, fresh=0;
    items.forEach(function(v){var x=st[v.id]||{}; if(x.status==='known') known++; else if(x.status==='repeat') repeat++; else fresh++;});
    return {total:items.length,known:known,repeat:repeat,fresh:fresh};
  }
  function saveVocabularyResult(itemId,status){
    var st=vocabState(), old=st[itemId]||{};
    st[itemId]=Object.assign({},old,{status:status,attempts:Number(old.attempts||0)+1,lastReviewedAt:new Date().toISOString(),nextReviewAt:status==='known'?new Date(Date.now()+86400000).toISOString():new Date(Date.now()+1800000).toISOString()});
    var vs=vocabStats();
    saveCourseProgress({vocabularyState:st,stats:{vocabKnown:status==='known'?Number((getCourseProgress().stats||{}).vocabKnown||0)+1:(getCourseProgress().stats||{}).vocabKnown||0,vocabRepeat:status==='repeat'?Number((getCourseProgress().stats||{}).vocabRepeat||0)+1:(getCourseProgress().stats||{}).vocabRepeat||0,lastActivity:new Date().toISOString()}});
  }
  function dueVocabularyItems(){
    var items=allVocabularyItems('a1'), st=vocabState(), now=Date.now();
    var due=items.filter(function(v){var x=st[v.id]||{}; return !x.status || x.status==='repeat' || (x.nextReviewAt && Date.parse(x.nextReviewAt)<=now);});
    return due.length?due:items;
  }
  function audioOverviewHtml(){
    return '<section class="la-card la-audio-summary"><span class="la-section-kicker">Hörverständnis</span><h3>Audio vorbereitet</h3><p class="la-note">Phase 26D nutzt zunächst den Browser-Speech-Fallback. Später können Piper-TTS oder echte Audiodateien angeschlossen werden, ohne die Aufgaben-UI umzubauen.</p><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-audio-demo">Audio testen</button><button type="button" class="la-primary" data-ui-action="language-course-open-listening" data-la-level="a1" data-la-lesson="a1-greetings">Höraufgabe öffnen</button></div></section>';
  }
  function speechUiLang(){
    var s=settings();
    return ((s.helpLanguage||'tr')==='tr')?'tr':'de';
  }
  function speechUiText(key, vars){
    var lang=speechUiLang();
    var dict={
      de:{
        ready:'Bereit.', requesting:'Mikrofon wird angefragt …', listening:'Ich höre zu …', processing:'Auswertung läuft …', done:'Ergebnis bereit.', unsupported:'Dieses Gerät unterstützt die Browser-Spracherkennung hier nicht.', permission_denied:'Mikrofonberechtigung fehlt oder wurde blockiert.', no_speech:'Ich konnte noch keine Sprache erkennen. Sprich langsam und deutlich.', error:'Mikrofon wurde nicht erkannt oder die Berechtigung fehlt.', start_failed:'Mikrofonstart fehlgeschlagen. Bitte Browserberechtigung prüfen.', excellent:'Sehr gut ausgesprochen.', almost:'Fast richtig. Ein Wort fehlt oder klingt anders.', partial:'Teilweise erkannt. Sprich etwas langsamer und wiederhole den Satz.', repeat:'Bitte wiederholen. Der erkannte Satz passt noch nicht genug.', missing_one:'Fast richtig. Ein Wort fehlt.', missing_many:'Der Anfang war richtig. Wiederhole den letzten Teil langsam.', privacy:'Das Mikrofon startet nur, wenn du auf den Button tippst.', live:'Live erkannt', final:'Erkannt', score:'Bewertung', alternatives:'Alternativen', word_feedback:'Wort-für-Wort', speak_now:'🎙️ Sprich jetzt', listen_model:'▶ Vormachen', self_done:'Selbst nachgesprochen', fallback_continue:'Du kannst den Satz trotzdem laut üben und anschließend weitergehen.', browser_supported:'SpeechRecognition verfügbar', browser_unsupported:'SpeechRecognition nicht verfügbar / Gerätetest nötig', mobile_limited:'Mobiler Übungsmodus aktiv. Auf iPhone/iPad kann automatische Erkennung im Browser oder als PWA eingeschränkt sein.', ios_pwa_limited:'iPhone/iPad Home-Screen-App: automatische Erkennung ist eingeschränkt. Öffne die App in Safari oder nutze den mobilen Übungsmodus.', manual_ready:'Sprich den Satz laut nach. Danach markierst du ihn selbst als gesprochen.', auto_mode:'Automatische Auswertung', mobile_mode:'Mobiler Übungsmodus', device:'Gerät', secure:'Sichere Verbindung', insecure_context:'Unsichere Verbindung: iPhone/iPad blockiert Mikrofon und Web-Speech über lokale IP oder HTTP. Öffne die App über HTTPS, z. B. GitHub Pages.', local_ip:'Lokale IP erkannt. Für iPhone/iPad bitte HTTPS nutzen, nicht 192.168.x.x.', secure_yes:'HTTPS/Sicher', secure_no:'Nicht sicher / HTTP', open_safari:'Auf iPhone/iPad am besten direkt in Safari öffnen, nicht als Home-Screen-PWA.'
      },
      tr:{
        ready:'Hazır.', requesting:'Mikrofon izni isteniyor …', listening:'Seni dinliyorum …', processing:'Değerlendiriliyor …', done:'Sonuç hazır.', unsupported:'Bu cihazda tarayıcı konuşma tanıma desteği yok.', permission_denied:'Mikrofon izni eksik veya engellendi.', no_speech:'Henüz konuşma algılanmadı. Yavaş ve net konuş.', error:'Mikrofon algılanmadı veya izin eksik.', start_failed:'Mikrofon başlatılamadı. Lütfen tarayıcı iznini kontrol et.', excellent:'Çok iyi telaffuz ettin.', almost:'Neredeyse doğru. Bir kelime eksik veya farklı duyuldu.', partial:'Kısmen algılandı. Biraz daha yavaş söyle ve cümleyi tekrar et.', repeat:'Lütfen tekrar et. Algılanan cümle hedefe yeterince yakın değil.', missing_one:'Neredeyse doğru. Bir kelime eksik.', missing_many:'Başlangıç doğruydu. Son kısmı yavaşça tekrar et.', privacy:'Mikrofon sadece düğmeye bastığında başlar.', live:'Canlı algılama', final:'Algılanan', score:'Puan', alternatives:'Alternatifler', word_feedback:'Kelime kelime', speak_now:'🎙️ Şimdi konuş', listen_model:'▶ Dinle', self_done:'Kendim tekrar ettim', fallback_continue:'Cümleyi yine de sesli çalışıp devam edebilirsin.', browser_supported:'SpeechRecognition mevcut', browser_unsupported:'SpeechRecognition yok / cihaz testi gerekli', mobile_limited:'Mobil alıştırma modu aktif. iPhone/iPad üzerinde otomatik tanıma tarayıcıda veya PWA olarak sınırlı olabilir.', ios_pwa_limited:'iPhone/iPad ana ekran uygulaması: otomatik tanıma sınırlıdır. Uygulamayı Safari içinde aç veya mobil alıştırma modunu kullan.', manual_ready:'Cümleyi sesli tekrar et. Sonra kendin konuşuldu olarak işaretle.', auto_mode:'Otomatik değerlendirme', mobile_mode:'Mobil alıştırma modu', device:'Cihaz', secure:'Güvenli bağlantı', insecure_context:'Güvenli olmayan bağlantı: iPhone/iPad yerel IP veya HTTP üzerinden mikrofonu ve Web-Speech özelliğini engeller. Uygulamayı HTTPS ile aç, örn. GitHub Pages.', local_ip:'Yerel IP algılandı. iPhone/iPad için 192.168.x.x yerine HTTPS kullan.', secure_yes:'HTTPS/Güvenli', secure_no:'Güvenli değil / HTTP', open_safari:'iPhone/iPad üzerinde en iyisi doğrudan Safari içinde açmaktır, ana ekran PWA olarak değil.'
      }
    };
    var txt=(dict[lang]&&dict[lang][key])||(dict.de&&dict.de[key])||key;
    vars=vars||{}; Object.keys(vars).forEach(function(k){ txt=txt.replace(new RegExp('\\{'+k+'\\}','g'), String(vars[k])); });
    return txt;
  }
  function taskSpeechLang(task){
    var raw=(task&& (task.speechLanguage||task.language||task.lang)) || (settings().learningLanguage||'de');
    raw=String(raw||'de').toLowerCase();
    if(raw.indexOf('tr')===0) return 'tr-TR';
    if(raw.indexOf('en')===0) return raw.indexOf('gb')>=0?'en-GB':'en-US';
    return 'de-DE';
  }
  function speechLanguage(task){ return taskSpeechLang(task||null); }
  function speakText(text, lang){
    text=String(text||'').trim(); if(!text) return false;
    try{
      if(window.speechSynthesis && window.SpeechSynthesisUtterance){
        window.speechSynthesis.cancel();
        var u=new SpeechSynthesisUtterance(text); u.lang=lang||speechLanguage(); u.rate=.88; u.pitch=1; u.volume=1;
        window.speechSynthesis.speak(u); return true;
      }
    }catch(e){}
    return false;
  }

  function speechDeviceInfo(){
    var ua=''; try{ ua=String(navigator.userAgent||''); }catch(e){}
    var platform=''; try{ platform=String(navigator.platform||''); }catch(e){}
    var maxTouch=0; try{ maxTouch=Number(navigator.maxTouchPoints||0); }catch(e){}
    var isIOS=/iPad|iPhone|iPod/i.test(ua) || (platform==='MacIntel' && maxTouch>1);
    var isAndroid=/Android/i.test(ua);
    var isStandalone=false;
    try{ isStandalone=!!(window.navigator.standalone || (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)); }catch(e){}
    var isSecure=false; try{ isSecure=!!window.isSecureContext || location.protocol==='https:' || location.hostname==='localhost'; }catch(e){}
    var host=''; try{ host=String(location.hostname||''); }catch(e){}
    var isLocalIp=/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host);
    var isMobile=isIOS||isAndroid||maxTouch>1;
    return {userAgent:ua,platform:platform,maxTouchPoints:maxTouch,isIOS:isIOS,isAndroid:isAndroid,isMobile:isMobile,isStandalone:isStandalone,isSecureContext:isSecure,hostname:host,isLocalIp:isLocalIp};
  }
  function speechRecognitionCtor(){
    try{return window.SpeechRecognition||window.webkitSpeechRecognition||null;}catch(e){return null;}
  }
  function mediaRecorderSpeechFallbackSupported(){
    try{return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia); }catch(e){return false;}
  }
  function speechRecognitionSupportStatus(){
    var Ctor=speechRecognitionCtor();
    var dev=speechDeviceInfo();
    var engine='none';
    try{ if(window.SpeechRecognition) engine='SpeechRecognition'; else if(window.webkitSpeechRecognition) engine='webkitSpeechRecognition'; }catch(e){}
    if(!dev.isSecureContext){
      return {supported:false,recognitionAvailable:!!Ctor,status:'insecure_context',engine:engine,device:dev,mode:'mobile_fallback',fallbackSupported:true,message:speechUiText(dev.isLocalIp?'local_ip':'insecure_context')};
    }
    if(dev.isIOS && dev.isStandalone){
      return {supported:false,recognitionAvailable:!!Ctor,status:'ios_pwa_limited',engine:engine,device:dev,mode:'mobile_fallback',fallbackSupported:true,message:speechUiText('ios_pwa_limited')};
    }
    if(!Ctor){
      return {supported:false,recognitionAvailable:false,status:'unsupported',engine:'none',device:dev,mode:'mobile_fallback',fallbackSupported:true,message:speechUiText(dev.isMobile?'mobile_limited':'unsupported')};
    }
    return {supported:true,recognitionAvailable:true,status:'supported',engine:engine,device:dev,mode:'auto',fallbackSupported:true,message:speechUiText('browser_supported')};
  }
  function microphoneSupported(){ var st=speechRecognitionSupportStatus(); return !!(st.supported||st.fallbackSupported); }
  function shouldUseMobileSpeechFallback(){
    var st=speechRecognitionSupportStatus();
    return !st.supported || st.status==='ios_pwa_limited';
  }
  function normalizeSpeechText(v, lang){
    var out=String(v||'').toLowerCase();
    out=out.replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ş/g,'s').replace(/ç/g,'c');
    try{ out=out.normalize('NFD').replace(/[\u0300-\u036f]/g,''); }catch(e){}
    out=out.replace(/[.,!?;:()\[\]{}"'„“”’`´]/g,' ');
    out=out.replace(/\s+/g,' ').trim();
    return out;
  }
  function speechVariantList(task, expected, lang){
    var list=[];
    function add(v){ v=String(v||'').trim(); if(v) list.push(v); }
    add(expected); add(task&&task.answer);
    if(task&&Array.isArray(task.acceptedPhrases)) task.acceptedPhrases.forEach(add);
    if(task&&Array.isArray(task.speechVariants)) task.speechVariants.forEach(add);
    var norm=normalizeSpeechText(expected,lang);
    var base={
      'guten morgen':['Guten Morgen','Guten Morgen.','Guten morgen','Guten Mor­gen'],
      'guten tag':['Guten Tag','Guten Tag.'],
      'hallo':['Hallo','Hallo.'],
      'danke':['Danke','Danke schön','Dankeschön'],
      'merhaba':['Merhaba','Merhaba.'],
      'gunaydin':['Günaydın','Gunaydin']
    };
    (base[norm]||[]).forEach(add);
    var seen={};
    return list.filter(function(v){var k=normalizeSpeechText(v,lang); if(!k||seen[k]) return false; seen[k]=true; return true;});
  }
  function levenshteinDistance(a,b){
    a=String(a||''); b=String(b||'');
    var m=a.length,n=b.length;
    if(!m) return n; if(!n) return m;
    var prev=[],cur=[],i,j;
    for(j=0;j<=n;j++) prev[j]=j;
    for(i=1;i<=m;i++){
      cur=[i];
      for(j=1;j<=n;j++){
        var cost=a.charAt(i-1)===b.charAt(j-1)?0:1;
        cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+cost);
      }
      prev=cur;
    }
    return prev[n];
  }
  function tokenSimilarity(expectedTokens, actualTokens){
    if(!expectedTokens.length||!actualTokens.length) return 0;
    var used={},hits=0,close=0,ordered=0;
    expectedTokens.forEach(function(t,idx){
      var exact=actualTokens.indexOf(t);
      if(exact>=0 && !used[exact]){ hits++; used[exact]=true; if(actualTokens[idx]===t) ordered++; return; }
      var best=-1,bestScore=0;
      actualTokens.forEach(function(a,aidx){ if(used[aidx]) return; var max=Math.max(t.length,a.length)||1; var sim=1-(levenshteinDistance(t,a)/max); if(sim>bestScore){bestScore=sim; best=aidx;} });
      if(bestScore>=.72 && best>=0){ close++; used[best]=true; if(actualTokens[idx] && best===idx) ordered+=.5; }
    });
    var coverage=(hits+(close*.65))/Math.max(expectedTokens.length,actualTokens.length);
    var orderBonus=ordered/expectedTokens.length;
    return Math.round(Math.max(0,Math.min(100,(coverage*.82+orderBonus*.18)*100)));
  }
  function wordFeedback(expected, actual, lang){
    var e=normalizeSpeechText(expected,lang).split(' ').filter(Boolean);
    var a=normalizeSpeechText(actual,lang).split(' ').filter(Boolean);
    var used={},words=[],correct=0,close=0,missing=0,prefix=0;
    e.forEach(function(w,idx){
      var status='missing',hit=-1;
      for(var i=0;i<a.length;i++){ if(!used[i]&&a[i]===w){ status='correct'; hit=i; break; } }
      if(hit<0){
        var best=-1,bestScore=0;
        for(var j=0;j<a.length;j++){ if(used[j]) continue; var max=Math.max(w.length,a[j].length)||1; var sim=1-(levenshteinDistance(w,a[j])/max); if(sim>bestScore){bestScore=sim; best=j;} }
        if(bestScore>=.72){ status='close'; hit=best; }
      }
      if(hit>=0) used[hit]=true;
      if(status==='correct') correct++; else if(status==='close') close++; else missing++;
      if((status==='correct'||status==='close') && idx===prefix) prefix++;
      words.push({word:w,status:status});
    });
    return {words:words,correct:correct,close:close,missing:missing,prefixCorrect:prefix,total:e.length};
  }
  function scoreSpeechPair(expected, actual, lang){
    var e=normalizeSpeechText(expected,lang), a=normalizeSpeechText(actual,lang);
    if(!e||!a) return {score:0,expected:expected,actual:actual,wordFeedback:wordFeedback(expected,actual,lang)};
    if(e===a) return {score:100,expected:expected,actual:actual,wordFeedback:wordFeedback(expected,actual,lang)};
    var max=Math.max(e.length,a.length)||1;
    var charScore=Math.round((1-(levenshteinDistance(e,a)/max))*100);
    charScore=Math.max(0,Math.min(100,charScore));
    var tokenScore=tokenSimilarity(e.split(' ').filter(Boolean),a.split(' ').filter(Boolean));
    var prefix=(a.indexOf(e)===0||e.indexOf(a)===0);
    var shortRatio=Math.min(e.length,a.length)/Math.max(e.length,a.length);
    var prefixScore=prefix?(shortRatio>=.75?78:62):0;
    var score=Math.round(Math.max(prefixScore,(charScore*.48)+(tokenScore*.52)));
    return {score:Math.max(0,Math.min(100,score)),expected:expected,actual:actual,wordFeedback:wordFeedback(expected,actual,lang)};
  }
  function speechSimilarityDetailed(task, expected, actual, lang){
    lang=lang||taskSpeechLang(task); expected=String(expected||''); actual=String(actual||'');
    var variants=speechVariantList(task,expected,lang), best=null;
    variants.forEach(function(v){ var r=scoreSpeechPair(v,actual,lang); r.variant=v; if(!best||r.score>best.score) best=r; });
    if(!best) best=scoreSpeechPair(expected,actual,lang);
    return best;
  }
  function speechSimilarity(a,b){
    return speechSimilarityDetailed(null,String(a||''),String(b||''),speechLanguage()).score;
  }
  function speechScoreLabel(score, detail){
    score=Number(score||0);
    if(score>=90) return speechUiText('excellent');
    if(score>=70){ if(detail&&detail.wordFeedback&&detail.wordFeedback.missing===1) return speechUiText('missing_one'); return speechUiText('almost'); }
    if(score>=40){ if(detail&&detail.wordFeedback&&detail.wordFeedback.prefixCorrect>0) return speechUiText('missing_many'); return speechUiText('partial'); }
    if(score>0) return speechUiText('repeat');
    return speechUiText('ready');
  }
  var A1_SPEAKING_CONTENT={
    'a1-greetings':[
      {suffix:'speak-1',de:'Guten Morgen',tr:'Günaydın',variants:['Guten Morgen.','Guten morgen','Günaydın','Gunaydin']},
      {suffix:'speak-2',de:'Hallo, wie geht es dir?',tr:'Merhaba, nasılsın?',variants:['Hallo wie geht es dir','Wie geht es dir','Merhaba nasılsın','Merhaba nasilsin']},
      {suffix:'speak-3',de:'Danke, es geht mir gut.',tr:'Teşekkür ederim, iyiyim.',variants:['Danke es geht mir gut','Dankeschön es geht mir gut','Tesekkur ederim iyiyim','Teşekkür ederim iyiyim']},
      {suffix:'speak-4',de:'Bis später',tr:'Görüşürüz',variants:['Bis spaeter','Bis später.','Gorusuruz','Görüşürüz.']}
    ],
    'a1-introduce':[
      {suffix:'speak-1',de:'Ich heiße Ali.',tr:'Benim adım Ali.',variants:['Ich heisse Ali','Ich heiße Ali','Benim adim Ali','Benim adım Ali']},
      {suffix:'speak-2',de:'Mein Name ist Ayşe.',tr:'Benim adım Ayşe.',variants:['Mein Name ist Ayshe','Mein Name ist Ayse','Mein Name ist Ayşe','Benim adim Ayse','Benim adım Ayşe']},
      {suffix:'speak-3',de:'Ich komme aus Deutschland.',tr:"Almanya'dan geliyorum.",variants:['Ich komme aus Deutschland','Almanyadan geliyorum',"Almanya'dan geliyorum"]},
      {suffix:'speak-4',de:'Ich wohne in Ulm.',tr:"Ulm'da yaşıyorum.",variants:['Ich wohne in Ulm','Ich wohne Ulm','Ulmda yasiyorum',"Ulm'da yaşıyorum"]}
    ],
    'a1-numbers':[
      {suffix:'speak-1',de:'Eins, zwei, drei.',tr:'Bir, iki, üç.',variants:['Eins zwei drei','Ein zwei drei','Bir iki uc','Bir iki üç']},
      {suffix:'speak-2',de:'Ich habe zehn Euro.',tr:'On eurom var.',variants:['Ich habe zehn Euro','Ich hab zehn Euro','On euro var','On eurom var']},
      {suffix:'speak-3',de:'Die Nummer ist zwanzig.',tr:'Numara yirmi.',variants:['Die Nummer ist zwanzig','Nummer zwanzig','Numara yirmi']},
      {suffix:'speak-4',de:'Ich bin dreißig Jahre alt.',tr:'Otuz yaşındayım.',variants:['Ich bin dreissig Jahre alt','Ich bin dreißig Jahre alt','Otuz yasindayim','Otuz yaşındayım']}
    ],
    'a1-time':[
      {suffix:'speak-1',de:'Wie spät ist es?',tr:'Saat kaç?',variants:['Wie spaet ist es','Wie spät ist es','Saat kac','Saat kaç']},
      {suffix:'speak-2',de:'Es ist acht Uhr.',tr:'Saat sekiz.',variants:['Es ist acht Uhr','Acht Uhr','Saat sekiz']},
      {suffix:'speak-3',de:'Der Termin ist heute.',tr:'Randevu bugün.',variants:['Der Termin ist heute','Termin ist heute','Randevu bugun','Randevu bugün']},
      {suffix:'speak-4',de:'Ich komme später.',tr:'Sonra geliyorum.',variants:['Ich komme spaeter','Ich komme später','Sonra geliyorum']}
    ],
    'a1-family':[
      {suffix:'speak-1',de:'Das ist meine Mutter.',tr:'Bu benim annem.',variants:['Das ist meine Mutter','Bu benim annem']},
      {suffix:'speak-2',de:'Mein Vater ist zu Hause.',tr:'Babam evde.',variants:['Mein Vater ist zuhause','Mein Vater ist zu Hause','Babam evde']},
      {suffix:'speak-3',de:'Ich habe eine Schwester.',tr:'Bir kız kardeşim var.',variants:['Ich habe eine Schwester','Ich hab eine Schwester','Bir kiz kardesim var','Bir kız kardeşim var']},
      {suffix:'speak-4',de:'Meine Familie ist groß.',tr:'Ailem büyük.',variants:['Meine Familie ist gross','Meine Familie ist groß','Ailem buyuk','Ailem büyük']}
    ],
    'a1-shopping':[
      {suffix:'speak-1',de:'Ich brauche Brot.',tr:'Ekmeğe ihtiyacım var.',variants:['Ich brauche Brot','Ich brauch Brot','Ekmege ihtiyacim var','Ekmeğe ihtiyacım var']},
      {suffix:'speak-2',de:'Was kostet das?',tr:'Bu ne kadar?',variants:['Was kostet das','Was kostet es','Bu ne kadar']},
      {suffix:'speak-3',de:'Ich bezahle mit Karte.',tr:'Kartla ödüyorum.',variants:['Ich bezahle mit Karte','Ich zahl mit Karte','Kartla oduyorum','Kartla ödüyorum']},
      {suffix:'speak-4',de:'Eine Tüte bitte.',tr:'Bir poşet lütfen.',variants:['Eine Tuete bitte','Eine Tüte bitte','Bir poset lutfen','Bir poşet lütfen']}
    ],
    'a1-doctor':[
      {suffix:'speak-1',de:'Ich habe Schmerzen.',tr:'Ağrım var.',variants:['Ich habe Schmerzen','Ich hab Schmerzen','Agrim var','Ağrım var']},
      {suffix:'speak-2',de:'Ich bin krank.',tr:'Hastayım.',variants:['Ich bin krank','Hastayim','Hastayım']},
      {suffix:'speak-3',de:'Ich brauche einen Termin.',tr:'Randevuya ihtiyacım var.',variants:['Ich brauche einen Termin','Ich brauch einen Termin','Randevuya ihtiyacim var','Randevuya ihtiyacım var']},
      {suffix:'speak-4',de:'Ich habe Fieber.',tr:'Ateşim var.',variants:['Ich habe Fieber','Ich hab Fieber','Atesim var','Ateşim var']}
    ],
    'a1-work':[
      {suffix:'speak-1',de:'Ich arbeite im Büro.',tr:'Ofiste çalışıyorum.',variants:['Ich arbeite im Buero','Ich arbeite im Büro','Ofiste calisiyorum','Ofiste çalışıyorum']},
      {suffix:'speak-2',de:'Mein Beruf ist wichtig.',tr:'Mesleğim önemli.',variants:['Mein Beruf ist wichtig','Meslegim onemli','Mesleğim önemli']},
      {suffix:'speak-3',de:'Ich habe heute Pause.',tr:'Bugün molam var.',variants:['Ich habe heute Pause','Ich hab heute Pause','Bugun molam var','Bugün molam var']},
      {suffix:'speak-4',de:'Der Computer ist im Büro.',tr:'Bilgisayar ofiste.',variants:['Der Computer ist im Buero','Der Computer ist im Büro','Bilgisayar ofiste']}
    ],
    'a1-traffic':[
      {suffix:'speak-1',de:'Wo ist der Bahnhof?',tr:'Tren istasyonu nerede?',variants:['Wo ist der Bahnhof','Tren istasyonu nerede']},
      {suffix:'speak-2',de:'Ich fahre mit dem Bus.',tr:'Otobüsle gidiyorum.',variants:['Ich fahre mit dem Bus','Ich fahr mit dem Bus','Otobusle gidiyorum','Otobüsle gidiyorum']},
      {suffix:'speak-3',de:'Gehen Sie geradeaus.',tr:'Düz gidin.',variants:['Gehen Sie geradeaus','Geh geradeaus','Duz gidin','Düz gidin']},
      {suffix:'speak-4',de:'Ich steige hier aus.',tr:'Burada iniyorum.',variants:['Ich steige hier aus','Ich steig hier aus','Burada iniyorum']}
    ],
    'a1-everyday':[
      {suffix:'speak-1',de:'Ich esse zu Hause.',tr:'Evde yemek yiyorum.',variants:['Ich esse zuhause','Ich esse zu Hause','Evde yemek yiyorum']},
      {suffix:'speak-2',de:'Ich trinke Wasser.',tr:'Su içiyorum.',variants:['Ich trinke Wasser','Su iciyorum','Su içiyorum']},
      {suffix:'speak-3',de:'Ich gehe morgen zur Schule.',tr:'Yarın okula gidiyorum.',variants:['Ich gehe morgen zur Schule','Ich geh morgen zur Schule','Yarin okula gidiyorum','Yarın okula gidiyorum']},
      {suffix:'speak-4',de:'Ich bin heute müde.',tr:'Bugün yorgunum.',variants:['Ich bin heute muede','Ich bin heute müde','Bugun yorgunum','Bugün yorgunum']}
    ]
  };
  function lessonTitleForSpeech(lessonId){ var lesson=findLesson('a1',lessonId)||{}; return lesson.title||lessonId||'A1'; }
  function createSpeechTask(lessonId,item,index){
    lessonId=lessonId||'a1-greetings'; item=item||{suffix:'speak-1',de:'Guten Morgen',tr:'Günaydın',variants:['Guten Morgen','Guten morgen','Günaydın','Gunaydin']}; index=Number(index||0);
    var de=String(item.de||'').trim(), tr=String(item.tr||de).trim();
    var lessonTitle=lessonTitleForSpeech(lessonId);
    return {
      id:lessonId+'-'+(item.suffix||('speak-'+(index+1))),
      type:'speaking_practice',
      phase:'30C',
      skill:'speaking',
      parallelContent:true,
      prompt:{de:'Sprich den Satz nach: „'+de+'“',tr:'Cümleyi tekrar söyle: „'+de+'“'},
      instruction:{de:'Tippe auf „Sprich jetzt“ und sage den Satz langsam und deutlich ins Mikrofon.',tr:'„Şimdi konuş“ düğmesine bas ve cümleyi yavaş ve net şekilde mikrofona söyle.'},
      hint:{de:'Achte auf klare Wörter. Die App vergleicht deinen gesprochenen Satz mit dem Zieltext.',tr:'Kelimeleri net söyle. Uygulama söylediğin cümleyi hedef cümleyle karşılaştırır.'},
      expectedText:{de:de,tr:tr},
      answer:de,
      acceptedPhrases:[de,tr].concat(item.variants||[]),
      speechVariants:[de,tr].concat(item.variants||[]),
      explain:{de:'Sprechübung zur A1-Lektion „'+lessonTitle+'“. Ziel ist, den Satz verständlich auszusprechen.',tr:'A1 dersi „'+lessonTitle+'“ için konuşma alıştırması. Amaç cümleyi anlaşılır şekilde söylemektir.'}
    };
  }
  function synchronizeSpeakingTaskCounts(){
    try{
      var lessons=((COURSE_TREE&&COURSE_TREE.a1&&COURSE_TREE.a1.lessons)||[]);
      lessons.forEach(function(lesson){ if(lesson&&lesson.id&&LESSON_TASKS[lesson.id]) lesson.tasks=(LESSON_TASKS[lesson.id]||[]).length; });
      var total=lessons.reduce(function(sum,lesson){return sum+Number((lesson&&lesson.tasks)||0);},0);
      if(LEVELS&&LEVELS[0]) LEVELS[0].desc='10 Lektionen · ca. '+total+' Aufgaben inkl. Sprechen';
    }catch(e){}
  }
  function ensurePhase30SpeakingTask(){
    try{
      Object.keys(A1_SPEAKING_CONTENT).forEach(function(lessonId){
        var list=LESSON_TASKS[lessonId]||[];
        (A1_SPEAKING_CONTENT[lessonId]||[]).forEach(function(item,idx){
          var id=lessonId+'-'+(item.suffix||('speak-'+(idx+1)));
          var exists=list.some(function(t){return t&&t.id===id;});
          if(!exists) list.push(createSpeechTask(lessonId,item,idx));
        });
        list.forEach(function(t){
          if(t&&t.type==='speaking_practice'){
            t.phase=t.phase||'30C';
            t.skill=t.skill||'speaking';
            t.parallelContent=true;
            if(!Array.isArray(t.speechVariants)) t.speechVariants=[localized(t.expectedText,'learn')||t.answer||''];
          }
        });
        LESSON_TASKS[lessonId]=list;
      });
      synchronizeSpeakingTaskCounts();
    }catch(e){}
  }
  function speakingCoverageSnapshot(){
    ensurePhase30SpeakingTask();
    var lessons=((COURSE_TREE&&COURSE_TREE.a1&&COURSE_TREE.a1.lessons)||[]), perLesson={}, total=0, speaking=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[];
      var count=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length;
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,speakingTasks:count,ok:count>=4};
      total+=list.length; speaking+=count; if(count<4) complete=false;
    });
    return {a1Lessons:lessons.length,totalTasks:total,speakingTasks:speaking,speakingPerLesson:perLesson,minimumSpeakingPerLesson:4,complete:complete,parallelBuildPolicy:'Ab A2 werden Kursinhalt und Sprechaufgaben zeitgleich ausgebaut.'};
  }
  function speechTrainerStatusHtml(){
    var st=speechRecognitionSupportStatus();
    return '<section class="la-card la-speaking-summary" data-la-speaking-summary="phase30c"><span class="la-section-kicker">Sprechtraining</span><h3>A1-Sprechtraining '+(st.supported?'bereit':'vorbereitet')+'</h3><p class="la-note">Teilnehmer können jetzt in allen 10 A1-Lektionen Sätze über das Mikrofon nachsprechen. Phase 30C ergänzt 40 Sprechaufgaben und behält den 30B-Browser-Speech-Adapter ohne Server bei.</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-course-open-speaking" data-la-level="a1" data-la-lesson="a1-greetings">Sprechaufgabe öffnen</button><button type="button" class="la-secondary" data-ui-action="language-course-mic-check">Mikrofon prüfen</button></div><small class="la-note">Browserstatus: '+esc(st.supported?speechUiText('browser_supported'):(st.message||speechUiText('browser_unsupported')))+' · '+esc(st.mode==='auto'?speechUiText('auto_mode'):speechUiText('mobile_mode'))+' · '+esc(speechUiText('privacy'))+'</small></section>';
  }
  function openMicrophoneCheck(){
    var st=speechRecognitionSupportStatus();
    var body='<div class="la-dashboard"><section class="la-card la-speaking-summary"><span class="la-section-kicker">Mikrofonprüfung</span><h3>'+(st.supported?'Mikrofon technisch verfügbar':(st.status==='insecure_context'?'HTTPS für iPhone/iPad nötig':'Mikrofon noch nicht verfügbar'))+'</h3><p class="la-note">'+esc(st.supported?'Dein Browser unterstützt Spracherkennung. Beim Start einer Sprechaufgabe fragt das Gerät nach Mikrofonberechtigung.':(st.message||'Dieser Browser unterstützt die Web-Speech-Erkennung nicht oder blockiert sie. Die Aufgabe bleibt sichtbar und bietet eine sichere Übungsalternative.'))+'</p><div class="la-speech-status-grid"><span>Status: '+esc(st.status)+'</span><span>Engine: '+esc(st.engine)+'</span><span>Verbindung: '+esc(st.device&&st.device.isSecureContext?speechUiText('secure_yes'):speechUiText('secure_no'))+'</span><span>Host: '+esc((st.device&&st.device.hostname)||'')+'</span><span>Modus: '+esc(st.mode==='auto'?speechUiText('auto_mode'):speechUiText('mobile_mode'))+'</span><span>Sprache: '+esc(speechLanguage())+'</span></div><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-course-open-speaking" data-la-level="a1" data-la-lesson="a1-greetings">Sprechaufgabe öffnen</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Dashboard</button></div><small class="la-note">'+esc(st.status==='insecure_context'?'Auf iPhone/iPad bitte die GitHub-Pages-Adresse mit https:// testen. Lokale IP-Adressen wie 192.168.x.x sind für Mikrofon/Speech nicht zuverlässig.':speechUiText('privacy'))+'</small></section></div>';
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-speaking',theme:'blue',title:'Mikrofon prüfen',kicker:'Sprachkurs',subtitle:'Sprechfunktion 30C Mobile-Fix.',iconHtml:'🎙️',bodyHtml:body}); }catch(e){}
    return true;
  }
  function collectSpeechAlternatives(ev){
    var finalTexts=[],interimTexts=[],all=[];
    try{
      var results=ev&&ev.results||[];
      for(var i=0;i<results.length;i++){
        var res=results[i]; if(!res) continue;
        for(var j=0;j<Math.min(res.length||0,5);j++){
          var alt=res[j]; var txt=String((alt&&alt.transcript)||'').trim(); if(!txt) continue;
          var item={transcript:txt,confidence:typeof alt.confidence==='number'?alt.confidence:null,final:!!res.isFinal};
          all.push(item); if(res.isFinal) finalTexts.push(txt); else interimTexts.push(txt);
        }
      }
    }catch(e){}
    function unique(items){ var seen={}; return items.filter(function(x){var k=normalizeSpeechText(x.transcript||x); if(!k||seen[k]) return false; seen[k]=true; return true;}); }
    return {final:finalTexts.join(' ').trim(),interim:interimTexts.join(' ').trim(),all:unique(all).slice(0,5)};
  }
  function bestSpeechAlternative(task, expected, alternatives, lang){
    var best={score:0,actual:'',variant:expected,wordFeedback:wordFeedback(expected,'',lang)};
    (alternatives||[]).forEach(function(alt){ var actual=String((alt&&alt.transcript)||alt||'').trim(); if(!actual) return; var r=speechSimilarityDetailed(task,expected,actual,lang); r.actual=actual; r.confidence=alt&&alt.confidence; if(r.score>best.score) best=r; });
    return best;
  }
  function startMobileSpeechFallback(level,lessonId,idx,task,reason){
    var st=speechRecognitionSupportStatus();
    var msg=reason || st.message || speechUiText('mobile_limited');
    saveLessonState(lessonId,{
      index:idx,activeTaskId:task.id,
      speechSupported:false,
      speechStatus:st.status==='ios_pwa_limited'?'ios_pwa_limited':'mobile_fallback',
      speechError:st.status||'mobile_fallback',
      speechFallbackMode:'manual',
      speechListening:false,
      speechFeedback:msg+' '+speechUiText('manual_ready'),
      answered:false
    });
    openTask(level,lessonId,idx);
    return false;
  }
  function startSpeechPractice(level,lessonId,idx,task){
    if(shouldUseMobileSpeechFallback()) return startMobileSpeechFallback(level,lessonId,idx,task);
    return startSpeechRecognition(level,lessonId,idx,task);
  }
  function startSpeechRecognition(level,lessonId,idx,task){
    var Ctor=speechRecognitionCtor();
    var lang=taskSpeechLang(task);
    if(!Ctor){ return startMobileSpeechFallback(level,lessonId,idx,task,speechUiText('unsupported')); }
    try{
      var rec=new Ctor();
      var dev=speechDeviceInfo();
      rec.lang=lang;
      rec.interimResults=dev.isIOS?false:true;
      rec.maxAlternatives=dev.isIOS?1:5;
      rec.continuous=false;
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speechSupported:true,speechLang:lang,speechStatus:'requesting',speechError:'',speechInterimTranscript:'',speechTranscript:'',speechAlternatives:[],speechFeedback:speechUiText('requesting'),answered:false});
      rec.onstart=function(){ saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speechStatus:'listening',speechListening:true,speechFeedback:speechUiText('listening')}); openTask(level,lessonId,idx); };
      rec.onresult=function(ev){
        var got=collectSpeechAlternatives(ev);
        var expected=localized(task.expectedText,'learn')||String(task.answer||'');
        if(got.interim && !got.final){
          saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speechStatus:'listening',speechListening:true,speechInterimTranscript:got.interim,speechAlternatives:got.all,speechFeedback:speechUiText('listening'),answered:false});
          openTask(level,lessonId,idx); return;
        }
        saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speechStatus:'processing',speechListening:false,speechFeedback:speechUiText('processing')});
        var finalText=got.final || (got.all[0]&&got.all[0].transcript) || got.interim || '';
        var best=bestSpeechAlternative(task,expected,got.all.length?got.all:[finalText],lang);
        var score=Number(best.score||0);
        saveLessonState(lessonId,{index:idx,activeTaskId:task.id,selected:score>=70?'known':'repeat',speechListening:false,speechStatus:'done',speechLang:lang,speechTranscript:best.actual||finalText,speechInterimTranscript:'',speechScore:score,speechAlternatives:got.all,speechWordFeedback:best.wordFeedback,speechFeedback:speechScoreLabel(score,best),answered:false});
        openTask(level,lessonId,idx);
      };
      rec.onerror=function(ev){
        var raw=(ev&&ev.error)||'error';
        var denied=(raw==='not-allowed'||raw==='service-not-allowed'||raw==='permission-denied');
        var noSpeech=(raw==='no-speech');
        var status=denied?'permission_denied':(noSpeech?'no_speech':'error');
        saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speechListening:false,speechStatus:status,speechError:raw,speechFeedback:speechUiText(status),answered:false});
        openTask(level,lessonId,idx);
      };
      rec.onend=function(){
        var st=getLessonState(lessonId);
        if(st.speechStatus==='requesting'||st.speechStatus==='listening'||st.speechListening){
          saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speechListening:false,speechStatus:'no_speech',speechFeedback:speechUiText('no_speech'),answered:false});
          openTask(level,lessonId,idx);
        }
      };
      rec.start();
      openTask(level,lessonId,idx);
      return true;
    }catch(e){ if(speechDeviceInfo().isMobile) return startMobileSpeechFallback(level,lessonId,idx,task,speechUiText('start_failed')); saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speechListening:false,speechStatus:'start_failed',speechError:'start_failed',speechFeedback:speechUiText('start_failed'),answered:false}); openTask(level,lessonId,idx); return false; }
  }

  function taskAudioText(task){
    if(!task) return '';
    var txt=localized(task.audioText,'learn') || localized(task.audioLabel,'learn') || localized(task.prompt,'learn');
    return txt;
  }
  function vocabOverviewHtml(){
    var vs=vocabStats();
    return '<section class="la-card la-vocab-summary"><span class="la-section-kicker">Vokabeltrainer</span><h3>A1 Wortschatz</h3><p class="la-note">Trainiert Vokabeln aus den A1-Lektionen. Bekannte Wörter werden später wiederholt, unsichere Wörter kommen schneller zurück.</p><div class="la-vocab-stats"><div><b>'+esc(vs.total)+'</b><small>Wörter</small></div><div><b>'+esc(vs.known)+'</b><small>Kann ich</small></div><div><b>'+esc(vs.repeat)+'</b><small>Wiederholen</small></div><div><b>'+esc(vs.fresh)+'</b><small>Neu</small></div></div><button type="button" class="la-primary" data-ui-action="language-course-vocab-start">Vokabeltraining starten</button></section>';
  }
  function renderVocabularyCard(index){
    var items=dueVocabularyItems(); index=Math.max(0,Math.min(items.length-1,index||0)); var item=items[index], st=vocabState()[item.id]||{};
    return '<div class="la-dashboard la-vocab-trainer" data-la-vocab-index="'+esc(index)+'" data-la-vocab-id="'+esc(item.id)+'"><section class="la-card la-task-head"><span class="la-section-kicker">Vokabel '+esc(index+1)+' von '+esc(items.length)+'</span><h3>'+esc(item.lessonTitle)+'</h3><p>Quelle: '+esc(item.source==='matching'?'Zuordnung':'Vokabelkarte')+'</p><span class="la-progress"><i style="width:'+esc(Math.round(((index+1)/items.length)*100))+'%"></i></span></section><section class="la-card la-vocab-card"><span class="la-section-kicker">Deutsch</span><h3>'+esc(item.front)+'</h3><div class="la-vocab-meaning"><span>Türkisch</span><b>'+esc(item.back)+'</b></div><small>Status: '+esc(st.status==='known'?'sicher':(st.status==='repeat'?'wiederholen':'neu'))+'</small></section><section class="la-card"><div class="la-task-actions"><button type="button" class="la-secondary" data-ui-action="language-course-vocab-repeat">Wiederholen</button><button type="button" class="la-primary" data-ui-action="language-course-vocab-known">Kann ich</button><button type="button" class="la-secondary" data-ui-action="language-course-vocab-next">Weiter</button></div><p class="la-note">Phase 26C speichert den Vokabelstatus lokal im Sprachkursfortschritt. Cloud-Sync kommt später separat.</p></section><section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-open-vocabulary">Zur Übersicht</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Dashboard</button></div></section></div>';
  }
  function openVocabulary(){
    var body='<div class="la-dashboard" data-la-vocab-overview="phase26c">'+vocabOverviewHtml()+'<section class="la-card"><span class="la-section-kicker">Lektionswortschatz</span><div class="la-vocab-list">'+allVocabularyItems('a1').slice(0,30).map(function(v){var st=vocabState()[v.id]||{}; return '<div class="la-vocab-row"><b>'+esc(v.front)+'</b><span>'+esc(v.back)+'</span><em>'+esc(st.status==='known'?'sicher':(st.status==='repeat'?'wiederholen':'neu'))+'</em></div>';}).join('')+'</div></section></div>';
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-dashboard',theme:'blue',title:'Vokabeln',kicker:'Sprachkurs',subtitle:'A1-Wortschatz trainieren und wiederholen.',iconHtml:'Aa',bodyHtml:body}); }catch(e){} return true;
  }
  function openVocabularyTraining(index){
    var items=dueVocabularyItems(); index=Number(index||0);
    var body='';
    if(!items.length){
      body='<div class="la-dashboard"><section class="la-card"><span class="la-section-kicker">Vokabeltraining</span><h3>Keine Vokabeln vorhanden</h3><p class="la-note">Sobald Lektionen Vokabelkarten oder Zuordnungen enthalten, erscheinen sie hier.</p><button type="button" class="la-primary" data-ui-action="language-course-open">Dashboard</button></section></div>';
    }else if(index>=items.length){
      body='<div class="la-dashboard"><section class="la-card la-vocab-complete"><span class="la-section-kicker">Vokabeltraining</span><h3>Runde abgeschlossen</h3><p class="la-note">Du hast die aktuelle Vokabelrunde bearbeitet. Unsichere Wörter kommen später wieder in die Wiederholung.</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-course-open-vocabulary">Zur Vokabelübersicht</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Dashboard</button></div></section></div>';
    }else{
      body=renderVocabularyCard(index);
    }
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-dashboard',theme:'blue',title:'Vokabeltraining',kicker:'Sprachkurs',subtitle:'Wortschatz aktiv wiederholen.',iconHtml:'Aa',bodyHtml:body}); }catch(e){} return true;
  }
  function taskHelp(task){
    try{var h=window.LanguageAcademyHelpSystem; if(h&&typeof h.getHint==='function') return h.getHint({hint:task.hint,answer:task.answer});}catch(e){}
    return localized(task.hint,'help');
  }
  function feedbackText(task,correct){
    var coach=task&&task.coach;
    if(coach){ var picked=correct?coach.correct:coach.wrong; var txt=localized(picked,'learn'); if(txt) return txt; }
    return correct?'Richtig. Du kannst mit der nächsten Aufgabe weitermachen.':'Noch nicht richtig. Lies den Hinweis und versuche das Muster bewusst zu erkennen.';
  }
  function safeUnique(list,value){
    var arr=Array.isArray(list)?list.slice():[];
    if(value && arr.indexOf(value)<0) arr.push(value);
    return arr;
  }
  function removeFromList(list,value){
    return (Array.isArray(list)?list:[]).filter(function(x){return x!==value;});
  }
  function learningStatusHtml(state,tasks){
    var wrong=(state.wrongTaskIds||[]).length;
    var attempts=state.attempts||0;
    var acc=state.total?Math.round(((state.score||0)/(state.total||1))*100):0;
    return '<section class="la-card la-learning-status" data-la-learning-status="phase24h"><span class="la-section-kicker">Lernstatus</span><div class="la-feedback-metrics"><div><b>'+esc(state.score||0)+'/'+esc(state.total||0)+'</b><small>richtig</small></div><div><b>'+esc(acc)+'%</b><small>Trefferquote</small></div><div><b>'+esc(wrong)+'</b><small>zu wiederholen</small></div><div><b>'+esc(attempts)+'</b><small>Versuche</small></div></div><p class="la-note">Fehler werden markiert, aber nicht bestraft. Die adaptive Engine entscheidet daraus, ob Wiederholung, Normalfluss oder schwierigere Aufgaben sinnvoll sind.</p></section>';
  }
  function progressFromState(tasks,state){
    if(!tasks.length) return 0;
    var done=Math.min(tasks.length, Math.max(0,(state.total||0)));
    return Math.round((done/tasks.length)*100);
  }

  var TASK_TYPE_REGISTRY={
    choice:{label:'Multiple Choice',kind:'select'}, multiple_choice:{label:'Multiple Choice',kind:'select'},
    matching:{label:'Zuordnen',kind:'matching'}, fill_blank:{label:'Lückentext',kind:'fill'},
    sentence_order:{label:'Satzbau',kind:'order'}, flashcard:{label:'Vokabelkarte',kind:'flashcard'},
    true_false:{label:'Richtig/Falsch',kind:'boolean'},
    listening_choice:{label:'Hörverständnis',kind:'audio'},
    speaking_practice:{label:'Sprechen',kind:'speech'}
  };
  function taskType(task){ return (task&&task.type==='choice')?'multiple_choice':String((task&&task.type)||'multiple_choice'); }
  function taskTypeLabel(task){ var t=TASK_TYPE_REGISTRY[taskType(task)]||TASK_TYPE_REGISTRY.multiple_choice; return t.label; }
  function selectedValues(state){ return Array.isArray(state.selectedValues)?state.selectedValues.slice():[]; }
  function toggleValue(list,value){
    var arr=Array.isArray(list)?list.slice():[];
    var idx=arr.indexOf(value);
    if(idx>=0) arr.splice(idx,1); else if(value) arr.push(value);
    return arr;
  }
  function normalizeTaskRenderState(state,task,idx){
    state=Object.assign({},state||{});
    state.index=idx;
    if(task && state.activeTaskId && state.activeTaskId!==task.id && !state.answered){
      state.selected=null; state.selectedValues=[]; state.flipped=false; state.correct=null; state.lastFeedback='';
    }
    if(task) state.activeTaskId=task.id;
    return state;
  }
  function renderOptionButtons(values, action, attr, selected, disabled){
    return (values||[]).map(function(v,i){var val=(typeof v==='string')?v:(v&&v.id)||String(i); var text=(typeof v==='string')?v:(v&&v.text)||String(val); var active=(selected||[]).indexOf(val)>=0; return '<button type="button" class="la-answer-choice la-token-choice '+(active?'is-selected':'')+'" data-ui-action="'+esc(action)+'" '+attr+'="'+esc(val)+'" '+(disabled?'aria-disabled="true"':'')+'><b>'+esc(text)+'</b></button>';}).join('');
  }
  function renderTaskInteraction(task,state){
    var type=taskType(task);
    if(type==='listening_choice'){
      var audioText=taskAudioText(task);
      var choices=(task.choices||[]).map(function(ch){
        var isSel=state.selected===ch.id; var cls='la-answer-choice'+(isSel?' is-selected':'');
        if(state.answered){ if(ch.id===task.answer) cls+=' is-correct'; else if(isSel) cls+=' is-wrong'; }
        return '<button type="button" class="'+cls+'" data-ui-action="language-course-select-answer" data-la-answer="'+esc(ch.id)+'" '+(state.answered?'aria-disabled="true"':'')+'><span>'+esc(String(ch.id).toUpperCase())+'</span><b>'+esc(ch.text)+'</b></button>';
      }).join('');
      return '<div class="la-audio-task"><button type="button" class="la-audio-play" data-ui-action="language-course-play-audio" data-la-audio-text="'+esc(audioText)+'">▶ Audio abspielen</button><small>Fallback: Browser-Stimme. Später austauschbar durch Piper/TTS-Datei.</small></div><div class="la-answer-grid">'+choices+'</div>';
    }
    if(type==='multiple_choice'){
      return '<div class="la-answer-grid">'+(task.choices||[]).map(function(ch){
        var isSel=state.selected===ch.id; var cls='la-answer-choice'+(isSel?' is-selected':'');
        if(state.answered){ if(ch.id===task.answer) cls+=' is-correct'; else if(isSel) cls+=' is-wrong'; }
        return '<button type="button" class="'+cls+'" data-ui-action="language-course-select-answer" data-la-answer="'+esc(ch.id)+'" '+(state.answered?'aria-disabled="true"':'')+'><span>'+esc(String(ch.id).toUpperCase())+'</span><b>'+esc(ch.text)+'</b></button>';
      }).join('')+'</div>';
    }
    if(type==='true_false'){
      var opts=[{id:'true',text:'Richtig'},{id:'false',text:'Falsch'}];
      return '<div class="la-answer-grid la-boolean-grid">'+opts.map(function(ch){var isSel=state.selected===ch.id; var correct=(String(task.answer)===ch.id); var cls='la-answer-choice'+(isSel?' is-selected':''); if(state.answered){ if(correct) cls+=' is-correct'; else if(isSel) cls+=' is-wrong'; } return '<button type="button" class="'+cls+'" data-ui-action="language-course-select-answer" data-la-answer="'+esc(ch.id)+'" '+(state.answered?'aria-disabled="true"':'')+'><b>'+esc(ch.text)+'</b></button>';}).join('')+'</div>';
    }
    if(type==='fill_blank'){
      return '<div class="la-fill-blank"><p class="la-sentence">'+esc(localized(task.sentence,'learn')||localized(task.prompt,'learn'))+'</p><div class="la-answer-grid">'+renderOptionButtons(task.options||[], 'language-course-select-answer', 'data-la-answer', [state.selected], state.answered)+'</div></div>';
    }
    if(type==='sentence_order'){
      var picked=selectedValues(state); var remaining=(task.tokens||[]).filter(function(tok){ return picked.indexOf(tok)<0; });
      return '<div class="la-sentence-order"><div class="la-order-target"><span>'+ (picked.length?esc(picked.join(' ')):'Wörter antippen …') +'</span></div><div class="la-answer-grid">'+renderOptionButtons(remaining, 'language-course-pick-token', 'data-la-token', [], state.answered)+'</div><button type="button" class="la-secondary la-mini-reset" data-ui-action="language-course-reset-tokens" '+(state.answered?'aria-disabled="true"':'')+'>Reihenfolge löschen</button></div>';
    }
    if(type==='matching'){
      var pairs=task.pairs||[]; var done=selectedValues(state);
      var html='<div class="la-matching-pairs">'+pairs.map(function(p,i){
        var key=String(i);
        var active=done.indexOf(key)>=0;
        var cls='la-match-pair '+(active?'is-selected':'');
        if(state.answered){ cls+=' is-correct'; }
        return '<button type="button" class="'+cls+'" data-ui-action="language-course-match-toggle" data-la-match-pair="'+esc(key)+'" '+(state.answered?'aria-disabled="true"':'')+'><span><b>'+esc(p.left)+'</b><small>Deutsch</small></span><em>↔</em><span><b>'+esc(p.right)+'</b><small>Türkisch</small></span></button>';
      }).join('')+'</div>';
      html+='<p class="la-note">Tippe jedes passende Paar an. Alle Paare müssen markiert sein, bevor du prüfen kannst.</p>';
      return html;
    }
    if(type==='flashcard'){
      var flipped=!!state.flipped; return '<div class="la-flashcard '+(flipped?'is-flipped':'')+'"><div><span class="la-section-kicker">Vorderseite</span><h3>'+esc(task.front||'')+'</h3></div>'+(flipped?'<div><span class="la-section-kicker">Rückseite</span><h3>'+esc(task.back||'')+'</h3></div>':'')+'</div><div class="la-task-actions"><button type="button" class="la-secondary" data-ui-action="language-course-flip-card">'+(flipped?'Rückseite sichtbar':'Karte umdrehen')+'</button><button type="button" class="la-primary" data-ui-action="language-course-select-answer" data-la-answer="known">Kann ich</button><button type="button" class="la-secondary" data-ui-action="language-course-select-answer" data-la-answer="repeat">Wiederholen</button></div>';
    }
    if(type==='speaking_practice'){
      var expected=localized(task.expectedText,'learn')||String(task.answer||'');
      var transcript=state.speechTranscript||''; var interim=state.speechInterimTranscript||''; var score=Number(state.speechScore||0);
      var support=speechRecognitionSupportStatus(); var statusKey=state.speechStatus || (support.supported?'ready':'unsupported');
      var status=state.speechListening?speechUiText('listening'):(state.speechFeedback||speechUiText(statusKey));
      var alternatives=Array.isArray(state.speechAlternatives)?state.speechAlternatives:[];
      var altHtml=alternatives.length?'<div class="la-speaking-alternatives"><span>'+esc(speechUiText('alternatives'))+'</span>'+alternatives.slice(0,5).map(function(a){return '<em>'+esc(a.transcript||a)+'</em>';}).join('')+'</div>':'';
      var wf=state.speechWordFeedback&&Array.isArray(state.speechWordFeedback.words)?state.speechWordFeedback.words:[];
      var wfHtml=wf.length?'<div class="la-speaking-word-feedback"><span>'+esc(speechUiText('word_feedback'))+'</span>'+wf.map(function(w){return '<em class="is-'+esc(w.status)+'">'+esc(w.word)+'</em>';}).join('')+'</div>':'';
      var isBlocked=!support.supported || statusKey==='permission_denied' || statusKey==='unsupported' || statusKey==='start_failed' || statusKey==='mobile_fallback' || statusKey==='ios_pwa_limited';
      var modeNote=support.supported?speechUiText('privacy'):(support.message||speechUiText('mobile_limited'));
      var fallback=isBlocked?'<div class="la-speaking-fallback"><p>'+esc(speechUiText('fallback_continue'))+' '+esc(speechUiText('open_safari'))+'</p><button type="button" class="la-secondary" data-ui-action="language-course-select-answer" data-la-answer="known">'+esc(speechUiText('self_done'))+'</button></div>':'';
      return '<div class="la-speaking-task" data-la-speaking-task="phase30c-mobilefix" data-la-speech-status="'+esc(statusKey)+'"><div class="la-speaking-target"><span class="la-section-kicker">Nachsprechen · '+esc(taskSpeechLang(task))+'</span><h3>'+esc(expected)+'</h3><button type="button" class="la-audio-play" data-ui-action="language-course-play-audio" data-la-audio-text="'+esc(expected)+'">'+esc(speechUiText('listen_model'))+'</button></div><div class="la-speaking-controls"><button type="button" class="la-primary la-mic-button" data-ui-action="language-course-start-speaking">'+esc(speechUiText('speak_now'))+'</button><small>'+esc(modeNote)+'</small></div><div class="la-speaking-result"><b>'+esc(status)+'</b><span>'+esc(speechUiText('live'))+': '+esc(interim||'—')+'</span><span>'+esc(speechUiText('final'))+': '+esc(transcript||'—')+'</span><em>'+esc(speechUiText('score'))+': '+esc(score)+'%</em>'+altHtml+wfHtml+'</div>'+fallback+'</div>';
    }
    return '<p class="la-note">Dieser Aufgabentyp ist registriert, aber noch ohne Renderer.</p>';
  }
  function evaluateTask(task,state){
    var type=taskType(task);
    if(type==='multiple_choice' || type==='fill_blank' || type==='listening_choice') return String(state.selected||'')===String(task.answer||'');
    if(type==='true_false') return String(state.selected)===(task.answer?'true':'false');
    if(type==='sentence_order') return JSON.stringify(selectedValues(state))===JSON.stringify(task.answer||[]);
    if(type==='matching') return selectedValues(state).length === ((task.pairs||[]).length);
    if(type==='flashcard') return state.selected==='known';
    if(type==='speaking_practice') return Number(state.speechScore||0)>=70 || state.selected==='known';
    return false;
  }
  function canCheckTask(task,state){
    var type=taskType(task);
    if(type==='sentence_order') return selectedValues(state).length>0;
    if(type==='matching') return selectedValues(state).length === ((task.pairs||[]).length);
    if(type==='flashcard') return !!state.selected;
    if(type==='speaking_practice') return Number(state.speechScore||0)>0 || !!state.selected;
    return !!state.selected;
  }
  function renderTaskBody(levelId,lesson,taskIndex){
    var tasks=lessonTasks(lesson.id), state=getLessonState(lesson.id);
    if(typeof taskIndex==='number') state.index=Math.max(0,Math.min(tasks.length-1,taskIndex));
    var task=tasks[state.index]||tasks[0];
    if(!task){return '<div class="la-dashboard"><section class="la-card"><h3>Aufgaben vorbereitet</h3><p class="la-note">Für diese Lektion sind noch keine Aufgaben hinterlegt.</p></section></div>';}
    state=normalizeTaskRenderState(state,task,state.index);
    var pct=Math.round(((state.index+1)/tasks.length)*100);
    var feedback='';
    if(state.answered){ feedback='<div class="la-task-feedback '+(state.correct?'is-correct':'is-wrong')+'" data-la-feedback="phase26b"><b>'+(state.correct?'Richtig.':'Noch nicht richtig.')+'</b><span>'+esc(feedbackText(task,state.correct))+'</span><small>'+esc(localized(task.explain,'learn'))+'</small></div>'; }
    var checkDisabled=(!canCheckTask(task,state)||state.answered)?'aria-disabled="true"':'';
    var nextLabel=(state.index>=tasks.length-1?'Abschließen':'Weiter');
    return '<div class="la-dashboard la-task-ui" data-la-task-ui="phase26b" data-la-level="'+esc(levelId)+'" data-la-lesson="'+esc(lesson.id)+'" data-la-task-index="'+esc(state.index)+'" data-la-task-type="'+esc(taskType(task))+'">'+
      '<section class="la-card la-task-head"><span class="la-section-kicker">Aufgabe '+esc(state.index+1)+' von '+esc(tasks.length)+' · '+esc(taskTypeLabel(task))+'</span><h3>'+esc(lesson.title)+'</h3><p>'+esc(localized(task.instruction,'learn'))+'</p><span class="la-progress"><i style="width:'+esc(pct)+'%"></i></span></section>'+ 
      '<section class="la-card la-question-card"><span class="la-section-kicker">'+esc(taskTypeLabel(task))+'</span><h3>'+esc(localized(task.prompt,'learn'))+'</h3>'+renderTaskInteraction(task,state)+feedback+'<div class="la-task-actions"><button type="button" class="la-secondary" data-ui-action="language-course-task-help">Hilfe auf '+esc(helpLanguageName())+'</button><button type="button" class="la-primary" data-ui-action="language-course-check-answer" '+checkDisabled+'>Antwort prüfen</button><button type="button" class="la-primary" data-ui-action="language-course-next-task" '+(!state.answered?'aria-disabled="true"':'')+'>'+nextLabel+'</button></div></section>'+ 
      '<section class="la-card la-help-box" data-la-help-box hidden><span class="la-section-kicker">Hilfestellung</span><p>'+esc(taskHelp(task))+'</p><small>Hinweis: Die Hilfe erklärt nur die Aufgabe. Die Lösung wird hier nicht angezeigt.</small></section>'+ learningStatusHtml(state,tasks)+
      '<section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-open-lesson" data-la-level="'+esc(levelId)+'" data-la-lesson="'+esc(lesson.id)+'">Zurück zur Lektionsansicht</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Dashboard</button></div></section>'+ 
    '</div>';
  }
  function firstTaskIndexByType(lessonId,type){
    var list=lessonTasks(lessonId);
    for(var i=0;i<list.length;i++){ if(taskType(list[i])===type) return i; }
    return 0;
  }
  function openTask(levelId,lessonId,taskIndex){
    levelId=normalizeLevel(levelId); var lesson=findLesson(levelId,lessonId); if(!lesson) return openLevel(levelId);
    var body=renderTaskBody(levelId,lesson,taskIndex);
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-dashboard',theme:'blue',title:levelId.toUpperCase()+' · '+lesson.title,kicker:'Sprachkurs',subtitle:'Aufgabe lösen · Hilfe ohne Lösung.',iconHtml:'✍️',bodyHtml:body}); }catch(e){}
    return true;
  }

  function selectedTaskRoot(el){ return el&&el.closest&&el.closest('[data-la-task-ui]'); }
  function handleTaskAction(action,el){
    var root=selectedTaskRoot(el); if(!root) return false;
    var level=root.getAttribute('data-la-level')||'a1', lessonId=root.getAttribute('data-la-lesson'), idx=parseInt(root.getAttribute('data-la-task-index')||'0',10)||0;
    var lesson=findLesson(level,lessonId), tasks=lessonTasks(lessonId), task=tasks[idx]; if(!lesson||!task) return false;
    var state=getLessonState(lessonId), type=taskType(task);
    if(action==='language-course-select-answer' && !state.answered){
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,selected:el.getAttribute('data-la-answer'),answered:false}); return openTask(level,lessonId,idx);
    }
    if(action==='language-course-pick-token' && !state.answered){
      var vals=selectedValues(state); var tok=el.getAttribute('data-la-token'); if(tok) vals.push(tok);
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,selectedValues:vals,answered:false}); return openTask(level,lessonId,idx);
    }
    if(action==='language-course-reset-tokens' && !state.answered){ saveLessonState(lessonId,{index:idx,activeTaskId:task.id,selectedValues:[],answered:false}); return openTask(level,lessonId,idx); }
    if(action==='language-course-match-toggle' && !state.answered){
      var pairKey=el.getAttribute('data-la-match-pair');
      var valsM=toggleValue(selectedValues(state),pairKey);
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,selectedValues:valsM,answered:false});
      return openTask(level,lessonId,idx);
    }
    if(action==='language-course-match-pick' && !state.answered){
      var vals2=safeUnique(selectedValues(state),el.getAttribute('data-la-match')); saveLessonState(lessonId,{index:idx,activeTaskId:task.id,selectedValues:vals2,answered:false}); return openTask(level,lessonId,idx);
    }
    if(action==='language-course-flip-card' && !state.answered){ saveLessonState(lessonId,{index:idx,activeTaskId:task.id,flipped:!state.flipped}); return openTask(level,lessonId,idx); }
    if(action==='language-course-play-audio'){
      var text=el.getAttribute('data-la-audio-text') || taskAudioText(task);
      var ok=speakText(text, taskSpeechLang(task));
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,audioPlayed:!!ok,audioFallback:!ok});
      return true;
    }
    if(action==='language-course-start-speaking' && !state.answered){
      return startSpeechPractice(level,lessonId,idx,task);
    }
    if(action==='language-course-task-help'){
      var box=root.querySelector('[data-la-help-box]'); if(box) box.hidden=!box.hidden; return true;
    }
    if(action==='language-course-check-answer'){
      if(!canCheckTask(task,state) || state.answered) return true;
      var correct=evaluateTask(task,state);
      var wrongIds=correct?removeFromList(state.wrongTaskIds,task.id):safeUnique(state.wrongTaskIds,task.id);
      var typeStats=Object.assign({},state.typeStats||{}); var ts=Object.assign({attempts:0,correct:0},typeStats[type]||{}); ts.attempts+=1; if(correct) ts.correct+=1; typeStats[type]=ts;
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,answered:true,correct:correct,lastFeedback:feedbackText(task,correct),attempts:(state.attempts||0)+1,wrongTaskIds:wrongIds,score:(state.score||0)+(correct?1:0),total:Math.max(state.total||0,idx+1),typeStats:typeStats});
      var fresh=getLessonState(lessonId); try{var eng=adaptiveEngine(); if(eng&&eng.recordAnswer) eng.recordAnswer({lessonId:lessonId,taskId:task.id,taskType:type,correct:correct,state:fresh,taskCount:tasks.length});}catch(_e){} updateLessonProgress(level,lessonId,progressFromState(tasks,fresh),'in_progress');
      saveCourseProgress({currentCourse:{course:'Deutsch',level:level.toUpperCase(),lesson:lesson.title,lessonId:lessonId,progress:progressFromState(tasks,fresh),started:true,lastAction:correct?'Aufgabe richtig beantwortet':'Aufgabe zur Wiederholung markiert'},stats:{lastActivity:new Date().toISOString()}});
      return openTask(level,lessonId,idx);
    }
    if(action==='language-course-next-task'){
      if(!state.answered) return true;
      if(idx>=tasks.length-1){ updateLessonProgress(level,lessonId,100,'completed'); saveCourseProgress({currentCourse:{course:'Deutsch',level:level.toUpperCase(),lesson:lesson.title,lessonId:lessonId,progress:100,started:true,lastAction:'Lektion abgeschlossen'},stats:{lastActivity:new Date().toISOString()}}); return openLesson(level,lessonId); }
      var nextTask=tasks[idx+1]||null; saveLessonState(lessonId,{index:idx+1,activeTaskId:nextTask&&nextTask.id,answered:false,selected:null,selectedValues:[],flipped:false,correct:null,lastFeedback:''}); return openTask(level,lessonId,idx+1);
    }
    return false;
  }
  function openLesson(levelId, lessonId){
    levelId=normalizeLevel(levelId);
    var lesson=findLesson(levelId,lessonId);
    if(!lesson) return openLevel(levelId);
    if(lesson.status!=='available') return openLevel(levelId);
    saveCourseProgress({currentCourse:{course:'Deutsch',level:levelId.toUpperCase(),lesson:lesson.title,lessonId:lesson.id,progress:lessonProgressValue(lesson.id,lesson.progress||0),started:true,lastAction:'Lektion geöffnet'},stats:{lastActivity:new Date().toISOString()}});
    var body='<div class="la-dashboard la-lesson-detail" data-la-lesson-detail="'+esc(lesson.id)+'">'+
      '<section class="la-card la-level-detail-hero"><span class="la-section-kicker">Lektion</span><h3>'+esc(levelId.toUpperCase())+' · '+esc(lesson.title)+'</h3><p>'+esc(lesson.goal)+'</p><span class="la-progress"><i style="width:'+esc(lessonProgressValue(lesson.id,lesson.progress||0))+'%"></i></span><small>'+esc(lessonProgressValue(lesson.id,lesson.progress||0))+' % Fortschritt · '+esc(lesson.tasks)+' Aufgaben vorbereitet</small></section>'+ 
      '<section class="la-card"><span class="la-section-kicker">Aufgaben</span><p class="la-note">Diese A1-Lektion enthält echte Startaufgaben. Hilfe erklärt nur die Aufgabe und zeigt keine Lösung.</p><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-open-level" data-la-level="'+esc(levelId)+'">Zurück zu '+esc(levelId.toUpperCase())+'</button><button type="button" class="la-primary" data-ui-action="language-course-open-task" data-la-level="'+esc(levelId)+'" data-la-lesson="'+esc(lesson.id)+'">Aufgabe starten</button></div></section>'+ 
    '</div>';
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-dashboard',theme:'blue',title:levelId.toUpperCase()+' · '+lesson.title,kicker:'Sprachkurs',subtitle:'Lektionsdetail vorbereitet.',iconHtml:'▶',bodyHtml:body}); }catch(e){}
    return true;
  }

  function openLevels(){
    var body='<div class="la-dashboard"><section class="la-card"><span class="la-section-kicker">Niveau-Auswahl</span><h3>A1–C2</h3><p>A1 ist als Startkurs mit 10 Lektionen offen. Die restlichen Stufen bleiben sichtbar, damit die Kursstruktur klar ist.</p><div class="la-level-grid">'+levelHtml()+'</div></section></div>';
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-levels',theme:'blue',title:'Niveau auswählen',kicker:'Sprachkurs',subtitle:'Phase 24E verbindet die Karten mit echten Kursstrukturen.',iconHtml:'📚',bodyHtml:body}); }catch(e){} return true;
  }
  function openSettings(){ return openDashboard(); }
  function openContinue(){ var cc=currentCourse(); return openTask(String(cc.level||'A1').toLowerCase(), cc.lessonId||'a1-greetings', undefined); }
  function openErrorTraining(){
    var wrong=collectWrongTasks();
    var body='<div class="la-dashboard la-error-training" data-la-error-training="phase26e">';
    if(!wrong.length){
      body+='<section class="la-card"><span class="la-section-kicker">Meine Fehler</span><h3>Keine offenen Fehler</h3><p class="la-note">Du hast aktuell keine Aufgabe im Wiederholungsbedarf. Bearbeite weiter normale Lektionen.</p><button type="button" class="la-primary" data-ui-action="language-course-continue">Weiterlernen</button></section>';
    }else{
      body+='<section class="la-card la-error-training-hero"><span class="la-section-kicker">Meine Fehler</span><h3>'+esc(wrong.length)+' Aufgabe(n) gezielt wiederholen</h3><p class="la-note">Wähle eine Fehlerkarte. Richtige Wiederholung entfernt den Fehler automatisch.</p><button type="button" class="la-primary" data-ui-action="language-course-review-first-error">Ersten Fehler trainieren</button></section>';
      body+='<section class="la-card"><span class="la-section-kicker">Fehlerliste</span><div class="la-error-list">'+wrong.map(function(w,idx){return '<button type="button" class="la-error-row" data-ui-action="language-course-review-task" data-la-level="'+esc(w.level)+'" data-la-lesson="'+esc(w.lessonId)+'" data-la-task-index="'+esc(w.taskIndex)+'"><span class="la-error-index">'+esc(idx+1)+'</span><span><b>'+esc(w.lessonTitle)+'</b><small>'+esc(w.label)+' · '+esc(localized(w.task.prompt,'learn'))+'</small></span><em>trainieren</em></button>';}).join('')+'</div></section>';
    }
    body+='<section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-open">Dashboard</button><button type="button" class="la-secondary" data-ui-action="language-course-levels">Niveaus</button></div></section></div>';
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-errors',theme:'blue',title:'Meine Fehler',kicker:'Sprachkurs',subtitle:'Gezielte Wiederholung.',iconHtml:'↻',bodyHtml:body}); }catch(e){} return true;
  }
  function openRepeatErrors(){
    var wrong=collectWrongTasks();
    if(wrong.length){return openTask(wrong[0].level||'a1', wrong[0].lessonId, wrong[0].taskIndex||0);}
    return openErrorTraining();
  }
  function openPlaceholder(){var body='<div class="la-dashboard"><section class="la-card"><h3>Vorbereitet</h3><p>Dieser Schnellzugriff ist sichtbar positioniert. Die echte Lernlogik folgt nach der visuellen Kontrolle.</p></section></div>'; try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function') return window.EGTUILayer.openDeepSheet({type:'language-course-placeholder',theme:'blue',title:'Vorbereitet',kicker:'Sprachkurs',subtitle:'Noch keine Fremdfunktion verändert.',iconHtml:'🌍',bodyHtml:body}); }catch(e){} return true;}
  function openPlaceholderCompat(kind){ if(kind==='settings') return openSettings(); if(kind==='levels') return openLevels(); return openPlaceholder(); }
  function register(){try{ if(window.AppModuleHost&&typeof window.AppModuleHost.register==='function') return window.AppModuleHost.register({id:'language-course-entry',label:'Sprachkurs',version:VERSION,branchAware:false,start:function(){openDashboard();},stop:function(){return true;}}); }catch(e){} return false;}
  function coachQaSnapshot(){
    var c=coachInsight();
    var recs=coachRecommendationCards(c);
    var sets=coachReviewSets(c);
    var wrong=collectWrongTasks();
    var vs=vocabStats();
    var starts=(recs||[]).concat(sets||[]).filter(function(x){return x&&x.action;}).map(function(x){return x.action;});
    var dataSources={errors:wrong.length>0,vocabulary:Number(vs.repeat||0)>0,taskTypes:!!(c.topType&&c.topType.type),lessons:!!(c.topLesson&&c.topLesson.lessonId),currentLesson:!!(currentCourse().lessonId)};
    return {ok:true,phase:'27G',version:VERSION,dataQuality:Number(c.dataQuality||0),recommendations:(recs||[]).length,reviewSets:(sets||[]).length,startActions:starts,uses:dataSources,hasTopRecommendation:!!(coachPrimaryRecommendation(c)&&coachPrimaryRecommendation(c).action),hasDataBasedReason:!!(c.reason&&c.reason!==ct('baseReason')),safeFallback:starts.indexOf('language-course-continue')>=0||!!c.action};
  }

  function phase30SpeechSnapshot(){
    ensurePhase30SpeakingTask();
    var speechTasks=0;
    Object.keys(LESSON_TASKS||{}).forEach(function(k){(LESSON_TASKS[k]||[]).forEach(function(t){if(taskType(t)==='speaking_practice') speechTasks++;});});
    var support=speechRecognitionSupportStatus();
    var coverage=speakingCoverageSnapshot();
    return {ok:true,phase:'30D',version:VERSION,speakingTasks:speechTasks,a1SpeakingTasks:coverage.speakingTasks,a1TotalTasks:coverage.totalTasks,a1SpeakingCoverage:coverage,microphoneSupported:microphoneSupported(),support:support,hasRecognitionAdapter:typeof startSpeechRecognition==='function',hasSpeakingCard:true,hasSpeakingRenderer:!!TASK_TYPE_REGISTRY.speaking_practice,interimResults:true,maxAlternatives:5,mobileSafeFallback:true,thresholds:{excellent:90,almost:70,partial:40},languages:{de:'de-DE',tr:'tr-TR',en:'en-US/en-GB'},parallelBuildPolicy:{active:true,from:'A2',rule:'Normale Kursaufgaben und speaking_practice-Aufgaben werden künftig pro Niveau zeitgleich ausgebaut.'},privacyNote:speechUiText('privacy')};
  }


  function speechQaSnapshot(){
    var task=createSpeechTask();
    var exact=speechSimilarityDetailed(task,'Guten Morgen','Guten Morgen','de-DE');
    var almost=speechSimilarityDetailed(task,'Guten Morgen','Gute Morgen','de-DE');
    var partial=speechSimilarityDetailed(task,'Guten Morgen','Guten','de-DE');
    var wrong=speechSimilarityDetailed(task,'Guten Morgen','Auto Bahnhof','de-DE');
    var alternatives=bestSpeechAlternative(task,'Guten Morgen',[{transcript:'Auto Bahnhof',confidence:.2},{transcript:'Guten Morgen',confidence:.9},{transcript:'Gute Morgen',confidence:.5}], 'de-DE');
    var turkishNorm=normalizeSpeechText('Günaydın, şeker çay!','tr-TR');
    return {
      ok:true,
      phase:'30C',
      version:VERSION,
      support:speechRecognitionSupportStatus(),
      languageDetection:{de:taskSpeechLang({language:'de'}),tr:taskSpeechLang({language:'tr'}),en:taskSpeechLang({language:'en'})},
      config:{interimResults:true,maxAlternatives:5,continuous:false,statuses:['supported','unsupported','requesting','listening','processing','done','permission_denied','no_speech','start_failed']},
      normalization:{german:normalizeSpeechText('Grüß Gott! ÄÖÜ ß','de-DE'),turkish:turkishNorm},
      scoring:{exact:exact.score,almost:almost.score,partial:partial.score,wrong:wrong.score,bestAlternative:alternatives.score},
      wordFeedback:almost.wordFeedback,
      feedback:{excellent:speechScoreLabel(95,exact),almost:speechScoreLabel(75,almost),partial:speechScoreLabel(55,partial),repeat:speechScoreLabel(20,wrong)},
      fallback:{unsupportedMessage:speechUiText('unsupported'),privacy:speechUiText('privacy')},
      contentCoverage:speakingCoverageSnapshot()
    };
  }

  function phase29QaSnapshot(){
    var taskTypes={};
    var totalTasks=0;
    Object.keys(LESSON_TASKS||{}).forEach(function(k){
      (LESSON_TASKS[k]||[]).forEach(function(t){
        totalTasks++;
        taskTypes[t.type||'unknown']=(taskTypes[t.type||'unknown']||0)+1;
      });
    });
    var a1=((COURSE_TREE&&COURSE_TREE.a1&&COURSE_TREE.a1.lessons)||[]);
    var requiredActions=['language-course-open','language-course-continue','language-course-open-level','language-course-open-lesson','language-course-open-task','language-course-select-answer','language-course-check-answer','language-course-next-task','language-course-task-help','language-course-open-vocabulary','language-course-open-error-training','language-course-open-coach','language-course-sync-push','language-course-sync-pull'];
    var hasMicSpeaking=!!TASK_TYPE_REGISTRY.speaking_practice;
    return {
      ok:true,
      phase:'29',
      version:VERSION,
      levels:LEVELS.length,
      a1Lessons:a1.length,
      totalTasks:totalTasks,
      taskTypes:taskTypes,
      requiredTaskTypes:{multiple_choice:!!taskTypes.multiple_choice,matching:!!taskTypes.matching,fill_blank:!!taskTypes.fill_blank,sentence_order:!!taskTypes.sentence_order,flashcard:!!taskTypes.flashcard,true_false:!!taskTypes.true_false,listening_choice:!!taskTypes.listening_choice},
      coach:coachQaSnapshot(),
      cloudSync:syncStatusLabel(),
      requiredActions:requiredActions,
      hasListeningFoundation:!!taskTypes.listening_choice,
      hasMicrophoneSpeaking:hasMicSpeaking,
      speakingStatus:hasMicSpeaking?'phase30c-a1-speaking-expanded':'not-integrated-yet',
      phase30Speech:phase30SpeechSnapshot(),
      note:'Phase 30C erweitert A1 um Sprechaufgaben in allen 10 Lektionen und behält den 30B-Adapter mit lang de-DE/tr-TR, interimResults, maxAlternatives, Wortfeedback und stabilen Fallbacks bei.'
    };
  }
  function diagnostics(){ensurePhase30SpeakingTask(); return {ok:true,phase:'30D',version:VERSION,visibleEntry:!!document.querySelector('[data-ui-action="language-course-open"]'),dashboardCapable:true,hasTranslation:!!window.LanguageAcademyTranslationEngine,hasStore:!!window.LanguageAcademyLanguageStore,hasHelp:!!window.LanguageAcademyHelpSystem,levels:LEVELS.length,coachQa:coachQaSnapshot(),cloudSync:syncStatusLabel(),phase29Qa:phase29QaSnapshot(),phase30Speech:phase30SpeechSnapshot(),speechQa:speechQaSnapshot(),registered:!!(window.AppModuleHost&&AppModuleHost.listModules&&AppModuleHost.listModules().some(function(m){return m.id==='language-course-entry';}))};}
  ensurePhase30SpeakingTask();
  window.LanguageAcademyCourseEntry=Object.freeze({__version:VERSION,open:openDashboard,openCoach:openCoachPanel,coachInsight:coachInsight,coachRecommendations:coachRecommendationCards,coachReviewSets:coachReviewSets,startCoachRecommendation:startCoachRecommendation,coachQaSnapshot:coachQaSnapshot,openTaskTypeTraining:openTaskTypeTraining,openDashboard:openDashboard,openLevels:openLevels,openLevel:openLevel,openLesson:openLesson,openTask:openTask,openSettings:openSettings,openContinue:openContinue,openRepeatErrors:openRepeatErrors,openVocabulary:openVocabulary,openVocabularyTraining:openVocabularyTraining,openErrorTraining:openErrorTraining,getProgress:getCourseProgress,saveProgress:saveCourseProgress,syncPush:syncPushNow,syncPull:syncPullNow,syncStatus:syncStatusLabel,phase29QaSnapshot:phase29QaSnapshot,phase30SpeechSnapshot:phase30SpeechSnapshot,speechQaSnapshot:speechQaSnapshot,openPlaceholder:openPlaceholderCompat,register:register,diagnostics:diagnostics});
  var lastTouchStamp=0;
  function routeLanguageCourseClick(ev){
    if(ev && ev.type==='click' && lastTouchStamp && Date.now()-lastTouchStamp<420) return false;

    var btn=ev.target&&ev.target.closest&&ev.target.closest('[data-ui-action]'); if(!btn) return false;
    var action=btn.getAttribute('data-ui-action')||'';
    if(action.indexOf('language-course-')!==0) return false;
    if(ev && ev.type==='touchend') lastTouchStamp=Date.now();
    if(btn.getAttribute('aria-disabled')==='true') { ev.preventDefault(); ev.stopPropagation(); return true; }
    if(action==='language-course-open' || action==='language-course-open-dashboard'){ ev.preventDefault(); ev.stopPropagation(); openDashboard(); return true; }
    if(action==='language-course-sync-push'){ ev.preventDefault(); ev.stopPropagation(); syncPushNow(); return true; }
    if(action==='language-course-sync-pull'){ ev.preventDefault(); ev.stopPropagation(); syncPullNow(); return true; }
    if(action==='language-course-open-level'){ ev.preventDefault(); ev.stopPropagation(); openLevel(btn.getAttribute('data-la-level')||'a1'); return true; }
    if(action==='language-course-open-lesson'){ ev.preventDefault(); ev.stopPropagation(); openLesson(btn.getAttribute('data-la-level')||'a1', btn.getAttribute('data-la-lesson')||'a1-greetings'); return true; }
    if(action==='language-course-levels'){ ev.preventDefault(); ev.stopPropagation(); openLevels(); return true; }
    if(action==='language-course-settings'){ ev.preventDefault(); ev.stopPropagation(); openSettings(); return true; }
    if(action==='language-course-continue'){ ev.preventDefault(); ev.stopPropagation(); openContinue(); return true; }
    if(action==='language-course-repeat-errors'){ ev.preventDefault(); ev.stopPropagation(); openRepeatErrors(); return true; }
    if(action==='language-course-open-error-training'){ ev.preventDefault(); ev.stopPropagation(); openErrorTraining(); return true; }
    if(action==='language-course-open-coach'){ ev.preventDefault(); ev.stopPropagation(); openCoachPanel(); return true; }
    if(action==='language-course-coach-start'){ ev.preventDefault(); ev.stopPropagation(); startCoachRecommendation(btn.getAttribute('data-la-coach-action')||''); return true; }
    if(action==='language-course-review-first-error'){ ev.preventDefault(); ev.stopPropagation(); var firstWrong=collectWrongTasks()[0]; if(firstWrong) openTask(firstWrong.level||'a1',firstWrong.lessonId,firstWrong.taskIndex||0); else openErrorTraining(); return true; }
    if(action==='language-course-review-task'){ ev.preventDefault(); ev.stopPropagation(); openTask(btn.getAttribute('data-la-level')||'a1', btn.getAttribute('data-la-lesson')||'a1-greetings', parseInt(btn.getAttribute('data-la-task-index')||'0',10)||0); return true; }
    if(action==='language-course-open-vocabulary'){ ev.preventDefault(); ev.stopPropagation(); openVocabulary(); return true; }
    if(action==='language-course-vocab-start'){ ev.preventDefault(); ev.stopPropagation(); openVocabularyTraining(0); return true; }
    if(action==='language-course-audio-demo'){ ev.preventDefault(); ev.stopPropagation(); speakText('Guten Morgen', 'de-DE'); return true; }
    if(action==='language-course-vocab-known'||action==='language-course-vocab-repeat'||action==='language-course-vocab-next'){
      ev.preventDefault(); ev.stopPropagation(); var vr=btn.closest('[data-la-vocab-index]'); var vi=vr?parseInt(vr.getAttribute('data-la-vocab-index')||'0',10):0; var vid=vr?vr.getAttribute('data-la-vocab-id'):null; if(vid && action!=='language-course-vocab-next') saveVocabularyResult(vid, action==='language-course-vocab-known'?'known':'repeat'); openVocabularyTraining(vi+1); return true;
    }
    if(action==='language-course-open-task'){ ev.preventDefault(); ev.stopPropagation(); openTask(btn.getAttribute('data-la-level')||'a1', btn.getAttribute('data-la-lesson')||'a1-greetings',0); return true; }
    if(action==='language-course-open-listening'){ ev.preventDefault(); ev.stopPropagation(); var ll=btn.getAttribute('data-la-level')||'a1', lid=btn.getAttribute('data-la-lesson')||'a1-greetings'; openTask(ll,lid,firstTaskIndexByType(lid,'listening_choice')); return true; }
    if(action==='language-course-open-speaking'){ ev.preventDefault(); ev.stopPropagation(); var sl=btn.getAttribute('data-la-level')||'a1', sid=btn.getAttribute('data-la-lesson')||'a1-greetings'; openTask(sl,sid,firstTaskIndexByType(sid,'speaking_practice')); return true; }
    if(action==='language-course-mic-check'){ ev.preventDefault(); ev.stopPropagation(); openMicrophoneCheck(); return true; }
    if(action==='language-course-select-answer'||action==='language-course-pick-token'||action==='language-course-reset-tokens'||action==='language-course-match-pick'||action==='language-course-match-toggle'||action==='language-course-flip-card'||action==='language-course-task-help'||action==='language-course-check-answer'||action==='language-course-next-task'||action==='language-course-play-audio'||action==='language-course-start-speaking'){
      ev.preventDefault(); ev.stopPropagation(); handleTaskAction(action,btn); return true;
    }
    return false;
  }
  document.addEventListener('click',routeLanguageCourseClick,true);
  document.addEventListener('touchend',function(ev){ routeLanguageCourseClick(ev); },{capture:true,passive:false});
  document.addEventListener('change',function(ev){var sel=ev.target&&ev.target.closest&&ev.target.closest('[data-la-lang-select]'); if(!sel) return; setLang(sel.getAttribute('data-la-lang-select'), sel.value);});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',register,{once:true}); else register();
})();
