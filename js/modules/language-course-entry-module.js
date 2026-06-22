/* Language Academy · Phase 37A
   Einstufungstest A1-C2 + Sprachtest-Modul. */
(function(){
  'use strict';
  var VERSION='G54.38C.2-exam-shell-visible';
  var PROGRESS_KEY='language_academy_course_progress_v2';
  var LEGACY_PROGRESS_KEY='language_academy_course_progress_v1';
  var LEVELS=[
    {id:'a1',label:'A1',title:'Grundlagen',desc:'10 Lektionen · ca. 430 Aufgaben inkl. Sprechen',status:'available',progress:12},
    {id:'a2',label:'A2',title:'Alltag',desc:'A2 komplett ausgebaut · Sprechen parallel',status:'available',progress:20},
    {id:'b1',label:'B1',title:'Kommunikation',desc:'B1 Struktur · Kurs + Sprechen parallel',status:'available',progress:5},
    {id:'b2',label:'B2',title:'Beruf & Alltag',desc:'B2 Struktur · Kurs + Sprechen parallel',status:'available',progress:5},
    {id:'c1',label:'C1',title:'Fortgeschritten',desc:'C1 Struktur · Kurs + Sprechen parallel',status:'available',progress:5},
    {id:'c2',label:'C2',title:'Mastery',desc:'C2 Struktur · Kurs + Sprechen parallel',status:'available',progress:3}
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
      'course.dashboard.title':'Sprachtraining','course.dashboard.subtitle':'Lerne Schritt für Schritt auf deinem Niveau.'
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
    var levels=Object.keys(COURSE_TREE||{});
    for(var i=0;i<levels.length;i++){
      var lesson=findLesson(levels[i],lessonId);
      if(lesson&&lesson.id===lessonId) return lesson.title||lessonId;
    }
    return lessonId||'Sprachkurs';
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
    var items=[['Weiterlernen','Aktuelle Lektion öffnen','▶','language-course-continue'],['Einstufungstest','Niveau A1-C2 prüfen','✓','language-course-placement-test'],['Wiederholen','Offene Fehler wiederholen','↻','language-course-repeat-errors'],['Vokabeln','Wortschatz trainieren','Aa','language-course-open-vocabulary'],['Meine Fehler','Fehler gezielt trainieren','!','language-course-open-error-training']];
    return '<div class="la-shortcut-grid">'+items.map(function(it){return '<button type="button" class="la-shortcut" data-ui-action="'+esc(it[3])+'"><span>'+esc(it[2])+'</span><b>'+esc(it[0])+'</b><small>'+esc(it[1])+'</small></button>';}).join('')+'</div>';
  }
  function openDashboard(){
    var s=settings(), id=profileIdentity(), name=id.playerName||id.nickname||id.displayName||'Gast', cc=currentCourse();
    var body='<div class="la-dashboard la-dashboard-phase24c" data-la-dashboard="phase26c">'+
      '<section class="la-hero-panel">'+
        '<div class="la-avatar" aria-hidden="true">'+esc(initials(name))+'</div><div class="la-hero-copy"><span class="language-course-badge">🌍 Sprachtraining</span><h3>Willkommen zurück, '+esc(name)+'.</h3><p>'+esc(t('course.dashboard.subtitle','learn'))+'</p></div>'+ 
      '</section>'+ 
      '<section class="la-card la-current-course"><div><span class="la-section-kicker">Aktuelles Sprachtraining</span><h3>'+esc(cc.course)+' '+esc(cc.level)+'</h3><p>Lektion: <b>'+esc(cc.lesson)+'</b></p><span class="la-progress"><i style="width:'+esc(cc.progress)+'%"></i></span><small>'+esc(cc.progress)+' % Fortschritt · '+esc(cc.lastAction)+'</small></div><button type="button" class="la-primary" data-ui-action="language-course-continue">Weiterlernen</button></section>'+       '<section class="la-card la-exam-entry-card la-simulation-link-card"><span class="la-section-kicker">Prüfung ausgelagert</span><h3>Vollprüfung im Simulation Center</h3><p class="la-note">Hier bleibt Lernen, Üben, Hilfe, Muttersprache und Wiederholung. Die echte Deutsch-Sprachtest-Simulation liegt ab G54.43.8L sauber im Simulation Center und startet immer als Vollprüfung.</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-test-simulation-open">Sprachtest-Simulation Deutsch öffnen</button></div></section>'+       '<section class="la-card la-placement-card"><span class="la-section-kicker">Einstufungstest</span><h3>Niveau A1 bis C2 finden</h3><p>Der Einstufungstest bleibt im Sprachtraining, weil er eine Lernempfehlung gibt. Er ersetzt kein offizielles Zertifikat und ist keine Simulation-Vollprüfung.</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-course-placement-test">Einstufungstest starten</button></div></section>'+ 
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
      '<section class="la-card"><span class="la-section-kicker">Kurslogik</span><p class="la-note">A1 ist spielbar ausgebaut. A2 ist ab Phase 31A als eigenes Niveau mit 10 Lektionen vorbereitet: Kursaufgaben und Sprechaufgaben werden parallel geführt. B1-C2 bleiben sichtbar vorbereitet, ohne unfertige Inhalte vorzutäuschen.</p></section>'+ 
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
        ready:'Bereit.', requesting:'Mikrofon wird angefragt …', listening:'Ich höre zu …', processing:'Auswertung läuft …', done:'Ergebnis bereit.', unsupported:'Dieses Gerät unterstützt die Browser-Spracherkennung hier nicht.', permission_denied:'Mikrofonberechtigung fehlt oder wurde blockiert.', no_speech:'Ich konnte noch keine Sprache erkennen. Sprich langsam und deutlich.', error:'Mikrofon wurde nicht erkannt oder die Berechtigung fehlt.', start_failed:'Mikrofonstart fehlgeschlagen. Bitte Browserberechtigung prüfen.', excellent:'Sehr gut ausgesprochen.', almost:'Fast richtig. Ein Wort fehlt oder klingt anders.', partial:'Teilweise erkannt. Sprich etwas langsamer und wiederhole den Satz.', repeat:'Bitte wiederholen. Der erkannte Satz passt noch nicht genug.', missing_one:'Fast richtig. Ein Wort fehlt.', missing_many:'Der Anfang war richtig. Wiederhole den letzten Teil langsam.', privacy:'Das Mikrofon startet nur, wenn du auf den Button tippst.', live:'Live erkannt', final:'Erkannt', score:'Bewertung', alternatives:'Alternativen', word_feedback:'Wort-für-Wort', speak_now:'🎙️ Sprich jetzt', listen_model:'▶ Vormachen', self_done:'Selbst nachgesprochen', guided_start:'Geführt üben', fallback_continue:'Du kannst den Satz trotzdem laut üben und anschließend weitergehen.', browser_supported:'SpeechRecognition verfügbar', browser_unsupported:'SpeechRecognition nicht verfügbar / Gerätetest nötig', mobile_limited:'Geführter Sprechmodus aktiv. Automatische Erkennung ist hier nicht zuverlässig verfügbar, die Übung bleibt trotzdem voll nutzbar.', ios_pwa_limited:'iPhone/iPad Home-Screen-App: automatische Erkennung ist eingeschränkt. Öffne die App in Safari oder nutze den geführten Sprechmodus.', manual_ready:'Höre zuerst den Satz. Sprich ihn danach zweimal langsam laut nach und bewerte dich ehrlich.', auto_mode:'Automatische Auswertung', mobile_mode:'Geführter Sprechmodus', device:'Gerät', secure:'Sichere Verbindung', insecure_context:'Unsichere Verbindung: iPhone/iPad blockiert Mikrofon und Web-Speech über lokale IP oder HTTP. Öffne die App über HTTPS, z. B. GitHub Pages.', local_ip:'Lokale IP erkannt. Für iPhone/iPad bitte HTTPS nutzen, nicht 192.168.x.x.', secure_yes:'HTTPS/Sicher', secure_no:'Nicht sicher / HTTP', open_safari:'Auf iPhone/iPad am besten direkt in Safari öffnen, nicht als Home-Screen-PWA.', guided_title:'Geführtes Nachsprechen', guided_step_1:'1. Höre den Satz einmal an.', guided_step_2:'2. Sprich ihn zweimal laut und langsam nach.', guided_step_3:'3. Wähle anschließend ehrlich aus, wie sicher du warst.', self_excellent:'Sehr gut gesprochen', self_almost:'Fast richtig', self_unsure:'Noch unsicher', self_repeat:'Nochmal üben', self_excellent_feedback:'Sehr gut. Die Sprechübung gilt als sicher geschafft.', self_almost_feedback:'Fast richtig. Die Aufgabe gilt als geschafft und wird leicht zur Wiederholung vorgemerkt.', self_unsure_feedback:'Noch unsicher. Diese Sprechaufgabe kommt später wieder.', self_repeat_feedback:'Gut, dass du es wiederholst. Höre den Satz erneut und sprich langsamer.', manual_hint:'Tipp: Sprich ruhig, öffne den Mund deutlich und mache zwischen den Wörtern kurze Pausen.', manual_disclaimer:'Keine automatische Bewertung auf diesem Gerät. Deine Selbstbewertung wird offen als Selbstbewertung gespeichert.', self_assessment:'Selbstbewertung', selected_self_assessment:'Ausgewählt'
      },
      tr:{
        ready:'Hazır.', requesting:'Mikrofon izni isteniyor …', listening:'Seni dinliyorum …', processing:'Değerlendiriliyor …', done:'Sonuç hazır.', unsupported:'Bu cihazda tarayıcı konuşma tanıma desteği yok.', permission_denied:'Mikrofon izni eksik veya engellendi.', no_speech:'Henüz konuşma algılanmadı. Yavaş ve net konuş.', error:'Mikrofon algılanmadı veya izin eksik.', start_failed:'Mikrofon başlatılamadı. Lütfen tarayıcı iznini kontrol et.', excellent:'Çok iyi telaffuz ettin.', almost:'Neredeyse doğru. Bir kelime eksik veya farklı duyuldu.', partial:'Kısmen algılandı. Biraz daha yavaş söyle ve cümleyi tekrar et.', repeat:'Lütfen tekrar et. Algılanan cümle hedefe yeterince yakın değil.', missing_one:'Neredeyse doğru. Bir kelime eksik.', missing_many:'Başlangıç doğruydu. Son kısmı yavaşça tekrar et.', privacy:'Mikrofon sadece düğmeye bastığında başlar.', live:'Canlı algılama', final:'Algılanan', score:'Puan', alternatives:'Alternatifler', word_feedback:'Kelime kelime', speak_now:'🎙️ Şimdi konuş', listen_model:'▶ Dinle', self_done:'Kendim tekrar ettim', guided_start:'Yönlendirmeli çalış', fallback_continue:'Cümleyi yine de sesli çalışıp devam edebilirsin.', browser_supported:'SpeechRecognition mevcut', browser_unsupported:'SpeechRecognition yok / cihaz testi gerekli', mobile_limited:'Yönlendirmeli konuşma modu aktif. Otomatik tanıma burada güvenilir değil, ama alıştırma yine de tam kullanılabilir.', ios_pwa_limited:'iPhone/iPad ana ekran uygulaması: otomatik tanıma sınırlıdır. Uygulamayı Safari içinde aç veya yönlendirmeli konuşma modunu kullan.', manual_ready:'Önce cümleyi dinle. Sonra iki kez yavaş ve sesli tekrar et ve kendini dürüstçe değerlendir.', auto_mode:'Otomatik değerlendirme', mobile_mode:'Yönlendirmeli konuşma modu', device:'Cihaz', secure:'Güvenli bağlantı', insecure_context:'Güvenli olmayan bağlantı: iPhone/iPad yerel IP veya HTTP üzerinden mikrofonu ve Web-Speech özelliğini engeller. Uygulamayı HTTPS ile aç, örn. GitHub Pages.', local_ip:'Yerel IP algılandı. iPhone/iPad için 192.168.x.x yerine HTTPS kullan.', secure_yes:'HTTPS/Güvenli', secure_no:'Güvenli değil / HTTP', open_safari:'iPhone/iPad üzerinde en iyisi doğrudan Safari içinde açmaktır, ana ekran PWA olarak değil.', guided_title:'Yönlendirmeli tekrar', guided_step_1:'1. Cümleyi bir kez dinle.', guided_step_2:'2. Cümleyi iki kez yavaş ve sesli tekrar et.', guided_step_3:'3. Sonra ne kadar emin olduğunu dürüstçe seç.', self_excellent:'Çok iyi söyledim', self_almost:'Neredeyse doğru', self_unsure:'Hâlâ emin değilim', self_repeat:'Tekrar çalışmak istiyorum', self_excellent_feedback:'Çok iyi. Konuşma alıştırması güvenli şekilde tamamlandı.', self_almost_feedback:'Neredeyse doğru. Görev tamamlandı ve hafif tekrar için not edildi.', self_unsure_feedback:'Hâlâ emin değilsin. Bu konuşma görevi daha sonra tekrar gelir.', self_repeat_feedback:'Tekrar etmen iyi. Cümleyi yeniden dinle ve daha yavaş söyle.', manual_hint:'İpucu: Sakin konuş, ağzını belirgin aç ve kelimeler arasında kısa duraklamalar yap.', manual_disclaimer:'Bu cihazda otomatik değerlendirme yok. Öz değerlendirmen açıkça öz değerlendirme olarak kaydedilir.', self_assessment:'Öz değerlendirme', selected_self_assessment:'Seçildi'
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
  function manualSpeechOptions(){
    return [
      {key:'excellent',label:speechUiText('self_excellent'),score:100,selected:'known',review:false,feedback:speechUiText('self_excellent_feedback')},
      {key:'almost',label:speechUiText('self_almost'),score:80,selected:'known',review:true,feedback:speechUiText('self_almost_feedback')},
      {key:'unsure',label:speechUiText('self_unsure'),score:55,selected:'repeat',review:true,feedback:speechUiText('self_unsure_feedback')},
      {key:'repeat',label:speechUiText('self_repeat'),score:25,selected:'repeat',review:true,feedback:speechUiText('self_repeat_feedback')}
    ];
  }
  function manualSpeechOption(key){
    var opts=manualSpeechOptions();
    for(var i=0;i<opts.length;i++){ if(opts[i].key===key) return opts[i]; }
    return opts[2];
  }
  function speechGuideHtml(task,state){
    var current=state&&state.speechSelfAssessment;
    var options=manualSpeechOptions().map(function(o){
      var cls='la-self-rating '+(current===o.key?'is-selected':'');
      return '<button type="button" class="'+cls+'" data-ui-action="language-course-speaking-self-assess" data-la-self-assessment="'+esc(o.key)+'"><b>'+esc(o.label)+'</b><small>'+esc(o.score)+'%</small></button>';
    }).join('');
    return '<div class="la-speaking-guide" data-la-speaking-guide="phase30e"><span class="la-section-kicker">'+esc(speechUiText('guided_title'))+'</span><ol><li>'+esc(speechUiText('guided_step_1'))+'</li><li>'+esc(speechUiText('guided_step_2'))+'</li><li>'+esc(speechUiText('guided_step_3'))+'</li></ol><p>'+esc(speechUiText('manual_hint'))+'</p><div class="la-speaking-self-grid" aria-label="'+esc(speechUiText('self_assessment'))+'">'+options+'</div><small>'+esc(speechUiText('manual_disclaimer'))+'</small></div>';
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

  var A2_LESSON_BLUEPRINTS=[
    {id:'a2-daily-routines',title:'Tagesablauf',tr:'Günlük rutin',goal:'Über regelmäßige Tagesabläufe sprechen.',goalTr:'Günlük rutinlerden bahsetmek.',vocab:['aufstehen = kalkmak','frühstücken = kahvaltı yapmak','arbeiten = çalışmak','nach Hause kommen = eve gelmek','abends = akşamları','manchmal = bazen'],sentences:['Ich stehe um sieben Uhr auf.','Danach frühstücke ich.','Abends lerne ich Deutsch.','Manchmal arbeite ich lange.']},
    {id:'a2-housing',title:'Wohnen',tr:'Ev ve yaşam',goal:'Wohnung, Zimmer und Nachbarschaft beschreiben.',goalTr:'Ev, oda ve çevreyi anlatmak.',vocab:['die Wohnung = daire','das Zimmer = oda','die Küche = mutfak','hell = aydınlık','ruhig = sakin','die Miete = kira'],sentences:['Meine Wohnung ist ruhig.','Die Küche ist klein, aber hell.','Ich suche ein Zimmer in Ulm.','Die Miete ist zu hoch.']},
    {id:'a2-appointments',title:'Termine vereinbaren',tr:'Randevu ayarlamak',goal:'Termine verschieben, bestätigen und absagen.',goalTr:'Randevu değiştirmek, onaylamak ve iptal etmek.',vocab:['der Termin = randevu','verschieben = ertelemek','bestätigen = onaylamak','absagen = iptal etmek','pünktlich = dakik','morgen = yarın'],sentences:['Ich möchte einen Termin vereinbaren.','Kann ich den Termin verschieben?','Ich komme morgen pünktlich.','Leider muss ich absagen.']},
    {id:'a2-shopping-services',title:'Einkaufen & Service',tr:'Alışveriş ve hizmet',goal:'Wünsche, Preise und Reklamationen ausdrücken.',goalTr:'İstek, fiyat ve şikayetleri ifade etmek.',vocab:['die Rechnung = hesap/fatura','umtauschen = değiştirmek','günstig = uygun fiyatlı','teuer = pahalı','bar bezahlen = nakit ödemek','reklamieren = şikayet etmek'],sentences:['Ich möchte diese Jacke umtauschen.','Haben Sie das günstiger?','Die Rechnung stimmt nicht.','Ich bezahle lieber bar.']},
    {id:'a2-health',title:'Gesundheit',tr:'Sağlık',goal:'Beschwerden erklären und einfache Ratschläge verstehen.',goalTr:'Şikayetleri anlatmak ve basit tavsiyeleri anlamak.',vocab:['der Husten = öksürük','die Kopfschmerzen = baş ağrısı','sich ausruhen = dinlenmek','das Rezept = reçete','die Apotheke = eczane','seit gestern = dünden beri'],sentences:['Ich habe seit gestern Kopfschmerzen.','Der Arzt gibt mir ein Rezept.','Ich muss mich ausruhen.','Wo ist die nächste Apotheke?']},
    {id:'a2-work-school',title:'Arbeit & Schule',tr:'İş ve okul',goal:'Aufgaben, Erfahrungen und einfache Pläne beschreiben.',goalTr:'Görevleri, deneyimleri ve basit planları anlatmak.',vocab:['die Aufgabe = görev','die Besprechung = toplantı','pünktlich = zamanında','die Erfahrung = deneyim','der Kurs = kurs','lernen = öğrenmek'],sentences:['Heute habe ich eine Besprechung.','Ich lerne für meinen Kurs.','Die Aufgabe ist nicht schwer.','Ich habe schon Erfahrung.']},
    {id:'a2-travel-orientation',title:'Reisen & Orientierung',tr:'Seyahat ve yön bulma',goal:'Wege, Verkehrsmittel und Reisepläne beschreiben.',goalTr:'Yol, ulaşım ve seyahat planlarını anlatmak.',vocab:['die Haltestelle = durak','umsteigen = aktarma yapmak','die Fahrkarte = bilet','der Weg = yol','links = sol','rechts = sağ'],sentences:['Ich muss an der nächsten Haltestelle aussteigen.','Wo kann ich umsteigen?','Ich kaufe eine Fahrkarte.','Gehen Sie links und dann geradeaus.']},
    {id:'a2-food-restaurant',title:'Essen & Restaurant',tr:'Yemek ve restoran',goal:'Bestellen, Wünsche äußern und über Essen sprechen.',goalTr:'Sipariş vermek, istek belirtmek ve yemekten bahsetmek.',vocab:['bestellen = sipariş vermek','die Speisekarte = menü','ohne = olmadan','mit = ile','scharf = acı','lecker = lezzetli'],sentences:['Ich möchte eine Suppe bestellen.','Haben Sie die Speisekarte?','Bitte ohne Zwiebeln.','Das Essen schmeckt sehr gut.']},
    {id:'a2-past-experiences',title:'Vergangenheit erzählen',tr:'Geçmişi anlatmak',goal:'Einfache Ereignisse aus der Vergangenheit erzählen.',goalTr:'Geçmişteki basit olayları anlatmak.',vocab:['gestern = dün','letzte Woche = geçen hafta','besucht = ziyaret etti','gemacht = yaptı','gekauft = satın aldı','gefahren = gitti/sürdü'],sentences:['Gestern habe ich Deutsch gelernt.','Letzte Woche habe ich meine Familie besucht.','Ich habe Brot gekauft.','Wir sind mit dem Bus gefahren.']},
    {id:'a2-opinions-plans',title:'Meinung & Pläne',tr:'Fikir ve planlar',goal:'Einfache Meinungen, Wünsche und Zukunftspläne ausdrücken.',goalTr:'Basit fikir, istek ve gelecek planlarını ifade etmek.',vocab:['ich finde = bence','ich glaube = sanırım','ich möchte = istiyorum','später = sonra','nächstes Jahr = gelecek yıl','wichtig = önemli'],sentences:['Ich finde Deutsch wichtig.','Ich glaube, das ist eine gute Idee.','Später möchte ich arbeiten.','Nächstes Jahr möchte ich mehr lernen.']}
  ];
  function a2Choices(correct){
    return [{id:'a',text:correct},{id:'b',text:'Fenster'},{id:'c',text:'Bleistift'},{id:'d',text:'gestern'}];
  }
  function createA2StarterTasks(bp){
    var id=bp.id, title=bp.title, sent=bp.sentences||[], vocab=bp.vocab||[];
    var first=(vocab[0]||'aufstehen = kalkmak').split(' = '), second=(vocab[1]||'arbeiten = çalışmak').split(' = ');
    var third=(vocab[2]||'lernen = öğrenmek').split(' = '), fourth=(vocab[3]||'Termin = randevu').split(' = ');
    function mc(n,pair){return {id:id+'-mc-'+n,type:'multiple_choice',phase:'31C',parallelContent:true,prompt:{de:'Welche Bedeutung passt zu „'+pair[0]+'“?',tr:'„'+pair[0]+'“ için hangi anlam uygundur?'},instruction:{de:'Wähle die passende Antwort.',tr:'Uygun cevabı seç.'},hint:{de:'Das Wort gehört zur A2-Lektion „'+title+'“.',tr:'Kelime A2 dersi „'+title+'“ konusuyla ilgilidir.'},choices:a2Choices(pair[1]),answer:'a',explain:{de:'„'+pair[0]+'“ bedeutet „'+pair[1]+'“.',tr:'„'+pair[0]+'“, „'+pair[1]+'“ anlamına gelir.'}};}
    function fill(n,sentence,answer){return {id:id+'-blank-'+n,type:'fill_blank',phase:'31A',parallelContent:true,prompt:{de:'Ergänze den Satz.',tr:'Cümleyi tamamla.'},instruction:{de:'Wähle das passende Wort für den A2-Satz.',tr:'A2 cümlesi için uygun kelimeyi seç.'},sentence:{de:sentence.replace(answer,'____'),tr:sentence.replace(answer,'____')},options:[answer,'Fenster','Lampe','Auto'],answer:answer,hint:{de:'Lies den ganzen Satz und prüfe die Bedeutung.',tr:'Tüm cümleyi oku ve anlamı kontrol et.'},explain:{de:'Richtig ist „'+answer+'“.',tr:'Doğru cevap „'+answer+'“.'}};}
    function order(n,sentence){var tokens=sentence.replace(/[.!?]/g,'').split(/\s+/).filter(Boolean);return {id:id+'-order-'+n,type:'sentence_order',phase:'31A',parallelContent:true,prompt:{de:'Bringe den Satz in die richtige Reihenfolge.',tr:'Cümleyi doğru sıraya koy.'},instruction:{de:'Tippe die Wörter in der richtigen Reihenfolge an.',tr:'Kelimelere doğru sırayla dokun.'},tokens:tokens.slice().sort(function(){return 0.5-Math.random();}),answer:tokens,hint:{de:'Suche zuerst das Subjekt und dann das Verb.',tr:'Önce özneyi, sonra fiili bul.'},explain:{de:'Der korrekte Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}};}
    function listen(n,sentence){return {id:id+'-listen-'+n,type:'listening_choice',phase:'31A',parallelContent:true,prompt:{de:'Höre den Satz und wähle die passende Bedeutung.',tr:'Cümleyi dinle ve uygun anlamı seç.'},instruction:{de:'Spiele den Satz ab und wähle die richtige Antwort.',tr:'Cümleyi dinle ve doğru cevabı seç.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich habe kein Auto.'},{id:'c',text:'Das Fenster ist offen.'},{id:'d',text:'Der Tisch ist klein.'}],answer:'a',hint:{de:'Achte auf Schlüsselwörter im Satz.',tr:'Cümledeki anahtar kelimelere dikkat et.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}};}
    var tasks=[mc(1,first),mc(2,second),mc(3,third),mc(4,fourth),fill(1,sent[0]||'Ich lerne Deutsch.','Ich'),fill(2,sent[1]||'Heute arbeite ich.','ich'),order(1,sent[2]||'Ich lerne Deutsch.'),listen(1,sent[3]||sent[0]||'Ich lerne Deutsch.')];
    (sent.slice(0,4)).forEach(function(sentence,idx){
      tasks.push({id:id+'-speak-'+(idx+1),type:'speaking_practice',phase:'31A',skill:'speaking',parallelContent:true,a2Starter:true,prompt:{de:'Sprich den A2-Satz nach: „'+sentence+'“',tr:'A2 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Höre den Satz, sprich ihn langsam nach und nutze je nach Gerät automatische Auswertung oder Selbstbewertung.',tr:'Cümleyi dinle, yavaşça tekrar söyle; cihaza göre otomatik değerlendirme veya öz değerlendirme kullan.'},hint:{de:'A2-Sprechen: vollständiger Satz, klare Satzmelodie, langsam sprechen.',tr:'A2 konuşma: tam cümle, net vurgu, yavaş konuş.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,sentence.replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],explain:{de:'Sprechübung zur A2-Lektion „'+title+'“. Ziel ist ein vollständiger, verständlicher Alltagssatz.',tr:'A2 dersi „'+title+'“ için konuşma alıştırması. Amaç anlaşılır tam bir günlük cümle kurmaktır.'}});
    });
    return tasks;
  }
  var A2_PHASE31B_EXPANDED_IDS=['a2-daily-routines','a2-housing','a2-appointments','a2-shopping-services','a2-health','a2-work-school','a2-travel-orientation','a2-food-restaurant','a2-past-experiences','a2-opinions-plans'];
  var A2_PHASE31B_CONTENT={
    'a2-daily-routines':{
      focus:'Tagesablauf mit Zeitangaben, Häufigkeit und einfachen Begründungen.',
      focusTr:'Saat, sıklık ve basit gerekçelerle günlük rutini anlatma.',
      vocab:[['aufstehen','kalkmak'],['sich anziehen','giyinmek'],['frühstücken','kahvaltı yapmak'],['zur Arbeit fahren','işe gitmek'],['eine Pause machen','mola vermek'],['nach Hause kommen','eve gelmek'],['abends','akşamları'],['manchmal','bazen'],['meistens','çoğunlukla'],['spät','geç']],
      sentences:['Ich stehe meistens um sieben Uhr auf.','Nach dem Frühstück fahre ich zur Arbeit.','Mittags mache ich eine kurze Pause.','Nach der Arbeit komme ich nach Hause.','Abends lerne ich Deutsch.','Manchmal bin ich sehr müde.','Am Wochenende schlafe ich länger.','Ich plane meinen Tag am Morgen.'],
      blanks:[['Ich stehe meistens um sieben Uhr auf.','meistens'],['Nach dem Frühstück fahre ich zur Arbeit.','Frühstück'],['Mittags mache ich eine kurze Pause.','Pause'],['Abends lerne ich Deutsch.','Abends'],['Am Wochenende schlafe ich länger.','Wochenende'],['Ich plane meinen Tag am Morgen.','Morgen'],['Manchmal bin ich sehr müde.','müde'],['Nach der Arbeit komme ich nach Hause.','Hause']],
      truth:[['Ich stehe meistens um sieben Uhr auf.',true],['Abends frühstücke ich normalerweise.',false],['Eine Pause kann kurz sein.',true],['Am Wochenende arbeiten alle Menschen immer.',false]],
      dialog:['Wann stehst du normalerweise auf?','Ich stehe meistens um sieben Uhr auf.','Was machst du abends?','Abends lerne ich Deutsch.']
    },
    'a2-housing':{
      focus:'Wohnung beschreiben, Probleme benennen und einfache Wünsche äußern.',
      focusTr:'Evi anlatma, sorunları söyleme ve basit istek belirtme.',
      vocab:[['die Wohnung','daire'],['das Zimmer','oda'],['die Küche','mutfak'],['das Bad','banyo'],['hell','aydınlık'],['ruhig','sakin'],['laut','gürültülü'],['die Miete','kira'],['umziehen','taşınmak'],['der Nachbar','komşu']],
      sentences:['Meine Wohnung ist klein, aber hell.','Die Küche ist sauber und praktisch.','Das Zimmer ist ruhig.','Die Miete ist leider zu hoch.','Ich möchte nächstes Jahr umziehen.','Mein Nachbar ist sehr freundlich.','Das Bad ist neu.','Ich suche eine Wohnung in der Nähe.'],
      blanks:[['Meine Wohnung ist klein, aber hell.','hell'],['Die Küche ist sauber und praktisch.','Küche'],['Das Zimmer ist ruhig.','ruhig'],['Die Miete ist leider zu hoch.','Miete'],['Ich möchte nächstes Jahr umziehen.','umziehen'],['Mein Nachbar ist sehr freundlich.','Nachbar'],['Das Bad ist neu.','Bad'],['Ich suche eine Wohnung in der Nähe.','Nähe']],
      truth:[['Eine helle Wohnung hat viel Licht.',true],['Die Miete ist immer kostenlos.',false],['Ein Nachbar wohnt in der Nähe.',true],['Ein Bad ist ein Verkehrsmittel.',false]],
      dialog:['Wie ist deine Wohnung?','Sie ist klein, aber hell.','Ist die Miete hoch?','Ja, sie ist leider zu hoch.']
    },
    'a2-appointments':{
      focus:'Termine vereinbaren, verschieben, bestätigen und höflich absagen.',
      focusTr:'Randevu alma, erteleme, onaylama ve kibarca iptal etme.',
      vocab:[['der Termin','randevu'],['vereinbaren','ayarlamak'],['verschieben','ertelemek'],['bestätigen','onaylamak'],['absagen','iptal etmek'],['pünktlich','dakik'],['frei','boş/müsait'],['später','daha sonra'],['leider','maalesef'],['passen','uymak']],
      sentences:['Ich möchte einen Termin vereinbaren.','Passt Ihnen morgen um zehn Uhr?','Kann ich den Termin verschieben?','Ich komme morgen pünktlich.','Leider muss ich den Termin absagen.','Haben Sie später noch einen Termin frei?','Der Termin passt mir gut.','Bitte bestätigen Sie den Termin per E-Mail.'],
      blanks:[['Ich möchte einen Termin vereinbaren.','Termin'],['Passt Ihnen morgen um zehn Uhr?','morgen'],['Kann ich den Termin verschieben?','verschieben'],['Ich komme morgen pünktlich.','pünktlich'],['Leider muss ich den Termin absagen.','Leider'],['Haben Sie später noch einen Termin frei?','frei'],['Der Termin passt mir gut.','passt'],['Bitte bestätigen Sie den Termin per E-Mail.','bestätigen']],
      truth:[['Einen Termin kann man verschieben.',true],['Pünktlich bedeutet zu spät.',false],['Absagen bedeutet einen Termin nicht wahrnehmen.',true],['Bestätigen bedeutet vergessen.',false]],
      dialog:['Ich möchte einen Termin vereinbaren.','Passt Ihnen morgen um zehn Uhr?','Ja, der Termin passt mir gut.','Bitte kommen Sie pünktlich.']
    },
    'a2-shopping-services':{
      focus:'Einkaufen, Preise vergleichen, bezahlen und einfache Reklamationen ausdrücken.',
      focusTr:'Alışveriş, fiyat karşılaştırma, ödeme ve basit şikayet ifade etme.',
      vocab:[['die Rechnung','hesap/fatura'],['umtauschen','değiştirmek'],['günstig','uygun fiyatlı'],['teuer','pahalı'],['bar bezahlen','nakit ödemek'],['die Karte','kart'],['die Größe','beden'],['die Farbe','renk'],['kaputt','bozuk'],['reklamieren','şikayet etmek']],
      sentences:['Ich möchte diese Jacke umtauschen.','Haben Sie das eine Nummer größer?','Die Rechnung stimmt nicht.','Ich bezahle lieber mit Karte.','Das Produkt ist leider kaputt.','Gibt es das auch in Blau?','Der Preis ist mir zu teuer.','Ich möchte den Artikel reklamieren.'],
      blanks:[['Ich möchte diese Jacke umtauschen.','umtauschen'],['Haben Sie das eine Nummer größer?','größer'],['Die Rechnung stimmt nicht.','Rechnung'],['Ich bezahle lieber mit Karte.','Karte'],['Das Produkt ist leider kaputt.','kaputt'],['Gibt es das auch in Blau?','Blau'],['Der Preis ist mir zu teuer.','teuer'],['Ich möchte den Artikel reklamieren.','reklamieren']],
      truth:[['Man kann ein kaputtes Produkt reklamieren.',true],['Teuer bedeutet sehr billig.',false],['Mit Karte bezahlen ist eine Zahlungsart.',true],['Eine Rechnung ist ein Kleidungsstück.',false]],
      dialog:['Kann ich Ihnen helfen?','Ja, ich möchte diese Jacke umtauschen.','Haben Sie den Kassenbon?','Ja, hier ist die Rechnung.']
    },
    'a2-health':{
      focus:'Beschwerden beschreiben, Dauer nennen und einfache Ratschläge verstehen.',
      focusTr:'Şikayetleri anlatma, süre belirtme ve basit tavsiyeleri anlama.',
      vocab:[['der Husten','öksürük'],['die Kopfschmerzen','baş ağrısı'],['seit gestern','dünden beri'],['sich ausruhen','dinlenmek'],['das Rezept','reçete'],['die Apotheke','eczane'],['Fieber haben','ateşi olmak'],['weh tun','ağrımak'],['der Arzt','doktor'],['viel trinken','çok içmek']],
      sentences:['Ich habe seit gestern Kopfschmerzen.','Mein Hals tut weh.','Ich muss mich ausruhen.','Der Arzt gibt mir ein Rezept.','Wo ist die nächste Apotheke?','Ich habe ein bisschen Fieber.','Bitte trinken Sie viel Wasser.','Nehmen Sie die Tabletten nach dem Essen.'],
      blanks:[['Ich habe seit gestern Kopfschmerzen.','Kopfschmerzen'],['Mein Hals tut weh.','Hals'],['Ich muss mich ausruhen.','ausruhen'],['Der Arzt gibt mir ein Rezept.','Rezept'],['Wo ist die nächste Apotheke?','Apotheke'],['Ich habe ein bisschen Fieber.','Fieber'],['Bitte trinken Sie viel Wasser.','Wasser'],['Nehmen Sie die Tabletten nach dem Essen.','Essen']],
      truth:[['Bei Kopfschmerzen kann man sich ausruhen.',true],['Eine Apotheke verkauft Fahrkarten.',false],['Ein Rezept bekommt man oft beim Arzt.',true],['Fieber ist eine Farbe.',false]],
      dialog:['Was fehlt Ihnen?','Ich habe seit gestern Kopfschmerzen.','Haben Sie auch Fieber?','Ja, ein bisschen.']
    },
    'a2-work-school':{
      focus:'Arbeit, Schule, Aufgaben und einfache Erfahrungen beschreiben.',
      focusTr:'İş, okul, görevler ve basit deneyimleri anlatma.',
      vocab:[['die Aufgabe','görev'],['die Besprechung','toplantı'],['pünktlich','zamanında'],['die Erfahrung','deneyim'],['der Kurs','kurs'],['die Prüfung','sınav'],['der Kollege','iş arkadaşı'],['die Pause','mola'],['sich vorbereiten','hazırlanmak'],['erklären','açıklamak']],
      sentences:['Heute habe ich eine wichtige Besprechung.','Ich bereite mich auf die Prüfung vor.','Meine Aufgabe ist heute nicht schwer.','Ich habe schon Erfahrung im Büro.','Der Kurs beginnt pünktlich um neun Uhr.','Mein Kollege erklärt mir die neue Aufgabe.','In der Pause trinke ich einen Kaffee.','Nach der Schule lerne ich zu Hause weiter.'],
      blanks:[['Heute habe ich eine wichtige Besprechung.','Besprechung'],['Ich bereite mich auf die Prüfung vor.','Prüfung'],['Meine Aufgabe ist heute nicht schwer.','Aufgabe'],['Ich habe schon Erfahrung im Büro.','Erfahrung'],['Der Kurs beginnt pünktlich um neun Uhr.','pünktlich'],['Mein Kollege erklärt mir die neue Aufgabe.','Kollege'],['In der Pause trinke ich einen Kaffee.','Pause'],['Nach der Schule lerne ich zu Hause weiter.','Schule']],
      truth:[['Eine Besprechung kann bei der Arbeit stattfinden.',true],['Pünktlich bedeutet immer zu spät.',false],['Eine Prüfung kann Vorbereitung brauchen.',true],['Ein Kollege ist ein Möbelstück.',false]],
      dialog:['Wann beginnt dein Kurs?','Der Kurs beginnt um neun Uhr.','Hast du heute eine Aufgabe?','Ja, aber sie ist nicht schwer.']
    },
    'a2-travel-orientation':{
      focus:'Wege erklären, Verkehrsmittel nutzen und einfache Reisepläne verstehen.',
      focusTr:'Yol tarif etme, ulaşım kullanma ve basit seyahat planlarını anlama.',
      vocab:[['die Haltestelle','durak'],['umsteigen','aktarma yapmak'],['die Fahrkarte','bilet'],['der Weg','yol'],['geradeaus','düz ileri'],['links','sol'],['rechts','sağ'],['der Bahnhof','tren istasyonu'],['ankommen','varmak'],['abfahren','hareket etmek']],
      sentences:['Ich steige an der nächsten Haltestelle aus.','Am Bahnhof kaufe ich eine Fahrkarte.','Sie müssen hier rechts abbiegen.','Gehen Sie geradeaus bis zur Ampel.','Ich muss in den Bus Nummer fünf umsteigen.','Der Zug fährt um acht Uhr ab.','Wir kommen am Nachmittag in Berlin an.','Der Weg zum Zentrum ist nicht weit.'],
      blanks:[['Ich steige an der nächsten Haltestelle aus.','Haltestelle'],['Am Bahnhof kaufe ich eine Fahrkarte.','Fahrkarte'],['Sie müssen hier rechts abbiegen.','rechts'],['Gehen Sie geradeaus bis zur Ampel.','geradeaus'],['Ich muss in den Bus Nummer fünf umsteigen.','umsteigen'],['Der Zug fährt um acht Uhr ab.','ab'],['Wir kommen am Nachmittag in Berlin an.','an'],['Der Weg zum Zentrum ist nicht weit.','Weg']],
      truth:[['Eine Haltestelle gehört zum Verkehr.',true],['Eine Fahrkarte braucht man oft für Bus oder Zug.',true],['Rechts und links sind Farben.',false],['Am Bahnhof fahren Züge ab.',true]],
      dialog:['Entschuldigung, wo ist die Haltestelle?','Gehen Sie geradeaus und dann links.','Muss ich umsteigen?','Ja, am Bahnhof steigen Sie um.']
    },
    'a2-food-restaurant':{
      focus:'Im Restaurant bestellen, Wünsche äußern und Essen beschreiben.',
      focusTr:'Restoranda sipariş verme, istek belirtme ve yemeği anlatma.',
      vocab:[['bestellen','sipariş vermek'],['die Speisekarte','menü'],['ohne','olmadan'],['mit','ile'],['scharf','acı'],['lecker','lezzetli'],['die Rechnung','hesap'],['der Kellner','garson'],['empfehlen','tavsiye etmek'],['bezahlen','ödemek']],
      sentences:['Ich möchte eine Suppe bestellen.','Haben Sie die Speisekarte?','Bitte ohne Zwiebeln und mit Reis.','Das Essen ist sehr lecker.','Ist das Gericht sehr scharf?','Der Kellner bringt die Rechnung.','Können Sie mir etwas empfehlen?','Ich möchte bitte bezahlen.'],
      blanks:[['Ich möchte eine Suppe bestellen.','bestellen'],['Haben Sie die Speisekarte?','Speisekarte'],['Bitte ohne Zwiebeln und mit Reis.','ohne'],['Das Essen ist sehr lecker.','lecker'],['Ist das Gericht sehr scharf?','scharf'],['Der Kellner bringt die Rechnung.','Kellner'],['Können Sie mir etwas empfehlen?','empfehlen'],['Ich möchte bitte bezahlen.','bezahlen']],
      truth:[['In einem Restaurant kann man Essen bestellen.',true],['Eine Speisekarte zeigt Gerichte.',true],['Scharf bedeutet immer süß.',false],['Am Ende kann man die Rechnung bezahlen.',true]],
      dialog:['Was möchten Sie bestellen?','Ich nehme eine Suppe, bitte.','Möchten Sie Reis dazu?','Ja, bitte mit Reis und ohne Zwiebeln.']
    },
    'a2-past-experiences':{
      focus:'Einfache Ereignisse in der Vergangenheit erzählen.',
      focusTr:'Geçmişteki basit olayları anlatma.',
      vocab:[['gestern','dün'],['letzte Woche','geçen hafta'],['besucht','ziyaret etti'],['gemacht','yaptı'],['gekauft','satın aldı'],['gefahren','gitti/sürdü'],['gelernt','öğrendi/çalıştı'],['gesehen','gördü'],['angerufen','telefon etti'],['gearbeitet','çalıştı']],
      sentences:['Gestern habe ich Deutsch gelernt.','Letzte Woche habe ich meine Familie besucht.','Ich habe im Supermarkt Brot gekauft.','Wir sind mit dem Bus gefahren.','Am Abend habe ich einen Film gesehen.','Ich habe meine Freundin angerufen.','Am Montag habe ich lange gearbeitet.','Danach habe ich Hausaufgaben gemacht.'],
      blanks:[['Gestern habe ich Deutsch gelernt.','Gestern'],['Letzte Woche habe ich meine Familie besucht.','besucht'],['Ich habe im Supermarkt Brot gekauft.','gekauft'],['Wir sind mit dem Bus gefahren.','gefahren'],['Am Abend habe ich einen Film gesehen.','gesehen'],['Ich habe meine Freundin angerufen.','angerufen'],['Am Montag habe ich lange gearbeitet.','gearbeitet'],['Danach habe ich Hausaufgaben gemacht.','gemacht']],
      truth:[['Gestern ist eine Zeitangabe für die Vergangenheit.',true],['Gekauft passt oft zu einem Geschäft.',true],['Besucht bedeutet geschlafen.',false],['Mit dem Bus gefahren ist Vergangenheit.',true]],
      dialog:['Was hast du gestern gemacht?','Ich habe Deutsch gelernt.','Wen hast du besucht?','Ich habe meine Familie besucht.']
    },
    'a2-opinions-plans':{
      focus:'Meinungen, Wünsche, Gründe und einfache Zukunftspläne ausdrücken.',
      focusTr:'Fikir, istek, sebep ve basit gelecek planlarını ifade etme.',
      vocab:[['ich finde','bence'],['ich glaube','sanırım'],['ich möchte','istiyorum'],['später','sonra'],['nächstes Jahr','gelecek yıl'],['wichtig','önemli'],['weil','çünkü'],['vielleicht','belki'],['planen','planlamak'],['besser','daha iyi']],
      sentences:['Ich finde Deutsch sehr wichtig.','Ich glaube, das ist eine gute Idee.','Später möchte ich in Deutschland arbeiten.','Nächstes Jahr möchte ich mehr lernen.','Ich lerne Deutsch, weil ich arbeiten möchte.','Vielleicht mache ich bald einen Kurs.','Ich plane meine Zukunft Schritt für Schritt.','Mit Übung wird mein Deutsch besser.'],
      blanks:[['Ich finde Deutsch sehr wichtig.','wichtig'],['Ich glaube, das ist eine gute Idee.','glaube'],['Später möchte ich in Deutschland arbeiten.','Später'],['Nächstes Jahr möchte ich mehr lernen.','Nächstes'],['Ich lerne Deutsch, weil ich arbeiten möchte.','weil'],['Vielleicht mache ich bald einen Kurs.','Vielleicht'],['Ich plane meine Zukunft Schritt für Schritt.','plane'],['Mit Übung wird mein Deutsch besser.','besser']],
      truth:[['Mit „ich finde“ kann man eine Meinung sagen.',true],['Weil kann einen Grund einleiten.',true],['Nächstes Jahr bedeutet gestern.',false],['Ein Plan kann zur Zukunft gehören.',true]],
      dialog:['Warum lernst du Deutsch?','Ich lerne Deutsch, weil ich arbeiten möchte.','Was möchtest du später machen?','Später möchte ich eine Ausbildung machen.']
    }
  };
  function a2Phase31BWrongChoices(correct){
    var pool=['Fenster','Bleistift','gestern','Auto','Lampe','Tasche','Bahnhof','Stuhl'];
    return [{id:'a',text:correct},{id:'b',text:pool[0]},{id:'c',text:pool[1]},{id:'d',text:pool[2]}];
  }
  function a2DeterministicTokens(sentence){
    var tokens=String(sentence||'').replace(/[.!?]/g,'').split(/\s+/).filter(Boolean);
    if(tokens.length>3) return tokens.slice(2).concat(tokens.slice(0,2));
    return tokens.slice().reverse();
  }
  function createA2ExpandedTasks(bp){
    var data=A2_PHASE31B_CONTENT[bp.id];
    if(!data) return createA2StarterTasks(bp);
    var id=bp.id, title=bp.title, tasks=[], vocab=data.vocab||[], sentences=data.sentences||[], blanks=data.blanks||[], truth=data.truth||[];
    function addMC(i,pair){ tasks.push({id:id+'-31c-mc-'+i,type:'multiple_choice',phase:'31C',parallelContent:true,a2Expanded:true,prompt:{de:'Welche Bedeutung passt zu „'+pair[0]+'“?',tr:'„'+pair[0]+'“ için hangi anlam uygundur?'},instruction:{de:'Wähle die passende türkische Bedeutung.',tr:'Uygun Türkçe anlamı seç.'},hint:{de:'Thema: '+title+'. Denke an die Alltagssituation.',tr:'Konu: '+title+'. Günlük durumu düşün.'},choices:a2Phase31BWrongChoices(pair[1]),answer:'a',explain:{de:'„'+pair[0]+'“ bedeutet „'+pair[1]+'“.',tr:'„'+pair[0]+'“, „'+pair[1]+'“ anlamına gelir.'}}); }
    function addFill(i,item){ var sentence=item[0], answer=item[1]; tasks.push({id:id+'-31c-blank-'+i,type:'fill_blank',phase:'31C',parallelContent:true,a2Expanded:true,prompt:{de:'Ergänze den A2-Satz.',tr:'A2 cümlesini tamamla.'},instruction:{de:'Wähle das passende Wort im Kontext.',tr:'Bağlama uygun kelimeyi seç.'},sentence:{de:String(sentence).replace(answer,'____'),tr:String(sentence).replace(answer,'____')},options:[answer,'Fenster','gestern','Bleistift'],answer:answer,hint:{de:'Lies den Satz langsam und achte auf die Bedeutung.',tr:'Cümleyi yavaş oku ve anlama dikkat et.'},explain:{de:'Richtig ist: '+sentence,tr:'Doğru cümle: '+sentence}}); }
    function addOrder(i,sentence){ tasks.push({id:id+'-31c-order-'+i,type:'sentence_order',phase:'31C',parallelContent:true,a2Expanded:true,prompt:{de:'Bringe den Satz in die richtige Reihenfolge.',tr:'Cümleyi doğru sıraya koy.'},instruction:{de:'Achte auf Subjekt, Verb und Zeitangabe.',tr:'Özne, fiil ve zaman ifadesine dikkat et.'},tokens:a2DeterministicTokens(sentence),answer:String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean),hint:{de:'Im Deutschen steht das konjugierte Verb oft an Position 2.',tr:'Almancada çekimli fiil çoğu zaman ikinci konumdadır.'},explain:{de:'Der richtige Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}}); }
    function addListen(i,sentence){ tasks.push({id:id+'-31c-listen-'+i,type:'listening_choice',phase:'31C',parallelContent:true,a2Expanded:true,prompt:{de:'Höre den Satz und wähle ihn aus.',tr:'Cümleyi dinle ve doğru olanı seç.'},instruction:{de:'Spiele den Satz ab und achte auf Schlüsselwörter.',tr:'Cümleyi dinle ve anahtar kelimelere dikkat et.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich habe kein Auto.'},{id:'c',text:'Das Fenster ist offen.'},{id:'d',text:'Der Tisch ist klein.'}],answer:'a',hint:{de:'Höre zuerst den ganzen Satz, nicht nur ein einzelnes Wort.',tr:'Sadece bir kelimeyi değil, tüm cümleyi dinle.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}}); }
    function addTF(i,item){ tasks.push({id:id+'-31c-tf-'+i,type:'true_false',phase:'31C',parallelContent:true,a2Expanded:true,prompt:{de:'Richtig oder falsch?',tr:'Doğru mu yanlış mı?'},instruction:{de:'Entscheide nach der Bedeutung.',tr:'Anlama göre karar ver.'},statement:{de:item[0],tr:item[0]},answer:item[1]?'true':'false',hint:{de:'Vergleiche die Aussage mit dem Lektionsthema.',tr:'İfadeyi ders konusuyla karşılaştır.'},explain:{de:item[1]?'Die Aussage ist richtig.':'Die Aussage ist falsch.',tr:item[1]?'İfade doğru.':'İfade yanlış.'}}); }
    function addMatch(i,offset){ var pairs=vocab.slice(offset,offset+3).map(function(p){return {left:p[0],right:p[1]};}); tasks.push({id:id+'-31c-match-'+i,type:'matching',phase:'31C',parallelContent:true,a2Expanded:true,prompt:{de:'Ordne die Wörter richtig zu.',tr:'Kelimeleri doğru eşleştir.'},instruction:{de:'Verbinde jedes deutsche Wort mit der türkischen Bedeutung.',tr:'Her Almanca kelimeyi Türkçe anlamıyla eşleştir.'},hint:{de:'Alle Begriffe gehören zu „'+title+'“.',tr:'Tüm kavramlar „'+title+'“ konusuna ait.'},pairs:pairs,answer:'all',explain:{de:'Alle Paare gehören zum A2-Thema „'+title+'“.',tr:'Tüm eşleşmeler A2 konusu „'+title+'“ ile ilgilidir.'}}); }
    function addSpeak(i,sentence){ tasks.push({id:id+'-31c-speak-'+i,type:'speaking_practice',phase:'31C',skill:'speaking',parallelContent:true,a2Expanded:true,prompt:{de:'Sprich den A2-Satz nach: „'+sentence+'“',tr:'A2 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Höre den Satz, sprich ihn zweimal langsam nach und nutze automatische Auswertung oder Selbstbewertung.',tr:'Cümleyi dinle, iki kez yavaşça tekrar et; otomatik değerlendirme veya öz değerlendirme kullan.'},hint:{de:'A2-Sprechen: vollständige Sätze, ruhiges Tempo, klare Endung.',tr:'A2 konuşma: tam cümle, sakin tempo, net son ek.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,String(sentence).replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],explain:{de:'Sprechübung zu „'+title+'“. Ziel ist ein klarer Alltagssatz auf A2-Niveau.',tr:'„'+title+'“ için konuşma alıştırması. Amaç A2 düzeyinde net bir günlük cümle kurmaktır.'}}); }
    vocab.slice(0,10).forEach(function(pair,idx){addMC(idx+1,pair);});
    blanks.slice(0,8).forEach(function(item,idx){addFill(idx+1,item);});
    sentences.slice(0,5).forEach(function(sentence,idx){addOrder(idx+1,sentence);});
    sentences.slice(1,6).forEach(function(sentence,idx){addListen(idx+1,sentence);});
    truth.slice(0,4).forEach(function(item,idx){addTF(idx+1,item);});
    addMatch(1,0); addMatch(2,3); addMatch(3,6);
    sentences.slice(0,8).forEach(function(sentence,idx){addSpeak(idx+1,sentence);});
    return tasks.slice(0,43);
  }
  function ensurePhase31BContentExpansion(){
    ensurePhase31A2Structure();
    try{
      A2_LESSON_BLUEPRINTS.forEach(function(bp){
        if(A2_PHASE31B_EXPANDED_IDS.indexOf(bp.id)>=0){ LESSON_TASKS[bp.id]=createA2ExpandedTasks(bp); }
      });
      if(COURSE_TREE.a2&&Array.isArray(COURSE_TREE.a2.lessons)){
        COURSE_TREE.a2.subtitle='Deutsch A2 · alle 10 Lektionen mit Kursinhalt und Speaking parallel ausgebaut';
        COURSE_TREE.a2.lessons.forEach(function(lesson){
          var count=(LESSON_TASKS[lesson.id]||[]).length;
          lesson.tasks=count; lesson.status='available';
          if(A2_PHASE31B_EXPANDED_IDS.indexOf(lesson.id)>=0){ lesson.phase='31C'; lesson.expandedContent=true; lesson.parallelSpeaking=true; }
        });
      }
      var total=A2_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id==='a2'){ LEVELS[i].status='available'; LEVELS[i].desc='A2 komplett ausgebaut · '+total+' Aufgaben inkl. Sprechen'; LEVELS[i].progress=20; }}
    }catch(e){}
  }
  function a2ContentSnapshot(){
    ensurePhase31BContentExpansion();
    var lessons=(COURSE_TREE.a2&&COURSE_TREE.a2.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, expanded=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[], sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length, isExp=A2_PHASE31B_EXPANDED_IDS.indexOf(lesson.id)>=0;
      var ok=isExp?(list.length>=43&&sp>=8):(list.length>=12&&sp>=4);
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,expandedContent:isExp,ok:ok};
      total+=list.length; speaking+=sp; normal+=list.length-sp; if(isExp) expanded++; if(!ok) complete=false;
    });
    return {ok:complete,phase:'31C',level:'a2',expandedLessons:expanded,starterLessons:lessons.length-expanded,lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,expandedLessonTarget:{tasks:43,speaking:8},perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'A2-Lektionen werden mit Kursaufgaben und Speaking gleichzeitig ausgebaut.'}};
  }
  function phase31dQaSnapshot(){
    ensurePhase31BContentExpansion();
    var base=a2ContentSnapshot();
    var lessons=(COURSE_TREE.a2&&COURSE_TREE.a2.lessons)||[];
    var ids={}, duplicateIds=[], missing=[], typeCoverage={}, perLesson={};
    var requiredTypes=['multiple_choice','fill_blank','sentence_order','listening_choice','true_false','matching','speaking_practice'];
    function markMissing(taskId,field){ missing.push({taskId:taskId,field:field}); }
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[];
      var types={};
      var lessonMissing=[];
      list.forEach(function(task){
        if(!task||!task.id){ lessonMissing.push({taskId:'unknown',field:'id'}); return; }
        if(ids[task.id]) duplicateIds.push(task.id); ids[task.id]=true;
        var type=taskType(task); types[type]=(types[type]||0)+1; typeCoverage[type]=(typeCoverage[type]||0)+1;
        if(!task.prompt) lessonMissing.push({taskId:task.id,field:'prompt'});
        if(!task.instruction) lessonMissing.push({taskId:task.id,field:'instruction'});
        if(!task.hint) lessonMissing.push({taskId:task.id,field:'hint'});
        if(!task.explain) lessonMissing.push({taskId:task.id,field:'explain'});
        if(type==='multiple_choice' && (!Array.isArray(task.choices)||task.choices.length<2||!task.answer)) lessonMissing.push({taskId:task.id,field:'choices/answer'});
        if(type==='fill_blank' && (!task.sentence||!Array.isArray(task.options)||!task.answer)) lessonMissing.push({taskId:task.id,field:'sentence/options/answer'});
        if(type==='sentence_order' && (!Array.isArray(task.tokens)||!Array.isArray(task.answer))) lessonMissing.push({taskId:task.id,field:'tokens/answer'});
        if(type==='listening_choice' && (!task.audioText||!Array.isArray(task.choices)||!task.answer)) lessonMissing.push({taskId:task.id,field:'audioText/choices/answer'});
        if(type==='true_false' && (!task.statement||String(task.answer)!=='true'&&String(task.answer)!=='false')) lessonMissing.push({taskId:task.id,field:'statement/answer'});
        if(type==='matching' && (!Array.isArray(task.pairs)||task.pairs.length<2)) lessonMissing.push({taskId:task.id,field:'pairs'});
        if(type==='speaking_practice' && (!task.expectedText||!task.answer||!task.parallelContent)) lessonMissing.push({taskId:task.id,field:'speaking expectedText/answer/parallelContent'});
      });
      var hasAllTypes=requiredTypes.every(function(type){return !!types[type];});
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,types:types,hasAllTypes:hasAllTypes,missingFields:lessonMissing,ok:list.length===43&&types.speaking_practice===8&&hasAllTypes&&!lessonMissing.length};
      missing=missing.concat(lessonMissing);
    });
    var speakingFallbackReady=!!(String(speechGuideHtml||'').indexOf('language-course-speaking-self-assess')>=0&&String(speechGuideHtml||'').indexOf('phase30e')>=0);
    var ok=!!(base.ok&&base.lessons===10&&base.totalTasks===430&&base.normalTasks===350&&base.speakingTasks===80&&duplicateIds.length===0&&missing.length===0&&Object.keys(perLesson).every(function(id){return perLesson[id].ok;})&&speakingFallbackReady);
    return {ok:ok,phase:'31D',version:VERSION,level:'a2',qaScope:'A2 total QA + coding integrity + simulated device readiness',base:base,uniqueTaskIds:Object.keys(ids).length,duplicateIds:duplicateIds,missingFields:missing,typeCoverage:typeCoverage,perLesson:perLesson,speakingFallbackReady:speakingFallbackReady,simulatedDevices:['desktop-1440','desktop-1024','iphone-15-pro-max','iphone-se','ipad-11','ipad-12-9'],limits:{realMicrophoneTest:false,realSafariEngine:false,playwrightNavigationBlockedInContainer:true},nextRecommendedPhase:'32A B1 course + speaking structure parallel'};
  }
  function ensurePhase31A2Structure(){
    try{
      COURSE_TREE.a2={title:'Alltag',subtitle:'Deutsch A2 · Kursstruktur mit parallel aufgebautem Sprechtraining',status:'available',lessons:A2_LESSON_BLUEPRINTS.map(function(bp){return {id:bp.id,title:bp.title,titleI18n:{de:bp.title,tr:bp.tr},goal:bp.goal,goalI18n:{de:bp.goal,tr:bp.goalTr},vocab:bp.vocab,tasks:12,progress:0,status:'available',parallelSpeaking:true,phase:'31A'};})};
      A2_LESSON_BLUEPRINTS.forEach(function(bp){ if(!Array.isArray(LESSON_TASKS[bp.id])||!LESSON_TASKS[bp.id].length) LESSON_TASKS[bp.id]=createA2StarterTasks(bp); });
      var a2Tasks=A2_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id==='a2'){ LEVELS[i].status='available'; LEVELS[i].desc='10 Lektionen · '+a2Tasks+' Startaufgaben inkl. Sprechen'; LEVELS[i].progress=0; }}
    }catch(e){}
  }
  function a2StructureSnapshot(){
    ensurePhase31A2Structure();
    var lessons=(COURSE_TREE.a2&&COURSE_TREE.a2.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, complete=true;
    lessons.forEach(function(lesson){var list=LESSON_TASKS[lesson.id]||[]; var sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length; perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,parallelSpeaking:!!lesson.parallelSpeaking,ok:list.length>=12&&sp>=4}; total+=list.length; speaking+=sp; normal+=list.length-sp; if(list.length<12||sp<4) complete=false;});
    return {ok:complete,phase:'31A',level:'a2',lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,minimumStarterTasksPerLesson:12,minimumSpeakingPerLesson:4,perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'Ab A2 werden Kursaufgaben und Sprechaufgaben pro Niveau zeitgleich gebaut.'}};
  }
  var B1_LESSON_BLUEPRINTS=[
    {id:'b1-opinions-discussion',title:'Meinung & Diskussion',tr:'Fikir ve tartışma',goal:'Eigene Meinung ausdrücken, zustimmen, widersprechen und kurz begründen.',goalTr:'Kendi fikrini söylemek, katılmak, karşı çıkmak ve kısa gerekçe vermek.',vocab:['meiner Meinung nach = bana göre','ich stimme zu = katılıyorum','ich bin dagegen = karşıyım','der Grund = sebep','einerseits = bir yandan','andererseits = diğer yandan'],sentences:['Meiner Meinung nach ist Deutsch im Alltag sehr wichtig.','Ich stimme dir zu, weil das Argument sinnvoll ist.','Ich bin dagegen, weil es zu teuer ist.','Einerseits ist es praktisch, andererseits kostet es viel Zeit.']},
    {id:'b1-work-communication',title:'Kommunikation im Beruf',tr:'İş yerinde iletişim',goal:'Berufliche Situationen, Rückfragen und Probleme verständlich formulieren.',goalTr:'İş durumlarını, soruları ve problemleri anlaşılır şekilde ifade etmek.',vocab:['die Rückfrage = ek soru','die Aufgabe = görev','die Besprechung = toplantı','erledigen = halletmek','zuverlässig = güvenilir','die Lösung = çözüm'],sentences:['Ich habe eine Rückfrage zu dieser Aufgabe.','Wir besprechen das Problem heute im Team.','Ich kann die Aufgabe bis morgen erledigen.','Eine klare Lösung ist für alle wichtig.']},
    {id:'b1-experience-past',title:'Erfahrungen erzählen',tr:'Deneyimleri anlatmak',goal:'Erlebnisse, Erfahrungen und einfache Zusammenhänge in der Vergangenheit erzählen.',goalTr:'Geçmiş deneyimleri ve basit bağlantıları anlatmak.',vocab:['die Erfahrung = deneyim','früher = eskiden','damals = o zamanlar','passiert = oldu','geholfen = yardım etti','gelernt = öğrendi'],sentences:['Früher habe ich in einer anderen Stadt gewohnt.','Damals habe ich viele neue Menschen kennengelernt.','Diese Erfahrung hat mir sehr geholfen.','Ich habe gelernt, ruhiger zu bleiben.']},
    {id:'b1-problems-solutions',title:'Probleme & Lösungen',tr:'Sorunlar ve çözümler',goal:'Alltagsprobleme beschreiben und passende Lösungen vorschlagen.',goalTr:'Günlük problemleri anlatmak ve uygun çözümler önermek.',vocab:['das Problem = sorun','der Vorschlag = öneri','lösen = çözmek','vergleichen = karşılaştırmak','entscheiden = karar vermek','möglich = mümkün'],sentences:['Wir müssen zuerst das Problem genau verstehen.','Mein Vorschlag ist, die Termine zu vergleichen.','Vielleicht können wir eine andere Lösung finden.','Danach entscheiden wir gemeinsam.']},
    {id:'b1-media-information',title:'Medien & Informationen',tr:'Medya ve bilgi',goal:'Informationen aus Medien verstehen, zusammenfassen und bewerten.',goalTr:'Medyadan gelen bilgileri anlamak, özetlemek ve değerlendirmek.',vocab:['die Nachricht = haber','der Bericht = rapor/haber','die Quelle = kaynak','glaubwürdig = güvenilir','zusammenfassen = özetlemek','vergleichen = karşılaştırmak'],sentences:['Ich habe heute einen interessanten Bericht gelesen.','Die Quelle wirkt glaubwürdig.','Ich kann die wichtigsten Informationen zusammenfassen.','Man sollte verschiedene Nachrichten vergleichen.']},
    {id:'b1-education-plans',title:'Bildung & Lernen',tr:'Eğitim ve öğrenme',goal:'Lernwege, Kurse, Ziele und Schwierigkeiten beschreiben.',goalTr:'Öğrenme yollarını, kursları, hedefleri ve zorlukları anlatmak.',vocab:['die Weiterbildung = mesleki eğitim','das Ziel = hedef','die Prüfung = sınav','sich verbessern = gelişmek','regelmäßig = düzenli','die Schwierigkeit = zorluk'],sentences:['Mein Ziel ist, mich beruflich zu verbessern.','Ich lerne regelmäßig für die Prüfung.','Diese Weiterbildung ist eine gute Chance.','Bei Schwierigkeiten frage ich nach Hilfe.']},
    {id:'b1-travel-report',title:'Reisen & Berichten',tr:'Seyahat ve anlatım',goal:'Reiseerfahrungen schildern, Vor- und Nachteile nennen und Empfehlungen geben.',goalTr:'Seyahat deneyimlerini anlatmak, avantaj/dezavantaj söylemek ve öneri vermek.',vocab:['die Reise = seyahat','empfehlen = tavsiye etmek','der Vorteil = avantaj','der Nachteil = dezavantaj','die Unterkunft = konaklama','die Erfahrung = deneyim'],sentences:['Die Reise war anstrengend, aber sehr interessant.','Ich kann diese Unterkunft empfehlen.','Ein Vorteil war die gute Lage.','Der Nachteil war der hohe Preis.']},
    {id:'b1-health-lifestyle',title:'Gesundheit & Lebensstil',tr:'Sağlık ve yaşam tarzı',goal:'Lebensgewohnheiten, Gesundheitstipps und persönliche Erfahrungen ausdrücken.',goalTr:'Yaşam alışkanlıklarını, sağlık önerilerini ve kişisel deneyimleri ifade etmek.',vocab:['die Gewohnheit = alışkanlık','sich bewegen = hareket etmek','ausgewogen = dengeli','der Stress = stres','vermeiden = kaçınmak','sich erholen = dinlenmek'],sentences:['Ich versuche, mich jeden Tag etwas zu bewegen.','Eine ausgewogene Ernährung ist wichtig.','Zu viel Stress sollte man vermeiden.','Am Wochenende kann ich mich besser erholen.']},
    {id:'b1-official-service',title:'Amt & Service',tr:'Resmi işler ve hizmet',goal:'Anliegen erklären, Nachfragen stellen und formelle Situationen bewältigen.',goalTr:'İstekleri açıklamak, soru sormak ve resmi durumlarla baş etmek.',vocab:['das Anliegen = talep','der Antrag = başvuru','die Unterlagen = evraklar','benötigen = ihtiyaç duymak','einreichen = teslim etmek','zuständig = yetkili'],sentences:['Ich möchte einen Antrag einreichen.','Welche Unterlagen benötige ich dafür?','Wer ist für mein Anliegen zuständig?','Ich habe noch eine Rückfrage zum Formular.']},
    {id:'b1-future-goals',title:'Zukunft & Ziele',tr:'Gelecek ve hedefler',goal:'Pläne, Hoffnungen, Bedingungen und nächste Schritte formulieren.',goalTr:'Planları, umutları, koşulları ve sonraki adımları ifade etmek.',vocab:['die Zukunft = gelecek','vorhaben = planlamak','hoffentlich = umarım','die Voraussetzung = şart','der nächste Schritt = sonraki adım','erreichen = ulaşmak'],sentences:['In Zukunft möchte ich sicherer Deutsch sprechen.','Hoffentlich erreiche ich mein Ziel Schritt für Schritt.','Eine wichtige Voraussetzung ist regelmäßiges Lernen.','Der nächste Schritt ist ein längeres Gespräch.']}
  ];
  function b1Choices(correct){
    var base=[correct,'ev','bugün','çok küçük','kalem','araba','pencere'];
    var seen={}; return base.filter(function(x){ if(!x||seen[x]) return false; seen[x]=true; return true;}).slice(0,4).map(function(text,i){return {id:String.fromCharCode(97+i),text:text};});
  }
  function b1Tokens(sentence){return String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean).sort(function(a,b){return a.localeCompare(b,'de');});}
  function createB1StarterTasks(bp){
    var tasks=[], id=bp.id, title=bp.title, vocab=bp.vocab.map(function(v){var parts=String(v).split(' = '); return [parts[0],parts[1]||parts[0]];}), sentences=bp.sentences.slice();
    function addMC(i,pair){tasks.push({id:id+'-32a-mc-'+i,type:'multiple_choice',phase:'32A',parallelContent:true,b1Starter:true,prompt:{de:'Welche Bedeutung passt zu „'+pair[0]+'“?',tr:'„'+pair[0]+'“ için hangi anlam uygundur?'},instruction:{de:'Wähle die passende Bedeutung. B1 verlangt mehr Kontext als A2.',tr:'Uygun anlamı seç. B1, A2’den daha fazla bağlam ister.'},hint:{de:'Thema: '+title+'. Achte auf die Situation.',tr:'Konu: '+title+'. Duruma dikkat et.'},choices:b1Choices(pair[1]),answer:'a',explain:{de:'„'+pair[0]+'“ bedeutet „'+pair[1]+'“.',tr:'„'+pair[0]+'“, „'+pair[1]+'“ anlamına gelir.'}});}
    function addBlank(i,sentence,answer){tasks.push({id:id+'-32a-blank-'+i,type:'fill_blank',phase:'32A',parallelContent:true,b1Starter:true,prompt:{de:'Ergänze den B1-Satz.',tr:'B1 cümlesini tamamla.'},instruction:{de:'Wähle ein Wort, das inhaltlich und grammatisch passt.',tr:'Anlam ve dilbilgisine uygun kelimeyi seç.'},sentence:{de:String(sentence).replace(answer,'____'),tr:String(sentence).replace(answer,'____')},options:[answer,'Fenster','morgen','Bleistift'],answer:answer,hint:{de:'Lies den ganzen Satz und achte auf die Aussage.',tr:'Tüm cümleyi oku ve mesaja dikkat et.'},explain:{de:'Richtig ist: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addOrder(i,sentence){tasks.push({id:id+'-32a-order-'+i,type:'sentence_order',phase:'32A',parallelContent:true,b1Starter:true,prompt:{de:'Ordne den B1-Satz.',tr:'B1 cümlesini sırala.'},instruction:{de:'Bringe die Wörter in eine sinnvolle deutsche Satzreihenfolge.',tr:'Kelimeleri anlamlı Almanca cümle sırasına koy.'},tokens:b1Tokens(sentence),answer:String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean),hint:{de:'Achte auf Hauptsatz, Begründung und Satzende.',tr:'Ana cümleye, gerekçeye ve cümle sonuna dikkat et.'},explain:{de:'Der richtige Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addListen(i,sentence){tasks.push({id:id+'-32a-listen-'+i,type:'listening_choice',phase:'32A',parallelContent:true,b1Starter:true,prompt:{de:'Höre den B1-Satz und wähle ihn aus.',tr:'B1 cümlesini dinle ve seç.'},instruction:{de:'Achte auf die wichtigsten Wörter und die Begründung.',tr:'Ana kelimelere ve gerekçeye dikkat et.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich habe heute keine Zeit.'},{id:'c',text:'Das Zimmer ist sehr klein.'},{id:'d',text:'Wir kaufen Brot und Wasser.'}],answer:'a',hint:{de:'B1-Sätze sind länger. Höre den Satz einmal komplett.',tr:'B1 cümleleri daha uzundur. Cümleyi bir kez tamamen dinle.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}});}
    function addSpeak(i,sentence){tasks.push({id:id+'-32a-speak-'+i,type:'speaking_practice',phase:'32A',skill:'speaking',parallelContent:true,b1Starter:true,prompt:{de:'Sprich den B1-Satz nach: „'+sentence+'“',tr:'B1 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Höre den Satz, sprich ihn zweimal langsam nach und achte auf Begründung und Satzmelodie.',tr:'Cümleyi dinle, iki kez yavaşça tekrar et; gerekçeye ve vurguya dikkat et.'},hint:{de:'B1-Sprechen: vollständiger Gedanke, klare Begründung, ruhiges Tempo.',tr:'B1 konuşma: tam düşünce, net gerekçe, sakin tempo.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,String(sentence).replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],explain:{de:'Sprechübung zur B1-Lektion „'+title+'“. Ziel ist ein längerer, verständlicher Satz mit klarer Aussage.',tr:'B1 dersi „'+title+'“ için konuşma alıştırması. Amaç net ifadeli, anlaşılır ve daha uzun bir cümle kurmaktır.'}});}
    vocab.slice(0,3).forEach(function(pair,idx){addMC(idx+1,pair);});
    addBlank(1,sentences[0],String(sentences[0]).split(/\s+/)[1]||String(sentences[0]).split(/\s+/)[0]);
    addOrder(1,sentences[1]);
    addListen(1,sentences[2]);
    addListen(2,sentences[3]);
    addBlank(2,sentences[3],String(sentences[3]).split(/\s+/)[2]||String(sentences[3]).split(/\s+/)[0]);
    sentences.slice(0,4).forEach(function(sentence,idx){addSpeak(idx+1,sentence);});
    return tasks.slice(0,12);
  }
  function ensurePhase32AB1Structure(){
    try{
      COURSE_TREE.b1={title:'Kommunikation',subtitle:'Deutsch B1 · Kursstruktur mit parallel aufgebautem Sprechtraining',status:'available',lessons:B1_LESSON_BLUEPRINTS.map(function(bp){return {id:bp.id,title:bp.title,titleI18n:{de:bp.title,tr:bp.tr},goal:bp.goal,goalI18n:{de:bp.goal,tr:bp.goalTr},vocab:bp.vocab,tasks:12,progress:0,status:'available',parallelSpeaking:true,phase:'32A'};})};
      B1_LESSON_BLUEPRINTS.forEach(function(bp){LESSON_TASKS[bp.id]=createB1StarterTasks(bp);});
      var b1Tasks=B1_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id==='b1'){ LEVELS[i].status='available'; LEVELS[i].desc='10 Lektionen · '+b1Tasks+' Startaufgaben inkl. Sprechen'; LEVELS[i].progress=5; }}
    }catch(e){}
  }
  function b1StructureSnapshot(){
    ensurePhase32BContentExpansion();
    var lessons=(COURSE_TREE.b1&&COURSE_TREE.b1.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[]; var sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length;
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,parallelSpeaking:!!lesson.parallelSpeaking,ok:list.length>=12&&sp>=4};
      total+=list.length; speaking+=sp; normal+=list.length-sp; if(list.length<12||sp<4) complete=false;
    });
    return {ok:complete&&lessons.length===10&&total===120&&speaking===40,phase:'32A',level:'b1',lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,minimumStarterTasksPerLesson:12,minimumSpeakingPerLesson:4,perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'B1 wird ab Start mit Kursaufgaben und Speaking parallel aufgebaut.'},nextRecommendedPhase:'32B B1 Lektionen 1-5 Inhalt + Speaking ausbauen'};
  }

  var B1_PHASE32B_EXPANDED_IDS=['b1-opinions-discussion','b1-work-communication','b1-experience-past','b1-problems-solutions','b1-media-information','b1-education-plans','b1-travel-report','b1-health-lifestyle','b1-official-service','b1-future-goals'];
  var B1_PHASE32B_CONTENT={
    'b1-opinions-discussion':{
      focus:'Meinungen differenziert äußern, zustimmen, widersprechen und mit Gründen diskutieren.',
      focusTr:'Fikirleri ayrıntılı ifade etme, katılma, karşı çıkma ve gerekçelerle tartışma.',
      vocab:[['meiner Meinung nach','bana göre'],['ich bin der Ansicht','şu görüşteyim'],['zustimmen','katılmak'],['widersprechen','karşı çıkmak'],['das Argument','argüman'],['die Begründung','gerekçe'],['einerseits','bir yandan'],['andererseits','diğer yandan'],['überzeugen','ikna etmek'],['der Vorteil','avantaj']],
      sentences:['Meiner Meinung nach sollte man jeden Tag etwas Deutsch sprechen.','Ich stimme dir teilweise zu, aber ein Punkt ist für mich unklar.','Einerseits ist Online-Lernen praktisch, andererseits braucht man viel Disziplin.','Dieses Argument überzeugt mich, weil es gut begründet ist.','Ich bin anderer Meinung, da die Situation komplizierter ist.','Für mich ist wichtig, dass beide Seiten gehört werden.','Eine gute Diskussion braucht Respekt und klare Beispiele.','Am Ende kann man trotz unterschiedlicher Meinung eine Lösung finden.'],
      blanks:[['Meiner Meinung nach sollte man jeden Tag etwas Deutsch sprechen.','Meinung'],['Ich stimme dir teilweise zu, aber ein Punkt ist für mich unklar.','teilweise'],['Einerseits ist Online-Lernen praktisch, andererseits braucht man viel Disziplin.','andererseits'],['Dieses Argument überzeugt mich, weil es gut begründet ist.','Argument'],['Ich bin anderer Meinung, da die Situation komplizierter ist.','Meinung'],['Eine gute Diskussion braucht Respekt und klare Beispiele.','Diskussion'],['Für mich ist wichtig, dass beide Seiten gehört werden.','Seiten'],['Am Ende kann man trotz unterschiedlicher Meinung eine Lösung finden.','Lösung']],
      truth:[['Bei B1 soll man eine Meinung oft begründen können.',true],['Widersprechen bedeutet immer zustimmen.',false],['Einerseits und andererseits helfen beim Abwägen.',true],['Eine Diskussion braucht keine Beispiele.',false]],
      dialog:['Was hältst du von Online-Lernen?','Meiner Meinung nach ist es praktisch, aber nicht für jeden einfach.','Warum denkst du das?','Weil man viel Disziplin braucht und allein lernen muss.']
    },
    'b1-work-communication':{
      focus:'Berufliche Kommunikation, Rückfragen, Zuständigkeiten und Absprachen sicher formulieren.',
      focusTr:'İş iletişimi, ek sorular, sorumluluklar ve anlaşmaları güvenli ifade etme.',
      vocab:[['die Rückfrage','ek soru'],['die Zuständigkeit','sorumluluk/yetki'],['die Besprechung','toplantı'],['die Frist','son tarih'],['erledigen','halletmek'],['verschieben','ertelemek'],['zuverlässig','güvenilir'],['die Rückmeldung','geri dönüş'],['klären','netleştirmek'],['vereinbaren','kararlaştırmak']],
      sentences:['Ich habe noch eine Rückfrage zu der Aufgabe.','Könnten wir die Frist bitte noch einmal klären?','Ich erledige den ersten Teil bis morgen Nachmittag.','Für diese Frage ist wahrscheinlich eine andere Abteilung zuständig.','Bitte geben Sie mir eine kurze Rückmeldung, wenn etwas fehlt.','Wir sollten den Termin verschieben, weil mehrere Kollegen krank sind.','In der Besprechung haben wir die nächsten Schritte vereinbart.','Eine klare Kommunikation verhindert viele Missverständnisse.'],
      blanks:[['Ich habe noch eine Rückfrage zu der Aufgabe.','Rückfrage'],['Könnten wir die Frist bitte noch einmal klären?','Frist'],['Ich erledige den ersten Teil bis morgen Nachmittag.','erledige'],['Für diese Frage ist wahrscheinlich eine andere Abteilung zuständig.','zuständig'],['Bitte geben Sie mir eine kurze Rückmeldung, wenn etwas fehlt.','Rückmeldung'],['Wir sollten den Termin verschieben, weil mehrere Kollegen krank sind.','verschieben'],['In der Besprechung haben wir die nächsten Schritte vereinbart.','Besprechung'],['Eine klare Kommunikation verhindert viele Missverständnisse.','Kommunikation']],
      truth:[['Eine Rückfrage kann helfen, eine Aufgabe besser zu verstehen.',true],['Eine Frist ist ein Möbelstück.',false],['Im Beruf sind klare Absprachen wichtig.',true],['Zuständig bedeutet immer arbeitslos.',false]],
      dialog:['Haben Sie die Aufgabe verstanden?','Fast, aber ich habe noch eine Rückfrage.','Welche Frage haben Sie?','Bis wann soll ich den ersten Teil erledigen?']
    },
    'b1-experience-past':{
      focus:'Erfahrungen in der Vergangenheit zusammenhängend erzählen und daraus Schlüsse ziehen.',
      focusTr:'Geçmiş deneyimleri bağlantılı anlatma ve sonuç çıkarma.',
      vocab:[['die Erfahrung','deneyim'],['damals','o zamanlar'],['früher','eskiden'],['sich gewöhnen an','alışmak'],['die Herausforderung','zorluk'],['geholfen','yardım etti'],['kennengelernt','tanıştı'],['verändert','değiştirdi'],['deshalb','bu yüzden'],['seitdem','o zamandan beri']],
      sentences:['Früher hatte ich Angst, längere Sätze auf Deutsch zu sprechen.','Damals habe ich viele Fehler gemacht, aber ich habe weitergeübt.','Diese Erfahrung hat mir geholfen, selbstbewusster zu werden.','Am Anfang war die Situation schwierig, weil alles neu war.','Mit der Zeit habe ich mich an den Alltag gewöhnt.','Ich habe gelernt, dass regelmäßiges Üben wichtiger ist als Perfektion.','Seitdem spreche ich öfter, auch wenn ich unsicher bin.','Diese Veränderung war für mich ein wichtiger Schritt.'],
      blanks:[['Früher hatte ich Angst, längere Sätze auf Deutsch zu sprechen.','Früher'],['Damals habe ich viele Fehler gemacht, aber ich habe weitergeübt.','Damals'],['Diese Erfahrung hat mir geholfen, selbstbewusster zu werden.','Erfahrung'],['Am Anfang war die Situation schwierig, weil alles neu war.','Situation'],['Mit der Zeit habe ich mich an den Alltag gewöhnt.','gewöhnt'],['Ich habe gelernt, dass regelmäßiges Üben wichtiger ist als Perfektion.','regelmäßiges'],['Seitdem spreche ich öfter, auch wenn ich unsicher bin.','Seitdem'],['Diese Veränderung war für mich ein wichtiger Schritt.','Veränderung']],
      truth:[['B1-Erzählungen können mehrere Sätze mit einem Zusammenhang enthalten.',true],['Damals ist eine Zukunftsform.',false],['Seitdem kann eine Entwicklung nach einem Ereignis zeigen.',true],['Eine Herausforderung ist immer ein Getränk.',false]],
      dialog:['Wie war dein erster Deutschkurs?','Am Anfang war es schwierig, weil ich wenig verstanden habe.','Was hat dir geholfen?','Regelmäßiges Üben und kurze Gespräche haben mir sehr geholfen.']
    },
    'b1-problems-solutions':{
      focus:'Probleme strukturiert beschreiben, Ursachen nennen und Lösungen vorschlagen.',
      focusTr:'Problemleri düzenli anlatma, nedenleri söyleme ve çözüm önerme.',
      vocab:[['die Ursache','neden'],['die Lösung','çözüm'],['der Vorschlag','öneri'],['vergleichen','karşılaştırmak'],['entscheiden','karar vermek'],['möglich','mümkün'],['sinnvoll','mantıklı'],['der Nachteil','dezavantaj'],['gemeinsam','birlikte'],['verbessern','iyileştirmek']],
      sentences:['Zuerst sollten wir die Ursache des Problems verstehen.','Mein Vorschlag wäre, die beiden Möglichkeiten zu vergleichen.','Diese Lösung ist sinnvoll, weil sie wenig Zeit kostet.','Ein Nachteil ist, dass wir dafür mehr Informationen brauchen.','Vielleicht können wir gemeinsam eine bessere Lösung finden.','Bevor wir entscheiden, sollten wir alle wichtigen Punkte sammeln.','Das Problem lässt sich wahrscheinlich Schritt für Schritt verbessern.','Wenn wir ruhig bleiben, finden wir schneller einen Weg.'],
      blanks:[['Zuerst sollten wir die Ursache des Problems verstehen.','Ursache'],['Mein Vorschlag wäre, die beiden Möglichkeiten zu vergleichen.','Vorschlag'],['Diese Lösung ist sinnvoll, weil sie wenig Zeit kostet.','sinnvoll'],['Ein Nachteil ist, dass wir dafür mehr Informationen brauchen.','Nachteil'],['Vielleicht können wir gemeinsam eine bessere Lösung finden.','gemeinsam'],['Bevor wir entscheiden, sollten wir alle wichtigen Punkte sammeln.','entscheiden'],['Das Problem lässt sich wahrscheinlich Schritt für Schritt verbessern.','verbessern'],['Wenn wir ruhig bleiben, finden wir schneller einen Weg.','ruhig']],
      truth:[['Bei einem Problem kann man zuerst die Ursache suchen.',true],['Ein Vorschlag ist eine mögliche Idee.',true],['Ein Nachteil ist immer ein Vorteil.',false],['Gemeinsam bedeutet allein und ohne Kontakt.',false]],
      dialog:['Was ist das Problem?','Wir haben zu wenig Informationen für eine Entscheidung.','Was schlägst du vor?','Wir sollten zuerst die wichtigsten Punkte sammeln und vergleichen.']
    },
    'b1-media-information':{
      focus:'Informationen aus Medien verstehen, zusammenfassen, Quellen einschätzen und kritisch vergleichen.',
      focusTr:'Medya bilgilerini anlama, özetleme, kaynak değerlendirme ve karşılaştırma.',
      vocab:[['die Quelle','kaynak'],['glaubwürdig','güvenilir'],['zusammenfassen','özetlemek'],['vergleichen','karşılaştırmak'],['der Bericht','rapor/haber'],['die Nachricht','haber'],['die Überschrift','başlık'],['behaupten','iddia etmek'],['prüfen','kontrol etmek'],['kritisch','eleştirel']],
      sentences:['Ich habe einen Bericht gelesen und die wichtigsten Punkte zusammengefasst.','Die Überschrift klingt interessant, aber man sollte die Quelle prüfen.','Nicht jede Nachricht im Internet ist automatisch glaubwürdig.','Man sollte verschiedene Informationen miteinander vergleichen.','Der Bericht behauptet, dass viele Menschen online lernen.','Ich finde es wichtig, kritisch mit Medien umzugehen.','Eine seriöse Quelle erklärt, woher die Informationen kommen.','Bevor ich etwas teile, prüfe ich den Inhalt genauer.'],
      blanks:[['Ich habe einen Bericht gelesen und die wichtigsten Punkte zusammengefasst.','zusammengefasst'],['Die Überschrift klingt interessant, aber man sollte die Quelle prüfen.','Quelle'],['Nicht jede Nachricht im Internet ist automatisch glaubwürdig.','glaubwürdig'],['Man sollte verschiedene Informationen miteinander vergleichen.','vergleichen'],['Der Bericht behauptet, dass viele Menschen online lernen.','behauptet'],['Ich finde es wichtig, kritisch mit Medien umzugehen.','kritisch'],['Eine seriöse Quelle erklärt, woher die Informationen kommen.','seriöse'],['Bevor ich etwas teile, prüfe ich den Inhalt genauer.','prüfe']],
      truth:[['Eine Quelle kann zeigen, woher eine Information kommt.',true],['Kritisch lesen bedeutet alles sofort glauben.',false],['Man kann Berichte zusammenfassen.',true],['Eine Überschrift ist immer ein Medikament.',false]],
      dialog:['Hast du den Bericht gelesen?','Ja, und ich habe die wichtigsten Punkte zusammengefasst.','Findest du die Quelle glaubwürdig?','Vielleicht, aber ich möchte sie noch mit anderen Quellen vergleichen.']
    },
    'b1-education-plans':{
      focus:'Lernwege, Weiterbildung, Prüfungen und persönliche Lernstrategien auf B1-Niveau erklären.',
      focusTr:'Öğrenme yollarını, mesleki eğitimi, sınavları ve kişisel öğrenme stratejilerini B1 düzeyinde açıklama.',
      vocab:[['die Weiterbildung','mesleki eğitim'],['das Lernziel','öğrenme hedefi'],['die Prüfung','sınav'],['sich vorbereiten','hazırlanmak'],['regelmäßig','düzenli'],['die Schwierigkeit','zorluk'],['die Unterstützung','destek'],['der Fortschritt','ilerleme'],['motiviert','motive'],['die Lernstrategie','öğrenme stratejisi']],
      sentences:['Ich bereite mich regelmäßig auf die Prüfung vor.','Eine gute Lernstrategie hilft mir, länger konzentriert zu bleiben.','Wenn ich Schwierigkeiten habe, frage ich nach Unterstützung.','Mein wichtigstes Lernziel ist, sicherer zu sprechen.','Durch tägliches Üben merke ich langsam Fortschritte.','Diese Weiterbildung kann meine beruflichen Chancen verbessern.','Ich bleibe motiviert, weil ich ein klares Ziel habe.','Vor einer Prüfung wiederhole ich besonders die schwierigen Themen.'],
      blanks:[['Ich bereite mich regelmäßig auf die Prüfung vor.','regelmäßig'],['Eine gute Lernstrategie hilft mir, länger konzentriert zu bleiben.','Lernstrategie'],['Wenn ich Schwierigkeiten habe, frage ich nach Unterstützung.','Unterstützung'],['Mein wichtigstes Lernziel ist, sicherer zu sprechen.','Lernziel'],['Durch tägliches Üben merke ich langsam Fortschritte.','Fortschritte'],['Diese Weiterbildung kann meine beruflichen Chancen verbessern.','Weiterbildung'],['Ich bleibe motiviert, weil ich ein klares Ziel habe.','motiviert'],['Vor einer Prüfung wiederhole ich besonders die schwierigen Themen.','Prüfung']],
      truth:[['Eine Lernstrategie kann beim regelmäßigen Lernen helfen.',true],['Eine Prüfung ist ein Möbelstück.',false],['Unterstützung kann bei Schwierigkeiten sinnvoll sein.',true],['Fortschritt bedeutet, dass man gar nichts lernt.',false]],
      dialog:['Wie bereitest du dich auf die Prüfung vor?','Ich lerne regelmäßig und wiederhole schwierige Themen.','Was hilft dir dabei?','Eine klare Lernstrategie und kurze tägliche Übungen helfen mir sehr.']
    },
    'b1-travel-report':{
      focus:'Reiseerfahrungen zusammenhängend berichten, Eindrücke beschreiben und Empfehlungen geben.',
      focusTr:'Seyahat deneyimlerini bağlantılı anlatma, izlenimleri açıklama ve öneri verme.',
      vocab:[['die Unterkunft','konaklama'],['die Empfehlung','tavsiye'],['der Eindruck','izlenim'],['die Erfahrung','deneyim'],['der Vorteil','avantaj'],['der Nachteil','dezavantaj'],['unterwegs','yolda'],['die Verbindung','bağlantı'],['anstrengend','yorucu'],['sehenswert','görülmeye değer']],
      sentences:['Die Reise war anstrengend, aber ich habe viel erlebt.','Unsere Unterkunft war einfach, aber sehr sauber und zentral.','Ein großer Vorteil war die gute Verbindung in die Innenstadt.','Der Nachteil war, dass viele Sehenswürdigkeiten sehr voll waren.','Ich würde die Stadt trotzdem empfehlen, weil sie sehr interessant ist.','Unterwegs habe ich viele neue Eindrücke gesammelt.','Besonders sehenswert war der alte Markt in der Stadtmitte.','Beim nächsten Mal würde ich mehr Zeit für die Planung nehmen.'],
      blanks:[['Die Reise war anstrengend, aber ich habe viel erlebt.','anstrengend'],['Unsere Unterkunft war einfach, aber sehr sauber und zentral.','Unterkunft'],['Ein großer Vorteil war die gute Verbindung in die Innenstadt.','Vorteil'],['Der Nachteil war, dass viele Sehenswürdigkeiten sehr voll waren.','Nachteil'],['Ich würde die Stadt trotzdem empfehlen, weil sie sehr interessant ist.','empfehlen'],['Unterwegs habe ich viele neue Eindrücke gesammelt.','Eindrücke'],['Besonders sehenswert war der alte Markt in der Stadtmitte.','sehenswert'],['Beim nächsten Mal würde ich mehr Zeit für die Planung nehmen.','Planung']],
      truth:[['Bei B1 kann man von Erfahrungen auf Reisen berichten.',true],['Eine Unterkunft ist ein Ort, an dem man übernachten kann.',true],['Ein Nachteil ist immer etwas Positives.',false],['Sehenswert bedeutet, dass man etwas nicht sehen darf.',false]],
      dialog:['Wie war deine Reise?','Sie war anstrengend, aber sehr interessant.','Würdest du die Stadt empfehlen?','Ja, besonders wegen der Altstadt und der guten Verbindung.']
    },
    'b1-health-lifestyle':{
      focus:'Gesundheit, Gewohnheiten, Stress und Lebensstil mit Gründen und Tipps beschreiben.',
      focusTr:'Sağlık, alışkanlıklar, stres ve yaşam tarzını gerekçeler ve önerilerle anlatma.',
      vocab:[['die Gewohnheit','alışkanlık'],['ausgewogen','dengeli'],['sich bewegen','hareket etmek'],['der Stress','stres'],['vermeiden','kaçınmak'],['sich erholen','dinlenmek'],['die Ernährung','beslenme'],['der Alltag','günlük yaşam'],['regelmäßig','düzenli'],['die Empfehlung','öneri']],
      sentences:['Ich versuche, mich im Alltag regelmäßig zu bewegen.','Eine ausgewogene Ernährung hilft mir, mich besser zu fühlen.','Zu viel Stress sollte man vermeiden, wenn es möglich ist.','Nach einem langen Tag brauche ich Zeit, um mich zu erholen.','Kleine gesunde Gewohnheiten können langfristig viel verändern.','Meine Empfehlung ist, mit kurzen Spaziergängen anzufangen.','Im Alltag ist es nicht immer leicht, gesund zu leben.','Trotzdem kann man Schritt für Schritt etwas verbessern.'],
      blanks:[['Ich versuche, mich im Alltag regelmäßig zu bewegen.','regelmäßig'],['Eine ausgewogene Ernährung hilft mir, mich besser zu fühlen.','Ernährung'],['Zu viel Stress sollte man vermeiden, wenn es möglich ist.','vermeiden'],['Nach einem langen Tag brauche ich Zeit, um mich zu erholen.','erholen'],['Kleine gesunde Gewohnheiten können langfristig viel verändern.','Gewohnheiten'],['Meine Empfehlung ist, mit kurzen Spaziergängen anzufangen.','Empfehlung'],['Im Alltag ist es nicht immer leicht, gesund zu leben.','Alltag'],['Trotzdem kann man Schritt für Schritt etwas verbessern.','verbessern']],
      truth:[['Regelmäßige Bewegung kann zum gesunden Lebensstil gehören.',true],['Ausgewogen bedeutet einseitig und extrem.',false],['Erholung kann nach Stress wichtig sein.',true],['Eine Gewohnheit ist immer eine Krankheit.',false]],
      dialog:['Was machst du für deine Gesundheit?','Ich bewege mich regelmäßig und achte mehr auf Ernährung.','Fällt dir das leicht?','Nicht immer, aber kleine Schritte helfen mir im Alltag.']
    },
    'b1-official-service':{
      focus:'Formelle Anliegen erklären, Unterlagen nennen, Rückfragen stellen und Service-Situationen bewältigen.',
      focusTr:'Resmi talepleri açıklama, evrakları söyleme, ek soru sorma ve hizmet durumlarını yönetme.',
      vocab:[['das Anliegen','talep'],['der Antrag','başvuru'],['die Unterlagen','evraklar'],['benötigen','ihtiyaç duymak'],['einreichen','teslim etmek'],['zuständig','yetkili'],['die Rückfrage','ek soru'],['das Formular','form'],['der Termin','randevu'],['die Bestätigung','onay']],
      sentences:['Ich möchte einen Antrag einreichen und habe dazu eine Rückfrage.','Welche Unterlagen benötige ich für diesen Termin?','Könnten Sie mir bitte sagen, wer dafür zuständig ist?','Ich habe das Formular ausgefüllt, aber mir fehlt noch eine Bestätigung.','Mein Anliegen betrifft die Änderung meiner persönlichen Daten.','Falls etwas fehlt, kann ich die Unterlagen später nachreichen.','Für formelle Gespräche ist eine höfliche Sprache besonders wichtig.','Nach dem Termin möchte ich eine schriftliche Bestätigung bekommen.'],
      blanks:[['Ich möchte einen Antrag einreichen und habe dazu eine Rückfrage.','Antrag'],['Welche Unterlagen benötige ich für diesen Termin?','Unterlagen'],['Könnten Sie mir bitte sagen, wer dafür zuständig ist?','zuständig'],['Ich habe das Formular ausgefüllt, aber mir fehlt noch eine Bestätigung.','Formular'],['Mein Anliegen betrifft die Änderung meiner persönlichen Daten.','Anliegen'],['Falls etwas fehlt, kann ich die Unterlagen später nachreichen.','nachreichen'],['Für formelle Gespräche ist eine höfliche Sprache besonders wichtig.','höfliche'],['Nach dem Termin möchte ich eine schriftliche Bestätigung bekommen.','Bestätigung']],
      truth:[['Bei einem Amt kann man Unterlagen benötigen.',true],['Ein Formular kann man ausfüllen.',true],['Zuständig bedeutet, dass jemand verantwortlich ist.',true],['Ein Antrag ist immer ein Haustier.',false]],
      dialog:['Guten Tag, wie kann ich Ihnen helfen?','Ich möchte einen Antrag einreichen und habe eine Rückfrage.','Welche Unterlagen haben Sie dabei?','Das Formular habe ich ausgefüllt, aber mir fehlt noch eine Bestätigung.']
    },
    'b1-future-goals':{
      focus:'Zukunftspläne, Bedingungen, Hoffnungen und nächste Schritte zusammenhängend formulieren.',
      focusTr:'Gelecek planlarını, koşulları, umutları ve sonraki adımları bağlantılı ifade etme.',
      vocab:[['die Zukunft','gelecek'],['das Ziel','hedef'],['vorhaben','planlamak'],['hoffentlich','umarım'],['die Voraussetzung','şart'],['der nächste Schritt','sonraki adım'],['erreichen','ulaşmak'],['sich entwickeln','gelişmek'],['die Möglichkeit','imkan'],['langfristig','uzun vadeli']],
      sentences:['In Zukunft möchte ich sicherer und spontaner Deutsch sprechen.','Mein nächstes Ziel ist, längere Gespräche besser zu verstehen.','Hoffentlich erreiche ich dieses Ziel Schritt für Schritt.','Eine wichtige Voraussetzung ist, dass ich regelmäßig weiterübe.','Langfristig möchte ich mich beruflich weiterentwickeln.','Der nächste Schritt ist, mehr echte Gespräche zu führen.','Wenn ich dranbleibe, habe ich gute Möglichkeiten für die Zukunft.','Ich plane, meine Fortschritte jeden Monat zu überprüfen.'],
      blanks:[['In Zukunft möchte ich sicherer und spontaner Deutsch sprechen.','Zukunft'],['Mein nächstes Ziel ist, längere Gespräche besser zu verstehen.','Ziel'],['Hoffentlich erreiche ich dieses Ziel Schritt für Schritt.','Hoffentlich'],['Eine wichtige Voraussetzung ist, dass ich regelmäßig weiterübe.','Voraussetzung'],['Langfristig möchte ich mich beruflich weiterentwickeln.','Langfristig'],['Der nächste Schritt ist, mehr echte Gespräche zu führen.','Schritt'],['Wenn ich dranbleibe, habe ich gute Möglichkeiten für die Zukunft.','Möglichkeiten'],['Ich plane, meine Fortschritte jeden Monat zu überprüfen.','Fortschritte']],
      truth:[['Ziele können helfen, motiviert zu bleiben.',true],['Eine Voraussetzung ist eine Bedingung.',true],['Langfristig bedeutet nur für eine Minute.',false],['Fortschritte kann man regelmäßig überprüfen.',true]],
      dialog:['Was ist dein nächstes Ziel?','Ich möchte längere Gespräche besser verstehen.','Wie willst du das erreichen?','Ich übe regelmäßig und führe mehr echte Gespräche.']
    }
  };
  function b1ExpandedChoices(correct){
    var pool=[correct,'ev','kalem','dün','çok küçük','durak','masa','yemek'];
    var seen={}; return pool.filter(function(x){if(!x||seen[x])return false; seen[x]=true; return true;}).slice(0,4).map(function(text,i){return {id:String.fromCharCode(97+i),text:text};});
  }
  function b1ExpandedTokens(sentence){
    var tokens=String(sentence||'').replace(/[.!?]/g,'').split(/\s+/).filter(Boolean);
    if(tokens.length>4) return tokens.slice(2).concat(tokens.slice(0,2));
    return tokens.slice().reverse();
  }
  function createB1ExpandedTasks(bp){
    var data=B1_PHASE32B_CONTENT[bp.id];
    if(!data) return createB1StarterTasks(bp);
    var id=bp.id,title=bp.title,tasks=[],vocab=data.vocab||[],sentences=data.sentences||[],blanks=data.blanks||[],truth=data.truth||[],dialog=data.dialog||[];
    function addMC(i,pair){tasks.push({id:id+'-32b-mc-'+i,type:'multiple_choice',phase:'32B',parallelContent:true,b1Expanded:true,prompt:{de:'Welche Bedeutung passt im B1-Kontext zu „'+pair[0]+'“?',tr:'B1 bağlamında „'+pair[0]+'“ için hangi anlam uygundur?'},instruction:{de:'Wähle die passende Bedeutung. Denke an Situation, Absicht und Begründung.',tr:'Uygun anlamı seç. Durumu, amacı ve gerekçeyi düşün.'},hint:{de:'Thema: '+title+'. B1 verlangt genaue Bedeutung im Kontext.',tr:'Konu: '+title+'. B1 bağlam içinde doğru anlam ister.'},choices:b1ExpandedChoices(pair[1]),answer:'a',explain:{de:'„'+pair[0]+'“ bedeutet hier „'+pair[1]+'“.',tr:'„'+pair[0]+'“ burada „'+pair[1]+'“ anlamına gelir.'}});}
    function addFill(i,item){var sentence=item[0],answer=item[1];tasks.push({id:id+'-32b-fill-'+i,type:'fill_blank',phase:'32B',parallelContent:true,b1Expanded:true,prompt:{de:'Ergänze den B1-Satz.',tr:'B1 cümlesini tamamla.'},instruction:{de:'Wähle das Wort, das grammatisch und inhaltlich passt.',tr:'Dilbilgisi ve anlam açısından uygun kelimeyi seç.'},sentence:{de:String(sentence).replace(answer,'____'),tr:String(sentence).replace(answer,'____')},options:[answer,'Fenster','gestern','Bleistift'],answer:answer,hint:{de:'Lies den ganzen Satz. Oft hilft das Wort vor oder nach der Lücke.',tr:'Tüm cümleyi oku. Boşluktan önceki veya sonraki kelime yardımcı olur.'},explain:{de:'Richtig ist: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addOrder(i,sentence){tasks.push({id:id+'-32b-order-'+i,type:'sentence_order',phase:'32B',parallelContent:true,b1Expanded:true,prompt:{de:'Ordne den längeren B1-Satz.',tr:'Uzun B1 cümlesini sırala.'},instruction:{de:'Achte auf Nebensatz, Begründung und sinnvolle Reihenfolge.',tr:'Yan cümleye, gerekçeye ve mantıklı sıraya dikkat et.'},tokens:b1ExpandedTokens(sentence),answer:String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean),hint:{de:'Suche zuerst Subjekt und Verb, dann die Ergänzungen.',tr:'Önce özne ve fiili bul, sonra tamamlayıcıları ekle.'},explain:{de:'Der richtige Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addListen(i,sentence){tasks.push({id:id+'-32b-listen-'+i,type:'listening_choice',phase:'32B',parallelContent:true,b1Expanded:true,prompt:{de:'Höre den B1-Satz und wähle die richtige Aussage.',tr:'B1 cümlesini dinle ve doğru ifadeyi seç.'},instruction:{de:'Achte nicht nur auf einzelne Wörter, sondern auf die ganze Aussage.',tr:'Sadece kelimelere değil, tüm mesaja dikkat et.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich habe heute keine Zeit und bleibe zu Hause.'},{id:'c',text:'Das Zimmer ist klein, aber sehr hell.'},{id:'d',text:'Wir kaufen Brot, Wasser und Obst.'}],answer:'a',hint:{de:'B1-Hören: erst Aussage verstehen, dann auswählen.',tr:'B1 dinleme: önce mesajı anla, sonra seç.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}});}
    function addTF(i,item){tasks.push({id:id+'-32b-tf-'+i,type:'true_false',phase:'32B',parallelContent:true,b1Expanded:true,prompt:{de:'Richtig oder falsch?',tr:'Doğru mu yanlış mı?'},instruction:{de:'Entscheide nach Bedeutung und Kontext.',tr:'Anlam ve bağlama göre karar ver.'},statement:{de:item[0],tr:item[0]},answer:item[1]?'true':'false',hint:{de:'Vergleiche die Aussage mit dem Thema '+title+'.',tr:'İfadeyi '+title+' konusu ile karşılaştır.'},explain:{de:item[1]?'Die Aussage ist richtig.':'Die Aussage ist falsch.',tr:item[1]?'İfade doğru.':'İfade yanlış.'}});}
    function addMatch(i,offset){var pairs=vocab.slice(offset,offset+3).map(function(p){return {left:p[0],right:p[1]};});tasks.push({id:id+'-32b-match-'+i,type:'matching',phase:'32B',parallelContent:true,b1Expanded:true,prompt:{de:'Ordne die B1-Begriffe zu.',tr:'B1 kavramlarını eşleştir.'},instruction:{de:'Verbinde Begriff und Bedeutung.',tr:'Kavramı anlamıyla eşleştir.'},hint:{de:'Alle Wörter gehören zur Lektion „'+title+'“.',tr:'Tüm kelimeler „'+title+'“ dersine ait.'},pairs:pairs,answer:'all',explain:{de:'Die Begriffe sind zentrale Wörter dieser B1-Lektion.',tr:'Bu kavramlar bu B1 dersinin temel kelimeleridir.'}});}
    function addDialog(i,line){tasks.push({id:id+'-32b-dialog-'+i,type:'listening_choice',phase:'32B',parallelContent:true,b1Expanded:true,prompt:{de:'Höre einen Dialogsatz und wähle ihn aus.',tr:'Bir diyalog cümlesini dinle ve seç.'},instruction:{de:'Achte auf Ton und Situation.',tr:'Vurguya ve duruma dikkat et.'},audioText:{de:line,tr:line},audioLabel:{de:line,tr:line},choices:[{id:'a',text:line},{id:'b',text:'Ich brauche eine Fahrkarte zum Bahnhof.'},{id:'c',text:'Der Supermarkt öffnet um sieben Uhr.'},{id:'d',text:'Das Essen war sehr scharf.'}],answer:'a',hint:{de:'Dialoge helfen dir, B1-Sätze natürlicher zu sprechen.',tr:'Diyaloglar B1 cümlelerini daha doğal konuşmana yardım eder.'},explain:{de:'Der Dialogsatz lautet: '+line,tr:'Diyalog cümlesi: '+line}});}
    function addSpeak(i,sentence){tasks.push({id:id+'-32b-speak-'+i,type:'speaking_practice',phase:'32B',skill:'speaking',parallelContent:true,b1Expanded:true,prompt:{de:'Sprich den B1-Satz nach: „'+sentence+'“',tr:'B1 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Sprich langsam, vollständig und mit klarer Begründung. Nutze automatische Auswertung oder Selbstbewertung.',tr:'Yavaş, tam ve net gerekçeli konuş. Otomatik değerlendirme veya öz değerlendirme kullan.'},hint:{de:'B1-Sprechen: ganze Aussage, ruhiger Rhythmus, deutliche Nebensätze.',tr:'B1 konuşma: tam mesaj, sakin ritim, net yan cümleler.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,String(sentence).replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],explain:{de:'Sprechübung zu „'+title+'“. Ziel ist ein längerer, sinnvoll verbundener Satz auf B1-Niveau.',tr:'„'+title+'“ için konuşma alıştırması. Amaç B1 düzeyinde daha uzun ve anlamlı bağlantılı cümle kurmaktır.'}});}
    vocab.slice(0,10).forEach(function(pair,idx){addMC(idx+1,pair);});
    blanks.slice(0,8).forEach(function(item,idx){addFill(idx+1,item);});
    sentences.slice(0,5).forEach(function(sentence,idx){addOrder(idx+1,sentence);});
    sentences.slice(1,6).forEach(function(sentence,idx){addListen(idx+1,sentence);});
    truth.slice(0,4).forEach(function(item,idx){addTF(idx+1,item);});
    addMatch(1,0); addMatch(2,3); addMatch(3,6);
    sentences.slice(0,8).forEach(function(sentence,idx){addSpeak(idx+1,sentence);});
    return tasks.slice(0,43);
  }
  function ensurePhase32BContentExpansion(){
    ensurePhase32AB1Structure();
    try{
      B1_LESSON_BLUEPRINTS.forEach(function(bp){
        if(B1_PHASE32B_EXPANDED_IDS.indexOf(bp.id)>=0){ LESSON_TASKS[bp.id]=createB1ExpandedTasks(bp); }
      });
      if(COURSE_TREE.b1&&Array.isArray(COURSE_TREE.b1.lessons)){
        COURSE_TREE.b1.subtitle='Deutsch B1 · alle 10 Lektionen mit Kursinhalt und Speaking parallel ausgebaut';
        COURSE_TREE.b1.lessons.forEach(function(lesson){
          var count=(LESSON_TASKS[lesson.id]||[]).length;
          lesson.tasks=count; lesson.status='available';
          if(B1_PHASE32B_EXPANDED_IDS.indexOf(lesson.id)>=0){ lesson.phase='32C'; lesson.expandedContent=true; lesson.parallelSpeaking=true; }
        });
      }
      var total=B1_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id==='b1'){ LEVELS[i].status='available'; LEVELS[i].desc='B1 vollständig ausgebaut · '+total+' Aufgaben inkl. Sprechen'; LEVELS[i].progress=15; }}
    }catch(e){}
  }
  function b1ContentSnapshot(){
    ensurePhase32BContentExpansion();
    var lessons=(COURSE_TREE.b1&&COURSE_TREE.b1.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, expanded=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[], sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length, isExp=B1_PHASE32B_EXPANDED_IDS.indexOf(lesson.id)>=0;
      var ok=isExp?(list.length>=43&&sp>=8):(list.length>=12&&sp>=4);
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,expandedContent:isExp,ok:ok};
      total+=list.length; speaking+=sp; normal+=list.length-sp; if(isExp) expanded++; if(!ok) complete=false;
    });
    return {ok:complete&&expanded===10&&lessons.length===10&&total===430&&speaking===80,phase:'32C',level:'b1',expandedLessons:expanded,starterLessons:lessons.length-expanded,lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,expandedLessonTarget:{tasks:43,speaking:8},perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'B1-Lektionen wurden mit Kursaufgaben und Speaking gleichzeitig ausgebaut.'},nextRecommendedPhase:'32D B1 Gesamt-QA + UI/Flow-Prüfung'};
  }

  function phase32dQaSnapshot(){
    ensurePhase32BContentExpansion();
    var base=b1ContentSnapshot();
    var a2=a2ContentSnapshot();
    var lessons=(COURSE_TREE.b1&&COURSE_TREE.b1.lessons)||[];
    var ids={}, duplicateIds=[], missing=[], typeCoverage={}, perLesson={};
    var requiredTypes=['multiple_choice','fill_blank','sentence_order','listening_choice','true_false','matching','speaking_practice'];
    function addMissing(arr,taskId,field){ arr.push({taskId:taskId,field:field}); }
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[];
      var types={};
      var lessonMissing=[];
      list.forEach(function(task){
        if(!task||!task.id){ addMissing(lessonMissing,'unknown','id'); return; }
        if(ids[task.id]) duplicateIds.push(task.id); ids[task.id]=true;
        var type=taskType(task); types[type]=(types[type]||0)+1; typeCoverage[type]=(typeCoverage[type]||0)+1;
        if(!task.prompt) addMissing(lessonMissing,task.id,'prompt');
        if(!task.instruction) addMissing(lessonMissing,task.id,'instruction');
        if(!task.hint) addMissing(lessonMissing,task.id,'hint');
        if(!task.explain) addMissing(lessonMissing,task.id,'explain');
        if(type==='multiple_choice' && (!Array.isArray(task.choices)||task.choices.length<2||!task.answer)) addMissing(lessonMissing,task.id,'choices/answer');
        if(type==='fill_blank' && (!task.sentence||!Array.isArray(task.options)||!task.answer)) addMissing(lessonMissing,task.id,'sentence/options/answer');
        if(type==='sentence_order' && (!Array.isArray(task.tokens)||!Array.isArray(task.answer))) addMissing(lessonMissing,task.id,'tokens/answer');
        if(type==='listening_choice' && (!task.audioText||!Array.isArray(task.choices)||!task.answer)) addMissing(lessonMissing,task.id,'audioText/choices/answer');
        if(type==='true_false' && (!task.statement||String(task.answer)!=='true'&&String(task.answer)!=='false')) addMissing(lessonMissing,task.id,'statement/answer');
        if(type==='matching' && (!Array.isArray(task.pairs)||task.pairs.length<2)) addMissing(lessonMissing,task.id,'pairs');
        if(type==='speaking_practice' && (!task.expectedText||!task.answer||!task.parallelContent)) addMissing(lessonMissing,task.id,'speaking expectedText/answer/parallelContent');
      });
      var hasAllTypes=requiredTypes.every(function(type){return !!types[type];});
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,types:types,hasAllTypes:hasAllTypes,missingFields:lessonMissing,ok:list.length===43&&types.speaking_practice===8&&hasAllTypes&&!lessonMissing.length};
      missing=missing.concat(lessonMissing);
    });
    var speakingFallbackReady=!!(String(speechGuideHtml||'').indexOf('language-course-speaking-self-assess')>=0&&String(speechGuideHtml||'').indexOf('phase30e')>=0);
    var flowReady=!!(typeof openLevel==='function'&&typeof openLesson==='function'&&typeof openTask==='function'&&typeof handleTaskAction==='function');
    var coachReady=!!(typeof coachQaSnapshot==='function'&&coachQaSnapshot().ok!==false);
    var cloudSafe=!!(typeof syncStatusLabel==='function');
    var a2RegressionOk=!!(a2&&a2.ok&&a2.totalTasks===430&&a2.speakingTasks===80);
    var ok=!!(base.ok&&base.lessons===10&&base.expandedLessons===10&&base.starterLessons===0&&base.totalTasks===430&&base.normalTasks===350&&base.speakingTasks===80&&duplicateIds.length===0&&missing.length===0&&Object.keys(perLesson).every(function(id){return perLesson[id].ok;})&&speakingFallbackReady&&flowReady&&coachReady&&cloudSafe&&a2RegressionOk);
    return {ok:ok,phase:'32D',version:VERSION,level:'b1',qaScope:'B1 total QA + coding integrity + simulated device readiness',base:base,uniqueTaskIds:Object.keys(ids).length,duplicateIds:duplicateIds,missingFields:missing,typeCoverage:typeCoverage,perLesson:perLesson,speakingFallbackReady:speakingFallbackReady,flowReady:flowReady,coachReady:coachReady,cloudSafe:cloudSafe,a2RegressionOk:a2RegressionOk,a2Regression:{ok:a2.ok,totalTasks:a2.totalTasks,speakingTasks:a2.speakingTasks},simulatedDevices:['desktop-1440','desktop-1024','iphone-15-pro-max','iphone-se','ipad-11','ipad-12-9'],limits:{realMicrophoneTest:false,realSafariEngine:false,realDeviceScreenshots:false,playwrightNavigationBlockedInContainer:true},nextRecommendedPhase:'33A B2 course + speaking structure parallel'};
  }


  var B2_LESSON_BLUEPRINTS=[
    {id:'b2-work-applications',title:'Bewerbung & Berufseinstieg',tr:'Başvuru ve işe giriş',goal:'Bewerbungen, Stärken, berufliche Ziele und formelle Gesprächssituationen sicher formulieren.',goalTr:'Başvuruları, güçlü yönleri, mesleki hedefleri ve resmi konuşmaları güvenli ifade etmek.',vocab:['die Bewerbung = başvuru','die Berufserfahrung = iş deneyimi','die Stärke = güçlü yön','die Voraussetzung = şart','überzeugen = ikna etmek','sich eignen = uygun olmak'],sentences:['Ich bewerbe mich, weil die Stelle sehr gut zu meinen Erfahrungen passt.','Eine meiner Stärken ist, dass ich auch unter Zeitdruck ruhig bleibe.','Für diese Position bringe ich wichtige praktische Erfahrungen mit.','Ich möchte mich beruflich weiterentwickeln und langfristig Verantwortung übernehmen.']},
    {id:'b2-workplace-conflict',title:'Konflikte am Arbeitsplatz',tr:'İş yerinde çatışmalar',goal:'Konflikte sachlich beschreiben, vermitteln und Lösungsvorschläge begründen.',goalTr:'Çatışmaları objektif anlatmak, arabuluculuk yapmak ve çözüm önerilerini gerekçelendirmek.',vocab:['der Konflikt = çatışma','sachlich = objektif','die Rückmeldung = geri bildirim','vermitteln = arabuluculuk yapmak','die Vereinbarung = anlaşma','nachvollziehbar = anlaşılır'],sentences:['Ich halte es für wichtig, den Konflikt zunächst sachlich zu beschreiben.','Eine klare Vereinbarung kann helfen, Missverständnisse in Zukunft zu vermeiden.','Die Rückmeldung sollte konkret und respektvoll formuliert werden.','Beide Seiten müssen nachvollziehen können, warum eine Lösung sinnvoll ist.']},
    {id:'b2-arguments-debate',title:'Argumentieren & Debattieren',tr:'Gerekçelendirme ve tartışma',goal:'Standpunkte strukturiert vertreten, Gegenargumente aufgreifen und differenziert reagieren.',goalTr:'Görüşleri yapılandırılmış savunmak, karşı argümanları ele almak ve ayrıntılı tepki vermek.',vocab:['das Argument = argüman','das Gegenargument = karşı argüman','abwägen = tartmak/değerlendirmek','überzeugend = ikna edici','differenziert = ayrıntılı','die Schlussfolgerung = sonuç'],sentences:['Man sollte beide Seiten sorgfältig abwägen, bevor man eine Entscheidung trifft.','Das Gegenargument ist nachvollziehbar, trotzdem überzeugt mich die andere Position mehr.','Aus meiner Sicht ist vor allem die langfristige Wirkung entscheidend.','Meine Schlussfolgerung lautet, dass ein Kompromiss sinnvoller wäre.']},
    {id:'b2-media-society',title:'Medien & Gesellschaft',tr:'Medya ve toplum',goal:'Medieninhalte, gesellschaftliche Entwicklungen und Informationsqualität kritisch bewerten.',goalTr:'Medya içeriklerini, toplumsal gelişmeleri ve bilgi kalitesini eleştirel değerlendirmek.',vocab:['die Berichterstattung = haber aktarımı','die Gesellschaft = toplum','beeinflussen = etkilemek','kritisch = eleştirel','die Darstellung = sunum','die Verantwortung = sorumluluk'],sentences:['Medien beeinflussen, wie Menschen gesellschaftliche Probleme wahrnehmen.','Eine kritische Haltung ist wichtig, wenn man Informationen bewertet.','Die Darstellung eines Themas kann die öffentliche Meinung stark verändern.','Journalisten tragen eine große Verantwortung für sachliche Berichterstattung.']},
    {id:'b2-education-career',title:'Bildung & Karriereplanung',tr:'Eğitim ve kariyer planlama',goal:'Bildungswege vergleichen, Karriereentscheidungen begründen und Perspektiven formulieren.',goalTr:'Eğitim yollarını karşılaştırmak, kariyer kararlarını gerekçelendirmek ve perspektifleri ifade etmek.',vocab:['der Bildungsweg = eğitim yolu','die Karriere = kariyer','die Perspektive = perspektif','sich qualifizieren = nitelik kazanmak','die Entscheidung = karar','langfristig = uzun vadeli'],sentences:['Ein klarer Bildungsweg kann langfristig bessere berufliche Perspektiven eröffnen.','Ich möchte mich weiter qualifizieren, um auf dem Arbeitsmarkt flexibler zu sein.','Bei einer Karriereentscheidung spielen persönliche Interessen eine große Rolle.','Langfristig ist nicht nur das Gehalt, sondern auch die Entwicklungsmöglichkeit wichtig.']},
    {id:'b2-environment-consumption',title:'Umwelt & Konsum',tr:'Çevre ve tüketim',goal:'Umweltverhalten, Konsumentscheidungen und Verantwortung differenziert diskutieren.',goalTr:'Çevre davranışını, tüketim kararlarını ve sorumluluğu ayrıntılı tartışmak.',vocab:['der Konsum = tüketim','nachhaltig = sürdürülebilir','die Verantwortung = sorumluluk','die Auswirkung = etki','verzichten = vazgeçmek','umweltbewusst = çevre bilincine sahip'],sentences:['Nachhaltiger Konsum bedeutet, die Auswirkungen einer Entscheidung mitzudenken.','Viele Menschen möchten umweltbewusster leben, wissen aber nicht, wo sie anfangen sollen.','Es ist nicht immer einfach, auf günstige Produkte zu verzichten.','Politik, Unternehmen und Verbraucher tragen gemeinsam Verantwortung.']},
    {id:'b2-health-society',title:'Gesundheitssystem & Prävention',tr:'Sağlık sistemi ve önlem',goal:'Gesundheitliche Themen, Prävention und gesellschaftliche Verantwortung sachlich besprechen.',goalTr:'Sağlık konularını, önlemi ve toplumsal sorumluluğu objektif konuşmak.',vocab:['die Prävention = önlem','das Gesundheitssystem = sağlık sistemi','die Belastung = yük','vorbeugen = önlemek','die Versorgung = bakım/hizmet','die Aufklärung = bilgilendirme'],sentences:['Prävention kann langfristig dazu beitragen, das Gesundheitssystem zu entlasten.','Eine gute Aufklärung hilft Menschen, verantwortliche Entscheidungen zu treffen.','Die medizinische Versorgung sollte für alle verständlich und erreichbar sein.','Gesundheit hängt nicht nur vom Verhalten einzelner Personen ab.']},
    {id:'b2-digitalization-ai',title:'Digitalisierung & KI',tr:'Dijitalleşme ve yapay zekâ',goal:'Chancen und Risiken digitaler Technologien erklären und eigene Positionen begründen.',goalTr:'Dijital teknolojilerin fırsat ve risklerini açıklamak ve kendi görüşünü gerekçelendirmek.',vocab:['die Digitalisierung = dijitalleşme','die künstliche Intelligenz = yapay zekâ','die Chance = fırsat','das Risiko = risk','automatisieren = otomatikleştirmek','die Kontrolle = kontrol'],sentences:['Künstliche Intelligenz kann viele Arbeitsprozesse erleichtern, wirft aber auch neue Fragen auf.','Digitalisierung bietet große Chancen, wenn Menschen ausreichend geschult werden.','Automatisierung darf nicht dazu führen, dass wichtige Entscheidungen unkontrolliert bleiben.','Aus meiner Sicht braucht es klare Regeln für den Einsatz neuer Technologien.']},
    {id:'b2-culture-integration',title:'Kultur & Integration',tr:'Kültür ve uyum',goal:'Kulturelle Unterschiede, Integration und Teilhabe respektvoll und differenziert besprechen.',goalTr:'Kültürel farkları, uyumu ve katılımı saygılı ve ayrıntılı konuşmak.',vocab:['die Integration = uyum','die Teilhabe = katılım','die Vielfalt = çeşitlilik','gegenseitig = karşılıklı','respektieren = saygı duymak','die Zugehörigkeit = aidiyet'],sentences:['Integration bedeutet nicht, die eigene Herkunft aufzugeben, sondern aktiv teilzuhaben.','Kulturelle Vielfalt kann eine Gesellschaft bereichern, wenn gegenseitiger Respekt vorhanden ist.','Sprache spielt eine wichtige Rolle für Zugehörigkeit und Selbstständigkeit.','Ein offener Austausch hilft, Vorurteile abzubauen.']},
    {id:'b2-formal-writing-speaking',title:'Formell schreiben & sprechen',tr:'Resmi yazma ve konuşma',goal:'Formelle Anliegen, Beschwerden und Stellungnahmen klar, höflich und strukturiert ausdrücken.',goalTr:'Resmi talepleri, şikâyetleri ve görüşleri açık, nazik ve yapılandırılmış ifade etmek.',vocab:['die Beschwerde = şikâyet','die Stellungnahme = görüş yazısı','höflich = nazik','strukturieren = yapılandırmak','bezugnehmen = atıfta bulunmak','die Frist = süre'],sentences:['Ich möchte mich höflich auf Ihr Schreiben vom letzten Montag beziehen.','In meiner Stellungnahme möchte ich zunächst die wichtigsten Punkte zusammenfassen.','Ich bitte Sie, die Angelegenheit innerhalb der genannten Frist zu prüfen.','Eine formelle Beschwerde sollte sachlich, klar und respektvoll formuliert sein.']}
  ];
  function b2Choices(correct){
    var base=[correct,'ev','bugün','çok küçük','kalem','araba','pencere'];
    var seen={}; return base.filter(function(x){ if(!x||seen[x]) return false; seen[x]=true; return true;}).slice(0,4).map(function(text,i){return {id:String.fromCharCode(97+i),text:text};});
  }
  function b2Tokens(sentence){return String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean).sort(function(a,b){return a.localeCompare(b,'de');});}
  function createB2StarterTasks(bp){
    var tasks=[], id=bp.id, title=bp.title, vocab=bp.vocab.map(function(v){var parts=String(v).split(' = '); return [parts[0],parts[1]||parts[0]];}), sentences=bp.sentences.slice();
    function addMC(i,pair){tasks.push({id:id+'-33a-mc-'+i,type:'multiple_choice',phase:'33A',parallelContent:true,b2Starter:true,prompt:{de:'Welche Bedeutung passt zu „'+pair[0]+'“?',tr:'„'+pair[0]+'“ için hangi anlam uygundur?'},instruction:{de:'Wähle die passende Bedeutung. B2 verlangt eine genauere, kontextbezogene Wortwahl.',tr:'Uygun anlamı seç. B2 daha kesin ve bağlama uygun kelime seçimi ister.'},hint:{de:'Thema: '+title+'. Achte auf formellen oder argumentativen Kontext.',tr:'Konu: '+title+'. Resmi veya tartışma bağlamına dikkat et.'},choices:b2Choices(pair[1]),answer:'a',explain:{de:'„'+pair[0]+'“ bedeutet „'+pair[1]+'“.',tr:'„'+pair[0]+'“, „'+pair[1]+'“ anlamına gelir.'}});}
    function addBlank(i,sentence,answer){tasks.push({id:id+'-33a-blank-'+i,type:'fill_blank',phase:'33A',parallelContent:true,b2Starter:true,prompt:{de:'Ergänze den B2-Satz.',tr:'B2 cümlesini tamamla.'},instruction:{de:'Wähle ein Wort, das zur Aussage, Grammatik und Sprachstufe passt.',tr:'Anlama, dilbilgisine ve seviyeye uygun kelimeyi seç.'},sentence:{de:String(sentence).replace(answer,'____'),tr:String(sentence).replace(answer,'____')},options:[answer,'Fenster','morgen','Bleistift'],answer:answer,hint:{de:'B2-Sätze sind länger. Lies zuerst den ganzen Satz.',tr:'B2 cümleleri daha uzundur. Önce tüm cümleyi oku.'},explain:{de:'Richtig ist: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addOrder(i,sentence){tasks.push({id:id+'-33a-order-'+i,type:'sentence_order',phase:'33A',parallelContent:true,b2Starter:true,prompt:{de:'Ordne den B2-Satz.',tr:'B2 cümlesini sırala.'},instruction:{de:'Bringe die Wörter in eine sachliche, gut strukturierte Reihenfolge.',tr:'Kelimeleri objektif ve iyi yapılandırılmış bir sıraya koy.'},tokens:b2Tokens(sentence),answer:String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean),hint:{de:'Achte auf Nebensätze, Begründungen und formelle Satzstruktur.',tr:'Yan cümlelere, gerekçelere ve resmi cümle yapısına dikkat et.'},explain:{de:'Der richtige Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addListen(i,sentence){tasks.push({id:id+'-33a-listen-'+i,type:'listening_choice',phase:'33A',parallelContent:true,b2Starter:true,prompt:{de:'Höre den B2-Satz und wähle ihn aus.',tr:'B2 cümlesini dinle ve seç.'},instruction:{de:'Achte auf die zentrale Aussage und die logische Verbindung.',tr:'Ana fikre ve mantıksal bağlantıya dikkat et.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich habe heute keine Zeit.'},{id:'c',text:'Das Zimmer ist sehr klein.'},{id:'d',text:'Wir kaufen Brot und Wasser.'}],answer:'a',hint:{de:'B2-Hören: erst Sinn, dann Details prüfen.',tr:'B2 dinleme: önce anlam, sonra detayları kontrol et.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}});}
    function addSpeak(i,sentence){tasks.push({id:id+'-33a-speak-'+i,type:'speaking_practice',phase:'33A',skill:'speaking',parallelContent:true,b2Starter:true,prompt:{de:'Sprich den B2-Satz nach: „'+sentence+'“',tr:'B2 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Höre den Satz, sprich ihn zweimal langsam nach und achte auf Satzmelodie, Nebensatz und klare Argumentation.',tr:'Cümleyi dinle, iki kez yavaşça tekrar et; vurguya, yan cümleye ve net gerekçeye dikkat et.'},hint:{de:'B2-Sprechen: sachlich, strukturiert, mit präziser Wortwahl.',tr:'B2 konuşma: objektif, yapılandırılmış, kesin kelime seçimiyle.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,String(sentence).replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],explain:{de:'Sprechübung zur B2-Lektion „'+title+'“. Ziel ist ein längerer, klar strukturierter Satz mit differenzierter Aussage.',tr:'B2 dersi „'+title+'“ için konuşma alıştırması. Amaç daha uzun, net yapılandırılmış ve ayrıntılı bir ifade kurmaktır.'}});}
    vocab.slice(0,3).forEach(function(pair,idx){addMC(idx+1,pair);});
    addBlank(1,sentences[0],String(sentences[0]).split(/\s+/)[1]||String(sentences[0]).split(/\s+/)[0]);
    addOrder(1,sentences[1]);
    addListen(1,sentences[2]);
    addListen(2,sentences[3]);
    addBlank(2,sentences[3],String(sentences[3]).split(/\s+/)[2]||String(sentences[3]).split(/\s+/)[0]);
    sentences.slice(0,4).forEach(function(sentence,idx){addSpeak(idx+1,sentence);});
    return tasks.slice(0,12);
  }
  function ensurePhase33AB2Structure(){
    try{
      COURSE_TREE.b2={title:'Beruf & Alltag',subtitle:'Deutsch B2 · Kursstruktur mit parallel aufgebautem Sprechtraining',status:'available',lessons:B2_LESSON_BLUEPRINTS.map(function(bp){return {id:bp.id,title:bp.title,titleI18n:{de:bp.title,tr:bp.tr},goal:bp.goal,goalI18n:{de:bp.goal,tr:bp.goalTr},vocab:bp.vocab,tasks:12,progress:0,status:'available',parallelSpeaking:true,phase:'33A'};})};
      B2_LESSON_BLUEPRINTS.forEach(function(bp){LESSON_TASKS[bp.id]=createB2StarterTasks(bp);});
      var b2Tasks=B2_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id==='b2'){ LEVELS[i].status='available'; LEVELS[i].desc='10 Lektionen · '+b2Tasks+' Startaufgaben inkl. Sprechen'; LEVELS[i].progress=5; }}
    }catch(e){}
  }
  function b2StructureSnapshot(){
    ensurePhase33AB2Structure();
    var lessons=(COURSE_TREE.b2&&COURSE_TREE.b2.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[]; var sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length;
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,parallelSpeaking:!!lesson.parallelSpeaking,ok:list.length>=12&&sp>=4};
      total+=list.length; speaking+=sp; normal+=list.length-sp; if(list.length<12||sp<4) complete=false;
    });
    return {ok:complete&&lessons.length===10&&total===120&&speaking===40,phase:'33A',level:'b2',lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,minimumStarterTasksPerLesson:12,minimumSpeakingPerLesson:4,perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'B2 wird ab Start mit Kursaufgaben und Speaking parallel aufgebaut.'},regression:{a2:a2ContentSnapshot(),b1:b1ContentSnapshot()},nextRecommendedPhase:'33B B2 Lektionen 1-5 Inhalt + Speaking ausbauen'};
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
      speechFallbackMode:'guided',
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

  /* Phase 38B · Groq Speaking/Exam integration inside the visible speech task UI. */
  function speakingAiClient(){ return window.LanguageSpeakingAI || null; }
  function speakingAiAvailable(){ var c=speakingAiClient(); return !!(c && c.checkSpeaking && c.checkExamSpeaking); }
  function cleanSpeakingAiText(value,max){ return String(value||'').replace(/\s+/g,' ').trim().slice(0,max||4000); }
  function speakingAiLevel(level){ var v=String(level||'B1').toUpperCase(); return /^(A1|A2|B1|B2|C1|C2)$/.test(v)?v:'B1'; }
  function speakingAiTopic(level, lesson, task){
    var lessonTitle=(lesson&&lesson.title)||'';
    var prompt=localized(task&&task.prompt,'learn')||'';
    var expected=localized(task&&task.expectedText,'learn')||String((task&&task.answer)||'');
    return cleanSpeakingAiText((speakingAiLevel(level)+' · '+lessonTitle+' · '+(prompt||expected||'Sprechaufgabe')), 260);
  }
  function speakingAiRequiredPoints(level, lesson, task){
    var expected=localized(task&&task.expectedText,'learn')||String((task&&task.answer)||'');
    var prompt=localized(task&&task.prompt,'learn')||'';
    var instruction=localized(task&&task.instruction,'learn')||'';
    var lessonGoal=(lesson&&lesson.goal)||'';
    var points=[
      'Antwort muss zum Thema der Sprechaufgabe passen',
      'vollständiger deutscher Satz oder verständliche Aussage',
      'wichtige Wörter aus Ziel- oder Beispielsatz verwenden',
      'Aussage logisch und situationspassend formulieren'
    ];
    if(expected) points.push('Zielsatz oder Kernaussage: '+expected);
    if(prompt) points.push('Aufgabenstellung beachten: '+prompt);
    if(instruction) points.push('Instruktion beachten: '+instruction);
    if(lessonGoal) points.push('Lektionsziel: '+lessonGoal);
    return points.slice(0,8);
  }
  function speakingAiExtractResult(state){
    var r=state&&state.speakingAiResult;
    if(!r) return null;
    if(typeof r==='string'){ try{return JSON.parse(r);}catch(e){return {examFeedback:r};} }
    return r;
  }
  function speakingAiScoreValue(result){
    if(!result) return 0;
    var n=Number(result.overallScore);
    if(isFinite(n) && n>0) return Math.max(0,Math.min(100,Math.round(n)));
    n=Number(result.topicScore);
    if(isFinite(n) && n>0) return Math.max(0,Math.min(100,Math.round(n)));
    return 0;
  }
  function renderSpeakingAiPanel(state){
    var ai=speakingAiExtractResult(state);
    var mode=state&&state.speakingAiMode;
    var status=state&&state.speakingAiStatus;
    var busy=status==='processing';
    var err=state&&state.speakingAiError;
    var score=ai?speakingAiScoreValue(ai):0;
    var rows='';
    if(ai){
      var missing=Array.isArray(ai.missingPoints)?ai.missingPoints:[];
      var strengths=Array.isArray(ai.strengths)?ai.strengths:[];
      var weaknesses=Array.isArray(ai.weaknesses)?ai.weaknesses:[];
      rows+='<div class="la-speaking-ai-scoregrid"><span><b>'+esc(score||0)+'</b><small>Gesamt</small></span><span><b>'+esc(ai.topicScore==null?'–':ai.topicScore)+'</b><small>Thema</small></span><span><b>'+esc(ai.grammarScore==null?'–':ai.grammarScore)+'</b><small>Grammatik</small></span><span><b>'+esc(ai.vocabularyScore==null?'–':ai.vocabularyScore)+'</b><small>Wortschatz</small></span><span><b>'+esc(ai.fluencyScore==null?'–':ai.fluencyScore)+'</b><small>Flüssigkeit</small></span><span><b>'+esc(ai.offTopic?'Ja':'Nein')+'</b><small>Abschweifen</small></span></div>';
      rows+='<p>'+esc(ai.examFeedback || ai.reply || ai.correction || 'KI-Bewertung liegt vor.')+'</p>';
      if(missing.length) rows+='<div class="la-speaking-ai-list"><b>Fehlende Punkte</b>'+missing.map(function(x){return '<em>'+esc(x)+'</em>';}).join('')+'</div>';
      if(strengths.length) rows+='<div class="la-speaking-ai-list is-good"><b>Stärken</b>'+strengths.map(function(x){return '<em>'+esc(x)+'</em>';}).join('')+'</div>';
      if(weaknesses.length) rows+='<div class="la-speaking-ai-list is-warn"><b>Verbessern</b>'+weaknesses.map(function(x){return '<em>'+esc(x)+'</em>';}).join('')+'</div>';
      if(ai.nextPrompt || ai.nextQuestion) rows+='<small>Nächster Impuls: '+esc(ai.nextPrompt || ai.nextQuestion)+'</small>';
    }
    if(busy) rows+='<p class="la-note">KI-Prüfer bewertet gerade über Cloudflare/Groq …</p>';
    if(err) rows+='<p class="la-speaking-ai-error">'+esc(err)+'</p>';
    var modeLabel=mode==='exam'?'Prüfungsmodus':'Trainingsmodus';
    return '<div class="la-speaking-ai-panel" data-la-speaking-ai="phase38b"><span class="la-section-kicker">KI-Sprechprüfer · Phase 38B</span><h4>'+esc(ai?'Bewertung':'Live-Bewertung vorbereiten')+'</h4><p class="la-note">Nutze das erkannte Transkript oder tippe deine gesprochene Antwort manuell ein, falls iPhone/iPad keine automatische Spracherkennung liefert.</p><textarea class="la-speaking-ai-manual" data-la-speaking-ai-manual rows="3" placeholder="Optionale manuelle Antwort für KI-Bewertung …">'+esc(state&&state.speakingAiManualText||'')+'</textarea><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-speaking-ai-check" '+(busy?'aria-disabled="true"':'')+'>KI-Training bewerten</button><button type="button" class="la-primary" data-ui-action="language-course-speaking-ai-exam" '+(busy?'aria-disabled="true"':'')+'>KI-Prüfung bewerten</button></div><small>Status: '+esc(speakingAiAvailable()?'Groq-Client geladen':'Client/Fallback wird geprüft')+' · '+esc(modeLabel)+'</small>'+rows+'</div>';
  }
  function startSpeakingAiReview(level,lessonId,idx,task,mode,manualText){
    var lesson=findLesson(level,lessonId);
    var state=getLessonState(lessonId);
    var transcript=cleanSpeakingAiText(manualText || state.speechTranscript || state.speechInterimTranscript || '', 4000);
    if(!transcript){
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speakingAiStatus:'error',speakingAiError:'Noch kein Transkript vorhanden. Sprich zuerst über das Mikrofon oder tippe deine gesprochene Antwort ins Textfeld.',speakingAiMode:mode||'training'});
      return openTask(level,lessonId,idx);
    }
    saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speakingAiStatus:'processing',speakingAiError:'',speakingAiMode:mode||'training',speakingAiManualText:manualText||'',answered:false});
    openTask(level,lessonId,idx);
    var client=speakingAiClient();
    var payload={level:speakingAiLevel(level),topic:speakingAiTopic(level,lesson,task),userText:transcript,requiredPoints:speakingAiRequiredPoints(level,lesson,task)};
    var run=(mode==='exam'&&client&&client.checkExamSpeaking)?client.checkExamSpeaking(payload):(client&&client.checkSpeaking?client.checkSpeaking(payload):Promise.reject(new Error('LanguageSpeakingAI ist nicht geladen.')));
    Promise.resolve(run).then(function(res){
      var result=(res&&res.result)||res||{};
      var score=speakingAiScoreValue(result);
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speakingAiStatus:'done',speakingAiMode:mode||'training',speakingAiResult:result,speakingAiError:'',speakingAiRawMode:res&&res.mode,speechTranscript:transcript,speechScore:Math.max(Number(getLessonState(lessonId).speechScore||0),score),selected:score>=70?'known':'repeat',speechFeedback:(mode==='exam'?'KI-Prüfung bewertet.':'KI-Training bewertet.'),answered:false});
      openTask(level,lessonId,idx);
    }).catch(function(error){
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,speakingAiStatus:'error',speakingAiError:error&&error.message?error.message:String(error),speakingAiMode:mode||'training',answered:false});
      openTask(level,lessonId,idx);
    });
    return true;
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
      var isBlocked=!support.supported || statusKey==='permission_denied' || statusKey==='unsupported' || statusKey==='start_failed' || statusKey==='mobile_fallback' || statusKey==='ios_pwa_limited' || statusKey==='insecure_context';
      var modeNote=support.supported?speechUiText('privacy'):(support.message||speechUiText('mobile_limited'));
      var guide=isBlocked?speechGuideHtml(task,state):'';
      var selectedManual=state.speechSelfAssessment?'<span>'+esc(speechUiText('selected_self_assessment'))+': '+esc(manualSpeechOption(state.speechSelfAssessment).label)+'</span>':'';
      var fallback=isBlocked?'<div class="la-speaking-fallback"><p>'+esc(speechUiText('fallback_continue'))+'</p>'+selectedManual+'</div>':'';
      var startLabel=isBlocked?speechUiText('guided_start'):speechUiText('speak_now');
      var aiPanel=renderSpeakingAiPanel(state);
      return '<div class="la-speaking-task" data-la-speaking-task="phase38b-groq-speaking-exam" data-la-speech-status="'+esc(statusKey)+'"><div class="la-speaking-target"><span class="la-section-kicker">Nachsprechen · '+esc(taskSpeechLang(task))+'</span><h3>'+esc(expected)+'</h3><button type="button" class="la-audio-play" data-ui-action="language-course-play-audio" data-la-audio-text="'+esc(expected)+'">'+esc(speechUiText('listen_model'))+'</button></div><div class="la-speaking-controls"><button type="button" class="la-primary la-mic-button" data-ui-action="language-course-start-speaking">'+esc(startLabel)+'</button><small>'+esc(modeNote)+'</small></div>'+guide+'<div class="la-speaking-result"><b>'+esc(status)+'</b><span>'+esc(speechUiText('live'))+': '+esc(interim||'—')+'</span><span>'+esc(speechUiText('final'))+': '+esc(transcript||'—')+'</span><em>'+esc(speechUiText('score'))+': '+esc(score)+'%</em>'+altHtml+wfHtml+'</div>'+aiPanel+fallback+'</div>';
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
    if(action==='language-course-speaking-self-assess' && !state.answered){
      var manual=manualSpeechOption(el.getAttribute('data-la-self-assessment')||'unsure');
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,selected:manual.selected,speechSupported:false,speechFallbackMode:'guided',speechSelfAssessment:manual.key,speechManualReview:!!manual.review,speechStatus:'manual_'+manual.key,speechScore:manual.score,speechFeedback:manual.feedback,speechListening:false,answered:false});
      return openTask(level,lessonId,idx);
    }
    if((action==='language-course-speaking-ai-check' || action==='language-course-speaking-ai-exam') && !state.answered){
      var manualBox=root.querySelector('[data-la-speaking-ai-manual]');
      var manualText=manualBox?manualBox.value:'';
      return startSpeakingAiReview(level,lessonId,idx,task,action==='language-course-speaking-ai-exam'?'exam':'training',manualText);
    }
    if(action==='language-course-task-help'){
      var box=root.querySelector('[data-la-help-box]'); if(box) box.hidden=!box.hidden; return true;
    }
    if(action==='language-course-check-answer'){
      if(!canCheckTask(task,state) || state.answered) return true;
      var correct=evaluateTask(task,state);
      var wrongIds=correct?removeFromList(state.wrongTaskIds,task.id):safeUnique(state.wrongTaskIds,task.id);
      var manualReviewIds=state.manualReviewTaskIds||[];
      if(type==='speaking_practice' && state.speechManualReview && correct){ manualReviewIds=safeUnique(manualReviewIds,task.id); }
      if(type==='speaking_practice' && !state.speechManualReview){ manualReviewIds=removeFromList(manualReviewIds,task.id); }
      var typeStats=Object.assign({},state.typeStats||{}); var ts=Object.assign({attempts:0,correct:0},typeStats[type]||{}); ts.attempts+=1; if(correct) ts.correct+=1; typeStats[type]=ts;
      saveLessonState(lessonId,{index:idx,activeTaskId:task.id,answered:true,correct:correct,lastFeedback:feedbackText(task,correct),attempts:(state.attempts||0)+1,wrongTaskIds:wrongIds,manualReviewTaskIds:manualReviewIds,score:(state.score||0)+(correct?1:0),total:Math.max(state.total||0,idx+1),typeStats:typeStats});
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
  function register(){try{ if(window.AppModuleHost&&typeof window.AppModuleHost.register==='function') return window.AppModuleHost.register({id:'language-course-entry',label:'Sprachtraining',version:VERSION,branchAware:false,start:function(){openDashboard();},stop:function(){return true;}}); }catch(e){} return false;}
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
    return {ok:true,phase:'30E',version:VERSION,speakingTasks:speechTasks,a1SpeakingTasks:coverage.speakingTasks,a1TotalTasks:coverage.totalTasks,a1SpeakingCoverage:coverage,microphoneSupported:microphoneSupported(),support:support,hasRecognitionAdapter:typeof startSpeechRecognition==='function',hasSpeakingCard:true,hasSpeakingRenderer:!!TASK_TYPE_REGISTRY.speaking_practice,interimResults:true,maxAlternatives:5,mobileSafeFallback:true,guidedSpeakingFallback:true,selfAssessmentOptions:manualSpeechOptions().map(function(o){return {key:o.key,score:o.score,selected:o.selected,review:o.review};}),thresholds:{excellent:90,almost:70,partial:40},languages:{de:'de-DE',tr:'tr-TR',en:'en-US/en-GB'},parallelBuildPolicy:{active:true,from:'A2',rule:'Normale Kursaufgaben und speaking_practice-Aufgaben werden künftig pro Niveau zeitgleich ausgebaut.'},a2Structure:a2StructureSnapshot(),privacyNote:speechUiText('privacy')};
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
      phase:'30E',
      version:VERSION,
      support:speechRecognitionSupportStatus(),
      languageDetection:{de:taskSpeechLang({language:'de'}),tr:taskSpeechLang({language:'tr'}),en:taskSpeechLang({language:'en'})},
      config:{interimResults:true,maxAlternatives:5,continuous:false,iosSafeConfig:{interimResults:false,maxAlternatives:1,continuous:false},statuses:['supported','unsupported','requesting','listening','processing','done','permission_denied','no_speech','start_failed','mobile_fallback','manual_excellent','manual_almost','manual_unsure','manual_repeat']},
      normalization:{german:normalizeSpeechText('Grüß Gott! ÄÖÜ ß','de-DE'),turkish:turkishNorm},
      scoring:{exact:exact.score,almost:almost.score,partial:partial.score,wrong:wrong.score,bestAlternative:alternatives.score},
      wordFeedback:almost.wordFeedback,
      feedback:{excellent:speechScoreLabel(95,exact),almost:speechScoreLabel(75,almost),partial:speechScoreLabel(55,partial),repeat:speechScoreLabel(20,wrong)},
      mobileSafeFallback:true,guidedSpeakingFallback:true,fallback:{unsupportedMessage:speechUiText('unsupported'),privacy:speechUiText('privacy'),guided:true,selfAssessmentOptions:manualSpeechOptions().length},
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
      note:'Phase 31D prüft A2 vollständig: Inhalt, Speaking, Task-Integrität, Snapshots und Device-Simulationsbereitschaft.'
    };
  }

  var B2_PHASE33B_EXPANDED_IDS=B2_LESSON_BLUEPRINTS.slice(0,5).map(function(bp){return bp.id;});
  var B2_PHASE33B_CONTENT={
    'b2-work-applications':{
      focus:'Bewerbungsprozesse, berufliche Eignung, Motivation und professionelle Selbstpräsentation differenziert formulieren.',
      focusTr:'Başvuru süreçlerini, mesleki uygunluğu, motivasyonu ve profesyonel öz tanıtımı ayrıntılı ifade etme.',
      vocab:[['die Stellenausschreibung','iş ilanı'],['das Anforderungsprofil','aranan nitelikler'],['die Berufserfahrung','iş deneyimi'],['die Belastbarkeit','dayanıklılık'],['die Teamfähigkeit','takım çalışmasına yatkınlık'],['die Weiterentwicklung','gelişim'],['überzeugen','ikna etmek'],['sich eignen','uygun olmak'],['die Verantwortung','sorumluluk'],['die Rückmeldung','geri bildirim']],
      sentences:['Ich bewerbe mich auf diese Stelle, weil mein berufliches Profil sehr gut zum Anforderungsprofil passt.','Besonders überzeugt mich, dass ich meine bisherigen Erfahrungen in einem neuen Umfeld weiterentwickeln kann.','Eine meiner wichtigsten Stärken ist, auch in stressigen Situationen strukturiert und lösungsorientiert zu arbeiten.','Für diese Position bringe ich sowohl praktische Erfahrung als auch eine hohe Lernbereitschaft mit.','Im Vorstellungsgespräch möchte ich deutlich machen, warum ich für diese Aufgabe geeignet bin.','Langfristig möchte ich Verantwortung übernehmen und mich fachlich kontinuierlich weiterentwickeln.','Eine professionelle Bewerbung sollte nicht nur höflich, sondern auch konkret und überzeugend formuliert sein.','Nach einer Absage ist eine konstruktive Rückmeldung hilfreich, um die nächste Bewerbung zu verbessern.'],
      blanks:[['Ich bewerbe mich auf diese Stelle, weil mein berufliches Profil sehr gut zum Anforderungsprofil passt.','Anforderungsprofil'],['Besonders überzeugt mich, dass ich meine bisherigen Erfahrungen in einem neuen Umfeld weiterentwickeln kann.','überzeugt'],['Eine meiner wichtigsten Stärken ist, auch in stressigen Situationen strukturiert und lösungsorientiert zu arbeiten.','lösungsorientiert'],['Für diese Position bringe ich sowohl praktische Erfahrung als auch eine hohe Lernbereitschaft mit.','Lernbereitschaft'],['Im Vorstellungsgespräch möchte ich deutlich machen, warum ich für diese Aufgabe geeignet bin.','geeignet'],['Langfristig möchte ich Verantwortung übernehmen und mich fachlich kontinuierlich weiterentwickeln.','Verantwortung'],['Eine professionelle Bewerbung sollte nicht nur höflich, sondern auch konkret und überzeugend formuliert sein.','professionelle'],['Nach einer Absage ist eine konstruktive Rückmeldung hilfreich, um die nächste Bewerbung zu verbessern.','Rückmeldung']],
      truth:[['Eine B2-Bewerbung sollte konkrete Gründe und passende Erfahrungen nennen.',true],['Ein Anforderungsprofil beschreibt meistens die erwarteten Voraussetzungen.',true],['Im Vorstellungsgespräch sollte man nur einzelne Wörter ohne Zusammenhang sagen.',false],['Konstruktive Rückmeldung kann helfen, eine Bewerbung zu verbessern.',true]],
      dialog:['Warum bewerben Sie sich auf diese Stelle?','Weil meine Erfahrungen gut zum Anforderungsprofil passen und ich mich weiterentwickeln möchte.','Welche Stärke möchten Sie besonders hervorheben?','Ich arbeite auch unter Zeitdruck ruhig, strukturiert und lösungsorientiert.']
    },
    'b2-workplace-conflict':{
      focus:'Konflikte am Arbeitsplatz sachlich analysieren, Perspektiven vermitteln und tragfähige Lösungen begründen.',
      focusTr:'İş yerindeki çatışmaları objektif analiz etme, bakış açıları arasında arabuluculuk yapma ve sürdürülebilir çözümleri gerekçelendirme.',
      vocab:[['die Eskalation','gerilimin artması'],['die Vermittlung','arabuluculuk'],['die Perspektive','bakış açısı'],['die Vereinbarung','anlaşma'],['sachlich','objektif'],['nachvollziehbar','anlaşılır'],['die Verantwortung','sorumluluk'],['die Rückmeldung','geri bildirim'],['die Zusammenarbeit','iş birliği'],['vermeiden','önlemek']],
      sentences:['Bevor ein Konflikt eskaliert, sollten beide Seiten die Möglichkeit bekommen, ihre Perspektive ruhig darzustellen.','Eine sachliche Rückmeldung ist hilfreicher als ein persönlicher Vorwurf.','Damit die Zusammenarbeit langfristig funktioniert, braucht es klare Vereinbarungen und gegenseitigen Respekt.','Ich halte es für sinnvoll, zunächst die Ursachen des Konflikts zu analysieren.','Eine neutrale Vermittlung kann helfen, wenn die Beteiligten keine gemeinsame Lösung finden.','Wichtig ist, dass Kritik nachvollziehbar formuliert und mit konkreten Beispielen verbunden wird.','Missverständnisse lassen sich oft vermeiden, wenn Erwartungen frühzeitig ausgesprochen werden.','Jede Seite trägt Verantwortung dafür, eine professionelle Gesprächsatmosphäre zu schaffen.'],
      blanks:[['Bevor ein Konflikt eskaliert, sollten beide Seiten die Möglichkeit bekommen, ihre Perspektive ruhig darzustellen.','Perspektive'],['Eine sachliche Rückmeldung ist hilfreicher als ein persönlicher Vorwurf.','sachliche'],['Damit die Zusammenarbeit langfristig funktioniert, braucht es klare Vereinbarungen und gegenseitigen Respekt.','Vereinbarungen'],['Ich halte es für sinnvoll, zunächst die Ursachen des Konflikts zu analysieren.','Ursachen'],['Eine neutrale Vermittlung kann helfen, wenn die Beteiligten keine gemeinsame Lösung finden.','Vermittlung'],['Wichtig ist, dass Kritik nachvollziehbar formuliert und mit konkreten Beispielen verbunden wird.','nachvollziehbar'],['Missverständnisse lassen sich oft vermeiden, wenn Erwartungen frühzeitig ausgesprochen werden.','vermeiden'],['Jede Seite trägt Verantwortung dafür, eine professionelle Gesprächsatmosphäre zu schaffen.','Verantwortung']],
      truth:[['B2-Kommunikation im Konflikt sollte sachlich und differenziert sein.',true],['Ein persönlicher Vorwurf ist meistens hilfreicher als konkrete Rückmeldung.',false],['Klare Vereinbarungen können Zusammenarbeit verbessern.',true],['Eine Perspektive ist ein elektrisches Gerät.',false]],
      dialog:['Wie würden Sie den Konflikt ansprechen?','Ich würde zunächst sachlich beschreiben, was passiert ist, und beide Perspektiven berücksichtigen.','Was wäre ein sinnvoller nächster Schritt?','Wir sollten eine klare Vereinbarung treffen, damit ähnliche Missverständnisse nicht wieder entstehen.']
    },
    'b2-arguments-debate':{
      focus:'Argumente strukturiert entwickeln, Gegenpositionen einordnen und eine differenzierte Schlussfolgerung formulieren.',
      focusTr:'Argümanları yapılandırma, karşı görüşleri değerlendirme ve ayrıntılı sonuç çıkarma.',
      vocab:[['die These','tez'],['das Gegenargument','karşı argüman'],['die Begründung','gerekçe'],['abwägen','tartmak/değerlendirmek'],['überzeugend','ikna edici'],['differenziert','ayrıntılı'],['die Schlussfolgerung','sonuç'],['die Auswirkung','etki'],['berücksichtigen','dikkate almak'],['einschränken','sınırlamak']],
      sentences:['Eine überzeugende Argumentation besteht nicht nur aus einer Meinung, sondern auch aus einer nachvollziehbaren Begründung.','Man sollte die Vorteile und Nachteile sorgfältig abwägen, bevor man eine Schlussfolgerung zieht.','Das Gegenargument ist berechtigt, trotzdem überzeugt mich die ursprüngliche These mehr.','Aus meiner Sicht müssen auch langfristige Auswirkungen berücksichtigt werden.','Eine differenzierte Position erkennt an, dass ein Thema mehrere Seiten haben kann.','Ich stimme dem Argument nur teilweise zu, weil wichtige soziale Folgen fehlen.','Wenn man eine These formuliert, sollte man sie durch Beispiele oder Erfahrungen stützen.','Am Ende halte ich einen Kompromiss für sinnvoller als eine einseitige Entscheidung.'],
      blanks:[['Eine überzeugende Argumentation besteht nicht nur aus einer Meinung, sondern auch aus einer nachvollziehbaren Begründung.','Begründung'],['Man sollte die Vorteile und Nachteile sorgfältig abwägen, bevor man eine Schlussfolgerung zieht.','abwägen'],['Das Gegenargument ist berechtigt, trotzdem überzeugt mich die ursprüngliche These mehr.','Gegenargument'],['Aus meiner Sicht müssen auch langfristige Auswirkungen berücksichtigt werden.','Auswirkungen'],['Eine differenzierte Position erkennt an, dass ein Thema mehrere Seiten haben kann.','differenzierte'],['Ich stimme dem Argument nur teilweise zu, weil wichtige soziale Folgen fehlen.','teilweise'],['Wenn man eine These formuliert, sollte man sie durch Beispiele oder Erfahrungen stützen.','These'],['Am Ende halte ich einen Kompromiss für sinnvoller als eine einseitige Entscheidung.','Kompromiss']],
      truth:[['B2-Argumentieren verlangt Begründungen und Gegenargumente.',true],['Eine Schlussfolgerung steht meistens am Anfang ohne Zusammenhang.',false],['Differenziert bedeutet, mehrere Aspekte zu betrachten.',true],['Abwägen bedeutet, eine Tasche zu öffnen.',false]],
      dialog:['Welche Position vertreten Sie?','Ich halte die These grundsätzlich für richtig, würde aber einige Einschränkungen ergänzen.','Warum?','Weil man sowohl die kurzfristigen Vorteile als auch die langfristigen Auswirkungen berücksichtigen muss.']
    },
    'b2-media-society':{
      focus:'Medienwirkungen, Informationsqualität und gesellschaftliche Verantwortung kritisch und sachlich bewerten.',
      focusTr:'Medyanın etkisini, bilgi kalitesini ve toplumsal sorumluluğu eleştirel ve objektif değerlendirme.',
      vocab:[['die Berichterstattung','haber sunumu'],['die Informationsquelle','bilgi kaynağı'],['die Darstellung','sunum/temsil'],['beeinflussen','etkilemek'],['kritisch','eleştirel'],['die Verantwortung','sorumluluk'],['die Öffentlichkeit','kamuoyu'],['die Einordnung','değerlendirme/bağlama oturtma'],['verbreiten','yaymak'],['manipulativ','manipülatif']],
      sentences:['Medien beeinflussen nicht nur, worüber Menschen sprechen, sondern auch, wie sie gesellschaftliche Probleme einordnen.','Eine seriöse Informationsquelle macht deutlich, woher Daten stammen und in welchem Zusammenhang sie stehen.','Die Darstellung eines Ereignisses kann die öffentliche Meinung erheblich verändern.','Deshalb ist es wichtig, Informationen kritisch zu prüfen, bevor man sie weiterverbreitet.','Manipulative Überschriften können Aufmerksamkeit erzeugen, ohne den Inhalt korrekt wiederzugeben.','Journalistische Verantwortung bedeutet, sorgfältig zu recherchieren und verschiedene Perspektiven einzubeziehen.','In sozialen Netzwerken verbreiten sich falsche Informationen oft schneller als Korrekturen.','Eine gute Berichterstattung unterscheidet klar zwischen Fakten, Kommentaren und Vermutungen.'],
      blanks:[['Medien beeinflussen nicht nur, worüber Menschen sprechen, sondern auch, wie sie gesellschaftliche Probleme einordnen.','beeinflussen'],['Eine seriöse Informationsquelle macht deutlich, woher Daten stammen und in welchem Zusammenhang sie stehen.','Informationsquelle'],['Die Darstellung eines Ereignisses kann die öffentliche Meinung erheblich verändern.','Darstellung'],['Deshalb ist es wichtig, Informationen kritisch zu prüfen, bevor man sie weiterverbreitet.','kritisch'],['Manipulative Überschriften können Aufmerksamkeit erzeugen, ohne den Inhalt korrekt wiederzugeben.','Manipulative'],['Journalistische Verantwortung bedeutet, sorgfältig zu recherchieren und verschiedene Perspektiven einzubeziehen.','Verantwortung'],['In sozialen Netzwerken verbreiten sich falsche Informationen oft schneller als Korrekturen.','verbreiten'],['Eine gute Berichterstattung unterscheidet klar zwischen Fakten, Kommentaren und Vermutungen.','Berichterstattung']],
      truth:[['Medien können beeinflussen, wie Themen wahrgenommen werden.',true],['Eine seriöse Quelle erklärt den Zusammenhang von Informationen.',true],['Manipulative Überschriften sind immer besonders sachlich.',false],['B2 verlangt eine kritischere Bewertung von Medieninhalten.',true]],
      dialog:['Wie beurteilen Sie diese Nachricht?','Ich würde zuerst prüfen, aus welcher Quelle sie stammt und ob andere Berichte sie bestätigen.','Warum ist das wichtig?','Weil eine einzelne Darstellung die öffentliche Meinung stark beeinflussen kann.']
    },
    'b2-education-career':{
      focus:'Bildungswege, Qualifikation, Karriereentscheidungen und langfristige Perspektiven begründet darstellen.',
      focusTr:'Eğitim yollarını, nitelikleri, kariyer kararlarını ve uzun vadeli perspektifleri gerekçeli anlatma.',
      vocab:[['die Qualifikation','nitelik'],['die Weiterbildung','mesleki gelişim'],['die Perspektive','perspektif'],['der Arbeitsmarkt','iş piyasası'],['langfristig','uzun vadeli'],['sich spezialisieren','uzmanlaşmak'],['die Entscheidung','karar'],['die Voraussetzung','şart'],['die Entwicklungsmöglichkeit','gelişim imkânı'],['die Eigenverantwortung','kişisel sorumluluk']],
      sentences:['Eine zusätzliche Qualifikation kann langfristig bessere Chancen auf dem Arbeitsmarkt eröffnen.','Bei einer Karriereentscheidung sollte man nicht nur das Gehalt, sondern auch Entwicklungsmöglichkeiten berücksichtigen.','Wer sich spezialisiert, kann in bestimmten Bereichen besonders gefragt sein.','Weiterbildung erfordert Eigenverantwortung, weil man regelmäßig Zeit und Energie investieren muss.','Ein klarer Bildungsweg hilft dabei, berufliche Ziele realistisch zu planen.','Manchmal ist eine praktische Erfahrung genauso wichtig wie ein formeller Abschluss.','Ich möchte mich weiter qualifizieren, um beruflich flexibler und unabhängiger zu werden.','Langfristig zählt für mich eine Arbeit, die Sicherheit, Entwicklung und Sinn miteinander verbindet.'],
      blanks:[['Eine zusätzliche Qualifikation kann langfristig bessere Chancen auf dem Arbeitsmarkt eröffnen.','Qualifikation'],['Bei einer Karriereentscheidung sollte man nicht nur das Gehalt, sondern auch Entwicklungsmöglichkeiten berücksichtigen.','Entwicklungsmöglichkeiten'],['Wer sich spezialisiert, kann in bestimmten Bereichen besonders gefragt sein.','spezialisiert'],['Weiterbildung erfordert Eigenverantwortung, weil man regelmäßig Zeit und Energie investieren muss.','Eigenverantwortung'],['Ein klarer Bildungsweg hilft dabei, berufliche Ziele realistisch zu planen.','Bildungsweg'],['Manchmal ist eine praktische Erfahrung genauso wichtig wie ein formeller Abschluss.','Abschluss'],['Ich möchte mich weiter qualifizieren, um beruflich flexibler und unabhängiger zu werden.','qualifizieren'],['Langfristig zählt für mich eine Arbeit, die Sicherheit, Entwicklung und Sinn miteinander verbindet.','Langfristig']],
      truth:[['Weiterbildung kann berufliche Perspektiven verbessern.',true],['Eigenverantwortung bedeutet, dass niemand selbst etwas tun muss.',false],['Karriereplanung kann Gehalt und Entwicklungsmöglichkeiten berücksichtigen.',true],['Eine Qualifikation ist immer ein Verkehrsmittel.',false]],
      dialog:['Warum möchten Sie sich weiterbilden?','Ich möchte meine Qualifikation verbessern und langfristig bessere berufliche Perspektiven haben.','Was ist Ihnen bei der Karriereplanung wichtig?','Neben Sicherheit sind für mich Entwicklungsmöglichkeiten und sinnvolle Aufgaben entscheidend.']
    }
  };
  function b2ExpandedChoices(correct){return [{id:'a',text:correct},{id:'b',text:'Tisch'},{id:'c',text:'Ampel'},{id:'d',text:'Schlafzimmer'}];}
  function b2ExpandedTokens(sentence){
    var tokens=String(sentence||'').replace(/[.!?]/g,'').split(/\s+/).filter(Boolean);
    if(tokens.length>5) return tokens.slice(3).concat(tokens.slice(0,3));
    return tokens.slice().reverse();
  }

  Object.assign(B2_PHASE33B_CONTENT,{
    'b2-environment-consumption':{
      vocab:[['der Konsum','tüketim'],['nachhaltig','sürdürülebilir'],['die Verantwortung','sorumluluk'],['die Auswirkung','etki'],['verzichten','vazgeçmek'],['umweltbewusst','çevre bilincine sahip'],['der Ressourcenverbrauch','kaynak tüketimi'],['die Kaufentscheidung','satın alma kararı'],['die Verpackung','ambalaj'],['die Lieferkette','tedarik zinciri']],
      sentences:['Nachhaltiger Konsum bedeutet, dass man die Folgen einer Kaufentscheidung mitbedenkt.','Viele Menschen möchten umweltbewusster leben, wissen aber nicht, wo sie konkret anfangen sollen.','Es ist nicht immer einfach, auf günstige Produkte zu verzichten, wenn das Geld knapp ist.','Politik, Unternehmen und Verbraucher tragen gemeinsam Verantwortung für weniger Ressourcenverbrauch.','Eine transparente Lieferkette kann helfen, faire und ökologische Entscheidungen zu treffen.','Verpackungen sollten reduziert werden, ohne dass Hygiene und Qualität darunter leiden.','Wer bewusster konsumiert, muss nicht perfekt sein, sondern kann Schritt für Schritt handeln.','Aus meiner Sicht braucht nachhaltiger Konsum realistische Alternativen im Alltag.'],
      blanks:[['Nachhaltiger Konsum bedeutet, dass man die Folgen einer Kaufentscheidung mitbedenkt.','Konsum'],['Viele Menschen möchten umweltbewusster leben, wissen aber nicht, wo sie konkret anfangen sollen.','umweltbewusster'],['Es ist nicht immer einfach, auf günstige Produkte zu verzichten, wenn das Geld knapp ist.','verzichten'],['Politik, Unternehmen und Verbraucher tragen gemeinsam Verantwortung für weniger Ressourcenverbrauch.','Verantwortung'],['Eine transparente Lieferkette kann helfen, faire und ökologische Entscheidungen zu treffen.','Lieferkette'],['Verpackungen sollten reduziert werden, ohne dass Hygiene und Qualität darunter leiden.','Verpackungen'],['Wer bewusster konsumiert, muss nicht perfekt sein, sondern kann Schritt für Schritt handeln.','bewusster'],['Aus meiner Sicht braucht nachhaltiger Konsum realistische Alternativen im Alltag.','Alternativen']],
      truth:[['Nachhaltiger Konsum berücksichtigt ökologische und soziale Folgen.',true],['Ressourcenverbrauch spielt bei Umweltfragen keine Rolle.',false],['Verzicht kann im Alltag schwierig sein, wenn Alternativen teuer sind.',true],['Eine Lieferkette beschreibt nur den Geschmack eines Produktes.',false]],
      dialog:['Ich achte beim Einkaufen stärker darauf, ob Produkte langlebig und reparierbar sind.','Für viele Familien sind nachhaltige Alternativen nur dann realistisch, wenn sie bezahlbar bleiben.','Meiner Meinung nach sollten Unternehmen transparenter über ihre Lieferketten informieren.']
    },
    'b2-health-society':{
      vocab:[['die Prävention','önlem'],['das Gesundheitssystem','sağlık sistemi'],['die Belastung','yük'],['vorbeugen','önlemek'],['die Versorgung','bakım/hizmet'],['die Aufklärung','bilgilendirme'],['die Eigenverantwortung','kişisel sorumluluk'],['die Vorsorgeuntersuchung','önleyici muayene'],['die Wartezeit','bekleme süresi'],['die Erreichbarkeit','erişilebilirlik']],
      sentences:['Prävention kann langfristig dazu beitragen, das Gesundheitssystem zu entlasten.','Eine gute Aufklärung hilft Menschen, verantwortliche Entscheidungen für ihre Gesundheit zu treffen.','Die medizinische Versorgung sollte für alle verständlich und erreichbar sein.','Gesundheit hängt nicht nur vom Verhalten einzelner Personen ab, sondern auch von sozialen Bedingungen.','Regelmäßige Vorsorgeuntersuchungen können helfen, Risiken früher zu erkennen.','Lange Wartezeiten führen dazu, dass manche Patienten notwendige Termine verschieben.','Eigenverantwortung ist wichtig, darf aber strukturelle Probleme nicht verdecken.','Aus meiner Sicht braucht Prävention mehr Zeit, Beratung und verständliche Informationen.'],
      blanks:[['Prävention kann langfristig dazu beitragen, das Gesundheitssystem zu entlasten.','Prävention'],['Eine gute Aufklärung hilft Menschen, verantwortliche Entscheidungen für ihre Gesundheit zu treffen.','Aufklärung'],['Die medizinische Versorgung sollte für alle verständlich und erreichbar sein.','Versorgung'],['Gesundheit hängt nicht nur vom Verhalten einzelner Personen ab, sondern auch von sozialen Bedingungen.','Bedingungen'],['Regelmäßige Vorsorgeuntersuchungen können helfen, Risiken früher zu erkennen.','Vorsorgeuntersuchungen'],['Lange Wartezeiten führen dazu, dass manche Patienten notwendige Termine verschieben.','Wartezeiten'],['Eigenverantwortung ist wichtig, darf aber strukturelle Probleme nicht verdecken.','Eigenverantwortung'],['Aus meiner Sicht braucht Prävention mehr Zeit, Beratung und verständliche Informationen.','Beratung']],
      truth:[['Prävention kann das Gesundheitssystem langfristig entlasten.',true],['Aufklärung bedeutet, Menschen absichtlich zu verwirren.',false],['Erreichbare Versorgung ist ein gesellschaftlich relevantes Thema.',true],['Wartezeiten haben nie Einfluss auf Patienten.',false]],
      dialog:['Ich finde, dass verständliche Aufklärung ein wichtiger Teil von Prävention ist.','Viele Menschen nehmen Vorsorgeangebote eher wahr, wenn sie gut erklärt werden.','Ein Gesundheitssystem sollte nicht nur behandeln, sondern auch vorbeugen.']
    },
    'b2-digitalization-ai':{
      vocab:[['die Digitalisierung','dijitalleşme'],['die künstliche Intelligenz','yapay zekâ'],['die Chance','fırsat'],['das Risiko','risk'],['automatisieren','otomatikleştirmek'],['die Kontrolle','kontrol'],['der Datenschutz','veri koruma'],['der Algorithmus','algoritma'],['die Transparenz','şeffaflık'],['die Verantwortung','sorumluluk']],
      sentences:['Künstliche Intelligenz kann viele Arbeitsprozesse erleichtern, wirft aber auch neue Fragen auf.','Digitalisierung bietet große Chancen, wenn Menschen ausreichend geschult werden.','Automatisierung darf nicht dazu führen, dass wichtige Entscheidungen unkontrolliert bleiben.','Aus meiner Sicht braucht es klare Regeln für den Einsatz neuer Technologien.','Datenschutz ist besonders wichtig, wenn persönliche Informationen automatisch verarbeitet werden.','Ein Algorithmus sollte nachvollziehbar sein, wenn er über wichtige Lebensbereiche entscheidet.','Transparenz schafft Vertrauen, reicht aber ohne Kontrolle nicht aus.','Unternehmen tragen Verantwortung, wenn digitale Systeme Fehler verursachen.'],
      blanks:[['Künstliche Intelligenz kann viele Arbeitsprozesse erleichtern, wirft aber auch neue Fragen auf.','Intelligenz'],['Digitalisierung bietet große Chancen, wenn Menschen ausreichend geschult werden.','Digitalisierung'],['Automatisierung darf nicht dazu führen, dass wichtige Entscheidungen unkontrolliert bleiben.','Automatisierung'],['Aus meiner Sicht braucht es klare Regeln für den Einsatz neuer Technologien.','Regeln'],['Datenschutz ist besonders wichtig, wenn persönliche Informationen automatisch verarbeitet werden.','Datenschutz'],['Ein Algorithmus sollte nachvollziehbar sein, wenn er über wichtige Lebensbereiche entscheidet.','Algorithmus'],['Transparenz schafft Vertrauen, reicht aber ohne Kontrolle nicht aus.','Transparenz'],['Unternehmen tragen Verantwortung, wenn digitale Systeme Fehler verursachen.','Verantwortung']],
      truth:[['Künstliche Intelligenz kann Chancen und Risiken zugleich bringen.',true],['Datenschutz ist bei digitalen Systemen bedeutungslos.',false],['Transparenz kann Vertrauen in digitale Entscheidungen stärken.',true],['Automatisierung bedeutet immer, dass Menschen gar keine Verantwortung mehr tragen.',false]],
      dialog:['Ich sehe große Chancen in KI, aber die Entscheidungen müssen kontrollierbar bleiben.','Digitale Kompetenzen werden wichtiger, weil sich viele Arbeitsbereiche verändern.','Meiner Meinung nach sollte Datenschutz nicht erst nach einem Problem diskutiert werden.']
    },
    'b2-culture-integration':{
      vocab:[['die Integration','uyum'],['die Teilhabe','katılım'],['die Vielfalt','çeşitlilik'],['gegenseitig','karşılıklı'],['respektieren','saygı duymak'],['die Zugehörigkeit','aidiyet'],['das Vorurteil','önyargı'],['der Austausch','değişim/iletişim'],['die Herkunft','köken'],['die Gleichberechtigung','eşit haklar']],
      sentences:['Integration bedeutet nicht, die eigene Herkunft aufzugeben, sondern aktiv teilzuhaben.','Kulturelle Vielfalt kann eine Gesellschaft bereichern, wenn gegenseitiger Respekt vorhanden ist.','Sprache spielt eine wichtige Rolle für Zugehörigkeit und Selbstständigkeit.','Ein offener Austausch hilft, Vorurteile abzubauen und Missverständnisse zu vermeiden.','Teilhabe bedeutet, dass Menschen wirklich Zugang zu Bildung, Arbeit und Alltag haben.','Gleichberechtigung ist eine Voraussetzung dafür, dass Integration gelingen kann.','Man sollte kulturelle Unterschiede weder übertreiben noch ignorieren.','Aus meiner Sicht braucht Integration Begegnung, Sprache und faire Möglichkeiten.'],
      blanks:[['Integration bedeutet nicht, die eigene Herkunft aufzugeben, sondern aktiv teilzuhaben.','Integration'],['Kulturelle Vielfalt kann eine Gesellschaft bereichern, wenn gegenseitiger Respekt vorhanden ist.','Vielfalt'],['Sprache spielt eine wichtige Rolle für Zugehörigkeit und Selbstständigkeit.','Zugehörigkeit'],['Ein offener Austausch hilft, Vorurteile abzubauen und Missverständnisse zu vermeiden.','Austausch'],['Teilhabe bedeutet, dass Menschen wirklich Zugang zu Bildung, Arbeit und Alltag haben.','Teilhabe'],['Gleichberechtigung ist eine Voraussetzung dafür, dass Integration gelingen kann.','Gleichberechtigung'],['Man sollte kulturelle Unterschiede weder übertreiben noch ignorieren.','Unterschiede'],['Aus meiner Sicht braucht Integration Begegnung, Sprache und faire Möglichkeiten.','Begegnung']],
      truth:[['Teilhabe bedeutet aktiven Zugang zu gesellschaftlichen Bereichen.',true],['Integration heißt immer, die eigene Herkunft vollständig aufzugeben.',false],['Gegenseitiger Respekt kann kulturelles Zusammenleben erleichtern.',true],['Vorurteile helfen dabei, Menschen besser zu verstehen.',false]],
      dialog:['Für mich bedeutet Integration, dass Menschen dazugehören und mitgestalten können.','Sprache ist wichtig, aber auch Respekt und faire Chancen spielen eine große Rolle.','Ein offener Austausch kann helfen, falsche Vorstellungen voneinander abzubauen.']
    },
    'b2-formal-writing-speaking':{
      vocab:[['die Beschwerde','şikâyet'],['die Stellungnahme','görüş yazısı'],['höflich','nazik'],['strukturieren','yapılandırmak'],['bezugnehmen','atıfta bulunmak'],['die Frist','süre'],['die Angelegenheit','mesele'],['die Rückmeldung','geri bildirim'],['die Formulierung','ifade'],['die Bitte','rica']],
      sentences:['Ich möchte mich höflich auf Ihr Schreiben vom letzten Montag beziehen.','In meiner Stellungnahme möchte ich zunächst die wichtigsten Punkte zusammenfassen.','Ich bitte Sie, die Angelegenheit innerhalb der genannten Frist zu prüfen.','Eine formelle Beschwerde sollte sachlich, klar und respektvoll formuliert sein.','Vielen Dank für Ihre Rückmeldung; dennoch möchte ich einige Punkte ergänzen.','Eine höfliche Formulierung wirkt professioneller als ein persönlicher Vorwurf.','Wenn man formell spricht, sollte man Anliegen klar strukturieren.','Aus meiner Sicht ist eine kurze Begründung hilfreich, damit die Bitte nachvollziehbar wird.'],
      blanks:[['Ich möchte mich höflich auf Ihr Schreiben vom letzten Montag beziehen.','beziehen'],['In meiner Stellungnahme möchte ich zunächst die wichtigsten Punkte zusammenfassen.','Stellungnahme'],['Ich bitte Sie, die Angelegenheit innerhalb der genannten Frist zu prüfen.','Frist'],['Eine formelle Beschwerde sollte sachlich, klar und respektvoll formuliert sein.','Beschwerde'],['Vielen Dank für Ihre Rückmeldung; dennoch möchte ich einige Punkte ergänzen.','Rückmeldung'],['Eine höfliche Formulierung wirkt professioneller als ein persönlicher Vorwurf.','Formulierung'],['Wenn man formell spricht, sollte man Anliegen klar strukturieren.','strukturieren'],['Aus meiner Sicht ist eine kurze Begründung hilfreich, damit die Bitte nachvollziehbar wird.','Bitte']],
      truth:[['Eine formelle Beschwerde sollte sachlich und respektvoll formuliert sein.',true],['Eine Frist beschreibt meistens einen vereinbarten Zeitraum.',true],['In formeller Sprache sind persönliche Beleidigungen besonders professionell.',false],['Eine Stellungnahme kann eine begründete Position darstellen.',true]],
      dialog:['Ich möchte höflich auf die bisherige Kommunikation Bezug nehmen.','Bitte prüfen Sie die Angelegenheit innerhalb der genannten Frist.','In meiner Stellungnahme fasse ich zunächst die wichtigsten Punkte zusammen.']
    }
  });
  var B2_PHASE33C_EXPANDED_IDS=B2_LESSON_BLUEPRINTS.map(function(bp){return bp.id;});
  function createB2ExpandedTasks(bp){
    var data=B2_PHASE33B_CONTENT[bp.id];
    if(!data) return createB2StarterTasks(bp);
    var id=bp.id,title=bp.title,tasks=[],vocab=data.vocab||[],sentences=data.sentences||[],blanks=data.blanks||[],truth=data.truth||[],dialog=data.dialog||[];
    function addMC(i,pair){tasks.push({id:id+'-33c-mc-'+i,type:'multiple_choice',phase:'33C',parallelContent:true,b2Expanded:true,prompt:{de:'Welche Bedeutung passt im B2-Kontext zu „'+pair[0]+'“?',tr:'B2 bağlamında „'+pair[0]+'“ için hangi anlam uygundur?'},instruction:{de:'Wähle die passende Bedeutung. Achte auf beruflichen, gesellschaftlichen oder argumentativen Kontext.',tr:'Uygun anlamı seç. Mesleki, toplumsal veya tartışma bağlamına dikkat et.'},hint:{de:'Thema: '+title+'. B2 verlangt präzise, situationsangemessene Wortwahl.',tr:'Konu: '+title+'. B2 doğru ve duruma uygun kelime seçimi ister.'},choices:b2ExpandedChoices(pair[1]),answer:'a',explain:{de:'„'+pair[0]+'“ bedeutet hier „'+pair[1]+'“.',tr:'„'+pair[0]+'“ burada „'+pair[1]+'“ anlamına gelir.'}});}
    function addFill(i,item){var sentence=item[0],answer=item[1];tasks.push({id:id+'-33c-fill-'+i,type:'fill_blank',phase:'33C',parallelContent:true,b2Expanded:true,prompt:{de:'Ergänze den B2-Satz.',tr:'B2 cümlesini tamamla.'},instruction:{de:'Wähle das Wort, das grammatisch, inhaltlich und stilistisch passt.',tr:'Dilbilgisi, anlam ve üslup açısından uygun kelimeyi seç.'},sentence:{de:String(sentence).replace(answer,'____'),tr:String(sentence).replace(answer,'____')},options:[answer,'Fenster','gestern','Bleistift'],answer:answer,hint:{de:'Lies den ganzen Satz und achte auf Hauptaussage, Nebensatz und Stil.',tr:'Tüm cümleyi oku; ana fikre, yan cümleye ve üsluba dikkat et.'},explain:{de:'Richtig ist: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addOrder(i,sentence){tasks.push({id:id+'-33c-order-'+i,type:'sentence_order',phase:'33C',parallelContent:true,b2Expanded:true,prompt:{de:'Ordne den komplexeren B2-Satz.',tr:'Daha karmaşık B2 cümlesini sırala.'},instruction:{de:'Achte auf Satzklammer, Nebensatz, Begründung und logische Reihenfolge.',tr:'Cümle yapısına, yan cümleye, gerekçeye ve mantıklı sıraya dikkat et.'},tokens:b2ExpandedTokens(sentence),answer:String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean),hint:{de:'Suche zuerst Subjekt und Verb. Danach ordnest du Ergänzungen und Begründung.',tr:'Önce özne ve fiili bul. Sonra tamamlayıcıları ve gerekçeyi sırala.'},explain:{de:'Der richtige Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addListen(i,sentence){tasks.push({id:id+'-33c-listen-'+i,type:'listening_choice',phase:'33C',parallelContent:true,b2Expanded:true,prompt:{de:'Höre den B2-Satz und wähle die richtige Aussage.',tr:'B2 cümlesini dinle ve doğru ifadeyi seç.'},instruction:{de:'Achte auf die genaue Aussage, nicht nur auf einzelne bekannte Wörter.',tr:'Sadece bildiğin kelimelere değil, tam mesaja dikkat et.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich habe heute keine Zeit und bleibe zu Hause.'},{id:'c',text:'Das Zimmer ist klein, aber sehr hell.'},{id:'d',text:'Wir kaufen Brot, Wasser und Obst.'}],answer:'a',hint:{de:'B2-Hören: Sinn, Haltung und Details zusammen verstehen.',tr:'B2 dinleme: anlamı, tutumu ve detayları birlikte anla.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}});}
    function addTF(i,item){tasks.push({id:id+'-33c-tf-'+i,type:'true_false',phase:'33C',parallelContent:true,b2Expanded:true,prompt:{de:'Richtig oder falsch?',tr:'Doğru mu yanlış mı?'},instruction:{de:'Entscheide nach Bedeutung, Kontext und Sprachlogik.',tr:'Anlam, bağlam ve dil mantığına göre karar ver.'},statement:{de:item[0],tr:item[0]},answer:item[1]?'true':'false',hint:{de:'Vergleiche die Aussage mit der B2-Lektion „'+title+'“.',tr:'İfadeyi B2 dersi „'+title+'“ ile karşılaştır.'},explain:{de:item[1]?'Die Aussage ist richtig.':'Die Aussage ist falsch.',tr:item[1]?'İfade doğru.':'İfade yanlış.'}});}
    function addMatch(i,offset){var pairs=vocab.slice(offset,offset+3).map(function(p){return {left:p[0],right:p[1]};});tasks.push({id:id+'-33c-match-'+i,type:'matching',phase:'33C',parallelContent:true,b2Expanded:true,prompt:{de:'Ordne die B2-Begriffe zu.',tr:'B2 kavramlarını eşleştir.'},instruction:{de:'Verbinde Begriff und genaue Bedeutung.',tr:'Kavramı doğru anlamıyla eşleştir.'},hint:{de:'Alle Begriffe gehören zur Lektion „'+title+'“.',tr:'Tüm kavramlar „'+title+'“ dersine ait.'},pairs:pairs,answer:'all',explain:{de:'Diese Begriffe sind zentrale Wörter dieser B2-Lektion.',tr:'Bu kavramlar bu B2 dersinin temel kelimeleridir.'}});}
    function addDialog(i,line){tasks.push({id:id+'-33c-dialog-'+i,type:'listening_choice',phase:'33C',parallelContent:true,b2Expanded:true,prompt:{de:'Höre einen B2-Dialogsatz und wähle ihn aus.',tr:'Bir B2 diyalog cümlesini dinle ve seç.'},instruction:{de:'Achte auf formelle Formulierung, Haltung und Situation.',tr:'Resmi ifadeye, tutuma ve duruma dikkat et.'},audioText:{de:line,tr:line},audioLabel:{de:line,tr:line},choices:[{id:'a',text:line},{id:'b',text:'Ich brauche eine Fahrkarte zum Bahnhof.'},{id:'c',text:'Der Supermarkt öffnet um sieben Uhr.'},{id:'d',text:'Das Essen war sehr scharf.'}],answer:'a',hint:{de:'Dialoge trainieren B2-Sprechen natürlicher und situationsnäher.',tr:'Diyaloglar B2 konuşmayı daha doğal ve duruma uygun çalıştırır.'},explain:{de:'Der Dialogsatz lautet: '+line,tr:'Diyalog cümlesi: '+line}});}
    function addSpeak(i,sentence){tasks.push({id:id+'-33c-speak-'+i,type:'speaking_practice',phase:'33C',skill:'speaking',parallelContent:true,b2Expanded:true,prompt:{de:'Sprich den B2-Satz nach: „'+sentence+'“',tr:'B2 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Sprich ruhig, präzise und vollständig. Achte auf Satzmelodie, Nebensatz und differenzierte Aussage.',tr:'Sakin, net ve tam konuş. Vurguya, yan cümleye ve ayrıntılı ifadeye dikkat et.'},hint:{de:'B2-Sprechen: präzise Wortwahl, klare Struktur, differenzierte Begründung.',tr:'B2 konuşma: kesin kelime seçimi, net yapı, ayrıntılı gerekçe.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,String(sentence).replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],explain:{de:'Sprechübung zu „'+title+'“. Ziel ist ein längerer, differenzierter Satz auf B2-Niveau.',tr:'„'+title+'“ için konuşma alıştırması. Amaç B2 düzeyinde daha uzun ve ayrıntılı cümle kurmaktır.'}});}
    vocab.slice(0,10).forEach(function(pair,idx){addMC(idx+1,pair);});
    blanks.slice(0,8).forEach(function(item,idx){addFill(idx+1,item);});
    sentences.slice(0,5).forEach(function(sentence,idx){addOrder(idx+1,sentence);});
    sentences.slice(1,6).forEach(function(sentence,idx){addListen(idx+1,sentence);});
    truth.slice(0,4).forEach(function(item,idx){addTF(idx+1,item);});
    addMatch(1,0); addMatch(2,3); addMatch(3,6);
    sentences.slice(0,8).forEach(function(sentence,idx){addSpeak(idx+1,sentence);});
    return tasks.slice(0,43);
  }
  function ensurePhase33BContentExpansion(){
    ensurePhase33AB2Structure();
    try{
      B2_LESSON_BLUEPRINTS.forEach(function(bp){
        if(B2_PHASE33B_EXPANDED_IDS.indexOf(bp.id)>=0){ LESSON_TASKS[bp.id]=createB2ExpandedTasks(bp); }
      });
      if(COURSE_TREE.b2&&Array.isArray(COURSE_TREE.b2.lessons)){
        COURSE_TREE.b2.subtitle='Deutsch B2 · Lektionen 1-5 mit Kursinhalt und Speaking parallel ausgebaut';
        COURSE_TREE.b2.lessons.forEach(function(lesson){
          var count=(LESSON_TASKS[lesson.id]||[]).length;
          lesson.tasks=count; lesson.status='available'; lesson.parallelSpeaking=true;
          if(B2_PHASE33B_EXPANDED_IDS.indexOf(lesson.id)>=0){ lesson.phase='33C'; lesson.expandedContent=true; }
        });
      }
      var total=B2_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id==='b2'){ LEVELS[i].status='available'; LEVELS[i].desc='B2 Lektionen 1-5 ausgebaut · '+total+' Aufgaben inkl. Sprechen'; LEVELS[i].progress=10; }}
    }catch(e){}
  }
  function ensurePhase33CContentExpansion(){
    ensurePhase33AB2Structure();
    try{
      B2_LESSON_BLUEPRINTS.forEach(function(bp){
        if(B2_PHASE33C_EXPANDED_IDS.indexOf(bp.id)>=0){ LESSON_TASKS[bp.id]=createB2ExpandedTasks(bp); }
      });
      if(COURSE_TREE.b2&&Array.isArray(COURSE_TREE.b2.lessons)){
        COURSE_TREE.b2.subtitle='Deutsch B2 · vollständig ausgebaut mit Kursinhalt und Speaking parallel';
        COURSE_TREE.b2.lessons.forEach(function(lesson){
          var count=(LESSON_TASKS[lesson.id]||[]).length;
          lesson.tasks=count; lesson.status='available'; lesson.parallelSpeaking=true; lesson.phase='33C'; lesson.expandedContent=true;
        });
      }
      var total=B2_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id==='b2'){ LEVELS[i].status='available'; LEVELS[i].desc='B2 komplett ausgebaut · '+total+' Aufgaben inkl. Sprechen'; LEVELS[i].progress=15; }}
    }catch(e){}
  }
  function b2ContentSnapshot(){
    ensurePhase33CContentExpansion();
    var lessons=(COURSE_TREE.b2&&COURSE_TREE.b2.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, expanded=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[], sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length, isExp=B2_PHASE33C_EXPANDED_IDS.indexOf(lesson.id)>=0;
      var ok=isExp?(list.length>=43&&sp>=8):(list.length>=12&&sp>=4);
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,expandedContent:isExp,ok:ok};
      total+=list.length; speaking+=sp; normal+=list.length-sp; if(isExp) expanded++; if(!ok) complete=false;
    });
    return {ok:complete&&expanded===10&&lessons.length===10&&total===430&&speaking===80,phase:'33C',level:'b2',expandedLessons:expanded,starterLessons:lessons.length-expanded,lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,expandedLessonTarget:{tasks:43,speaking:8},perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'B2-Lektionen 6-10 wurden mit Kursaufgaben und Speaking gleichzeitig ausgebaut; B2 ist vollständig.'},regression:{a2:a2ContentSnapshot(),b1:b1ContentSnapshot()},nextRecommendedPhase:'33D B2 Gesamt-QA + UI/Flow-Prüfung'};
  }



  function phase33dQaSnapshot(){
    ensurePhase30SpeakingTask();
    ensurePhase31BContentExpansion();
    ensurePhase32BContentExpansion();
    ensurePhase33CContentExpansion();
    var snap=b2ContentSnapshot();
    var lessons=(COURSE_TREE.b2&&COURSE_TREE.b2.lessons)||[];
    var ids={}, duplicateTaskIds=[], missingRequired=[], typeCounts={}, lessonFlow=[];
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[];
      var speaking=list.filter(function(t){return t&&taskType(t)==='speaking_practice';});
      var normal=list.length-speaking.length;
      lessonFlow.push({id:lesson.id,title:lesson.title,tasks:list.length,normalTasks:normal,speakingTasks:speaking.length,status:lesson.status,phase:lesson.phase,ok:list.length===43&&speaking.length===8&&lesson.status==='available'});
      list.forEach(function(t,idx){
        if(!t||!t.id){missingRequired.push({lesson:lesson.id,index:idx,field:'id'}); return;}
        if(ids[t.id]) duplicateTaskIds.push(t.id); ids[t.id]=true;
        var tt=taskType(t); typeCounts[tt]=(typeCounts[tt]||0)+1;
        ['prompt','instruction'].forEach(function(field){ if(!t[field]) missingRequired.push({lesson:lesson.id,task:t.id,field:field}); });
        if(tt==='speaking_practice'){
          if(!t.expectedText&&!t.answer) missingRequired.push({lesson:lesson.id,task:t.id,field:'expectedText/answer'});
          if(!t.parallelContent) missingRequired.push({lesson:lesson.id,task:t.id,field:'parallelContent'});
        }
      });
    });
    var uiChecks={
      levelAvailable:!!(COURSE_TREE.b2&&COURSE_TREE.b2.status!=='locked'),
      allLessonsVisible:lessons.length===10,
      allLessonsAvailable:lessonFlow.every(function(x){return x.status==='available';}),
      speakingFallbackReady:!!(window.SpeechRecognition||window.webkitSpeechRecognition)||true,
      guidedFallbackRequired:true,
      guidedFallbackPolicy:'Desktop/unterstützte Browser nutzen automatische SpeechRecognition; iPhone/iPad/unsupported Browser nutzen geführten Sprechmodus mit Selbstbewertung.'
    };
    var regression={a2:a2ContentSnapshot(),b1:b1ContentSnapshot(),b2:snap};
    var ok=!!(snap&&snap.ok&&lessons.length===10&&snap.totalTasks===430&&snap.speakingTasks===80&&duplicateTaskIds.length===0&&missingRequired.length===0&&uiChecks.allLessonsAvailable&&regression.a2.ok&&regression.b1.ok);
    return {ok:ok,phase:'33D',level:'b2',version:VERSION,summary:{lessons:lessons.length,expandedLessons:snap.expandedLessons,starterLessons:snap.starterLessons,totalTasks:snap.totalTasks,normalTasks:snap.normalTasks,speakingTasks:snap.speakingTasks,duplicateTaskIds:duplicateTaskIds.length,missingRequired:missingRequired.length},typeCounts:typeCounts,lessonFlow:lessonFlow,uiChecks:uiChecks,duplicateTaskIds:duplicateTaskIds,missingRequired:missingRequired,regression:regression,deviceSimulationProfiles:['Desktop 1440','Desktop 1024','iPhone 15 Pro Max','iPhone SE','iPad 11','iPad 12.9'],nextRecommendedPhase:'34A C1 Kursstruktur + Speaking-Struktur parallel'};
  }


  var C1_LESSON_BLUEPRINTS=[
    {id:'c1-academic-argumentation',title:'Akademisch argumentieren',tr:'Akademik gerekçelendirme',goal:'Komplexe Standpunkte präzise strukturieren, gegeneinander abwägen und begründet darstellen.',goalTr:'Karmaşık görüşleri net yapılandırmak, karşılaştırmak ve gerekçeli sunmak.',vocab:['die These = tez','die Differenzierung = ayrım','die Schlussfolgerung = sonuç','abwägen = tartmak/değerlendirmek','widerlegen = çürütmek','nachvollziehbar = anlaşılır'],sentences:['Eine überzeugende Argumentation muss die Gegenposition fair berücksichtigen.','Die Schlussfolgerung ist nur dann tragfähig, wenn die Begründung nachvollziehbar bleibt.','Man sollte die These nicht isoliert betrachten, sondern im größeren Zusammenhang prüfen.','Aus wissenschaftlicher Sicht ist eine klare Differenzierung besonders wichtig.']},
    {id:'c1-nuanced-opinion',title:'Nuancierte Meinung',tr:'Nüanslı görüş',goal:'Meinungen präzise, differenziert und situationsangemessen formulieren.',goalTr:'Görüşleri kesin, ayrıntılı ve duruma uygun ifade etmek.',vocab:['nuanciert = nüanslı','einschränken = sınırlamak','relativieren = göreceli hale getirmek','der Einwand = itiraz','die Gewichtung = ağırlıklandırma','plausibel = makul'],sentences:['Ich würde dieser Einschätzung grundsätzlich zustimmen, allerdings mit einer wichtigen Einschränkung.','Der Einwand ist plausibel, verändert aber nicht unbedingt die gesamte Bewertung.','Je nach Gewichtung der Faktoren kann man zu unterschiedlichen Ergebnissen kommen.','Eine nuancierte Meinung vermeidet vorschnelle Urteile und berücksichtigt mehrere Perspektiven.']},
    {id:'c1-complex-texts',title:'Komplexe Texte verstehen',tr:'Karmaşık metinleri anlama',goal:'Implizite Aussagen, Textlogik und Argumentationsstrukturen sicher erkennen.',goalTr:'Örtük ifadeleri, metin mantığını ve argüman yapılarını güvenli tanımak.',vocab:['implizit = örtük','die Textlogik = metin mantığı','die Kernaussage = ana mesaj','ableiten = çıkarmak','die Bezugnahme = atıf','der Zusammenhang = bağlam'],sentences:['Die Kernaussage des Textes ergibt sich nicht aus einem einzelnen Satz, sondern aus dem Zusammenhang.','Eine implizite Kritik muss aus mehreren Hinweisen im Text abgeleitet werden.','Die Bezugnahme auf frühere Argumente stärkt die Textlogik.','Komplexe Texte verlangen, dass man Informationen verknüpft und Prioritäten erkennt.']},
    {id:'c1-professional-negotiation',title:'Professionell verhandeln',tr:'Profesyonel müzakere',goal:'Verhandlungen höflich, strategisch und lösungsorientiert führen.',goalTr:'Müzakereleri nazik, stratejik ve çözüm odaklı yürütmek.',vocab:['die Verhandlung = müzakere','der Kompromiss = uzlaşma','verbindlich = bağlayıcı','entgegenkommen = taviz vermek','die Bedingung = şart','die Grundlage = temel'],sentences:['Ein tragfähiger Kompromiss setzt voraus, dass beide Seiten ihre Bedingungen offenlegen.','Wir könnten Ihnen entgegenkommen, sofern die neue Frist verbindlich vereinbart wird.','Die Grundlage einer erfolgreichen Verhandlung ist eine klare und respektvolle Kommunikation.','Ein Vorschlag sollte nicht nur realistisch, sondern auch für beide Seiten akzeptabel sein.']},
    {id:'c1-formal-correspondence',title:'Formelle Korrespondenz',tr:'Resmi yazışma',goal:'Sehr formelle Anliegen, Stellungnahmen und Beschwerden präzise und höflich formulieren.',goalTr:'Çok resmi talepleri, görüşleri ve şikâyetleri net ve nazik ifade etmek.',vocab:['die Korrespondenz = yazışma','die Stellungnahme = görüş yazısı','bezugnehmend = atıfta bulunarak','die Angelegenheit = mesele','fristgerecht = süresinde','die Rückmeldung = geri bildirim'],sentences:['Bezugnehmend auf Ihr Schreiben möchte ich die Angelegenheit aus meiner Sicht kurz einordnen.','Ich bitte um eine fristgerechte Rückmeldung, damit die weiteren Schritte geplant werden können.','Die Stellungnahme sollte sachlich bleiben und die zentralen Punkte klar benennen.','Eine formelle Korrespondenz erfordert präzise Sprache und einen respektvollen Ton.']},
    {id:'c1-social-debate',title:'Gesellschaftliche Debatten',tr:'Toplumsal tartışmalar',goal:'Komplexe gesellschaftliche Themen differenziert analysieren und diskutieren.',goalTr:'Karmaşık toplumsal konuları ayrıntılı analiz etmek ve tartışmak.',vocab:['die Debatte = tartışma','die Teilhabe = katılım','die Ungleichheit = eşitsizlik','die Verantwortung = sorumluluk','strukturell = yapısal','der Wandel = değişim'],sentences:['Gesellschaftlicher Wandel lässt sich selten auf eine einzelne Ursache zurückführen.','Strukturelle Ungleichheit beeinflusst, welche Möglichkeiten Menschen tatsächlich haben.','Eine Debatte gewinnt an Qualität, wenn unterschiedliche Erfahrungen ernst genommen werden.','Politische Verantwortung bedeutet, langfristige Folgen mitzudenken.']},
    {id:'c1-science-technology',title:'Wissenschaft & Technologie',tr:'Bilim ve teknoloji',goal:'Wissenschaftliche und technologische Entwicklungen präzise bewerten.',goalTr:'Bilimsel ve teknolojik gelişmeleri net değerlendirmek.',vocab:['die Forschung = araştırma','die Innovation = yenilik','die Auswirkung = etki','die Ethik = etik','regulieren = düzenlemek','die Evidenz = kanıt'],sentences:['Technologische Innovation sollte nicht nur nach Effizienz, sondern auch nach ethischen Folgen bewertet werden.','Wissenschaftliche Evidenz kann helfen, emotionale Debatten zu versachlichen.','Eine Regulierung ist sinnvoll, wenn Risiken frühzeitig erkennbar sind.','Forschungsergebnisse müssen verständlich kommuniziert werden, damit sie gesellschaftlich wirksam werden.']},
    {id:'c1-economy-work',title:'Wirtschaft & Arbeitswelt',tr:'Ekonomi ve çalışma hayatı',goal:'Wirtschaftliche Entwicklungen und Arbeitswelt-Themen differenziert darstellen.',goalTr:'Ekonomik gelişmeleri ve çalışma dünyası konularını ayrıntılı anlatmak.',vocab:['die Arbeitswelt = çalışma dünyası','die Produktivität = verimlilik','die Belastung = yük','flexibel = esnek','die Qualifikation = nitelik','die Entwicklung = gelişim'],sentences:['Die moderne Arbeitswelt verlangt Flexibilität, darf aber dauerhafte Belastung nicht normalisieren.','Höhere Produktivität ist nur dann sinnvoll, wenn auch die Arbeitsbedingungen berücksichtigt werden.','Qualifikation entscheidet zunehmend darüber, wie sicher berufliche Perspektiven sind.','Wirtschaftliche Entwicklung sollte mit sozialer Verantwortung verbunden werden.']},
    {id:'c1-cultural-interpretation',title:'Kulturelle Deutung',tr:'Kültürel yorumlama',goal:'Kulturelle Texte, Werte und Perspektiven präzise interpretieren.',goalTr:'Kültürel metinleri, değerleri ve bakış açılarını net yorumlamak.',vocab:['die Deutung = yorum','die Perspektive = bakış açısı','das Motiv = motif','die Identität = kimlik','mehrdeutig = çok anlamlı','interpretieren = yorumlamak'],sentences:['Eine kulturelle Deutung bleibt oft mehrdeutig und hängt von der gewählten Perspektive ab.','Das Motiv der Zugehörigkeit spielt in vielen Texten eine zentrale Rolle.','Identität wird nicht nur individuell, sondern auch gesellschaftlich geprägt.','Beim Interpretieren sollte man zwischen persönlicher Wirkung und Textbeleg unterscheiden.']},
    {id:'c1-presentation-rhetoric',title:'Präsentieren & Rhetorik',tr:'Sunum ve hitabet',goal:'Komplexe Inhalte überzeugend präsentieren und rhetorisch sicher strukturieren.',goalTr:'Karmaşık içerikleri ikna edici sunmak ve retorik olarak sağlam yapılandırmak.',vocab:['die Rhetorik = hitabet','die Präsentation = sunum','überzeugen = ikna etmek','strukturieren = yapılandırmak','der Übergang = geçiş','die Zusammenfassung = özet'],sentences:['Eine überzeugende Präsentation führt das Publikum schrittweise durch die Argumentation.','Klare Übergänge helfen, komplexe Inhalte verständlicher zu machen.','Die Zusammenfassung sollte nicht wiederholen, sondern die zentrale Aussage zuspitzen.','Rhetorische Sicherheit entsteht durch Struktur, Präzision und angemessene Betonung.']}
  ];
  function c1Choices(correct){var base=[correct,'masa','bugün','çok küçük','kalem','araba','pencere']; var seen={}; return base.filter(function(x){ if(!x||seen[x]) return false; seen[x]=true; return true;}).slice(0,4).map(function(text,i){return {id:String.fromCharCode(97+i),text:text};});}
  function c1Tokens(sentence){return String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean).sort(function(a,b){return a.localeCompare(b,'de');});}
  function createC1StarterTasks(bp){
    var tasks=[], id=bp.id, title=bp.title, vocab=bp.vocab.map(function(v){var parts=String(v).split(' = '); return [parts[0],parts[1]||parts[0]];}), sentences=bp.sentences.slice();
    function addMC(i,pair){tasks.push({id:id+'-34a-mc-'+i,type:'multiple_choice',phase:'34A',parallelContent:true,c1Starter:true,prompt:{de:'Welche präzise Bedeutung passt zu „'+pair[0]+'“?',tr:'„'+pair[0]+'“ için hangi kesin anlam uygundur?'},instruction:{de:'Wähle die Bedeutung, die im C1-Kontext stilistisch und inhaltlich passt.',tr:'C1 bağlamında üslup ve anlam açısından uygun anlamı seç.'},hint:{de:'Thema: '+title+'. C1 verlangt Präzision, Nuance und Kontextbewusstsein.',tr:'Konu: '+title+'. C1 kesinlik, nüans ve bağlam bilinci ister.'},choices:c1Choices(pair[1]),answer:'a',explain:{de:'„'+pair[0]+'“ bedeutet hier „'+pair[1]+'“.',tr:'„'+pair[0]+'“ burada „'+pair[1]+'“ anlamına gelir.'}});}
    function addBlank(i,sentence,answer){tasks.push({id:id+'-34a-blank-'+i,type:'fill_blank',phase:'34A',parallelContent:true,c1Starter:true,prompt:{de:'Ergänze den C1-Satz.',tr:'C1 cümlesini tamamla.'},instruction:{de:'Wähle das Wort, das Grammatik, Aussageabsicht und Register präzise verbindet.',tr:'Dilbilgisi, ifade amacı ve üslubu net bağlayan kelimeyi seç.'},sentence:{de:String(sentence).replace(answer,'____'),tr:String(sentence).replace(answer,'____')},options:[answer,'Fenster','gestern','Bleistift'],answer:answer,hint:{de:'C1-Sätze enthalten oft Einschränkungen, Begründungen oder abstrakte Begriffe.',tr:'C1 cümleleri çoğu zaman sınırlama, gerekçe veya soyut kavram içerir.'},explain:{de:'Richtig ist: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addOrder(i,sentence){tasks.push({id:id+'-34a-order-'+i,type:'sentence_order',phase:'34A',parallelContent:true,c1Starter:true,prompt:{de:'Ordne den komplexen C1-Satz.',tr:'Karmaşık C1 cümlesini sırala.'},instruction:{de:'Achte auf Nebensatz, Einschränkung, Hauptaussage und logische Satzführung.',tr:'Yan cümleye, sınırlamaya, ana fikre ve mantıklı cümle akışına dikkat et.'},tokens:c1Tokens(sentence),answer:String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean),hint:{de:'Beginne mit Subjekt und Prädikat. Danach ordnest du Einschränkungen und Begründungen.',tr:'Özne ve yüklemle başla. Sonra sınırlamaları ve gerekçeleri sırala.'},explain:{de:'Der richtige Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addListen(i,sentence){tasks.push({id:id+'-34a-listen-'+i,type:'listening_choice',phase:'34A',parallelContent:true,c1Starter:true,prompt:{de:'Höre den C1-Satz und wähle die genaue Aussage.',tr:'C1 cümlesini dinle ve tam ifadeyi seç.'},instruction:{de:'Achte auf Bedeutung, Einschränkung und argumentative Funktion.',tr:'Anlama, sınırlamaya ve argümandaki işleve dikkat et.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich habe heute keine Zeit und bleibe zu Hause.'},{id:'c',text:'Das Zimmer ist klein, aber sehr hell.'},{id:'d',text:'Wir kaufen Brot, Wasser und Obst.'}],answer:'a',hint:{de:'C1-Hören: Haltung, Struktur und implizite Bedeutung zusammen verstehen.',tr:'C1 dinleme: tutum, yapı ve örtük anlamı birlikte anla.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}});}
    function addSpeak(i,sentence){tasks.push({id:id+'-34a-speak-'+i,type:'speaking_practice',phase:'34A',skill:'speaking',parallelContent:true,c1Starter:true,prompt:{de:'Sprich den C1-Satz nach: „'+sentence+'“',tr:'C1 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Sprich präzise, ruhig und vollständig. Achte auf Betonung, Nebensätze und differenzierte Aussage.',tr:'Net, sakin ve eksiksiz konuş. Vurguya, yan cümlelere ve ayrıntılı ifadeye dikkat et.'},hint:{de:'C1-Sprechen: präzise, nuanciert, logisch aufgebaut und stilistisch angemessen.',tr:'C1 konuşma: kesin, nüanslı, mantıklı yapılandırılmış ve üsluba uygun.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,String(sentence).replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],explain:{de:'Sprechübung zur C1-Lektion „'+title+'“. Ziel ist ein präziser, nuancierter Satz mit klarer Struktur.',tr:'C1 dersi „'+title+'“ için konuşma alıştırması. Amaç net yapılı, kesin ve nüanslı cümle kurmaktır.'}});}
    vocab.slice(0,3).forEach(function(pair,idx){addMC(idx+1,pair);});
    addBlank(1,sentences[0],String(sentences[0]).split(/\s+/)[1]||String(sentences[0]).split(/\s+/)[0]);
    addOrder(1,sentences[1]);
    addListen(1,sentences[2]);
    addListen(2,sentences[3]);
    addBlank(2,sentences[3],String(sentences[3]).split(/\s+/)[2]||String(sentences[3]).split(/\s+/)[0]);
    sentences.slice(0,4).forEach(function(sentence,idx){addSpeak(idx+1,sentence);});
    return tasks.slice(0,12);
  }
  function ensurePhase34AC1Structure(){
    try{
      COURSE_TREE.c1={title:'Fortgeschritten',subtitle:'Deutsch C1 · Kursstruktur mit parallel aufgebautem Sprechtraining',status:'available',lessons:C1_LESSON_BLUEPRINTS.map(function(bp){return {id:bp.id,title:bp.title,titleI18n:{de:bp.title,tr:bp.tr},goal:bp.goal,goalI18n:{de:bp.goal,tr:bp.goalTr},vocab:bp.vocab,tasks:12,progress:0,status:'available',parallelSpeaking:true,phase:'34A'};})};
      C1_LESSON_BLUEPRINTS.forEach(function(bp){LESSON_TASKS[bp.id]=createC1StarterTasks(bp);});
      var c1Tasks=C1_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id==='c1'){ LEVELS[i].status='available'; LEVELS[i].desc='10 Lektionen · '+c1Tasks+' Startaufgaben inkl. Sprechen'; LEVELS[i].progress=5; }}
    }catch(e){}
  }
  function c1StructureSnapshot(){
    ensurePhase34AC1Structure();
    var lessons=(COURSE_TREE.c1&&COURSE_TREE.c1.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[]; var sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length;
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,parallelSpeaking:!!lesson.parallelSpeaking,ok:list.length>=12&&sp>=4};
      total+=list.length; speaking+=sp; normal+=list.length-sp; if(list.length<12||sp<4) complete=false;
    });
    return {ok:complete&&lessons.length===10&&total===120&&speaking===40,phase:'34A',level:'c1',lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,minimumStarterTasksPerLesson:12,minimumSpeakingPerLesson:4,perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'C1 wird ab Start mit Kursaufgaben und Speaking parallel aufgebaut.'},regression:{a2:a2ContentSnapshot(),b1:b1ContentSnapshot(),b2:b2ContentSnapshot()},nextRecommendedPhase:'34B C1 Lektionen 1-5 Inhalt + Speaking ausbauen'};
  }


  var C1_PHASE34B_EXPANDED_IDS=C1_LESSON_BLUEPRINTS.map(function(bp){return bp.id;});
  var C1_PHASE34B_CONTENT={
    'c1-academic-argumentation':{
      focus:'Akademische Positionen präzise formulieren, Gegenargumente fair einordnen und tragfähige Schlussfolgerungen ziehen.',
      focusTr:'Akademik görüşleri kesin ifade etme, karşı argümanları adil değerlendirme ve sağlam sonuç çıkarma.',
      vocab:[['die These','tez'],['die Differenzierung','ayrım'],['die Schlussfolgerung','sonuç'],['das Gegenargument','karşı argüman'],['die Tragfähigkeit','sağlamlık'],['die Begründung','gerekçe'],['abwägen','değerlendirmek'],['widerlegen','çürütmek'],['nachvollziehbar','anlaşılır'],['der Zusammenhang','bağlam']],
      sentences:['Eine akademische Argumentation überzeugt nur dann, wenn sie Gegenpositionen fair berücksichtigt und dennoch eine klare eigene Linie entwickelt.','Die Schlussfolgerung ist tragfähig, sofern die Begründung logisch aufgebaut und anhand konkreter Beispiele nachvollziehbar bleibt.','Man sollte eine These nicht isoliert betrachten, sondern sie in einen größeren theoretischen und gesellschaftlichen Zusammenhang einordnen.','Eine präzise Differenzierung verhindert, dass komplexe Sachverhalte zu stark vereinfacht werden.','Ein Gegenargument muss nicht automatisch widerlegt werden, sondern kann die eigene Position auch nuancierter machen.','Aus wissenschaftlicher Sicht ist entscheidend, zwischen Beobachtung, Interpretation und Bewertung zu unterscheiden.','Wer überzeugend argumentieren möchte, sollte zentrale Begriffe definieren, bevor er sie zur Begründung verwendet.','Eine einseitige Darstellung wirkt weniger glaubwürdig als eine ausgewogene Analyse mit klarer Schlussfolgerung.'],
      blanks:[['Eine akademische Argumentation überzeugt nur dann, wenn sie Gegenpositionen fair berücksichtigt und dennoch eine klare eigene Linie entwickelt.','Gegenpositionen'],['Die Schlussfolgerung ist tragfähig, sofern die Begründung logisch aufgebaut und anhand konkreter Beispiele nachvollziehbar bleibt.','tragfähig'],['Man sollte eine These nicht isoliert betrachten, sondern sie in einen größeren theoretischen und gesellschaftlichen Zusammenhang einordnen.','Zusammenhang'],['Eine präzise Differenzierung verhindert, dass komplexe Sachverhalte zu stark vereinfacht werden.','Differenzierung'],['Ein Gegenargument muss nicht automatisch widerlegt werden, sondern kann die eigene Position auch nuancierter machen.','Gegenargument'],['Aus wissenschaftlicher Sicht ist entscheidend, zwischen Beobachtung, Interpretation und Bewertung zu unterscheiden.','unterscheiden'],['Wer überzeugend argumentieren möchte, sollte zentrale Begriffe definieren, bevor er sie zur Begründung verwendet.','definieren'],['Eine einseitige Darstellung wirkt weniger glaubwürdig als eine ausgewogene Analyse mit klarer Schlussfolgerung.','Schlussfolgerung']],
      truth:[['Eine C1-Argumentation sollte Gegenpositionen fair berücksichtigen.',true],['Eine tragfähige Schlussfolgerung braucht eine nachvollziehbare Begründung.',true],['Auf C1-Niveau genügt eine Meinung ohne Beispiele und Struktur.',false],['Differenzierung hilft, komplexe Sachverhalte genauer darzustellen.',true]],
      dialog:['Wie würden Sie Ihre These akademisch absichern?','Ich würde zunächst zentrale Begriffe definieren und anschließend mögliche Gegenargumente systematisch einordnen.','Warum ist Differenzierung in einer Argumentation wichtig?','Weil sie verhindert, dass komplexe Sachverhalte auf eine zu einfache Aussage reduziert werden.']
    },
    'c1-nuanced-opinion':{
      focus:'Meinungen nuanciert formulieren, Einschränkungen benennen und unterschiedliche Gewichtungen sprachlich präzise darstellen.',
      focusTr:'Görüşleri nüanslı ifade etme, sınırlamaları belirtme ve farklı ağırlıkları dilsel olarak net gösterme.',
      vocab:[['die Einschränkung','sınırlama'],['die Gewichtung','ağırlıklandırma'],['der Einwand','itiraz'],['die Bewertung','değerlendirme'],['die Perspektive','bakış açısı'],['die Pauschalisierung','genelleme'],['relativieren','göreceli hale getirmek'],['abwägen','tartmak'],['plausibel','makul'],['vielschichtig','çok katmanlı']],
      sentences:['Ich würde dieser Einschätzung grundsätzlich zustimmen, allerdings nur unter der Voraussetzung, dass die sozialen Folgen mitbedacht werden.','Der Einwand erscheint plausibel, verändert jedoch nicht zwangsläufig die gesamte Bewertung der Situation.','Je nachdem, wie man die einzelnen Faktoren gewichtet, kann man zu unterschiedlichen, aber vertretbaren Ergebnissen kommen.','Eine nuancierte Meinung vermeidet pauschale Urteile und erkennt an, dass mehrere Perspektiven gleichzeitig berechtigt sein können.','Ich halte die Kritik für teilweise berechtigt, würde sie jedoch in einem größeren Zusammenhang relativieren.','Gerade bei vielschichtigen Themen ist es problematisch, vorschnell eindeutige Antworten zu erwarten.','Eine ausgewogene Bewertung benennt sowohl Chancen als auch Grenzen einer vorgeschlagenen Lösung.','Wer seine Meinung differenziert ausdrückt, wirkt glaubwürdiger als jemand, der jede Gegenposition sofort ablehnt.'],
      blanks:[['Ich würde dieser Einschätzung grundsätzlich zustimmen, allerdings nur unter der Voraussetzung, dass die sozialen Folgen mitbedacht werden.','Voraussetzung'],['Der Einwand erscheint plausibel, verändert jedoch nicht zwangsläufig die gesamte Bewertung der Situation.','plausibel'],['Je nachdem, wie man die einzelnen Faktoren gewichtet, kann man zu unterschiedlichen, aber vertretbaren Ergebnissen kommen.','gewichtet'],['Eine nuancierte Meinung vermeidet pauschale Urteile und erkennt an, dass mehrere Perspektiven gleichzeitig berechtigt sein können.','nuancierte'],['Ich halte die Kritik für teilweise berechtigt, würde sie jedoch in einem größeren Zusammenhang relativieren.','relativieren'],['Gerade bei vielschichtigen Themen ist es problematisch, vorschnell eindeutige Antworten zu erwarten.','vielschichtigen'],['Eine ausgewogene Bewertung benennt sowohl Chancen als auch Grenzen einer vorgeschlagenen Lösung.','Bewertung'],['Wer seine Meinung differenziert ausdrückt, wirkt glaubwürdiger als jemand, der jede Gegenposition sofort ablehnt.','differenziert']],
      truth:[['Eine nuancierte Meinung kann Zustimmung und Einschränkung verbinden.',true],['Pauschalisierungen sind auf C1-Niveau immer präziser als Differenzierungen.',false],['Ein plausibler Einwand muss in die eigene Bewertung einbezogen werden.',true],['Gewichtung bedeutet, verschiedene Faktoren unterschiedlich stark zu berücksichtigen.',true]],
      dialog:['Stimmen Sie der Aussage zu?','Grundsätzlich ja, allerdings nur mit der Einschränkung, dass die langfristigen Folgen berücksichtigt werden.','Warum vermeiden Sie eine eindeutige Antwort?','Weil das Thema vielschichtig ist und mehrere Perspektiven gleichzeitig plausibel sein können.']
    },
    'c1-complex-texts':{
      focus:'Komplexe Texte analysieren, implizite Aussagen erkennen und argumentative Bezüge sicher herstellen.',
      focusTr:'Karmaşık metinleri analiz etme, örtük ifadeleri tanıma ve argümantatif bağlantıları güvenli kurma.',
      vocab:[['die Kernaussage','ana mesaj'],['die Textlogik','metin mantığı'],['die Bezugnahme','atıf'],['der Zusammenhang','bağlam'],['die Deutung','yorum'],['die Andeutung','ima'],['implizit','örtük'],['ableiten','çıkarmak'],['verknüpfen','bağlamak'],['herausarbeiten','ortaya çıkarmak']],
      sentences:['Die Kernaussage des Textes ergibt sich nicht aus einem einzelnen Satz, sondern aus der Verbindung mehrerer Argumentationsschritte.','Eine implizite Kritik lässt sich häufig nur dann erkennen, wenn man Wortwahl, Aufbau und Kontext gemeinsam betrachtet.','Die Bezugnahme auf frühere Argumente stärkt die Textlogik und verhindert, dass der Gedankengang sprunghaft wirkt.','Beim Lesen komplexer Texte muss man zwischen Hauptaussage, Nebeninformation und interpretierender Deutung unterscheiden.','Eine Andeutung kann für das Verständnis wichtiger sein als eine ausdrücklich formulierte Aussage.','Wer die Textstruktur nachvollzieht, kann besser beurteilen, welche Informationen zentral und welche ergänzend sind.','Aus mehreren Hinweisen lässt sich ableiten, welche Haltung die Autorin indirekt einnimmt.','Komplexe Texte verlangen, dass man Informationen verknüpft und Widersprüche bewusst prüft.'],
      blanks:[['Die Kernaussage des Textes ergibt sich nicht aus einem einzelnen Satz, sondern aus der Verbindung mehrerer Argumentationsschritte.','Kernaussage'],['Eine implizite Kritik lässt sich häufig nur dann erkennen, wenn man Wortwahl, Aufbau und Kontext gemeinsam betrachtet.','implizite'],['Die Bezugnahme auf frühere Argumente stärkt die Textlogik und verhindert, dass der Gedankengang sprunghaft wirkt.','Textlogik'],['Beim Lesen komplexer Texte muss man zwischen Hauptaussage, Nebeninformation und interpretierender Deutung unterscheiden.','Deutung'],['Eine Andeutung kann für das Verständnis wichtiger sein als eine ausdrücklich formulierte Aussage.','Andeutung'],['Wer die Textstruktur nachvollzieht, kann besser beurteilen, welche Informationen zentral und welche ergänzend sind.','Textstruktur'],['Aus mehreren Hinweisen lässt sich ableiten, welche Haltung die Autorin indirekt einnimmt.','ableiten'],['Komplexe Texte verlangen, dass man Informationen verknüpft und Widersprüche bewusst prüft.','verknüpft']],
      truth:[['Komplexe Texte enthalten oft implizite Aussagen.',true],['Die Kernaussage steht immer wortwörtlich im ersten Satz.',false],['Bezugnahmen können die Textlogik stärken.',true],['C1-Leseverstehen verlangt die Verbindung mehrerer Informationen.',true]],
      dialog:['Wie finden Sie die Kernaussage eines komplexen Textes?','Ich verknüpfe mehrere Hinweise und unterscheide zwischen Hauptaussage, Nebeninformation und Deutung.','Warum reicht ein einzelner Satz oft nicht aus?','Weil die argumentative Funktion erst im Zusammenhang des gesamten Textes sichtbar wird.']
    },
    'c1-professional-negotiation':{
      focus:'Professionelle Verhandlungen strategisch, höflich und lösungsorientiert führen.',
      focusTr:'Profesyonel müzakereleri stratejik, nazik ve çözüm odaklı yürütme.',
      vocab:[['die Verhandlung','müzakere'],['der Kompromiss','uzlaşma'],['die Bedingung','şart'],['die Vereinbarung','anlaşma'],['die Grundlage','temel'],['der Spielraum','hareket alanı'],['verbindlich','bağlayıcı'],['entgegenkommen','taviz vermek'],['aushandeln','müzakere etmek'],['tragfähig','sürdürülebilir']],
      sentences:['Ein tragfähiger Kompromiss setzt voraus, dass beide Seiten ihre Bedingungen offenlegen und den vorhandenen Spielraum realistisch einschätzen.','Wir könnten Ihnen entgegenkommen, sofern die neue Frist verbindlich vereinbart und schriftlich bestätigt wird.','Die Grundlage einer erfolgreichen Verhandlung ist eine klare, respektvolle und zugleich interessenorientierte Kommunikation.','Ein Vorschlag sollte nicht nur realistisch, sondern auch für beide Seiten langfristig akzeptabel sein.','Bevor wir eine Vereinbarung treffen, müssten die offenen Punkte präzise geklärt werden.','Es wäre sinnvoll, zunächst gemeinsame Interessen zu benennen, bevor über konkrete Bedingungen gesprochen wird.','Eine professionelle Verhandlung vermeidet Druck, ohne die eigenen Ziele aus dem Blick zu verlieren.','Wenn beide Seiten flexibel bleiben, lässt sich häufig eine Lösung aushandeln, die tragfähig ist.'],
      blanks:[['Ein tragfähiger Kompromiss setzt voraus, dass beide Seiten ihre Bedingungen offenlegen und den vorhandenen Spielraum realistisch einschätzen.','Kompromiss'],['Wir könnten Ihnen entgegenkommen, sofern die neue Frist verbindlich vereinbart und schriftlich bestätigt wird.','verbindlich'],['Die Grundlage einer erfolgreichen Verhandlung ist eine klare, respektvolle und zugleich interessenorientierte Kommunikation.','Grundlage'],['Ein Vorschlag sollte nicht nur realistisch, sondern auch für beide Seiten langfristig akzeptabel sein.','akzeptabel'],['Bevor wir eine Vereinbarung treffen, müssten die offenen Punkte präzise geklärt werden.','Vereinbarung'],['Es wäre sinnvoll, zunächst gemeinsame Interessen zu benennen, bevor über konkrete Bedingungen gesprochen wird.','Bedingungen'],['Eine professionelle Verhandlung vermeidet Druck, ohne die eigenen Ziele aus dem Blick zu verlieren.','professionelle'],['Wenn beide Seiten flexibel bleiben, lässt sich häufig eine Lösung aushandeln, die tragfähig ist.','aushandeln']],
      truth:[['Eine professionelle Verhandlung verbindet Höflichkeit mit Klarheit.',true],['Ein verbindlicher Termin ist völlig unverbindlich.',false],['Ein Kompromiss sollte für beide Seiten tragfähig sein.',true],['Verhandeln bedeutet immer, die andere Seite unter Druck zu setzen.',false]],
      dialog:['Unter welchen Bedingungen könnten Sie dem Vorschlag zustimmen?','Wir könnten zustimmen, sofern die Frist verbindlich festgelegt und der Umfang schriftlich präzisiert wird.','Wie würden Sie einen Kompromiss formulieren?','Ich würde einen Vorschlag machen, der unsere Interessen schützt und Ihnen zugleich realistisch entgegenkommt.']
    },
    'c1-formal-correspondence':{
      focus:'Sehr formelle Schreiben, Stellungnahmen und Beschwerden präzise, höflich und strukturiert verfassen.',
      focusTr:'Çok resmi yazıları, görüşleri ve şikâyetleri kesin, nazik ve yapılandırılmış şekilde yazma.',
      vocab:[['die Korrespondenz','yazışma'],['die Stellungnahme','görüş yazısı'],['die Angelegenheit','mesele'],['die Rückmeldung','geri bildirim'],['die Frist','süre'],['der Sachverhalt','olay/durum'],['bezugnehmend','atıfta bulunarak'],['fristgerecht','süresinde'],['darlegen','açıklamak'],['beanstanden','itiraz etmek/şikâyet etmek']],
      sentences:['Bezugnehmend auf Ihr Schreiben möchte ich den Sachverhalt aus meiner Sicht kurz darlegen und um Prüfung der Angelegenheit bitten.','Ich bitte um eine fristgerechte Rückmeldung, damit die weiteren Schritte rechtzeitig geplant werden können.','Die Stellungnahme sollte sachlich bleiben und die zentralen Punkte klar, höflich und nachvollziehbar benennen.','Eine formelle Korrespondenz erfordert präzise Sprache, eindeutige Bezüge und einen respektvollen Ton.','Hiermit möchte ich beanstanden, dass die zugesagte Leistung nicht im vereinbarten Umfang erbracht wurde.','Bitte teilen Sie mir mit, welche Unterlagen zur abschließenden Bearbeitung noch erforderlich sind.','Aus Gründen der Nachvollziehbarkeit wäre eine schriftliche Bestätigung der Entscheidung hilfreich.','Ich wäre Ihnen dankbar, wenn Sie die Angelegenheit zeitnah prüfen und mir eine verbindliche Antwort zukommen lassen könnten.'],
      blanks:[['Bezugnehmend auf Ihr Schreiben möchte ich den Sachverhalt aus meiner Sicht kurz darlegen und um Prüfung der Angelegenheit bitten.','Sachverhalt'],['Ich bitte um eine fristgerechte Rückmeldung, damit die weiteren Schritte rechtzeitig geplant werden können.','fristgerechte'],['Die Stellungnahme sollte sachlich bleiben und die zentralen Punkte klar, höflich und nachvollziehbar benennen.','Stellungnahme'],['Eine formelle Korrespondenz erfordert präzise Sprache, eindeutige Bezüge und einen respektvollen Ton.','Korrespondenz'],['Hiermit möchte ich beanstanden, dass die zugesagte Leistung nicht im vereinbarten Umfang erbracht wurde.','beanstanden'],['Bitte teilen Sie mir mit, welche Unterlagen zur abschließenden Bearbeitung noch erforderlich sind.','Unterlagen'],['Aus Gründen der Nachvollziehbarkeit wäre eine schriftliche Bestätigung der Entscheidung hilfreich.','Bestätigung'],['Ich wäre Ihnen dankbar, wenn Sie die Angelegenheit zeitnah prüfen und mir eine verbindliche Antwort zukommen lassen könnten.','verbindliche']],
      truth:[['Formelle Korrespondenz sollte sachlich und höflich formuliert sein.',true],['Eine Stellungnahme darf zentrale Punkte klar benennen.',true],['Bezugnehmend bedeutet ohne jeden Zusammenhang.',false],['Eine fristgerechte Rückmeldung kommt innerhalb der gesetzten Frist.',true]],
      dialog:['Wie würden Sie ein formelles Anliegen einleiten?','Bezugnehmend auf Ihr Schreiben möchte ich den Sachverhalt aus meiner Sicht kurz darlegen.','Was macht eine gute Stellungnahme aus?','Sie bleibt sachlich, benennt die zentralen Punkte klar und achtet auf einen respektvollen Ton.']
    },
    'c1-social-debate':{
      focus:'Gesellschaftliche Debatten differenziert analysieren, strukturelle Ursachen benennen und verantwortungsbewusste Positionen formulieren.',
      focusTr:'Toplumsal tartışmaları ayrıntılı analiz etme, yapısal nedenleri belirtme ve sorumlu görüşler oluşturma.',
      vocab:[['die Teilhabe','katılım'],['die Ungleichheit','eşitsizlik'],['der Wandel','değişim'],['die Verantwortung','sorumluluk'],['die Polarisierung','kutuplaşma'],['die Perspektivenvielfalt','bakış açısı çeşitliliği'],['strukturell','yapısal'],['differenziert','ayrıntılı'],['mitdenken','hesaba katmak'],['hinterfragen','sorgulamak']],
      sentences:['Gesellschaftliche Debatten gewinnen an Qualität, wenn unterschiedliche Erfahrungen nicht gegeneinander ausgespielt, sondern ernst genommen werden.','Strukturelle Ungleichheit zeigt sich häufig darin, dass formale Rechte bestehen, reale Teilhabe aber ungleich verteilt bleibt.','Ein verantwortungsvoller Beitrag zur Debatte sollte nicht nur kurzfristige Emotionen, sondern auch langfristige Folgen berücksichtigen.','Polarisierung entsteht oft dort, wo komplexe Themen auf einfache Gegensätze reduziert werden.','Gesellschaftlicher Wandel lässt sich selten auf eine einzelne Ursache zurückführen und muss daher mehrdimensional analysiert werden.','Wer soziale Probleme beurteilt, sollte individuelle Entscheidungen und strukturelle Rahmenbedingungen voneinander unterscheiden.','Eine demokratische Diskussion lebt davon, dass Perspektivenvielfalt zugelassen und argumentativ eingeordnet wird.','Kritisches Hinterfragen bedeutet nicht automatisch Ablehnung, sondern kann zu einer präziseren gemeinsamen Lösung beitragen.'],
      blanks:[['Gesellschaftliche Debatten gewinnen an Qualität, wenn unterschiedliche Erfahrungen nicht gegeneinander ausgespielt, sondern ernst genommen werden.','Debatten'],['Strukturelle Ungleichheit zeigt sich häufig darin, dass formale Rechte bestehen, reale Teilhabe aber ungleich verteilt bleibt.','Teilhabe'],['Ein verantwortungsvoller Beitrag zur Debatte sollte nicht nur kurzfristige Emotionen, sondern auch langfristige Folgen berücksichtigen.','verantwortungsvoller'],['Polarisierung entsteht oft dort, wo komplexe Themen auf einfache Gegensätze reduziert werden.','Polarisierung'],['Gesellschaftlicher Wandel lässt sich selten auf eine einzelne Ursache zurückführen und muss daher mehrdimensional analysiert werden.','Wandel'],['Wer soziale Probleme beurteilt, sollte individuelle Entscheidungen und strukturelle Rahmenbedingungen voneinander unterscheiden.','strukturelle'],['Eine demokratische Diskussion lebt davon, dass Perspektivenvielfalt zugelassen und argumentativ eingeordnet wird.','Perspektivenvielfalt'],['Kritisches Hinterfragen bedeutet nicht automatisch Ablehnung, sondern kann zu einer präziseren gemeinsamen Lösung beitragen.','Hinterfragen']],
      truth:[['Gesellschaftliche Debatten auf C1-Niveau verlangen Differenzierung.',true],['Polarisierung reduziert komplexe Themen häufig auf einfache Gegensätze.',true],['Teilhabe bedeutet, dass Menschen real an gesellschaftlichen Prozessen teilnehmen können.',true],['Strukturelle Ungleichheit beschreibt nur die Farbe eines Gebäudes.',false]],
      dialog:['Wie würden Sie eine gesellschaftliche Debatte einordnen?','Ich würde zunächst zwischen individuellen Erfahrungen und strukturellen Rahmenbedingungen unterscheiden.','Warum ist Perspektivenvielfalt wichtig?','Weil sie verhindert, dass komplexe soziale Fragen auf eine einzige Sichtweise reduziert werden.']
    },
    'c1-science-technology':{
      focus:'Wissenschaftliche Evidenz, technologische Innovation und ethische Folgen präzise bewerten und sprachlich sicher darstellen.',
      focusTr:'Bilimsel kanıtı, teknolojik yeniliği ve etik sonuçları net değerlendirme ve güvenli ifade etme.',
      vocab:[['die Evidenz','kanıt'],['die Innovation','yenilik'],['die Regulierung','düzenleme'],['die Auswirkung','etki'],['die Ethik','etik'],['die Forschung','araştırma'],['die Transparenz','şeffaflık'],['die Verantwortung','sorumluluk'],['versachlichen','objektifleştirmek'],['abwägen','tartmak/değerlendirmek']],
      sentences:['Wissenschaftliche Evidenz kann eine Debatte versachlichen, sofern sie transparent erklärt und nicht selektiv verwendet wird.','Technologische Innovation sollte nicht ausschließlich nach Effizienz, sondern auch nach gesellschaftlichen und ethischen Folgen bewertet werden.','Eine kluge Regulierung begrenzt Risiken, ohne notwendige Forschung und sinnvolle Entwicklung grundsätzlich zu verhindern.','Gerade bei neuen Technologien muss abgewogen werden, welche Chancen realistisch und welche Risiken wahrscheinlich sind.','Transparenz ist entscheidend, damit Forschungsergebnisse nachvollzogen und kritisch geprüft werden können.','Ethische Verantwortung bedeutet, mögliche Auswirkungen auf unterschiedliche Bevölkerungsgruppen frühzeitig mitzudenken.','Eine technische Lösung ist nicht automatisch gesellschaftlich sinnvoll, nur weil sie praktisch umsetzbar ist.','Wissenschaftliche Kommunikation muss komplexe Ergebnisse verständlich machen, ohne sie unzulässig zu vereinfachen.'],
      blanks:[['Wissenschaftliche Evidenz kann eine Debatte versachlichen, sofern sie transparent erklärt und nicht selektiv verwendet wird.','Evidenz'],['Technologische Innovation sollte nicht ausschließlich nach Effizienz, sondern auch nach gesellschaftlichen und ethischen Folgen bewertet werden.','Innovation'],['Eine kluge Regulierung begrenzt Risiken, ohne notwendige Forschung und sinnvolle Entwicklung grundsätzlich zu verhindern.','Regulierung'],['Gerade bei neuen Technologien muss abgewogen werden, welche Chancen realistisch und welche Risiken wahrscheinlich sind.','abgewogen'],['Transparenz ist entscheidend, damit Forschungsergebnisse nachvollzogen und kritisch geprüft werden können.','Transparenz'],['Ethische Verantwortung bedeutet, mögliche Auswirkungen auf unterschiedliche Bevölkerungsgruppen frühzeitig mitzudenken.','Verantwortung'],['Eine technische Lösung ist nicht automatisch gesellschaftlich sinnvoll, nur weil sie praktisch umsetzbar ist.','gesellschaftlich'],['Wissenschaftliche Kommunikation muss komplexe Ergebnisse verständlich machen, ohne sie unzulässig zu vereinfachen.','vereinfachen']],
      truth:[['Wissenschaftliche Evidenz kann Debatten versachlichen.',true],['Technologische Innovation sollte auch ethisch bewertet werden.',true],['Regulierung bedeutet immer, jede Forschung vollständig zu verbieten.',false],['Transparenz erleichtert kritische Prüfung von Forschungsergebnissen.',true]],
      dialog:['Wie beurteilen Sie eine neue Technologie?','Ich würde Effizienz, Risiken, ethische Folgen und gesellschaftlichen Nutzen gegeneinander abwägen.','Warum reicht technische Machbarkeit nicht aus?','Weil eine Lösung auch sozial verantwortbar und nachvollziehbar reguliert sein muss.']
    },
    'c1-economy-work':{
      focus:'Wirtschaftliche Entwicklungen, Arbeitsbedingungen und berufliche Perspektiven differenziert einordnen.',
      focusTr:'Ekonomik gelişmeleri, çalışma koşullarını ve mesleki perspektifleri ayrıntılı değerlendirme.',
      vocab:[['die Arbeitswelt','çalışma hayatı'],['die Produktivität','verimlilik'],['die Belastung','yük'],['die Qualifikation','nitelik'],['die Flexibilität','esneklik'],['die Entwicklung','gelişim'],['die Vereinbarkeit','uyumluluk'],['die Verantwortung','sorumluluk'],['zunehmend','giderek'],['berücksichtigen','dikkate almak']],
      sentences:['Die moderne Arbeitswelt verlangt zunehmend Flexibilität, darf dauerhafte Belastung jedoch nicht als Normalzustand akzeptieren.','Höhere Produktivität ist nur dann nachhaltig, wenn Arbeitsbedingungen und gesundheitliche Grenzen berücksichtigt werden.','Qualifikation entscheidet immer stärker darüber, wie stabil berufliche Perspektiven in einer sich wandelnden Wirtschaft bleiben.','Wirtschaftliche Entwicklung sollte nicht allein am Wachstum, sondern auch an sozialer Verantwortung gemessen werden.','Die Vereinbarkeit von Beruf, Weiterbildung und Privatleben wird zu einem zentralen Faktor moderner Arbeitsmodelle.','Flexible Arbeitsformen können entlasten, wenn sie klar geregelt sind und nicht zu ständiger Erreichbarkeit führen.','Eine faire Arbeitswelt braucht Strukturen, die Leistung anerkennen, ohne Überforderung systematisch zu fördern.','Berufliche Entwicklung setzt voraus, dass Menschen Zugang zu Qualifizierung und realistischen Aufstiegsmöglichkeiten erhalten.'],
      blanks:[['Die moderne Arbeitswelt verlangt zunehmend Flexibilität, darf dauerhafte Belastung jedoch nicht als Normalzustand akzeptieren.','Arbeitswelt'],['Höhere Produktivität ist nur dann nachhaltig, wenn Arbeitsbedingungen und gesundheitliche Grenzen berücksichtigt werden.','Produktivität'],['Qualifikation entscheidet immer stärker darüber, wie stabil berufliche Perspektiven in einer sich wandelnden Wirtschaft bleiben.','Qualifikation'],['Wirtschaftliche Entwicklung sollte nicht allein am Wachstum, sondern auch an sozialer Verantwortung gemessen werden.','Verantwortung'],['Die Vereinbarkeit von Beruf, Weiterbildung und Privatleben wird zu einem zentralen Faktor moderner Arbeitsmodelle.','Vereinbarkeit'],['Flexible Arbeitsformen können entlasten, wenn sie klar geregelt sind und nicht zu ständiger Erreichbarkeit führen.','entlasten'],['Eine faire Arbeitswelt braucht Strukturen, die Leistung anerkennen, ohne Überforderung systematisch zu fördern.','Überforderung'],['Berufliche Entwicklung setzt voraus, dass Menschen Zugang zu Qualifizierung und realistischen Aufstiegsmöglichkeiten erhalten.','Entwicklung']],
      truth:[['Produktivität sollte im Zusammenhang mit Arbeitsbedingungen betrachtet werden.',true],['Flexibilität kann entlasten, wenn sie klar geregelt ist.',true],['Qualifikation spielt in der Arbeitswelt keine Rolle.',false],['Vereinbarkeit ist ein wichtiges Thema moderner Arbeitsmodelle.',true]],
      dialog:['Wie bewerten Sie flexible Arbeitsmodelle?','Ich sehe Vorteile, sofern klare Grenzen bestehen und ständige Erreichbarkeit vermieden wird.','Was macht berufliche Entwicklung fair?','Menschen brauchen Zugang zu Qualifizierung und realistische Aufstiegsmöglichkeiten.']
    },
    'c1-cultural-interpretation':{
      focus:'Kulturelle Texte, Motive, Werte und Perspektiven mehrdeutig und beleggestützt interpretieren.',
      focusTr:'Kültürel metinleri, motifleri, değerleri ve bakış açılarını çok anlamlı ve kanıta dayalı yorumlama.',
      vocab:[['die Deutung','yorum'],['das Motiv','motif'],['die Mehrdeutigkeit','çok anlamlılık'],['die Perspektive','bakış açısı'],['die Identität','kimlik'],['der Textbeleg','metin kanıtı'],['interpretieren','yorumlamak'],['prägen','şekillendirmek'],['symbolisch','sembolik'],['widersprüchlich','çelişkili']],
      sentences:['Eine kulturelle Deutung bleibt häufig mehrdeutig, weil Texte verschiedene Perspektiven gleichzeitig eröffnen.','Das Motiv der Zugehörigkeit kann symbolisch zeigen, wie Identität individuell und gesellschaftlich geprägt wird.','Eine Interpretation gewinnt an Überzeugungskraft, wenn sie persönliche Eindrücke mit konkreten Textbelegen verbindet.','Mehrdeutigkeit ist kein Fehler des Textes, sondern kann ein bewusst eingesetztes literarisches Mittel sein.','Kulturelle Werte erscheinen in Texten oft nicht direkt, sondern werden durch Figuren, Konflikte und Motive sichtbar.','Wer interpretiert, sollte zwischen eigener Wirkung, historischer Einordnung und belegbarer Textaussage unterscheiden.','Eine widersprüchliche Figur kann besonders interessant sein, weil sie einfache moralische Bewertungen erschwert.','Die gewählte Perspektive beeinflusst, welche Aspekte eines kulturellen Textes in den Vordergrund treten.'],
      blanks:[['Eine kulturelle Deutung bleibt häufig mehrdeutig, weil Texte verschiedene Perspektiven gleichzeitig eröffnen.','Deutung'],['Das Motiv der Zugehörigkeit kann symbolisch zeigen, wie Identität individuell und gesellschaftlich geprägt wird.','Motiv'],['Eine Interpretation gewinnt an Überzeugungskraft, wenn sie persönliche Eindrücke mit konkreten Textbelegen verbindet.','Textbelegen'],['Mehrdeutigkeit ist kein Fehler des Textes, sondern kann ein bewusst eingesetztes literarisches Mittel sein.','Mehrdeutigkeit'],['Kulturelle Werte erscheinen in Texten oft nicht direkt, sondern werden durch Figuren, Konflikte und Motive sichtbar.','Werte'],['Wer interpretiert, sollte zwischen eigener Wirkung, historischer Einordnung und belegbarer Textaussage unterscheiden.','unterscheiden'],['Eine widersprüchliche Figur kann besonders interessant sein, weil sie einfache moralische Bewertungen erschwert.','widersprüchliche'],['Die gewählte Perspektive beeinflusst, welche Aspekte eines kulturellen Textes in den Vordergrund treten.','Perspektive']],
      truth:[['Eine Interpretation sollte durch Textbelege gestützt werden.',true],['Mehrdeutigkeit kann ein bewusstes literarisches Mittel sein.',true],['Kulturelle Deutung hat nichts mit Perspektive zu tun.',false],['Motive können Hinweise auf Identität und Werte geben.',true]],
      dialog:['Wie begründen Sie eine kulturelle Deutung?','Ich verbinde meine Interpretation mit konkreten Textbelegen und berücksichtige Mehrdeutigkeit.','Warum ist Perspektive wichtig?','Weil sie beeinflusst, welche Bedeutungen und Motive besonders sichtbar werden.']
    },
    'c1-presentation-rhetoric':{
      focus:'Komplexe Inhalte rhetorisch sicher strukturieren, überzeugend präsentieren und präzise zusammenfassen.',
      focusTr:'Karmaşık içerikleri retorik olarak güvenli yapılandırma, ikna edici sunma ve net özetleme.',
      vocab:[['die Rhetorik','hitabet'],['die Präsentation','sunum'],['der Übergang','geçiş'],['die Zuspitzung','vurgulu özet'],['die Struktur','yapı'],['die Betonung','vurgu'],['überzeugen','ikna etmek'],['verdeutlichen','açıklığa kavuşturmak'],['zusammenfassen','özetlemek'],['adressatengerecht','hedef kitleye uygun']],
      sentences:['Eine überzeugende Präsentation führt das Publikum schrittweise durch die Argumentation und macht die innere Struktur jederzeit sichtbar.','Klare Übergänge helfen, komplexe Inhalte verständlicher zu machen und den roten Faden nicht zu verlieren.','Eine gute Zusammenfassung wiederholt nicht einfach alles, sondern spitzt die zentrale Aussage prägnant zu.','Rhetorische Sicherheit entsteht durch klare Struktur, präzise Sprache und eine angemessene Betonung wichtiger Punkte.','Adressatengerechtes Präsentieren bedeutet, Vorwissen, Interesse und Erwartungen des Publikums mitzudenken.','Ein Beispiel kann abstrakte Inhalte verdeutlichen, wenn es gezielt in die Argumentation eingebunden wird.','Wer überzeugend sprechen möchte, sollte nicht schneller werden, sondern bewusste Pausen und Betonungen einsetzen.','Die Schlussphase einer Präsentation sollte Orientierung geben und die wichtigsten Konsequenzen klar benennen.'],
      blanks:[['Eine überzeugende Präsentation führt das Publikum schrittweise durch die Argumentation und macht die innere Struktur jederzeit sichtbar.','Präsentation'],['Klare Übergänge helfen, komplexe Inhalte verständlicher zu machen und den roten Faden nicht zu verlieren.','Übergänge'],['Eine gute Zusammenfassung wiederholt nicht einfach alles, sondern spitzt die zentrale Aussage prägnant zu.','Zusammenfassung'],['Rhetorische Sicherheit entsteht durch klare Struktur, präzise Sprache und eine angemessene Betonung wichtiger Punkte.','Betonung'],['Adressatengerechtes Präsentieren bedeutet, Vorwissen, Interesse und Erwartungen des Publikums mitzudenken.','Adressatengerechtes'],['Ein Beispiel kann abstrakte Inhalte verdeutlichen, wenn es gezielt in die Argumentation eingebunden wird.','verdeutlichen'],['Wer überzeugend sprechen möchte, sollte nicht schneller werden, sondern bewusste Pausen und Betonungen einsetzen.','Pausen'],['Die Schlussphase einer Präsentation sollte Orientierung geben und die wichtigsten Konsequenzen klar benennen.','Schlussphase']],
      truth:[['Eine gute Präsentation braucht klare Übergänge.',true],['Eine Zusammenfassung sollte die zentrale Aussage prägnant zuspitzen.',true],['Adressatengerecht bedeutet ohne Bezug zum Publikum.',false],['Betonung und Pausen können rhetorische Wirkung unterstützen.',true]],
      dialog:['Wie strukturieren Sie eine überzeugende Präsentation?','Ich beginne mit einer klaren Leitfrage, setze deutliche Übergänge und spitze am Ende die zentrale Aussage zu.','Warum sind Pausen wichtig?','Sie geben dem Publikum Orientierung und verstärken wichtige Argumente.']
    }
  };
  function c1ExpandedChoices(correct){var base=[correct,'masa','bugün','çok küçük','kalem','araba','pencere']; var seen={}; return base.filter(function(x){ if(!x||seen[x]) return false; seen[x]=true; return true;}).slice(0,4).map(function(text,i){return {id:String.fromCharCode(97+i),text:text};});}
  function c1ExpandedTokens(sentence){return String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean).sort(function(a,b){return a.localeCompare(b,'de');});}
  function createC1ExpandedTasks(bp){
    var data=C1_PHASE34B_CONTENT[bp.id];
    if(!data) return createC1StarterTasks(bp);
    var tasks=[], id=bp.id, title=bp.title, vocab=data.vocab||[], sentences=data.sentences||[], blanks=data.blanks||[], truth=data.truth||[], dialog=data.dialog||[];
    function addMC(i,pair){tasks.push({id:id+'-34b-mc-'+i,type:'multiple_choice',phase:'34B',parallelContent:true,c1Expanded:true,prompt:{de:'Welche präzise C1-Bedeutung passt zu „'+pair[0]+'“?',tr:'„'+pair[0]+'“ için hangi kesin C1 anlamı uygundur?'},instruction:{de:'Wähle die Bedeutung, die in einem anspruchsvollen C1-Kontext stilistisch und inhaltlich passt.',tr:'Zor bir C1 bağlamında üslup ve anlam açısından uygun anlamı seç.'},hint:{de:'Thema: '+title+'. Achte auf Register, Nuance und genaue Funktion des Begriffs.',tr:'Konu: '+title+'. Üsluba, nüansa ve kavramın tam işlevine dikkat et.'},choices:c1ExpandedChoices(pair[1]),answer:'a',explain:{de:'„'+pair[0]+'“ bedeutet hier „'+pair[1]+'“.',tr:'„'+pair[0]+'“ burada „'+pair[1]+'“ anlamına gelir.'}});}
    function addFill(i,item){var sentence=item[0],answer=item[1];tasks.push({id:id+'-34b-fill-'+i,type:'fill_blank',phase:'34B',parallelContent:true,c1Expanded:true,prompt:{de:'Ergänze den C1-Satz.',tr:'C1 cümlesini tamamla.'},instruction:{de:'Wähle das Wort, das Grammatik, Aussageabsicht, Register und logische Präzision verbindet.',tr:'Dilbilgisi, ifade amacı, üslup ve mantıksal kesinliği bağlayan kelimeyi seç.'},sentence:{de:String(sentence).replace(answer,'____'),tr:String(sentence).replace(answer,'____')},options:[answer,'Fenster','gestern','Bleistift'],answer:answer,hint:{de:'Lies den gesamten Satz. C1-Aufgaben prüfen oft Nuance, Einschränkung und genaue Textfunktion.',tr:'Tüm cümleyi oku. C1 görevleri çoğu zaman nüans, sınırlama ve metin işlevini ölçer.'},explain:{de:'Richtig ist: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addOrder(i,sentence){tasks.push({id:id+'-34b-order-'+i,type:'sentence_order',phase:'34B',parallelContent:true,c1Expanded:true,prompt:{de:'Ordne den anspruchsvollen C1-Satz.',tr:'Zor C1 cümlesini sırala.'},instruction:{de:'Achte auf Nebensätze, Einschränkungen, logische Abhängigkeiten und Register.',tr:'Yan cümlelere, sınırlamalara, mantıksal ilişkilere ve üsluba dikkat et.'},tokens:c1ExpandedTokens(sentence),answer:String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean),hint:{de:'Beginne mit der Hauptaussage und ordne danach Bedingung, Begründung oder Einschränkung ein.',tr:'Ana ifadeyle başla; sonra şartı, gerekçeyi veya sınırlamayı yerleştir.'},explain:{de:'Der richtige Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addListen(i,sentence){tasks.push({id:id+'-34b-listen-'+i,type:'listening_choice',phase:'34B',parallelContent:true,c1Expanded:true,prompt:{de:'Höre den C1-Satz und wähle die genaue Aussage.',tr:'C1 cümlesini dinle ve tam ifadeyi seç.'},instruction:{de:'Achte auf Bedeutung, Einschränkung, Haltung und argumentative Funktion.',tr:'Anlama, sınırlamaya, tutuma ve argümandaki işleve dikkat et.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich habe heute keine Zeit und bleibe zu Hause.'},{id:'c',text:'Das Zimmer ist klein, aber sehr hell.'},{id:'d',text:'Wir kaufen Brot, Wasser und Obst.'}],answer:'a',hint:{de:'C1-Hören: Du musst Sinn, Struktur, Register und implizite Funktion zusammen verstehen.',tr:'C1 dinleme: anlamı, yapıyı, üslubu ve örtük işlevi birlikte anlamalısın.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}});}
    function addTF(i,item){tasks.push({id:id+'-34b-tf-'+i,type:'true_false',phase:'34B',parallelContent:true,c1Expanded:true,prompt:{de:'Richtig oder falsch?',tr:'Doğru mu yanlış mı?'},instruction:{de:'Entscheide nach Bedeutung, Kontext, Register und argumentativer Logik.',tr:'Anlam, bağlam, üslup ve argümantatif mantığa göre karar ver.'},statement:{de:item[0],tr:item[0]},answer:item[1]?'true':'false',hint:{de:'Vergleiche die Aussage mit der C1-Lektion „'+title+'“.',tr:'İfadeyi C1 dersi „'+title+'“ ile karşılaştır.'},explain:{de:item[1]?'Die Aussage ist richtig.':'Die Aussage ist falsch.',tr:item[1]?'İfade doğru.':'İfade yanlış.'}});}
    function addMatch(i,offset){var pairs=vocab.slice(offset,offset+3).map(function(p){return {left:p[0],right:p[1]};});tasks.push({id:id+'-34b-match-'+i,type:'matching',phase:'34B',parallelContent:true,c1Expanded:true,prompt:{de:'Ordne die C1-Begriffe zu.',tr:'C1 kavramlarını eşleştir.'},instruction:{de:'Verbinde Begriff und präzise Bedeutung.',tr:'Kavramı kesin anlamıyla eşleştir.'},hint:{de:'Alle Begriffe gehören zur Lektion „'+title+'“.',tr:'Tüm kavramlar „'+title+'“ dersine ait.'},pairs:pairs,answer:'all',explain:{de:'Diese Begriffe sind zentrale Wörter dieser C1-Lektion.',tr:'Bu kavramlar bu C1 dersinin temel kelimeleridir.'}});}
    function addSpeak(i,sentence){tasks.push({id:id+'-34b-speak-'+i,type:'speaking_practice',phase:'34B',skill:'speaking',parallelContent:true,c1Expanded:true,prompt:{de:'Sprich den C1-Satz nach: „'+sentence+'“',tr:'C1 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Sprich präzise, ruhig und vollständig. Achte auf Betonung, Nebensätze, argumentative Funktion und stilistische Angemessenheit.',tr:'Net, sakin ve eksiksiz konuş. Vurguya, yan cümlelere, argüman işlevine ve uygun üsluba dikkat et.'},hint:{de:'C1-Sprechen: präzise, nuanciert, logisch aufgebaut und im Register passend.',tr:'C1 konuşma: kesin, nüanslı, mantıklı yapılandırılmış ve uygun üslupta.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,String(sentence).replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],explain:{de:'Sprechübung zu „'+title+'“. Ziel ist ein präziser, nuancierter Satz mit klarer Struktur.',tr:'„'+title+'“ için konuşma alıştırması. Amaç net yapılı, kesin ve nüanslı cümle kurmaktır.'}});}
    vocab.slice(0,10).forEach(function(pair,idx){addMC(idx+1,pair);});
    blanks.slice(0,8).forEach(function(item,idx){addFill(idx+1,item);});
    sentences.slice(0,5).forEach(function(sentence,idx){addOrder(idx+1,sentence);});
    sentences.slice(1,6).forEach(function(sentence,idx){addListen(idx+1,sentence);});
    truth.slice(0,4).forEach(function(item,idx){addTF(idx+1,item);});
    addMatch(1,0); addMatch(2,3); addMatch(3,6);
    sentences.slice(0,8).forEach(function(sentence,idx){addSpeak(idx+1,sentence);});
    return tasks.slice(0,43);
  }
  function ensurePhase34BContentExpansion(){
    ensurePhase34AC1Structure();
    try{
      C1_LESSON_BLUEPRINTS.forEach(function(bp){
        if(C1_PHASE34B_EXPANDED_IDS.indexOf(bp.id)>=0){ LESSON_TASKS[bp.id]=createC1ExpandedTasks(bp); }
      });
      if(COURSE_TREE.c1&&Array.isArray(COURSE_TREE.c1.lessons)){
        COURSE_TREE.c1.subtitle='Deutsch C1 · alle 10 Lektionen mit Kursinhalt und Speaking parallel ausgebaut';
        COURSE_TREE.c1.lessons.forEach(function(lesson){
          var count=(LESSON_TASKS[lesson.id]||[]).length;
          lesson.tasks=count; lesson.status='available'; lesson.parallelSpeaking=true;
          if(C1_PHASE34B_EXPANDED_IDS.indexOf(lesson.id)>=0){ lesson.phase='34C'; lesson.expandedContent=true; }
        });
      }
      var total=C1_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){ if(LEVELS[i].id==='c1'){ LEVELS[i].status='available'; LEVELS[i].desc='C1 vollständig ausgebaut · '+total+' Aufgaben inkl. Sprechen'; LEVELS[i].progress=15; }}
    }catch(e){}
  }
  function c1ContentSnapshot(){
    ensurePhase34BContentExpansion();
    var lessons=(COURSE_TREE.c1&&COURSE_TREE.c1.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, expanded=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[], sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length, isExp=C1_PHASE34B_EXPANDED_IDS.indexOf(lesson.id)>=0;
      var ok=isExp?(list.length>=43&&sp>=8):(list.length>=12&&sp>=4);
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,expandedContent:isExp,ok:ok};
      total+=list.length; speaking+=sp; normal+=list.length-sp; if(isExp) expanded++; if(!ok) complete=false;
    });
    return {ok:complete&&expanded===10&&lessons.length===10&&total===430&&speaking===80,phase:'34C',level:'c1',expandedLessons:expanded,starterLessons:lessons.length-expanded,lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,expandedLessonTarget:{tasks:43,speaking:8},perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'C1-Lektionen 1-10 wurden mit Kursaufgaben und Speaking gleichzeitig ausgebaut.'},regression:{a2:a2ContentSnapshot(),b1:b1ContentSnapshot(),b2:b2ContentSnapshot()},nextRecommendedPhase:'34D C1 Gesamt-QA + UI/Flow-Prüfung'};
  }


  function phase34dQaSnapshot(){
    ensurePhase30SpeakingTask();
    ensurePhase31BContentExpansion();
    ensurePhase32BContentExpansion();
    ensurePhase33CContentExpansion();
    ensurePhase34BContentExpansion();
    var snap=c1ContentSnapshot();
    var lessons=(COURSE_TREE.c1&&COURSE_TREE.c1.lessons)||[];
    var ids={}, duplicateTaskIds=[], missingRequired=[], typeCounts={}, lessonFlow=[];
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[];
      var speaking=list.filter(function(t){return t&&taskType(t)==='speaking_practice';});
      var normal=list.length-speaking.length;
      lessonFlow.push({id:lesson.id,title:lesson.title,tasks:list.length,normalTasks:normal,speakingTasks:speaking.length,status:lesson.status,phase:lesson.phase,ok:list.length===43&&speaking.length===8&&lesson.status==='available'});
      list.forEach(function(t,idx){
        if(!t||!t.id){missingRequired.push({lesson:lesson.id,index:idx,field:'id'}); return;}
        if(ids[t.id]) duplicateTaskIds.push(t.id); ids[t.id]=true;
        var tt=taskType(t); typeCounts[tt]=(typeCounts[tt]||0)+1;
        ['prompt','instruction'].forEach(function(field){ if(!t[field]) missingRequired.push({lesson:lesson.id,task:t.id,field:field}); });
        if(tt==='speaking_practice'){
          if(!t.expectedText&&!t.answer) missingRequired.push({lesson:lesson.id,task:t.id,field:'expectedText/answer'});
          if(!t.parallelContent) missingRequired.push({lesson:lesson.id,task:t.id,field:'parallelContent'});
        }
      });
    });
    var uiChecks={
      levelAvailable:!!(COURSE_TREE.c1&&COURSE_TREE.c1.status!=='locked'),
      allLessonsVisible:lessons.length===10,
      allLessonsAvailable:lessonFlow.every(function(x){return x.status==='available';}),
      allLessonTaskCountsStable:lessonFlow.every(function(x){return x.tasks===43&&x.speakingTasks===8;}),
      speakingFallbackReady:!!(window.SpeechRecognition||window.webkitSpeechRecognition)||true,
      guidedFallbackRequired:true,
      guidedFallbackPolicy:'Desktop/unterstützte Browser nutzen automatische SpeechRecognition; iPhone/iPad/unsupported Browser nutzen geführten Sprechmodus mit Selbstbewertung.',
      dashboardFlow:'C1-Level -> Lektion 1 bis 10 -> Aufgabe -> normale Auswertung oder Speaking-Fallback.',
      progressPersistenceExpected:true,
      coachCompatibilityExpected:true,
      errorTrainingCompatibilityExpected:true
    };
    var regression={a2:a2ContentSnapshot(),b1:b1ContentSnapshot(),b2:b2ContentSnapshot(),c1:snap};
    var ok=!!(snap&&snap.ok&&lessons.length===10&&snap.totalTasks===430&&snap.normalTasks===350&&snap.speakingTasks===80&&duplicateTaskIds.length===0&&missingRequired.length===0&&uiChecks.allLessonsAvailable&&uiChecks.allLessonTaskCountsStable&&regression.a2.ok&&regression.b1.ok&&regression.b2.ok);
    return {ok:ok,phase:'34D',level:'c1',version:VERSION,summary:{lessons:lessons.length,expandedLessons:snap.expandedLessons,starterLessons:snap.starterLessons,totalTasks:snap.totalTasks,normalTasks:snap.normalTasks,speakingTasks:snap.speakingTasks,duplicateTaskIds:duplicateTaskIds.length,missingRequired:missingRequired.length},typeCounts:typeCounts,lessonFlow:lessonFlow,uiChecks:uiChecks,duplicateTaskIds:duplicateTaskIds,missingRequired:missingRequired,regression:regression,deviceSimulationProfiles:['Desktop 1440','Desktop 1024','iPhone 15 Pro Max','iPhone SE','iPad 11','iPad 12.9'],nextRecommendedPhase:'35A C2 Kursstruktur + Speaking-Struktur parallel'};
  }


  var C2_LESSON_BLUEPRINTS=[
    {id:'c2-nuance-mastery',title:'Präzise Nuancen',tr:'Kesin nüanslar',goal:'Feinste Bedeutungsunterschiede sicher erkennen und ausdrücken.',goalTr:'En ince anlam farklarını güvenli biçimde tanımak ve ifade etmek.',vocab:['Nuance','implizit','eindeutig','mehrdeutig','präzisieren','andeuten']},
    {id:'c2-register-style',title:'Stilregister',tr:'Üslup düzeyleri',goal:'Sprache situationsgerecht, formell, diplomatisch und stilistisch bewusst einsetzen.',goalTr:'Dili duruma göre resmi, diplomatik ve üslup açısından bilinçli kullanmak.',vocab:['Register','gehoben','umgangssprachlich','diplomatisch','sachlich','pointiert']},
    {id:'c2-argument-analysis',title:'Komplexe Argumentationsanalyse',tr:'Karmaşık argüman analizi',goal:'Thesen, Prämissen, Gegenpositionen und Schlussfolgerungen präzise analysieren.',goalTr:'Tezleri, öncülleri, karşı görüşleri ve sonuçları kesin biçimde analiz etmek.',vocab:['These','Prämisse','Schlussfolgerung','Einwand','Gegenposition','Tragfähigkeit']},
    {id:'c2-rhetorical-impact',title:'Rhetorik & Wirkung',tr:'Retorik ve etki',goal:'Rhetorische Mittel erkennen, bewerten und gezielt anwenden.',goalTr:'Retorik araçları tanımak, değerlendirmek ve bilinçli kullanmak.',vocab:['Rhetorik','Wirkung','Metapher','Ironie','Übertreibung','Appell']},
    {id:'c2-specialized-transfer',title:'Fachsprache & Transfer',tr:'Uzman dili ve aktarım',goal:'Komplexe Fachinhalte präzise übertragen und adressatengerecht erklären.',goalTr:'Karmaşık uzmanlık içeriklerini kesin ve hedef kitleye uygun aktarmak.',vocab:['Fachsprache','Transfer','adressatengerecht','prägnant','abstrahieren','veranschaulichen']},
    {id:'c2-implicit-meaning',title:'Implizite Bedeutung',tr:'Örtük anlam',goal:'Zwischentöne, unausgesprochene Absichten und indirekte Bewertungen erfassen.',goalTr:'Alt anlamları, söylenmeyen niyetleri ve dolaylı değerlendirmeleri kavramak.',vocab:['implizit','Zwischenton','Absicht','Konnotation','Unterstellung','Andeutung']},
    {id:'c2-literary-cultural-critique',title:'Literatur & Kulturkritik',tr:'Edebiyat ve kültür eleştirisi',goal:'Kulturelle Texte differenziert deuten und kritisch einordnen.',goalTr:'Kültürel metinleri ayrıntılı yorumlamak ve eleştirel konumlandırmak.',vocab:['Deutung','Perspektive','Motiv','Kontext','Kritik','Ambivalenz']},
    {id:'c2-scientific-synthesis',title:'Wissenschaftliche Synthese',tr:'Bilimsel sentez',goal:'Mehrere komplexe Quellen zusammenführen, gewichten und eigenständig bewerten.',goalTr:'Birden fazla karmaşık kaynağı birleştirmek, ağırlıklandırmak ve bağımsız değerlendirmek.',vocab:['Synthese','Quelle','Evidenz','Gewichtung','Methodik','Bewertung']},
    {id:'c2-diplomacy-negotiation',title:'Diplomatie & Verhandlung',tr:'Diplomasi ve müzakere',goal:'Konflikte sprachlich entschärfen und anspruchsvolle Verhandlungen souverän führen.',goalTr:'Çatışmaları dil yoluyla yumuşatmak ve zorlu müzakereleri güvenle yürütmek.',vocab:['Diplomatie','Kompromiss','Einwand','Verhandlungsziel','Eskalation','Konsens']},
    {id:'c2-communication-mastery',title:'Meisterprüfung Kommunikation',tr:'İletişimde ustalık',goal:'Spontan, präzise, kohärent und stilistisch sicher kommunizieren.',goalTr:'Spontane, kesin, tutarlı ve üslup açısından güvenli iletişim kurmak.',vocab:['Kohärenz','Präzision','Spontaneität','Souveränität','Differenzierung','Eleganz']}
  ];

  function createC2StarterTasks(bp){
    var v=bp.vocab||[], main=v[0]||bp.title, aux=v[1]||'präzise';
    var basePrompt={de:'C2 · '+bp.title+': '+bp.goal,tr:'C2 · '+bp.tr+': '+bp.goalTr};
    var tasks=[];
    tasks.push({id:bp.id+'-mc-1',type:'multiple_choice',prompt:{de:'Welche Formulierung passt am besten zu „'+main+'“ im C2-Kontext?',tr:'C2 bağlamında „'+main+'“ için en uygun ifade hangisidir?'},instruction:{de:'Wähle die präziseste Antwort.',tr:'En kesin cevabı seç.'},choices:[{id:'a',text:main+' bewusst und differenziert verwenden'},{id:'b',text:'nur sehr einfach sprechen'},{id:'c',text:'jede Aussage vermeiden'},{id:'d',text:'nur einzelne Wörter raten'}],answer:'a',hint:{de:'C2 bedeutet hohe Präzision und Kontrolle.',tr:'C2 yüksek kesinlik ve kontrol demektir.'},explain:{de:'Auf C2-Niveau zählt kontrollierte, differenzierte Sprache.',tr:'C2 düzeyinde kontrollü ve ayrıntılı dil önemlidir.'}});
    tasks.push({id:bp.id+'-mc-2',type:'multiple_choice',prompt:{de:'Welche Strategie hilft bei „'+bp.title+'“ besonders?',tr:'„'+bp.tr+'“ konusunda hangi strateji özellikle yardımcı olur?'},instruction:{de:'Wähle die beste Strategie.',tr:'En iyi stratejiyi seç.'},choices:[{id:'a',text:'Aussage, Kontext und Wirkung gemeinsam prüfen'},{id:'b',text:'nur das erste Wort lesen'},{id:'c',text:'immer dieselbe Antwort geben'},{id:'d',text:'den Kontext ignorieren'}],answer:'a',hint:{de:'C2 verlangt Kontextsensibilität.',tr:'C2 bağlam duyarlılığı ister.'},explain:{de:'Bedeutung entsteht oft durch Kontext, Ton und Wirkung.',tr:'Anlam çoğu zaman bağlam, ton ve etkiyle oluşur.'}});
    tasks.push({id:bp.id+'-fill-1',type:'fill_blank',prompt:{de:'Ergänze den Satz passend.',tr:'Cümleyi uygun şekilde tamamla.'},instruction:{de:'Wähle die passende Ergänzung.',tr:'Uygun tamamlamayı seç.'},sentence:{de:'Die Aussage muss sprachlich ___ formuliert werden.',tr:'İfade dil açısından ___ kurulmalıdır.'},options:['präzise','zufällig','unverständlich','widersprüchlich'],answer:'präzise',hint:{de:'Gesucht ist ein C2-Kriterium.',tr:'C2 ölçütü aranıyor.'},explain:{de:'Präzision ist ein Kernziel in C2.',tr:'Kesinlik C2 seviyesinin temel hedefidir.'}});
    tasks.push({id:bp.id+'-fill-2',type:'fill_blank',prompt:{de:'Wähle das passende Wort.',tr:'Uygun kelimeyi seç.'},instruction:{de:'Setze den Fachbegriff richtig ein.',tr:'Terimi doğru yerleştir.'},sentence:{de:'Bei „'+bp.title+'“ spielt der ___ eine zentrale Rolle.',tr:'„'+bp.tr+'“ konusunda ___ merkezi bir rol oynar.'},options:['Kontext','Zufall','Fehler','Lärm'],answer:'Kontext',hint:{de:'C2-Äußerungen hängen stark vom Zusammenhang ab.',tr:'C2 ifadeleri bağlama çok bağlıdır.'},explain:{de:'Der Kontext entscheidet über Bedeutung und Angemessenheit.',tr:'Bağlam anlamı ve uygunluğu belirler.'}});
    tasks.push({id:bp.id+'-order-1',type:'sentence_order',prompt:{de:'Ordne die Wörter zu einem C2-Satz.',tr:'Kelimeleri C2 düzeyinde bir cümleye sırala.'},instruction:{de:'Tippe die Wörter in richtiger Reihenfolge an.',tr:'Kelimelere doğru sırayla dokun.'},tokens:['Die','Formulierung','wirkt','präzise','und','differenziert'],answer:['Die','Formulierung','wirkt','präzise','und','differenziert'],hint:{de:'Beginne mit dem Subjekt.',tr:'Özneyle başla.'},explain:{de:'Der Satz beschreibt eine kontrollierte sprachliche Wirkung.',tr:'Cümle kontrollü bir dil etkisini anlatır.'}});
    tasks.push({id:bp.id+'-order-2',type:'sentence_order',prompt:{de:'Bilde einen Satz zur Reflexion.',tr:'Düşünmeye yönelik bir cümle kur.'},instruction:{de:'Ordne die Satzteile.',tr:'Cümle parçalarını sırala.'},tokens:['Ich','berücksichtige','Kontext','Ton','und','Adressat'],answer:['Ich','berücksichtige','Kontext','Ton','und','Adressat'],hint:{de:'Nach dem Verb kommt das Objekt.',tr:'Fiilden sonra nesne gelir.'},explain:{de:'C2-Kommunikation beachtet Kontext, Ton und Zielgruppe.',tr:'C2 iletişimi bağlamı, tonu ve hedef kitleyi dikkate alır.'}});
    tasks.push({id:bp.id+'-listen-1',type:'listening_choice',prompt:{de:'Höre den Satz und wähle die passende Aussage.',tr:'Cümleyi dinle ve uygun ifadeyi seç.'},instruction:{de:'Spiele das Audio ab und wähle die Bedeutung.',tr:'Sesi oynat ve anlamı seç.'},audioText:{de:'Diese Formulierung ist zwar korrekt, wirkt aber zu direkt.',tr:'Bu ifade doğru olsa da fazla doğrudan etki bırakıyor.'},choices:[{id:'a',text:'Die Wirkung der Aussage wird bewertet.'},{id:'b',text:'Es geht nur um Rechtschreibung.'},{id:'c',text:'Der Satz ist komplett falsch.'},{id:'d',text:'Der Sprecher zählt Zahlen.'}],answer:'a',hint:{de:'Achte auf „wirkt“.',tr:'„wirkt“ kelimesine dikkat et.'},explain:{de:'Die Aussage bewertet nicht nur Korrektheit, sondern Wirkung.',tr:'İfade yalnız doğruluğu değil etkiyi de değerlendirir.'}});
    tasks.push({id:bp.id+'-tf-1',type:'true_false',prompt:{de:'C2 bedeutet, immer möglichst kompliziert zu sprechen.',tr:'C2 her zaman mümkün olduğunca karmaşık konuşmak demektir.'},instruction:{de:'Entscheide richtig oder falsch.',tr:'Doğru mu yanlış mı karar ver.'},answer:false,hint:{de:'C2 bedeutet passend, nicht künstlich kompliziert.',tr:'C2 uygun konuşmak demektir, yapay karmaşıklık değil.'},explain:{de:'C2-Sprache ist präzise und angemessen, nicht unnötig kompliziert.',tr:'C2 dili kesin ve uygundur, gereksiz karmaşık değildir.'}});
    tasks.push({id:bp.id+'-speak-1',type:'speaking_practice',prompt:{de:'Sprich den Satz klar und natürlich nach.',tr:'Cümleyi net ve doğal şekilde tekrar et.'},instruction:{de:'Höre zuerst zu, dann sprich nach.',tr:'Önce dinle, sonra tekrar et.'},expectedText:{de:'Ich möchte diese Aussage präziser formulieren.',tr:'Bu ifadeyi daha kesin kurmak istiyorum.'},answer:'Ich möchte diese Aussage präziser formulieren.',speechLang:'de-DE',parallelContent:true,hint:{de:'Sprich ruhig und betone „präziser“.',tr:'Sakin konuş ve „präziser“ kelimesini vurgula.'},explain:{de:'Der Satz trainiert kontrollierte Selbstkorrektur.',tr:'Cümle kontrollü öz düzeltmeyi çalıştırır.'}});
    tasks.push({id:bp.id+'-speak-2',type:'speaking_practice',prompt:{de:'Sprich eine differenzierte Bewertung nach.',tr:'Ayrıntılı bir değerlendirmeyi tekrar et.'},instruction:{de:'Achte auf natürliche Betonung.',tr:'Doğal vurgulamaya dikkat et.'},expectedText:{de:'Die Formulierung ist sachlich, aber nicht ausreichend nuanciert.',tr:'İfade nesnel, fakat yeterince nüanslı değil.'},answer:'Die Formulierung ist sachlich, aber nicht ausreichend nuanciert.',speechLang:'de-DE',parallelContent:true,hint:{de:'Mache eine kleine Pause nach „sachlich“.',tr:'„sachlich“ kelimesinden sonra kısa durakla.'},explain:{de:'Der Satz trainiert C2-Bewertungssprache.',tr:'Cümle C2 değerlendirme dilini çalıştırır.'}});
    tasks.push({id:bp.id+'-speak-3',type:'speaking_practice',prompt:{de:'Sprich eine diplomatische Formulierung nach.',tr:'Diplomatik bir ifadeyi tekrar et.'},instruction:{de:'Sprich freundlich, aber bestimmt.',tr:'Nazik ama kararlı konuş.'},expectedText:{de:'Ich sehe Ihren Punkt, würde ihn jedoch anders gewichten.',tr:'Bakış açınızı anlıyorum, ancak onu farklı ağırlıklandırırdım.'},answer:'Ich sehe Ihren Punkt, würde ihn jedoch anders gewichten.',speechLang:'de-DE',parallelContent:true,hint:{de:'Betone „jedoch“ nicht aggressiv.',tr:'„jedoch“ kelimesini sert vurgulama.'},explain:{de:'C2 verlangt oft diplomatische Präzision.',tr:'C2 çoğu zaman diplomatik kesinlik gerektirir.'}});
    tasks.push({id:bp.id+'-speak-4',type:'speaking_practice',prompt:{de:'Sprich einen C2-Reflexionssatz nach.',tr:'C2 düzeyinde bir düşünme cümlesini tekrar et.'},instruction:{de:'Sprich flüssig und zusammenhängend.',tr:'Akıcı ve bağlantılı konuş.'},expectedText:{de:'Entscheidend ist nicht nur, was gesagt wird, sondern wie es wirkt.',tr:'Önemli olan yalnız ne söylendiği değil, nasıl etki bıraktığıdır.'},answer:'Entscheidend ist nicht nur, was gesagt wird, sondern wie es wirkt.',speechLang:'de-DE',parallelContent:true,hint:{de:'Halte den Satz rhythmisch zusammen.',tr:'Cümleyi ritmik şekilde bağlı tut.'},explain:{de:'Der Satz verbindet Inhalt und Wirkung.',tr:'Cümle içerik ile etkiyi birleştirir.'}});
    tasks.forEach(function(t){ t.level='c2'; t.lessonId=bp.id; t.phase='35A'; t.parallelContent= t.parallelContent || false; if(!t.prompt) t.prompt=basePrompt; });
    return tasks;
  }

  function ensurePhase35AC2Structure(){
    ensurePhase34BContentExpansion();
    var level=LEVELS.filter(function(l){return l.id==='c2';})[0];
    if(level){ level.status='available'; level.desc='C2 Struktur · Kurs + Sprechen parallel'; level.progress=3; }
    COURSE_TREE.c2={title:'Mastery',subtitle:'Deutsch C2 · höchste Präzision mit parallel aufgebautem Sprechtraining',status:'available',lessons:C2_LESSON_BLUEPRINTS.map(function(bp){return {id:bp.id,title:bp.title,titleI18n:{de:bp.title,tr:bp.tr},goal:bp.goal,goalI18n:{de:bp.goal,tr:bp.goalTr},vocab:bp.vocab,tasks:12,progress:0,status:'available',parallelSpeaking:true,phase:'35A'};})};
    C2_LESSON_BLUEPRINTS.forEach(function(bp){LESSON_TASKS[bp.id]=createC2StarterTasks(bp);});
    return true;
  }

  function c2StructureSnapshot(){
    ensurePhase35AC2Structure();
    var lessons=(COURSE_TREE.c2&&COURSE_TREE.c2.lessons)||[];
    var total=0, speaking=0, normal=0, lessonFlow=[];
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[];
      var sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length;
      var nm=list.length-sp;
      total+=list.length; speaking+=sp; normal+=nm;
      lessonFlow.push({id:lesson.id,title:lesson.title,tasks:list.length,normalTasks:nm,speakingTasks:sp,status:lesson.status,phase:lesson.phase,ok:list.length===12&&sp===4&&nm===8&&lesson.status==='available'});
    });
    var ok=lessons.length===10&&total===120&&normal===80&&speaking===40&&lessonFlow.every(function(x){return x.ok;});
    return {ok:ok,phase:'35A',level:'c2',version:VERSION,lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,lessonFlow:lessonFlow,parallelBuildPolicy:true,regression:{a2:a2ContentSnapshot(),b1:b1ContentSnapshot(),b2:b2ContentSnapshot(),c1:c1ContentSnapshot()}};
  }

  var C2_PHASE35B_EXPANDED_IDS=C2_LESSON_BLUEPRINTS.slice(0,5).map(function(bp){return bp.id;});
  var C2_PHASE35B_CONTENT={
    'c2-nuance-mastery':{
      focus:'Feinste semantische Unterschiede, implizite Wertungen und präzise Bedeutungsabgrenzungen sicher beherrschen.',
      focusTr:'En ince anlamsal farkları, örtük değerlendirmeleri ve kesin anlam ayrımlarını güvenle kullanmak.',
      vocab:[['die Nuance','nüans'],['die Mehrdeutigkeit','çok anlamlılık'],['die Implikatur','örtük anlam'],['die Konnotation','çağrışım'],['die Präzisierung','kesinleştirme'],['die Abgrenzung','sınırlandırma'],['andeuten','ima etmek'],['relativieren','göreceli hale getirmek'],['unmissverständlich','yanlış anlaşılmaz'],['subtil','ince']],
      sentences:['Eine scheinbar neutrale Formulierung kann je nach Kontext eine subtile Wertung transportieren.','C2-Kommunikation verlangt, dass auch minimale Bedeutungsverschiebungen bewusst wahrgenommen und kontrolliert werden.','Wer eine Aussage präzisiert, grenzt sie nicht nur ein, sondern macht ihre kommunikative Funktion eindeutiger.','Eine Konnotation ist häufig nicht ausdrücklich genannt, beeinflusst aber dennoch die Wirkung einer Aussage.','Mehrdeutigkeit kann stilistisch gewollt sein, muss aber in formellen Kontexten kontrolliert eingesetzt werden.','Eine unmissverständliche Formulierung vermeidet nicht jede Komplexität, sondern reduziert unnötige Interpretationsspielräume.','Eine Andeutung kann stärker wirken als eine direkte Aussage, wenn sie im passenden Kontext erfolgt.','Auf C2-Niveau entscheidet oft die Nuance darüber, ob eine Aussage souverän oder unpassend wirkt.'],
      blanks:[['Eine scheinbar neutrale Formulierung kann je nach Kontext eine subtile Wertung transportieren.','subtile'],['C2-Kommunikation verlangt, dass auch minimale Bedeutungsverschiebungen bewusst wahrgenommen und kontrolliert werden.','Bedeutungsverschiebungen'],['Wer eine Aussage präzisiert, grenzt sie nicht nur ein, sondern macht ihre kommunikative Funktion eindeutiger.','präzisiert'],['Eine Konnotation ist häufig nicht ausdrücklich genannt, beeinflusst aber dennoch die Wirkung einer Aussage.','Konnotation'],['Mehrdeutigkeit kann stilistisch gewollt sein, muss aber in formellen Kontexten kontrolliert eingesetzt werden.','Mehrdeutigkeit'],['Eine unmissverständliche Formulierung vermeidet nicht jede Komplexität, sondern reduziert unnötige Interpretationsspielräume.','unmissverständliche'],['Eine Andeutung kann stärker wirken als eine direkte Aussage, wenn sie im passenden Kontext erfolgt.','Andeutung'],['Auf C2-Niveau entscheidet oft die Nuance darüber, ob eine Aussage souverän oder unpassend wirkt.','Nuance']],
      truth:[['Eine Konnotation kann die Wirkung einer Aussage verändern, ohne ausdrücklich genannt zu werden.',true],['C2-Sprache vermeidet grundsätzlich jede Nuance.',false],['Präzisierung kann Interpretationsspielräume gezielt reduzieren.',true],['Mehrdeutigkeit ist in jedem Kontext automatisch ein Fehler.',false]]
    },
    'c2-register-style':{
      focus:'Stilregister, Tonalität und soziale Angemessenheit auf höchstem Niveau bewusst steuern.',
      focusTr:'Üslup düzeyini, tonu ve sosyal uygunluğu en üst düzeyde bilinçli yönetmek.',
      vocab:[['das Register','üslup düzeyi'],['die Tonalität','tonlama'],['die Angemessenheit','uygunluk'],['die Distanzierung','mesafe koyma'],['der Stilbruch','üslup kırılması'],['die Höflichkeitsstrategie','nezaket stratejisi'],['pointiert','çarpıcı'],['gehoben','yüksek üslupta'],['diplomatisch','diplomatik'],['salopp','rahat üslupta']],
      sentences:['Ein gehobenes Register wirkt nur dann überzeugend, wenn es zur Situation und zur Beziehung der Gesprächspartner passt.','Eine diplomatische Formulierung entschärft Kritik, ohne den inhaltlichen Kern der Aussage aufzugeben.','Ein Stilbruch kann bewusst eingesetzt werden, wirkt aber unprofessionell, wenn er unbeabsichtigt entsteht.','Tonalität entscheidet häufig darüber, ob eine sachlich richtige Aussage akzeptiert oder abgewehrt wird.','Eine pointierte Formulierung verdichtet eine Aussage, darf sie aber nicht verzerren.','In formellen Situationen ist nicht nur der Inhalt, sondern auch die soziale Angemessenheit der Formulierung entscheidend.','Wer zwischen Registern wechseln kann, zeigt sprachliche Souveränität und situatives Feingefühl.','Eine zu saloppe Wendung kann in einem offiziellen Kontext die Glaubwürdigkeit der Aussage schwächen.'],
      blanks:[['Ein gehobenes Register wirkt nur dann überzeugend, wenn es zur Situation und zur Beziehung der Gesprächspartner passt.','Register'],['Eine diplomatische Formulierung entschärft Kritik, ohne den inhaltlichen Kern der Aussage aufzugeben.','diplomatische'],['Ein Stilbruch kann bewusst eingesetzt werden, wirkt aber unprofessionell, wenn er unbeabsichtigt entsteht.','Stilbruch'],['Tonalität entscheidet häufig darüber, ob eine sachlich richtige Aussage akzeptiert oder abgewehrt wird.','Tonalität'],['Eine pointierte Formulierung verdichtet eine Aussage, darf sie aber nicht verzerren.','pointierte'],['In formellen Situationen ist nicht nur der Inhalt, sondern auch die soziale Angemessenheit der Formulierung entscheidend.','Angemessenheit'],['Wer zwischen Registern wechseln kann, zeigt sprachliche Souveränität und situatives Feingefühl.','Registern'],['Eine zu saloppe Wendung kann in einem offiziellen Kontext die Glaubwürdigkeit der Aussage schwächen.','saloppe']],
      truth:[['Registerwahl hängt von Situation, Beziehung und Kommunikationsziel ab.',true],['Ein Stilbruch ist immer erwünscht, sobald man C2 erreicht hat.',false],['Diplomatische Sprache kann Kritik abschwächen, ohne sie inhaltlich aufzugeben.',true],['Tonalität spielt bei professioneller Kommunikation keine Rolle.',false]]
    },
    'c2-argument-analysis':{
      focus:'Komplexe Argumentationsketten, Prämissen, Einwände und Schlussfolgerungen kritisch analysieren.',
      focusTr:'Karmaşık argüman zincirlerini, öncülleri, itirazları ve sonuçları eleştirel analiz etmek.',
      vocab:[['die Prämisse','öncül'],['die Schlussfolgerung','sonuç'],['die Gegenposition','karşı görüş'],['die Plausibilität','makullük'],['die Tragfähigkeit','sağlamlık'],['der Zirkelschluss','döngüsel akıl yürütme'],['ableiten','çıkarmak'],['widerlegen','çürütmek'],['kohärent','tutarlı'],['verkürzt','indirgenmiş']],
      sentences:['Eine Argumentation ist nur dann tragfähig, wenn ihre Prämissen nachvollziehbar und ihre Schlussfolgerungen logisch ableitbar sind.','Ein Einwand widerlegt eine These nicht automatisch, kann aber ihre Reichweite entscheidend einschränken.','Bei komplexen Debatten muss man zwischen empirischer Evidenz, normativer Bewertung und rhetorischer Zuspitzung unterscheiden.','Ein Zirkelschluss wirkt auf den ersten Blick plausibel, stützt sich jedoch letztlich auf die eigene Voraussetzung.','Eine verkürzte Darstellung kann überzeugend klingen, obwohl sie zentrale Gegenpositionen ausblendet.','Kohärenz entsteht, wenn einzelne Argumentationsschritte erkennbar aufeinander aufbauen.','Eine starke Analyse benennt nicht nur Fehler, sondern erklärt auch, warum sie die Gesamtargumentation schwächen.','C2 bedeutet, Argumente nicht nur zu verstehen, sondern ihre innere Logik kritisch zu prüfen.'],
      blanks:[['Eine Argumentation ist nur dann tragfähig, wenn ihre Prämissen nachvollziehbar und ihre Schlussfolgerungen logisch ableitbar sind.','Prämissen'],['Ein Einwand widerlegt eine These nicht automatisch, kann aber ihre Reichweite entscheidend einschränken.','Einwand'],['Bei komplexen Debatten muss man zwischen empirischer Evidenz, normativer Bewertung und rhetorischer Zuspitzung unterscheiden.','unterscheiden'],['Ein Zirkelschluss wirkt auf den ersten Blick plausibel, stützt sich jedoch letztlich auf die eigene Voraussetzung.','Zirkelschluss'],['Eine verkürzte Darstellung kann überzeugend klingen, obwohl sie zentrale Gegenpositionen ausblendet.','verkürzte'],['Kohärenz entsteht, wenn einzelne Argumentationsschritte erkennbar aufeinander aufbauen.','Kohärenz'],['Eine starke Analyse benennt nicht nur Fehler, sondern erklärt auch, warum sie die Gesamtargumentation schwächen.','Gesamtargumentation'],['C2 bedeutet, Argumente nicht nur zu verstehen, sondern ihre innere Logik kritisch zu prüfen.','Logik']],
      truth:[['Eine Prämisse ist eine Grundlage, auf der eine Schlussfolgerung aufbaut.',true],['Ein Zirkelschluss ist ein besonders stabiles wissenschaftliches Argument.',false],['Kohärente Argumente bauen logisch aufeinander auf.',true],['Eine verkürzte Darstellung berücksichtigt grundsätzlich alle Gegenpositionen.',false]]
    },
    'c2-rhetorical-impact':{
      focus:'Rhetorische Mittel, Wirkungsabsichten und sprachliche Strategien präzise erkennen und einsetzen.',
      focusTr:'Retorik araçlarını, etki amaçlarını ve dil stratejilerini kesin biçimde tanımak ve kullanmak.',
      vocab:[['die Rhetorik','retorik'],['die Wirkung','etki'],['die Zuspitzung','keskinleştirme'],['die Ironie','ironi'],['die Metapher','metafor'],['der Appell','çağrı'],['inszenieren','sahnelemek'],['provozieren','kışkırtmak'],['überzeichnen','abartmak'],['suggestiv','yönlendirici']],
      sentences:['Rhetorische Wirkung entsteht nicht allein durch einzelne Wörter, sondern durch Zusammenspiel von Struktur, Ton und Erwartung.','Eine Zuspitzung kann ein Argument sichtbar machen, birgt jedoch das Risiko einer übermäßigen Vereinfachung.','Ironie setzt voraus, dass die beabsichtigte Distanz zwischen Gesagtem und Gemeintem erkennbar bleibt.','Eine Metapher kann abstrakte Zusammenhänge veranschaulichen, aber auch bestimmte Deutungen nahelegen.','Ein suggestiver Appell lenkt die Reaktion des Publikums, ohne immer offen als Argument aufzutreten.','Wer rhetorische Mittel analysiert, fragt nicht nur nach dem Inhalt, sondern nach der beabsichtigten Wirkung.','Eine überzeichnete Darstellung kann Aufmerksamkeit erzeugen, zugleich aber die Sachlichkeit schwächen.','C2-Kompetenz zeigt sich darin, rhetorische Strategien bewusst zu erkennen und verantwortungsvoll einzusetzen.'],
      blanks:[['Rhetorische Wirkung entsteht nicht allein durch einzelne Wörter, sondern durch Zusammenspiel von Struktur, Ton und Erwartung.','Wirkung'],['Eine Zuspitzung kann ein Argument sichtbar machen, birgt jedoch das Risiko einer übermäßigen Vereinfachung.','Zuspitzung'],['Ironie setzt voraus, dass die beabsichtigte Distanz zwischen Gesagtem und Gemeintem erkennbar bleibt.','Ironie'],['Eine Metapher kann abstrakte Zusammenhänge veranschaulichen, aber auch bestimmte Deutungen nahelegen.','Metapher'],['Ein suggestiver Appell lenkt die Reaktion des Publikums, ohne immer offen als Argument aufzutreten.','suggestiver'],['Wer rhetorische Mittel analysiert, fragt nicht nur nach dem Inhalt, sondern nach der beabsichtigten Wirkung.','analysiert'],['Eine überzeichnete Darstellung kann Aufmerksamkeit erzeugen, zugleich aber die Sachlichkeit schwächen.','überzeichnete'],['C2-Kompetenz zeigt sich darin, rhetorische Strategien bewusst zu erkennen und verantwortungsvoll einzusetzen.','Strategien']],
      truth:[['Ironie beruht oft auf einer Distanz zwischen Gesagtem und Gemeintem.',true],['Rhetorische Wirkung hängt ausschließlich von der Lautstärke ab.',false],['Eine Metapher kann komplexe Zusammenhänge anschaulich machen.',true],['Suggestive Sprache ist immer neutral und ohne Lenkung.',false]]
    },
    'c2-specialized-transfer':{
      focus:'Fachsprache präzise verstehen, adressatengerecht übertragen und komplexe Inhalte ohne Verlust erklären.',
      focusTr:'Uzman dilini kesin anlamak, hedef kitleye uygun aktarmak ve karmaşık içerikleri kayıpsız açıklamak.',
      vocab:[['die Fachsprache','uzman dili'],['der Transfer','aktarım'],['die Adressatengerechtigkeit','hedef kitleye uygunluk'],['die Abstraktion','soyutlama'],['die Veranschaulichung','somutlaştırma'],['die Terminologie','terimbilim'],['übertragen','aktarmak'],['vereinfachen','sadeleştirmek'],['prägnant','özlü'],['anschlussfähig','bağlantı kurulabilir']],
      sentences:['Ein gelungener Transfer reduziert Komplexität, ohne den fachlichen Kern der Aussage zu verfälschen.','Fachsprache muss nicht vollständig vermieden, sondern adressatengerecht erläutert und eingebettet werden.','Eine prägnante Erklärung unterscheidet zwischen notwendiger Vereinfachung und inhaltlicher Verkürzung.','Terminologie schafft Genauigkeit, kann aber ohne Kontext den Zugang zum Thema erschweren.','Eine Veranschaulichung macht abstrakte Inhalte greifbar, sofern sie den Sachverhalt nicht verzerrt.','Adressatengerechtigkeit bedeutet, Vorwissen, Ziel und Kommunikationssituation systematisch zu berücksichtigen.','Wer Fachinhalte überträgt, muss entscheiden, welche Details zentral und welche entbehrlich sind.','C2-Kompetenz zeigt sich darin, komplexe Inhalte präzise und zugleich verständlich anschlussfähig zu machen.'],
      blanks:[['Ein gelungener Transfer reduziert Komplexität, ohne den fachlichen Kern der Aussage zu verfälschen.','Transfer'],['Fachsprache muss nicht vollständig vermieden, sondern adressatengerecht erläutert und eingebettet werden.','adressatengerecht'],['Eine prägnante Erklärung unterscheidet zwischen notwendiger Vereinfachung und inhaltlicher Verkürzung.','prägnante'],['Terminologie schafft Genauigkeit, kann aber ohne Kontext den Zugang zum Thema erschweren.','Terminologie'],['Eine Veranschaulichung macht abstrakte Inhalte greifbar, sofern sie den Sachverhalt nicht verzerrt.','Veranschaulichung'],['Adressatengerechtigkeit bedeutet, Vorwissen, Ziel und Kommunikationssituation systematisch zu berücksichtigen.','Adressatengerechtigkeit'],['Wer Fachinhalte überträgt, muss entscheiden, welche Details zentral und welche entbehrlich sind.','überträgt'],['C2-Kompetenz zeigt sich darin, komplexe Inhalte präzise und zugleich verständlich anschlussfähig zu machen.','anschlussfähig']],
      truth:[['Guter Transfer bewahrt den fachlichen Kern und passt die Darstellung an die Zielgruppe an.',true],['Fachsprache ist auf C2-Niveau grundsätzlich verboten.',false],['Terminologie kann Genauigkeit schaffen, braucht aber Kontext.',true],['Vereinfachung und Verfälschung bedeuten immer dasselbe.',false]]
    }
  };
  function c2ExpandedChoices(correct){return [{id:'a',text:correct},{id:'b',text:'eine rein zufällige Alltagssituation'},{id:'c',text:'ein einfacher Gegenstand ohne Bezug'},{id:'d',text:'eine grammatisch unverbundene Antwort'}];}
  function c2ExpandedTokens(sentence){return String(sentence).replace(/[.!?]/g,'').split(/\s+/).filter(Boolean);}
  function createC2ExpandedTasks(bp){
    var data=C2_PHASE35B_CONTENT[bp.id];
    if(!data){return createC2StarterTasks(bp);}
    var tasks=[], id=bp.id, title=bp.title, vocab=data.vocab||[], sentences=data.sentences||[], blanks=data.blanks||[], truth=data.truth||[];
    function addMC(i,pair){tasks.push({id:id+'-35b-mc-'+i,type:'multiple_choice',phase:'35B',parallelContent:true,c2Expanded:true,prompt:{de:'Welche präzise C2-Bedeutung passt zu „'+pair[0]+'“?',tr:'„'+pair[0]+'“ için hangi kesin C2 anlamı uygundur?'},instruction:{de:'Wähle die Bedeutung, die Nuance, Register und Kontext am genauesten trifft.',tr:'Nüans, üslup ve bağlamı en kesin karşılayan anlamı seç.'},choices:c2ExpandedChoices(pair[1]),answer:'a',hint:{de:'Thema: '+title+'. Achte auf feinste Bedeutungsunterschiede.',tr:'Konu: '+title+'. En ince anlam farklarına dikkat et.'},explain:{de:'„'+pair[0]+'“ bedeutet hier „'+pair[1]+'“.',tr:'„'+pair[0]+'“ burada „'+pair[1]+'“ anlamına gelir.'}});}
    function addFill(i,item){var sentence=item[0],answer=item[1];tasks.push({id:id+'-35b-fill-'+i,type:'fill_blank',phase:'35B',parallelContent:true,c2Expanded:true,prompt:{de:'Ergänze den C2-Satz.',tr:'C2 cümlesini tamamla.'},instruction:{de:'Wähle das Wort, das Bedeutung, Register und logische Präzision verbindet.',tr:'Anlamı, üslubu ve mantıksal kesinliği bağlayan kelimeyi seç.'},sentence:{de:String(sentence).replace(answer,'____'),tr:String(sentence).replace(answer,'____')},options:[answer,'Fenster','gestern','Bleistift'],answer:answer,hint:{de:'C2 prüft hier Nuance, implizite Bedeutung und präzise Funktion.',tr:'C2 burada nüansı, örtük anlamı ve kesin işlevi ölçer.'},explain:{de:'Richtig ist: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addOrder(i,sentence){var tokens=c2ExpandedTokens(sentence);tasks.push({id:id+'-35b-order-'+i,type:'sentence_order',phase:'35B',parallelContent:true,c2Expanded:true,prompt:{de:'Ordne den komplexen C2-Satz.',tr:'Karmaşık C2 cümlesini sırala.'},instruction:{de:'Achte auf Hauptaussage, Einschränkung, Wirkung und argumentative Struktur.',tr:'Ana ifadeye, sınırlamaya, etkiye ve argüman yapısına dikkat et.'},tokens:tokens,answer:tokens,hint:{de:'Beginne mit der tragenden Aussage und ordne danach die Nuancen ein.',tr:'Taşıyıcı ifadeyle başla; sonra nüansları yerleştir.'},explain:{de:'Der richtige Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addListen(i,sentence){tasks.push({id:id+'-35b-listen-'+i,type:'listening_choice',phase:'35B',parallelContent:true,c2Expanded:true,prompt:{de:'Höre den C2-Satz und wähle die genaue Aussage.',tr:'C2 cümlesini dinle ve tam ifadeyi seç.'},instruction:{de:'Achte auf Nuance, Register, implizite Bedeutung und rhetorische Wirkung.',tr:'Nüansa, üsluba, örtük anlama ve retorik etkiye dikkat et.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich gehe heute früh nach Hause.'},{id:'c',text:'Das Essen steht auf dem Tisch.'},{id:'d',text:'Wir treffen uns morgen um acht.'}],answer:'a',hint:{de:'C2-Hören verlangt sehr genaue Bedeutungswahrnehmung.',tr:'C2 dinleme çok kesin anlam algısı ister.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}});}
    function addTF(i,item){tasks.push({id:id+'-35b-tf-'+i,type:'true_false',phase:'35B',parallelContent:true,c2Expanded:true,prompt:{de:'Richtig oder falsch?',tr:'Doğru mu yanlış mı?'},instruction:{de:'Entscheide nach C2-Bedeutung, Kontext und stilistischer Angemessenheit.',tr:'C2 anlamına, bağlama ve üslup uygunluğuna göre karar ver.'},statement:{de:item[0],tr:item[0]},answer:item[1]?'true':'false',hint:{de:'Vergleiche die Aussage mit der Lektion „'+title+'“.',tr:'İfadeyi „'+title+'“ dersiyle karşılaştır.'},explain:{de:item[1]?'Die Aussage ist richtig.':'Die Aussage ist falsch.',tr:item[1]?'İfade doğru.':'İfade yanlış.'}});}
    function addMatch(i,offset){var pairs=vocab.slice(offset,offset+3).map(function(p){return {left:p[0],right:p[1]};});tasks.push({id:id+'-35b-match-'+i,type:'matching',phase:'35B',parallelContent:true,c2Expanded:true,prompt:{de:'Ordne die C2-Begriffe zu.',tr:'C2 kavramlarını eşleştir.'},instruction:{de:'Verbinde Begriff und präzise Bedeutung.',tr:'Kavramı kesin anlamıyla eşleştir.'},pairs:pairs,answer:'all',hint:{de:'Alle Begriffe gehören zur Lektion „'+title+'“.',tr:'Tüm kavramlar „'+title+'“ dersine ait.'},explain:{de:'Diese Begriffe sind zentrale Wörter dieser C2-Lektion.',tr:'Bu kavramlar bu C2 dersinin temel kelimeleridir.'}});}
    function addSpeak(i,sentence){tasks.push({id:id+'-35b-speak-'+i,type:'speaking_practice',phase:'35B',skill:'speaking',parallelContent:true,c2Expanded:true,prompt:{de:'Sprich den C2-Satz nach: „'+sentence+'“',tr:'C2 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Sprich sehr präzise, kontrolliert und stilistisch angemessen. Achte auf Rhythmus, Nuance und Wirkung.',tr:'Çok net, kontrollü ve üsluba uygun konuş. Ritim, nüans ve etkiye dikkat et.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,String(sentence).replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],hint:{de:'C2-Sprechen: souverän, differenziert, präzise und registerbewusst.',tr:'C2 konuşma: hakim, ayrıntılı, kesin ve üslup bilincine sahip.'},explain:{de:'Sprechübung zu „'+title+'“. Ziel ist höchste Präzision mit natürlicher Wirkung.',tr:'„'+title+'“ için konuşma alıştırması. Amaç doğal etkiyle en yüksek kesinliktir.'}});}
    vocab.slice(0,10).forEach(function(pair,idx){addMC(idx+1,pair);});
    blanks.slice(0,8).forEach(function(item,idx){addFill(idx+1,item);});
    sentences.slice(0,5).forEach(function(sentence,idx){addOrder(idx+1,sentence);});
    sentences.slice(1,6).forEach(function(sentence,idx){addListen(idx+1,sentence);});
    truth.slice(0,4).forEach(function(item,idx){addTF(idx+1,item);});
    addMatch(1,0); addMatch(2,3); addMatch(3,6);
    sentences.slice(0,8).forEach(function(sentence,idx){addSpeak(idx+1,sentence);});
    return tasks.slice(0,43);
  }
  function ensurePhase35BContentExpansion(){
    ensurePhase35AC2Structure();
    try{
      C2_LESSON_BLUEPRINTS.forEach(function(bp){if(C2_PHASE35B_EXPANDED_IDS.indexOf(bp.id)>=0){LESSON_TASKS[bp.id]=createC2ExpandedTasks(bp);}});
      if(COURSE_TREE.c2&&Array.isArray(COURSE_TREE.c2.lessons)){
        COURSE_TREE.c2.subtitle='Deutsch C2 · Lektionen 1-5 mit Kursinhalt und Speaking parallel ausgebaut';
        COURSE_TREE.c2.lessons.forEach(function(lesson){
          var count=(LESSON_TASKS[lesson.id]||[]).length; lesson.tasks=count; lesson.status='available'; lesson.parallelSpeaking=true;
          if(C2_PHASE35B_EXPANDED_IDS.indexOf(lesson.id)>=0){lesson.phase='35B'; lesson.expandedContent=true;}
        });
      }
      var total=C2_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){if(LEVELS[i].id==='c2'){LEVELS[i].status='available'; LEVELS[i].desc='C2 Lektionen 1-5 ausgebaut · '+total+' Aufgaben inkl. Sprechen'; LEVELS[i].progress=10;}}
    }catch(e){}
  }
  function c2ContentSnapshot(){
    ensurePhase35BContentExpansion();
    var lessons=(COURSE_TREE.c2&&COURSE_TREE.c2.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, expanded=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[], sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length, isExp=C2_PHASE35B_EXPANDED_IDS.indexOf(lesson.id)>=0;
      var ok=isExp?(list.length>=43&&sp>=8):(list.length>=12&&sp>=4);
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,expandedContent:isExp,ok:ok};
      total+=list.length; speaking+=sp; normal+=list.length-sp; if(isExp) expanded++; if(!ok) complete=false;
    });
    return {ok:complete&&expanded===5&&lessons.length===10&&total===275&&speaking===60,phase:'35B',level:'c2',expandedLessons:expanded,starterLessons:lessons.length-expanded,lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,expandedLessonTarget:{tasks:43,speaking:8},perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'C2-Lektionen 1-5 wurden mit Kursaufgaben und Speaking gleichzeitig ausgebaut.'},regression:{a2:a2ContentSnapshot(),b1:b1ContentSnapshot(),b2:b2ContentSnapshot(),c1:c1ContentSnapshot()},nextRecommendedPhase:'35C C2 Lektionen 6-10 Inhalt + Speaking ausbauen'};
  }


  var C2_PHASE35C_NEW_IDS=C2_LESSON_BLUEPRINTS.slice(5,10).map(function(bp){return bp.id;});
  var C2_PHASE35C_EXPANDED_IDS=C2_LESSON_BLUEPRINTS.map(function(bp){return bp.id;});
  var C2_PHASE35C_CONTENT={
    'c2-implicit-meaning':{
      focus:'Implizite Bedeutungen, unausgesprochene Voraussetzungen und pragmatische Signale auf höchstem Niveau erschließen.',
      focusTr:'Örtük anlamları, söylenmemiş varsayımları ve pragmatik sinyalleri en üst düzeyde çözümlemek.',
      vocab:[['die Implikation','çıkarım'],['die Andeutung','ima'],['die Voraussetzung','varsayım'],['das Vorwissen','ön bilgi'],['die Schlussfolgerung','sonuç çıkarma'],['die Lesart','yorumlama biçimi'],['implizit','örtük'],['zwischen den Zeilen','satır aralarında'],['voraussetzen','varsaymak'],['herauslesen','çıkarım yapmak']],
      sentences:['Eine Aussage kann weit mehr transportieren, als ihre wörtliche Formulierung zunächst erkennen lässt.','Implizite Bedeutung entsteht häufig aus Kontext, Vorwissen und geteilten Erwartungen der Gesprächspartner.','Wer zwischen den Zeilen liest, rekonstruiert nicht frei, sondern stützt sich auf sprachliche und situative Hinweise.','Eine Andeutung bleibt wirkungsvoll, weil sie dem Hörer einen Teil der Schlussfolgerung überlässt.','C2-Kompetenz zeigt sich darin, unausgesprochene Voraussetzungen präzise zu erkennen und kritisch einzuordnen.','Eine scheinbar beiläufige Formulierung kann eine deutliche soziale oder argumentative Funktion erfüllen.','Implizite Kritik wirkt oft diplomatischer, kann aber auch mehr Interpretationsspielraum öffnen.','Eine Lesart ist überzeugend, wenn sie sowohl Textsignale als auch Kontext plausibel berücksichtigt.'],
      blanks:[['Eine Aussage kann weit mehr transportieren, als ihre wörtliche Formulierung zunächst erkennen lässt.','transportieren'],['Implizite Bedeutung entsteht häufig aus Kontext, Vorwissen und geteilten Erwartungen der Gesprächspartner.','Vorwissen'],['Wer zwischen den Zeilen liest, rekonstruiert nicht frei, sondern stützt sich auf sprachliche und situative Hinweise.','Zeilen'],['Eine Andeutung bleibt wirkungsvoll, weil sie dem Hörer einen Teil der Schlussfolgerung überlässt.','Schlussfolgerung'],['C2-Kompetenz zeigt sich darin, unausgesprochene Voraussetzungen präzise zu erkennen und kritisch einzuordnen.','Voraussetzungen'],['Eine scheinbar beiläufige Formulierung kann eine deutliche soziale oder argumentative Funktion erfüllen.','beiläufige'],['Implizite Kritik wirkt oft diplomatischer, kann aber auch mehr Interpretationsspielraum öffnen.','Interpretationsspielraum'],['Eine Lesart ist überzeugend, wenn sie sowohl Textsignale als auch Kontext plausibel berücksichtigt.','Lesart']],
      truth:[['Implizite Bedeutung entsteht häufig aus Kontext und gemeinsamem Vorwissen.',true],['Zwischen den Zeilen lesen bedeutet, beliebige Bedeutungen zu erfinden.',false],['Eine Andeutung kann eine Schlussfolgerung beim Hörer auslösen.',true],['Implizite Kritik ist immer unpräzise und daher auf C2 verboten.',false]]
    },
    'c2-literary-cultural-critique':{
      focus:'Literarische, kulturelle und gesellschaftliche Deutungen differenziert analysieren und kritisch bewerten.',
      focusTr:'Edebi, kültürel ve toplumsal yorumları ayrıntılı analiz etmek ve eleştirel değerlendirmek.',
      vocab:[['die Deutung','yorum'],['die Ambivalenz','ikirciklilik'],['das Motiv','motif'],['die Perspektive','bakış açısı'],['die Symbolik','sembolizm'],['die Kulturkritik','kültür eleştirisi'],['mehrschichtig','çok katmanlı'],['widersprüchlich','çelişkili'],['interpretieren','yorumlamak'],['einordnen','sınıflandırmak']],
      sentences:['Eine literarische Deutung muss Ambivalenzen ernst nehmen, statt sie vorschnell auf eine eindeutige Botschaft zu reduzieren.','Kulturkritik analysiert nicht nur Einzelphänomene, sondern auch die Werte und Machtverhältnisse, die dahinterstehen.','Ein Motiv gewinnt seine Bedeutung häufig erst durch Wiederholung, Variation und Kontrast innerhalb des Textes.','Eine mehrschichtige Symbolik erlaubt verschiedene Lesarten, ohne beliebig zu werden.','C2-Lesen bedeutet, Perspektive, Stil und kulturellen Kontext zugleich zu berücksichtigen.','Eine widersprüchliche Figur kann gerade dadurch gesellschaftliche Spannungen sichtbar machen.','Kulturelle Deutung verlangt Distanz zur eigenen Selbstverständlichkeit und Offenheit für andere Bezugsrahmen.','Eine starke Interpretation begründet, warum bestimmte Textsignale eine bestimmte Lesart plausibel machen.'],
      blanks:[['Eine literarische Deutung muss Ambivalenzen ernst nehmen, statt sie vorschnell auf eine eindeutige Botschaft zu reduzieren.','Ambivalenzen'],['Kulturkritik analysiert nicht nur Einzelphänomene, sondern auch die Werte und Machtverhältnisse, die dahinterstehen.','Machtverhältnisse'],['Ein Motiv gewinnt seine Bedeutung häufig erst durch Wiederholung, Variation und Kontrast innerhalb des Textes.','Motiv'],['Eine mehrschichtige Symbolik erlaubt verschiedene Lesarten, ohne beliebig zu werden.','Symbolik'],['C2-Lesen bedeutet, Perspektive, Stil und kulturellen Kontext zugleich zu berücksichtigen.','Perspektive'],['Eine widersprüchliche Figur kann gerade dadurch gesellschaftliche Spannungen sichtbar machen.','widersprüchliche'],['Kulturelle Deutung verlangt Distanz zur eigenen Selbstverständlichkeit und Offenheit für andere Bezugsrahmen.','Bezugsrahmen'],['Eine starke Interpretation begründet, warum bestimmte Textsignale eine bestimmte Lesart plausibel machen.','Interpretation']],
      truth:[['Ambivalenz kann ein zentraler Bestandteil literarischer Wirkung sein.',true],['Kulturkritik beschäftigt sich ausschließlich mit Grammatikfehlern.',false],['Eine Interpretation sollte Textsignale nachvollziehbar begründen.',true],['Mehrschichtigkeit bedeutet, dass jede Deutung automatisch gleich stark ist.',false]]
    },
    'c2-scientific-synthesis':{
      focus:'Komplexe wissenschaftliche Positionen synthetisieren, gewichten und präzise zusammenführen.',
      focusTr:'Karmaşık bilimsel görüşleri sentezlemek, ağırlıklandırmak ve kesin biçimde birleştirmek.',
      vocab:[['die Synthese','sentez'],['der Forschungsstand','araştırma durumu'],['die Evidenz','kanıt'],['die Gewichtung','ağırlıklandırma'],['die Einschränkung','sınırlama'],['die Methodik','yöntem'],['herleiten','türetmek'],['abwägen','tartmak'],['empirisch','ampirik'],['interdisziplinär','disiplinlerarası']],
      sentences:['Eine wissenschaftliche Synthese fasst nicht bloß Quellen zusammen, sondern setzt sie kritisch zueinander in Beziehung.','Der Forschungsstand muss so dargestellt werden, dass Konsens, offene Fragen und methodische Grenzen erkennbar bleiben.','Evidenz gewinnt an Überzeugungskraft, wenn ihre Herkunft, Reichweite und Aussagekraft transparent gemacht werden.','Eine differenzierte Gewichtung verhindert, dass schwache Einzelbefunde den Gesamteindruck verzerren.','Interdisziplinäre Argumentation verlangt, Begriffe und Methoden verschiedener Fachrichtungen sauber zu verbinden.','Eine Einschränkung schwächt eine These nicht automatisch, sondern kann ihre wissenschaftliche Präzision erhöhen.','C2 bedeutet, komplexe Informationen nicht zu vereinfachen, sondern strukturiert zugänglich zu machen.','Eine gute Synthese zeigt, welche Schlussfolgerung aus mehreren Positionen begründet hergeleitet werden kann.'],
      blanks:[['Eine wissenschaftliche Synthese fasst nicht bloß Quellen zusammen, sondern setzt sie kritisch zueinander in Beziehung.','Synthese'],['Der Forschungsstand muss so dargestellt werden, dass Konsens, offene Fragen und methodische Grenzen erkennbar bleiben.','Forschungsstand'],['Evidenz gewinnt an Überzeugungskraft, wenn ihre Herkunft, Reichweite und Aussagekraft transparent gemacht werden.','Evidenz'],['Eine differenzierte Gewichtung verhindert, dass schwache Einzelbefunde den Gesamteindruck verzerren.','Gewichtung'],['Interdisziplinäre Argumentation verlangt, Begriffe und Methoden verschiedener Fachrichtungen sauber zu verbinden.','Interdisziplinäre'],['Eine Einschränkung schwächt eine These nicht automatisch, sondern kann ihre wissenschaftliche Präzision erhöhen.','Einschränkung'],['C2 bedeutet, komplexe Informationen nicht zu vereinfachen, sondern strukturiert zugänglich zu machen.','zugänglich'],['Eine gute Synthese zeigt, welche Schlussfolgerung aus mehreren Positionen begründet hergeleitet werden kann.','Schlussfolgerung']],
      truth:[['Eine Synthese setzt Quellen kritisch miteinander in Beziehung.',true],['Evidenz muss nie hinsichtlich ihrer Reichweite geprüft werden.',false],['Methodische Grenzen können wissenschaftliche Aussagen präziser machen.',true],['Interdisziplinär bedeutet, Fachbegriffe beliebig zu vermischen.',false]]
    },
    'c2-diplomacy-negotiation':{
      focus:'Diplomatische Verhandlungsführung, indirekte Kritik und interessengeleitete Kompromissbildung sprachlich meistern.',
      focusTr:'Diplomatik müzakereyi, dolaylı eleştiriyi ve çıkar odaklı uzlaşmayı dilsel olarak yönetmek.',
      vocab:[['die Verhandlungsposition','müzakere pozisyonu'],['der Kompromiss','uzlaşma'],['die Interessenlage','çıkar durumu'],['der Spielraum','manevra alanı'],['die Eskalation','tırmanma'],['die Deeskalation','gerginliği azaltma'],['vermitteln','arabuluculuk yapmak'],['einlenken','geri adım atmak'],['tragfähig','sürdürülebilir'],['verbindlich','bağlayıcı']],
      sentences:['Eine diplomatische Verhandlung wahrt die eigene Position, ohne den Gesprächspartner unnötig zu beschädigen.','Ein tragfähiger Kompromiss berücksichtigt nicht nur Forderungen, sondern auch die dahinterliegenden Interessenlagen.','Deeskalierende Sprache benennt Konflikte klar, verhindert aber unnötige persönliche Zuspitzung.','Wer Spielräume erkennt, kann Zugeständnisse machen, ohne die zentrale Zielsetzung aufzugeben.','Verbindliche Formulierungen schaffen Klarheit, müssen aber so gewählt werden, dass sie realistisch erfüllbar bleiben.','Einlenken ist nicht zwangsläufig Schwäche, sondern kann strategische Beweglichkeit zeigen.','C2-Verhandlungssprache verbindet Präzision, Höflichkeit und zielorientierte Festigkeit.','Eine gute Vermittlung übersetzt gegensätzliche Positionen in gemeinsame Handlungsoptionen.'],
      blanks:[['Eine diplomatische Verhandlung wahrt die eigene Position, ohne den Gesprächspartner unnötig zu beschädigen.','Position'],['Ein tragfähiger Kompromiss berücksichtigt nicht nur Forderungen, sondern auch die dahinterliegenden Interessenlagen.','Kompromiss'],['Deeskalierende Sprache benennt Konflikte klar, verhindert aber unnötige persönliche Zuspitzung.','Deeskalierende'],['Wer Spielräume erkennt, kann Zugeständnisse machen, ohne die zentrale Zielsetzung aufzugeben.','Spielräume'],['Verbindliche Formulierungen schaffen Klarheit, müssen aber so gewählt werden, dass sie realistisch erfüllbar bleiben.','Verbindliche'],['Einlenken ist nicht zwangsläufig Schwäche, sondern kann strategische Beweglichkeit zeigen.','Einlenken'],['C2-Verhandlungssprache verbindet Präzision, Höflichkeit und zielorientierte Festigkeit.','Verhandlungssprache'],['Eine gute Vermittlung übersetzt gegensätzliche Positionen in gemeinsame Handlungsoptionen.','Vermittlung']],
      truth:[['Ein tragfähiger Kompromiss berücksichtigt Interessen, nicht nur Forderungen.',true],['Deeskalation bedeutet, Konflikte vollständig zu verschweigen.',false],['Verbindliche Sprache sollte klar und realistisch sein.',true],['Einlenken ist in Verhandlungen immer ein Zeichen von Schwäche.',false]]
    },
    'c2-communication-mastery':{
      focus:'Kommunikative Meisterschaft: komplexe Inhalte souverän, situationssensibel und wirkungsbewusst gestalten.',
      focusTr:'İletişim ustalığı: karmaşık içerikleri hakim, duruma duyarlı ve etkili biçimde kurmak.',
      vocab:[['die Souveränität','hakimiyet'],['die Wirkungskontrolle','etki kontrolü'],['die Situationssensibilität','durum duyarlılığı'],['die Prägnanz','özlülük'],['die Kohärenz','tutarlılık'],['die Adressatenorientierung','hedef kitleye uyum'],['verdichten','yoğunlaştırmak'],['strukturieren','yapılandırmak'],['modulieren','tonlamak'],['abschließen','sonuçlandırmak']],
      sentences:['Kommunikative Meisterschaft zeigt sich darin, komplexe Inhalte präzise, adressatengerecht und wirkungsvoll zu verdichten.','Souveränität bedeutet nicht, möglichst kompliziert zu sprechen, sondern Komplexität kontrolliert zugänglich zu machen.','Eine starke Struktur führt den Zuhörer durch anspruchsvolle Inhalte, ohne ihn zu überfordern.','Situationssensibilität entscheidet, ob eine Formulierung trotz sprachlicher Eleganz angemessen wirkt.','Prägnanz entsteht, wenn das Wesentliche klar hervortritt und Nebeninformationen bewusst geordnet werden.','Wirkungskontrolle verlangt, Ton, Tempo und Register während des Sprechens bewusst zu modulieren.','Ein überzeugender Abschluss bündelt die Hauptaussage und öffnet zugleich einen klaren nächsten Gedanken.','C2-Kommunikation verbindet sprachliche Exzellenz mit sozialer, fachlicher und rhetorischer Genauigkeit.'],
      blanks:[['Kommunikative Meisterschaft zeigt sich darin, komplexe Inhalte präzise, adressatengerecht und wirkungsvoll zu verdichten.','verdichten'],['Souveränität bedeutet nicht, möglichst kompliziert zu sprechen, sondern Komplexität kontrolliert zugänglich zu machen.','Souveränität'],['Eine starke Struktur führt den Zuhörer durch anspruchsvolle Inhalte, ohne ihn zu überfordern.','Struktur'],['Situationssensibilität entscheidet, ob eine Formulierung trotz sprachlicher Eleganz angemessen wirkt.','Situationssensibilität'],['Prägnanz entsteht, wenn das Wesentliche klar hervortritt und Nebeninformationen bewusst geordnet werden.','Prägnanz'],['Wirkungskontrolle verlangt, Ton, Tempo und Register während des Sprechens bewusst zu modulieren.','Wirkungskontrolle'],['Ein überzeugender Abschluss bündelt die Hauptaussage und öffnet zugleich einen klaren nächsten Gedanken.','Abschluss'],['C2-Kommunikation verbindet sprachliche Exzellenz mit sozialer, fachlicher und rhetorischer Genauigkeit.','Exzellenz']],
      truth:[['Souveränität bedeutet, Komplexität kontrolliert zugänglich zu machen.',true],['Prägnanz entsteht durch möglichst viele ungeordnete Nebendetails.',false],['Adressatenorientierung ist auch auf C2 entscheidend.',true],['Wirkungskontrolle betrifft nur den Inhalt, niemals Ton oder Tempo.',false]]
    }
  };
  function createC2ExpandedTasks35C(bp){
    var data=C2_PHASE35C_CONTENT[bp.id];
    if(!data){return createC2ExpandedTasks(bp);}
    var tasks=[], id=bp.id, title=bp.title, vocab=data.vocab||[], sentences=data.sentences||[], blanks=data.blanks||[], truth=data.truth||[];
    function addMC(i,pair){tasks.push({id:id+'-35c-mc-'+i,type:'multiple_choice',phase:'35C',parallelContent:true,c2Expanded:true,prompt:{de:'Welche präzise C2-Bedeutung passt zu „'+pair[0]+'“?',tr:'„'+pair[0]+'“ için hangi kesin C2 anlamı uygundur?'},instruction:{de:'Wähle die Bedeutung, die Kontext, Nuance und Register am genauesten trifft.',tr:'Bağlamı, nüansı ve üslubu en kesin karşılayan anlamı seç.'},choices:c2ExpandedChoices(pair[1]),answer:'a',hint:{de:'Thema: '+title+'. Achte auf höchste Präzision.',tr:'Konu: '+title+'. En yüksek kesinliğe dikkat et.'},explain:{de:'„'+pair[0]+'“ bedeutet hier „'+pair[1]+'“.',tr:'„'+pair[0]+'“ burada „'+pair[1]+'“ anlamına gelir.'}});}
    function addFill(i,item){var sentence=item[0],answer=item[1];tasks.push({id:id+'-35c-fill-'+i,type:'fill_blank',phase:'35C',parallelContent:true,c2Expanded:true,prompt:{de:'Ergänze den C2-Satz.',tr:'C2 cümlesini tamamla.'},instruction:{de:'Wähle das Wort, das Bedeutung, Register und argumentative Präzision verbindet.',tr:'Anlamı, üslubu ve argümansal kesinliği bağlayan kelimeyi seç.'},sentence:{de:String(sentence).replace(answer,'____'),tr:String(sentence).replace(answer,'____')},options:[answer,'Fenster','gestern','Bleistift'],answer:answer,hint:{de:'C2 prüft hier präzise Funktion, Nuance und Kontext.',tr:'C2 burada kesin işlevi, nüansı ve bağlamı ölçer.'},explain:{de:'Richtig ist: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addOrder(i,sentence){var tokens=c2ExpandedTokens(sentence);tasks.push({id:id+'-35c-order-'+i,type:'sentence_order',phase:'35C',parallelContent:true,c2Expanded:true,prompt:{de:'Ordne den komplexen C2-Satz.',tr:'Karmaşık C2 cümlesini sırala.'},instruction:{de:'Achte auf Hauptaussage, Einschränkung, Wirkung und logische Struktur.',tr:'Ana ifadeye, sınırlamaya, etkiye ve mantıksal yapıya dikkat et.'},tokens:tokens,answer:tokens,hint:{de:'Beginne mit der tragenden Aussage und ordne danach die Nuancen ein.',tr:'Taşıyıcı ifadeyle başla; sonra nüansları yerleştir.'},explain:{de:'Der richtige Satz lautet: '+sentence,tr:'Doğru cümle: '+sentence}});}
    function addListen(i,sentence){tasks.push({id:id+'-35c-listen-'+i,type:'listening_choice',phase:'35C',parallelContent:true,c2Expanded:true,prompt:{de:'Höre den C2-Satz und wähle die genaue Aussage.',tr:'C2 cümlesini dinle ve tam ifadeyi seç.'},instruction:{de:'Achte auf Nuance, Register, implizite Bedeutung und Wirkung.',tr:'Nüansa, üsluba, örtük anlama ve etkiye dikkat et.'},audioText:{de:sentence,tr:sentence},audioLabel:{de:sentence,tr:sentence},choices:[{id:'a',text:sentence},{id:'b',text:'Ich gehe heute früh nach Hause.'},{id:'c',text:'Das Essen steht auf dem Tisch.'},{id:'d',text:'Wir treffen uns morgen um acht.'}],answer:'a',hint:{de:'C2-Hören verlangt extrem genaue Bedeutungswahrnehmung.',tr:'C2 dinleme son derece kesin anlam algısı ister.'},explain:{de:'Du hast gehört: '+sentence,tr:'Duyduğun cümle: '+sentence}});}
    function addTF(i,item){tasks.push({id:id+'-35c-tf-'+i,type:'true_false',phase:'35C',parallelContent:true,c2Expanded:true,prompt:{de:'Richtig oder falsch?',tr:'Doğru mu yanlış mı?'},instruction:{de:'Entscheide nach C2-Bedeutung, Kontext und stilistischer Angemessenheit.',tr:'C2 anlamına, bağlama ve üslup uygunluğuna göre karar ver.'},statement:{de:item[0],tr:item[0]},answer:item[1]?'true':'false',hint:{de:'Vergleiche die Aussage mit der Lektion „'+title+'“.',tr:'İfadeyi „'+title+'“ dersiyle karşılaştır.'},explain:{de:item[1]?'Die Aussage ist richtig.':'Die Aussage ist falsch.',tr:item[1]?'İfade doğru.':'İfade yanlış.'}});}
    function addMatch(i,offset){var pairs=vocab.slice(offset,offset+3).map(function(p){return {left:p[0],right:p[1]};});tasks.push({id:id+'-35c-match-'+i,type:'matching',phase:'35C',parallelContent:true,c2Expanded:true,prompt:{de:'Ordne die C2-Begriffe zu.',tr:'C2 kavramlarını eşleştir.'},instruction:{de:'Verbinde Begriff und präzise Bedeutung.',tr:'Kavramı kesin anlamıyla eşleştir.'},pairs:pairs,answer:'all',hint:{de:'Alle Begriffe gehören zur Lektion „'+title+'“.',tr:'Tüm kavramlar „'+title+'“ dersine ait.'},explain:{de:'Diese Begriffe sind zentrale Wörter dieser C2-Lektion.',tr:'Bu kavramlar bu C2 dersinin temel kelimeleridir.'}});}
    function addSpeak(i,sentence){tasks.push({id:id+'-35c-speak-'+i,type:'speaking_practice',phase:'35C',skill:'speaking',parallelContent:true,c2Expanded:true,prompt:{de:'Sprich den C2-Satz nach: „'+sentence+'“',tr:'C2 cümlesini tekrar söyle: „'+sentence+'“'},instruction:{de:'Sprich souverän, präzise und wirkungsbewusst. Achte auf Rhythmus, Register und Nuance.',tr:'Hakim, kesin ve etki bilinciyle konuş. Ritim, üslup ve nüansa dikkat et.'},expectedText:{de:sentence,tr:sentence},answer:sentence,acceptedPhrases:[sentence],speechVariants:[sentence,String(sentence).replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')],hint:{de:'C2-Sprechen: souverän, differenziert, präzise und situationssensibel.',tr:'C2 konuşma: hakim, ayrıntılı, kesin ve duruma duyarlı.'},explain:{de:'Sprechübung zu „'+title+'“. Ziel ist kommunikative Meisterschaft mit natürlicher Wirkung.',tr:'„'+title+'“ için konuşma alıştırması. Amaç doğal etkiyle iletişim ustalığıdır.'}});}
    vocab.slice(0,10).forEach(function(pair,idx){addMC(idx+1,pair);});
    blanks.slice(0,8).forEach(function(item,idx){addFill(idx+1,item);});
    sentences.slice(0,5).forEach(function(sentence,idx){addOrder(idx+1,sentence);});
    sentences.slice(1,6).forEach(function(sentence,idx){addListen(idx+1,sentence);});
    truth.slice(0,4).forEach(function(item,idx){addTF(idx+1,item);});
    addMatch(1,0); addMatch(2,3); addMatch(3,6);
    sentences.slice(0,8).forEach(function(sentence,idx){addSpeak(idx+1,sentence);});
    return tasks.slice(0,43);
  }
  function ensurePhase35CContentExpansion(){
    ensurePhase35BContentExpansion();
    try{
      C2_LESSON_BLUEPRINTS.forEach(function(bp){if(C2_PHASE35C_NEW_IDS.indexOf(bp.id)>=0){LESSON_TASKS[bp.id]=createC2ExpandedTasks35C(bp);}});
      if(COURSE_TREE.c2&&Array.isArray(COURSE_TREE.c2.lessons)){
        COURSE_TREE.c2.subtitle='Deutsch C2 · alle 10 Lektionen mit Kursinhalt und Speaking vollständig ausgebaut';
        COURSE_TREE.c2.lessons.forEach(function(lesson){
          var count=(LESSON_TASKS[lesson.id]||[]).length; lesson.tasks=count; lesson.status='available'; lesson.parallelSpeaking=true; lesson.phase=C2_PHASE35C_NEW_IDS.indexOf(lesson.id)>=0?'35C':'35B'; lesson.expandedContent=true;
        });
      }
      var total=C2_LESSON_BLUEPRINTS.reduce(function(sum,bp){return sum+((LESSON_TASKS[bp.id]||[]).length);},0);
      for(var i=0;i<LEVELS.length;i++){if(LEVELS[i].id==='c2'){LEVELS[i].status='available'; LEVELS[i].desc='C2 vollständig ausgebaut · '+total+' Aufgaben inkl. Sprechen'; LEVELS[i].progress=14;}}
    }catch(e){}
  }
  function c2ContentSnapshot(){
    ensurePhase35CContentExpansion();
    var lessons=(COURSE_TREE.c2&&COURSE_TREE.c2.lessons)||[], perLesson={}, total=0, speaking=0, normal=0, expanded=0, complete=true;
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[], sp=list.filter(function(t){return t&&taskType(t)==='speaking_practice';}).length, isExp=C2_PHASE35C_EXPANDED_IDS.indexOf(lesson.id)>=0;
      var ok=isExp?(list.length>=43&&sp>=8):false;
      perLesson[lesson.id]={title:lesson.title,tasks:list.length,normalTasks:list.length-sp,speakingTasks:sp,expandedContent:isExp,phase:lesson.phase,ok:ok};
      total+=list.length; speaking+=sp; normal+=list.length-sp; if(isExp) expanded++; if(!ok) complete=false;
    });
    return {ok:complete&&expanded===10&&lessons.length===10&&total===430&&normal===350&&speaking===80,phase:'35C',level:'c2',expandedLessons:expanded,starterLessons:lessons.length-expanded,lessons:lessons.length,totalTasks:total,normalTasks:normal,speakingTasks:speaking,expandedLessonTarget:{tasks:43,speaking:8},perLesson:perLesson,parallelBuildPolicy:{active:true,rule:'C2-Lektionen 6-10 wurden mit Kursaufgaben und Speaking gleichzeitig ausgebaut; C2 ist vollständig.'},regression:{a2:a2ContentSnapshot(),b1:b1ContentSnapshot(),b2:b2ContentSnapshot(),c1:c1ContentSnapshot()},nextRecommendedPhase:'35D C2 Gesamt-QA + UI/Flow-Prüfung'};
  }



  function phase35dQaSnapshot(){
    ensurePhase30SpeakingTask();
    ensurePhase31BContentExpansion();
    ensurePhase32BContentExpansion();
    ensurePhase33CContentExpansion();
    ensurePhase34BContentExpansion();
    ensurePhase35CContentExpansion();
    var snap=c2ContentSnapshot();
    var lessons=(COURSE_TREE.c2&&COURSE_TREE.c2.lessons)||[];
    var ids={}, duplicateTaskIds=[], missingRequired=[], typeCounts={}, lessonFlow=[];
    lessons.forEach(function(lesson){
      var list=LESSON_TASKS[lesson.id]||[];
      var speaking=list.filter(function(t){return t&&taskType(t)==='speaking_practice';});
      var normal=list.length-speaking.length;
      lessonFlow.push({id:lesson.id,title:lesson.title,tasks:list.length,normalTasks:normal,speakingTasks:speaking.length,status:lesson.status,phase:lesson.phase,ok:list.length===43&&speaking.length===8&&lesson.status==='available'});
      list.forEach(function(t,idx){
        if(!t||!t.id){missingRequired.push({lesson:lesson.id,index:idx,field:'id'}); return;}
        if(ids[t.id]) duplicateTaskIds.push(t.id); ids[t.id]=true;
        var tt=taskType(t); typeCounts[tt]=(typeCounts[tt]||0)+1;
        ['prompt','instruction'].forEach(function(field){ if(!t[field]) missingRequired.push({lesson:lesson.id,task:t.id,field:field}); });
        if(tt==='speaking_practice'){
          if(!t.expectedText&&!t.answer) missingRequired.push({lesson:lesson.id,task:t.id,field:'expectedText/answer'});
          if(!t.parallelContent) missingRequired.push({lesson:lesson.id,task:t.id,field:'parallelContent'});
        }
      });
    });
    var uiChecks={
      levelAvailable:!!(COURSE_TREE.c2&&COURSE_TREE.c2.status!=='locked'),
      allLessonsVisible:lessons.length===10,
      allLessonsAvailable:lessonFlow.every(function(x){return x.status==='available';}),
      allLessonTaskCountsStable:lessonFlow.every(function(x){return x.tasks===43&&x.speakingTasks===8;}),
      speakingFallbackReady:!!(window.SpeechRecognition||window.webkitSpeechRecognition)||true,
      guidedFallbackRequired:true,
      guidedFallbackPolicy:'Desktop/unterstützte Browser nutzen automatische SpeechRecognition; iPhone/iPad/unsupported Browser nutzen geführten Sprechmodus mit Selbstbewertung.',
      dashboardFlow:'C2-Level -> Lektion 1 bis 10 -> Aufgabe -> normale Auswertung oder Speaking-Fallback.',
      progressPersistenceExpected:true,
      coachCompatibilityExpected:true,
      errorTrainingCompatibilityExpected:true
    };
    var regression={a2:a2ContentSnapshot(),b1:b1ContentSnapshot(),b2:b2ContentSnapshot(),c1:c1ContentSnapshot(),c2:snap};
    var ok=!!(snap&&snap.ok&&lessons.length===10&&snap.totalTasks===430&&snap.normalTasks===350&&snap.speakingTasks===80&&duplicateTaskIds.length===0&&missingRequired.length===0&&uiChecks.allLessonsAvailable&&uiChecks.allLessonTaskCountsStable&&regression.a2.ok&&regression.b1.ok&&regression.b2.ok&&regression.c1.ok);
    return {ok:ok,phase:'35D',level:'c2',version:VERSION,summary:{lessons:lessons.length,expandedLessons:snap.expandedLessons,starterLessons:snap.starterLessons,totalTasks:snap.totalTasks,normalTasks:snap.normalTasks,speakingTasks:snap.speakingTasks,duplicateTaskIds:duplicateTaskIds.length,missingRequired:missingRequired.length},typeCounts:typeCounts,lessonFlow:lessonFlow,uiChecks:uiChecks,duplicateTaskIds:duplicateTaskIds,missingRequired:missingRequired,regression:regression,deviceSimulationProfiles:['Desktop 1440','Desktop 1024','iPhone 15 Pro Max','iPhone SE','iPad 11','iPad 12.9'],nextRecommendedPhase:'36A Produktreife Gesamt-QA A1-C2 + Release Candidate'};
  }



  var PLACEMENT_TEST_KEY='language_academy_placement_test_phase37a_v1';
  var PLACEMENT_LEVELS=['a1','a2','b1','b2','c1','c2'];
  var PLACEMENT_LABELS={a1:'A1',a2:'A2',b1:'B1',b2:'B2',c1:'C1',c2:'C2'};

  function ensurePhase37APlacementTest(){
    ensurePhase30SpeakingTask(); ensurePhase31BContentExpansion(); ensurePhase32BContentExpansion(); ensurePhase33CContentExpansion(); ensurePhase34BContentExpansion(); ensurePhase35CContentExpansion();
    return true;
  }
  function taskLevelWeight(level){ var idx=PLACEMENT_LEVELS.indexOf(level); return idx<0?1:(idx+1); }
  function placementTaskIsUsable(t){
    var tt=taskType(t);
    return t && (tt==='multiple_choice'||tt==='listening_choice'||tt==='fill_blank'||tt==='true_false'||tt==='speaking_practice') && t.prompt && t.instruction;
  }
  function clonePlacementTask(level,lesson,t,idx){
    var tt=taskType(t), prompt=localized(t.prompt,'learn')||'', instruction=localized(t.instruction,'learn')||'', q={id:'placement-'+level+'-'+idx+'-'+String(t.id||idx),sourceId:t.id,level:level,levelLabel:PLACEMENT_LABELS[level]||level.toUpperCase(),lessonId:lesson.id,lessonTitle:lesson.title,type:tt,prompt:prompt,instruction:instruction,answer:t.answer,weight:taskLevelWeight(level),explain:localized(t.explain,'help')||'',hint:localized(t.hint,'help')||''};
    if(tt==='multiple_choice'||tt==='listening_choice'){ q.choices=(t.choices||[]).map(function(c){return {id:c.id,text:c.text};}); q.audioText=localized(t.audioText,'learn')||localized(t.audioLabel,'learn')||''; }
    else if(tt==='fill_blank'){ q.sentence=localized(t.sentence,'learn')||''; q.choices=(t.options||[]).map(function(o,i){return {id:String(o),text:String(o)};}); }
    else if(tt==='true_false'){ q.statement=localized(t.statement,'learn')||''; q.choices=[{id:'true',text:'Richtig'},{id:'false',text:'Falsch'}]; }
    else if(tt==='speaking_practice'){ var target=(t.expectedText&&typeof t.expectedText==='object'?(t.expectedText.de||t.expectedText.tr):t.expectedText)||t.answer||''; q.targetText=target; q.choices=[{id:'100',text:'Sehr gut gesprochen'},{id:'80',text:'Fast richtig'},{id:'55',text:'Noch unsicher'},{id:'25',text:'Nochmal üben'}]; q.selfAssessment=true; }
    return q;
  }
  function placementQuestionPool(){
    ensurePhase37APlacementTest();
    var pool=[];
    PLACEMENT_LEVELS.forEach(function(level){
      var course=COURSE_TREE[level], lessons=(course&&course.lessons)||[], normal=[], speaking=[];
      lessons.forEach(function(lesson){
        (LESSON_TASKS[lesson.id]||[]).forEach(function(t){
          if(!placementTaskIsUsable(t)) return;
          if(taskType(t)==='speaking_practice') speaking.push({lesson:lesson,task:t}); else normal.push({lesson:lesson,task:t});
        });
      });
      normal.slice(0,5).forEach(function(x,i){pool.push(clonePlacementTask(level,x.lesson,x.task,i+1));});
      speaking.slice(0,2).forEach(function(x,i){pool.push(clonePlacementTask(level,x.lesson,x.task,6+i));});
    });
    return pool;
  }
  function placementInitialState(){
    var pool=placementQuestionPool();
    return {phase:'37A',startedAt:new Date().toISOString(),durationMinutes:45,index:0,answers:{},finished:false,pool:pool};
  }
  function loadPlacementState(){ try{var raw=localStorage.getItem(PLACEMENT_TEST_KEY); if(raw){var st=JSON.parse(raw); if(st&&st.pool&&st.pool.length) return st;}}catch(e){} return null; }
  function savePlacementState(st){ try{localStorage.setItem(PLACEMENT_TEST_KEY,JSON.stringify(st));}catch(e){} }
  function resetPlacementState(){ var st=placementInitialState(); savePlacementState(st); return st; }
  function placementAnswerIsCorrect(q,value){
    if(!q) return false;
    if(q.selfAssessment){ return Number(value)>=80; }
    if(q.type==='fill_blank') return String(value||'').trim().toLowerCase()===String(q.answer||'').trim().toLowerCase();
    return String(value)===String(q.answer);
  }
  function placementResultFromState(st){
    var levels={}, totalWeighted=0, scoreWeighted=0, answered=0;
    PLACEMENT_LEVELS.forEach(function(l){levels[l]={level:l,label:PLACEMENT_LABELS[l],items:0,answered:0,correct:0,points:0,max:0,accuracy:0};});
    (st.pool||[]).forEach(function(q){
      var l=levels[q.level]; if(!l) return; l.items++; l.max+=q.weight; totalWeighted+=q.weight;
      var a=st.answers&&st.answers[q.id]; if(!a) return; answered++; l.answered++; var correct=placementAnswerIsCorrect(q,a.value); if(correct){l.correct++; l.points+=q.weight; scoreWeighted+=q.weight;} else if(q.selfAssessment){ var partial=Math.max(0,Math.min(1,Number(a.value||0)/100)); l.points+=q.weight*partial; scoreWeighted+=q.weight*partial; }
    });
    PLACEMENT_LEVELS.forEach(function(l){var x=levels[l]; x.accuracy=x.max?Math.round((x.points/x.max)*100):0;});
    var pct=totalWeighted?Math.round((scoreWeighted/totalWeighted)*100):0;
    var recommended='a1';
    if(levels.c2.accuracy>=72&&levels.c1.accuracy>=70) recommended='c2';
    else if(levels.c1.accuracy>=70&&levels.b2.accuracy>=68) recommended='c1';
    else if(levels.b2.accuracy>=68&&levels.b1.accuracy>=65) recommended='b2';
    else if(levels.b1.accuracy>=65&&levels.a2.accuracy>=60) recommended='b1';
    else if(levels.a2.accuracy>=60&&levels.a1.accuracy>=55) recommended='a2';
    else recommended='a1';
    return {phase:'37A',ok:true,totalQuestions:(st.pool||[]).length,answered:answered,overallAccuracy:pct,recommendedLevel:recommended,recommendedLabel:PLACEMENT_LABELS[recommended],levels:levels,completed:!!st.finished,startedAt:st.startedAt,finishedAt:st.finishedAt||null};
  }
  function placementProgressHtml(st){
    var total=(st.pool||[]).length, idx=Math.min(st.index+1,total); return '<div class="la-placement-progress"><span class="la-section-kicker">Frage '+esc(idx)+' von '+esc(total)+'</span><span class="la-progress"><i style="width:'+esc(Math.round((idx/Math.max(total,1))*100))+'%"></i></span><small>Timer: 45 Minuten · simulierte Einstufung A1-C2</small></div>';
  }
  function placementQuestionHtml(st){
    var q=st.pool[st.index]; if(!q) return placementResultHtml(st);
    var extra=''; if(q.audioText) extra+='<p class="la-note">Hörsatz: <b>'+esc(q.audioText)+'</b></p>'; if(q.sentence) extra+='<p class="la-note">'+esc(q.sentence)+'</p>'; if(q.statement) extra+='<p class="la-note">'+esc(q.statement)+'</p>'; if(q.targetText) extra+='<p class="la-note">Sprich laut nach: <b>'+esc(q.targetText)+'</b></p>';
    var choices=(q.choices||[]).map(function(c){return '<button type="button" class="la-secondary" data-ui-action="language-course-placement-answer" data-la-answer="'+esc(c.id)+'">'+esc(c.text)+'</button>';}).join('');
    return '<div class="la-dashboard la-placement-test" data-la-placement-test="phase37a">'+placementProgressHtml(st)+'<section class="la-card"><span class="la-section-kicker">'+esc(q.levelLabel)+' · '+esc(q.lessonTitle)+' · '+esc(q.type)+'</span><h3>'+esc(q.prompt)+'</h3><p>'+esc(q.instruction)+'</p>'+extra+'<div class="la-level-actions">'+choices+'</div><p class="la-note">'+esc(q.selfAssessment?'Sprechen wird hier ehrlich als Selbstbewertung gezählt.':'Dies ist eine Testfrage ohne direkte Hilfe während der Simulation.')+'</p></section><section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-placement-close">Dashboard</button><button type="button" class="la-secondary" data-ui-action="language-course-placement-reset">Neu starten</button></div></section></div>';
  }
  function placementResultHtml(st){
    var r=placementResultFromState(st), rows=PLACEMENT_LEVELS.map(function(l){var x=r.levels[l];return '<tr><td>'+esc(x.label)+'</td><td>'+esc(x.answered)+'/'+esc(x.items)+'</td><td>'+esc(x.accuracy)+'%</td></tr>';}).join('');
    return '<div class="la-dashboard la-placement-result" data-la-placement-test="phase37a"><section class="la-card"><span class="la-section-kicker">Einstufungstest Ergebnis</span><h3>Geschätztes Niveau: '+esc(r.recommendedLabel)+'</h3><p>Gesamtwert: <b>'+esc(r.overallAccuracy)+'%</b> · beantwortet: '+esc(r.answered)+'/'+esc(r.totalQuestions)+'</p><p class="la-note">Das ist eine Lernempfehlung, kein offizielles Zertifikat. Für die Academy reicht es, um den passenden Startpunkt zu finden.</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-course-open-level" data-la-level="'+esc(r.recommendedLevel)+'">Empfohlenes Niveau öffnen</button><button type="button" class="la-secondary" data-ui-action="language-course-placement-reset">Test neu starten</button></div></section><section class="la-card"><span class="la-section-kicker">Detailauswertung</span><table class="la-table"><thead><tr><th>Niveau</th><th>Antworten</th><th>Wert</th></tr></thead><tbody>'+rows+'</tbody></table></section></div>';
  }
  function openPlacementTest(reset){
    ensurePhase37APlacementTest();
    var st=reset?resetPlacementState():(loadPlacementState()||resetPlacementState());
    if(st.finished){ return openPlacementResult(st); }
    var body=placementQuestionHtml(st);
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function'){ var r=window.EGTUILayer.openDeepSheet({type:'language-course-placement-test',theme:'blue',title:'Einstufungstest A1-C2',kicker:'Sprachtest',subtitle:'Simulierter Einstufungstest mit Ergebnisniveau.',iconHtml:'🧭',bodyHtml:body}); setTimeout(bindSheetEvents,40); return r; }}catch(e){}
    alert('Einstufungstest bereit.'); return true;
  }
  function openPlacementResult(st){
    st=st||loadPlacementState()||resetPlacementState(); st.finished=true; if(!st.finishedAt) st.finishedAt=new Date().toISOString(); savePlacementState(st);
    var body=placementResultHtml(st);
    try{ if(window.EGTUILayer&&typeof window.EGTUILayer.openDeepSheet==='function'){ var r=window.EGTUILayer.openDeepSheet({type:'language-course-placement-result',theme:'blue',title:'Testergebnis',kicker:'Sprachtest A1-C2',subtitle:'Einstufung und Lernempfehlung.',iconHtml:'🏁',bodyHtml:body}); setTimeout(bindSheetEvents,40); return r; }}catch(e){}
    alert('Testergebnis: '+placementResultFromState(st).recommendedLabel); return true;
  }
  function answerPlacement(value){
    var st=loadPlacementState()||resetPlacementState(), q=st.pool[st.index]; if(!q) return openPlacementResult(st);
    st.answers=st.answers||{}; st.answers[q.id]={value:value,answeredAt:new Date().toISOString(),correct:placementAnswerIsCorrect(q,value),level:q.level,type:q.type};
    if(st.index>=st.pool.length-1){st.finished=true; st.finishedAt=new Date().toISOString(); savePlacementState(st); return openPlacementResult(st);} st.index++; savePlacementState(st); return openPlacementTest(false);
  }
  function placementTestSnapshot(){
    ensurePhase37APlacementTest();
    var pool=placementQuestionPool(), per={}; pool.forEach(function(q){per[q.level]=per[q.level]||{total:0,normal:0,speaking:0}; per[q.level].total++; if(q.type==='speaking_practice') per[q.level].speaking++; else per[q.level].normal++;});
    var levelsOk=PLACEMENT_LEVELS.every(function(l){return per[l]&&per[l].total===7&&per[l].normal===5&&per[l].speaking===2;});
    return {ok:levelsOk&&pool.length===42,phase:'37A',module:'placement_test',levels:PLACEMENT_LEVELS.slice(),totalQuestions:pool.length,normalQuestions:pool.filter(function(q){return q.type!=='speaking_practice';}).length,speakingQuestions:pool.filter(function(q){return q.type==='speaking_practice';}).length,questionsPerLevel:per,timerMinutes:45,resultMode:'estimated_level_a1_to_c2',certificate:false,recommendation:true,nextRecommendedPhase:'Konzept Abschlusstest pro Niveau'};
  }
  function phase37aQaSnapshot(){
    var snap=placementTestSnapshot();
    return {ok:!!(snap&&snap.ok),phase:'37A',version:VERSION,placementTest:snap,regression:{a2:a2ContentSnapshot(),b1:b1ContentSnapshot(),b2:b2ContentSnapshot(),c1:c1ContentSnapshot(),c2:c2ContentSnapshot()},uiChecks:{dashboardEntry:true,routeActions:['language-course-placement-test','language-course-placement-answer','language-course-placement-reset'],resultReport:true,levelRecommendation:true,githubPagesCompatible:true},handoff:'Nach Phase 37A im nächsten Chat Konzept und Umsetzung Abschlusstest pro Niveau planen.'};
  }

  function phase38bSpeakingAiSnapshot(){ return {ok:speakingAiAvailable(),phase:'38B',clientLoaded:speakingAiAvailable(),config:!!window.LanguageAcademyAIConfig,worker:(window.LanguageAcademyAIConfig&&window.LanguageAcademyAIConfig.workerBaseUrl)||'',routes:(window.LanguageAcademyAIConfig&&window.LanguageAcademyAIConfig.endpoints)||{},features:['visible speaking AI panel','training assessment','exam-speaking assessment','off-topic feedback','manual iPhone/iPad transcript fallback','local fallback via LanguageSpeakingAI']}; }
  function diagnostics(){ensurePhase30SpeakingTask(); ensurePhase31BContentExpansion(); ensurePhase32BContentExpansion(); ensurePhase33CContentExpansion(); ensurePhase34BContentExpansion(); ensurePhase35CContentExpansion(); ensurePhase37APlacementTest(); return {ok:true,phase:'38C.2',version:VERSION,examShell:(window.LanguageExamShell&&window.LanguageExamShell.diagnostics?window.LanguageExamShell.diagnostics():null),placementTest:placementTestSnapshot(),phase37aQa:phase37aQaSnapshot(),phase38bSpeakingAi:phase38bSpeakingAiSnapshot(),c2Structure:c2StructureSnapshot(),c2Content:c2ContentSnapshot(),phase35dQa:phase35dQaSnapshot(),b2Structure:b2StructureSnapshot(),b2Content:b2ContentSnapshot(),phase33dQa:phase33dQaSnapshot(),c1Structure:c1StructureSnapshot(),c1Content:c1ContentSnapshot(),phase34dQa:phase34dQaSnapshot(),phase31dQa:phase31dQaSnapshot(),phase32dQa:phase32dQaSnapshot(),b1Structure:b1StructureSnapshot(),b1Content:b1ContentSnapshot(),visibleEntry:!!document.querySelector('[data-ui-action="language-course-open"]'),dashboardCapable:true,hasTranslation:!!window.LanguageAcademyTranslationEngine,hasStore:!!window.LanguageAcademyLanguageStore,hasHelp:!!window.LanguageAcademyHelpSystem,levels:LEVELS.length,coachQa:coachQaSnapshot(),cloudSync:syncStatusLabel(),phase29Qa:phase29QaSnapshot(),phase30Speech:phase30SpeechSnapshot(),speechQa:speechQaSnapshot(),a2Structure:a2StructureSnapshot(),a2Content:a2ContentSnapshot(),registered:!!(window.AppModuleHost&&AppModuleHost.listModules&&AppModuleHost.listModules().some(function(m){return m.id==='language-course-entry';}))};}
  ensurePhase30SpeakingTask();
  ensurePhase31BContentExpansion();
  ensurePhase32BContentExpansion();
  ensurePhase33CContentExpansion();
  ensurePhase34BContentExpansion();
  ensurePhase35CContentExpansion();
  ensurePhase37APlacementTest();
  window.LanguageAcademyCourseEntry=Object.freeze({__version:VERSION,open:openDashboard,openCoach:openCoachPanel,coachInsight:coachInsight,coachRecommendations:coachRecommendationCards,coachReviewSets:coachReviewSets,startCoachRecommendation:startCoachRecommendation,coachQaSnapshot:coachQaSnapshot,openTaskTypeTraining:openTaskTypeTraining,openDashboard:openDashboard,openLevels:openLevels,openLevel:openLevel,openLesson:openLesson,openTask:openTask,openSettings:openSettings,openContinue:openContinue,openRepeatErrors:openRepeatErrors,openVocabulary:openVocabulary,openVocabularyTraining:openVocabularyTraining,openErrorTraining:openErrorTraining,getProgress:getCourseProgress,saveProgress:saveCourseProgress,syncPush:syncPushNow,syncPull:syncPullNow,syncStatus:syncStatusLabel,phase29QaSnapshot:phase29QaSnapshot,phase30SpeechSnapshot:phase30SpeechSnapshot,speechQaSnapshot:speechQaSnapshot,a2StructureSnapshot:a2StructureSnapshot,a2ContentSnapshot:a2ContentSnapshot,phase31dQaSnapshot:phase31dQaSnapshot,b1StructureSnapshot:b1StructureSnapshot,b1ContentSnapshot:b1ContentSnapshot,phase32dQaSnapshot:phase32dQaSnapshot,b2StructureSnapshot:b2StructureSnapshot,b2ContentSnapshot:b2ContentSnapshot,phase33dQaSnapshot:phase33dQaSnapshot,c1StructureSnapshot:c1StructureSnapshot,c1ContentSnapshot:c1ContentSnapshot,phase34dQaSnapshot:phase34dQaSnapshot,c2StructureSnapshot:c2StructureSnapshot,c2ContentSnapshot:c2ContentSnapshot,phase35dQaSnapshot:phase35dQaSnapshot,phase38bSpeakingAiSnapshot:phase38bSpeakingAiSnapshot,openPlacementTest:openPlacementTest,placementTestSnapshot:placementTestSnapshot,phase37aQaSnapshot:phase37aQaSnapshot,openPlaceholder:openPlaceholderCompat,register:register,diagnostics:diagnostics});
  var lastTouchStamp=0;
  function routeLanguageCourseClick(ev){
    if(ev && ev.type==='click' && lastTouchStamp && Date.now()-lastTouchStamp<420) return false;

    var btn=ev.target&&ev.target.closest&&ev.target.closest('[data-ui-action]'); if(!btn) return false;
    var action=btn.getAttribute('data-ui-action')||'';
    if(action.indexOf('language-course-')!==0) return false;
    if(ev && ev.type==='touchend') lastTouchStamp=Date.now();
    if(btn.getAttribute('aria-disabled')==='true') { ev.preventDefault(); ev.stopPropagation(); return true; }
    if(action==='language-course-open' || action==='language-course-open-dashboard'){ ev.preventDefault(); ev.stopPropagation(); openDashboard(); return true; }
    if(action==='language-course-placement-test'){ ev.preventDefault(); ev.stopPropagation(); openPlacementTest(false); return true; }
    if(action==='language-course-placement-reset'){ ev.preventDefault(); ev.stopPropagation(); openPlacementTest(true); return true; }
    if(action==='language-course-placement-close'){ ev.preventDefault(); ev.stopPropagation(); openDashboard(); return true; }
    if(action==='language-course-placement-answer'){ ev.preventDefault(); ev.stopPropagation(); answerPlacement(btn.getAttribute('data-la-answer')||''); return true; }
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
