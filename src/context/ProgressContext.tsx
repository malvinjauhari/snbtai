import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { db, auth } from '@/src/services/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface ProgressStats {
  totalQuestions: number;
  completedQuestions: number;
  streak: number;
  avgScore: number;
  materiPercentage: number;
}

interface ProgressContextType {
  stats: ProgressStats;
  refreshStats: () => Promise<void>;
  loading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<ProgressStats>({
    totalQuestions: 2410, // Mock baseline
    completedQuestions: 0,
    streak: 0,
    avgScore: 0,
    materiPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  const refreshStats = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch profile for streak
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      // Fetch completed sessions to count questions
      const sessionsQuery = query(
        collection(db, 'subtest_sessions'),
        where('userId', '==', user.uid)
      );
      const sessionsSnap = await getDocs(sessionsQuery);
      
      let completed = 0;
      sessionsSnap.forEach(doc => {
        const data = doc.data();
        if (data.isFinished) {
          completed += (data.questions?.length || 0);
        }
      });

      // Fetch materi progress
      const progressDoc = await getDoc(doc(db, `users/${user.uid}/progress/materi_snbt`));
      const materiPercentage = progressDoc.exists() ? progressDoc.data().percentage : 0;

      setStats(prev => ({
        ...prev,
        completedQuestions: completed,
        streak: userDoc.data()?.streak || 0,
        materiPercentage
      }));
    } catch (error) {
      console.error("Error refreshing stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        refreshStats();
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [refreshStats]);

  return (
    <ProgressContext.Provider value={{ stats, refreshStats, loading }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
};
