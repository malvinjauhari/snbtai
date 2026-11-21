import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, LayoutDashboard, Database, GraduationCap, Library } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const mobileNavItems = [
  { name: 'Beranda', path: '/', icon: Home },
  { name: 'Chat AI', path: '/chat', icon: MessageSquare },
  { name: 'Playlist', path: '/playlist/explore', icon: Library, prominent: true },
  { name: 'Dashboard', path: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'Bank Soal', path: '/dashboard/bank-soal', icon: Database },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md md:hidden">
      <div className="bg-white/10 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-2 px-4 shadow-2xl flex items-center justify-between">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          if (item.prominent) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -top-8 flex flex-col items-center gap-1 group"
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 scale-110",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-indigo-600/40" 
                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-white/20 dark:border-white/10"
                )}>
                  <Icon className="w-8 h-8" />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors mt-2",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1.5 p-2 px-3 rounded-2xl transition-all relative group"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-200"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-tighter transition-colors",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"
              )}>
                {item.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
