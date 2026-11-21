import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, MapPin, Building2, CheckCircle2, ShieldAlert, Award, FileText, Compass, Users2, Info, Navigation, ExternalLink } from 'lucide-react';
import { getPTNInsightById } from '@/src/lib/ptnpedia/ptnInsightData';

export default function PTNInsightDetail() {
  const { ptnId } = useParams();
  const ptn = useMemo(() => getPTNInsightById(ptnId || ''), [ptnId]);

  if (!ptn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <h2 className="text-2xl font-bold mb-4">Profil Kampus Tidak Ditemukan</h2>
        <Link to="/ptnpedia/ptn-insight" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm">Kembali</Link>
      </div>
    );
  }

  const sections = [
    { id: 'ringkasan', label: 'Ringkasan', icon: FileText, hasData: !!ptn.ringkasan_kampus?.short_description },
    { id: 'fakta', label: 'Fakta Terkini', icon: Info, hasData: ptn.fakta_terkini?.length > 0 },
    { id: 'prospek', label: 'Prospek Kerja', icon: Compass, hasData: ptn.prospek_kerja?.length > 0 },
    { id: 'lingkungan', label: 'Lingkungan', icon: Building2, hasData: !!ptn.lingkungan_kampus?.summary },
    { id: 'alumni', label: 'Alumni', icon: Users2, hasData: ptn.alumni?.length > 0 },
    { id: 'jalur', label: 'Jalur Masuk', icon: Navigation, hasData: ptn.jalur_masuk?.length > 0 },
    { id: 'cirikhas', label: 'Ciri Khas', icon: Award, hasData: ptn.ciri_khas?.length > 0 },
  ];

  return (
    <div className="w-full h-full relative pb-24 flex flex-col pt-4">

      {/* Header Splash */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 lg:p-10 shrink-0 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-bl from-indigo-500/10 to-transparent blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto flex flex-col items-start relative z-10">
          <Link to="/ptnpedia/ptn-insight" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8">
            <ArrowLeft size={14} /> Kembali ke List
          </Link>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider rounded-lg border border-indigo-500/20">{ptn.category}</span>
                 {ptn.data_quality.confidence_level === 'high' ? (
                   <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider rounded-lg border border-emerald-500/20">
                     <CheckCircle2 size={12} /> Data Kuat
                   </span>
                 ) : (
                   <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider rounded-lg border border-amber-500/20">
                     <ShieldAlert size={12} /> Diverifikasi
                   </span>
                 )}
              </div>
              <h1 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-3xl">
                {ptn.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-500/70" /> {ptn.location.city}, {ptn.location.province || ptn.location.region}</span>
                <span className="flex items-center gap-1.5"><Building2 size={16} className="text-indigo-500/70" /> {ptn.type === 'universitas' ? 'Universitas' : 'Institut'}</span>
                {ptn.short_name && <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold">{ptn.short_name}</span>}
              </div>
            </div>

            {ptn.official_website && (
              <a href={ptn.official_website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-bold text-sm shrink-0">
                <Globe size={18} className="text-indigo-500" /> Kunjungi Website
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 lg:px-6 pt-10 flex flex-col lg:flex-row gap-10">
        
        {/* Sticky Desktop Navigation */}
        <div className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-28 space-y-1">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-3">Konten Profil</h3>
             {sections.map(sec => (
               <a key={sec.id} href={`#${sec.id}`} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${sec.hasData ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-indigo-600' : 'text-slate-300 dark:text-slate-700 pointer-events-none'}`}>
                 <sec.icon size={16} className={sec.hasData ? 'text-slate-400' : 'opacity-50'} />
                 {sec.label}
               </a>
             ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-12 min-w-0">
           
           {/* Section: Ringkasan */}
           <section id="ringkasan" className="space-y-6 scroll-mt-28">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                   <FileText size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ringkasan Kampus</h3>
             </div>
             
             {ptn.ringkasan_kampus?.short_description ? (
               <div className="space-y-6">
                 <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                   {ptn.ringkasan_kampus.short_description}
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ptn.ringkasan_kampus.academic_focus?.length > 0 && (
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Fokus Akademik</h4>
                         <ul className="space-y-2">
                           {ptn.ringkasan_kampus.academic_focus.map((item, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                               <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                               <span className="leading-snug">{item}</span>
                             </li>
                           ))}
                         </ul>
                      </div>
                    )}
                    
                    {ptn.ringkasan_kampus.suitable_for?.length > 0 && (
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Cocok Untuk</h4>
                         <ul className="space-y-2">
                           {ptn.ringkasan_kampus.suitable_for.map((item, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                               <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                               <span className="leading-snug">{item}</span>
                             </li>
                           ))}
                         </ul>
                      </div>
                    )}
                 </div>
                 
                 {ptn.ringkasan_kampus.key_highlights?.length > 0 && (
                    <div className="bg-gradient-to-r from-indigo-500/5 to-transparent p-5 rounded-2xl border border-indigo-500/10">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-3">Key Highlights</h4>
                       <div className="flex flex-wrap gap-2">
                         {ptn.ringkasan_kampus.key_highlights.map((item, i) => (
                           <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/5">{item}</span>
                         ))}
                       </div>
                    </div>
                 )}
               </div>
             ) : <EmptySectionData />}
           </section>

           {/* Section: Fakta Terkini */}
           <section id="fakta" className="space-y-6 scroll-mt-28">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                   <Info size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Fakta Terkini</h3>
             </div>
             
             {ptn.fakta_terkini && ptn.fakta_terkini.length > 0 ? (
               <div className="grid grid-cols-1 gap-4">
                 {ptn.fakta_terkini.map((fakta, i) => (
                   <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                         <h4 className="text-base font-bold text-slate-900 dark:text-white">{fakta.title}</h4>
                         {fakta.date_or_year && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{fakta.date_or_year}</span>}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{fakta.description}</p>
                      {fakta.source_url && (
                        <a href={fakta.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-indigo-500 hover:text-indigo-600">
                          Sumber <ExternalLink size={12} />
                        </a>
                      )}
                   </div>
                 ))}
               </div>
             ) : <EmptySectionData />}
           </section>

           {/* Section: Prospek Kerja */}
           <section id="prospek" className="space-y-6 scroll-mt-28">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                   <Compass size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Prospek Kerja</h3>
             </div>
             
             {ptn.prospek_kerja && ptn.prospek_kerja.length > 0 ? (
               <div className="space-y-6">
                 {ptn.prospek_kerja.map((prospek, i) => (
                   <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{prospek.career_field}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{prospek.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {prospek.related_faculties_or_majors?.length > 0 && (
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Fakultas/Prodi Terkait</p>
                             <ul className="space-y-1.5">
                               {prospek.related_faculties_or_majors.map((item, idx) => (
                                 <li key={idx} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {item}
                                 </li>
                               ))}
                             </ul>
                          </div>
                        )}
                        {prospek.example_roles?.length > 0 && (
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Contoh Peran</p>
                             <div className="flex flex-wrap gap-2">
                               {prospek.example_roles.map((item, idx) => (
                                 <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded font-medium text-xs text-slate-600 dark:text-slate-300">{item}</span>
                               ))}
                             </div>
                          </div>
                        )}
                      </div>
                   </div>
                 ))}
               </div>
             ) : <EmptySectionData />}
           </section>

           {/* Section: Lingkungan Kampus */}
           <section id="lingkungan" className="space-y-6 scroll-mt-28">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                   <Building2 size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Lingkungan Kampus</h3>
             </div>
             
             {ptn.lingkungan_kampus?.summary ? (
               <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-6">
                  <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{ptn.lingkungan_kampus.summary}</p>
                  
                  {ptn.lingkungan_kampus.campus_life_tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {ptn.lingkungan_kampus.campus_life_tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-bold rounded-lg capitalize">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
                     {ptn.lingkungan_kampus.surrounding_environment && (
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sekitar Kampus</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{ptn.lingkungan_kampus.surrounding_environment}</p>
                       </div>
                     )}
                     {ptn.lingkungan_kampus.transportation_access && (
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Akses Transportasi</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{ptn.lingkungan_kampus.transportation_access}</p>
                       </div>
                     )}
                  </div>
               </div>
             ) : <EmptySectionData />}
           </section>

           {/* Section: Alumni */}
           <section id="alumni" className="space-y-6 scroll-mt-28">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                   <Users2 size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Alumni Terkemuka</h3>
             </div>
             
             {ptn.alumni && ptn.alumni.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {ptn.alumni.map((alum, i) => (
                   <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col justify-center">
                      <h4 className="font-bold text-slate-900 dark:text-white">{alum.name}</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-0.5">{alum.known_as}</p>
                      {alum.faculty_or_major && <p className="text-xs text-slate-400 mt-2 font-medium">{alum.faculty_or_major}</p>}
                   </div>
                 ))}
               </div>
             ) : <EmptySectionData />}
           </section>

           {/* Section: Jalur Masuk */}
           <section id="jalur" className="space-y-6 scroll-mt-28">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                   <Navigation size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Jalur Masuk</h3>
             </div>
             
             {ptn.jalur_masuk && ptn.jalur_masuk.length > 0 ? (
               <div className="grid grid-cols-1 gap-3">
                 {ptn.jalur_masuk.map((jalur, i) => (
                   <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded ${jalur.type === 'nasional' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{jalur.type}</span>
                          <h4 className="font-bold text-slate-900 dark:text-white">{jalur.name}</h4>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{jalur.description}</p>
                      </div>
                      {jalur.official_url && (
                        <a href={jalur.official_url} target="_blank" rel="noreferrer" className="shrink-0 px-4 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-xs font-bold transition-colors">
                          Info Resmi
                        </a>
                      )}
                   </div>
                 ))}
               </div>
             ) : <EmptySectionData />}
           </section>

           {/* Section: Ciri Khas */}
           <section id="cirikhas" className="space-y-6 scroll-mt-28">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                   <Award size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ciri Khas</h3>
             </div>
             
             {ptn.ciri_khas && ptn.ciri_khas.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {ptn.ciri_khas.map((ciri, i) => (
                   <div key={i} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-6 rounded-2xl border border-rose-500/10 shadow-sm relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-5 text-rose-500">
                         <Award size={100} />
                      </div>
                      <div className="relative z-10">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">{ciri.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">{ciri.description}</p>
                      </div>
                   </div>
                 ))}
               </div>
             ) : <EmptySectionData />}
           </section>

           {/* Footer / Data Quality */}
           <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Informasi Kualitas Data & Sumber</h4>
              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4">
                 <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                    <span className="text-slate-500">Completeness Score: <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 bg-white dark:bg-slate-800 rounded">{ptn.data_quality.completeness_score}/100</span></span>
                    <span className="text-slate-500">Pembaruan Terakhir: {ptn.last_verified_at || '-'}</span>
                 </div>
                 {ptn.data_quality.verification_notes && (
                   <p className="text-sm text-slate-500 dark:text-slate-400 italic">"{ptn.data_quality.verification_notes}"</p>
                 )}
                 {ptn.sumber_data && ptn.sumber_data.length > 0 && (
                   <div className="pt-2 border-t border-slate-200 dark:border-white/5">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sumber Berkas</p>
                     <ul className="space-y-1">
                       {ptn.sumber_data.map((src, i) => (
                         <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                           <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                           {src.url ? <a href={src.url} target="_blank" rel="noreferrer" className="hover:text-indigo-500 hover:underline">{src.label}</a> : src.label}
                           <span className="opacity-50">({src.type})</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function EmptySectionData() {
  return (
    <div className="w-full py-10 bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3 text-slate-400">
         <ShieldAlert size={20} />
      </div>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Data belum tersedia</p>
      <p className="text-xs text-slate-500 max-w-xs mt-1">Informasi untuk bagian ini masih dalam proses verifikasi atau belum dikumpulkan secara penuh.</p>
    </div>
  );
}
