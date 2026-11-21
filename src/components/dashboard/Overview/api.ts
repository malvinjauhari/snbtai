import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Session } from './types';

export const OverviewAPI = {
  async fetchRecentSessions(userId: string): Promise<Session[]> {
    try {
      const q = query(
        collection(db, 'subtest_sessions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
    } catch (error) {
      console.error("Error fetching recent sessions:", error);
      throw error;
    }
  }
};
