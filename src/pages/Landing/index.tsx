import React, { lazy, Suspense } from 'react';
import HeroSection from './sections/HeroSection';

const ProblemSection = lazy(() => import('./sections/ProblemSection'));
const ChatbotSection = lazy(() => import('./sections/ChatbotSection'));
const TutorSection = lazy(() => import('./sections/TutorSection'));
const PlaylistSection = lazy(() => import('./sections/PlaylistSection'));
const HabitSection = lazy(() => import('./sections/HabitSection'));
const PtnPediaSection = lazy(() => import('./sections/PtnPediaSection'));
const QuestionsSection = lazy(() => import('./sections/QuestionsSection'));
const ComparisonSection = lazy(() => import('./sections/ComparisonSection'));
const FAQSection = lazy(() => import('./sections/FAQSection'));
const CTASection = lazy(() => import('./sections/CTASection'));
const FooterSection = lazy(() => import('./sections/FooterSection'));

import { ScrollReveal } from '@/src/components/shared/ScrollReveal';

export default function Landing() {
  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30 overflow-hidden font-sans pt-8">
      {/* Global Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none hidden">
        {/* Blurs removed for performance - handled by premium-bg */}
      </div>

      <div className="relative z-10 flex flex-col gap-24 pb-0">
        {/* Load Hero immediately */}
        <ScrollReveal><HeroSection /></ScrollReveal>
        
        {/* Lazy load below the fold sections */}
        <Suspense fallback={null}>
          <ScrollReveal><ProblemSection /></ScrollReveal>
          <ScrollReveal><ChatbotSection /></ScrollReveal>
          <ScrollReveal><TutorSection /></ScrollReveal>
          <ScrollReveal><PlaylistSection /></ScrollReveal>
          <ScrollReveal><HabitSection /></ScrollReveal>
          <ScrollReveal><PtnPediaSection /></ScrollReveal>
          <ScrollReveal><QuestionsSection /></ScrollReveal>
          <ScrollReveal><ComparisonSection /></ScrollReveal>
          <ScrollReveal><FAQSection /></ScrollReveal>
          <ScrollReveal><CTASection /></ScrollReveal>
          <FooterSection />
        </Suspense>
      </div>
    </div>
  );
}
