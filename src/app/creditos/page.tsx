'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CREDITS_DATA } from '@/data/credits';
import { MASTER_PRESENTATION_PARAGRAPH, MASTER_PRACTICAL_CONTINUATION, OFFICIAL_JOURNAL_ENTRIES } from '@/data/journal';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { useVisualSet } from '@/lib/visual/VisualSetContext';
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
  User,
} from 'lucide-react';
import { ALL_TRIBUTARIES } from '@/lib/progression/unlockRules';
import { formatQuotation } from '@/lib/explorer/quotePersonalizer';

export default function CreditsPage() {
  const { areCreditsUnlocked, progress, trackInteraction, explorerName, isLoading } = useProgression();
  const { getPortadaBg } = useVisualSet();
  const [copied, setCopied] = useState(false);
  const [imageSrc, setImageSrc] = useState('/assets/dave.png');
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (imageSrc === '/assets/dave.png') {
      setImageSrc('/assets/dave.jpg');
    } else {
      setImageError(true);
    }
  };

  const missingTributaries = ALL_TRIBUTARIES.filter(
    (t) => !progress.visitedTributaries.includes(t)
  );

  const assembledMasterParagraph = `${MASTER_PRESENTATION_PARAGRAPH.join('\n\n')}\n\n${MASTER_PRACTICAL_CONTINUATION}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(assembledMasterParagraph);
    setCopied(true);
    trackInteraction({
      eventName: 'pitch_copied',
      metadata: { length: assembledMasterParagraph.length },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const bgUrl = getPortadaBg();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-solar-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-solar-300">Cargando epílogo de la travesía...</p>
      </div>
    );
  }

  if (!areCreditsUnlocked) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center p-4">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-forest-950/40 via-forest-950/60 to-forest-950/85 pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto py-16 px-6 text-center space-y-6 bg-forest-950/80 border border-forest-800 rounded-3xl shadow-2xl backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-forest-900 border border-forest-700 mx-auto flex items-center justify-center text-solar-400 shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-earth-50">Desembocadura bloqueada</h1>
          <p className="text-sm text-earth-300 font-sans leading-relaxed">
            Para acceder al epílogo de la travesía y a la síntesis del Método Plural, debes completar los 5 territorios y explorar los 3 afluentes del delta.
          </p>
          <div className="pt-2">
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-earth-100 font-serif text-sm transition-colors border border-forest-600 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a navegar el río</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-x-clip" style={{ overflowX: 'clip', overflowY: 'visible' }}>
      {/* Fondo atmosférico de la portada/epílogo en punto medio de legibilidad */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-forest-950/55 via-forest-950/70 to-forest-950/85 pointer-events-none" />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16">
        {/* Cabecera de Créditos */}
        <header className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900 border border-solar-500/40 text-solar-400 text-xs font-mono uppercase tracking-widest shadow-sm">
            <Award className="w-4 h-4" />
            <span>Epílogo & Travesía Fluvial</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-earth-50 leading-tight">
            {CREDITS_DATA.title}
          </h1>

          <p className="text-base sm:text-lg font-serif italic text-water-300">
            {formatQuotation(CREDITS_DATA.functionalQuestion, explorerName)}
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
                className="px-4 py-1.5 rounded-full bg-forest-900/80 border border-forest-800 text-xs font-mono text-water-300 shadow-sm"
              >
                {field}
              </span>
            ))}
          </div>
        </section>

        {/* SECCIÓN 2: Bitácora Final — Superficie Pergamino Editorial de Alto Contraste */}
        <section aria-labelledby="bitacora-final-title" className="p-6 md:p-8 rounded-3xl bg-parchment-100 text-parchment-ink border border-parchment-300 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-parchment-300 pb-4">
            <div className="flex items-center gap-2">
              <Feather className="w-5 h-5 text-emerald-800" />
              <h2 id="bitacora-final-title" className="font-serif font-bold text-2xl text-parchment-ink">
                Bitácora Final de la Travesía
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-850 text-xs font-mono text-earth-100 border border-forest-700 transition-colors cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-jade-400" /> : <Copy className="w-3.5 h-3.5 text-solar-400" />}
              <span>{copied ? 'Copiado al portapapeles' : 'Copiar párrafo para propuestas'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-parchment-muted">
            Al completar la travesía se ensamblan las premisas recogidas. Este texto sintetiza la integración de la capacidad gameful dentro de Plural:
          </p>

          <div className="space-y-4 p-6 rounded-2xl bg-parchment-200/80 border border-parchment-300 font-serif text-sm sm:text-base leading-relaxed text-parchment-ink italic shadow-inner">
            {MASTER_PRESENTATION_PARAGRAPH.map((p, idx) => (
              <p key={idx}>{formatQuotation(p, explorerName)}</p>
            ))}
            <p className="text-emerald-900 not-italic font-sans text-xs sm:text-sm pt-3 border-t border-parchment-300">
              <strong className="font-bold text-parchment-ink">Continuación práctica: </strong>
              {MASTER_PRACTICAL_CONTINUATION}
            </p>
          </div>
        </section>

        {/* CONSTANCIA HONORÍFICA DE TRAVESÍA FLUVIAL */}
        <section
          aria-label="Constancia de Navegación del Explorador"
          className="border-metallic-gold"
        >
          <div className="border-metallic-gold-inner p-6 sm:p-8 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-earth-100 shadow-[0_10px_35px_rgba(0,0,0,0.5)] text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-solar-500/20 text-solar-300 border border-solar-500/40 text-xs font-mono uppercase tracking-widest mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-solar-400" />
              <span>Constancia Honorífica de Travesía</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-earth-50">
              {explorerName ? `Explorador: ${explorerName}` : 'Explorador del Río'}
            </h2>

            <p className="text-sm sm:text-base text-earth-200 font-serif max-w-xl mx-auto italic leading-relaxed">
              «Por haber navegado con rigor metodológico, perspectiva sistémica y curiosidad viva los cinco territorios del río y los afluentes del delta, articulando la capacidad gameful dentro del Método Plural.»
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-solar-300">
              <span className="bg-forest-900/80 px-2.5 py-1 rounded-md border border-solar-500/30">✓ 5 Territorios Recorridos</span>
              <span className="hidden sm:inline">•</span>
              <span className="bg-forest-900/80 px-2.5 py-1 rounded-md border border-solar-500/30">✓ 3 Afluentes Confluidos</span>
              <span className="hidden sm:inline">•</span>
              <span className="bg-forest-900/80 px-2.5 py-1 rounded-md border border-solar-500/30">✓ Bitácora Ensamblada</span>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: Perfil Profesional (Dave) */}
        <section aria-labelledby="author-title" className="p-6 md:p-8 rounded-3xl bg-forest-950/85 border border-jade-600/40 backdrop-blur-sm space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-800 pb-5">
            <div className="flex items-center gap-4">
              {/* Avatar circular con marco dorado/solar */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-solar-500/80 shadow-lg bg-forest-900 flex items-center justify-center shrink-0">
                {!imageError ? (
                  <img
                    src={imageSrc}
                    alt={CREDITS_DATA.authorProfile.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-solar-400/80" />
                )}
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-solar-400 font-semibold tracking-wider">
                  Perfil & Enfoque
                </span>
                <h2 id="author-title" className="text-2xl font-serif font-bold text-earth-50 mt-0.5">
                  {CREDITS_DATA.authorProfile.name}
                </h2>
                <span className="text-xs font-mono text-water-300 block sm:hidden mt-0.5">
                  Diseño Gameful & Comportamiento
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-water-300 hidden sm:block">
              Diseño Gameful & Comportamiento
            </span>
          </div>

          <div className="space-y-3 text-sm sm:text-base text-earth-200 font-sans leading-relaxed">
            {CREDITS_DATA.authorProfile.narrative.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-water-300">
              Sería pensar junto con el equipo de Plural:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-earth-200">
              {CREDITS_DATA.authorProfile.focusPillars.map((pillar, idx) => (
                <li key={idx} className="p-3.5 rounded-xl bg-forest-900/60 border border-forest-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-jade-400 shrink-0 mt-0.5" />
                  <span>{pillar}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-forest-900/90 border border-forest-700 text-xs sm:text-sm text-earth-100 font-serif italic shadow-md">
            {formatQuotation(CREDITS_DATA.authorProfile.closingInterest, explorerName)}
          </div>
        </section>

        {/* SECCIÓN 4: Copy Final de la Experiencia */}
        <section className="p-8 sm:p-10 rounded-3xl bg-forest-950/90 border border-jade-600/50 text-center space-y-6 max-w-3xl mx-auto shadow-2xl backdrop-blur-sm">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-earth-50">
            {CREDITS_DATA.finalCopy.highlight}
          </h3>

          <p className="text-sm sm:text-base text-earth-200 font-sans leading-relaxed">
            {CREDITS_DATA.finalCopy.body}
          </p>

          <div className="p-5 rounded-2xl bg-forest-900/90 border border-solar-500/40 text-base sm:text-lg font-serif italic text-earth-50 shadow-inner">
            {formatQuotation(CREDITS_DATA.finalCopy.opportunity, explorerName)}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/afluentes/evaluation-as-experience"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-solar-500 hover:bg-solar-400 text-forest-950 font-bold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 shadow-xl"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{CREDITS_DATA.finalCopy.callToAction}</span>
            </Link>

            <Link
              href="/mapa"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-earth-200 font-medium text-xs border border-forest-700 transition-colors"
            >
              <Compass className="w-4 h-4 text-solar-400" />
              <span>Volver a navegar el río</span>
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
