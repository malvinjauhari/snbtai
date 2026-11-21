import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "Apakah soalnya update dengan UTBK SNBT 2024?", a: "Ya. Model AI kami didesain untuk mengikuti pola literasi, penalaran matematika, dan reading comprehension berbasis aturan SNBT terbaru." },
  { q: "Bagaimana cara kerja Playlist Youtube?", a: "Kamu bisa copas link materi Youtube. Sistem akan memasukkannya ke playlist, dan kamu bisa menginstruksikan AI untuk mencetak soal latihan berdasarkan video tersebut." },
  { q: "Apakah ini sepenuhnya gratis?", a: "Saat ini SNBT AI dapat diakses gratis dengan limit generasi harian untuk memastikan kestabilan server bagi semua pejuang PTN." },
  { q: "Bisa dipakai di HP?", a: "Sangat bisa. Kami merancang semua interaksi matematika, upload gambar, dan simulasi agar nyaman disentuh dan dimainkan via HP." }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 max-w-3xl mx-auto w-full">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-16 text-center tracking-tight">
        Sering <span className="text-slate-500 dark:text-slate-500">Ditanyakan.</span>
      </h2>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm dark:shadow-none"
            >
              <div className="flex justify-between items-center gap-4">
                 <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">{faq.q}</h3>
                 <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                   <ChevronDown className="w-5 h-5 text-slate-500" />
                 </motion.div>
              </div>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
