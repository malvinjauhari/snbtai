import React, { useEffect, useRef } from 'react';

export default function WaitlistForm() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    if (containerRef.current.querySelector('script')) return;

    const script = document.createElement('script');
    script.src = 'https://form.jotform.com/jsform/261527607585061';
    script.type = 'text/javascript';
    script.async = true;
    
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div id="waitlist-form" className="max-w-2xl mx-auto p-4 md:p-8 rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden min-h-[600px]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px]" />
      
      <div className="text-center mb-8 relative z-10">
        <h3 className="text-3xl font-black text-white tracking-tight">Kunci Tiketmu.</h3>
        <p className="text-slate-400 mt-2 font-medium">Bantu kami mengenal targetmu sebelum platform terbuka sepenuhnya.</p>
      </div>

      <div className="relative z-10 w-full" ref={containerRef}>
        {/* Jotform Embed Script loads here */}
      </div>
    </div>
  );
}
