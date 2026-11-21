import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/src/services/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { CREDIT_POLICY, CREDIT_MULTIPLIER } from '../lib/credits/credit.constants';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null,
  loading: true,
  refreshUser: async () => {},
  refreshProfile: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async (uid: string, currentUser?: User) => {
    setLoadingProfile(true);
    try {
      // Trigger backend initialization so it grants initial/monthly credits if needed
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          await fetch('/api/auth/init', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (initErr) {
          console.error("Backend auth init failed:", initErr);
        }
      }

      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);
      const now = new Date();
      
      if (snap.exists()) {
        const userData = snap.data();
        let updates: any = {};
        let needsUpdate = false;
        
        let newBalance = userData.creditsUnits ?? (CREDIT_POLICY.INITIAL_CREDITS * CREDIT_MULTIPLIER);

        if (userData.dailyUsedUnits === undefined) {
          updates.dailyUsedUnits = 0;
          updates.dailyLimitUnits = CREDIT_POLICY.DAILY_LIMIT * CREDIT_MULTIPLIER;
          updates.creditsUnits = newBalance;
          needsUpdate = true;
        }

        const lastDaily = userData.lastDailyResetAt ? new Date(userData.lastDailyResetAt) : new Date(0);
        if (lastDaily.toDateString() !== now.toDateString()) {
          updates.dailyUsedUnits = 0;
          updates.lastDailyResetAt = now.toISOString();
          needsUpdate = true;
        }

        const lastMonthly = userData.lastMonthlyBonusAt ? new Date(userData.lastMonthlyBonusAt) : new Date(0);
        if (lastMonthly.getMonth() !== now.getMonth() || lastMonthly.getFullYear() !== now.getFullYear()) {
          const bonusUnits = CREDIT_POLICY.MONTHLY_BONUS * CREDIT_MULTIPLIER;
          newBalance += bonusUnits;
          updates.creditsUnits = newBalance;
          updates.monthlyBonusUnits = bonusUnits;
          updates.lastMonthlyBonusAt = now.toISOString();
          needsUpdate = true;
        }

        if (needsUpdate) {
          updates.updatedAt = now.toISOString();
          await updateDoc(docRef, updates);
          setProfile({ ...userData, ...updates });
        } else {
          setProfile(userData);
        }
      } else if (currentUser) {
        // Fallback frontend profile init, though backend should have done it
        const newProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || '',
          onboardingCompleted: false,
          creditsUnits: CREDIT_POLICY.INITIAL_CREDITS * CREDIT_MULTIPLIER,
          monthlyBonusUnits: CREDIT_POLICY.MONTHLY_BONUS * CREDIT_MULTIPLIER,
          dailyUsedUnits: 0,
          dailyLimitUnits: CREDIT_POLICY.DAILY_LIMIT * CREDIT_MULTIPLIER,
          lastMonthlyBonusAt: now.toISOString(),
          lastDailyResetAt: now.toISOString(),
          role: 'free',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser });
      } catch (error) {
        console.error("Manual refresh failed:", error);
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          setUser(currentUser);
          await fetchProfile(currentUser.uid, currentUser);
        } catch (error) {
          console.error("Auth profile fetch failed:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Global redirection logic
  useEffect(() => {
    if (loading || loadingProfile) return;

    const path = location.pathname;
    const isPublicPage = path === '/' || path === '/auth/login' || path.startsWith('/legal') || path === '/about' || path === '/contact';
    const isOnboardingPage = path === '/onboarding';
    
    if (user) {
      const hasCompletedOnboarding = profile?.onboardingCompleted === true || (profile && profile.displayName && profile.dreamUniversity && profile.onboardingCompleted !== false);
      console.log("Current User State:", { user, profile, hasCompletedOnboarding, loading, loadingProfile, path });
      
      if (!hasCompletedOnboarding) {
        // If incomplete profile -> let them complete onboarding first
        if (!isOnboardingPage) {
          console.log("Redirecting to... /onboarding (needs profile)");
          navigate('/onboarding', { replace: true });
        }
      } else {
        // User is fully authenticated and onboarded
        const isDashboardEntrancePage = path === '/auth/login' || isOnboardingPage;
        if (isDashboardEntrancePage) {
          console.log("Redirecting to... /dashboard/overview (completed)");
          navigate('/dashboard/overview', { replace: true });
        }
      }
    } else if (!isPublicPage) {
      console.log("Redirecting to... /auth/login (unauthenticated)");
      navigate('/auth/login', { replace: true });
    }
  }, [user, profile, loading, loadingProfile, location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
