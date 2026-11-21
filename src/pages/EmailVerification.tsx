import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '@/src/services/firebase';
import { Mail, CheckCircle2, Loader2, ArrowRight, RefreshCw, LogOut } from 'lucide-react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useAuth } from '@/src/context/AuthContext';

export default function EmailVerification() {
  const { refreshUser, user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    if (user.emailVerified) {
      setIsSuccess(true);
      return;
    }

    // Polling active verification status
    const interval = setInterval(async () => {
      try {
        await refreshUser();
        // Redirection will be handled globally by AuthContext when user updates
      } catch (err) {
        console.error("Error polling verification status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, refreshUser]);

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    
    setResending(true);
    setError(null);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengirim email verifikasi.");
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth/login');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <div className="p-8 md:p-12 text-center space-y-8">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
                  <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full shadow-lg shadow-indigo-500/30">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white tracking-tight">Cek Email Lu!</h2>
                  <p className="text-slate-400 font-medium">
                    Kita udah kirim link verifikasi ke <span className="text-indigo-400 font-bold">{auth.currentUser?.email}</span>. Klik linknya buat lanjut berjuang.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <div className="flex items-center justify-center gap-3 py-4 px-6 bg-white/5 rounded-2xl border border-white/10 text-slate-300">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                    <span className="text-sm font-semibold tracking-wide uppercase italic">Menunggu Verifikasi...</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleResend}
                      disabled={countdown > 0 || resending}
                      className="flex items-center justify-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                    >
                      {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      {countdown > 0 ? `Kirim ulang dalam ${countdown}s` : "Belum dapet email? Kirim ulang"}
                    </button>
                    
                    {error && (
                      <p className="text-xs text-rose-400 font-medium">{error}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-4"
              >
                <div className="mx-auto w-24 h-24 flex items-center justify-center bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white tracking-tight">Akun Terverifikasi!</h2>
                  <p className="text-slate-400 font-medium">
                    Mantap! Email lu udah sah. Siap-siap kita arahin ke Dashboard...
                  </p>
                </div>

                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5 }}
                  className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />

                <button
                  onClick={() => navigate('/dashboard/overview')}
                  className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-black py-4 rounded-2xl hover:scale-[1.02] transition-all group"
                >
                  Gas Belajar Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )
            }
          </AnimatePresence>
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
          <span>SNBT AI SECURITY</span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-3 h-3" /> Keluar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
