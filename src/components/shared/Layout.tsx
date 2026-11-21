import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, MessageSquare, BookOpen, User, Menu, X, LogOut } from "lucide-react";

export default function Layout() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/30">
      {/* Floating Navbar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`glass-panel rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "py-2 bg-white/10" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-bold text-lg">S</span>
            </div>
            <span className="font-bold tracking-tight text-white/90 hidden sm:block">SNBT AI</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/chat" icon={<MessageSquare size={18} />} active={location.pathname === "/chat"}>Chat</NavLink>
            <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} active={location.pathname.startsWith("/dashboard")}>Dashboard</NavLink>
            <NavLink to="/onboarding" icon={<User size={18} />} active={location.pathname === "/onboarding"} hideText>Profile</NavLink>
          </div>
        </motion.nav>
      </div>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
  hideText?: boolean;
}

function NavLink({ to, icon, active, children, hideText }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 group ${
        active ? "text-white" : "text-white/60 hover:text-white/90 hover:bg-white/5"
      }`}
    >
      {active && (
        <motion.div
          layoutId="nav-bg"
          className="absolute inset-0 bg-white/10 rounded-full border border-white/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      {!hideText && <span className="relative z-10 text-sm font-medium hidden md:block">{children}</span>}
    </Link>
  );
}
