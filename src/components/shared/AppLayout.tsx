import { ReactNode } from 'react';
import DashboardSidebar from '../DashboardSidebar';
import FloatingNavbar from '../FloatingNavbar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Settings, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';

import { LogoIcon } from './LogoIcon';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { theme } = useTheme();
  const { user, profile } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('overview')) return 'Ringkasan';
    if (path.includes('chat')) return 'Chat AI';
    if (path.includes('playlist')) return 'Playlist Soal';
    if (path.includes('bank-soal')) return 'Bank Soal';
    if (path.includes('ptnpedia')) return 'PTN Pedia';
    if (path.includes('student-levels')) return 'Level Explorer';
    if (path.includes('fitur')) return 'Fitur Unggulan';
    if (path.includes('profile')) return 'Profil Saya';
    return 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-transparent transition-colors duration-500 overflow-hidden">
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Contextual Header */}
        <header className="h-14 md:h-16 flex items-center justify-between px-6 md:px-10 shrink-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-slate-200 dark:border-white/5 z-40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <LogoIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 font-bold">
            <div className="lg:hidden w-10 h-10 rounded-full border border-indigo-500/30 overflow-hidden ml-2 shadow-inner">
               {profile?.photoBase64 || user?.photoURL ? (
                 <img src={profile?.photoBase64 || user?.photoURL} alt="User" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-full h-full p-2 bg-slate-200 dark:bg-slate-800 text-slate-500" />
               )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full pb-[calc(100px+env(safe-area-inset-bottom))] md:pb-10"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Floating Nav */}
      <FloatingNavbar />
    </div>
  );
}
