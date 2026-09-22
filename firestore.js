import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
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
const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://chyve.app/verify-email',
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
  linkDomain: 'grapevine.firebase.com'
};
async function sendVerificationEmail(email){
  const cleanEmail = (email || '').trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!cleanEmail || !emailPattern.test(cleanEmail)){
    throw new Error('A valid email is required before sending a verification link.');
  }

  console.log('Preparing to send verification email to:', cleanEmail);
  await sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
  return { email: cleanEmail };
}
function SignInWithGoogle(){
  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token to access Google APIs if needed.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential && credential.accessToken;

      // The signed-in user info
      const user = result.user;
      window.location.href = "localhost:8000;"
      return { user, token, credential, result };
    })
    .catch((error) => {
      // Handle authentication failures here
      console.error("Error during sign-in:", error.message);
      throw error;
    });
}
window.createUser = createUser;
window.getUserData = getUserData;
window.editUserData = editUserData;
window.createRecipe = createRecipe;
window.getRecipeData = getRecipeData;
window.editRecipeData = editRecipeData;
window.listApprovedRecipes = listApprovedRecipes;
window.SignInWithGoogle = SignInWithGoogle;
window.sendVerificationEmail = sendVerificationEmail; 
