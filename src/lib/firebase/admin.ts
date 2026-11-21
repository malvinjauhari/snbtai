import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

// Initialize admin app if not already initialized
if (!admin.apps.length) {
  if (firebaseConfig.projectId) {
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
