/* Novura · zentrales Markensystem · G54.48.2 */
(function(){
  'use strict';
  var modules = Object.freeze({
    learn: Object.freeze({ name: 'Novura Learn', shortName: 'Learn', key: 'learn' }),
    assessments: Object.freeze({ name: 'Novura Assessments', shortName: 'Assessments', key: 'assessments' }),
    exams: Object.freeze({ name: 'Novura Exams', shortName: 'Exams', key: 'exams' }),
    coach: Object.freeze({ name: 'Novura Coach', shortName: 'Coach', key: 'coach' }),
    progress: Object.freeze({ name: 'Novura Progress', shortName: 'Progress', key: 'progress' }),
    admin: Object.freeze({ name: 'Novura Admin', shortName: 'Admin', key: 'admin' })
  });
  window.NovuraBrand = Object.freeze({
    name: 'Novura',
    slogan: "One day, you'll thank today.",
    modules: modules,
    exams: modules.exams.name,
    coach: modules.coach.name,
    legacyTechnicalAliases: Object.freeze({ novuraExams: 'novuraExams', novuraExams: 'novuraExams', assessments: 'novuraAssessments', egt: 'novura' }),
    moduleName: function(key, fallback){
      return modules[key] ? modules[key].name : (fallback || key || 'Novura');
    }
  });
})();
