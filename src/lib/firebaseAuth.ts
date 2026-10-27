import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider configured with Google Cloud Platform scope for Vertex AI
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/cloud-platform');

export interface GoogleOAuthResult {
  user: User;
  accessToken: string;
  projectId: string;
}

/**
 * Trigger official Google Sign-In popup with Google Cloud Platform scope
 * Returns OAuth Access Token for direct Vertex AI API calls without API Key
 */
export async function signInWithGoogleOAuth(): Promise<GoogleOAuthResult> {
  const result = await signInWithPopup(auth, googleProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  
  if (!credential?.accessToken) {
    throw new Error('Gagal mendapatkan OAuth Access Token dari akun Google.');
  }

  return {
    user: result.user,
    accessToken: credential.accessToken,
    projectId: firebaseConfig.projectId || 'gen-lang-client-0622433243'
  };
}

export async function signOutGoogle(): Promise<void> {
  await signOut(auth);
}

export { firebaseConfig };
