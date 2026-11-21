import { motion } from 'motion/react';
import { Home, MessageSquare, LayoutDashboard, Database, Trophy, Compass, User, Library, GraduationCap, BookOpen, Grid } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';

const items = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Dasbor', path: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'Chat AI', path: '/chat', icon: MessageSquare },
  { name: 'Fitur', path: '/fitur', icon: Grid },
  { name: 'Profil', path: '/dashboard/profile', icon: User },
];

export default function FloatingNavbar() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/dashboard/profile') return location.pathname === '/dashboard/profile';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm pb-[env(safe-area-inset-bottom)]">
      <div className="bg-white/90 dark:bg-[#050716]/90 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-[2rem] p-1.5 shadow-2xl flex items-center justify-between gap-1">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300",
                active 
                  ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 -translate-y-1" 
                  : "text-slate-400 hover:text-indigo-600 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", active ? "scale-110" : "")} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
                {item.name}
              </span>
              {active && (
                <motion.div 
                  layoutId="mobile-active-glitter"
                  className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
