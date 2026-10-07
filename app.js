/* =========================================================
   DATA
   ========================================================= */
const LEVELS = [
  {name:'Seedling', threshold:0,   desc:'Everyday basics — eggs, toast, and simple sides'},
  {name:'Sprout',   threshold:180, desc:'Building confidence — pastas, stir-fries, and weeknight wins'},
  {name:'Sprig',    threshold:360, desc:'Weeknight mains — curries, tacos, and one-pot meals'},
  {name:'Bloom',    threshold:540, desc:'Dinner-party starters — risotto, gnocchi, and fish'},
  {name:'Harvest',  threshold:720, desc:'Showpiece mains — roasts, braises, and layered bakes'},
  {name:'Sage',     threshold:900, desc:'Master-level dishes — confit, Wellington, and beyond'},
];
const KITCHEN_TOOLS = [
  {id:'skillet', name:'Skillet / Frying Pan', desc:'Your go-to pan for searing, sautéing, and frying on the stovetop.', tips:['Preheat before adding oil for a better sear.','Use medium-high for most sautéing; lower heat for delicate eggs.','Don\'t overcrowd — food steams instead of browning.'], keywords:['skillet','frying pan','nonstick pan','large pan','medium pan','heavy pan','dry pan','in a pan']},
  {id:'wok', name:'Wok', desc:'A curved pan built for high-heat stir-frying, tossing, and quick cooking.', tips:['Get the wok smoking-hot before adding oil.','Keep ingredients moving — stir-fry is fast.','Add aromatics first, then protein, then vegetables.'], keywords:['wok']},
  {id:'dutch-oven', name:'Dutch Oven', desc:'A heavy lidded pot for braising, stewing, and one-pot meals.', tips:['Great for low-and-slow cooking on the stovetop or in the oven.','The heavy lid traps moisture for tender braises.','Can go from stovetop to oven seamlessly.'], keywords:['dutch oven']},
  {id:'stockpot', name:'Stock Pot', desc:'A tall pot for boiling pasta, simmering soup, and cooking in volume.', tips:['Use plenty of salted water for pasta — it should taste like the sea.','Bring to a rolling boil before adding pasta.','Reserve pasta water before draining for silky sauces.'], keywords:['large pot','medium pot','pot of','stock pot','same pot','in a pot']},
  {id:'whisk', name:'Whisk', desc:'For blending, emulsifying, and smoothing sauces, eggs, and batters.', tips:['Whisk in one direction for even mixing.','Add liquids slowly when making roux-based sauces.','A balloon whisk works best for incorporating air.'], keywords:['whisk']},
  {id:'spatula', name:'Spatula', desc:'For flipping, folding, scraping, and moving food without scratching your pan.', tips:['Use a fish spatula for delicate proteins.','Silicone works on nonstick; metal for cast iron.','Scrape the fond (browned bits) when deglazing.'], keywords:['spatula']},
  {id:'cutting-board', name:'Cutting Board', desc:'A stable surface for chopping, slicing, and all your prep work.', tips:['Place a damp towel underneath to prevent slipping.','Use separate boards for raw meat and vegetables.','Keep your knife sharp — a dull blade is more dangerous.'], keywords:['cutting board']},
  {id:'knife', name:'Chef\'s Knife', desc:'The workhorse knife for most chopping, slicing, and mincing tasks.', tips:['Pinch the blade with thumb and index finger for control.','Use a rocking motion for herbs and garlic.','Keep fingers curled under (the claw grip) to stay safe.'], keywords:['knife','paring knife']},
  {id:'oven', name:'Oven', desc:'For roasting, baking, and finishing dishes at steady, even heat.', tips:['Always preheat — most recipes assume a hot oven.','Use the middle rack for even cooking.','An oven thermometer helps if yours runs hot or cold.'], keywords:['oven','preheat the oven','heat oven','heated oven','heat the oven']},
  {id:'broiler', name:'Broiler', desc:'Top-down intense heat for toasting, browning, and melting.', tips:['Watch closely — broilers go from golden to burnt fast.','Keep food 4–6 inches from the heating element.','Great for finishing cheese, melting, and quick toasts.'], keywords:['broiler']},
  {id:'griddle', name:'Griddle', desc:'A flat cooking surface ideal for pancakes, eggs, and batch cooking.', tips:['Low, steady heat prevents burning batters.','Wait until the surface is fully heated before ladling batter.','A light swipe of oil between batches prevents sticking.'], keywords:['griddle']},
  {id:'sheet-pan', name:'Sheet Pan', desc:'A rimmed baking tray for roasting vegetables and proteins together.', tips:['Spread ingredients in a single layer for browning.','Line with parchment for easy cleanup.','Rotate the pan halfway through for even roasting.'], keywords:['sheet pan','baking sheet','rimmed baking sheet','wire rack','sheet pan inside']},
  {id:'blender', name:'Blender', desc:'For puréeing soups, sauces, and smooth mixtures.', tips:['Let hot soup cool slightly before blending.','Blend in batches and never fill past the max line.','Start on low speed, then increase to avoid splashing.'], keywords:['blender','purée','puree']},
  {id:'grill', name:'Grill', desc:'Open-flame cooking for smoky char and outdoor flavor.', tips:['Oil the grates to prevent sticking.','Let meat rest after grilling for juicier results.','Keep the lid closed on a gas grill for even heat.'], keywords:['grill','grate','gas grill']},
  {id:'mixing-bowl', name:'Mixing Bowl', desc:'For combining ingredients before they hit the heat.', tips:['Use a wide, shallow bowl for whisking eggs.','Room-temperature ingredients mix more evenly.','Stainless steel stays cool for whipping cream.'], keywords:['mixing bowl','medium bowl','large bowl','shallow bowl','in a bowl']},
  {id:'wooden-spoon', name:'Wooden Spoon', desc:'For stirring, deglazing, and scraping without damaging cookware.', tips:['Perfect for deglazing — scrape up all the flavorful bits.','Won\'t scratch nonstick or enamel surfaces.','Use the flat edge to stir thick sauces and stews.'], keywords:['wooden spoon']},
];
 
const DISHES = window.DISHES || [];

const BADGES = [
  {id:'first', name:'First Bite', desc:'Cook your very first dish', check:s=>s.completed.length>=1},
  {id:'streak3', name:'Three in a Row', desc:'Reach a 3-day streak', check:s=>s.streak>=3},
  {id:'week',  name:'One Week Strong', desc:'Reach a 7-day streak', check:s=>s.streak>=7},
  {id:'month', name:'One Month Flame', desc:'Reach a 30-day streak', check:s=>s.streak>=30},
  {id:'ten', name:'Double Digits', desc:'Cook 10 recipes', check:s=>s.completed.length>=10},
  {id:'twentyfive', name:'Quarter Chef', desc:'Cook 25 recipes', check:s=>s.completed.length>=25},
  {id:'fifty', name:'Fifty Plates Club', desc:'Cook 50 recipes', check:s=>s.completed.length>=50},
  {id:'all54', name:'Menu Master', desc:'Cook all 54 recipes', check:s=>s.completed.length>=DISHES.length},
  {id:'lvl0', name:'Seedling Graduate', desc:'Finish every Seedling-level dish (9 recipes)', check:s=>DISHES.filter(d=>dishLevel(d)===0).every(d=>s.completed.includes(d.id))},
  {id:'lvl1', name:'Sprout Graduate', desc:'Finish every Sprout-level dish (9 recipes)', check:s=>DISHES.filter(d=>dishLevel(d)===1).every(d=>s.completed.includes(d.id))},
  {id:'lvl2', name:'Sprig Graduate', desc:'Finish every Sprig-level dish (9 recipes)', check:s=>DISHES.filter(d=>dishLevel(d)===2).every(d=>s.completed.includes(d.id))},
  {id:'lvl3', name:'Bloom Graduate', desc:'Finish every Bloom-level dish (9 recipes)', check:s=>DISHES.filter(d=>dishLevel(d)===3).every(d=>s.completed.includes(d.id))},
  {id:'lvl4', name:'Harvest Graduate', desc:'Finish every Harvest-level dish (9 recipes)', check:s=>DISHES.filter(d=>dishLevel(d)===4).every(d=>s.completed.includes(d.id))},
  {id:'lvl5', name:'Sage Graduate', desc:'Finish every Sage-level dish (9 recipes)', check:s=>DISHES.filter(d=>dishLevel(d)===5).every(d=>s.completed.includes(d.id))},
  {id:'learner', name:'Kitchen Scholar', desc:'Visit the Learn page', check:s=>s.visitedLearn},
  {id:'vintner', name:'Master Sage', desc:'Reach the top level', check:s=>levelIndex(s.xp)>=LEVELS.length-1},
  {id:'xp500', name:'Rising Star', desc:'Earn 500 total XP', check:s=>s.xp>=500},
  {id:'xp1000', name:'XP All-Star', desc:'Earn 1,000 total XP', check:s=>s.xp>=1000},
  {id:'post1', name:'Recipe Contributor', desc:'Submit your first recipe for review', check:s=>(s.recipesPosted||0)>=1},
  {id:'post5', name:'Community Cook', desc:'Submit 5 recipes for review', check:s=>(s.recipesPosted||0)>=5},
  {id:'post15', name:'Recipe Powerhouse', desc:'Submit 15 recipes for review', check:s=>(s.recipesPosted||0)>=15},
];
 
// Placeholder pricing tiers for the "Upgrade" page. Names echo the LEVELS
// above on purpose — no payments are wired up, this is a mockup only.
const PLANS = [
  {
    id:'seedling',
    name:'Seedling',
    price:'Free',
    period:'',
    tagline:'Everything you need to start climbing the vine.',
    features:[
      'One suggested dish at a time',
      'Full recipe path, Seedling to Vintner',
      'Streaks, XP and badges',
      'Progress saved to your profile'
    ],
    cta:'Current plan',
    featured:false,
    disabled:true
  },
  {
    id:'sprout',
    name:'Sprout+',
    price:'$4.99',
    period:'/mo',
    tagline:'For cooks who want to move at their own pace.',
    features:[
      'Everything in Seedling',
      'Unlock any level immediately',
      'Adjust ingredient yields on every recipe',
      'Ad-free, always'
    ],
    cta:'Upgrade to Sprout+',
    featured:true,
    disabled:false
  },
  {
    id:'vine',
    name:'Vintner Pro',
    price:'$9.99',
    period:'/mo',
    tagline:'For the ones cooking dinner parties on a Tuesday.',
    features:[
      'Everything in Sprout+',
      'Upload and track your own recipes',
      'Priority recipe requests',
      'Early access to new dishes'
    ],
    cta:'Upgrade to Vintner Pro',
    featured:false,
    disabled:false
  }
];
 
/* =========================================================
   STATE  (in-memory only — see note in the UI)
   ========================================================= */
const users = {};      // { username: { username, email, password, xp, streak, completed:[], completionDates:[], badges:[], currentGroup:0, checks:{} } }
let currentUser = null;
let screen = 'landing';     // landing | login | signup | app | plans
let planNotice = '';        // transient message shown on the placeholder Plans page
let appView = 'recipe';     // recipe | browse | path | profile | learn | leaderboard
let avatarOpen = false;
let activeDishId = null;    // dish currently open in the recipe flow
let dishStage = 'overview'; // overview | cooking | checking | denied | completed
let lastCompletion = null;  // { dish, leveledUp, newLevelIdx, newBadges } for the completed page
let activeYieldAmount = null; // currently selected serving amount for the dish in the cooking page
let learnToolFocus = null;  // tool id to scroll/highlight on Learn page
let leaderboardRows = null;   // cached rows for the Leaderboard tab
let leaderboardLoading = false;
let socialIndex = {};         // username -> public card from Firestore index doc
let socialGroups = {};        // groupId -> group
let lbMode = 'alltime';       // weekly | alltime
let lbTieSeed = 1;
let viewingUser = null;
let profileOrigin = 'leaderboard';
let groupFormOpen = false;
let joinCodeInput = '';
let activeGroupId = null;
let socialNotice = '';
let socialBusy = false;
let recipeDraftPhoto = '';
let completionPhoto = '';        // photo the user must attach before finishing a recipe
let checkRunId = 0;              // id of the latest photo check, so stale results get ignored
let checkResult = null;          // { complete, reason, error } from the last photo check
let recipeDraftName = '';
let recipeDraftIngredients = '';
let recipeDraftInstructions = '';
let recipeDraftTime = '';
let recipeDraftServings = '4';
let recipeDraftMacros = { calories:'', protein:'', carbs:'', fat:'', saturatedFat:'', fiber:'', sugar:'', sodium:'', cholesterol:'' };
let recipeMacroState = '';      // '' | 'loading' while the "Estimate macros" button is working
let recipeOutForReview = false;
let recipeUploadStage = 'form';   // form | checking | live | rejected | error
let recipeUploadResult = null;    // { reason, category, name } shown on the live / rejected / error pages
let recipeUploadRunId = 0;        // id of the latest moderation run, so stale results get ignored
let communityDishes = [];
let communityLoading = false;
let browseQuery = '';
let viewShouldAnimate = false;
let lastViewToken = '';
 
function levelIndex(xp){
  let idx = 0;
  for(let i=0;i<LEVELS.length;i++){ if(xp>=LEVELS[i].threshold) idx=i; }
  return idx;
}
function maxGroupInTier(tier){
  const groups = DISHES.filter(d=>d.tier===tier).map(d=>d.group);
  return groups.length ? Math.max(...groups) : 0;
}
function todayStr(){ return new Date().toISOString().slice(0,10); }
function dayDiff(a,b){ return Math.round((new Date(b)-new Date(a))/86400000); }
 
/* Cloud sync uses only window.createUser, window.getUserData, and window.editUserData. */
const INDEX_ID = '__gv_index';
const GROUPS_ID = '__gv_groups';
const CIRCLE_GOAL = 'Most XP this week';
function circleDocId(code){
  return 'circle_' + String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function jsStr(s){
  return String(s == null ? '' : s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
}
function currentWeekId(){
  const d = new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return date.getUTCFullYear() + '-W' + String(weekNo).padStart(2, '0');
}
function ensureWeek(s){
  if(!s) return;
  const w = currentWeekId();
  if(s.weekId !== w){ s.weekId = w; s.weeklyXp = 0; }
}
function weekResetLabel(){
  const now = new Date();
  const day = now.getDay();
  const daysUntilMon = (8 - day) % 7 || 7;
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMon, 0, 0, 0, 0);
  const ms = Math.max(0, next - now);
  const hrs = Math.floor(ms / 3600000);
  const days = Math.floor(hrs / 24);
  if(days >= 1) return days + ' day' + (days===1?'':'s') + ' left this week';
  return Math.max(1, hrs) + 'h left this week';
}
function hueFromName(name){
  const n = name || '?';
  let h = 0;
  for(let i=0;i<n.length;i++) h = (h * 31 + n.charCodeAt(i)) % 360;
  return h;
}
function safePhotoSrc(photo){
  const src = String(photo || '').trim();
  if(!src) return '';
  return /^data:image\//i.test(src) || /^blob:/i.test(src) || /^https?:\/\//i.test(src) ? src : '';
}
function avatarHTML(name, photo, cls, size){
  const label = (name || '?').slice(0,1).toUpperCase();
  const dim = size ? `width:${size}px;height:${size}px;` : '';
  const src = safePhotoSrc(photo);
  if(src){
    return `<div class="${cls}" style="${dim}background:hsl(${hueFromName(name)},42%,36%);"><img src="${src}" alt="${esc(label)}" onerror="this.style.display='none';this.parentElement.style.background='hsl(${hueFromName(name)},42%,36%)';this.parentElement.innerHTML='<span style=\'display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-weight:700;\'>${esc(label)}</span>';"></div>`;
  }
  return `<div class="${cls}" style="${dim}background:hsl(${hueFromName(name)},42%,36%);">${esc(label)}</div>`;
}
function persistLocal(){
  try{
    const out = {};
    if(currentUser && users[currentUser]) out[currentUser] = users[currentUser];
    localStorage.setItem('gv_users', JSON.stringify(out));
    if(currentUser) localStorage.setItem('gv_session', currentUser);
    else localStorage.removeItem('gv_session');
  }catch(e){}
}
function isYou(name){
  return String(name || '').toLowerCase() === String(currentUser || '').toLowerCase();
}
function youChip(){
  return `<span class="you-chip">you</span>`;
}
function tieHash(name){
  let h = lbTieSeed || 1;
  const s = String(name || '');
  for(let i=0;i<s.length;i++) h = Math.imul(h, 31) + s.charCodeAt(i) | 0;
  return h;
}
function showNotice(msg){
  socialNotice = msg;
  render(false);
  setTimeout(()=>{ if(socialNotice===msg){ socialNotice=''; render(false);} }, 2800);
}
function waitFirestore(timeoutMs){
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if(window.getUserData && window.editUserData && window.createUser) return resolve();
      if(Date.now() - start > (timeoutMs || 8000)) return reject(new Error('Cloud not ready'));
      setTimeout(tick, 50);
    };
    tick();
  });
}
function waitRecipes(timeoutMs){
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if(window.createRecipe && window.editRecipeData && window.getRecipeData && window.listApprovedRecipes) return resolve();
      if(Date.now() - start > (timeoutMs || 8000)) return reject(new Error('Cloud not ready'));
      setTimeout(tick, 50);
    };
    tick();
  });
}
function parseIndex(data){
  const out = {};
  if(!data) return out;
  Object.keys(data).forEach(k => {
    if(k.indexOf('u_')!==0) return;
    const card = data[k];
    if(!card || typeof card !== 'object') return;
    const username = card.username || k.slice(2);
    out[username] = { ...card, username };
  });
  return out;
}
function parseGroups(data){
  const out = {};
  if(!data) return out;
  Object.keys(data).forEach(k => {
    if(k.indexOf('g_')!==0) return;
    const g = data[k];
    if(!g || typeof g !== 'object') return;
    out[g.id || k.slice(2)] = g;
  });
  return out;
}
function emailKey(email){
  return 'e_' + String(email||'').toLowerCase().replace(/[^a-z0-9]/g, '_');
}
async function refreshSocialIndex(){
  try{
    await waitFirestore();
    const res = await window.getUserData(INDEX_ID);
    socialIndex = parseIndex(res && res.data);
    const gres = await window.getUserData(GROUPS_ID);
    socialGroups = parseGroups(gres && gres.data);
  }catch(e){ console.log(e); }
}
function applyCloudUser(username, data, card){
  if(!username || !data) return;
  const incoming = { ...data };
  delete incoming.password;
  if(isYou(username) && users[currentUser]){
    users[currentUser] = { ...users[currentUser], ...incoming, username: currentUser, password: users[currentUser].password };
  } else {
    users[username] = { ...(users[username] || {}), ...incoming, username, password: undefined };
  }
  const live = users[username] || incoming;
  socialIndex[username] = {
    ...(card || socialIndex[username] || {}),
    uid: live.uid || (card && card.uid) || '',
    username,
    displayName: live.displayName || live.username || username,
    photo: live.photo || '',
    xp: live.xp || 0,
    weeklyXp: live.weeklyXp || 0,
    weekId: live.weekId,
    streak: live.streak || 0,
    cooked: (live.completed || []).length,
    bio: live.bio || '',
    badges: Array.isArray(live.badges) ? live.badges.length : (live.badges || 0)
  };
}
async function hydrateAllUsersFromCloud(){
  await refreshSocialIndex();
  const cards = Object.values(socialIndex);
  await Promise.all(cards.map(async card => {
    if(!card || !card.uid) return;
    try{
      const r = await window.getUserData(card.uid);
      if(r && r.data) applyCloudUser(r.data.username || card.username, r.data, card);
    }catch(e){}
  }));
}
async function publishPublicCard(s){
  if(!s || !s.username) return;
  ensureWeek(s);
  try{
    await waitFirestore();
    const card = {
      uid: s.uid || '',
      username: s.username,
      displayName: s.displayName || s.username,
      photo: s.photo || '',
      xp: s.xp || 0,
      weeklyXp: s.weeklyXp || 0,
      weekId: s.weekId || currentWeekId(),
      streak: s.streak || 0,
      cooked: (s.completed || []).length,
      bio: s.bio || '',
      badges: (s.badges || []).length,
      updatedAt: Date.now()
    };
    const payload = { ['u_' + s.username]: card };
    if(s.email) payload[emailKey(s.email)] = s.username;
    await window.editUserData(INDEX_ID, payload);
    socialIndex[s.username] = card;
  }catch(e){ console.log(e); }
}
async function syncUserProfile(username, s){
  const u = s || users[username];
  if(!u) return;
  persistLocal();
  if(!u.uid){ await publishPublicCard(u); return; }
  try{
    await waitFirestore();
    ensureWeek(u);
    const { password, checks, ...rest } = u;
    await window.editUserData(u.uid, {
      ...rest,
      firestoresync: true,
      weeklyXp: u.weeklyXp || 0,
      weekId: u.weekId,
      photo: u.photo || '',
      bio: u.bio || '',
      groups: u.groups || []
    });
    await publishPublicCard(u);
  }catch(e){ console.log(e); }
}
function socialCardFor(name){
  const local = users[name];
  const cloud = socialIndex[name] || {};
  const week = currentWeekId();
  if(local){
    ensureWeek(local);
    return {
      username: name,
      uid: local.uid || cloud.uid || '',
      displayName: local.displayName || local.username || name,
      photo: local.photo || cloud.photo || '',
      xp: local.xp || 0,
      weeklyXp: local.weekId === week ? (local.weeklyXp || 0) : 0,
      weekId: local.weekId,
      streak: local.streak || 0,
      cooked: (local.completed || []).length,
      bio: local.bio || cloud.bio || '',
      badges: (local.badges || []).length
    };
  }
  return {
    username: name,
    uid: cloud.uid || '',
    displayName: cloud.displayName || name,
    photo: cloud.photo || '',
    xp: cloud.xp || 0,
    weeklyXp: cloud.weekId === week ? (cloud.weeklyXp || 0) : 0,
    weekId: cloud.weekId,
    streak: cloud.streak || 0,
    cooked: cloud.cooked || 0,
    bio: cloud.bio || '',
    badges: cloud.badges || 0
  };
}
function allCookNames(){
  const set = {};
  Object.keys(socialIndex).forEach(n => set[n] = true);
  Object.keys(users).forEach(n => set[n] = true);
  return Object.keys(set).sort((a,b)=>a.localeCompare(b));
}
function leaderboardEntries(mode){
  return allCookNames().map(n => {
    const c = socialCardFor(n);
    return { ...c, score: mode==='weekly' ? (c.weeklyXp||0) : (c.xp||0) };
  }).sort((a,b) => {
    const diff = (b.score||0) - (a.score||0);
    if(diff !== 0) return diff;
    return tieHash(a.username) - tieHash(b.username);
  });
}
 
/* =========================================================
   DATA DECODING
   Ingredients and steps are stored on each dish as a single
   template-literal string with a real line break (Enter)
   between each item, so a recipe can be edited or pasted in
   as a plain list. These two helpers detect those line breaks
   and split the string into the list the UI needs.
 
   Some dishes also list a "Yield:" line (and its amount, e.g.
   "4 servings") as the very first two lines of the ingredients
   block. parseIngredientsRaw() pulls those two lines out
   separately so they never show up as checkable ingredients —
   getYieldInfo() then turns that amount into data the cooking
   page can use to build a serving-size picker.
   ========================================================= */
function parseIngredientsRaw(dish){
  const lines = String(dish && dish.ingredients || '').split(/\n+/).map(s=>s.trim()).filter(Boolean);
  if(lines.length>=2 && /^yield:?$/i.test(lines[0])){
    return { yieldLabel: lines[1], list: lines.slice(2) };
  }
  return { yieldLabel: null, list: lines };
}
function ingredientsList(dish){ return parseIngredientsRaw(dish).list; }
function stepsList(dish){ 
  return String(dish && dish.steps || '')
  .split(/\n+/)
  .map(s => s.trim())
  .filter(Boolean)
  .filter(s => !/^step\s+\d+/i.test(s));
}
 
/* =========================================================
   YIELD PARSING & INGREDIENT SCALING
   ========================================================= */
const yieldInfoCache = {};
function getYieldInfo(dish){
  if(Object.prototype.hasOwnProperty.call(yieldInfoCache, dish.id)) return yieldInfoCache[dish.id];
  const { yieldLabel } = parseIngredientsRaw(dish);
  let info = null;
  if(yieldLabel){
    const m = yieldLabel.match(/^(\d+(?:\.\d+)?)/);
    if(m) info = { amount: parseFloat(m[1]), label: yieldLabel };
  }
  yieldInfoCache[dish.id] = info;
  return info;
}
 
const UNICODE_FRACTIONS = { '¼':0.25, '½':0.5, '¾':0.75, '⅓':1/3, '⅔':2/3, '⅛':0.125, '⅜':0.375, '⅝':0.625, '⅞':0.875 };
const FRACTION_MAP = [ [0.125,'⅛'], [0.25,'¼'], [1/3,'⅓'], [0.375,'⅜'], [0.5,'½'], [0.625,'⅝'], [2/3,'⅔'], [0.75,'¾'], [0.875,'⅞'] ];
 
// Parses the leading whole-number / unicode-fraction quantity at the very
// start of an ingredient line (e.g. "2", "¾", "1 ½"). Returns null when the
// line doesn't start with a quantity (e.g. "Salt and black pepper").
function parseLeadingQuantity(str){
  const m = str.match(/^(\d+(?:\.\d+)?)?(?:\s*([¼½¾⅓⅔⅛⅜⅝⅞]))?/);
  if(!m) return null;
  const whole = m[1] ? parseFloat(m[1]) : 0;
  const frac = m[2] ? UNICODE_FRACTIONS[m[2]] : 0;
  if(whole === 0 && frac === 0) return null;
  return { value: whole + frac, matchLength: m[0].length };
}
// Turns a scaled decimal back into a friendly "2", "¾", or "1 ½" style string.
function decimalToFractionStr(value){
  if(value<=0) return '0';
  const whole = Math.floor(value+1e-6);
  const remainder = value-whole;
  if(remainder<0.03) return String(whole);
  let bestFrac=null, bestDiff=Infinity;
  for(const [dec,ch] of FRACTION_MAP){
    const diff = Math.abs(remainder-dec);
    if(diff<bestDiff){ bestDiff=diff; bestFrac=ch; }
  }
  if(bestFrac && bestDiff<0.06){
    return whole>0 ? whole+' '+bestFrac : bestFrac;
  }
  return String(Math.round(value*100)/100);
}
// Scales the leading quantity of an ingredient line by `factor`, leaving
// everything else (unit, name, notes) untouched. Lines with no leading
// quantity (e.g. "Salt and black pepper") are returned as-is.
function scaleIngredientText(text, factor){
  if(!factor || factor===1) return text;
  const q = parseLeadingQuantity(text);
  if(!q) return text;
  // First scaled value
  const scaledFirst = decimalToFractionStr(q.value*factor);
 
  // Look ahead for a " to <number>" range after the first quantity (e.g. "1 to 2 cups").
  const rest = text.slice(q.matchLength);
  const rangeMatch = rest.match(/^\s*(?:to)\s*(\d+(?:\.\d+)?|[¼½¾⅓⅔⅛⅜⅝⅞])/i);
  if(rangeMatch){
    // parse the second number (may be unicode fraction)
    const token = rangeMatch[1];
    let secondVal = null;
    if(Object.prototype.hasOwnProperty.call(UNICODE_FRACTIONS, token)) secondVal = UNICODE_FRACTIONS[token];
    else secondVal = parseFloat(token);
    if(!isNaN(secondVal)){
      const scaledSecond = decimalToFractionStr(secondVal*factor);
      // replace the leading "X to Y" with "scaledX to scaledY"
      const afterRange = rest.slice(rangeMatch[0].length);
      return scaledFirst + " to " + scaledSecond + afterRange;
    }
  }
 
  return scaledFirst + rest;
}
// Very small pluralizer for the yield unit word ("serving"/"servings",
// "sandwich"/"sandwiches", etc.) — good enough for the simple cases in
// this recipe set, not a general-purpose grammar engine.
function pluralizeUnit(word, amount){
  if(!word) return '';
  const singular = amount===1;
  const endsWithS = /s$/i.test(word);
  if(singular && endsWithS){
    if(/ies$/i.test(word)) return word.slice(0,-3)+'y';
    if(/(ches|shes|xes|ses)$/i.test(word)) return word.slice(0,-2);
    return word.slice(0,-1);
  }
  if(!singular && !endsWithS){
    if(/[^aeiou]y$/i.test(word)) return word.slice(0,-1)+'ies';
    if(/(ch|sh|x|s)$/i.test(word)) return word+'es';
    return word+'s';
  }
  return word;
}
function formatYieldLabel(dish, amount){
  const info = getYieldInfo(dish);
  if(!info) return '';
  let unit = info.label.replace(/^\d+(?:\.\d+)?\s*(to\s*\d+(?:\.\d+)?\s*)?/i,'').trim();
  if(!unit) unit = 'servings';
  return `${amount} ${pluralizeUnit(unit, amount)}`;
}
 
/* =========================================================
   RENDER
   ========================================================= */
function viewToken(){
  return [screen, appView, activeDishId||'', dishStage, viewingUser||'', activeGroupId||'', recipeOutForReview?'1':'0', recipeUploadStage].join('|');
}
function render(scrollTop){
  const token = viewToken();
  const navigated = token !== lastViewToken;
  lastViewToken = token;
  if(navigated) syncHistory();
  viewShouldAnimate = navigated;
  if(scrollTop === undefined) scrollTop = navigated;
  const root = document.getElementById('root');
  if(screen==='landing') root.innerHTML = renderLanding();
  else if(screen==='login') root.innerHTML = renderAuth('login');
  else if(screen==='signup') root.innerHTML = renderAuth('signup');
  else if(screen==='app') root.innerHTML = renderApp();
  else if(screen==='plans') root.innerHTML = renderPlans();
  if(scrollTop) window.scrollTo(0,0);
}
/* =========================================================
   BROWSER HISTORY — makes the browser's Back / Forward buttons move between
   the app's pages. Whenever render() lands on a new page it records a small
   snapshot of the view (screen, tab, open recipe, profile…) with
   history.pushState, and the popstate handler puts that snapshot back.
   ========================================================= */
let restoringFromHistory = false;
let historyStarted = false;
const TRANSIENT_STAGES = ['checking', 'denied', 'completed'];
function navSnapshot(){
  return {
    chyve: 1,
    screen: screen,
    appView: appView,
    activeDishId: activeDishId,
    dishStage: dishStage === 'cooking' ? 'cooking' : 'overview',
    viewingUser: viewingUser,
    activeGroupId: activeGroupId,
    profileOrigin: profileOrigin
  };
}
function syncHistory(){
  if(restoringFromHistory || !window.history || !history.pushState) return;
  try{
    const snap = navSnapshot();
    if(!historyStarted){ history.replaceState(snap, ''); historyStarted = true; return; }
    // The photo-check and "recipe completed" pages share the cooking page's history entry.
    if(screen === 'app' && TRANSIENT_STAGES.indexOf(dishStage) > -1) return;
    const prev = history.state;
    if(prev && JSON.stringify(prev) === JSON.stringify(snap)) return;
    // Logging in replaces the login / sign-up entry instead of stacking the app on top of it.
    if(prev && screen === 'app' && (prev.screen === 'login' || prev.screen === 'signup')){
      history.replaceState(snap, '');
      return;
    }
    history.pushState(snap, '');
  }catch(e){}
}
function applyNavSnapshot(st){
  screen = st.screen || 'landing';
  appView = st.appView || 'recipe';
  activeDishId = st.activeDishId || null;
  dishStage = st.dishStage === 'cooking' ? 'cooking' : 'overview';
  viewingUser = st.viewingUser || null;
  activeGroupId = st.activeGroupId || null;
  profileOrigin = st.profileOrigin || profileOrigin;
  avatarOpen = false;
  completionPhoto = '';
  lastCompletion = null;
  window.__authError = '';
  const dish = activeDishId ? findDish(activeDishId) : null;
  const info = (dish && dishStage === 'cooking') ? getYieldInfo(dish) : null;
  activeYieldAmount = info ? info.amount : null;
}
window.addEventListener('popstate', function(e){
  let st = e.state;
  if(!st || !st.chyve) return;
  if(!currentUser && st.screen === 'app'){
    // Signed out: Back can't return to the signed-in app.
    st = { chyve: 1, screen: 'landing' };
    history.replaceState(st, '');
  } else if(currentUser && st.screen !== 'app' && st.screen !== 'plans'){
    // Signed in: Back shouldn't drop you onto the landing / login pages.
    st = navSnapshot();
    st.screen = 'app';
    history.replaceState(st, '');
  }
  restoringFromHistory = true;
  try{
    applyNavSnapshot(st);
    render(true);
  } finally {
    restoringFromHistory = false;
  }
  if(screen === 'app'){
    if(activeDishId) loadCompletions(activeDishId);
    else if(appView === 'browse' && !communityDishes.length) loadApprovedRecipes();
    else if((appView === 'leaderboard' || appView === 'groups') && !leaderboardRows) loadLeaderboard();
  }
});

function findDish(id){
  const sid = String(id);
  return DISHES.find(d => String(d.id) === sid) || communityDishes.find(d => String(d.id) === sid) || null;
}
function normalizeMacros(m){
  if(!m || typeof m !== 'object') return null;
  const n = v => { const x = Number(v); return isFinite(x) && x > 0 ? Math.round(x * 10) / 10 : 0; };
  const out = {
    servings: Math.max(1, Math.round(Number(m.servings) || 1)),
    calories: Math.round(n(m.calories)),
    protein: n(m.protein), carbs: n(m.carbs), fat: n(m.fat),
    saturatedFat: n(m.saturatedFat), fiber: n(m.fiber), sugar: n(m.sugar),
    sodium: Math.round(n(m.sodium)), cholesterol: Math.round(n(m.cholesterol))
  };
  if(!out.calories && !out.protein && !out.carbs && !out.fat) return null;
  return out;
}
function communityDishFromCloud(raw){
  let ingredients = typeof raw.ingredients === 'string'
    ? raw.ingredients
    : (Array.isArray(raw.ingredients) ? raw.ingredients.join('\n') : '');
  const macros = normalizeMacros(raw.macros && typeof raw.macros === 'object' ? { servings: raw.servings, ...raw.macros } : null);
  // The portion picker needs a "Yield:" line; build one from the servings the author entered.
  const servings = Math.round(Number(raw.servings) || Number(raw.macros && raw.macros.servings) || 0);
  if(servings > 0 && !/^\s*yield:?\s*(\n|$)/i.test(ingredients)){
    ingredients = 'Yield:\n' + servings + ' ' + (servings === 1 ? 'serving' : 'servings') + '\n' + ingredients;
  }
  const stepsSrc = raw.steps != null ? raw.steps : raw.instructions;
  const steps = typeof stepsSrc === 'string'
    ? stepsSrc
    : (Array.isArray(stepsSrc) ? stepsSrc.join('\n') : '');
  return {
    id: raw.id,
    name: raw.name || 'Untitled recipe',
    photo: raw.photo || '',
    time: raw.time || 'Community',
    cookTime: raw.cookTime || '',
    xp: 20,
    desc: raw.desc || (raw.author ? 'Shared by ' + raw.author : 'A cook from the Chyve community.'),
    ingredients,
    steps,
    community: true,
    author: raw.author || '',
    approved: raw.approved === true,
    views: Number(raw.views) || 0,
    completions: Number(raw.completions) || 0,
    macros: macros
  };
}
function dishCompleted(s, id){
  const sid = String(id);
  return (s.completed || []).some(x => String(x) === sid);
}
 
/* =========================================================
   PLACEHOLDER PHOTOS — real photography goes here later.
   Every dish image is an empty <img src=""> so a real photo
   can be dropped in by simply setting its src attribute.
   ========================================================= */
function genericImageIconSVG(size){
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="8.5" cy="10" r="1.6" fill="currentColor"/>
    <path d="M4 16.5 L9 11.5 L13 15.5 L16 12.5 L20 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
function dishNodePhoto(dish, size){
  const iconSize = Math.max(16, Math.round(size*0.24));
  return `<div class="node-photo">
    <img src="${dish.photo}" alt="${dish.name}" class="node-photo-img" onerror="this.style.display='none'">
    <div class="node-photo-placeholder">${genericImageIconSVG(iconSize)}</div>
  </div>`;
}
function dishPhotoBanner(dish, compact){
  return `<div class="dish-banner${compact?' compact':''}">
    <img src="${dish.photo}" alt="${dish.name} photo" class="dish-banner-img" onerror="this.style.display='none'">
    <div class="dish-banner-placeholder">${genericImageIconSVG(compact?26:40)}<span>Photo coming soon</span></div>
  </div>`;
}
 
function dishNodeHTML(dish, opts){
  const size = opts.size;
  const PHOTO_ASPECT = 3/2; // width:height — thumbnails match photo aspect ratio
  const height = Math.round(size / PHOTO_ASPECT);
  const stateClass = opts.locked ? 'locked' : (opts.done ? 'done' : (opts.current ? 'current' : ''));
  const clickAttr = opts.clickable ? ` onclick="openDish('${jsStr(String(dish.id))}')"` : '';
  return `<div class="dish-node" style="width:${size}px;">
    <button ${opts.locked?'disabled':''}${clickAttr} class="dish-circle-btn ${stateClass}" style="width:${size}px;height:${height}px;">
      ${dishNodePhoto(dish, height)}
    </button>
    ${opts.done ? `<div class="done-badge">${checkIconSVG()}</div>` : ''}
    <div class="dish-node-name">${dish.name}</div>
    <div class="dish-node-meta">${dish.time} · ${dish.xp} XP</div>
    ${opts.statusText ? `<div class="dish-node-status ${opts.statusClass||''}">${opts.statusText}</div>` : ''}
  </div>`;
}
 
/* =========================================================
   PAGE: LANDING / HOMEPAGE
   ========================================================= */
function renderLanding(){
  return `
  <nav class="landing-nav">
    <div class="nav-left">
      <div class="brand">${brandMarkSVG(24)}Chyve</div>
      <button class="btn btn-gold btn-small upgrade-btn" onclick="goToPlans()">${iconSparkle()} Upgrade</button>
    </div>
    <div class="nav-actions">
      <button class="link-btn" onclick="goTo('login')">Log in</button>
      <button class="btn btn-primary btn-small" onclick="goTo('signup')">Sign up</button>
    </div>
  </nav>
 
  <section class="hero">
    <div class="hero-backdrop">${heroBackdropSVG()}</div>
    <div>
      <div class="hero-eyebrow">Your daily dish awaits</div>
      <h1>Grow your cooking, <em>one dish</em> at a time.</h1>
      <p class="sub">Chyve hands you a small, doable dish every day. Cook it, build your streak, and watch your skills grow from scrambled eggs to beef Wellington — a little sharper every day, like a fresh-snipped bunch of chives.</p>
      <div class="hero-ctas">
        <button class="btn btn-primary" onclick="goTo('signup')">Start growing — it's free</button>
        <button class="btn btn-ghost" onclick="goTo('login')">I already have an account</button>
      </div>
      <p class="hero-note">No cookbook to wade through — just 54 recipes, one at a time.</p>
    </div>
    <div class="hero-art">${chiveHeroSVG()}</div>
  </section>
 
  <div class="section-divider">${sectionDividerSVG()}</div>
 
  <section class="section">
    <div class="section-head">
      <div class="eyebrow">How it grows</div>
      <h2>Small dishes. Real momentum.</h2>
      <p>Every feature is built around one idea: showing up today matters more than any single fancy dinner.</p>
    </div>
    <div class="feature-grid">
      <div class="feature-card">
        <div class="icon">${iconDaily()}</div>
        <h3>A new dish, daily</h3>
        <p>Each day unlocks one achievable recipe suited to your level — never a full cookbook to wade through, just tonight's dinner.</p>
      </div>
      <div class="feature-card">
        <div class="icon">${iconStreak()}</div>
        <h3>Streaks that build habits</h3>
        <p>Cook today, keep your streak alive. Miss a day and it resets — the same simple pressure that makes habits stick.</p>
      </div>
      <div class="feature-card">
        <div class="icon">${iconLevels()}</div>
        <h3>Levels &amp; badges</h3>
        <p>Earn XP for every dish and grow from Seedling to Sage, unlocking badges for milestones along the way.</p>
      </div>
      <div class="feature-card">
        <div class="icon">${iconStreak()}</div>
        <h3>Weekly boards &amp; circles</h3>
        <p>Race friends on a global weekly leaderboard, peek into other kitchens, and join private competition circles.</p>
      </div>
    </div>
  </section>
 
  <div class="section-divider">${sectionDividerSVG()}</div>
 
  <section class="section">
    <div class="path-preview">
      <div class="path-preview-visual">${chivePathPreviewSVG()}</div>
      <div class="path-preview-copy">
        <h3>Follow your path from Seedling to Sage</h3>
        <p>Every dish you cook adds XP and nudges you further along the path. Work through six levels of nine recipes each, until you're cooking duck confit instead of scrambled eggs.</p>
        <div class="tier-chip-row">
          <span class="tier-chip">Seedling — everyday basics</span>
          <span class="tier-chip">Sprout — building confidence</span>
          <span class="tier-chip">Sprig — weeknight mains</span>
          <span class="tier-chip">Bloom — dinner-party dishes</span>
          <span class="tier-chip">Harvest — showpiece mains</span>
          <span class="tier-chip">Sage — master-level cooking</span>
        </div>
      </div>
    </div>
  </section>
 
  <footer>
    <div class="brand" style="font-size:1.05rem;">${brandMarkSVG(20)}Chyve</div>
    <span>Grow your cooking, one dish at a time.</span>
  </footer>
  `;
}
 
/* ---------- Landing / decorative SVGs ---------- */
function heroBackdropSVG(){
  let rows = '';
  const rowCount = 9;
  for(let i=0;i<rowCount;i++){
    const ry = 560 + (140/rowCount)*i;
    rows += '<path d="M0 '+ry+' L1200 '+(ry-26)+'" stroke="#2E7854" stroke-width="2" opacity="0.3"/>';
  }
  return `<svg viewBox="0 0 1200 700" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    <defs>
      <linearGradient id="skyGlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#E7A93D" stop-opacity="0"/>
        <stop offset="100%" stop-color="#E7A93D" stop-opacity="0.09"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="700" fill="url(#skyGlow)"/>
    <path d="M0 470 Q150 410 300 460 T600 450 T900 470 T1200 440 L1200 700 L0 700 Z" fill="#2F2B24" opacity="0.85"/>
    <path d="M0 540 Q200 500 400 528 T800 520 T1200 538 L1200 700 L0 700 Z" fill="#3A352D" opacity="0.95"/>
    ${rows}
  </svg>`;
}
function sectionDividerSVG(){
  return `<svg viewBox="0 0 1200 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 40 C 150 8, 300 72, 450 40 S 750 8, 900 40 S 1150 72, 1200 40" stroke="#2E7854" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.65"/>
    <circle cx="140" cy="22" r="5" fill="#A24E82" opacity="0.7"/>
    <circle cx="430" cy="58" r="5" fill="#CE7CB3" opacity="0.7"/>
    <circle cx="760" cy="22" r="5" fill="#A24E82" opacity="0.7"/>
    <circle cx="1050" cy="58" r="5" fill="#CE7CB3" opacity="0.7"/>
  </svg>`;
}
function iconDaily(){
  return `<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="13" r="10" fill="none" stroke="#7ED1A0" stroke-width="2"/>
    <path d="M13 6 C15.2 9 15.2 11.4 13 13.4 C10.8 11.4 10.8 9 13 6Z" fill="#4FA97C"/>
    <path d="M6.5 17 Q13 21.5 19.5 17" stroke="#4FA97C" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`;
}
function iconStreak(){
  return `<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2 C9 8 6 11 8 16 C9.5 19.5 13 20 13 20 C13 20 16.5 19.5 18 16 C20 11 17 8 13 2Z" fill="#E7A93D"/>
    <path d="M13 10 C11.5 13 12 15 13 16.5" stroke="#A24E82" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </svg>`;
}
function iconLevels(){
  return `<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2 L13 7.5" stroke="#4FA97C" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="13" cy="15" rx="6" ry="4" fill="#4FA97C" transform="rotate(-15 13 15)"/>
  </svg>`;
}
function iconSparkle(){
  return `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1 L8.3 5.2 L12.5 6.5 L8.3 7.8 L7 12 L5.7 7.8 L1.5 6.5 L5.7 5.2 Z" fill="currentColor"/>
  </svg>`;
}
function brandMarkSVG(size){
  const s = size || 22;
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="flex:0 0 auto;">
    <path d="M7 22 C5.8 15.5 8 9.5 6.3 3.2" stroke="var(--vine-dark)" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M12 22.5 C11.2 14.5 12.9 8 12 1.8" stroke="var(--vine-light)" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M17 22 C18.2 15.5 16 9.5 17.7 3.2" stroke="var(--vine)" stroke-width="1.7" stroke-linecap="round"/>
    <circle cx="6.3" cy="3.2" r="2.1" fill="var(--grape-light)"/>
    <circle cx="12" cy="1.8" r="2.4" fill="var(--grape)"/>
    <circle cx="17.7" cy="3.2" r="2.1" fill="var(--grape-light)"/>
  </svg>`;
}
function chiveHeroSVG(){
  const blades = [
    {x1:70,  y1:500, x2:55,  y2:60,  c1x:40, c1y:340, c2x:90, c2y:160, w:9, color:'#2E7854'},
    {x1:120, y1:510, x2:135, y2:40,  c1x:150,c1y:350, c2x:100,c2y:150, w:10,color:'#4FA97C'},
    {x1:175, y1:505, x2:170, y2:90,  c1x:150,c1y:340, c2x:195,c2y:180, w:9, color:'#7ED1A0'},
    {x1:225, y1:512, x2:240, y2:120, c1x:255,c1y:360, c2x:210,c2y:200, w:8, color:'#4FA97C'},
    {x1:270, y1:500, x2:255, y2:170, c1x:235,c1y:350, c2x:280,c2y:240, w:7, color:'#2E7854'},
  ];
  const stems = blades.map(b => `<path d="M${b.x1} ${b.y1} C ${b.c1x} ${b.c1y}, ${b.c2x} ${b.c2y}, ${b.x2} ${b.y2}" stroke="${b.color}" stroke-width="${b.w}" stroke-linecap="round" fill="none" filter="url(#heroShadow)"/>`).join('');
  const blossom = (cx,cy,r,fill) => {
    let dots = `<circle cx="${cx}" cy="${cy}" r="${r*0.62}" fill="${fill}" filter="url(#heroShadow)"/>`;
    for(let i=0;i<8;i++){
      const ang = (Math.PI*2/8)*i;
      dots += `<circle cx="${(cx+Math.cos(ang)*r).toFixed(1)}" cy="${(cy+Math.sin(ang)*r).toFixed(1)}" r="${(r*0.38).toFixed(1)}" fill="${fill}" opacity="0.9"/>`;
    }
    return dots;
  };
  return `
  <svg viewBox="0 0 340 540" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="heroShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.4"/>
      </filter>
    </defs>
    ${stems}
    ${blossom(55,60,17,'#CE7CB3')}
    ${blossom(135,40,20,'#A24E82')}
    ${blossom(170,90,16,'#CE7CB3')}
    ${blossom(240,120,14,'#A24E82')}
  </svg>`;
}
function chivePathPreviewSVG(){
  return `
  <svg viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#2E7854;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#4FA97C;stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:#7ED1A0;stop-opacity:0.8" />
      </linearGradient>
      <filter id="pathShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity="0.35"/>
      </filter>
    </defs>
    <path d="M30 240 C 10 190, 70 190, 60 140 S 10 90, 60 50 S 170 30, 160 10" stroke="url(#pathGradient)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#pathShadow)"/>
    <circle cx="30" cy="240" r="14" fill="#4FA97C" filter="url(#pathShadow)" stroke="#7ED1A0" stroke-width="2"/>
    <circle cx="60" cy="140" r="14" fill="#4FA97C" filter="url(#pathShadow)" stroke="#7ED1A0" stroke-width="2"/>
    <circle cx="60" cy="50" r="14" fill="#E7A93D" filter="url(#pathShadow)" stroke="#EFC469" stroke-width="2"/>
    <circle cx="160" cy="10" r="14" fill="#E7A93D" filter="url(#pathShadow)" stroke="#EFC469" stroke-width="2"/>
    <circle cx="105" cy="95" r="6" fill="#A24E82" opacity="0.9"/>
    <circle cx="118" cy="86" r="4" fill="#CE7CB3" opacity="0.85"/>
    <circle cx="94" cy="86" r="4" fill="#CE7CB3" opacity="0.85"/>
  </svg>`;
}
function tierIconSVG(){
  return `<svg class="tier-icon" width="20" height="24" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 22 L10 8" stroke="#4FA97C" stroke-width="2" stroke-linecap="round"/>
    <circle cx="10" cy="5" r="3.4" fill="#A24E82"/>
  </svg>`;
}
function pathBackgroundDecorSVG(){
  const width=200, segH=170, segments=9, totalH=segH*segments;
  let d = 'M100 '+totalH;
  for(let i=0;i<segments;i++){
    const yTop = totalH - (i+1)*segH;
    const yMid = totalH - i*segH - segH/2;
    const xCtrl = i%2===0 ? 24 : 176;
    d += ' C '+xCtrl+' '+(yMid+42)+', '+xCtrl+' '+(yMid-42)+', 100 '+yTop;
  }
  let blossoms='';
  for(let i=0;i<segments;i++){
    const y = totalH - i*segH - segH/2;
    const x = i%2===0 ? 58 : 142;
    const fill = i%2===0 ? '#A24E82' : '#CE7CB3';
    blossoms += '<circle cx="'+x+'" cy="'+y+'" r="9" fill="'+fill+'" opacity="0.6"/>';
  }
  return '<svg viewBox="0 0 '+width+' '+totalH+'" preserveAspectRatio="none" style="width:100%;height:100%;" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="'+d+'" stroke="#2E7854" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    blossoms +
  '</svg>';
}
 
/* =========================================================
   PAGE: LOGIN / SIGNUP
   ========================================================= */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function findAccount(identifier){
  const raw = (identifier || '').trim();
  if(!raw) return null;
  if(EMAIL_PATTERN.test(raw.toLowerCase())){
    const email = raw.toLowerCase();
    const username = Object.keys(users).find(id => (users[id].email || '').toLowerCase() === email);
    return username ? { username, account: users[username] } : null;
  }
  return users[raw] ? { username: raw, account: users[raw] } : null;
}

function renderAuth(mode){
  const isLogin = mode==='login';
  return `
  <div class="auth-wrap">
    <div class="auth-card">
      <button class="auth-back" onclick="goTo('landing')">← Back</button>
      <div class="brand">Chyve</div>
      <p class="auth-sub">${isLogin ? 'Welcome back — log in with your username or email.' : 'Create an account with a username, email, and password.'}</p>
      ${window.__authError ? `<div class="auth-error">${window.__authError}</div>` : ''}
      ${window.__authStatus ? `<div class="auth-error" style="border-color:rgba(126,209,160,0.65);color:var(--vine-light);background:rgba(79,169,124,0.12);">${window.__authStatus}</div>` : ''}
      ${window.__authBusy ? `<div class="auth-error" style="border-color:rgba(126,209,160,0.35);color:var(--vine-light);background:rgba(79,169,124,0.12);">Reaching the Chyve…</div>` : ''}
      <form onsubmit="return handleAuthSubmit(event,'${mode}')">
        ${isLogin ? `
        <div class="field">
          <label for="auth-id">Username or email</label>
          <input id="auth-id" type="text" autocomplete="username" placeholder="username or you@example.com" required>
        </div>` : `
        <div class="field">
          <label for="auth-username">Username</label>
          <input id="auth-username" type="text" autocomplete="username" required>
        </div>
        <div class="field">
          <label for="auth-email">Email</label>
          <input id="auth-email" type="email" autocomplete="email" placeholder="you@example.com" required>
        </div>`}
        <div class="field">
          <label for="auth-password">Password</label>
          <input id="auth-password" type="password" autocomplete="${isLogin?'current-password':'new-password'}" placeholder="••••••••" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block">${isLogin ? 'Log in' : 'Create account'}</button>
      </form>
      <div class="auth-divider">or</div>
      <button type="button" class="btn btn-google btn-block" ${window.__authBusy?'disabled':''} onclick="handleGoogleSignIn()">${isLogin ? 'Continue with Google' : 'Sign in with Google'}</button>
      <div class="auth-switch">
        ${isLogin
          ? `New here? <button onclick="goTo('signup')">Create an account</button>`
          : `Already growing something? <button onclick="goTo('login')">Log in</button>`}
      </div>
    </div>
  </div>`;
}

function handleAuthSubmit(e, mode){
  e.preventDefault();
  window.__authError = '';
  window.__authStatus = '';
  const isLogin = mode==='login';
  const password = document.getElementById('auth-password').value;

  if(isLogin){
    const identifier = document.getElementById('auth-id').value.trim();
    const found = findAccount(identifier);
    if(found && found.account.password===password){
      currentUser = found.username;
    } else {
      window.__authBusy = true;
      window.__authError = '';
      render();
      loginFromCloud(identifier, password);
      return false;
    }
  } else {
    const username = document.getElementById('auth-username').value.trim();
    const email = document.getElementById('auth-email').value.trim().toLowerCase();
    if(username.length<3){ window.__authError='Username must be at least 3 characters.'; render(); return false; }
    if(username.includes('@')){ window.__authError='Username cannot contain @.'; render(); return false; }
    if(!EMAIL_PATTERN.test(email)){ window.__authError='Enter a valid email address.'; render(); return false; }
    if(password.length<4){ window.__authError='Password must be at least 4 characters.'; render(); return false; }
    if(users[username]){ window.__authError='That username is already taken.'; render(); return false; }
    if(Object.values(users).some(u => (u.email || '').toLowerCase() === email)){
      window.__authError='An account with that email already exists.'; render(); return false;
    }

    window.__authBusy = true;
    window.__authError = '';
    window.__authStatus = '';
    render();
    console.log('Sending verification email to:', email);
    try{
    sendVerificationEmail(email)
      .then(() => {
        console.log('Verification email sent to:', email);
        window.__authBusy = false;
        window.__authStatus = 'Link sent — check your email to finish signing in.';
        window.__authError = '';
        render();
      })
      .catch((error) => {
        console.error('Verification email error:', error);
        window.__authBusy = false;
        window.__authStatus = '';
        window.__authError = 'Could not send the verification link. Please try again.';
        render();
      });
    }catch(e){
      console.log("Error sending verification email:", e);
    }
    return false;
  }
  screen='app'; appView='recipe'; activeDishId=null; dishStage='overview';
  persistLocal();
  render();
  return false;
}
 
function goTo(where){
  window.__authError='';
  screen = where;
  render();
}
 
function goToPlans(){
  planNotice = '';
  avatarOpen = false;
  screen = 'plans';
  render();
}
function selectPlan(planName){
  planNotice = `${planName} isn't live yet — this is just a placeholder page for now.`;
  render(false);
}
 
function logout(){
  currentUser = null;
  avatarOpen = false;
  viewingUser = null;
  screen = 'landing';
  persistLocal();
  render();
}

function googleUsernameFromUser(gUser){
  const email = String((gUser && gUser.email) || '');
  const fromEmail = email.split('@')[0] || '';
  const fromName = String((gUser && gUser.displayName) || '');
  let base = (fromName || fromEmail || 'cook').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18);
  if(base.length < 3) base = ('cook' + String((gUser && gUser.uid) || 'user').slice(0, 6)).toLowerCase();
  let username = base;
  let n = 2;
  while(users[username] && users[username].uid !== (gUser && gUser.uid)){
    username = (base.slice(0, 16) + n).slice(0, 20);
    n += 1;
  }
  return username;
}

async function enterWithGoogleUser(gUser){
  await waitFirestore();
  let wrap = null;
  try{ wrap = await window.getUserData(gUser.uid); }catch(e){}
  let data = wrap && wrap.data;
  if(!data || !data.username){
    await refreshSocialIndex();
    let username = googleUsernameFromUser(gUser);
    try{
      const idx = await window.getUserData(INDEX_ID);
      const idxData = (idx && idx.data) || {};
      const existingName = gUser.email ? idxData[emailKey(gUser.email)] : '';
      if(typeof existingName === 'string' && existingName){
        username = existingName;
        const card = socialIndex[username];
        if(card && card.uid){
          const existing = await window.getUserData(card.uid);
          if(existing && existing.data) data = existing.data;
        }
      }
    }catch(e){}
    if(!data || !data.username){
      data = {
        username,
        email: (gUser.email || '').toLowerCase(),
        password: '',
        xp: 0,
        streak: 0,
        completed: [],
        completionDates: [],
        badges: [],
        currentGroup: 0,
        checks: {},
        visitedLearn: false,
        uid: gUser.uid,
        weeklyXp: 0,
        weekId: currentWeekId(),
        photo: gUser.photoURL || '',
        bio: '',
        groups: [],
        displayName: gUser.displayName || username,
        google: true
      };
      await window.editUserData(gUser.uid, data);
    }
  }
  const username = data.username;
  users[username] = {
    username,
    email: data.email || (gUser.email || '').toLowerCase(),
    password: data.password || '',
    xp: data.xp || 0,
    streak: data.streak || 0,
    completed: data.completed || [],
    completionDates: data.completionDates || [],
    badges: data.badges || [],
    currentGroup: data.currentGroup || 0,
    checks: data.checks || {},
    visitedLearn: !!data.visitedLearn,
    uid: data.uid || gUser.uid,
    weeklyXp: data.weeklyXp || 0,
    weekId: data.weekId || currentWeekId(),
    photo: data.photo || gUser.photoURL || '',
    bio: data.bio || '',
    groups: data.groups || [],
    displayName: data.displayName || gUser.displayName || username,
    google: true
  };
  currentUser = username;
  ensureWeek(users[username]);
  persistLocal();
  publishPublicCard(users[username]);
  window.__authBusy = false;
  window.__authError = '';
  screen = 'app';
  appView = 'recipe';
  activeDishId = null;
  dishStage = 'overview';
  render();
}

async function handleGoogleSignIn(){
  if(window.__authBusy) return;
  if(typeof window.SignInWithGoogle !== 'function'){
    console.error('Google auth is not ready yet.');
    window.__authError = 'Google sign-in is still loading. Please try again in a moment.';
    render();
    return;
  }

  window.__authBusy = true;
  window.__authError = '';
  render();
  try{
    const result = await window.SignInWithGoogle();
    const user = result && result.user;
    console.log(user);
    console.log(result);
    if(!user) throw new Error('Google sign-in did not return a user.');
    await enterWithGoogleUser(user);
    window.location.replace('https://chyve.app/');
    console.log('redirecting to chyve.app after Google sign-in');
  }catch(error){
    const code = error && error.code;
    console.error('Google sign-in error:', { code, error });
    window.__authBusy = false;
    if(code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request'){
      window.__authError = '';
    } else {
      window.__authError = 'Google sign-in did not finish. Please try again.';
    }
    render();
  }
}

async function loginFromCloud(identifier, password){
  try{
    await refreshSocialIndex();
    const raw = (identifier || '').trim();
    let username = null;
    if(EMAIL_PATTERN.test(raw.toLowerCase())){
      try{
        await waitFirestore();
        const idx = await window.getUserData(INDEX_ID);
        const data = (idx && idx.data) || {};
        const mapped = data[emailKey(raw)];
        if(typeof mapped === 'string') username = mapped;
      }catch(e){}
    } else if(socialIndex[raw]){
      username = raw;
    }
    if(!username){
      window.__authError = 'Incorrect username/email or password.';
      window.__authBusy = false;
      render();
      return;
    }
    const card = socialIndex[username] || {};
    if(!card.uid){
      window.__authError = 'Could not reach that cook\'s profile yet.';
      window.__authBusy = false;
      render();
      return;
    }
    const res = await window.getUserData(card.uid);
    const data = res && res.data;
    if(!data || data.password !== password){
      window.__authError = 'Incorrect username/email or password.';
      window.__authBusy = false;
      render();
      return;
    }
    users[username] = { ...data, username: data.username || username };
    currentUser = username;
    window.__authBusy = false;
    window.__authError = '';
    screen = 'app'; appView = 'recipe'; activeDishId = null; dishStage = 'overview';
    persistLocal();
    render();
  }catch(e){
    window.__authError = 'Could not reach the cloud. Try again.';
    window.__authBusy = false;
    render();
  }
}
 
/* =========================================================
   PAGE: PLANS / UPGRADE (placeholder — no billing wired up)
   ========================================================= */
function renderPlans(){
  return `
  <div class="plans-wrap">
    <nav class="landing-nav">
      <div class="brand">Chyve<span class="dot">.</span></div>
      <button class="btn btn-ghost btn-small" onclick="goTo('${currentUser ? 'app' : 'landing'}')">← Back</button>
    </nav>
    <section class="plans-hero">
      <div class="hero-eyebrow">Grow faster</div>
      <h1>Choose your plan</h1>
      <p>Every plan follows the same path from Seedling to Vintner — upgrades just add a few extra tools along the way.</p>
    </section>
    <div class="plans-grid">
      ${PLANS.map(renderPlanCard).join('')}
    </div>
    ${planNotice ? `<p class="plans-notice">${planNotice}</p>` : ''}
    <p class="plans-footnote">This is a placeholder pricing page — no payment is collected and upgrades aren't active yet.</p>
  </div>`;
}
function renderPlanCard(plan){
  const btnClass = plan.disabled ? 'btn-disabled' : (plan.featured ? 'btn-gold' : 'btn-ghost');
  const onclick = plan.disabled ? '' : ` onclick="selectPlan('${plan.name}')"`;
  return `
  <div class="plan-card ${plan.featured?'featured':''}">
    ${plan.featured ? `<div class="plan-badge">Most popular</div>` : ''}
    <h3>${plan.name}</h3>
    <p class="plan-tagline">${plan.tagline}</p>
    <div class="plan-price"><span class="amount">${plan.price}</span>${plan.period?`<span class="period">${plan.period}</span>`:''}</div>
    <ul class="plan-features">
      ${plan.features.map(f=>`<li>${checkIconSVG()}<span>${f}</span></li>`).join('')}
    </ul>
    <button class="btn ${btnClass} btn-block"${onclick} ${plan.disabled?'disabled':''}>${plan.cta}</button>
  </div>`;
}
 
/* =========================================================
   PAGE: COOKING APP
   ========================================================= */
function renderApp(){
  const s = users[currentUser];
  const lvl = levelIndex(s.xp);
  const levelInfo = LEVELS[lvl];
  const nextInfo = LEVELS[lvl+1];
  const pct = nextInfo ? Math.round(((s.xp - levelInfo.threshold)/(nextInfo.threshold-levelInfo.threshold))*100) : 100;
 
  return `
  <div class="app-shell">
    <div class="app-topbar">
      <div class="app-topbar-brand">
        <div class="brand" style="cursor:pointer;" title="Your profile" onclick="openProfile('${jsStr(currentUser)}')">Chyve</div>
        <button class="btn btn-gold btn-small upgrade-btn" onclick="goToPlans()">${iconSparkle()} Upgrade</button>
      </div>
      <div class="stat-pills">
        <div class="pill streak">${s.streak} day${s.streak===1?'':'s'}</div>
        <div class="pill level">${levelInfo.name}
          <div class="xp-bar-wrap"><div class="xp-bar-fill" style="width:${pct}%;"></div></div>
        </div>
        <div class="avatar-menu">
          <button type="button" class="avatar-btn${appView==='profile' && !viewingUser?' active':''}" title="Profile" aria-label="Open profile" onclick="openProfile('${jsStr(currentUser)}')">${s.photo ? `<img src="${s.photo}" alt="">` : esc(currentUser.slice(0,1).toUpperCase())}</button>
        </div>
      </div>
    </div>
    <div class="app-tabs">
      <button type="button" class="app-tab ${appView==='recipe'?'active':''}" onclick="switchAppView('recipe')">Recipe</button>
      <button type="button" class="app-tab ${appView==='browse'||appView==='upload'?'active':''}" onclick="switchAppView('browse')">Browse</button>
      <button type="button" class="app-tab ${appView==='path'?'active':''}" onclick="switchAppView('path')">Path</button>
      <button type="button" class="app-tab ${appView==='learn'?'active':''}" onclick="switchAppView('learn')">Learn</button>
      <button type="button" class="app-tab ${appView==='leaderboard'||appView==='groups'?'active':''}" onclick="switchAppView('leaderboard')">Leaderboard</button>
    </div>
    <div class="app-main">
      <div class="view-enter${viewShouldAnimate?' anim':''}">
      ${activeDishId && (appView==='recipe' || appView==='path' || appView==='browse') ? renderDishFlow(s) : (
        appView==='recipe' ? renderRecipe(s) :
        appView==='browse' ? renderBrowse(s) :
        appView==='path' ? renderPath(s) :
        appView==='learn' ? renderLearn(s) :
        appView==='leaderboard' ? renderLeaderboard(s) :
        appView==='groups' ? renderGroups(s) :
        appView==='upload' ? renderUpload(s) :
        renderProfile(s)
      )}
      </div>
    </div>
    ${socialNotice ? `<div class="social-toast">${esc(socialNotice)}</div>` : ''}
  </div>
  `;
}
 
function switchAppView(v, toolId){
  appView = v;
  avatarOpen = false;
  if(v === 'profile') viewingUser = null;
  if(v === 'groups') activeGroupId = null;
  if(v === 'upload'){
    recipeOutForReview = false;
    recipeUploadRunId++;          // drop any check still running for an earlier visit
    recipeUploadStage = 'form';
    recipeUploadResult = null;
  }
  if(v === 'path' || v === 'profile'){
    activeDishId = null;
    dishStage = 'overview';
    learnToolFocus = null;
  } else if(v === 'learn' && currentUser){
    users[currentUser].visitedLearn = true;
    learnToolFocus = toolId || null;
  } else if(v === 'recipe'){
    learnToolFocus = null;
    if(!activeDishId) dishStage = 'overview';
  } else if(v === 'leaderboard' || v === 'groups'){
    activeDishId = null;
    dishStage = 'overview';
    learnToolFocus = null;
    loadLeaderboard();
  } else if(v === 'browse'){
    activeDishId = null;
    dishStage = 'overview';
    learnToolFocus = null;
    loadApprovedRecipes();
  } else if(v === 'upload'){
    activeDishId = null;
    dishStage = 'overview';
    learnToolFocus = null;
  }
  render();
}
function openLearnTool(toolId){
  const s = users[currentUser];
  s.visitedLearn = true;
  appView = 'learn';
  learnToolFocus = toolId;
  avatarOpen = false;
  render();
  setTimeout(()=>{
    const el = document.getElementById('tool-'+toolId);
    if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
  }, 50);
}
function getCurrentGroupRecipes(s){
  const lvl = levelIndex(s.xp);
  const tier = levelTier(lvl);
  return DISHES.filter(d => d.tier === tier && d.group === s.currentGroup);
}
function getSuggestedDish(s){
  const pool = getCurrentGroupRecipes(s);
  return pool.find(d => !s.completed.includes(d.id)) || null;
}
 
document.addEventListener('click', function(e){
  const btn = e.target.closest('button');
  if(btn && !btn.getAttribute('type')) btn.setAttribute('type', 'button');
  if(avatarOpen && !e.target.closest('.avatar-menu')){ avatarOpen=false; render(false); }
});
document.addEventListener('submit', function(e){
  e.preventDefault();
});
 
/* ---------- Dish flow: overview -> cooking -> completed ---------- */
function openDish(id){
  completionPhoto = '';
  loadCompletions(id);
  recordDishView(id).then(recorded => { if(recorded) loadCompletions(id); });
  activeDishId = id;
  dishStage = 'overview';
  avatarOpen = false;
  activeYieldAmount = null;
  render();
}
function closeDish(){
  completionPhoto = '';
  activeDishId = null;
  dishStage = 'overview';
  activeYieldAmount = null;
  render();
}
function startCooking(){
  completionPhoto = '';
  loadCompletions(activeDishId);
  dishStage = 'cooking';
  const dish = findDish(activeDishId);
  const info = dish ? getYieldInfo(dish) : null;
  activeYieldAmount = info ? info.amount : null;
  render();
}
function backToOverview(){
  dishStage = 'overview';
  render();
}
function setYield(amount){
  activeYieldAmount = amount;
  render(false);
}
function cookAnotherRecipe(){
  completionPhoto = '';
  const goBrowse = !!(lastCompletion && lastCompletion.dish && lastCompletion.dish.community);
  activeDishId = null;
  dishStage = 'overview';
  lastCompletion = null;
  activeYieldAmount = null;
  appView = goBrowse ? 'browse' : 'recipe';
  render();
}
function backToChyve(){
  completionPhoto = '';
  activeDishId = null;
  dishStage = 'overview';
  lastCompletion = null;
  activeYieldAmount = null;
  appView = 'path';
  render();
}
 
function renderDishFlow(s){
  if(dishStage==='completed' && lastCompletion) return renderCompletedPage(s);
  const dish = findDish(activeDishId);
  if(!dish) return '';
  if(dishStage==='checking') return renderCheckingPage(dish);
  if(dishStage==='denied') return renderDeniedPage(dish);
  if(dishStage==='cooking') return renderCookingPage(dish, s);
  return renderOverviewPage(dish, s);
}
 
/* ---------- Recipe view (today's choices) ---------- */
function renderRecipe(s){
  const lvl = levelIndex(s.xp);
  const groupRecipes = getCurrentGroupRecipes(s);
  const suggested = getSuggestedDish(s);
 
  if(groupRecipes.length === 0){
    return `<div class="all-done-card">
      <h2>Congratulations!</h2>
      <p style="color:var(--text-dim);margin-top:10px;">You've completed all 54 recipes. Check the Path tab to revisit any tier.</p>
    </div>`;
  }
  return `
    <div style="max-width:1200px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:52px;">
        <h2 style="color:var(--text-light);margin-bottom:8px;">${LEVELS[lvl].name}</h2>
        <p style="color:var(--text-dim);">${LEVELS[lvl].desc || 'Choose one to cook and unlock the next'}</p>
      </div>
      <div class="dish-node-row">
        ${groupRecipes.map(dish => {
          const done = dishCompleted(s, dish.id);
          const current = !done && suggested && suggested.id === dish.id;
          return dishNodeHTML(dish, {
            size:160, done, locked:false, current, clickable:true,
            statusText: done ? 'Cooked' : (current ? 'Suggested pick' : 'Click to view'),
            statusClass: done ? 'done' : (current ? 'ready' : '')
          });
        }).join('')}
      </div>
    </div>
  `;
}
 
/* ---------- Recipe overview page ---------- */
function renderOverviewPage(dish, s){
  const done = dishCompleted(s, dish.id);
  const eyebrow = dish.community
    ? (dish.author ? 'Community · ' + esc(dish.author) : 'Community recipe')
    : LEVELS[Math.min(dishLevel(dish),LEVELS.length-1)].name;
  return `
    <button type="button" class="back-btn" onclick="closeDish()">← Back</button>
    <div class="recipe-page">
      ${dishPhotoBanner(dish)}
      <div class="recipe-header">
        <div class="eyebrow">${eyebrow}</div>
        <h2>${esc(dish.name)}</h2>
        <div class="today-meta">
          <span>Total time: ${esc(dish.time)}</span>
          <span>${dish.xp} XP</span>
          <span>${ingredientsList(dish).length} ingredients</span>
          <span>${stepsList(dish).length} steps</span>
          ${viewsText(dish.id) ? `<span>${viewsText(dish.id)}</span>` : ''}
          ${completionsText(dish.id) ? `<span>${completionsText(dish.id)}</span>` : ''}
        </div>
        ${done ? '<p class="done-note">You have cooked this before — feel free to make it again.</p>' : ''}
        ${renderMacroCard(dish)}
        <button type="button" class="btn btn-gold" onclick="startCooking()">${done ? 'View recipe again' : 'Start cooking'} →</button>
      </div>
    </div>
  `;
}
 
/* ---------- Cooking page: checkable ingredients + instructions ---------- */
function checkIconSVG(){
  return `<svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.5L5.5 11L12 3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function checklistItem(dishId, field, idx, text, checked, readonly){
  const cls = `check-item${checked?' checked':''}${readonly?' readonly':''}`;
  const onclick = readonly ? '' : ` onclick="toggleCheck('${jsStr(String(dishId))}', '${field}', ${idx})"`;
  const badgeContent = checked ? checkIconSVG() : (field==='steps' ? (idx+1) : '');
  return `<li class="${cls}"${onclick}>
    <span class="check-badge ${field==='steps'?'step-badge':''}">${badgeContent}</span>
    <span class="check-text">${text}</span>
  </li>`;
}
function getChecks(s, dish){
  if(!s.checks) s.checks = {};
  if(!s.checks[dish.id]) s.checks[dish.id] = { steps: stepsList(dish).map(()=>false), ingredients: ingredientsList(dish).map(()=>false) };
  return s.checks[dish.id];
}
function toggleCheck(dishId, field, idx){
  const s = users[currentUser];
  const dish = findDish(dishId);
  if(!dish) return;
  const c = getChecks(s, dish);
  c[field][idx] = !c[field][idx];
  // The ingredient/instruction boxes are their own small scrollable panes.
  // A full re-render recreates them from scratch, which would normally reset
  // each one back to its top — so capture their scroll position first and
  // restore it right after, on top of never scrolling the outer page.
  const scrollLists = Array.from(document.querySelectorAll('.scroll-list'));
  const positions = scrollLists.map(el => el.scrollTop);
  render(false);
  const newScrollLists = document.querySelectorAll('.scroll-list');
  newScrollLists.forEach((el, i) => { if(positions[i] !== undefined) el.scrollTop = positions[i]; });
}
 
function renderYieldControl(dish, currentYield){
  const options = [1,2,4,8];
  return `
    <div class="yield-control">
      <span class="yield-current">Yield: <b>${formatYieldLabel(dish, currentYield)}</b></span>
      <div class="yield-options" role="group" aria-label="Adjust yield">
        ${options.map(n => `<button type="button" class="yield-opt ${currentYield===n?'active':''}" onclick="setYield(${n})">${n}</button>`).join('')}
      </div>
    </div>
  `;
}
 
function renderCookingPage(dish, s){
  const done = dishCompleted(s, dish.id);
  const rawIngredients = ingredientsList(dish);
  const steps = stepsList(dish);
  const yieldInfo = getYieldInfo(dish);
  const currentYield = yieldInfo ? (activeYieldAmount || yieldInfo.amount) : null;
  const factor = (yieldInfo && currentYield) ? (currentYield / yieldInfo.amount) : 1;
  const ingredients = yieldInfo ? rawIngredients.map(t => scaleIngredientText(t, factor)) : rawIngredients;
  const c = done ? {steps: steps.map(()=>true), ingredients: rawIngredients.map(()=>true)} : getChecks(s, dish);
  const checkedSteps = c.steps.filter(Boolean).length;
  const checkedIngredients = c.ingredients.filter(Boolean).length;
  const tools = detectToolsForDish(dish);
 
  return `
    <button class="back-btn" onclick="backToOverview()">← Back to recipe</button>
    <div style="max-width:900px;margin:0 auto;">${dishPhotoBanner(dish, true)}</div>
    <div class="cooking-header">
      <h2>${dish.name}</h2>
      ${(viewsText(dish.id) || completionsText(dish.id)) ? `<div class="steps-progress">${[viewsText(dish.id), completionsText(dish.id)].filter(Boolean).join(' · ')}</div>` : ''}
      ${!done ? `<div class="steps-progress"><b>${checkedSteps}/${steps.length}</b> instructions checked off</div>` : ''}
    </div>
    <div class="dish-detail">
      ${tools.length ? `
      <div class="tool-links">
        <span class="tool-links-label">Tools you'll need:</span>
        ${tools.map(t=>`<button type="button" class="tool-link-btn" onclick="openLearnTool('${t.id}')">${t.name}</button>`).join('')}
      </div>` : ''}
      <div>
        ${yieldInfo ? renderYieldControl(dish, currentYield) : ''}
        <h3>Ingredients <span style="color:var(--text-dim);font-weight:400;font-size:0.8rem;">(${checkedIngredients}/${ingredients.length} checked)</span></h3>
        <ul class="check-list scroll-list">
          ${ingredients.map((ing,i)=>checklistItem(dish.id,'ingredients',i,ing,c.ingredients[i],done)).join('')}
        </ul>
      </div>
      <div>
        <h3>Instructions</h3>
        <ul class="check-list scroll-list">
          ${steps.map((st,i)=>checklistItem(dish.id,'steps',i,st,c.steps[i],done)).join('')}
        </ul>
      </div>
      ${renderMacroCard(dish, factor, yieldInfo ? formatYieldLabel(dish, currentYield) : '')}
      ${!done ? completionPhotoCard() : ''}
      <div class="complete-btn-row">
        ${done
          ? `<div class="cooked-chip">${checkIconSVG()} Already cooked</div><button class="btn btn-ghost" onclick="closeDish()">Back to choices</button>`
          : `<button type="button" class="btn btn-gold" ${completionPhoto ? '' : 'disabled style="opacity:.5;cursor:not-allowed;"'} onclick="completeDish('${jsStr(String(dish.id))}')">${completionPhoto ? 'Finish recipe · +' + dish.xp + ' XP' : 'Add a photo to finish · +' + dish.xp + ' XP'}</button>`
        }
      </div>
    </div>
  `;
}
 
/* =========================================================
   NUTRITION ESTIMATES
   Macros are estimated by the server (Gemini) from the ingredient
   list ONLY. Uploaded recipes get theirs at upload time and store
   them on the recipe; built-in dishes have theirs saved in dishes.js.
   Nothing is estimated when a dish is merely viewed.
   ========================================================= */
function waitForFn(name, timeoutMs){
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if(typeof window[name] === 'function') return resolve();
      if(Date.now() - start > (timeoutMs || 8000)) return reject(new Error(name + ' not ready'));
      setTimeout(tick, 50);
    };
    tick();
  });
}
function dishHasRealIngredients(dish){
  return !!dish && ingredientsList(dish).length > 0 && !/\[PLACEHOLDER\]/i.test(String(dish.ingredients || ''));
}
function getDishMacros(dish){
  if(!dish) return null;
  if(dish.macros && typeof dish.macros === 'object') return dish.macros;
  return null;
}
function scaleMacros(m, factor){
  const f = factor > 0 ? factor : 1;
  if(f === 1) return m;
  const g = v => Math.round(v * f * 10) / 10;
  return {
    ...m,
    calories: Math.round(m.calories * f),
    protein: g(m.protein), carbs: g(m.carbs), fat: g(m.fat),
    saturatedFat: g(m.saturatedFat), fiber: g(m.fiber), sugar: g(m.sugar),
    sodium: Math.round(m.sodium * f), cholesterol: Math.round(m.cholesterol * f)
  };
}
/* scale = selected portion ÷ default portion (1 = the recipe's default portion).
   Every value is multiplied by it, so the protein / carb / fat split stays identical. */
function macroCardHTML(baseMacros, scale, scaleLabel){
  const m = scaleMacros(baseMacros, scale);
  const isScaled = !!(scale && scale !== 1);
  const pCal = m.protein * 4, cCal = m.carbs * 4, fCal = m.fat * 9;
  const total = (pCal + cCal + fCal) || 1;
  const pct = v => Math.round((v / total) * 100);
  const per = isScaled ? ('Scaled ' + (Math.round(scale * 100) / 100) + '× for ' + (scaleLabel || 'this portion')) : m.servings > 1 ? ' \u00b7 recipe makes ' + m.servings + ' servings' : '';
  return `
  <div class="macro-card">
    <div class="macro-head"><h3>Estimated nutrition</h3><span class="macro-sub">${isScaled ? '' : 'Per serving'}${per}</span></div>
    <div class="macro-main">
      <div class="macro-tile cal"><div class="val">${m.calories}<small>kcal</small></div><div class="lbl">Calories</div></div>
      <div class="macro-tile"><div class="val">${m.protein}<small>g</small></div><div class="lbl">Protein</div></div>
      <div class="macro-tile"><div class="val">${m.carbs}<small>g</small></div><div class="lbl">Carbs</div></div>
      <div class="macro-tile"><div class="val">${m.fat}<small>g</small></div><div class="lbl">Fat</div></div>
    </div>
    <div class="macro-split" aria-hidden="true">
      <span class="p" style="width:${pct(pCal)}%"></span><span class="c" style="width:${pct(cCal)}%"></span><span class="f" style="width:${pct(fCal)}%"></span>
    </div>
    <div class="macro-legend">
      <span><i style="background:var(--vine)"></i>Protein ${pct(pCal)}%</span>
      <span><i style="background:var(--gold)"></i>Carbs ${pct(cCal)}%</span>
      <span><i style="background:var(--grape-light)"></i>Fat ${pct(fCal)}%</span>
    </div>
    <div class="macro-more">
      <div><span>Saturated fat</span><b>${m.saturatedFat} g</b></div>
      <div><span>Fiber</span><b>${m.fiber} g</b></div>
      <div><span>Sugar</span><b>${m.sugar} g</b></div>
      <div><span>Sodium</span><b>${m.sodium} mg</b></div>
      <div><span>Cholesterol</span><b>${m.cholesterol} mg</b></div>
    </div>
    <p class="macro-note">Estimate — real values vary with brands and portion sizes.</p>
  </div>`;
}
function renderMacroCard(dish, scale, scaleLabel){
  if(!dishHasRealIngredients(dish)) return '';
  const m = normalizeMacros(getDishMacros(dish));
  return m ? macroCardHTML(m, scale, scaleLabel) : '';
}
 
/* ---------- Completion photo + completion counts ---------- */
/* Views + completions are stored on the recipe document in Firestore and only
   exist for community recipes — the built-in path dishes never record or show them. */
function loadCompletions(dishId){
  const first = findDish(dishId);
  if(!first || !first.community) return;
  const key = String(first.id);
  waitRecipes().then(() => window.getRecipeStats(key)).then(stats => {
    const dish = findDish(key);
    if(!stats || !dish) return;
    dish.views = stats.views;
    dish.completions = stats.completions;
    render(false);
  }).catch(e => console.error('Could not load recipe stats:', e));
}
/* Count a view once per browser session per recipe, so reopening or refreshing
   doesn't inflate the number. Resolves true if a view was actually recorded. */
const VIEW_SEEN_KEY = 'chyve_viewed_dishes';
function recordDishView(dishId){
  const dish = findDish(dishId);
  if(!dish || !dish.community) return Promise.resolve(false);
  const key = String(dish.id);
  let seen = {};
  try{ seen = JSON.parse(sessionStorage.getItem(VIEW_SEEN_KEY) || '{}') || {}; }catch(e){ seen = {}; }
  if(seen[key]) return Promise.resolve(false);
  seen[key] = 1;
  try{ sessionStorage.setItem(VIEW_SEEN_KEY, JSON.stringify(seen)); }catch(e){}
  return waitRecipes()
    .then(() => window.incrementRecipeStat(key, 'views'))
    .then(() => true)
    .catch(e => { console.error('Could not record view:', e); return false; });
}
function viewsText(dishId){
  const dish = findDish(dishId);
  if(!dish || !dish.community) return '';
  const n = Number(dish.views) || 0;
  return n + ' view' + (n === 1 ? '' : 's');
}
function completionsText(dishId){
  const dish = findDish(dishId);
  if(!dish || !dish.community) return '';
  const n = Number(dish.completions) || 0;
  return n + ' completion' + (n === 1 ? '' : 's');
}
function handleCompletionPhotoPick(e){
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  if(!file.type || file.type.indexOf('image/') !== 0){ showNotice('Choose a photo file.'); return; }
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = function(){
    const canvas = document.createElement('canvas');
    const max = 720;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    completionPhoto = canvas.toDataURL('image/jpeg', 0.72);
    URL.revokeObjectURL(url);
    render(false);
  };
  img.onerror = function(){ showNotice('Could not read that image.'); URL.revokeObjectURL(url); };
  img.src = url;
}
function clearCompletionPhoto(){ completionPhoto = ''; render(false); }
function completionPhotoCard(){
  return `
    <div class="recipe-photo-card" style="grid-column:1 / -1;">
      <h3>Add a photo of your dish</h3>
      <p style="color:var(--text-dim);font-size:0.88rem;margin:4px 0 12px;">A photo is required to finish this recipe and earn XP.</p>
      <input id="completion-photo-input" type="file" accept="image/*" class="hidden" onchange="handleCompletionPhotoPick(event)">
      ${completionPhoto ? `
        <div class="recipe-photo-preview-wrap"><img src="${completionPhoto}" alt="Your dish"></div>
        <div class="recipe-photo-actions">
          <button type="button" class="btn btn-ghost btn-small" onclick="document.getElementById('completion-photo-input').click()">Change photo</button>
          <button type="button" class="btn btn-ghost btn-small" onclick="clearCompletionPhoto()">Remove</button>
        </div>
      ` : `
        <button type="button" class="recipe-photo-drop" onclick="document.getElementById('completion-photo-input').click()">
          <strong>Add photo</strong>
          <span>Take or choose a picture of what you cooked.</span>
        </button>
      `}
    </div>`;
}

/* Step 1: photo is submitted -> "checking" page -> apiCheck -> completed or denied page */
function recipeTextFor(dish){
  const ing = ingredientsList(dish).map(t => '- ' + t).join('\n');
  const steps = stepsList(dish).map((t, i) => (i + 1) + '. ' + t).join('\n');
  return 'Recipe name: ' + dish.name + '\n\nIngredients:\n' + ing + '\n\nInstructions:\n' + steps;
}
async function completeDish(dishId){
  const s = users[currentUser];
  const dish = findDish(dishId);
  if(!dish || dishCompleted(s, dish.id)) return;
  if(!completionPhoto){ showNotice('Add a photo of your dish to finish this recipe.'); return; }
  if(dishStage === 'checking') return; // a check is already running

  const runId = ++checkRunId;
  const photo = completionPhoto;
  checkResult = null;
  dishStage = 'checking';
  render();

  let outcome;
  try{
    if(typeof window.apiCheck !== 'function') throw new Error('apiCheck is not loaded');
    const res = await window.apiCheck(photo, recipeTextFor(dish));
    console.log('apiCheck result:', res);
    outcome = { complete: res.complete === true, reason: res.reason || '', error: false };
  }catch(e){
    console.error('Photo check failed:', e);
    outcome = { complete: false, reason: '', error: true };
  }

  // The user may have left the page (or started another check) while we waited.
  if(runId !== checkRunId || dishStage !== 'checking' || String(activeDishId) !== String(dish.id)) return;

  if(outcome.complete){
    finalizeDish(dishId);
  } else {
    checkResult = outcome;
    dishStage = 'denied';
    render();
  }
}
function resubmitCompletion(){
  completionPhoto = '';
  checkResult = null;
  dishStage = 'cooking';
  render();
}
function renderCheckingPage(dish){
  return `
    <div class="completed-page">
      <div class="check-spinner"></div>
      <h2>Checking your dish...</h2>
      <p class="completed-sub">Hang tight while we take a look at your photo of <b>${esc(dish.name)}</b>.</p>
    </div>
  `;
}
function renderDeniedPage(dish){
  const r = checkResult || {};
  return `
    <div class="completed-page">
      <div class="denied-icon">&#10005;</div>
      <h2>${r.error ? "We couldn't check your photo" : 'Photo denied'}</h2>
      <p class="completed-sub">${r.error
        ? 'Something went wrong while checking. Please resubmit your photo.'
        : `We couldn't confirm that this photo shows your finished <b>${esc(dish.name)}</b>. Please resubmit a photo of the completed dish.`}</p>
      ${!r.error && r.reason ? `<p class="completed-sub" style="font-size:0.92rem;margin-top:10px;">${esc(r.reason)}</p>` : ''}
      <div class="completed-actions">
        <button class="btn btn-gold" onclick="resubmitCompletion()">Resubmit photo</button>
      </div>
    </div>
  `;
}

/* Step 2: photo approved -> award XP and show the completed page */
function finalizeDish(dishId){
  const s = users[currentUser];
  const dish = findDish(dishId);
  if(!dish || dishCompleted(s, dish.id)) return;
 
  const prevLevel = levelIndex(s.xp);
  s.completed.push(dish.id);
  s.xp += dish.xp;
 
  const newLevel = levelIndex(s.xp);
  if(!dish.community){
    if(newLevel > prevLevel){
      s.currentGroup = levelStartGroup(newLevel);
    } else if(dishLevel(dish) === prevLevel && dish.group === s.currentGroup && s.currentGroup < levelEndGroup(prevLevel)){
      s.currentGroup += 1;
    }
  }
 
  const today = todayStr();
  if(s.completionDates.length===0){
    s.streak = 1;
  } else {
    const last = s.completionDates[s.completionDates.length-1];
    if(last===today){ /* already counted today */ }
    else if(dayDiff(last, today)===1){ s.streak += 1; }
    else { s.streak = 1; }
  }
  if(s.completionDates[s.completionDates.length-1] !== today){
    s.completionDates.push(today);
  }
 
  const newBadges = BADGES.filter(b=>!s.badges.includes(b.id) && b.check(s));
  newBadges.forEach(b=>s.badges.push(b.id));

  ensureWeek(s);
  s.weeklyXp = (s.weeklyXp || 0) + dish.xp;

  syncUserProfile(currentUser, s);

  // Community recipes keep a shared completions counter on their recipe document;
  // built-in path dishes don't store completions at all.
  if(dish.community){
    const key = String(dish.id);
    dish.completions = (Number(dish.completions) || 0) + 1;
    waitRecipes().then(() => window.incrementRecipeStat(key, 'completions')).then(() => loadCompletions(key)).catch(e => console.error('Could not record completion:', e));
  }
  completionPhoto = '';
 
  lastCompletion = { dish, leveledUp: newLevel>prevLevel, newLevelIdx:newLevel, newBadges };
  dishStage = 'completed';
  spawnConfettiGlobal();
  render();
}
 
/* ---------- Recipe completed page ---------- */
function renderCompletedPage(s){
  const { dish, leveledUp, newLevelIdx, newBadges } = lastCompletion;
  return `
    <div class="completed-page">
      ${dishPhotoBanner(dish)}
      <h2>Recipe completed!</h2>
      <p class="completed-sub">You cooked <b>${dish.name}</b> and earned <b>+${dish.xp} XP</b>.</p>
      ${completionsText(dish.id) ? `<p class="completed-sub">${completionsText(dish.id)} so far</p>` : ''}
      ${leveledUp ? `<p class="completed-level">You have grown into a ${LEVELS[newLevelIdx].name}!</p>` : ''}
      ${newBadges.length ? `<div class="completed-badges">${newBadges.map(b=>`<div class="completed-badge-chip">${b.name}</div>`).join('')}</div>` : ''}
      <div class="completed-actions">
        <button class="btn btn-primary" onclick="cookAnotherRecipe()">Cook another recipe</button>
        <button class="btn btn-ghost" onclick="backToChyve()">Back to your Chyve</button>
      </div>
    </div>
  `;
}
 
/* ---------- Path view ---------- */
function renderPath(s){
  const lvl = levelIndex(s.xp);
  const suggested = getSuggestedDish(s);
 
  const grouped = {};
  DISHES.forEach(dish => {
    const key = dish.tier+'-'+dish.group;
    if(!grouped[key]) grouped[key] = [];
    grouped[key].push(dish);
  });
 
  let html = `
    <div style="text-align:center;margin-bottom:8px;">
      <h2 style="color:var(--text-light);margin-bottom:8px;">Your path through Chyve</h2>
      <p style="color:var(--text-dim);">Six levels, nine recipes each — cook one dish to grow to the next checkpoint.</p>
    </div>
    <div class="path-container">
      <div class="path-bg-decor">${pathBackgroundDecorSVG()}</div>
  `;
 
  let lastLevelMarker = -1;
  Object.keys(grouped).sort((a,b)=>{
    const [ta,ga] = a.split('-').map(Number), [tb,gb] = b.split('-').map(Number);
    return (ta-tb) || (ga-gb);
  }).forEach(key=>{
    const [tier, group] = key.split('-').map(Number);
    const dishes = grouped[key];
    const dLvl = dishLevel({tier, group});
 
    if(dLvl !== lastLevelMarker && group % 3 === 0){
      lastLevelMarker = dLvl;
      const levelName = LEVELS[Math.min(dLvl, LEVELS.length-1)].name;
      html += `<div class="tier-marker"><span class="line"></span>${tierIconSVG()}<span class="label">${levelName}</span>${tierIconSVG()}<span class="line"></span></div>`;
    }
 
    html += `<div class="dish-node-row">`;
    dishes.forEach(dish=>{
      const done = s.completed.includes(dish.id);
      const dLvl = dishLevel(dish);
      const locked = dLvl > lvl || (dLvl === lvl && dish.group > s.currentGroup);
      const current = !locked && !done && suggested && suggested.id === dish.id;
      html += dishNodeHTML(dish, {
        size:140, done, locked, current, clickable: !locked,
        statusText: locked ? 'Locked' : (done ? 'Cooked' : (current ? 'Up next' : '')),
        statusClass: locked ? 'locked' : (done ? 'done' : (current ? 'ready' : ''))
      });
    });
    html += `</div>`;
  });
 
  html += `</div>`;
  return html;
}
 
function playIconSVG(){
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor"/>
  </svg>`;
}
 
/* ---------- Learn view (kitchen tools) ---------- */
function renderLearn(s){
  return `
    <div class="learn-intro">
      <h2>Kitchen tools &amp; how to use them</h2>
      <p>Short video guides for the equipment you'll encounter on your path. Tap a tool from any recipe's cooking page to jump straight here.</p>
    </div>
    <div class="learn-sections">
      ${KITCHEN_TOOLS.map(tool=>`
        <section id="tool-${tool.id}" class="learn-section${learnToolFocus===tool.id?' highlight':''}">
          <h3>${tool.name}</h3>
          <p class="learn-desc">${tool.desc}</p>
          <div class="learn-video" aria-label="Video guide placeholder for ${tool.name}">
            <div class="learn-video-icon">${playIconSVG()}</div>
            <span class="learn-video-label">Video guide coming soon</span>
          </div>
          <div class="learn-tips">
            <h4>Quick tips</h4>
            <ul>${tool.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
          </div>
        </section>
      `).join('')}
    </div>
  `;
}
 
/* ---------- Leaderboard view ---------- */
function loadLeaderboard(){
  leaderboardLoading = true;
  leaderboardRows = null;
  lbTieSeed = (Date.now() % 2147483647) || 1;
  render(false);
  hydrateAllUsersFromCloud().then(() => {
    leaderboardRows = leaderboardEntries(lbMode);
    leaderboardLoading = false;
    if(appView === 'leaderboard' || appView === 'groups') render(false);
  }).catch(() => {
    leaderboardRows = leaderboardEntries(lbMode);
    leaderboardLoading = false;
    if(appView === 'leaderboard' || appView === 'groups') render(false);
  });
}
function setLbMode(mode){
  lbMode = mode;
  lbTieSeed = (Date.now() % 2147483647) || 1;
  leaderboardRows = leaderboardEntries(lbMode);
  render(false);
}
function pageCornerHead(title, sub, btnLabel, btnOnclick, extra){
  return `
    <div class="page-head">
      <div class="social-hero">
        <div class="hero-glow"></div>
        <h2>${title}</h2>
        <p>${sub}</p>
        ${extra || ''}
      </div>
      <button type="button" class="btn btn-gold btn-small page-corner-btn" onclick="${btnOnclick}">${btnLabel}</button>
    </div>
  `;
}
function renderLeaderboard(s){
  const rows = leaderboardRows || leaderboardEntries(lbMode);
  const top = rows.slice(0, 3);
  const header = pageCornerHead(
    lbMode==='weekly' ? 'This week on Chyve' : 'The Chyve board',
    lbMode==='weekly' ? 'Every cook in the database, ranked by XP earned this week. Tied scores shuffle each time you open the board.' : 'Every cook in the database, ranked by total XP. Tied scores shuffle each time you open the board.',
    'Circles',
    "switchAppView('groups')",
    `<div class="week-chip"><span class="pulse-dot"></span>${rows.length} cook${rows.length===1?'':'s'} · ${esc(weekResetLabel())}</div>`
  ) + `
    <div class="mode-toggle">
      <button type="button" class="${lbMode==='alltime'?'active':''}" onclick="setLbMode('alltime')">All cooks</button>
      <button type="button" class="${lbMode==='weekly'?'active':''}" onclick="setLbMode('weekly')">This week</button>
    </div>
  `;
  if(leaderboardLoading && leaderboardRows === null){
    return header + `<div class="skel"></div><div class="skel"></div><div class="skel"></div>`;
  }
  if(rows.length === 0){
    return header + `<div class="empty-illus">No cooks on the board yet — finish a recipe to plant the first score.</div>`;
  }
  const podium = top.length ? `
    <div class="podium">
      ${top.map((row, i) => `
        <button type="button" class="podium-card p${i+1}" onclick="openProfile('${jsStr(row.username)}')">
          <div class="podium-place">${i===0?'First vine':(i===1?'Second vine':'Third vine')}</div>
          ${avatarHTML(row.displayName || row.username, row.photo, 'podium-avatar')}
          <div class="podium-name">${esc(row.displayName || row.username)}${isYou(row.username)?youChip():''}</div>
          <div class="podium-score">${row.score||0} XP</div>
        </button>
      `).join('')}
    </div>
  ` : '';
  const maxScore = Math.max(1, ...rows.map(r => r.score||0));
  return header + podium + `
    <div class="leaderboard-list">
      ${rows.map((row, i) => {
        const rank = i+1;
        const lvl = levelIndex(row.xp || 0);
        const me = isYou(row.username);
        const name = row.displayName || row.username || '?';
        return `
        <button type="button" class="leaderboard-row ${me?'me':''} rank-${rank}" style="animation-delay:${Math.min(i,12)*0.04}s" onclick="openProfile('${jsStr(row.username)}')">
          <div class="lb-rank">${rank}</div>
          ${avatarHTML(name, row.photo, 'lb-avatar')}
          <div class="lb-name">${esc(name)}${me?youChip():''}<div class="rank-bar"><span style="width:${Math.round(((row.score||0)/maxScore)*100)}%;"></span></div></div>
          <div class="lb-level">${LEVELS[lvl].name}</div>
          <div class="lb-xp">${row.score||0} XP</div>
        </button>`;
      }).join('')}
    </div>
  `;
}

function setBrowseQuery(v){
  browseQuery = v;
  const el = document.getElementById('browse-search');
  const pos = el ? el.selectionStart : String(v||'').length;
  render(false);
  const next = document.getElementById('browse-search');
  if(next){
    next.focus();
    const n = pos == null ? next.value.length : pos;
    next.setSelectionRange(n, n);
  }
}
function filteredCommunityDishes(){
  const q = String(browseQuery || '').trim().toLowerCase();
  if(!q) return communityDishes;
  return communityDishes.filter(dish => {
    const hay = [dish.name, dish.author, dish.desc, dish.ingredients, dish.steps]
      .map(x => String(x || '').toLowerCase()).join(' ');
    return hay.indexOf(q) !== -1;
  });
}
function renderBrowse(s){
  const head = pageCornerHead(
    'Browse recipes',
    'Cook any approved community recipe for 20 XP. Tap a dish to open it the same way as the path.',
    'Upload recipe',
    "switchAppView('upload')"
  );
  const search = `
    <div class="browse-search">
      <input id="browse-search" type="search" placeholder="Search recipes, cooks, or ingredients" value="${esc(browseQuery)}" oninput="setBrowseQuery(this.value)" aria-label="Search recipes">
    </div>
  `;
  if(communityLoading && !communityDishes.length){
    return head + search + `<div class="skel"></div><div class="skel"></div>`;
  }
  if(!communityDishes.length){
    return head + search + `<div class="empty-illus">No approved recipes yet. Upload a dish and wait for it to be approved.</div>`;
  }
  const shown = filteredCommunityDishes();
  if(!shown.length){
    return head + search + `<div class="empty-illus">No recipes match “${esc(browseQuery)}”.</div>`;
  }
  return head + search + `
    <div class="browse-grid">
      ${shown.map(dish => {
        const done = dishCompleted(s, dish.id);
        return dishNodeHTML(dish, {
          size:160, done, locked:false, current:!done, clickable:true,
          statusText: done ? 'Cooked' : '20 XP',
          statusClass: done ? 'done' : 'ready'
        });
      }).join('')}
    </div>
  `;
}
function loadApprovedRecipes(){
  communityLoading = true;
  render(false);
  waitRecipes().then(() => window.listApprovedRecipes()).then((rows) => {
    communityDishes = (rows || []).map(communityDishFromCloud);
    communityLoading = false;
    if(appView === 'browse') render(false);
  }).catch(() => {
    communityLoading = false;
    showNotice('Could not load community recipes.');
    if(appView === 'browse') render(false);
  });
}

function renderUpload(s){
  const res = recipeUploadResult || {};
  if(recipeUploadStage === 'checking'){
    return `
      <div class="completed-page">
        <div class="check-spinner"></div>
        <h2>Checking your recipe...</h2>
        <p class="completed-sub">We're making sure <b>${esc(res.name || 'your recipe')}</b> is ready to share. This only takes a moment.</p>
      </div>
    `;
  }
  if(recipeUploadStage === 'live'){
    return `
      <div class="completed-page review-page">
        <div class="review-seal">Live</div>
        <h2>Your recipe is live!</h2>
        <p class="completed-sub"><b>${esc(res.name || 'Your recipe')}</b> passed our check and is now in Browse for everyone to cook.</p>
        ${res.macros ? `<div style="text-align:left;margin-top:24px;">${macroCardHTML(res.macros)}</div>` : ''}
        <div class="completed-actions">
          <button type="button" class="btn btn-primary" onclick="switchAppView('browse')">See it in Browse</button>
          <button type="button" class="btn btn-ghost" onclick="startAnotherRecipeUpload()">Upload another recipe</button>
        </div>
      </div>
    `;
  }
  if(recipeUploadStage === 'rejected'){
    return `
      <div class="completed-page">
        <div class="denied-icon">&#10005;</div>
        <h2>Recipe not approved</h2>
        <p class="completed-sub">We couldn't publish <b>${esc(res.name || 'this recipe')}</b>. Please upload an appropriate recipe.</p>
        ${res.reason ? `<p class="completed-sub" style="font-size:0.92rem;margin-top:10px;">${esc(res.reason)}</p>` : ''}
        <div class="completed-actions">
          <button type="button" class="btn btn-gold" onclick="startAnotherRecipeUpload()">Upload a different recipe</button>
          <button type="button" class="btn btn-ghost" onclick="switchAppView('browse')">Back to browse</button>
        </div>
      </div>
    `;
  }
  if(recipeUploadStage === 'error'){
    return `
      <div class="completed-page">
        <div class="denied-icon">!</div>
        <h2>We couldn't check your recipe</h2>
        <p class="completed-sub">Something went wrong on our end, so nothing was published. Your recipe is still saved here, so you can try again.</p>
        <div class="completed-actions">
          <button type="button" class="btn btn-gold" onclick="backToRecipeForm()">Try again</button>
        </div>
      </div>
    `;
  }
  return `
    <button type="button" class="back-btn" onclick="switchAppView('browse')">← Browse</button>
    <div class="social-hero">
      <div class="hero-glow"></div>
      <h2>Upload a recipe</h2>
      <p>Share a dish with a photo, a name, how long it takes, ingredients, instructions, and nutrition. We check every recipe automatically, and if it passes it goes live in Browse right away.</p>
    </div>
    <form class="upload-form" onsubmit="return submitRecipeUpload(event)">
      <div class="recipe-photo-card">
        <input id="recipe-photo-input" type="file" accept="image/*" class="hidden" onchange="handleRecipePhotoPick(event)">
        ${recipeDraftPhoto ? `
          <div class="recipe-photo-preview-wrap">
            <img src="${recipeDraftPhoto}" alt="Recipe preview">
          </div>
          <div class="recipe-photo-actions">
            <button type="button" class="btn btn-ghost btn-small" onclick="document.getElementById('recipe-photo-input').click()">Change photo</button>
            <button type="button" class="btn btn-ghost btn-small" onclick="clearRecipePhoto()">Remove</button>
          </div>
        ` : `
          <button type="button" class="recipe-photo-drop" onclick="document.getElementById('recipe-photo-input').click()">
            <span class="recipe-photo-icon">${genericImageIconSVG(28)}</span>
            <strong>Add a photo</strong>
            <span>Required. JPG or PNG, landscape looks best. We’ll resize it for you.</span>
          </button>
        `}
      </div>
      <div class="field">
        <label for="recipe-name">Name</label>
        <input id="recipe-name" type="text" maxlength="80" placeholder="Garlic roasted chicken" required value="${esc(recipeDraftName)}" oninput="recipeDraftName=this.value">
      </div>
      <div class="field-row">
        <div class="field">
          <label for="recipe-time">Total time</label>
          <input id="recipe-time" type="text" maxlength="30" placeholder="e.g. 45 min" required value="${esc(recipeDraftTime)}" oninput="recipeDraftTime=this.value">
        </div>
        <div class="field">
          <label for="recipe-servings">Servings it makes</label>
          <input id="recipe-servings" type="number" min="1" max="50" step="1" inputmode="numeric" required value="${esc(recipeDraftServings)}" oninput="recipeDraftServings=this.value">
        </div>
      </div>
      <div class="field">
        <label for="recipe-ingredients">Ingredients</label>
        <textarea id="recipe-ingredients" class="bio-edit upload-area" placeholder="One ingredient per line" required oninput="recipeDraftIngredients=this.value">${esc(recipeDraftIngredients)}</textarea>
      </div>
      <div class="field">
        <label for="recipe-instructions">Instructions</label>
        <textarea id="recipe-instructions" class="bio-edit upload-area" placeholder="Write the steps" required oninput="recipeDraftInstructions=this.value">${esc(recipeDraftInstructions)}</textarea>
      </div>
      ${renderRecipeMacroForm()}
      <button type="submit" class="btn btn-gold btn-block" ${socialBusy?'disabled':''}>${socialBusy?'Sending…':'Publish recipe'}</button>
    </form>
  `;
}
function startAnotherRecipeUpload(){
  resetRecipeDraftExtras();
  recipeOutForReview = false;
  recipeUploadRunId++;
  recipeUploadStage = 'form';
  recipeUploadResult = null;
  recipeDraftPhoto = '';
  recipeDraftName = '';
  recipeDraftIngredients = '';
  recipeDraftInstructions = '';
  render();
}
function captureRecipeDraftFields(){
  const nameEl = document.getElementById('recipe-name');
  const ingEl = document.getElementById('recipe-ingredients');
  const instEl = document.getElementById('recipe-instructions');
  if(nameEl) recipeDraftName = nameEl.value;
  if(ingEl) recipeDraftIngredients = ingEl.value;
  if(instEl) recipeDraftInstructions = instEl.value;
  const timeEl = document.getElementById('recipe-time');
  const servEl = document.getElementById('recipe-servings');
  if(timeEl) recipeDraftTime = timeEl.value;
  if(servEl) recipeDraftServings = servEl.value;
  MACRO_FIELDS.forEach(f => {
    const el = document.getElementById('recipe-macro-' + f[0]);
    if(el) recipeDraftMacros[f[0]] = el.value;
  });
}
function resetRecipeDraftExtras(){
  recipeDraftTime = '';
  recipeDraftServings = '4';
  recipeDraftMacros = { calories:'', protein:'', carbs:'', fat:'', saturatedFat:'', fiber:'', sugar:'', sodium:'', cholesterol:'' };
  recipeMacroState = '';
}
/* [key, label, unit, required] — nutrition is entered per serving. */
const MACRO_FIELDS = [
  ['calories', 'Calories', 'kcal', true],
  ['protein', 'Protein', 'g', true],
  ['carbs', 'Carbs', 'g', true],
  ['fat', 'Fat', 'g', true],
  ['saturatedFat', 'Saturated fat', 'g', false],
  ['fiber', 'Fiber', 'g', false],
  ['sugar', 'Sugar', 'g', false],
  ['sodium', 'Sodium', 'mg', false],
  ['cholesterol', 'Cholesterol', 'mg', false]
];
function renderRecipeMacroForm(){
  const busy = recipeMacroState === 'loading';
  return `
      <div class="macro-form">
        <div class="macro-form-head">
          <div>
            <h3>Nutrition</h3>
            <p>Per serving. Type in your own numbers, or let us estimate them from your ingredients and servings.</p>
          </div>
          <button type="button" class="btn btn-ghost btn-small" ${busy ? 'disabled' : ''} onclick="estimateRecipeMacros()">${busy ? 'Estimating…' : 'Estimate macros'}</button>
        </div>
        <div class="macro-form-grid">
          ${MACRO_FIELDS.map(f => `
          <div class="field">
            <label for="recipe-macro-${f[0]}">${f[1]} (${f[2]})${f[3] ? '' : ' <span class="opt">optional</span>'}</label>
            <input id="recipe-macro-${f[0]}" type="number" min="0" step="any" inputmode="decimal" ${f[3] ? 'required' : ''} value="${esc(recipeDraftMacros[f[0]])}" oninput="recipeDraftMacros.${f[0]}=this.value">
          </div>`).join('')}
        </div>
      </div>`;
}
/* The "Estimate macros" button: runs the macro estimator on the ingredients and fills the fields. */
async function estimateRecipeMacros(){
  if(recipeMacroState === 'loading') return;
  captureRecipeDraftFields();
  const ing = (recipeDraftIngredients || '').trim();
  if(!ing){ showNotice('Add your ingredients first, then estimate the macros.'); return; }
  const wanted = Math.round(Number(recipeDraftServings));
  const text = wanted >= 1 ? 'Yield:\n' + wanted + ' ' + (wanted === 1 ? 'serving' : 'servings') + '\n' + ing : ing;
  recipeMacroState = 'loading';
  render(false);
  try{
    await waitForFn('apiEstimateMacros');
    const m = await window.apiEstimateMacros(text);
    const next = {};
    MACRO_FIELDS.forEach(f => { next[f[0]] = String(m[f[0]] || 0); });
    recipeDraftMacros = next;
    if(!(wanted >= 1)) recipeDraftServings = String(m.servings || 1);
  }catch(err){
    console.error('Macro estimate failed:', err);
    showNotice("Couldn't estimate the macros right now. You can type them in yourself.");
  }
  recipeMacroState = '';
  render(false);
}
function clearRecipePhoto(){
  captureRecipeDraftFields();
  recipeDraftPhoto = '';
  render(false);
}
function handleRecipePhotoPick(e){
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  captureRecipeDraftFields();
  if(!file.type || file.type.indexOf('image/') !== 0){
    showNotice('Choose a photo file.');
    return;
  }
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = function(){
    const canvas = document.createElement('canvas');
    const max = 720;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    recipeDraftPhoto = canvas.toDataURL('image/jpeg', 0.72);
    render(false);
    URL.revokeObjectURL(url);
  };
  img.onerror = function(){ showNotice('Could not read that image.'); URL.revokeObjectURL(url); };
  img.src = url;
}
function backToRecipeForm(){
  recipeUploadRunId++;
  recipeUploadStage = 'form';
  recipeUploadResult = null;
  render();
}
async function submitRecipeUpload(e){
  e.preventDefault();
  if(recipeUploadStage === 'checking') return false;
  captureRecipeDraftFields();
  const name = recipeDraftName;
  const ingredients = recipeDraftIngredients;
  const instructions = recipeDraftInstructions;
  if(!name || !name.trim()){ showNotice('Add a recipe name.'); return false; }
  if(!ingredients || !ingredients.trim()){ showNotice('Add ingredients.'); return false; }
  if(!instructions || !instructions.trim()){ showNotice('Add instructions.'); return false; }
  if(!recipeDraftPhoto || !recipeDraftPhoto.trim()){ showNotice('Add a photo before submitting this recipe.'); return false; }

  const time = (recipeDraftTime || '').trim();
  if(!time){ showNotice('Add how long the recipe takes.'); return false; }
  const servings = Math.round(Number(recipeDraftServings));
  if(!(servings >= 1)){ showNotice('Add how many servings the recipe makes.'); return false; }
  const requiredMissing = ['calories', 'protein', 'carbs', 'fat'].filter(k => {
    const v = recipeDraftMacros[k];
    return String(v == null ? '' : v).trim() === '' || !(Number(v) >= 0);
  });
  const macros = normalizeMacros({ ...recipeDraftMacros, servings });
  if(requiredMissing.length || !macros){ showNotice('Add the nutrition (calories, protein, carbs and fat), or tap Estimate macros.'); return false; }

  const draft = {
    name: name.trim(),
    ingredients: ingredients.trim(),
    instructions: instructions.trim(),
    photo: recipeDraftPhoto
  };
  const runId = ++recipeUploadRunId;
  recipeUploadResult = { name: draft.name };
  recipeUploadStage = 'checking';
  render();


  // 1) Ask the AI moderator whether the recipe is appropriate.
  let verdict;
  try{
    if(typeof window.apiModerateRecipe !== 'function') throw new Error('apiModerateRecipe is not loaded');
    verdict = await window.apiModerateRecipe(draft, draft.photo);
  }catch(err){
    console.error('Recipe check failed:', err);
    if(runId !== recipeUploadRunId) return false;
    recipeUploadResult = { name: draft.name };
    recipeUploadStage = 'error';
    render();
    return false;
  }
  // The user may have left the upload page while we waited.
  if(runId !== recipeUploadRunId) return false;

  // 2a) Rejected: nothing is saved, and the user has to upload an appropriate recipe.
  if(!verdict.appropriate){
    recipeUploadResult = { name: draft.name, reason: verdict.reason, category: verdict.category };
    recipeUploadStage = 'rejected';
    // The rejected text and photo are discarded rather than kept in the form.
    resetRecipeDraftExtras();
    recipeDraftPhoto = '';
    recipeDraftName = '';
    recipeDraftIngredients = '';
    recipeDraftInstructions = '';
    if(appView !== 'upload') showNotice('Your recipe was not approved. Open Upload to see why.');
    render();
    return false;
  }

  // 2b) Approved: save it with approved = true so it goes live immediately.
  const payload = {
    name: draft.name,
    ingredients: draft.ingredients,
    instructions: draft.instructions,
    photo: draft.photo,
    author: currentUser,
    authorUid: users[currentUser] && users[currentUser].uid || '',
    status: 'live',
    approved: true,
    moderation: { checkedAt: Date.now(), by: 'ai' },
    time,
    servings,
    macros,
    views: 0,
    completions: 0,
    xp: 20,
    createdAt: Date.now()
  };
  try{
    await waitRecipes();
    const result = await window.createRecipe(payload);
    // Show it in Browse right away without waiting for a reload.
    const live = communityDishFromCloud({ ...result.data, id: result.id });
    communityDishes = [live].concat(communityDishes.filter(d => String(d.id) !== String(live.id)));
    if(runId !== recipeUploadRunId){
      // The user started something else meanwhile; leave their form alone.
      showNotice('Your recipe "' + draft.name + '" is live!');
      return false;
    }
    recipeUploadResult = { name: draft.name, macros: macros || null };
    recipeUploadStage = 'live';
    resetRecipeDraftExtras();
    recipeDraftPhoto = '';
    recipeDraftName = '';
    recipeDraftIngredients = '';
    recipeDraftInstructions = '';
    if(appView !== 'upload') showNotice('Your recipe "' + draft.name + '" is live!');
    render();
  }catch(err){
    console.error('Could not publish recipe:', err);
    if(runId !== recipeUploadRunId) return false;
    showNotice('Your recipe passed the check but could not be published. Please try again.');
    recipeUploadStage = 'form';
    recipeUploadResult = null;
    render(false);
  }
  return false;
}

async function openProfile(username){
  if(!username) return;
  profileOrigin = (appView === 'profile') ? (profileOrigin || 'leaderboard') : appView;
  viewingUser = isYou(username) ? null : username;
  appView = 'profile';
  avatarOpen = false;
  activeDishId = null;
  render();
  const target = viewingUser || currentUser;
  const card = socialIndex[target] || socialCardFor(target);
  if(card && card.uid){
    try{
      await waitFirestore();
      const r = await window.getUserData(card.uid);
      if(r && r.data){
        applyCloudUser(r.data.username || target, r.data, card);
        if(appView==='profile' && (viewingUser===target || (!viewingUser && isYou(target)))) render(false);
      }
    }catch(e){}
  }
}
function backFromProfile(){
  viewingUser = null;
  appView = profileOrigin || 'recipe';
  if(appView === 'profile' || appView === 'upload') appView = 'browse';
  if(appView === 'leaderboard' || appView === 'groups') loadLeaderboard();
  else if(appView === 'browse') loadApprovedRecipes();
  else render();
}

function renderGroups(s){
  if(activeGroupId && socialGroups[activeGroupId]) return renderGroupDetail(s, socialGroups[activeGroupId]);
  const list = Object.values(socialGroups);
  return `
    <button type="button" class="back-btn" onclick="switchAppView('leaderboard')">← Leaderboard</button>
    <div class="social-hero">
      <h2>Competition circles</h2>
      <p>Private kitchens racing for the most XP this week. Create a circle to get a join code, or enter a code to compete.</p>
    </div>
    <div class="join-row">
      <input id="join-code" maxlength="6" placeholder="JOIN CODE" value="${esc(joinCodeInput)}" oninput="setJoinCode(this.value)">
      <button class="btn btn-gold" onclick="joinGroupByCode()">Join circle</button>
      <button class="btn btn-ghost" onclick="toggleGroupForm()">${groupFormOpen?'Cancel':'New circle'}</button>
    </div>
    ${groupFormOpen ? `
    <div class="group-form">
      <h3>Plant a new circle</h3>
      <p class="group-goal">Goal: ${esc(CIRCLE_GOAL)}</p>
      <div class="field"><label for="g-name">Name</label><input id="g-name" maxlength="40" placeholder="Tuesday night cooks"></div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="createCompetitionGroup()">${socialBusy?'Creating…':'Create circle'}</button>
      </div>
    </div>` : ''}
    ${leaderboardLoading && !list.length ? `<div class="skel"></div>` : ''}
    ${!list.length ? `<div class="empty-illus">No circles yet — start one and share the join code with friends.</div>` : `
    <div class="groups-grid">
      ${list.map((g,i) => {
        const mine = (g.members||[]).indexOf(currentUser) !== -1;
        return `
        <div class="group-card" style="animation-delay:${Math.min(i,12)*0.05}s" onclick="openGroup('${jsStr(g.id)}')">
          <h3>${esc(g.name)}</h3>
          <p>${esc(CIRCLE_GOAL)}</p>
          <div class="group-foot">
            <span class="mini-stat">${(g.members||[]).length} cook${(g.members||[]).length===1?'':'s'}</span>
            ${mine ? `<span class="member-you">You're in</span>` : ''}
            <span class="code-pill">${esc(g.code)}</span>
          </div>
        </div>`;
      }).join('')}
    </div>`}
  `;
}
function openGroup(id){
  activeGroupId = id;
  appView = 'groups';
  render();
}
function closeGroupDetail(){
  activeGroupId = null;
  render();
}
function toggleGroupForm(){
  groupFormOpen = !groupFormOpen;
  render(false);
}
function backToPeople(){
  backFromProfile();
}
function renderGroupDetail(s, g){
  const members = (g.members || []);
  const rows = members.map(n => {
    const c = socialCardFor(n);
    return { ...c, score: c.weeklyXp || 0 };
  }).sort((a,b)=> {
    const diff = (b.score||0)-(a.score||0);
    if(diff !== 0) return diff;
    return tieHash(a.username) - tieHash(b.username);
  });
  const mine = members.indexOf(currentUser) !== -1;
  const maxScore = Math.max(1, ...rows.map(r => r.score||0));
  return `
    <button class="back-btn" onclick="closeGroupDetail()">← All circles</button>
    <div class="social-hero">
      <h2>${esc(g.name)}</h2>
      <p>${esc(g.desc || 'Weekly XP inside this circle.')}</p>
      <div class="week-chip"><span class="pulse-dot"></span>Code ${esc(g.code)} · ${esc(weekResetLabel())}</div>
    </div>
    <div class="form-actions" style="justify-content:center;margin-bottom:24px;">
      <button class="btn btn-ghost btn-small" onclick="copyGroupCode('${jsStr(g.code)}')">Copy invite code</button>
      ${mine
        ? `<button class="btn btn-ghost btn-small" onclick="leaveCompetitionGroup('${jsStr(g.id)}')">Leave circle</button>`
        : `<button class="btn btn-gold btn-small" onclick="joinCompetitionGroup('${jsStr(g.id)}')">Join this circle</button>`}
    </div>
    <div class="leaderboard-list">
      ${rows.map((row,i) => `
        <div class="leaderboard-row ${isYou(row.username)?'me':''} rank-${i+1}" style="animation-delay:${i*0.05}s" onclick="openProfile('${jsStr(row.username)}')">
          <div class="lb-rank">${i+1}</div>
          ${avatarHTML(row.displayName, row.photo, 'lb-avatar')}
          <div class="lb-name">${esc(row.displayName || row.username)}${isYou(row.username)?youChip():''}<div class="rank-bar"><span style="width:${Math.round(((row.score||0)/maxScore)*100)}%;"></span></div></div>
          <div class="lb-xp">${row.score||0} XP</div>
        </div>
      `).join('') || `<div class="empty-illus">No members yet.</div>`}
    </div>
  `;
}
function randomJoinCode(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for(let i=0;i<6;i++) c += chars[Math.floor(Math.random()*chars.length)];
  return c;
}
async function createCompetitionGroup(){
  const name = (document.getElementById('g-name')||{}).value;
  const desc = (document.getElementById('g-desc')||{}).value;
  if(!name || name.trim().length < 2){ showNotice('Give your circle a name.'); return; }
  if(socialBusy) return;
  socialBusy = true;
  try{
    await waitFirestore();
    const id = 'c' + Date.now().toString(36);
    const group = {
      id, name: name.trim(), desc: (desc||'').trim(),
      code: randomJoinCode(), createdBy: currentUser,
      members: [currentUser], createdAt: Date.now()
    };
    await window.editUserData(GROUPS_ID, { ['g_'+id]: group });
    socialGroups[id] = group;
    const s = users[currentUser];
    s.groups = s.groups || [];
    if(s.groups.indexOf(id)===-1) s.groups.push(id);
    if(s.uid) await window.editUserData(s.uid, { groups: s.groups });
    persistLocal();
    groupFormOpen = false;
    activeGroupId = id;
    showNotice('Circle planted. Share the code.');
    render();
  }catch(e){
    showNotice('Could not create that circle.');
  }
  socialBusy = false;
}
async function joinGroupByCode(){
  const code = (joinCodeInput || ((document.getElementById('join-code')||{}).value) || '').toUpperCase().replace(/\s/g,'');
  if(code.length < 4){ showNotice('Enter a circle code.'); return; }
  await refreshSocialIndex();
  const g = Object.values(socialGroups).find(x => (x.code||'').toUpperCase() === code);
  if(!g){ showNotice('No circle uses that code.'); return; }
  await joinCompetitionGroup(g.id);
}
async function joinCompetitionGroup(id){
  const g = socialGroups[id];
  if(!g) return;
  const members = g.members || [];
  if(members.indexOf(currentUser)!==-1){ activeGroupId = id; render(); return; }
  try{
    await waitFirestore();
    const latestWrap = await window.getUserData(GROUPS_ID);
    const latest = parseGroups(latestWrap && latestWrap.data);
    const live = latest[id] || g;
    live.members = live.members || [];
    if(live.members.indexOf(currentUser)===-1) live.members.push(currentUser);
    await window.editUserData(GROUPS_ID, { ['g_'+id]: live });
    socialGroups[id] = live;
    const s = users[currentUser];
    s.groups = s.groups || [];
    if(s.groups.indexOf(id)===-1) s.groups.push(id);
    if(s.uid) await window.editUserData(s.uid, { groups: s.groups });
    persistLocal();
    activeGroupId = id;
    showNotice('You joined ' + live.name + '.');
    render();
  }catch(e){ showNotice('Could not join that circle.'); }
}
async function leaveCompetitionGroup(id){
  const g = socialGroups[id];
  if(!g) return;
  try{
    await waitFirestore();
    const latestWrap = await window.getUserData(GROUPS_ID);
    const latest = parseGroups(latestWrap && latestWrap.data);
    const live = latest[id] || g;
    live.members = (live.members || []).filter(n => n !== currentUser);
    await window.editUserData(GROUPS_ID, { ['g_'+id]: live });
    socialGroups[id] = live;
    const s = users[currentUser];
    s.groups = (s.groups || []).filter(x => x !== id);
    if(s.uid) await window.editUserData(s.uid, { groups: s.groups });
    persistLocal();
    showNotice('You left the circle.');
    render();
  }catch(e){ showNotice('Could not leave that circle.'); }
}
function copyGroupCode(code){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(()=>showNotice('Invite code copied.')).catch(()=>showNotice(code));
  } else showNotice(code);
}

/* ---------- Profile view ---------- */
function renderProfile(s){
  const isSelf = !viewingUser || isYou(viewingUser);
  const name = isSelf ? currentUser : viewingUser;
  const card = socialCardFor(name);
  const person = users[name] || card;
  const xp = person.xp != null ? person.xp : (card.xp || 0);
  const lvl = levelIndex(xp);
  const photo = safePhotoSrc(person.photo || card.photo || '');
  const bio = person.bio != null ? person.bio : (card.bio || '');
  const badges = person.badges || [];
  const completed = person.completed || [];
  const streak = person.streak != null ? person.streak : (card.streak || 0);
  const dates = person.completionDates || [];
  if(isSelf) ensureWeek(s);
  else if(person && person.username) ensureWeek(person);
  const weekly = isSelf ? (s.weeklyXp||0) : ((person.weekId === currentWeekId() ? person.weeklyXp : card.weeklyXp) || 0);
  const cells = [];
  for(let i=27;i>=0;i--){
    const d = new Date();
    d.setDate(d.getDate()-i);
    const str = d.toISOString().slice(0,10);
    cells.push(Array.isArray(dates) && dates.includes(str));
  }
  const display = person.displayName || card.displayName || name;
  const nextInfo = LEVELS[lvl+1];
  const pct = nextInfo ? Math.round(((xp - LEVELS[lvl].threshold)/(nextInfo.threshold-LEVELS[lvl].threshold))*100) : 100;
  const cookedCount = (Array.isArray(completed) && completed.length) ? completed.length : (card.cooked || 0);
  const badgeCount = Array.isArray(badges) ? badges.length : (typeof badges === 'number' ? badges : 0);

  return `
    <div class="profile-stage">
      <div class="profile-banner">
        <div class="profile-banner-decor"></div>
        <div class="profile-toolbar">
          <button type="button" class="back-btn" onclick="backFromProfile()">← Back</button>
        </div>
      </div>
      <div class="profile-header">
        <div class="profile-avatar ${isSelf?'editable':''}" ${isSelf ? `onclick="document.getElementById('photo-input').click()"` : ''} style="${safePhotoSrc(photo) ? '' : 'background:hsl('+hueFromName(display)+',42%,36%);'}">
          ${safePhotoSrc(photo) ? `<img src="${safePhotoSrc(photo)}" alt="${esc(String(display).slice(0,1).toUpperCase())}">` : esc(String(display).slice(0,1).toUpperCase())}
          ${isSelf ? `<div class="photo-edit">Set photo</div>` : ''}
        </div>
        ${isSelf ? `<input id="photo-input" type="file" accept="image/*" class="hidden" onchange="handlePhotoPick(event)">` : ''}
        <div class="profile-copy">
          <h2>${esc(display)}${isSelf?youChip():''}</h2>
          <div class="level-label">${LEVELS[lvl].name} ${lvl<LEVELS.length-1 ? '· climbing to '+LEVELS[lvl+1].name : '· top of the vine'}</div>
          <div class="profile-xp-line">
            <div class="xp-bar-wrap profile-xp"><div class="xp-bar-fill" style="width:${pct}%;"></div></div>
            <span>${xp} XP</span>
          </div>
          ${isSelf
            ? `<textarea class="bio-edit" maxlength="160" placeholder="A short note about how you cook…" onchange="saveBio(this.value)">${esc(bio)}</textarea>`
            : `<div class="bio-edit readonly">${esc(bio || 'Still writing their story among the chives.')}</div>`}
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-box"><div class="num">${xp}</div><div class="lbl">Total XP</div></div>
        <div class="stat-box"><div class="num">${weekly}</div><div class="lbl">This week</div></div>
        <div class="stat-box"><div class="num">${streak}</div><div class="lbl">Day streak</div></div>
        <div class="stat-box"><div class="num">${cookedCount}</div><div class="lbl">Dishes cooked</div></div>
      </div>

      <h3 class="section-title">Last 4 weeks</h3>
      <div class="heatmap">${cells.map(on=>`<div class="heat-cell ${on?'on':''}"></div>`).join('')}</div>

      <h3 class="section-title">Badges${badgeCount ? ` · ${badgeCount}` : ''}</h3>
      <div class="badge-grid">
        ${BADGES.map(b=>`
          <div class="badge-card ${Array.isArray(badges) && badges.includes(b.id)?'earned':''}">
            <h5>${b.name}</h5>
            <p>${b.desc}</p>
          </div>`).join('')}
      </div>
    </div>
    ${isSelf ? `<div class="profile-footer"><button type="button" class="btn btn-ghost btn-block" onclick="logout()">Log out</button></div>` : ''}
  `;
}
function saveBio(text){
  const s = users[currentUser];
  s.bio = String(text||'').slice(0,160);
  persistLocal();
  syncUserProfile(currentUser, s);
}
function handlePhotoPick(e){
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = function(){
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    const scale = Math.max(size/img.width, size/img.height);
    const w = img.width*scale, h = img.height*scale;
    ctx.drawImage(img, (size-w)/2, (size-h)/2, w, h);
    const data = canvas.toDataURL('image/jpeg', 0.72);
    users[currentUser].photo = data;
    persistLocal();
    syncUserProfile(currentUser, users[currentUser]);
    render(false);
    URL.revokeObjectURL(url);
  };
  img.onerror = function(){ showNotice('Could not read that image.'); URL.revokeObjectURL(url); };
  img.src = url;
}
 
/* ---------- Confetti (finishing touch on the completed page) ---------- */
function spawnConfettiGlobal(){
  const colors = ['#4FA97C','#E7A93D','#A24E82','#7ED1A0','#CE7CB3'];
  for(let i=0;i<60;i++){
    const el = document.createElement('div');
    el.className='floating-confetti';
    el.style.left = (Math.random()*100)+'%';
    el.style.top = '-10px';
    el.style.width = el.style.height = (6+Math.random()*8)+'px';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.borderRadius = '50%';
    el.style.position = 'fixed';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '1000';
    el.style.animation = `confettiFall ${1.8+Math.random()*1.2}s ease-in forwards`;
    el.style.animationDelay = (Math.random()*0.2)+'s';
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 4000);
  }
}
 
/* ---------- Init ---------- */
(function boot(){
  try{
    const saved = JSON.parse(localStorage.getItem('gv_users') || '{}');
    Object.keys(saved).forEach(k => { users[k] = saved[k]; });
  }catch(e){}
  const session = localStorage.getItem('gv_session');
  if(session && users[session]){
    currentUser = session;
    screen = 'app';
    ensureWeek(users[session]);
  }
  render();
  refreshSocialIndex().then(() => {
    if(currentUser && users[currentUser] && users[currentUser].uid){
      return window.getUserData(users[currentUser].uid).then(res => {
        if(res && res.data){
          const incoming = res.data;
          users[currentUser] = { ...users[currentUser], ...incoming, password: users[currentUser].password || incoming.password };
          ensureWeek(users[currentUser]);
          persistLocal();
          publishPublicCard(users[currentUser]);
        }
      });
    }
  }).then(() => { if(screen==='app') render(false); }).catch(()=>{});
})();