import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Question } from './types';

export const QuestionPageAPI = {
  async fetchSession(slug: string) {
    const sessionRef = doc(db, 'subtest_sessions', slug);
    const sessionSnap = await getDoc(sessionRef);
    if (!sessionSnap.exists()) return null;
    return sessionSnap.data();
  },

  async saveResults(slug: string, userAnswers: Record<string, string>, score: number) {
    const sessionRef = doc(db, 'subtest_sessions', slug);
    await setDoc(sessionRef, {
      isFinished: true,
      userAnswers,
      score,
      finishedAt: serverTimestamp()
    }, { merge: true });
  }
};
