'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { TRIBUTARIES_DATA } from '@/data/tributaries';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { Compass, CheckCircle2, ArrowRight, ArrowLeft, Award, HelpCircle, Briefcase, Sparkles } from 'lucide-react';

interface TributaryPageProps {
  params: { id: string };
}

export default function TributaryPage({ params }: TributaryPageProps) {
  const { id } = params;
  const tributary = TRIBUTARIES_DATA[id];

  const {
    progress,
    markTributaryVisited,
    registerDiscoveredItems,
    areCreditsUnlocked,
    setLastVisited,
  } = useProgression();

  const isVisited = (progress.visitedTributaries || []).includes(id);

  useEffect(() => {
    if (tributary) {
      setLastVisited(`/afluentes/${id}`);
    }
  }, [id, tributary, setLastVisited]);

  const handleRegisterHorizon = async () => {
    await markTributaryVisited(id);
    await registerDiscoveredItems(`t5:tributary:${id}`);
  };

  if (!tributary) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-6">
        <h1 className="text-2xl font-serif font-bold text-earth-50">Afluente no encontrado</h1>
        <p className="text-sm text-earth-300">Este afluente no figura en el delta.</p>
        <Link
          href="/territorios/territorio-5"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-river-700 text-white text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la bifurcación</span>
        </Link>
      </div>
    );
  }

  const otherTributaries = Object.values(TRIBUTARIES_DATA).filter((t) => t.id !== id);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
      {/* Cabecera del Afluente */}
      <header className="space-y-4 border-b border-canopy-800 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-editorial-accent">
            <Compass className="w-4 h-4" />
            <span>Afluente del Delta</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full border ${
            isVisited
              ? 'text-river-300 bg-river-950 border-river-700'
              : 'text-earth-400 bg-canopy-950 border-canopy-800'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isVisited ? 'Afluente registrado' : 'Por registrar'}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-earth-50 leading-tight">
          {tributary.title}
        </h1>

        <p className="text-lg md:text-xl font-serif italic text-river-300">
          {tributary.subtitle}
        </p>

        <div className="p-5 rounded-xl bg-canopy-900/70 border border-canopy-800 text-sm sm:text-base text-earth-100 font-sans leading-relaxed">
          <strong className="block text-xs font-mono uppercase text-river-400 mb-1">
            Propósito del afluente:
          </strong>
          {tributary.purpose}
        </div>
      </header>

      {/* Proyectos a los que puede aplicarse */}
      <section aria-labelledby="projects-title" className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-editorial-accent tracking-wider">
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
              className="p-3.5 rounded-xl bg-canopy-950 border border-canopy-800 text-xs sm:text-sm text-earth-200 flex items-start gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-river-400 mt-2 shrink-0" />
              <span>{proj}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Preguntas para explorar juntos */}
      <section aria-labelledby="questions-title" className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-river-300 tracking-wider">
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
              className="p-4 rounded-xl bg-canopy-950/60 border border-canopy-800/80 text-xs sm:text-sm text-earth-200 font-serif italic flex items-start gap-3"
            >
              <span className="text-xs font-mono text-river-400 font-semibold shrink-0">
                0{idx + 1}
              </span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Posible punto de partida & Copy del afluente */}
      <section className="space-y-4 pt-2">
        <div className="p-6 rounded-2xl bg-canopy-900/60 border border-canopy-700 space-y-2">
          <span className="text-xs font-mono uppercase text-editorial-gold font-semibold block">
            Posible Punto de Partida
          </span>
          <p className="text-sm sm:text-base text-earth-100 font-sans leading-relaxed">
            {tributary.possibleStartingPoint}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-river-950/80 border border-river-700 text-earth-100 font-serif text-base sm:text-lg italic leading-relaxed">
          “{tributary.tributaryCopy}”
        </div>
      </section>

      {/* Acción explícita para registrar este afluente en la bitácora */}
      <section aria-labelledby="tributary-action-title" className="p-6 sm:p-8 rounded-2xl bg-canopy-950/90 border border-river-600/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-river-300">
            <Sparkles className="w-4 h-4 text-editorial-accent" />
            <span>Registro de Travesía</span>
          </div>
          <h3 id="tributary-action-title" className="font-serif font-bold text-lg sm:text-xl text-earth-50">
            {isVisited ? 'Horizonte integrado en tu bitácora' : '¿Completaste la lectura de este horizonte?'}
          </h3>
          <p className="text-xs sm:text-sm text-earth-300 font-sans leading-relaxed">
            {isVisited
              ? 'Este afluente está formalmente registrado como explorado y suma al porcentaje de descubrimiento del ecosistema.'
              : 'Registra este horizonte para dar por completada la exploración y avanzar hacia el desbloqueo de los créditos.'}
          </p>
        </div>

        <div className="shrink-0">
          {isVisited ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-river-950 border border-river-500/50 text-river-200 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-editorial-accent" />
              <span>✓ Horizonte registrado</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRegisterHorizon}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-editorial-accent hover:bg-editorial-accent/90 text-white font-medium text-xs sm:text-sm shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Registrar este horizonte en la bitácora</span>
            </button>
          )}
        </div>
      </section>

      {/* Estado del Delta y Otros Afluentes */}
      <section className="space-y-4 pt-6 border-t border-canopy-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-earth-300">
            Otros afluentes del delta:
          </h3>
          <span className="text-xs font-mono text-river-300">
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
                className="p-4 rounded-xl border border-canopy-800 bg-canopy-950 hover:border-river-500 hover:bg-canopy-900 transition-all flex items-center justify-between text-sm"
              >
                <div>
                  <span className="font-serif font-semibold text-earth-100 block">
                    {other.title}
                  </span>
                  <span className="text-xs text-earth-400">
                    {isOtherVisited ? '✓ Afluente visitado' : 'Por explorar'}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-river-400" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Pie de navegación */}
      <nav aria-label="Navegación del afluente" className="pt-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/territorios/territorio-5"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-canopy-900 hover:bg-canopy-800 text-earth-200 text-xs font-medium border border-canopy-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la bifurcación (Delta)</span>
        </Link>

        {areCreditsUnlocked ? (
          <Link
            href="/creditos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-editorial-gold text-canopy-950 font-bold text-sm shadow-md hover:brightness-110 transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Acceder a los Créditos de la Travesía</span>
          </Link>
        ) : (
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-canopy-900 hover:bg-canopy-800 text-earth-200 text-xs border border-canopy-700 transition-colors"
          >
            <span>Volver al río</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </nav>
    </article>
  );
}
