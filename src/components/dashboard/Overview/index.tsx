import { useState, useEffect } from 'react';
import { auth } from '@/src/services/firebase';
import { useProgress } from '@/src/context/ProgressContext';
import { getBadge } from '@/src/lib/badgeUtils';
import { OverviewAPI } from './api';
import { Session, OverviewProps } from './types';
import { StudentCard } from './components/StudentCard';
import { TargetAmbis } from './components/TargetAmbis';
import { StatsMetrics } from './components/StatsMetrics';
import { RecentHistory } from './components/RecentHistory';
import { StudiPathWidget } from './components/StudiPathWidget';

export default function Overview({ profile }: OverviewProps) {
  const { stats } = useProgress();
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const badgeStyle = getBadge(stats.completedQuestions);

  useEffect(() => {
    const fetchRecent = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingSessions(false);
        return;
      }
      try {
        const sessions = await OverviewAPI.fetchRecentSessions(user.uid);
        setRecentSessions(sessions);
      } catch (error) {
        // Error handled in API
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 md:space-y-6 pt-2 md:pt-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column (2/3 width on desktop) */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
          <StudentCard profile={profile} badgeStyle={badgeStyle} />
          <TargetAmbis profile={profile} />
          <StudiPathWidget />
        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="xl:col-span-1 space-y-6 flex flex-col">
          <StatsMetrics stats={stats} />
        </div>
      </div>

      <RecentHistory loading={loadingSessions} sessions={recentSessions} />
    </div>
  );
}
