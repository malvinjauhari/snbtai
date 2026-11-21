import React, { useEffect } from 'react';
import HeroSection from './components/HeroSection';
import WaitlistForm from './components/WaitlistForm';

export default function Waitlist() {
  // Ensure we start at the top of the page when loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#080B1D] selection:bg-indigo-500/30 w-full overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 space-y-24 pb-32">
        <HeroSection />
        
        {/* We can add Showcase, Features, Roadmap directly beneath the hero before the form */}
        <div id="preview" className="px-6 relative">
           <div className="max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-slate-900/50 p-2 md:p-4 shadow-2xl relative">
             <div className="absolute top-4 left-6 flex gap-2">
               <div className="w-3 h-3 rounded-full bg-rose-500" />
               <div className="w-3 h-3 rounded-full bg-amber-500" />
               <div className="w-3 h-3 rounded-full bg-emerald-500" />
             </div>
             
             {/* Mock Dashboard UI */}
             <div className="h-[400px] md:h-[600px] w-full rounded-2xl bg-slate-950 border border-white/5 overflow-hidden mt-10 relative flex flex-col items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Platform dalam tahap finalisasi</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">
                    Kecerdasan Buatan sedang menyusun peta belajar terbaik untuk seluruh pejuang PTN Indonesia.  
                  </p>
                </div>
             </div>
           </div>
        </div>

        <section className="px-6 pt-10">
          <WaitlistForm />
        </section>
      </div>
    </div>
  );
}
