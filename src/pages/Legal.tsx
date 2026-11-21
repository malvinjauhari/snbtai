import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, FileText, ChevronRight, Scale, Mail, ArrowUpRight } from 'lucide-react';
import { privacyPolicyData, termsAndConditionsData } from '../data/legalDetails';
import { Helmet } from 'react-helmet-async';

export default function Legal() {
  const { type } = useParams();
  const [activeSection, setActiveSection] = useState<string>('');

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';
  const data = isPrivacy ? privacyPolicyData : termsAndConditionsData;
  const lastUpdated = 'October 24, 2024';

  useEffect(() => {
    // Reset scroll when navigating between policies
    window.scrollTo(0, 0);
  }, [type]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    data.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for fixed header
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>{title} | SNBT AI</title>
        <meta name="description" content={`Read the ${title.toLowerCase()} for SNBT AI, outlining our guidelines, data handling, and legal terms.`} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors pb-32">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-32 relative z-10">
          
          {/* Header Row Content */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-white/10 pb-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                {isPrivacy ? <Shield className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                Legal Documentation
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Effective Date & Last Updated: {lastUpdated}
              </p>
            </div>
            
            <div className="flex bg-slate-200/50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 p-1.5 rounded-xl">
              <Link 
                to="/legal/terms" 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!isPrivacy ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Terms
              </Link>
              <Link 
                to="/legal/privacy" 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isPrivacy ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Privacy
              </Link>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
            
            {/* Left Sidebar Table of Contents */}
            <div className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-32 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Table of Contents</h3>
                <nav className="flex flex-col gap-1 border-l-2 border-slate-200 dark:border-slate-800">
                  {data.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`text-left px-4 py-2 text-sm font-medium transition-all border-l-2 -ml-[2px] ${
                        activeSection === section.id
                          ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {section.title.replace(/^[0-9]+\.\s/, '')}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Main Content Area */}
            <div className="lg:col-span-9 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="prose prose-slate dark:prose-invert prose-indigo max-w-none">
                
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-12">
                  Welcome to SNBT AI. These documents serve as the foundational agreement between you (the "User") and SNBT AI regarding your usage of the platform. Please review this information carefully to understand your rights, responsibilities, and how your data is treated within our educational ecosystem.
                </p>

                <div className="space-y-16">
                  {data.map((section) => (
                    <div key={section.id} id={section.id} className="scroll-mt-32 space-y-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        {section.title}
                      </h2>
                      <div className="text-slate-600 dark:text-slate-400 leading-relax space-y-4">
                        {section.content}
                      </div>
                    </div>
                  ))}
                  
                  {/* Footer Contact specific to legal */}
                  <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Questions or Concerns?</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      If you require clarification on any points raised within this {title.toLowerCase()} or wish to exercise your data rights, please reach out to our principal administration team.
                    </p>
                    <a href="mailto:support@snbtai.com" className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:shadow-lg transition-transform hover:-translate-y-0.5">
                      <Mail className="w-4 h-4" />
                      Contact Support <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
