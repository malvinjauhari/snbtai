import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  MessageSquare,
  Sparkles,
  User,
  Library,
  ChevronDown,
  BarChart3,
  Star,
  PenTool,
  Heart,
  Flame,
  Home
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth, db } from '@/src/services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useProgress } from '@/src/context/ProgressContext';
import AchievementOverlay from '@/src/components/AchievementOverlay';
import { getBadge, BadgeStyle } from '@/src/lib/badgeUtils';

import Profile from './Profile';
import PTNPediaView from './PTNPedia';
import Overview from '@/src/components/dashboard/Overview/index';
import BankSoal from '@/src/components/dashboard/BankSoal/index';
import StudiPathView from '@/src/components/dashboard/StudiPath';

import { useAuth } from '@/src/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { section: sectionParam } = useParams();
  const section = sectionParam || 'overview';
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [unlockedBadge, setUnlockedBadge] = useState<BadgeStyle | null>(null);
  const [isAmbisHabitOpen, setIsAmbisHabitOpen] = useState(false);
  const { stats } = useProgress();

  useEffect(() => {
    if (!user) return;
    
    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setUserProfile(snap.data());
      }
    }, (error) => {
      console.error("Error listening to user profile:", error);
    });
    return () => unsubscribe();
  }, [user, navigate]);

  useEffect(() => {
    if (stats.completedQuestions > 0) {
      const currentBadge = getBadge(stats.completedQuestions);
      const savedLevel = localStorage.getItem('pejuang_last_level');
      if (savedLevel && savedLevel !== currentBadge.level) {
        setUnlockedBadge(currentBadge);
      }
      localStorage.setItem('pejuang_last_level', currentBadge.level);
    }
  }, [stats.completedQuestions]);

  const renderSection = () => {
    switch (section) {
      case 'overview': return <Overview profile={userProfile} />;
      case 'ptnpedia': return <PTNPediaView />;
      case 'bank-soal': return <BankSoal />;
      case 'profile': return <Profile />;
      case 'studipath': return <StudiPathView />;
      default: return <Overview profile={userProfile} />;
    }
  };

  return (
    <>
      <div className="min-h-full">
        {renderSection()}
      </div>
      <AchievementOverlay badge={unlockedBadge} onClose={() => setUnlockedBadge(null)} />
    </>
  );
}
