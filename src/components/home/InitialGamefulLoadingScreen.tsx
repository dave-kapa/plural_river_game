'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Compass, Sparkles, FastForward } from 'lucide-react';

interface InitialGamefulLoadingScreenProps {
  onComplete: () => void;
}

const SERIE_A_IMAGES = [
  '/assets/visual-sets/set-a/mapa-rio.png',
  '/assets/visual-sets/set-a/territorio-1.png',
  '/assets/visual-sets/set-a/territorio-2.png',
  '/assets/visual-sets/set-a/territorio-3.png',
  '/assets/visual-sets/set-a/territorio-4.png',
  '/assets/visual-sets/set-a/territorio-5.png',
];

const LOADING_PHRASES = [
  'Sintonizando corrientes, fuerzas y hábitats del cambio...',
  'Calibrando lentes de diseño participativo y ciencias del comportamiento...',
  'Mapeando las 4 escalas: persona, comunidad, acción colectiva y sistema...',
  'Articulando los 5 momentos del Método Plural...',
  'Abriendo el cauce hacia la confluencia y los afluentes del delta...',
];

const TOTAL_DURATION_MS = 10000;
const PHRASE_INTERVAL_MS = 2000;

export function InitialGamefulLoadingScreen({ onComplete }: InitialGamefulLoadingScreenProps) {
  const [bgImage, setBgImage] = useState<string>(SERIE_A_IMAGES[0]);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const completedRef = useRef<boolean>(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Selección aleatoria garantizada de la Serie A
    const randomIndex = Math.floor(Math.random() * SERIE_A_IMAGES.length);
    setBgImage(SERIE_A_IMAGES[randomIndex]);

    const startTime = performance.now();
    completedRef.current = false;

    const timer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
      setProgressPercent(pct);

      // Frase rotativa cada 2 segundos (5 frases en 10s)
      const phraseIdx = Math.min(
        LOADING_PHRASES.length - 1,
        Math.floor(elapsed / PHRASE_INTERVAL_MS)
      );
      setCurrentPhraseIndex(phraseIdx);

      if (elapsed >= TOTAL_DURATION_MS) {
        clearInterval(timer);
        if (!completedRef.current) {
          completedRef.current = true;
          setIsFadingOut(true);
          setTimeout(() => {
            onCompleteRef.current();
          }, 350);
        }
      }
    }, 30);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleSkip = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      setIsFadingOut(true);
      setTimeout(() => {
        onCompleteRef.current();
      }, 200);
    }
  };

  return (
    <div
      role="region"
      aria-label="Pantalla de carga inicial"
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-forest-950 text-earth-50 transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Fondo panorámico con imagen aleatoria de la Serie A */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Capas de oscurecimiento e iluminación editorial */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/60 to-forest-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-forest-950/40 to-forest-950/90" />
      </div>

      {/* Cabecera sutil con botón de salto */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/80 border border-jade-600/40 backdrop-blur-md text-xs font-mono uppercase tracking-widest text-water-300">
          <Sparkles className="w-3.5 h-3.5 text-solar-400" />
          <span>Experiencia Gameful</span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-900/70 hover:bg-forest-800 text-xs font-mono text-earth-300 hover:text-solar-300 border border-forest-700/80 transition-colors"
          aria-label="Saltar tiempo de carga"
        >
          <span>Saltar</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Núcleo central: Título y contenedor de carga prominente */}
      <main className="relative z-10 w-full max-w-2xl mx-auto px-6 py-8 text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-solar-300 font-semibold drop-shadow-sm">
            Plural × Gameful Design
          </h2>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-earth-50 tracking-tight leading-tight drop-shadow-lg">
            El río de la confluencia
          </h1>
        </div>

        {/* Módulo de carga que sobresale con relieve y resplandor neón turquesa/solar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-forest-950/90 border-2 border-jade-500/60 shadow-[0_0_50px_rgba(38,180,214,0.3)] backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-water-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-solar-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="font-medium tracking-wide">Iniciando sistemas del río</span>
            </span>
            <span className="text-solar-300 font-bold font-mono text-sm">
              {Math.floor(progressPercent)}%
            </span>
          </div>

          {/* Barra de progreso sobresaliente (altura destacada, marco, efecto de fluido activo) */}
          <div
            className="w-full h-6 sm:h-7 rounded-full bg-[#051510] p-1 border-2 border-water-400 shadow-[0_0_25px_rgba(38,180,214,0.45),inset_0_2px_8px_rgba(0,0,0,0.8)] overflow-hidden relative"
            role="progressbar"
            aria-valuenow={Math.floor(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Cargando experiencia"
          >
            {/* Relleno con gradiente vibrante, fluido activo y cabezal luminoso */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-water-500 via-jade-400 via-solar-400 to-water-500 animate-loading-water shadow-[0_0_20px_rgba(92,225,230,0.9)] relative transition-[width] duration-75 ease-linear flex items-center justify-end"
              style={{ width: `${Math.max(2, progressPercent)}%` }}
            >
              {/* Cabezal de gota / chispa luminosa brillante al frente del avance */}
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_15px_#5ce1e6] mr-0.5 shrink-0" />
              {/* Reflejo superior para volumen de agua */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent rounded-full pointer-events-none" />
            </div>
          </div>

          {/* Frases dinámicas del sistema que cambian cada 2 segundos */}
          <div className="min-h-[44px] flex items-center justify-center">
            <p
              key={currentPhraseIndex}
              className="text-xs sm:text-sm font-mono text-water-100 italic animate-in fade-in slide-in-from-bottom-2 duration-300 px-2 leading-relaxed"
            >
              {LOADING_PHRASES[currentPhraseIndex]}
            </p>
          </div>
        </div>
      </main>

      {/* Pie atmosférico */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-8 text-center">
        <span className="text-[11px] font-mono text-earth-400/70 tracking-wider">
          Mapeo de arquitectura participativa • Método Plural
        </span>
      </footer>
    </div>
  );
}
