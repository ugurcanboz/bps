/* Eignungstest-Trainer · G54.45.0
   Englische Vollprüfungs-Varianten A1–C2 · handgeschriebene Inhalte.
   Ersetzt die alten Template-Klone: Jede Variante hat eigenen Lesetext,
   eigenen Hörtext und inhaltsbasierte Fragen, die echtes Verstehen prüfen.
   Zeilenformat wie qrow: [id, frage, korrekt, falsch1, falsch2, 'a', erklärung] */
(function(){
  'use strict';
  function r(id,q,c,w1,w2,e){ return [id,q,c,w1,w2,'a',e||'Answer is stated in the text.']; }

  var V = {
  A1:[
    { theme:'Course start',
      readingTitle:'A1 Reading · Course notice',
      readingText:'The English course starts on Monday at six o\'clock in room 204. Students should bring an ID card, a pen and a small notebook. The course lasts ninety minutes. Late students should wait at reception on the ground floor.',
      listeningTitle:'A1 Listening · Welcome message',
      listeningText:'Good evening. The English course starts today at six o\'clock in room two zero four. Please bring your ID card. The teacher is Mr Brown. There is a short break at seven o\'clock.',
      reading:[
        r('en-a1-v1-r1','When does the course start?','On Monday at six o\'clock','On Friday at nine o\'clock','On Sunday afternoon'),
        r('en-a1-v1-r2','What should students bring?','An ID card, a pen and a notebook','Sports clothes and water','A ticket and a photo'),
        r('en-a1-v1-r3','How long is the course?','Ninety minutes','Three hours','Twenty minutes'),
        r('en-a1-v1-r4','Where should late students wait?','At reception on the ground floor','In the car park','In room 305')
      ],
      listening:[
        r('en-a1-v1-l1','Which room is the course in?','Room 204','Room 12','Room 501'),
        r('en-a1-v1-l2','Who is the teacher?','Mr Brown','Mrs Green','Mr Smith'),
        r('en-a1-v1-l3','When is the break?','At seven o\'clock','At five o\'clock','There is no break'),
        r('en-a1-v1-l4','What should students bring?','Their ID card','Their laptop','A dictionary')
      ],
      grammar:[
        r('en-a1-v1-g1','Which sentence is correct?','I am a student.','I is a student.','I are a student.','Verb be: I am.'),
        r('en-a1-v1-g2','Complete: This ___ my book.','is','are','am','Singular: this is.'),
        r('en-a1-v1-g3','Choose the correct question.','Where do you live?','Where you live?','Where lives you?','Question with do.'),
        r('en-a1-v1-g4','Which reply is polite?','Thank you very much.','Give it now.','No talk.','Basic politeness.')
      ]
    },
    { theme:'Supermarket',
      readingTitle:'A1 Reading · Shop information',
      readingText:'The supermarket is open today until eight o\'clock in the evening. Bread, milk and apples are cheaper this week. At the checkout you can pay with card or cash. The bakery inside the shop closes at six.',
      listeningTitle:'A1 Listening · Shop announcement',
      listeningText:'Attention, please. Our supermarket closes today at eight o\'clock. Apples and bread are cheaper this week. Please pay at checkout number three. Thank you and see you again.',
      reading:[
        r('en-a1-v2-r1','Until what time is the supermarket open?','Until eight in the evening','Until midnight','Until two in the afternoon'),
        r('en-a1-v2-r2','Which products are cheaper this week?','Bread, milk and apples','Shoes and jackets','Books and pens'),
        r('en-a1-v2-r3','How can you pay?','With card or cash','Only by bank letter','Only online'),
        r('en-a1-v2-r4','When does the bakery close?','At six','At eight','At ten')
      ],
      listening:[
        r('en-a1-v2-l1','When does the shop close today?','At eight o\'clock','At six o\'clock','At eleven o\'clock'),
        r('en-a1-v2-l2','What is cheaper this week?','Apples and bread','Coffee and tea','Fish and meat'),
        r('en-a1-v2-l3','Where should customers pay?','At checkout number three','At the entrance','At the bakery'),
        r('en-a1-v2-l4','What kind of message is this?','A shop announcement','A weather report','A song')
      ],
      grammar:[
        r('en-a1-v2-g1','Complete: We ___ in the shop.','are','is','am','Plural: we are.'),
        r('en-a1-v2-g2','Which sentence is correct?','She has a bag.','She have a bag.','She haves a bag.','Third person: has.'),
        r('en-a1-v2-g3','Complete: How much ___ it?','is','are','am','How much is it?'),
        r('en-a1-v2-g4','Choose the polite sentence.','I would like some bread, please.','Bread now!','You give bread.','Polite request.')
      ]
    },
    { theme:'Library',
      readingTitle:'A1 Reading · Library rules',
      readingText:'The city library opens at nine in the morning. New readers need a photo and their passport for a library card. Children\'s books are on the left. English books are on the second shelf. You can borrow a book for four weeks.',
      listeningTitle:'A1 Listening · Library information',
      listeningText:'Welcome to the city library. We open at nine and close at seven in the evening. For a new library card you need a photo and your passport. Please be quiet in the reading room.',
      reading:[
        r('en-a1-v3-r1','When does the library open?','At nine in the morning','At six in the evening','At noon'),
        r('en-a1-v3-r2','What do new readers need?','A photo and their passport','A sports bag','A bus ticket'),
        r('en-a1-v3-r3','Where are the English books?','On the second shelf','Next to the entrance','In the cellar'),
        r('en-a1-v3-r4','How long can you borrow a book?','For four weeks','For one day','For a year')
      ],
      listening:[
        r('en-a1-v3-l1','When does the library close?','At seven in the evening','At nine in the morning','At midnight'),
        r('en-a1-v3-l2','What do you need for a new card?','A photo and a passport','A pen and paper','Money only'),
        r('en-a1-v3-l3','Where should you be quiet?','In the reading room','In the street','At the bus stop'),
        r('en-a1-v3-l4','What is this message about?','The library','A train','A doctor')
      ],
      grammar:[
        r('en-a1-v3-g1','Complete: The books ___ on the shelf.','are','is','am','Plural: are.'),
        r('en-a1-v3-g2','Which question is correct?','What time is it?','What time it is?','What is time it?','Question order.'),
        r('en-a1-v3-g3','Complete: I ___ a library card.','have','has','having','First person: have.'),
        r('en-a1-v3-g4','Which sentence is correct?','He reads a book.','He read a book every day yesterday now.','He reading book.','Third person -s.')
      ]
    }
  ],
  A2:[
    { theme:'Clinic appointment',
      readingTitle:'A2 Reading · Appointment change',
      readingText:'Green Medical Practice writes: Your appointment on Thursday at ten o\'clock must be moved because the doctor is at a training course. We can offer Friday at eleven o\'clock instead. If the new time does not work for you, please call us back by tomorrow evening. Bring your insurance card to the appointment.',
      listeningTitle:'A2 Listening · Phone message',
      listeningText:'Hello, this is Green Medical Practice. Your appointment on Thursday at ten must be moved because the doctor is away. We can offer Friday at eleven. Please call us back by tomorrow evening and remember your insurance card.',
      reading:[
        r('en-a2-v1-r1','Why must the appointment be moved?','The doctor is at a training course','The practice is closed forever','The patient asked for it'),
        r('en-a2-v1-r2','Which new time is offered?','Friday at eleven','Thursday at ten','Monday at eight'),
        r('en-a2-v1-r3','What should you do if the new time does not work?','Call back by tomorrow evening','Do nothing','Send a photo'),
        r('en-a2-v1-r4','What should you bring to the appointment?','Your insurance card','Your library card','A train ticket')
      ],
      listening:[
        r('en-a2-v1-l1','Who is calling?','Green Medical Practice','The supermarket','The library'),
        r('en-a2-v1-l2','When is the new appointment?','Friday at eleven','Thursday at ten','Sunday at nine'),
        r('en-a2-v1-l3','By when should you call back?','By tomorrow evening','Within one month','Never'),
        r('en-a2-v1-l4','What should you remember?','Your insurance card','Your umbrella','Your keys')
      ],
      grammar:[
        r('en-a2-v1-g1','Complete: I ___ to the doctor yesterday.','went','go','going','Past simple: went.'),
        r('en-a2-v1-g2','Complete: I cannot come ___ I am ill.','because','but','so that never','Reason: because.'),
        r('en-a2-v1-g3','Which request is polite?','Could you move my appointment, please?','Move it now!','You must change this fast.','Polite request with could.'),
        r('en-a2-v1-g4','Complete: She ___ call you tomorrow.','is going to','go to','goes yesterday','Future plan.')
      ]
    },
    { theme:'Neighbourhood help',
      readingTitle:'A2 Reading · Message to a neighbour',
      readingText:'Dear Mrs Miller, I am sorry, but I cannot go shopping with you tomorrow because I have to work longer at the office. Can we go on Saturday at three o\'clock instead? I can drive us to the new market near the station. Please send me a short message. Best wishes, Ayla.',
      listeningTitle:'A2 Listening · Voice message',
      listeningText:'Hello Mrs Miller, this is Ayla. I am sorry, I cannot go shopping tomorrow because I have to work longer. Is Saturday at three o\'clock okay? I can drive us to the market near the station. Please send me a short message.',
      reading:[
        r('en-a2-v2-r1','Why can Ayla not go shopping tomorrow?','She has to work longer','She is on holiday','Her car is broken'),
        r('en-a2-v2-r2','What does she suggest?','Saturday at three o\'clock','Sunday at midnight','Tomorrow morning'),
        r('en-a2-v2-r3','How can they get to the market?','Ayla can drive them','By plane','They must walk two hours'),
        r('en-a2-v2-r4','What does Ayla ask for?','A short message','Money for petrol','A new job')
      ],
      listening:[
        r('en-a2-v2-l1','Who is the message for?','Mrs Miller','Mr Brown','The doctor'),
        r('en-a2-v2-l2','Why does Ayla cancel?','She has to work longer','She is at the cinema','She forgot the plan'),
        r('en-a2-v2-l3','Where is the market?','Near the station','Next to the school','In another city'),
        r('en-a2-v2-l4','What should Mrs Miller do?','Send a short message','Buy a ticket','Call the police')
      ],
      grammar:[
        r('en-a2-v2-g1','Complete: We ___ to the market last week.','drove','drive','driving','Past simple: drove.'),
        r('en-a2-v2-g2','Which sentence is correct?','I am sorry, but I cannot come.','I am sorry because but not come.','Sorry I but no.','Contrast with but.'),
        r('en-a2-v2-g3','Complete: Is Saturday okay ___ you?','for','at','under','okay for you.'),
        r('en-a2-v2-g4','Choose the friendly ending.','Best wishes, Ayla','End of message now','You answer me'),
      ]
    },
    { theme:'Travel information',
      readingTitle:'A2 Reading · Station notice',
      readingText:'The train to Manchester is twenty-five minutes late today because of a signal problem. Passengers for the airport should change at Leeds and take the bus from platform five. All tickets stay valid. The information desk in the main hall can print a delay confirmation for your employer.',
      listeningTitle:'A2 Listening · Station announcement',
      listeningText:'Attention, please. The train to Manchester is running twenty-five minutes late because of a signal problem. Passengers for the airport, please change at Leeds and take the bus from platform five. Your tickets stay valid.',
      reading:[
        r('en-a2-v3-r1','How late is the train?','Twenty-five minutes','Five hours','It is on time'),
        r('en-a2-v3-r2','Why is the train late?','Because of a signal problem','Because of snow in summer','Because of a party'),
        r('en-a2-v3-r3','What should airport passengers do?','Change at Leeds and take the bus from platform five','Wait at home','Buy a new ticket'),
        r('en-a2-v3-r4','What can the information desk do?','Print a delay confirmation','Sell food','Repair the train')
      ],
      listening:[
        r('en-a2-v3-l1','Where is the train going?','To Manchester','To Paris','To Berlin'),
        r('en-a2-v3-l2','How long is the delay?','Twenty-five minutes','Two minutes','Three hours'),
        r('en-a2-v3-l3','Which platform is the airport bus on?','Platform five','Platform one','Platform nine'),
        r('en-a2-v3-l4','What happens to the tickets?','They stay valid','They are cancelled','They cost double')
      ],
      grammar:[
        r('en-a2-v3-g1','Complete: The train ___ late yesterday, too.','was','is','be','Past of be: was.'),
        r('en-a2-v3-g2','Complete: You ___ change at Leeds.','have to','has to','must to','Obligation: have to.'),
        r('en-a2-v3-g3','Which question is correct?','When does the bus leave?','When leaves the bus does?','When the bus leave?','Question with does.'),
        r('en-a2-v3-g4','Complete: My ticket is ___ than yours.','cheaper','cheap','most cheap','Comparative.')
      ]
    }
  ]
,
  B1:[
    { theme:'Course cancellation',
      readingTitle:'B1 Reading · Provider email',
      readingText:'Dear students, the online lesson on Tuesday evening is cancelled because of a technical problem with our video platform. As a replacement, there will be an extra lesson on Thursday at the same time, and all participants will receive a recording by Friday. If you cannot attend the replacement lesson, please email the office by Wednesday so that we can register your absence as excused. The course fee will not change.',
      listeningTitle:'B1 Listening · Office voicemail',
      listeningText:'Hello, this is the language school office. Because of a technical problem, Tuesday\'s online lesson is cancelled. The replacement lesson is on Thursday at seven, and a recording will be sent by Friday. If Thursday is impossible for you, write to us by Wednesday, then your absence counts as excused.',
      reading:[
        r('en-b1-v1-r1','Why is the Tuesday lesson cancelled?','Because of a technical problem with the video platform','Because the teacher is on holiday','Because too few students registered'),
        r('en-b1-v1-r2','What do all participants receive by Friday?','A recording of the lesson','A refund of the course fee','A new textbook'),
        r('en-b1-v1-r3','What should students do if they cannot attend on Thursday?','Email the office by Wednesday','Call the teacher at home','Nothing at all'),
        r('en-b1-v1-r4','What happens to the course fee?','It stays the same','It is doubled','It is paid back completely')
      ],
      listening:[
        r('en-b1-v1-l1','When is the replacement lesson?','On Thursday at seven','On Tuesday at nine','On Saturday morning'),
        r('en-b1-v1-l2','What will be sent by Friday?','A recording','An invoice','A certificate'),
        r('en-b1-v1-l3','What happens if you write to the office by Wednesday?','Your absence counts as excused','You get a free course','You lose your place'),
        r('en-b1-v1-l4','Who left this message?','The language school office','A travel agency','The city library')
      ],
      grammar:[
        r('en-b1-v1-g1','Which sentence is correct?','Although the lesson was cancelled, I kept studying.','Although was the lesson cancelled, I studying.','Although lesson cancel, study I.','Subordinate clause with although.'),
        r('en-b1-v1-g2','Complete: The lesson ___ because of a technical problem.','was cancelled','cancelled itself by students','is cancel','Passive voice.'),
        r('en-b1-v1-g3','Which phrase fits a formal email?','I would appreciate a short confirmation.','Answer me quick!','U ok with that?','Formal register.'),
        r('en-b1-v1-g4','Complete: Please let us know ___ you can attend on Thursday.','whether','despite','however because','Indirect question: whether.')
      ]
    },
    { theme:'New apartment',
      readingTitle:'B1 Reading · Building management letter',
      readingText:'Dear residents, on Wednesday between eight and twelve o\'clock the water in the building will be turned off because of urgent repair work in the basement. Please store enough water for the morning and do not use the washing machines during this time. The lift will also be out of service until noon. If the repair takes longer, we will inform you by a notice at the entrance.',
      listeningTitle:'B1 Listening · House announcement',
      listeningText:'Attention, residents. On Wednesday from eight until twelve the water will be turned off because of repair work in the basement. Please prepare enough water and do not use the washing machines. The lift will not work until noon.',
      reading:[
        r('en-b1-v2-r1','When will the water be turned off?','On Wednesday between eight and twelve','On Friday evening','For the whole week'),
        r('en-b1-v2-r2','Why is the water turned off?','Because of urgent repair work in the basement','Because of a party in the building','Because residents did not pay'),
        r('en-b1-v2-r3','What should residents avoid on Wednesday morning?','Using the washing machines','Opening their windows','Leaving the house'),
        r('en-b1-v2-r4','How will residents be informed if the repair takes longer?','By a notice at the entrance','By a phone call to everyone','By the police')
      ],
      listening:[
        r('en-b1-v2-l1','Where does the repair work take place?','In the basement','On the roof','In the garden'),
        r('en-b1-v2-l2','How long will the water be off?','From eight until twelve','From noon until midnight','Only five minutes'),
        r('en-b1-v2-l3','What should residents prepare?','Enough water','New furniture','Their passports'),
        r('en-b1-v2-l4','What will not work until noon?','The lift','The front door','The heating in summer')
      ],
      grammar:[
        r('en-b1-v2-g1','Complete: The water ___ off between eight and twelve.','will be turned','will turned','is turn','Future passive.'),
        r('en-b1-v2-g2','Which sentence is correct?','If the repair takes longer, we will inform you.','If the repair will take longer, we informed you.','If repair long, inform.','First conditional.'),
        r('en-b1-v2-g3','Complete: Please avoid ___ the washing machines.','using','to using','use to','avoid + -ing.'),
        r('en-b1-v2-g4','Which wording is polite and formal?','We apologise for the inconvenience.','Deal with it.','Not our problem, bye.','Formal apology.')
      ]
    },
    { theme:'Work schedule',
      readingTitle:'B1 Reading · Team information',
      readingText:'Because two colleagues are on sick leave, the work schedule will change this week. The early shift starts at six instead of seven, and the late shift ends at ten in the evening. Anyone who wants to swap a shift should inform the team leader by Monday. Overtime from this week will be paid with the next salary or can be taken as free days in August.',
      listeningTitle:'B1 Listening · Team briefing',
      listeningText:'Good morning, everyone. Because of two sick colleagues we have to change the schedule. The early shift starts at six this week, the late shift ends at ten. If you want to swap a shift, tell the team leader by Monday. Overtime will be paid with the next salary.',
      reading:[
        r('en-b1-v3-r1','Why does the schedule change?','Because two colleagues are on sick leave','Because the company is closing','Because of a public holiday'),
        r('en-b1-v3-r2','When does the early shift start this week?','At six','At seven','At nine'),
        r('en-b1-v3-r3','What should employees do if they want to swap a shift?','Inform the team leader by Monday','Just stay at home','Write to the newspaper'),
        r('en-b1-v3-r4','What are the two options for overtime?','Payment with the next salary or free days in August','A new car or a bonus','Nothing is offered')
      ],
      listening:[
        r('en-b1-v3-l1','What is the reason for the change?','Two sick colleagues','A new building','A big order from China'),
        r('en-b1-v3-l2','When does the late shift end?','At ten in the evening','At six in the morning','At two in the afternoon'),
        r('en-b1-v3-l3','Who should you tell about a shift swap?','The team leader','The security guard','A customer'),
        r('en-b1-v3-l4','How will overtime be handled?','It will be paid with the next salary','It is lost','It becomes holiday next year only')
      ],
      grammar:[
        r('en-b1-v3-g1','Complete: I have worked here ___ three years.','for','since','from until','for + period.'),
        r('en-b1-v3-g2','Which sentence is correct?','After I had informed the team leader, I swapped my shift.','After I have inform, I swap.','After informing had I, shift swap.','Past perfect sequence.'),
        r('en-b1-v3-g3','Complete: Overtime ___ with the next salary.','will be paid','will pay itself','is pay','Future passive.'),
        r('en-b1-v3-g4','Which sentence sounds professional?','Could we discuss the schedule tomorrow?','We talk now, no choice.','Schedule bad, fix it.','Polite suggestion.')
      ]
    }
  ],
  B2:[
    { theme:'Digital learning',
      readingTitle:'B2 Reading · Opinion article',
      readingText:'The article argues that digital learning platforms can support individual progress, but only under clear conditions. Schools must provide working devices, protect student data and plan guided learning time within lessons. Where these conditions are missing, motivated students with support at home move ahead, while disadvantaged learners fall further behind. The author therefore calls digital tools an amplifier: they strengthen good teaching structures, but they equally strengthen existing inequality.',
      listeningTitle:'B2 Listening · Education podcast',
      listeningText:'In this podcast episode, a teacher explains that tablets alone changed very little at her school. Real progress only began when the school introduced fixed practice routines, trained the staff and involved parents. She concludes that the technology was the smallest part of the change.',
      reading:[
        r('en-b2-v1-r1','What is the author\'s main position?','Digital platforms help only under clear conditions.','Digital platforms should be banned.','Devices alone guarantee success.'),
        r('en-b2-v1-r2','Which conditions does the article mention?','Devices, data protection and guided learning time','Longer holidays and fewer exams','New buildings and school uniforms'),
        r('en-b2-v1-r3','What does the metaphor of an amplifier mean here?','Digital tools strengthen both good structures and existing inequality.','Digital tools make classrooms louder.','Digital tools replace teachers completely.'),
        r('en-b2-v1-r4','Who falls behind when conditions are missing?','Disadvantaged learners','Only teachers','Nobody at all')
      ],
      listening:[
        r('en-b2-v1-l1','What changed very little at the school?','Tablets alone','New practice routines','Parent involvement'),
        r('en-b2-v1-l2','When did real progress begin?','When routines, training and parents were involved','When more tablets were bought','When lessons were cancelled'),
        r('en-b2-v1-l3','What does the teacher conclude?','Technology was the smallest part of the change.','Technology solved everything.','Training was unnecessary.'),
        r('en-b2-v1-l4','What kind of source is this?','A podcast with a teacher','A weather forecast','An advertisement for tablets')
      ],
      grammar:[
        r('en-b2-v1-g1','Complete: ___ the platform is expensive, it may pay off in the long term.','Although','Because','Therefore','Concession.'),
        r('en-b2-v1-g2','Which wording is most professional?','I consider this approach problematic.','This is mega bad.','Total rubbish, honestly.','Professional register.'),
        r('en-b2-v1-g3','Complete: The results ___ before the next meeting.','will be analysed','will analysed','will analysing','Future passive.'),
        r('en-b2-v1-g4','Which connector fits? The tool is controversial; ___, it has clear advantages.','nevertheless','because','so that never','Contrastive connector.')
      ]
    },
    { theme:'Public transport policy',
      readingTitle:'B2 Reading · City council proposal',
      readingText:'The city council proposes to remove two hundred parking spaces in the centre and create separate bus lanes instead. Supporters expect cleaner air and buses that finally run on time. Local shop owners, however, fear losing customers who come by car, and they demand delivery zones and a transition period of at least one year. The council promises an evaluation after six months, including data on air quality, bus punctuality and shop revenue.',
      listeningTitle:'B2 Listening · Radio discussion',
      listeningText:'In today\'s radio discussion, a shop owner says she supports cleaner air but cannot accept the plan without delivery zones. A council member replies that delivery zones are already part of the proposal and that the changes will be evaluated after six months, using data on air quality and shop revenue.',
      reading:[
        r('en-b2-v2-r1','What does the council propose?','Removing parking spaces and creating bus lanes','Building a new airport','Closing all shops in the centre'),
        r('en-b2-v2-r2','What do supporters expect?','Cleaner air and punctual buses','More traffic jams','Higher parking fees only'),
        r('en-b2-v2-r3','What do shop owners demand?','Delivery zones and a transition period','A ban on buses','Free petrol for customers'),
        r('en-b2-v2-r4','What will the evaluation after six months include?','Air quality, bus punctuality and shop revenue','Only the weather','The number of tourists in museums')
      ],
      listening:[
        r('en-b2-v2-l1','What is the shop owner\'s position?','She supports cleaner air but insists on delivery zones.','She rejects clean air.','She wants more parking everywhere.'),
        r('en-b2-v2-l2','What does the council member reply about delivery zones?','They are already part of the proposal.','They are impossible.','They will cost extra for shops.'),
        r('en-b2-v2-l3','When will the changes be evaluated?','After six months','After ten years','Never'),
        r('en-b2-v2-l4','Which data is mentioned for the evaluation?','Air quality and shop revenue','Football results','School grades')
      ],
      grammar:[
        r('en-b2-v2-g1','Complete: The plan ___ by the council last month.','was approved','has approve','is approve','Past passive.'),
        r('en-b2-v2-g2','Which sentence expresses a balanced view?','On the one hand it saves time; on the other hand it creates new costs.','It is good and bad, whatever.','Everything is always perfect.','Balanced contrast.'),
        r('en-b2-v2-g3','Complete: The decision depends on ___ the costs are covered.','whether','despite','because therefore','Indirect dependence.'),
        r('en-b2-v2-g4','Which wording is formal?','I would like to draw attention to the following points.','Listen up, people.','Here is my stuff.','Formal introduction.')
      ]
    },
    { theme:'Professional development',
      readingTitle:'B2 Reading · HR report',
      readingText:'According to the internal report, further training is only sustainable when learning time is planned as working time. Employees who are expected to study after their shifts drop out significantly more often and rarely apply what they have learned. The report identifies three success factors: clear learning goals agreed with the supervisor, practical tasks taken from the employee\'s real work, and structured feedback within two weeks of each module.',
      listeningTitle:'B2 Listening · HR meeting',
      listeningText:'The HR manager summarises the findings: training after working hours leads to more dropouts, so learning time must be planned as working time. The most effective courses combined real tasks from the job with feedback from supervisors within two weeks.',
      reading:[
        r('en-b2-v3-r1','When is further training sustainable according to the report?','When learning time is planned as working time','When it happens only at weekends','When it has no goals'),
        r('en-b2-v3-r2','What happens to employees who must study after their shifts?','They drop out more often and rarely apply the content.','They automatically get promoted.','They learn twice as fast.'),
        r('en-b2-v3-r3','Which of these is one of the three success factors?','Structured feedback within two weeks','Longer lunch breaks','More emails from HR'),
        r('en-b2-v3-r4','Where should practical tasks come from?','From the employee\'s real work','From a television show','From old exams only')
      ],
      listening:[
        r('en-b2-v3-l1','What leads to more dropouts?','Training after working hours','Feedback from supervisors','Practical tasks'),
        r('en-b2-v3-l2','How should learning time be planned?','As working time','As unpaid overtime','As holiday'),
        r('en-b2-v3-l3','What did the most effective courses combine?','Real tasks with feedback within two weeks','Long lectures with no practice','Music and games only'),
        r('en-b2-v3-l4','Who gives the summary?','The HR manager','A customer','A student')
      ],
      grammar:[
        r('en-b2-v3-g1','Complete: If learning time ___ planned properly, fewer people drop out.','is','would','will been','Zero/first conditional.'),
        r('en-b2-v3-g2','Which sentence is precise?','The report identifies three success factors.','The report says some things about stuff.','Report good, factors yes.','Precision.'),
        r('en-b2-v3-g3','Complete: Employees ___ to study after their shifts drop out more often.','who are expected','which expecting','who expects themselves','Relative clause + passive.'),
        r('en-b2-v3-g4','Which conclusion is well connected?','Consequently, learning time should be part of the schedule.','Consequently because should.','Schedule but therefore learning.','Logical connector.')
      ]
    }
  ]
,
  C1:[
    { theme:'AI in education',
      readingTitle:'C1 Reading · Academic commentary',
      readingText:'The commentary argues that AI-supported learning systems should be judged neither by their novelty nor by their efficiency alone, but by whether they strengthen or weaken educational relationships. Adaptive feedback can make individual learning patterns visible; however, decisions about grading and support carry pedagogical and legal weight and must therefore remain with accountable professionals. The author warns that institutions tend to adopt such systems first and define responsibilities later — an order that, in his view, should be reversed.',
      listeningTitle:'C1 Listening · Expert interview',
      listeningText:'In the interview, the researcher stresses that AI does not replace teachers but changes their role. Systems can detect patterns in student work at a scale no human could manage; yet interpreting these patterns, deciding on support and communicating with families remain human responsibilities. She recommends that schools define accountability before introducing any adaptive system.',
      reading:[
        r('en-c1-v1-r1','By what standard should AI learning systems be judged, according to the commentary?','By whether they strengthen or weaken educational relationships','By their novelty alone','By their price only'),
        r('en-c1-v1-r2','Why must grading decisions remain with professionals?','Because they carry pedagogical and legal weight','Because software is always wrong','Because teachers demand higher salaries'),
        r('en-c1-v1-r3','Which institutional tendency does the author criticise?','Adopting systems first and defining responsibilities later','Testing systems too carefully','Ignoring technology completely'),
        r('en-c1-v1-r4','What is the author\'s overall stance?','Conditionally open but insistent on accountability','Enthusiastic without reservations','Entirely dismissive of AI')
      ],
      listening:[
        r('en-c1-v1-l1','How does AI change the teacher\'s role, according to the researcher?','It changes the role rather than replacing it','It makes teachers unnecessary','It turns teachers into programmers'),
        r('en-c1-v1-l2','What can AI systems do at scale?','Detect patterns in student work','Talk to families','Take legal responsibility'),
        r('en-c1-v1-l3','What remains a human responsibility?','Interpreting patterns and deciding on support','Storing the data files','Charging the batteries'),
        r('en-c1-v1-l4','What should schools do before introducing adaptive systems?','Define accountability','Buy more devices','Cancel all exams')
      ],
      grammar:[
        r('en-c1-v1-g1','Which sentence is precise and academic?','The implementation requires transparent evaluation.','We should check the thing somehow.','Someone must look at it, I guess.','Academic precision.'),
        r('en-c1-v1-g2','Complete: The approach is viable ___ its limits are acknowledged.','provided that','despite','therefore because','Condition.'),
        r('en-c1-v1-g3','Which sentence maintains formal distance?','It remains questionable whether these findings can be generalised.','This will never work, trust me.','That is just nonsense.','Hedged academic claim.'),
        r('en-c1-v1-g4','Complete: Rarely ___ such a rapid adoption of classroom technology.','have we seen','we have seen','we seen have','Inversion after negative adverbial.')
      ]
    },
    { theme:'Workplace transformation',
      readingTitle:'C1 Reading · Organisational analysis',
      readingText:'The analysis treats flexible work not as an end in itself but as an organisational question. Autonomy can raise motivation and allow deep, uninterrupted work; at the same time it shifts coordination costs onto individuals, who must now manage availability, information flows and their own visibility. The study concludes that hybrid models succeed where teams negotiate explicit rules — core hours, response times, meeting formats — and fail where such rules are replaced by an unspoken expectation of constant reachability.',
      listeningTitle:'C1 Listening · Consultant briefing',
      listeningText:'The consultant warns against treating home office primarily as a way to cut office costs. In her projects, hybrid teams performed well only when they agreed on explicit communication rules and kept regular in-person contact. Where reachability remained an unspoken expectation, employees reported exhaustion despite flexible hours.',
      reading:[
        r('en-c1-v2-r1','How does the analysis classify flexible work?','As an organisational question','As an end in itself','As a temporary fashion'),
        r('en-c1-v2-r2','Which cost does autonomy shift onto individuals?','Coordination costs such as managing availability','Rental costs of the office','Travel costs for holidays'),
        r('en-c1-v2-r3','Under what condition do hybrid models succeed?','When teams negotiate explicit rules','When nobody talks about rules','When everyone is always reachable'),
        r('en-c1-v2-r4','What replaces explicit rules in failing teams?','An unspoken expectation of constant reachability','A written constitution','Shorter working days')
      ],
      listening:[
        r('en-c1-v2-l1','What does the consultant warn against?','Seeing home office mainly as cost cutting','Explaining home office to staff','Regular team meetings'),
        r('en-c1-v2-l2','When did hybrid teams perform well in her projects?','With explicit communication rules and in-person contact','With no rules at all','Only with daily video calls at night'),
        r('en-c1-v2-l3','What did employees report where reachability stayed unspoken?','Exhaustion despite flexible hours','Higher salaries','Shorter commutes'),
        r('en-c1-v2-l4','What is the speaker\'s overall attitude?','Differentiated and pragmatic','Completely dismissive','Uninformed')
      ],
      grammar:[
        r('en-c1-v2-g1','Complete: The findings are relevant, ___ methodologically limited.','albeit','because','therefore since','Concessive: albeit.'),
        r('en-c1-v2-g2','Which statement is coherent?','On the one hand, efficiency increases; on the other, accountability issues arise.','Efficiency but accountability somehow.','Good and bad, done.','Structured contrast.'),
        r('en-c1-v2-g3','Complete: A balanced assessment presupposes ___ several perspectives are considered.','that','because of','despite that because','That-clause after presuppose.'),
        r('en-c1-v2-g4','Which wording avoids overstatement?','This does not, however, imply an automatic effect.','So everything is clear forever.','Therefore it always works.','Precise limitation.')
      ]
    },
    { theme:'Media literacy',
      readingTitle:'C1 Reading · Media essay',
      readingText:'The essay distinguishes between the mere consumption of information and reflective media literacy. What matters, it argues, is not the number of available sources but the ability to recognise whose interests shape a report, which perspectives it privileges and — crucially — which voices are absent. Fact-checking is described as necessary but insufficient: a statement can be technically accurate and still misleading if its framing excludes the context that would change its meaning.',
      listeningTitle:'C1 Listening · Media podcast',
      listeningText:'The podcast host argues that verifying individual facts is only the first step. Listeners should also ask who benefits from a particular framing and which affected groups never appear in the coverage. She gives the example of a housing report that quoted investors and officials at length but interviewed no tenants.',
      reading:[
        r('en-c1-v3-r1','What distinction does the essay draw?','Between consuming information and reflective media literacy','Between books and films','Between work and leisure'),
        r('en-c1-v3-r2','What matters more than the number of sources?','Recognising interests, perspectives and absent voices','Reading speed','The length of articles'),
        r('en-c1-v3-r3','Why is fact-checking called insufficient?','Accurate statements can still mislead through their framing','Facts are never checkable','Checking takes too long'),
        r('en-c1-v3-r4','What can change the meaning of an accurate statement?','The excluded context','The font size','The author\'s age')
      ],
      listening:[
        r('en-c1-v3-l1','What is only the first step, according to the host?','Verifying individual facts','Sharing articles quickly','Reading headlines'),
        r('en-c1-v3-l2','Which questions should listeners also ask?','Who benefits from the framing and which groups are absent','What the weather will be','How long the podcast is'),
        r('en-c1-v3-l3','What was wrong with the housing report in the example?','It interviewed no tenants','It was too short','It used old photographs'),
        r('en-c1-v3-l4','Which competence is emphasised overall?','Critical contextualisation','Fast clicking','Memorising numbers')
      ],
      grammar:[
        r('en-c1-v3-g1','Complete: The report is accurate ___ it omits crucial context.','insofar as the facts go, yet','because therefore','despite although since','Nuanced concession.'),
        r('en-c1-v3-g2','Which sentence is stylistically controlled?','This reading underestimates the institutional side effects.','This take does not get the effects.','The effect is just dumb.','Elevated register.'),
        r('en-c1-v3-g3','Complete: The data ___ systematically before publication.','were analysed','was analysing itself','is analyse','Passive with plural data.'),
        r('en-c1-v3-g4','Which sentence structures an argument clearly?','First the benefits are outlined; subsequently, the limits are analysed.','Benefits then limits somehow.','First good but because limits.','Text structure.')
      ]
    }
  ],
  C2:[
    { theme:'Algorithmic education',
      readingTitle:'C2 Reading · Critical essay',
      readingText:'The essay does not dispute the usefulness of personalised learning systems; what it questions is the ease with which their deployment is labelled progress. Once pedagogical judgements are delegated to adaptive infrastructures, the criteria behind those judgements — what counts as improvement, who is flagged as at risk — recede from public scrutiny into proprietary code. The rhetoric of inevitability, the author suggests, performs political work: it converts a contestable institutional choice into an apparently natural development that no longer requires justification.',
      listeningTitle:'C2 Listening · Panel debate',
      listeningText:'The speaker opens with deliberate irony, congratulating the sector on solving education once again — this time with a dashboard. His serious point follows: data can reveal blind spots that institutions prefer not to see, yet the decision about what to measure is itself normative. Whoever defines the metrics, he concludes, quietly defines the goals of education.',
      reading:[
        r('en-c2-v1-r1','What exactly does the essay question?','The ease with which deployment is labelled progress','The existence of computers in schools','Whether children should learn at all'),
        r('en-c2-v1-r2','What happens to judgement criteria when delegated to adaptive systems?','They recede from public scrutiny into proprietary code','They become more transparent automatically','They are printed in newspapers'),
        r('en-c2-v1-r3','What political work does the rhetoric of inevitability perform?','It turns a contestable choice into an apparently natural development','It increases school budgets','It bans all criticism by law'),
        r('en-c2-v1-r4','Which description fits the author\'s stance best?','Sceptical and analytically differentiated','Naively enthusiastic','Indifferent to the topic')
      ],
      listening:[
        r('en-c2-v1-l1','What function does the opening irony serve?','It criticises overblown technological promises','It praises dashboards sincerely','It explains a user manual'),
        r('en-c2-v1-l2','What does the speaker concede about data?','It can reveal blind spots institutions prefer not to see','It solves every social conflict','It makes politics unnecessary'),
        r('en-c2-v1-l3','Why is the choice of metrics normative?','Because defining what is measured quietly defines the goals','Because numbers are always neutral','Because metrics are chosen randomly'),
        r('en-c2-v1-l4','What is the speaker\'s core conclusion?','Whoever defines the metrics defines the goals of education','Dashboards should replace teachers','Measurement should be abolished entirely')
      ],
      grammar:[
        r('en-c2-v1-g1','Which wording is most nuanced?','The claim is plausible but analytically incomplete.','It is kind of okay but not really.','Somehow it feels wrong.','C2 nuance.'),
        r('en-c2-v1-g2','Complete: The argument convinces only ___ it addresses power relations.','insofar as','although','therefore because','Insofar as.'),
        r('en-c2-v1-g3','Which sentence preserves nuance?','The critique qualifies the benefit without denying it.','It is good and bad and so on.','The benefit is irrelevant anyway.','Nuanced restriction.'),
        r('en-c2-v1-g4','Complete: Not until the criteria were published ___ the debate become productive.','did','has','does','Inversion after not until.')
      ]
    },
    { theme:'Public debate',
      readingTitle:'C2 Reading · Discourse commentary',
      readingText:'The commentary does not object to pointed rhetoric as such; sharpening a claim can clarify what is actually at stake. Its target is the inflationary use of escalation, in which every nuance is read as weakness and every concession as betrayal. Under such conditions, the author argues, public debate loses its capacity for self-correction: positions are no longer revised in response to better arguments but defended as markers of group loyalty, and error ceases to be informative because admitting it has become socially ruinous.',
      listeningTitle:'C2 Listening · Rhetoric analysis',
      listeningText:'The speaker distinguishes pointed critique from mere outrage. Pointed critique, she argues, isolates the decisive weakness of a position and thereby invites an answer; outrage generalises, moralises and forecloses response. Her closing observation is deliberately double-edged: audiences reward outrage with attention, which means the incentives, not the arguers, may be the real problem.',
      reading:[
        r('en-c2-v2-r1','What is the actual target of the commentary?','The inflationary use of escalation','Pointed rhetoric as such','Public debate in general'),
        r('en-c2-v2-r2','What happens when every concession is read as betrayal?','Debate loses its capacity for self-correction','Debates become shorter and better','Everyone agrees immediately'),
        r('en-c2-v2-r3','Why does error cease to be informative?','Because admitting it has become socially ruinous','Because errors no longer occur','Because nobody publishes anymore'),
        r('en-c2-v2-r4','How are positions defended under these conditions?','As markers of group loyalty','As mathematical proofs','As private hobbies')
      ],
      listening:[
        r('en-c2-v2-l1','How does pointed critique differ from outrage?','It isolates the decisive weakness and invites an answer','It shouts louder','It avoids all judgement'),
        r('en-c2-v2-l2','What does outrage do, according to the speaker?','It generalises, moralises and forecloses response','It clarifies the core issue','It ends every conflict fairly'),
        r('en-c2-v2-l3','What is double-edged about her closing observation?','Audiences reward outrage, so the incentives may be the real problem','She contradicts her own thesis by shouting','She refuses to conclude at all'),
        r('en-c2-v2-l4','What attitude does the analysis model?','Differentiating between forms of critique','Rejecting all criticism','Preferring silence to argument')
      ],
      grammar:[
        r('en-c2-v2-g1','Complete: The text problematises not the innovation itself ___ its logic of legitimation.','but rather','because','although therefore','Precise contrast.'),
        r('en-c2-v2-g2','Which wording is stylistically controlled?','This reading underestimates the argument\'s institutional consequences.','This take misses the point, lol.','The consequence is plain dumb.','Elevated register.'),
        r('en-c2-v2-g3','Which version is the most differentiated?','The position is not wrong, but it stands in need of justification.','The position is simply wrong.','Everything is always correct.','Differentiated judgement.'),
        r('en-c2-v2-g4','Complete: Only rarely ___ a concession treated as a strength in such debates.','is','it is','are it','Inversion after only rarely.')
      ]
    },
    { theme:'Policy language',
      readingTitle:'C2 Reading · Legal-linguistic analysis',
      readingText:'At first glance the directive reads as neutral administrative prose; on closer inspection, its vocabulary performs a quiet pre-decision. By classifying certain practices as risks to be managed rather than interests to be weighed, the text settles the central question before any balancing procedure begins. The analysis notes that whoever controls this initial framing also shifts the burden of justification: those affected must now argue their way out of a category they never consented to enter.',
      listeningTitle:'C2 Listening · Legal commentary',
      listeningText:'The legal scholar points out that ostensibly neutral terms frequently contain pre-decisions. Calling a practice a risk, she explains, is not a description but an allocation: it determines who must justify themselves and who may simply demand justification. Her advice to drafters is therefore to treat every classification in a policy text as an argumentative move that itself requires defence.',
      reading:[
        r('en-c2-v3-r1','What does the directive\'s vocabulary do on closer inspection?','It performs a quiet pre-decision','It merely lists appointments','It bans language entirely'),
        r('en-c2-v3-r2','How does classifying practices as risks settle the central question?','It decides the matter before any balancing procedure begins','It postpones every decision forever','It hands the question to a court automatically'),
        r('en-c2-v3-r3','What shifts along with the initial framing?','The burden of justification','The office opening hours','The paper format'),
        r('en-c2-v3-r4','What is the situation of those affected?','They must argue their way out of a category they never chose','They gain automatic advantages','They are simply unaffected')
      ],
      listening:[
        r('en-c2-v3-l1','What do ostensibly neutral terms frequently contain?','Pre-decisions','Only descriptions','Spelling mistakes'),
        r('en-c2-v3-l2','Why is calling a practice a risk an allocation rather than a description?','It determines who must justify themselves','It measures the practice scientifically','It changes nothing at all'),
        r('en-c2-v3-l3','What advice does the scholar give to drafters?','Treat every classification as an argumentative move requiring defence','Avoid all classifications forever','Use more technical jargon'),
        r('en-c2-v3-l4','Which competence does this task test?','Recognising implicit evaluation in language','Understanding clock times','Remembering names')
      ],
      grammar:[
        r('en-c2-v3-g1','Complete: The author intimates ___ efficiency does not automatically produce justice.','that','because therefore','although that','Indirect content clause.'),
        r('en-c2-v3-g2','Which wording recognises ambivalence?','The approach opens possibilities while simultaneously relocating responsibility.','The approach is great.','The approach is rubbish.','Ambivalence.'),
        r('en-c2-v3-g3','Complete: This conclusion appears compelling only ___.','at first glance','at first glance it does not never','glance first at','Idiomatic precision.'),
        r('en-c2-v3-g4','Which version commands register?','The force of the argument lies in the apparent self-evidence of its premise.','The trick is that it seems obvious, haha.','It is somehow self-evident, I think.','C2 style.')
      ]
    }
  ]
  };
  window.LanguageEnglishExamVariants = V;
})();
