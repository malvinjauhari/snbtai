import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

function loadServiceAccount(): admin.ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.private_key === 'string') {
      // Env vars often keep escaped newlines, which breaks signing.
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed as admin.ServiceAccount;
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', error);
    return null;
  }
}

// Initialize admin app if not already initialized
if (!admin.apps.length) {
  const serviceAccount = loadServiceAccount();

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.projectId || firebaseConfig.projectId,
    });
  } else if (firebaseConfig.projectId) {
    admin.initializeApp({
      projectId: firebaseConfig.projectId
    });
  } else {
    admin.initializeApp();
  }
}

export const adminDb = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(admin.app(), firebaseConfig.firestoreDatabaseId)
  : admin.firestore();
export const adminAuth = admin.auth();
