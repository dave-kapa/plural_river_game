'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ENTRY_DATA } from '@/data/entry';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { Compass, ArrowRight, Layers, HelpCircle } from 'lucide-react';

export default function EntryPage() {
  const router = useRouter();
  const { progress, markEntryCompleted } = useProgression();

  const handleStartTraversal = async () => {
    await markEntryCompleted();
    router.push('/mapa');
  };

  const hasStarted = progress.entryCompleted;

  return (
    <div className="w-full flex-1 flex flex-col justify-center max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16">
      {/* Hero Editorial */}
      <section aria-labelledby="entry-title" className="space-y-6 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-canopy-900 border border-canopy-700 text-river-300 text-xs font-mono uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5 text-editorial-accent" />
          <span>Travesía Fluvial Metodológica</span>
        </div>

        <h1
          id="entry-title"
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-earth-50 tracking-tight leading-tight"
        >
          {ENTRY_DATA.title}
        </h1>

        <p className="text-sm sm:text-base font-mono text-river-400">
          {ENTRY_DATA.subtitle}
        </p>

        <div className="space-y-4 pt-2 text-base sm:text-lg text-earth-200 font-sans leading-relaxed text-left max-w-2xl mx-auto">
          {ENTRY_DATA.leadParagraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>

      {/* Preguntas del recorrido */}
      <section aria-labelledby="journey-questions-title" className="p-6 sm:p-8 rounded-2xl bg-canopy-950/80 border border-canopy-700/70 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-editorial-accent tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <h2 id="journey-questions-title" className="text-xs font-mono uppercase">
            {ENTRY_DATA.journeyQuestionsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {ENTRY_DATA.journeyQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-canopy-900/60 border border-canopy-800 text-xs sm:text-sm text-earth-100 font-serif flex items-center gap-3"
            >
              <span className="w-5 h-5 rounded-full bg-river-950 text-river-300 text-xs font-mono flex items-center justify-center shrink-0 border border-river-700">
                0{idx + 1}
              </span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Idea de entrada e Invitación */}
      <section className="p-6 sm:p-8 rounded-2xl bg-river-950/70 border border-river-700/60 space-y-3 text-center">
        <h3 className="text-xs font-mono uppercase text-river-300 tracking-wider">
          Idea de entrada
        </h3>
        <p className="text-base sm:text-lg text-earth-100 font-serif leading-relaxed max-w-2xl mx-auto">
          {ENTRY_DATA.entryConcept.body}
        </p>
        <p className="text-base sm:text-lg font-serif italic text-editorial-gold pt-2 font-medium">
          “{ENTRY_DATA.invitation}”
        </p>
      </section>

      {/* Acciones de Entrada y Continuación */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={handleStartTraversal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-editorial-accent hover:bg-editorial-accent/90 text-white font-semibold text-base shadow-xl transition-all hover:shadow-editorial-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
        >
          <span>{ENTRY_DATA.ctaText}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {hasStarted && (
          <Link
            href={progress.lastVisitedRoute || '/mapa'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-canopy-900/80 hover:bg-canopy-800 text-earth-200 font-medium text-sm border border-canopy-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
          >
            <Layers className="w-4 h-4 text-river-300" />
            <span>{ENTRY_DATA.ctaSecondaryText}</span>
          </Link>
        )}
      </section>
    </div>
  );
}
