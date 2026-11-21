import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Database, Trophy, Compass, Bookmark, TrendingUp, Settings, LogOut, ChevronRight, ChevronLeft, Zap, LayoutDashboard, MessageSquare, Library, GraduationCap, BookOpen, Star, PenTool, Heart, Flame } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/src/services/firebase';
import { LogoIcon } from './shared/LogoIcon';

interface SidebarItem {
  id: string;
  name: string;
  icon: any;
  path: string;
}

const mainNavItems: SidebarItem[] = [
  { id: 'overview', name: 'Ringkasan', icon: LayoutDashboard, path: '/dashboard/overview' },
  { id: 'chat', name: 'Chat AI', icon: MessageSquare, path: '/chat' },
  { id: 'studipath', name: 'Study Path', icon: Compass, path: '/dashboard/studipath' },
  { id: 'playlist', name: 'Playlist Soal', icon: Library, path: '/playlist/explore' },
  { id: 'ptnpedia', name: 'PTN Pedia', icon: GraduationCap, path: '/ptnpedia' },
  { id: 'bank-soal', name: 'Bank Soal', icon: BookOpen, path: '/dashboard/bank-soal' },
];

const habitItems: SidebarItem[] = [
  { id: 'progress', name: 'Progress', icon: TrendingUp, path: '/fiturambis/progress' },
  { id: 'vocab', name: 'Vocab', icon: Star, path: '/fiturambis/vocab' },
  { id: 'eyd-test', name: 'EYD Habit', icon: PenTool, path: '/fiturambis/eyd-test' },
  { id: 'wishlist', name: 'Wishlist', icon: Heart, path: '/fiturambis/wishlist' },
];

export default function DashboardSidebar() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard/overview') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 bg-white/80 dark:bg-[#080B1D]/80 backdrop-blur-md border-r border-slate-200 dark:border-white/5 transition-all duration-300 ease-in-out z-50 shrink-0 relative",
        isExpanded ? "w-[260px]" : "w-[88px]"
      )}
    >
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Tutup sidebar" : "Buka sidebar"}
        className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-white shadow-sm hover:scale-110 transition-all z-50"
      >
        {isExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Sidebar Header */}
      <div className="p-6 flex items-center h-20 shrink-0">
        <Link 
          to="/" 
          aria-label="Go to home"
          className="flex items-center gap-4 shrink-0 overflow-hidden text-clip focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0 hover:scale-105 transition-transform cursor-pointer">
            <LogoIcon className="w-6 h-6 text-white" />
          </div>
          <span 
            className={cn(
              "text-xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap transition-all duration-300",
              isExpanded ? "opacity-100" : "opacity-0 w-0 -translate-x-2"
            )}
          >
            SNBT AI
          </span>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 space-y-8 custom-scrollbar">
        {/* Main Menu */}
        <div className="w-[220px]">
          <div className="h-6 mb-2 flex items-center">
             <p 
               className={cn(
                 "px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 whitespace-nowrap transition-all duration-300",
                 isExpanded ? "opacity-100 delay-100" : "opacity-0 invisible"
               )}
             >
               Utama
             </p>
          </div>
          <div className="space-y-1.5 w-full">
            {mainNavItems.map((item) => {
              const active = isActivePath(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl text-sm font-bold transition-all duration-200 relative group w-full",
                    active 
                      ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400" 
                      : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                  title={!isExpanded ? item.name : undefined}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0 transition-transform", active ? "text-indigo-600 dark:text-indigo-400" : "group-hover:scale-110")} />
                  
                  <span 
                    className={cn(
                      "whitespace-nowrap transition-all duration-300 pointer-events-none",
                      isExpanded ? "opacity-100 flex-1 delay-100" : "opacity-0 w-0 -translate-x-2"
                    )}
                  >
                    {item.name}
                  </span>
                  
                  {active && isExpanded && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Ambis Habit Group */}
        <div className="w-[220px]">
          <div className="h-6 mb-2 flex items-center">
             <p 
               className={cn(
                 "px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 whitespace-nowrap transition-all duration-300",
                 isExpanded ? "opacity-100 delay-100" : "opacity-0 invisible"
               )}
             >
               Produktivitas
             </p>
          </div>
          <div className="space-y-1.5 w-full">
            {habitItems.map((item) => {
              const active = isActivePath(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl text-sm font-bold transition-all duration-200 relative group w-full",
                    active 
                      ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400" 
                      : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                  title={!isExpanded ? item.name : undefined}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0 transition-transform", active ? "text-indigo-600 dark:text-indigo-400" : "group-hover:scale-110")} />
                  
                  <span 
                    className={cn(
                      "whitespace-nowrap transition-all duration-300 pointer-events-none",
                      isExpanded ? "opacity-100 flex-1 delay-100" : "opacity-0 w-0 -translate-x-2"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Area Footer */}
      <div 
        className="p-4 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center overflow-hidden shrink-0"
      >
        <div className={cn(
          "flex items-center gap-4 w-[220px] transition-all group overflow-hidden", 
          isExpanded ? "cursor-pointer rounded-xl p-2 hover:bg-white dark:hover:bg-white/5" : ""
        )}>
          <Link to="/dashboard/profile" className="shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-indigo-500/50 overflow-hidden transition-all shrink-0">
              {profile?.photoBase64 || user?.photoURL ? (
                <img src={profile?.photoBase64 || user?.photoURL || ''} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold overflow-hidden">
                  {profile?.displayName?.charAt(0) || user?.displayName?.charAt(0) || 'P'}
                </div>
              )}
            </div>
          </Link>
          
          <div 
            className={cn(
               "flex-1 min-w-0 transition-all duration-300",
               isExpanded ? "opacity-100 delay-100" : "opacity-0 w-0"
            )}
          >
            <Link to="/dashboard/profile">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{profile?.displayName || user?.displayName || 'Pejuang SNBT'}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400">Target Belajar</p>
            </Link>
          </div>
          
          <div 
            className={cn(
               "shrink-0 transition-opacity duration-300",
               isExpanded ? "opacity-100 delay-100" : "opacity-0 pointer-events-none w-0"
            )}
          >
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
