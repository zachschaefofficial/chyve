/* =========================================================
   Chyve theme — one light/dark mode plus an accent and matching wash.
   Loaded in <head> before the stylesheet paints so there is no flash.
   The saved choice lives in localStorage; signed-in users also keep it
   on their profile (user.theme), which app.js hands to Theme.apply().
   ========================================================= */
(function(){
  var KEY = 'gv_theme';
  var ACCENTS = {
    green:  { name:'Green',  light:'#2F9163', dark:'#4CC38A', lightWash:'#E4F2E9', darkWash:'#17372D' },
    blue:   { name:'Blue',   light:'#2F6BDB', dark:'#6C9BFF', lightWash:'#E5EDFC', darkWash:'#1D2D4D' },
    violet: { name:'Violet', light:'#7351D9', dark:'#A38BFF', lightWash:'#EEE9FC', darkWash:'#302747' },
    rose:   { name:'Rose',   light:'#D1427A', dark:'#FF7FAE', lightWash:'#F9E8EF', darkWash:'#422433' },
    orange: { name:'Orange', light:'#D9691F', dark:'#FF9A55', lightWash:'#F9EBDD', darkWash:'#422D20' },
    mono:   { name:'Mono',   light:'#26251E', dark:'#EDECE6', lightWash:'#E8E7E1', darkWash:'#30302B' },
    red:    { name:'Red', light:'#D64545', dark:'#FF7777', lightWash:'#F8E6E4', darkWash:'#442626' },
    yellow: { name:'Yellow', light:'#B78B12', dark:'#E7C34E', lightWash:'#F5EFCF', darkWash:'#403A20' },
    teal:   { name:'Teal', light:'#168C85', dark:'#52C9BF', lightWash:'#DDF1EF', darkWash:'#1E3A39' },
    pink:   { name:'Pink', light:'#D24D9A', dark:'#F47DBB', lightWash:'#F7E5F0', darkWash:'#42263A' },
    indigo: { name:'Indigo', light:'#4C58B8', dark:'#8792FF', lightWash:'#E7E9F8', darkWash:'#292D4C' },
    lime:   { name:'Lime', light:'#629B26', dark:'#A5D65B', lightWash:'#EBF2DA', darkWash:'#2C3A20' }
  };
  var DEFAULT = { mode:'light', accent:'green' };
  var MODES = ['light', 'dark'];
  var current = null;

  function clean(t){
    t = t || {};
    return {
      mode: t.mode === 'dark' ? 'dark' : 'light',
      accent: ACCENTS[t.accent] ? t.accent : DEFAULT.accent
    };
  }
  function stored(){
    try{ return clean(JSON.parse(localStorage.getItem(KEY) || 'null')); }catch(e){ return clean(null); }
  }
  function apply(theme){
    var t = clean(theme);
    current = t;
    var mode = t.mode;
    var root = document.documentElement;
    root.setAttribute('data-mode', mode);
    root.style.setProperty('--accent', ACCENTS[t.accent][mode]);
    root.style.setProperty('--theme-wash', ACCENTS[t.accent][mode + 'Wash']);
    root.style.setProperty('--on-accent', mode === 'dark' ? '#121211' : '#FFFFFF');
    var meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', mode === 'dark' ? '#14130E' : '#FAFAF7');
    try{ localStorage.setItem(KEY, JSON.stringify(t)); }catch(e){}
    return t;
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
