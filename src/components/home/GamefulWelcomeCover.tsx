'use client';

import React from 'react';
import { ArrowDown, Play, Sparkles, User } from 'lucide-react';
import { useProgression } from '@/lib/progression/ProgressionContext';

interface GamefulWelcomeCoverProps {
  onEnterClicked: () => void;
}

export function GamefulWelcomeCover({ onEnterClicked }: GamefulWelcomeCoverProps) {
  const { explorerName } = useProgression();

  return (
    <section
      aria-label="Portada escénica de bienvenida"
      className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-forest-950 text-earth-50"
    >
      {/* Fondo panorámico con gradientes atmosféricos */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
        style={{
          backgroundImage: 'url(/assets/visual-sets/portada.png)',
        }}
        role="img"
        aria-label="Ilustración panorámica del cauce fluvial y la selva tropical"
      >
        {/* Capas de iluminación editorial calibradas (punto medio de calidez y legibilidad) */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/30 to-forest-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/50 via-transparent to-forest-950/50" />
      </div>

      {/* Cabecera superior de la portada: Identidad */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-12 flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-forest-900/80 border border-jade-500/40 backdrop-blur-md shadow-lg text-xs font-mono tracking-widest text-water-200">
          <Sparkles className="w-3.5 h-3.5 text-solar-400" />
          <span className="font-semibold uppercase">Plural × Gameful Design</span>
        </div>

        {explorerName ? (
          <div className="flex items-center gap-2 text-xs font-mono text-solar-300 bg-forest-950/80 px-3 py-1.5 rounded-full border border-solar-400/40 backdrop-blur-sm">
            <User className="w-3.5 h-3.5 text-solar-400" />
            <span>Explorador: <strong className="text-solar-200">{explorerName}</strong></span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-earth-300/80 bg-forest-950/60 px-3 py-1 rounded-md border border-forest-800 backdrop-blur-sm">
            <span>Perspectiva Ecosistémica</span>
          </div>
        )}
      </header>

      {/* Núcleo central de la portada */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center space-y-6">
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-solar-300 drop-shadow-sm font-medium">
            Travesía de Diseño Participativo
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-earth-50 tracking-tight leading-[1.08] drop-shadow-md">
            «El cambio es un ecosistema»
          </h1>
          <p className="text-base sm:text-xl text-earth-200 font-serif italic max-w-2xl mx-auto drop-shadow-sm">
            Un recorrido fluvial por la arquitectura lúdica, las capacidades colectivas y la confluencia de diseño del Método Plural.
          </p>
        </div>

        {/* Botón de Entrada a la travesía */}
        <div className="pt-4 max-w-md mx-auto min-h-[100px] flex flex-col items-center justify-center">
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-500">
            <button
              type="button"
              onClick={onEnterClicked}
              className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-xl bg-gradient-to-r from-coral-500 via-coral-400 to-solar-500 hover:from-coral-600 hover:to-solar-400 text-white font-serif font-bold text-lg sm:text-xl shadow-[0_8px_30px_rgba(214,90,64,0.4)] transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-water-300"
            >
              <Play className="w-5 h-5 fill-current text-white shrink-0 group-hover:translate-x-0.5 transition-transform" />
              <span>Entrar en la travesía</span>
            </button>
            <p className="text-xs font-mono uppercase tracking-wider text-water-200 drop-shadow-sm">
              Comienza la exploración conceptual del río
            </p>
          </div>
        </div>
      </div>

      {/* Pie de portada con indicación para descender */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-8 flex flex-col items-center gap-2 text-center">
        <button
          type="button"
          onClick={onEnterClicked}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-earth-300/80 hover:text-earth-50 transition-colors"
        >
          <span>Descubrir premisas y preguntas del viaje</span>
          <ArrowDown className="w-3.5 h-3.5 text-solar-400 animate-bounce" />
        </button>
      </footer>
    </section>
  );
}
