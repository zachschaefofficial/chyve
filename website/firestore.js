import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where, increment } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyBA3f2xD4Tw8IDGzUZVGJOLSIkXdGTTt1I",
  authDomain: "chyve.app",
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
    uid: uid
  };
  await setDoc(doc(db, "users", uid), newData);
  return { uid: uid, data: newData };
}
async function editUserData(uid, newData) {
  await setDoc(doc(db, "users", uid), newData, { merge: true });
  return {data: newData};
}
async function getUserData(uid){
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return { data: docSnap.data() };
}
async function createRecipe(data) {
  const id = (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const newData = {
    ...data,
    id: id,
    approved: data.approved === true
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
  await setDoc(doc(db, "recipes", id), newData, { merge: true });
  return { data: newData };
}
async function getRecipeData(id){
  const docRef = doc(db, "recipes", id);
  const docSnap = await getDoc(docRef);
  return { data: docSnap.data() };
}
/* Completion counts live in dishStats/{dishId}.completions.
   Keyed by dish id, so it works for built-in dishes and community recipes. */
async function incrementCompletions(dishId) {
  await setDoc(doc(db, "dishStats", String(dishId)), { completions: increment(1) }, { merge: true });
}
async function getCompletions(dishId) {
  const snap = await getDoc(doc(db, "dishStats", String(dishId)));
  const data = snap.exists() ? snap.data() : null;
  return (data && data.completions) || 0;
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
// window.CHYVE_API_URL before this script loads (e.g. in index.html).
const CHYVE_API_URL = window.CHYVE_API_URL || "http://localhost:3000";

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
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch("http://localhost:3000/api/check", {
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
  const timer = setTimeout(() => controller.abort(), 60000);
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
    if (!response.ok) throw new Error("Moderation request failed (" + response.status + ")");
    const data = await response.json();
    const result = parseCheckResult(data.interaction);
    return {
      appropriate: result.appropriate === true || result.appropriate === "true",
      category: String(result.category || ""),
      reason: String(result.reason || "")
    };
  } finally {
    clearTimeout(timer);
  }
}
window.createUser = createUser;
window.getUserData = getUserData;
window.editUserData = editUserData;
window.createRecipe = createRecipe;
window.getRecipeData = getRecipeData;
window.editRecipeData = editRecipeData;
window.listApprovedRecipes = listApprovedRecipes;
window.incrementCompletions = incrementCompletions;
window.getCompletions = getCompletions;
window.SignInWithGoogle = SignInWithGoogle;
window.sendVerificationEmail = sendVerificationEmail; 
window.apiCheck = apiCheck;
window.apiModerateRecipe = apiModerateRecipe;