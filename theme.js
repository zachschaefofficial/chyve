/* =========================================================
   Chyve theme — light / dark / auto + an accent color.
   Loaded in <head> before the stylesheet paints so there is no flash.
   The saved choice lives in localStorage; signed-in users also keep it
   on their profile (user.theme), which app.js hands to Theme.apply().
   ========================================================= */
(function(){
  var KEY = 'gv_theme';
  var ACCENTS = {
    green:  { name:'Green',  light:'#2F9163', dark:'#4CC38A' },
    blue:   { name:'Blue',   light:'#2F6BDB', dark:'#6C9BFF' },
    violet: { name:'Violet', light:'#7351D9', dark:'#A38BFF' },
    rose:   { name:'Rose',   light:'#D1427A', dark:'#FF7FAE' },
    orange: { name:'Orange', light:'#D9691F', dark:'#FF9A55' },
    mono:   { name:'Mono',   light:'#1F1E1B', dark:'#ECEBE6' }
  };
  var DEFAULT = { mode:'light', accent:'green' };
  var MODES = ['light', 'dark', 'auto'];
  var current = null;

  function clean(t){
    t = t || {};
    return {
      mode: MODES.indexOf(t.mode) > -1 ? t.mode : DEFAULT.mode,
      accent: ACCENTS[t.accent] ? t.accent : DEFAULT.accent
    };
  }
  function stored(){
    try{ return clean(JSON.parse(localStorage.getItem(KEY) || 'null')); }catch(e){ return clean(null); }
  }
  function prefersDark(){
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function apply(theme){
    var t = clean(theme);
    current = t;
    var mode = t.mode === 'auto' ? (prefersDark() ? 'dark' : 'light') : t.mode;
    var root = document.documentElement;
    root.setAttribute('data-mode', mode);
    root.style.setProperty('--accent', ACCENTS[t.accent][mode]);
    root.style.setProperty('--on-accent', mode === 'dark' ? '#121211' : '#FFFFFF');
    var meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', mode === 'dark' ? '#121211' : '#FBFAF8');
    try{ localStorage.setItem(KEY, JSON.stringify(t)); }catch(e){}
    return t;
  }
  if(window.matchMedia){
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function(){ if(current && current.mode === 'auto') apply(current); };
    if(mq.addEventListener) mq.addEventListener('change', onChange);
    else if(mq.addListener) mq.addListener(onChange);
  }
  window.Theme = {
    accents: ACCENTS,
    modes: MODES,
    current: function(){ return current || stored(); },
    apply: function(theme){
      var t = clean(theme);
      if(current && current.mode === t.mode && current.accent === t.accent) return current;
      return apply(t);
    }
  };
  apply(stored());
})();
