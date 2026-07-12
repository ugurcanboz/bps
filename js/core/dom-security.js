/* Novura · Frontend Security Guard · G54.50.2C */
(function(root){
  'use strict';
  if(root.EGTDOMSecurity) return;
  var ALLOWED_TAGS=new Set(['B','STRONG','I','EM','U','BR','P','DIV','SPAN','SMALL','UL','OL','LI','H1','H2','H3','H4','H5','H6','SECTION','ARTICLE','HEADER','FOOTER','BUTTON','A','CODE','PRE','TABLE','THEAD','TBODY','TR','TH','TD','LABEL','INPUT','TEXTAREA','SELECT','OPTION','PROGRESS','SVG','PATH','CIRCLE','RECT','LINE','POLYLINE','POLYGON','G','USE']);
  var URL_ATTRS=new Set(['href','src','xlink:href']);
  var SAFE_ATTR=/^(class|id|title|role|aria-[\w-]+|data-[\w-]+|tabindex|type|name|value|placeholder|for|disabled|checked|selected|max|min|step|viewBox|fill|stroke|stroke-width|d|cx|cy|r|x|y|x1|x2|y1|y2|width|height|points|preserveAspectRatio)$/i;
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function safeUrl(v){
    var s=String(v||'').trim();
    if(!s) return '';
    if(/^(javascript|data:text\/html|vbscript):/i.test(s)) return '';
    if(/^data:/i.test(s) && !/^data:image\/(png|gif|jpeg|webp|svg\+xml);/i.test(s)) return '';
    return s;
  }
  function sanitizeHTML(input){
    var tpl=document.createElement('template'); tpl.innerHTML=String(input==null?'':input);
    Array.from(tpl.content.querySelectorAll('*')).forEach(function(el){
      if(!ALLOWED_TAGS.has(el.tagName)){ el.replaceWith(document.createTextNode(el.textContent||'')); return; }
      Array.from(el.attributes).forEach(function(a){
        var n=a.name.toLowerCase();
        if(n.indexOf('on')===0 || n==='style' || !SAFE_ATTR.test(a.name)){el.removeAttribute(a.name);return;}
        if(URL_ATTRS.has(n)){var u=safeUrl(a.value); if(u) el.setAttribute(a.name,u); else el.removeAttribute(a.name);}
      });
      if(el.tagName==='A' && el.getAttribute('target')==='_blank') el.setAttribute('rel','noopener noreferrer');
    });
    return tpl.innerHTML;
  }
  function setHTML(el,html){if(el) el.innerHTML=sanitizeHTML(html); return !!el;}
  function appendHTML(el,html){if(el) el.insertAdjacentHTML('beforeend',sanitizeHTML(html)); return !!el;}
  function setText(el,text){if(el) el.textContent=String(text==null?'':text); return !!el;}
  function production(){return !!(root.AppConfig && root.AppConfig.environment==='production');}
  function debugAllowed(){return !production() && !!(root.AppConfig && root.AppConfig.security && root.AppConfig.security.allowQaBypass);}
  root.EGTDOMSecurity=Object.freeze({version:'G54.50.2C',escapeHTML:esc,sanitizeHTML:sanitizeHTML,safeUrl:safeUrl,setHTML:setHTML,appendHTML:appendHTML,setText:setText,debugAllowed:debugAllowed});
})(window);
