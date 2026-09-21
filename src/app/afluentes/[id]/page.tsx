'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { TRIBUTARIES_DATA } from '@/data/tributaries';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { useVisualSet } from '@/lib/visual/VisualSetContext';
import { Compass, CheckCircle2, ArrowRight, ArrowLeft, Award, HelpCircle, Briefcase, Sparkles, Map, Lock } from 'lucide-react';
import { isTributaryAccessible } from '@/lib/progression/unlockRules';
import { formatQuotation } from '@/lib/explorer/quotePersonalizer';

interface TributaryPageProps {
  params: { id: string };
}

export default function TributaryPage({ params }: TributaryPageProps) {
  const { id } = params;
  const tributary = TRIBUTARIES_DATA[id];
  const { getTerritoryBg } = useVisualSet();

  const {
    progress,
    isLoading,
    markTributaryVisited,
    registerDiscoveredItems,
    areCreditsUnlocked,
    setLastVisited,
    trackInteraction,
    explorerName,
  } = useProgression();

  const isVisited = (progress.visitedTributaries || []).includes(id);

  const isAccessible = isTributaryAccessible(progress.territoryStatus);

  useEffect(() => {
    if (tributary && !isLoading && isAccessible) {
      setLastVisited(`/afluentes/${id}`);
    }
  }, [id, tributary, isLoading, isAccessible, setLastVisited]);

  const handleRegisterHorizon = async () => {
    if (!isAccessible) return;
    await markTributaryVisited(id);
    await registerDiscoveredItems(`t5:tributary:${id}`);
    await trackInteraction({
      eventName: 'tributary_registered',
      territoryId: 'territorio-5',
      targetId: id,
    });
  };

  const bgUrl = getTerritoryBg('territorio-5');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-water-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-water-300">Sintonizando corrientes del delta...</p>
      </div>
    );
  }

  if (!isAccessible) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center p-4">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-forest-950/55 via-forest-950/70 to-forest-950/85 pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto py-16 px-6 text-center space-y-6 bg-forest-950/85 border border-forest-800 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-forest-900 border border-forest-700 mx-auto flex items-center justify-center text-solar-400 shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-earth-50">
            Afluente aún no navegable
          </h1>
          <p className="text-sm text-earth-300 font-sans leading-relaxed">
            Para explorar los afluentes del delta, primero debes completar la confluencia en el Territorio 4 y habilitar el Territorio 5 en tu travesía.
          </p>
          <div className="pt-2">
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-earth-100 font-serif text-sm transition-colors border border-forest-600 shadow-lg"
            >
              <Compass className="w-4 h-4 text-solar-400" />
              <span>Volver a la cartografía del río</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tributary) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-6">
        <h1 className="text-2xl font-serif font-bold text-earth-50">Afluente no encontrado</h1>
        <p className="text-sm text-earth-300">Este afluente no figura en el delta.</p>
        <Link
          href="/territorios/territorio-5"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-forest-800 text-white text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la bifurcación</span>
        </Link>
      </div>
    );
  }

  const otherTributaries = Object.values(TRIBUTARIES_DATA).filter((t) => t.id !== id);

  return (
    <div className="relative w-full overflow-x-clip" style={{ overflowX: 'clip', overflowY: 'visible' }}>
      {/* Fondo atmosférico en proporción de pantalla con opacidad calibrada (punto medio de legibilidad) */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* Filtro atmosférico en punto medio: profundidad equilibrada para proteger la lectura */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-forest-950/55 via-forest-950/70 to-forest-950/85 pointer-events-none" />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
        {/* Cabecera del Afluente */}
        <header className="space-y-4 border-b border-forest-800 pb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-water-300">
              <Compass className="w-4 h-4 text-solar-400" />
              <span>Afluente del Delta</span>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full border ${
              isVisited
                ? 'text-water-300 bg-forest-900 border-jade-600/50'
                : 'text-earth-400 bg-forest-950 border-forest-800'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isVisited ? 'Afluente registrado' : 'Por registrar'}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-earth-50 leading-tight">
            {tributary.title}
          </h1>

          <p className="text-lg md:text-xl font-serif italic text-water-300">
            {tributary.subtitle}
          </p>

          <div className="p-5 rounded-xl bg-forest-900/80 border border-forest-800 text-sm sm:text-base text-earth-100 font-sans leading-relaxed shadow-md">
            <strong className="block text-xs font-mono uppercase text-solar-400 mb-1">
              Propósito del afluente:
            </strong>
            {tributary.purpose}
          </div>
        </header>

        {/* Proyectos a los que puede aplicarse */}
        <section aria-labelledby="projects-title" className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-solar-400 tracking-wider font-semibold">
            <Briefcase className="w-4 h-4" />
            <span>Ámbitos y Proyectos de Aplicación</span>
          </div>
          <h2 id="projects-title" className="font-serif text-2xl font-bold text-earth-50">
            ¿A qué proyectos puede aplicarse?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tributary.projectsToApply.map((proj, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-forest-950 border border-forest-800 text-xs sm:text-sm text-earth-200 flex items-start gap-2.5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-water-400 mt-2 shrink-0" />
                <span>{proj}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Preguntas para explorar juntos */}
        <section aria-labelledby="questions-title" className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-water-300 tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Indagación Conjunta</span>
          </div>
          <h2 id="questions-title" className="font-serif text-2xl font-bold text-earth-50">
            Preguntas para explorar juntos
          </h2>

          <div className="grid grid-cols-1 gap-2.5">
            {tributary.exploringQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-forest-950/60 border border-forest-800/80 text-xs sm:text-sm text-earth-200 font-serif italic flex items-start gap-3"
              >
                <span className="text-xs font-mono text-water-400 font-semibold shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Posible punto de partida & Copy del afluente: Superficie Pergamino Editorial */}
        <section className="space-y-4 pt-2">
          <div className="p-6 rounded-2xl bg-parchment-100 text-parchment-ink border border-parchment-300 shadow-xl space-y-2">
            <span className="text-xs font-mono uppercase text-emerald-800 font-bold block">
              Posible Punto de Partida
            </span>
            <p className="text-sm sm:text-base text-parchment-ink font-sans leading-relaxed">
              {tributary.possibleStartingPoint}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-forest-900/90 border border-jade-600/50 text-earth-100 font-serif text-base sm:text-lg italic leading-relaxed shadow-lg">
            {formatQuotation(tributary.tributaryCopy, explorerName)}
          </div>
        </section>

        {/* Acción explícita para registrar este afluente en la bitácora */}
        <section aria-labelledby="tributary-action-title" className="p-6 sm:p-8 rounded-2xl bg-forest-950/90 border border-jade-600/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-water-300">
              <Sparkles className="w-4 h-4 text-solar-400" />
              <span>Registro de Travesía</span>
            </div>
            <h3 id="tributary-action-title" className="font-serif font-bold text-lg sm:text-xl text-earth-50">
              {isVisited
                ? (explorerName ? `Horizonte integrado en la bitácora de ${explorerName}` : 'Horizonte integrado en tu bitácora')
                : (explorerName ? `${explorerName}, ¿completaste la lectura de este horizonte?` : '¿Completaste la lectura de este horizonte?')}
            </h3>
            <p className="text-xs sm:text-sm text-earth-300 font-sans leading-relaxed">
              {isVisited
                ? 'Este afluente está formalmente registrado como explorado y suma al porcentaje de descubrimiento del ecosistema.'
                : 'Registra este horizonte para dar por completada la exploración y avanzar hacia el desbloqueo de los créditos.'}
            </p>
          </div>

          <div className="shrink-0">
            {isVisited ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-forest-900 border border-jade-500/50 text-water-200 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-jade-400" />
                <span>✓ Horizonte registrado</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRegisterHorizon}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-solar-500 hover:bg-solar-400 text-forest-950 font-bold text-xs sm:text-sm shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Registrar este horizonte en la bitácora</span>
              </button>
            )}
          </div>
        </section>

        {/* Estado del Delta y Otros Afluentes */}
        <section className="space-y-4 pt-6 border-t border-forest-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-earth-300">
              Otros afluentes del delta:
            </h3>
            <span className="text-xs font-mono text-water-300">
              {progress.visitedTributaries.length} de 3 explorados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherTributaries.map((other) => {
              const isOtherVisited = progress.visitedTributaries.includes(other.id);
              return (
                <Link
                  key={other.id}
                  href={`/afluentes/${other.id}`}
                  className="p-4 rounded-xl border border-forest-800 bg-forest-950/70 hover:border-water-500 hover:bg-forest-900 transition-all flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-serif font-semibold text-earth-100 block">
                      {other.title}
                    </span>
                    <span className="text-xs text-earth-400">
                      {isOtherVisited ? '✓ Afluente visitado' : 'Por explorar'}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-water-400" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Pie de navegación */}
        <nav aria-label="Navegación del afluente" className="pt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/territorios/territorio-5"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-forest-900 hover:bg-forest-850 text-earth-200 text-xs font-medium border border-forest-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la bifurcación (Delta)</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-forest-900 hover:bg-forest-850 text-earth-200 text-xs font-medium border border-forest-700 transition-colors"
            >
              <Map className="w-3.5 h-3.5 text-editorial-accent" />
              <span>Volver al río (Mapa)</span>
            </Link>

            {areCreditsUnlocked && (
              <Link
                href="/creditos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-solar-500 text-forest-950 font-bold text-xs sm:text-sm shadow-md hover:bg-solar-400 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Acceder a los Créditos</span>
              </Link>
            )}
          </div>
        </nav>
      </article>
    </div>
  );
}
