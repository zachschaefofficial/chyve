import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where, increment, updateDoc, runTransaction, onSnapshot } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyBA3f2xD4Tw8IDGzUZVGJOLSIkXdGTTt1I",
  authDomain: "grapevine-457b0.firebaseapp.com",
  projectId: "grapevine-457b0",
  storageBucket: "grapevine-457b0.firebasestorage.app",
  messagingSenderId: "581040979464",
  appId: "1:581040979464:web:66a521354723f016fd9bbd",
  measurementId: "G-TRYSL7YVZ5"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

async function createUser(email, password, data) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const uid = user.uid;
  const newData = {
    ...data,
    uid: uid,
    admin: false,
    banned: false
  };
  await setDoc(doc(db, "users", uid), newData);
  return { uid: uid, data: newData };
}
async function editUserData(uid, newData) {
  const payload = { ...(newData || {}) };
  delete payload.admin;
  delete payload.banned; // only banUser() / unbanUser() may change this
  delete payload.bannedAt;
  delete payload.bannedBy;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) { payload.admin = false; payload.banned = false; }
  await setDoc(ref, payload, { merge: true });
  return { data: payload };
}
async function getUserData(uid){
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return { data: undefined };
  let data = docSnap.data() || {};
  if (typeof data.admin !== "boolean") {
    await setDoc(docRef, { admin: false }, { merge: true });
    data = { ...data, admin: false };
  }
  return { data };
}
function watchUserXP(uid, callback) {
  if (!uid || typeof callback !== "function") return () => {};
  return onSnapshot(doc(db, "users", uid), snap => {
    if (snap.exists()) callback(snap.data() || {});
  });
}
async function createRecipe(data) {
  const id = (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const newData = {
    ...data,
    id: id,
    approved: data.approved === true,
    views: Number(data.views) || 0,
    completions: Number(data.completions) || 0
  };
  await setDoc(doc(db, "recipes", id), newData);
  return { id: id, data: newData };
}
async function listApprovedRecipes(){
  const mapDoc = (d) => {
    const data = d.data() || {};
    return { ...data, id: data.id || d.id };
  };
  try{
    const q = query(collection(db, "recipes"), where("approved", "==", true));
    const snap = await getDocs(q);
    return snap.docs.map(mapDoc);
  }catch(e){
    const snap = await getDocs(collection(db, "recipes"));
    return snap.docs.map(mapDoc).filter(r => r.approved === true);
  }
}
async function editRecipeData(id, newData) {
  if (newData && newData.approved === false && newData.status === "taken_down") {
    const user = auth.currentUser;
    if (!user) throw new Error("Sign in as an admin to take down recipes.");
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists() || userSnap.data().admin !== true) {
      throw new Error("Only admins can take down recipes.");
    }
  }
  await setDoc(doc(db, "recipes", id), newData, { merge: true });
  return { data: newData };
}
async function getRecipeData(id){
  const docRef = doc(db, "recipes", id);
  const docSnap = await getDoc(docRef);
  return { data: docSnap.data() };
}
async function addRecipeComment({ recipeId, recipeName, text, attachPhoto }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in to leave a comment.");
  const cleanText = String(text || "").trim();
  if (!cleanText) throw new Error("Write a comment first.");
  if (cleanText.length > 1000) throw new Error("Comments must be 1,000 characters or fewer.");
  const userSnap = await getDoc(doc(db, "users", user.uid));
  if (!userSnap.exists() || userSnap.data().banned === true) throw new Error("Your account cannot comment.");
  const id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const recipeSnap = await getDoc(doc(db, "recipes", String(recipeId)));
  const recipe = recipeSnap.exists() ? recipeSnap.data() : {};
  const attach = attachPhoto === true && recipe.authorUid === user.uid;
  const record = {
    id, recipeId: String(recipeId), recipeName: String(recipeName || recipe.name || "Recipe"),
    uid: user.uid, username: String(userSnap.data().username || userSnap.data().displayName || "Cook"),
    text: cleanText, createdAt: Date.now(), photoUrl: attach ? String(recipe.photo || "") : ""
  };
  await setDoc(doc(db, "recipeComments", id), record);
  return record;
}
async function listRecipeComments(recipeId) {
  const snap = await getDocs(query(collection(db, "recipeComments"), where("recipeId", "==", String(recipeId))));
  return snap.docs.map(d => ({ ...d.data(), id: d.id })).filter(c => c.takenDown !== true).sort((a,b) => (a.createdAt || 0) - (b.createdAt || 0));
}
async function listCommentsForAdmin(actingUid) {
  await assertAdmin(actingUid);
  const snap = await getDocs(collection(db, "recipeComments"));
  return snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
}
async function takeDownRecipeComment(commentId, actingUid) {
  await assertAdmin(actingUid);
  await updateDoc(doc(db, "recipeComments", String(commentId)), { takenDown: true, takenDownAt: Date.now(), takenDownBy: (auth.currentUser && auth.currentUser.uid) || actingUid });
  return { takenDown: true };
}
/* Views and completions live on the recipe document ({ views, completions }).
   Each signed-in view or completion adds 1 with Firestore increment() so every
   client sees the same shared counts. */
async function incrementRecipeStat(id, field) {
  if (!auth.currentUser || (field !== "views" && field !== "completions")) return false;
  const ref = doc(db, "recipes", String(id));
  await updateDoc(ref, { [field]: increment(1) });
  return true;
}
async function getRecipeStats(id) {
  const snap = await getDoc(doc(db, "recipes", String(id)));
  const data = snap.exists() ? snap.data() : null;
  return {
    completions: (data && Number(data.completions)) || 0,
    views: (data && Number(data.views)) || 0
  };
}
/* ---------- Image upload and completion photos ---------- */
function shrinkImage(dataUrl, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Could not read the photo."));
    img.src = dataUrl;
  });
}
function imageDataUrl(photo) {
  const value = String(photo || "").trim();
  if (/^data:image\/[\w.+-]+;base64,/i.test(value)) return value;
  // Completion photos are stored as Firebase data URLs; accept legacy raw
  // base64 inputs without letting the API transport format affect storage.
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(value)) return `data:image/jpeg;base64,${value}`;
  return value;
}
function safeKey(v) {
  return String(v).replace(/[^A-Za-z0-9_-]/g, "_");
}
function currentWeekKey() {
  const d = new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return date.getUTCFullYear() + "-W" + String(weekNo).padStart(2, "0");
}
async function saveCompletionPhoto({ uid, username, recipeId, recipeName, photo }) {
  if (!uid) throw new Error("Cannot save a completion photo without a user id.");
  if (!photo) throw new Error("No photo to save.");
  const key = safeKey(uid) + "_" + safeKey(recipeId);
  const record = {
    uid: uid,
    username: username || "",
    recipeId: String(recipeId),
    recipeName: recipeName || "",
    completedAt: Date.now()
  };
  const sourcePhoto = imageDataUrl(photo);
  const jpeg = await shrinkImage(sourcePhoto, 1280, 0.5);
  const asset = await uploadImageToCloudinary(jpeg, "completions");
  record.photoUrl = asset.url;
  record.photoCloudinaryId = asset.publicId;
  record.photoProvider = "cloudinary";
  await setDoc(doc(db, "completions", key), record);
  return record;
}

async function uploadImageToCloudinary(image, folder = "recipes") {
  const response = await fetch(CHYVE_API_URL + "/api/upload-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageDataUrl(image), folder })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.secure_url) throw new Error(data.error || "Could not upload this photo.");
  return { url: data.secure_url, publicId: data.public_id || "", bytes: Number(data.bytes) || 0 };
}

/* ---------- Admin tools ---------- */
async function assertAdmin(actingUid) {
  const uid = (auth.currentUser && auth.currentUser.uid) || actingUid;
  if (!uid) throw new Error("Sign in as an admin first.");
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists() || snap.data().admin !== true) throw new Error("Admins only.");
  return uid;
}
// Safe fields only — passwords and private profile data never leave this function.
async function listUsersForAdmin(actingUid) {
  await assertAdmin(actingUid);
  const snap = await getDocs(collection(db, "users"));
  return snap.docs
    .filter(d => d.id.indexOf("__gv_") !== 0)
    .map(d => {
      const u = d.data() || {};
      return {
        uid: u.uid || d.id,
        username: u.username || "",
        displayName: u.displayName || u.username || "",
        email: u.email || "",
        photo: u.photo || "",
        xp: Number(u.xp) || 0,
        streak: Number(u.streak) || 0,
        cooked: Array.isArray(u.completed) ? u.completed.length : 0,
        admin: u.admin === true,
        banned: u.banned === true
      };
    })
    .filter(u => u.username);
}
async function getUserCompletions(targetUid, actingUid) {
  const uid = (auth.currentUser && auth.currentUser.uid) || actingUid;
  if (uid !== targetUid) await assertAdmin(actingUid);
  const snap = await getDocs(query(collection(db, "completions"), where("uid", "==", targetUid)));
  return snap.docs
    .map(d => d.data())
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
}
async function getMyChallengeOptions(uid) {
  if (!uid || !auth.currentUser || auth.currentUser.uid !== uid) throw new Error("Sign in to enter a challenge.");
  const [recipesSnap, completionsSnap] = await Promise.all([
    getDocs(query(collection(db, "recipes"), where("authorUid", "==", uid))),
    getDocs(query(collection(db, "completions"), where("uid", "==", uid)))
  ]);
  const photosByRecipe = new Map();
  completionsSnap.docs.forEach(d => {
    const c = d.data() || {};
    if (c.photoUrl || c.photoData) photosByRecipe.set(String(c.recipeId), {
      photoUrl: c.photoUrl || c.photoData,
      photoCloudinaryId: c.photoCloudinaryId || "",
      photoSource: "completion"
    });
  });
  return recipesSnap.docs.map(d => {
    const recipe = d.data() || {};
    const id = recipe.id || d.id;
    const savedPhoto = photosByRecipe.get(String(id));
    const recipePhoto = recipe.photo ? {
      photoUrl: recipe.photo,
      photoCloudinaryId: recipe.photoCloudinaryId || "",
      photoSource: "recipe"
    } : null;
    const photo = savedPhoto || recipePhoto;
    return recipe.approved === true && photo ? { id: String(id), name: recipe.name || "Recipe", ...photo } : null;
  }).filter(Boolean);
}
async function listChallengeEntries(challengeId) {
  const snap = await getDocs(query(collection(db, "challengeEntries"), where("challengeId", "==", String(challengeId))));
  return snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => (b.votes || 0) - (a.votes || 0) || (a.createdAt || 0) - (b.createdAt || 0));
}
async function getMyChallengeVote(challengeId) {
  if (!auth.currentUser) return null;
  const snap = await getDoc(doc(db, "challengeVotes", safeKey(challengeId) + "_" + safeKey(auth.currentUser.uid)));
  return snap.exists() ? snap.data() : null;
}
async function submitChallengeEntry({ challengeId, weekId, recipeId, username }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in to enter a challenge.");
  if (String(challengeId) !== String(weekId) || String(weekId) !== currentWeekKey()) throw new Error("This challenge week is no longer active.");
  const recipeSnap = await getDoc(doc(db, "recipes", String(recipeId)));
  if (!recipeSnap.exists()) throw new Error("That recipe is no longer available.");
  const recipe = recipeSnap.data() || {};
  if (recipe.authorUid !== user.uid || recipe.approved !== true) throw new Error("Choose one of your approved recipes.");
  const completionSnap = await getDoc(doc(db, "completions", safeKey(user.uid) + "_" + safeKey(recipeId)));
  const completion = completionSnap.exists() ? completionSnap.data() || {} : {};
  let photoUrl = completion.photoUrl || completion.photoData || recipe.photo;
  let photoCloudinaryId = completion.photoUrl || completion.photoData
    ? completion.photoCloudinaryId || ""
    : recipe.photoCloudinaryId || "";
  if (!photoUrl) throw new Error("This recipe has no saved photo.");
  if (!photoCloudinaryId) {
    const asset = await uploadImageToCloudinary(photoUrl, "challenges");
    photoUrl = asset.url;
    photoCloudinaryId = asset.publicId;
    if (completionSnap.exists()) {
      await setDoc(doc(db, "completions", safeKey(user.uid) + "_" + safeKey(recipeId)), {
        photoUrl, photoCloudinaryId, photoProvider: "cloudinary"
      }, { merge: true });
    }
  }
  const entryId = safeKey(challengeId) + "_" + safeKey(user.uid);
  const entryRef = doc(db, "challengeEntries", entryId);
  const entry = { id: entryId, challengeId: String(challengeId), weekId: String(weekId), uid: user.uid, username: String(username || "Cook"), recipeId: String(recipeId), recipeName: String(recipe.name || "Recipe"), photoUrl, photoCloudinaryId, votes: 0, createdAt: Date.now() };
  await runTransaction(db, async tx => {
    const entrySnap = await tx.get(entryRef);
    if (entrySnap.exists()) throw new Error("You already entered this week's challenge.");
    tx.set(entryRef, entry);
  });
  return entry;
}
async function voteChallengeEntry({ challengeId, entryId, weekId }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in to vote.");
  if (String(challengeId) !== String(weekId) || String(weekId) !== currentWeekKey()) throw new Error("Voting for this challenge has closed.");
  const voteRef = doc(db, "challengeVotes", safeKey(challengeId) + "_" + safeKey(user.uid));
  const entryRef = doc(db, "challengeEntries", String(entryId));
  const userRef = doc(db, "users", user.uid);
  return runTransaction(db, async tx => {
    const [voteSnap, entrySnap, userSnap] = await Promise.all([tx.get(voteRef), tx.get(entryRef), tx.get(userRef)]);
    if (voteSnap.exists()) throw new Error("You already voted in this challenge.");
    if (!entrySnap.exists()) throw new Error("This entry is no longer available.");
    const entry = entrySnap.data() || {};
    if (entry.challengeId !== String(challengeId) || entry.uid === user.uid) throw new Error("You can't vote for this entry.");
    if (!userSnap.exists()) throw new Error("Your profile could not be loaded.");
    const profile = userSnap.data() || {};
    const bonus = profile.challengeVoteBonusClaimed !== true;
    const currentWeek = String(weekId || "");
    const currentWeekly = profile.weekId === currentWeek ? (Number(profile.weeklyXp) || 0) : 0;
    tx.set(voteRef, { challengeId: String(challengeId), entryId: String(entryId), uid: user.uid, createdAt: Date.now() });
    tx.update(entryRef, { votes: (Number(entry.votes) || 0) + 1 });
    if (bonus) tx.update(userRef, { xp: (Number(profile.xp) || 0) + 50, weeklyXp: currentWeekly + 50, weekId: currentWeek, challengeVoteBonusClaimed: true });
    return { bonus, xp: bonus ? (Number(profile.xp) || 0) + 50 : Number(profile.xp) || 0, weeklyXp: bonus ? currentWeekly + 50 : currentWeekly };
  });
}
async function awardChallengePlacement({ entryId, xp, weekId }) {
  const entryRef = doc(db, "challengeEntries", String(entryId));
  const initialSnap = await getDoc(entryRef);
  if (!initialSnap.exists()) return { awarded: false };
  const initialEntry = initialSnap.data() || {};
  if (!initialEntry.challengeId || initialEntry.challengeId !== initialEntry.weekId || String(initialEntry.weekId) === String(weekId) || String(weekId) !== currentWeekKey()) return { awarded: false };
  const ranked = await listChallengeEntries(initialEntry.challengeId);
  const place = ranked.findIndex(entry => entry.id === String(entryId)) + 1;
  const payouts = [500, 400, 300, 250, 200, 175, 150, 125, 100, 75];
  if (place < 1 || place > 10 || Number(xp) !== payouts[place - 1]) return { awarded: false };
  return runTransaction(db, async tx => {
    const entrySnap = await tx.get(entryRef);
    if (!entrySnap.exists()) return { awarded: false };
    const entry = entrySnap.data() || {};
    if (entry.placementAwarded || !entry.uid || (Number(entry.votes) || 0) !== (Number(initialEntry.votes) || 0)) return { awarded: false };
    const userRef = doc(db, "users", entry.uid);
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) return { awarded: false };
    const profile = userSnap.data() || {};
    const awardWeekId = String(weekId || "");
    const weeklyXp = profile.weekId === awardWeekId ? (Number(profile.weeklyXp) || 0) : 0;
    tx.update(userRef, { xp: (Number(profile.xp) || 0) + Number(xp), weeklyXp: weeklyXp + Number(xp), weekId: awardWeekId });
    tx.update(entryRef, { placementAwarded: true, placementXp: Number(xp) });
    return { awarded: true, uid: entry.uid, xp: (Number(profile.xp) || 0) + Number(xp), weeklyXp: weeklyXp + Number(xp) };
  });
}
async function awardRecipeCompletionXP({ recipeId, completerUid, awardWeekId }) {
  if (!auth.currentUser || auth.currentUser.uid !== completerUid) throw new Error("Sign in to record this completion.");
  const recipeSnap = await getDoc(doc(db, "recipes", String(recipeId)));
  if (!recipeSnap.exists()) return false;
  const recipe = recipeSnap.data() || {};
  const authorUid = recipe.authorUid;
  if (!authorUid) return false;
  const awardRef = doc(db, "recipeCompletionAwards", safeKey(recipeId) + "_" + safeKey(completerUid));
  const userRef = doc(db, "users", authorUid);
  return runTransaction(db, async tx => {
    const [awardSnap, userSnap] = await Promise.all([tx.get(awardRef), tx.get(userRef)]);
    if (awardSnap.exists() || !userSnap.exists()) return { awarded: false };
    const profile = userSnap.data() || {};
    const weekId = String(awardWeekId || "");
    const weeklyXp = profile.weekId === weekId ? (Number(profile.weeklyXp) || 0) : 0;
    tx.set(awardRef, { recipeId: String(recipeId), completerUid, authorUid, xp: 10, createdAt: Date.now() });
    tx.update(userRef, { xp: (Number(profile.xp) || 0) + 10, weeklyXp: weeklyXp + 10, weekId });
    return { awarded: true, authorUid, xp: (Number(profile.xp) || 0) + 10, weeklyXp: weeklyXp + 10 };
  });
}
// A banned user is hidden everywhere (leaderboards, circles, recipes, comments, profiles).
// The users/{uid} flag is the source of truth; we also mirror it onto the public index card so
// every client sees it without having to read every user doc. Nothing is deleted, so unbanning
// restores the user exactly as they were (circle memberships, recipes, comments, XP).
async function setIndexCardBanned(username, banned) {
  if (!username) return;
  try {
    await setDoc(doc(db, "users", "__gv_index"), { ["u_" + username]: { banned: banned === true } }, { merge: true });
  } catch (e) {
    console.warn("Could not update the public index card:", e);
  }
}
async function banUser(targetUid, actingUid) {
  await assertAdmin(actingUid);
  const ref = doc(db, "users", targetUid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("User not found.");
  if (snap.data().admin === true) throw new Error("Admins can't be banned.");
  await updateDoc(ref, { banned: true, bannedAt: Date.now(), bannedBy: actingUid });
  await setIndexCardBanned(snap.data().username, true);
  return { banned: true };
}
async function unbanUser(targetUid, actingUid) {
  await assertAdmin(actingUid);
  const ref = doc(db, "users", targetUid);
  const snap = await getDoc(ref);
  await updateDoc(ref, { banned: false });
  await setIndexCardBanned(snap.exists() ? snap.data().username : "", false);
  return { banned: false };
}
// Banned users can never log in — admins are immune.
function isBannedData(data) {
  return !!data && data.banned === true && data.admin !== true;
}
async function isUserBanned(uid) {
  if (!uid) return false;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() && isBannedData(snap.data());
}
async function signOutFirebase() {
  try { await signOut(auth); } catch (e) { /* not signed in */ }
}
const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://chyve.app/emailver',
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios4567'
  },
  android: {
    packageName: 'com.example.android4567',
    installApp: true,
    minimumVersion: '12'
  },
  // The domain must be configured in Firebase Hosting and owned by the project.
  linkDomain: 'chyve.app'
};
async function sendVerificationEmail(email){
  const cleanEmail = (email || '').trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!cleanEmail || !emailPattern.test(cleanEmail)){
    throw new Error('A valid email is required before sending a verification code.');
  }
  const result = await apiSendLoginCode(cleanEmail);
  return { email: cleanEmail, token: result.token };
}
async function SignInWithGoogle(){
  try {
    console.log('Starting Google sign-in popup...');
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential && credential.accessToken;
    const user = result.user;
    console.log('Google popup completed successfully.');
    return { user, token, credential, result };
  } catch (error) {
    console.error('Error during sign-in:', error && error.message ? error.message : error);
    throw error;
  }
}
// Base URL of the Chyve backend (website/server). Override by setting
const CHYVE_API_URL = "https://easyserver-tawny.vercel.app"

// The model returns its JSON as text, sometimes wrapped in ```json fences.
function parseCheckResult(raw) {
  if (raw && typeof raw === "object") return raw;
  const text = String(raw || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try { return JSON.parse(text); } catch (e) { /* fall through */ }
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error("Could not read the checker's response.");
}

/* apiCheck(image, recipe, bannerPhoto)
   image:  the uploaded photo as a data URL (or raw base64)
   recipe: a string, or { name, ingredients: [], steps: [] }
   bannerPhoto: the recipe's reference/banner photo as a URL or data URL
   Resolves to { complete: boolean, confidence: number, reason: string }. Throws on failure. */
async function apiCheck(image, recipe, bannerPhoto) {
  // Keep data URLs intact: the server passes these to OpenAI as input_image.image_url.
  const photo = String(image || "").trim();
  if (!photo) throw new Error("No photo provided.");
  const referencePhoto = String(bannerPhoto || "").trim();
  if (!referencePhoto) throw new Error("No recipe banner photo provided.");

  let recipeText = recipe;
  if (recipe && typeof recipe === "object") {
    const ing = (recipe.ingredients || []).map(i => "- " + i).join("\n");
    const steps = (recipe.steps || []).map((s, i) => (i + 1) + ". " + s).join("\n");
    recipeText = "Recipe name: " + (recipe.name || "") + "\n\nIngredients:\n" + ing + "\n\nInstructions:\n" + steps;
  }
  if (!recipeText) throw new Error("No recipe provided.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch(CHYVE_API_URL + "/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe: recipeText, photo: photo, bannerPhoto: referencePhoto }),
      signal: controller.signal
    });
    const data = await response.json();
    const result = parseCheckResult(data.interaction);
    return {
      complete: result.complete === true || result.complete === "true",
      confidence: Number(result.confidence) || 0,
      reason: String(result.reason || "")
    };
    console.log('apiCheck parsed result:', result);
  } finally {
    clearTimeout(timer);
  }
}
/* apiModerateRecipe({ name, ingredients, instructions }, image)
   image: the recipe photo as a data URL (or raw base64)
   Resolves to { appropriate: boolean, category: string, reason: string }. Throws on failure
   (a failure is NOT a rejection, so callers should let the user retry). */
async function apiModerateRecipe(recipe, image) {
  // Keep data URLs intact: the server passes these to OpenAI as input_image.image_url.
  const photo = String(image || "").trim();
  if (!photo) throw new Error("No photo provided.");
  if (!recipe || !recipe.name || !recipe.ingredients || !recipe.instructions) {
    throw new Error("Recipe is incomplete.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch(CHYVE_API_URL + "/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        photo: photo
      }),
      signal: controller.signal
    });
    const data = await response.json();
    const result = parseCheckResult(data.interaction);
    console.log(result)
    return {
      appropriate: result.appropriate === true || result.appropriate === "true",
      category: String(result.category || ""),
      reason: String(result.reason || "")
    };
  } finally {
    clearTimeout(timer);
  }
}
/* apiEstimateMacros(ingredients)
   ingredients: the recipe's ingredient list as text (or an array of lines). ONLY the
   ingredients are sent to the server — no name, steps or photo — so the estimate is
   based solely on what goes into the dish. A "Yield: 4 servings" line inside the
   ingredients is used by the model to work out the per-serving numbers.
   Resolves to per-serving { servings, calories, protein, carbs, fat, saturatedFat,
   fiber, sugar, sodium, cholesterol } (grams, except calories / sodium mg / cholesterol mg).
   Throws on failure. */
async function apiEstimateMacros(ingredients) {
  const text = Array.isArray(ingredients) ? ingredients.join("\n") : String(ingredients || "");
  if (!text.trim()) throw new Error("No ingredients provided.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch(CHYVE_API_URL + "/api/macros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: text.trim() }),
      signal: controller.signal
    });
    const data = await response.json();
    const r = parseCheckResult(data.interaction);
    const num = (v) => { const n = Number(v); return isFinite(n) && n > 0 ? Math.round(n * 10) / 10 : 0; };
    const result = {
      servings: Math.max(1, Math.round(Number(r.servings) || 1)),
      calories: Math.round(num(r.calories)),
      protein: num(r.protein),
      carbs: num(r.carbs),
      fat: num(r.fat),
      saturatedFat: num(r.saturatedFat),
      fiber: num(r.fiber),
      sugar: num(r.sugar),
      sodium: Math.round(num(r.sodium)),
      cholesterol: Math.round(num(r.cholesterol))
    };
    console.log(result)
    if (!result.calories && !result.protein && !result.carbs && !result.fat) {
      throw new Error("The estimate came back empty.");
    }
    return result;
  } finally {
    clearTimeout(timer);
  }
}
/* ---------- 6-digit sign-in code (second step after email + password) ----------
   apiSendLoginCode(email)  -> { token }   emails a fresh code; keep the token for the next call
   apiVerifyLoginCode(email, code, token) -> { verified, expired, error } */
async function apiSendLoginCode(email) {
  const response = await fetch(CHYVE_API_URL + "/api/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: String(email || "").trim().toLowerCase() })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.token) throw new Error(data.error || "Could not send the code.");
  return { token: data.token };
}
async function apiVerifyLoginCode(email, code, token) {
  const response = await fetch(CHYVE_API_URL + "/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: String(email || "").trim().toLowerCase(), code: String(code || "").trim(), token: token })
  });
  const data = await response.json().catch(() => ({}));
  return { verified: data.verified === true, expired: data.expired === true, error: data.error || "" };
}
/* apiSendFeedback({ type, message, username, email })
   type: "idea" | "bug" | "other". The server emails it to the Chyve owner.
   Resolves to true. Throws an Error with a user-readable message on failure. */
async function apiSendFeedback(fb) {
  const response = await fetch(CHYVE_API_URL + "/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: fb && fb.type,
      message: fb && fb.message,
      username: fb && fb.username,
      email: fb && fb.email
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success !== true) throw new Error(data.error || "Could not send your feedback.");
  return true;
}
window.createUser = createUser;
window.getUserData = getUserData;
window.watchUserXP = watchUserXP;
window.editUserData = editUserData;
window.createRecipe = createRecipe;
window.getRecipeData = getRecipeData;
window.addRecipeComment = addRecipeComment;
window.listRecipeComments = listRecipeComments;
window.listCommentsForAdmin = listCommentsForAdmin;
window.takeDownRecipeComment = takeDownRecipeComment;
window.editRecipeData = editRecipeData;
window.listApprovedRecipes = listApprovedRecipes;
window.incrementRecipeStat = incrementRecipeStat;
window.getRecipeStats = getRecipeStats;
window.SignInWithGoogle = SignInWithGoogle;
window.sendVerificationEmail = sendVerificationEmail; 
window.saveCompletionPhoto = saveCompletionPhoto;
window.uploadImageToCloudinary = uploadImageToCloudinary;
window.listUsersForAdmin = listUsersForAdmin;
window.getUserCompletions = getUserCompletions;
window.getMyChallengeOptions = getMyChallengeOptions;
window.listChallengeEntries = listChallengeEntries;
window.getMyChallengeVote = getMyChallengeVote;
window.submitChallengeEntry = submitChallengeEntry;
window.voteChallengeEntry = voteChallengeEntry;
window.awardChallengePlacement = awardChallengePlacement;
window.awardRecipeCompletionXP = awardRecipeCompletionXP;
window.banUser = banUser;
window.unbanUser = unbanUser;
window.isBannedData = isBannedData;
window.isUserBanned = isUserBanned;
window.signOutFirebase = signOutFirebase;
window.apiCheck = apiCheck;
window.apiModerateRecipe = apiModerateRecipe;
window.apiEstimateMacros = apiEstimateMacros;
window.apiSendLoginCode = apiSendLoginCode;
window.apiSendFeedback = apiSendFeedback;
window.apiVerifyLoginCode = apiVerifyLoginCode;
