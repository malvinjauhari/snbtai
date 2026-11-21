import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function LoginPage() {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!accepted || loading) return;
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/onboarding');
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05),transparent_50%)]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-3xl mx-auto mb-8 shadow-[0_0_30px_rgba(37,99,235,0.4)]">S</div>
        <h1 className="text-3xl font-bold mb-2">Selamat Datang</h1>
        <p className="text-slate-400 mb-10">Gas login buat lanjutin perjuangan lu!</p>
        
        <div className="space-y-6">
          <button
            onClick={handleLogin}
            disabled={!accepted}
            className="w-full premium-button flex items-center justify-center gap-3 py-4 text-lg"
          >
            <LogIn className="w-5 h-5" />
            Lanjut pakai Google
          </button>
          
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-left text-sm">
            <input 
              type="checkbox" 
              id="terms" 
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 accent-blue-500"
            />
            <label htmlFor="terms" className="text-slate-400 cursor-pointer">
              Gue setuju sama <span className="text-blue-400 hover:underline">Syarat & Ketentuan</span> dan <span className="text-blue-400 hover:underline">Kebijakan Privasi</span> SNBT AI. Semangat belajarnya, coy!
            </label>
          </div>
        </div>
        
        <p className="mt-12 text-slate-500 text-xs uppercase tracking-widest">Premium EdTech Experience</p>
      </motion.div>
    </div>
  );
}
