import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Home, MessageSquare, LayoutDashboard, Database, Sun, Moon, LogOut, User, Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth } from '@/src/services/firebase';
import { signOut } from 'firebase/auth';
import { useTheme } from '@/src/context/ThemeContext';
import { useAuth } from '@/src/context/AuthContext';
import { LogoIcon } from './shared/LogoIcon';
import { CreditMiniBadge } from './credits/CreditMiniBadge';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Chat AI', path: '/chat', icon: MessageSquare },
  { name: 'Dashboard', path: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'Bank Soal', path: '/dashboard/bank-soal', icon: Database },
];

export default function Navbar() {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
    <header className={cn(
      "fixed top-0 left-0 right-0 z-[110] h-14 md:h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-300",
      isScrolled || isMobileMenuOpen
        ? "bg-white/90 dark:bg-[#080B1D]/90 backdrop-blur-md border-b border-slate-200/50 dark:border-white/10 shadow-sm"
        : "bg-transparent border-transparent"
    )}>
      {/* Left: Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <LogoIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
        <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          SNBT AI
        </span>
      </Link>

      {/* Middle: Desktop Nav */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const active = isActivePath(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all relative group",
                active 
                  ? "text-indigo-600 dark:text-white font-semibold" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <span>{item.name}</span>
              {active && (
                <motion.div 
                  layoutId="nav-active-pill"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? "Tema terang" : "Tema gelap"}
          className="p-2.5 text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10">
            <div className="hidden md:block">
              <CreditMiniBadge />
            </div>
            <Link to="/dashboard/profile" className="flex items-center gap-2 group p-0.5 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-white/5 transition-all">
              <div className="w-8 h-8 rounded-full border border-indigo-500/30 overflow-hidden shrink-0">
                {profile?.photoBase64 || user.photoURL ? (
                  <img src={profile?.photoBase64 || user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            </Link>
          </div>
        ) : (
          <Link
            to="/auth/login"
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
          >
            <span>Masuk</span>
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
          className="md:hidden p-2 text-slate-500 ml-1"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-[100] pt-16 md:pt-20 pb-6 px-6 bg-white dark:bg-slate-950 flex flex-col md:hidden overflow-y-auto"
        >
          <div className="flex-1 space-y-2 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl text-lg font-bold transition-all",
                  isActivePath(item.path)
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </div>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </Link>
            ))}
          </div>
          
          {user && (
            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-white/5 rounded-2xl">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Kredit Latihan</span>
                <div className="scale-110 origin-right">
                  <CreditMiniBadge />
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 p-4 w-full bg-rose-500/10 text-rose-500 rounded-2xl font-bold"
              >
                <LogOut className="w-5 h-5" />
                Keluar Sesi
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
