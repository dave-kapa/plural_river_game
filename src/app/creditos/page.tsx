'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CREDITS_DATA } from '@/data/credits';
import { MASTER_PRESENTATION_PARAGRAPH, MASTER_PRACTICAL_CONTINUATION, OFFICIAL_JOURNAL_ENTRIES } from '@/data/journal';
import { useProgression } from '@/lib/progression/ProgressionContext';
import {
  Award,
  Lock,
  ArrowLeft,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  Feather,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { ALL_TRIBUTARIES } from '@/lib/progression/unlockRules';

export default function CreditsPage() {
  const { areCreditsUnlocked, progress } = useProgression();
  const [copied, setCopied] = useState(false);

  const missingTributaries = ALL_TRIBUTARIES.filter(
    (t) => !progress.visitedTributaries.includes(t)
  );

  const assembledMasterParagraph = `${MASTER_PRESENTATION_PARAGRAPH.join('\n\n')}\n\n${MASTER_PRACTICAL_CONTINUATION}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(assembledMasterParagraph);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!areCreditsUnlocked) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-canopy-900 border border-canopy-700 mx-auto flex items-center justify-center text-earth-400">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-earth-50">Desembocadura bloqueada</h1>
        <p className="text-sm text-earth-300 font-sans leading-relaxed">
          {CREDITS_DATA.conditionNotice} Aún te falta explorar {missingTributaries.length} afluente(s).
        </p>
        <div className="pt-2">
          <Link
            href="/territorios/territorio-5"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-editorial-accent text-white text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Territorio 5 (Delta)</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16">
      {/* Cabecera de Créditos */}
      <header className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-canopy-900 border border-editorial-gold/40 text-editorial-gold text-xs font-mono uppercase tracking-widest">
          <Award className="w-4 h-4" />
          <span>Epílogo & Travesía Fluvial</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-earth-50 leading-tight">
          {CREDITS_DATA.title}
        </h1>

        <p className="text-base sm:text-lg font-mono text-river-300">
          {CREDITS_DATA.functionalQuestion}
        </p>
      </header>

      {/* SECCIÓN 1: Intersecciones Disciplinares */}
      <section aria-labelledby="intersections-title" className="space-y-4">
        <p className="text-sm sm:text-base text-earth-200 font-sans text-center max-w-2xl mx-auto">
          {CREDITS_DATA.initialCopy}
        </p>

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {CREDITS_DATA.intersections.map((field, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-full bg-canopy-950 border border-canopy-800 text-xs font-mono text-earth-300"
            >
              {field}
            </span>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: Perfil Profesional (Dave) */}
      <section aria-labelledby="author-title" className="p-6 md:p-8 rounded-2xl bg-canopy-950/80 border border-canopy-700/80 space-y-6">
        <div className="flex items-center justify-between border-b border-canopy-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-editorial-accent tracking-wider">
              Perfil & Enfoque
            </span>
            <h2 id="author-title" className="text-2xl font-serif font-bold text-earth-50 mt-0.5">
              {CREDITS_DATA.authorProfile.name}
            </h2>
          </div>
          <span className="text-xs font-mono text-river-300">
            Diseño Gameful & Comportamiento
          </span>
        </div>

        <div className="space-y-3 text-sm sm:text-base text-earth-200 font-sans leading-relaxed">
          {CREDITS_DATA.authorProfile.narrative.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-river-300">
            Sería pensar junto con el equipo de Plural:
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-earth-200">
            {CREDITS_DATA.authorProfile.focusPillars.map((pillar, idx) => (
              <li key={idx} className="p-3 rounded-lg bg-canopy-900/60 border border-canopy-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-river-400 shrink-0 mt-0.5" />
                <span>{pillar}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-river-950/60 border border-river-700/60 text-xs sm:text-sm text-earth-100 font-serif italic">
          “{CREDITS_DATA.authorProfile.closingInterest}”
        </div>
      </section>

      {/* SECCIÓN 3: Bitácora Final — Párrafo de Presentación Ensamblado */}
      <section aria-labelledby="bitacora-final-title" className="p-6 md:p-8 rounded-2xl bg-canopy-900/50 border border-river-600/50 space-y-6">
        <div className="flex items-center justify-between border-b border-canopy-800 pb-3">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-editorial-gold" />
            <h2 id="bitacora-final-title" className="font-serif font-bold text-xl text-earth-50">
              Bitácora Final de la Travesía
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canopy-950 hover:bg-river-950 text-xs font-mono text-river-200 border border-river-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-river-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado al portapapeles' : 'Copiar párrafo para propuestas'}</span>
          </button>
        </div>

        <p className="text-xs text-earth-300">
          Al completar la travesía se ensamblan las premisas recogidas. Este texto sintetiza la integración de la capacidad gameful dentro de Plural:
        </p>

        <div className="space-y-4 p-6 rounded-xl bg-canopy-950/90 border border-canopy-800 font-serif text-sm sm:text-base leading-relaxed text-earth-100 italic">
          {MASTER_PRESENTATION_PARAGRAPH.map((p, idx) => (
            <p key={idx}>“{p}”</p>
          ))}
          <p className="text-editorial-gold not-italic font-sans text-xs sm:text-sm pt-2 border-t border-canopy-900">
            <strong>Continuación práctica: </strong>
            {MASTER_PRACTICAL_CONTINUATION}
          </p>
        </div>
      </section>

      {/* SECCIÓN 4: Copy Final de la Experiencia */}
      <section className="p-8 rounded-3xl bg-river-950/70 border border-river-700/60 text-center space-y-6 max-w-3xl mx-auto shadow-xl">
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-earth-50">
          {CREDITS_DATA.finalCopy.highlight}
        </h3>

        <p className="text-sm sm:text-base text-earth-200 font-sans leading-relaxed">
          {CREDITS_DATA.finalCopy.body}
        </p>

        <div className="p-4 rounded-xl bg-canopy-950 border border-river-600/50 text-base sm:text-lg font-serif italic text-earth-50">
          “{CREDITS_DATA.finalCopy.opportunity}”
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/afluentes/evaluation-as-experience"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-editorial-accent hover:bg-editorial-accent/90 text-white font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{CREDITS_DATA.finalCopy.callToAction}</span>
          </Link>

          <Link
            href="/mapa"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-canopy-900 hover:bg-canopy-800 text-earth-200 font-medium text-xs border border-canopy-700 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Volver a navegar el río</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
