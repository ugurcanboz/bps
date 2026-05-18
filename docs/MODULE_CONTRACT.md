# Module Contract

Neue Funktionen werden künftig als Module ergänzt.

## Minimalform
```js
window.TrainerModules.register("mein-feature", {
  description:"Kurzbeschreibung",
  enabled:true,
  init(App){
    // Feature starten
  }
});
```

## Namensschema
- CSS: `.mod-feature-name-*`
- JS: `modules/feature-name.js`
- Daten: `data/feature-name.json`

Dadurch bleibt der Core stabil.
