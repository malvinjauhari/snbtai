import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { SubtestSession } from './types';

export const BankSoalAPI = {
  async fetchSessions(userId: string): Promise<SubtestSession[]> {
    try {
      const q = query(
        collection(db, 'subtest_sessions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubtestSession));
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  }
};
