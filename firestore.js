import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where, increment, updateDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
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
    admin: false
  };
  await setDoc(doc(db, "users", uid), newData);
  return { uid: uid, data: newData };
}
async function editUserData(uid, newData) {
  const payload = { ...(newData || {}) };
  delete payload.admin;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) payload.admin = false;
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
    throw new Error('A valid email is required before sending a verification link.');
  }

  console.log('Preparing to send verification email to:', cleanEmail);
  try{
  await sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
  console.log("sent successfully");
  }catch(e){
    console.error('Error sending verification email:', e);
  }
  return { email: cleanEmail };
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
const CHYVE_API_URL = "https://chyvedomain.vercel.app"

// The model returns its JSON as text, sometimes wrapped in ```json fences.
function parseCheckResult(raw) {
  if (raw && typeof raw === "object") return raw;
  const text = String(raw || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try { return JSON.parse(text); } catch (e) { /* fall through */ }
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error("Could not read the checker's response.");
}

/* apiCheck(image, recipe)
   image:  the uploaded photo as a data URL (or raw base64)
   recipe: a string, or { name, ingredients: [], steps: [] }
   Resolves to { complete: boolean, confidence: number, reason: string }. Throws on failure. */
async function apiCheck(image, recipe) {
  const photo = String(image || "").replace(/^data:[^;]+;base64,/, "");
  if (!photo) throw new Error("No photo provided.");

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
      body: JSON.stringify({ recipe: recipeText, photo: photo }),
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
  const photo = String(image || "").replace(/^data:[^;]+;base64,/, "");
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
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 120000);
const response = await fetch(CHYVE_API_URL + "/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      signal: controller.signal
    });
    const data = await response.json();
    const result = parseCheckResult(data.interaction);
    console.log('apiCheck parsed result:', result);
window.createUser = createUser;
window.getUserData = getUserData;
window.editUserData = editUserData;
window.createRecipe = createRecipe;
window.getRecipeData = getRecipeData;
window.editRecipeData = editRecipeData;
window.listApprovedRecipes = listApprovedRecipes;
window.incrementRecipeStat = incrementRecipeStat;
window.getRecipeStats = getRecipeStats;
window.SignInWithGoogle = SignInWithGoogle;
window.sendVerificationEmail = sendVerificationEmail; 
window.apiCheck = apiCheck;
window.apiModerateRecipe = apiModerateRecipe;
window.apiEstimateMacros = apiEstimateMacros;
