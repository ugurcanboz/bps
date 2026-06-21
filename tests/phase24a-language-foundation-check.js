const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const storage = new Map();
const listeners = {};
const context = {
  console,
  window: {},
  document: {
    dispatchEvent(){},
    addEventListener(){}
  },
  localStorage: {
    getItem(k){ return storage.has(k) ? storage.get(k) : null; },
    setItem(k,v){ storage.set(k, String(v)); },
    removeItem(k){ storage.delete(k); }
  },
  CustomEvent: function(name, init){ this.type = name; this.detail = init && init.detail || {}; },
  Event: function(name){ this.type = name; },
  dispatchEvent(evt){ (listeners[evt.type] || []).forEach(fn => fn(evt)); },
  addEventListener(name, fn){ listeners[name] = listeners[name] || []; listeners[name].push(fn); }
};
context.window = context;
vm.createContext(context);

function run(rel){
  const code = fs.readFileSync(path.join(root, rel), 'utf8');
  vm.runInContext(code, context, { filename: rel });
}

run('js/core/module-host.js');
run('js/i18n/language-store.js');
run('js/i18n/translation-engine.js');
run('js/i18n/help-system.js');
run('js/i18n/language-adapter.js');
run('js/core/profile-auth-domain-engine.js');

const assert = (cond, msg) => { if(!cond) throw new Error(msg); };

assert(context.LanguageAcademyLanguageStore, 'LanguageStore fehlt');
assert(context.LanguageAcademyTranslationEngine, 'TranslationEngine fehlt');
assert(context.LanguageAcademyHelpSystem, 'HelpSystem fehlt');
assert(context.LanguageAcademyLanguageAdapter, 'LanguageAdapter fehlt');
assert(context.LanguageAcademyTranslationEngine.t('common.help', { lang:'de' }) === 'Hilfe', 'DE Übersetzung fehlerhaft');
assert(context.LanguageAcademyTranslationEngine.t('common.help', { lang:'tr' }) === 'Yardım', 'TR Übersetzung fehlerhaft');
context.LanguageAcademyLanguageStore.set({ learningLanguage:'de', helpLanguage:'tr' });
const task = { question:{ de:'Wähle aus.', tr:'Seçin.' }, hint:{ de:'Nur Erklärung.', tr:'Sadece açıklama.' }, answer:'A' };
assert(context.LanguageAcademyTranslationEngine.questionText(task, 'question') === 'Wähle aus.', 'Lernsprache Frage fehlerhaft');
assert(context.LanguageAcademyHelpSystem.getHint(task) === 'Sadece açıklama.', 'Hilfssprache Hinweis fehlerhaft');
assert(!JSON.stringify(context.LanguageAcademyHelpSystem.sanitizeHint(task)).includes('answer'), 'HelpSystem darf Lösung nicht weitergeben');
assert(context.LanguageAcademyLanguageAdapter.diagnostics().ok === true, 'LanguageAdapter Diagnostics nicht ok');
assert(context.AppModuleHost.listModules().some(m => m.id === 'language-foundation'), 'ModuleHost Registrierung fehlt');
const domainFactory = context.EGTProfileAuthDomainEngine && context.EGTProfileAuthDomainEngine.create;
assert(typeof domainFactory === 'function', 'ProfileAuthDomainEngine Factory fehlt');
const domain = domainFactory();
assert(typeof domain.languageSettings === 'function', 'Profil languageSettings fehlt');
assert(typeof domain.updateLanguageSettings === 'function', 'Profil updateLanguageSettings fehlt');
const before = domain.identity().profile.stats || {};
domain.updateLanguageSettings({ learningLanguage:'tr', helpLanguage:'de' });
const settings = domain.languageSettings();
assert(settings.learningLanguage === 'tr' && settings.helpLanguage === 'de', 'Profil Sprachsettings speichern nicht korrekt');
const after = domain.identity().profile.stats || {};
assert(JSON.stringify(before) === JSON.stringify(after), 'Sprachwechsel darf stats/Progress nicht verändern');

console.log('PASS phase24a-language-foundation-check');
