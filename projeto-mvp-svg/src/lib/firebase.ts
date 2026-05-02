import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Test connection on boot
async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export const loginWithGoogle = () => {
  console.log("Iniciando login com Google popup...");
  return signInWithPopup(auth, googleProvider).catch((error) => {
    console.error("Erro detalhado do Firebase:", error);
    if (error.code === 'auth/unauthorized-domain') {
      alert("Domínio não autorizado. Adicione " + window.location.hostname + " na lista de 'Authorized Domains' no console do Firebase Auth.");
    } else if (error.code === 'auth/popup-blocked') {
      alert("O popup de login foi bloqueado pelo seu navegador. Por favor, permita popups para este site.");
    } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      // Ignore user-initiated cancellations or internally cancelled requests
      console.log("Login cancelado pelo usuário ou sistema.");
    } else {
      alert("Erro ao entrar: " + (error.message || error.code));
    }
    throw error;
  });
};

export const logout = () => {
  return signOut(auth);
};
