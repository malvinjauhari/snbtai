import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/src/services/firebase';
import { Rocket, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // We don't need to navigate here, AuthProvider will detect the user 
      // change and redirect to onboarding or dashboard
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // AuthProvider now handles global redirection based on auth state and onboarding status
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-indigo pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        className="w-full max-w-md premium-card rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center space-y-6 relative z-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-600/20">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Selamat Datang, Pejuang!
            </h2>
            <p className="text-slate-400 mt-2 font-medium">
              Bergabunglah dengan barisan pejuang elit. Siap menghadapi tantangan?
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
              {loading ? "Menghubungkan..." : "Masuk dengan Google"}
            </button>
          </div>
        </div>

        {/* Decorative corner icon */}
        <ShieldCheck className="absolute bottom-[-20px] right-[-20px] w-24 h-24 text-slate-800 opacity-20 -z-10 rotate-12" />
      </motion.div>
    </div>
  );
}
