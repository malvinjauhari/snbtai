import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Scale, ArrowUpRight, HelpCircle } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-[#050716] py-16 px-6 md:px-12 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Left column: Brand and statement */}
        <div className="md:col-span-5 space-y-4">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <span className="font-bold text-white text-base">S</span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              SNBT AI
            </span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            Platform edukasi bertenaga AI termutakhir untuk membantu calon mahasiswa menaklukkan ujian SNBT dengan pembelajaran adaptif bimbingan step-by-step.
          </p>
        </div>

        {/* Middle columns: Navigation */}
        <div className="md:col-span-4 col-span-1 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Legalitas</h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  to="/legal/privacy" 
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors group"
                >
                  <Shield className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/legal/terms" 
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors group"
                >
                  <Scale className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Bantuan</h4>
            <ul className="space-y-2.5">
              <li>
                <a 
                  href="mailto:support@snbtai.com" 
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors group"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors" />
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column: Interactive support box */}
        <div className="md:col-span-3 space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 shadow-sm space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
              SNBT Pro
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Butuh materi premium & analisis IRT mendalam?
            </p>
            <Link 
              to="/auth/login" 
              className="inline-flex w-full items-center justify-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Mulai Belajar Sekarang <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
          &copy; 2026 SNBT AI. Semua hak cipta dilindungi.
        </p>
        <div className="flex gap-6">
          <Link to="/legal/privacy" className="text-xs font-medium text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
            Kebijakan Privasi
          </Link>
          <Link to="/legal/terms" className="text-xs font-medium text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
            Ketentuan Layanan
          </Link>
        </div>
      </div>
    </footer>
  );
}
