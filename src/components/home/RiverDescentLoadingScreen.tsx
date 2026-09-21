'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface RiverDescentLoadingScreenProps {
  onComplete: () => void;
}

const SERIE_B_IMAGES = [
  '/assets/visual-sets/set-b/mapa-rio.png',
  '/assets/visual-sets/set-b/territorio-1.png',
  '/assets/visual-sets/set-b/territorio-2.png',
  '/assets/visual-sets/set-b/territorio-3.png',
  '/assets/visual-sets/set-b/territorio-4.png',
  '/assets/visual-sets/set-b/territorio-5.png',
];

const TOTAL_DURATION_MS = 5000;
const IMAGE_CHANGE_INTERVAL_MS = 2000;

export function RiverDescentLoadingScreen({ onComplete }: RiverDescentLoadingScreenProps) {
  // Imagen actual y siguiente para transición suave
  const [currentImage, setCurrentImage] = useState<string>(SERIE_B_IMAGES[0]);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const completedRef = useRef<boolean>(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const lastImageIndexRef = useRef<number>(0);

  useEffect(() => {
    // Selección inicial aleatoria
    const initialIdx = Math.floor(Math.random() * SERIE_B_IMAGES.length);
    lastImageIndexRef.current = initialIdx;
    setCurrentImage(SERIE_B_IMAGES[initialIdx]);

    // Bucle de cambio de imagen cada 2 segundos
    const imageInterval = setInterval(() => {
      let nextIdx = Math.floor(Math.random() * SERIE_B_IMAGES.length);
      if (nextIdx === lastImageIndexRef.current) {
        nextIdx = (nextIdx + 1) % SERIE_B_IMAGES.length;
      }
      lastImageIndexRef.current = nextIdx;
      setCurrentImage(SERIE_B_IMAGES[nextIdx]);
    }, IMAGE_CHANGE_INTERVAL_MS);

    const startTime = performance.now();
    completedRef.current = false;

    // Temporizador de alta precisión para la barra de carga (5s)
    const progressTimer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
      setProgressPercent(pct);

      if (elapsed >= TOTAL_DURATION_MS) {
        clearInterval(progressTimer);
        clearInterval(imageInterval);
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
      clearInterval(imageInterval);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div
      role="region"
      aria-label="Transición hacia el río"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-forest-950 text-earth-50 transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Fondo con imágenes de Serie B rotando con fundido cruzado */}
      <div
        key={currentImage}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105 animate-in fade-in zoom-in-95"
        style={{ backgroundImage: `url(${currentImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/85 via-forest-950/65 to-forest-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--tw-gradient-stops))] via-forest-950/40 to-forest-950/90" />
      </div>

      {/* Contenido central de la transición */}
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/85 border border-water-400/50 backdrop-blur-md shadow-lg text-xs font-mono tracking-widest text-water-300">
          <Sparkles className="w-3.5 h-3.5 text-solar-400 animate-pulse" />
          <span className="uppercase">Transición Fluvial</span>
        </div>

        {/* Texto solicitado: Adentrándose en el río */}
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-earth-50 tracking-tight leading-tight drop-shadow-md">
          Adentrándose en el río...
        </h2>

        <p className="text-xs sm:text-sm font-mono text-water-200/90 drop-shadow-sm max-w-sm mx-auto">
          Preparando la corriente principal y las estaciones cartográficas
        </p>

        {/* Módulo de carga que sobresale con relieve y resplandor neón turquesa */}
        <div className="p-6 sm:p-8 rounded-3xl bg-forest-950/90 border-2 border-jade-500/60 shadow-[0_0_40px_rgba(38,180,214,0.35)] backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-water-200">
              <Compass className="w-4 h-4 text-solar-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="font-medium tracking-wide">Navegando cauce hacia el mapa</span>
            </span>
            <span className="text-solar-300 font-bold font-mono text-base">
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
            aria-label="Adentrándose en el río"
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

          <p className="text-[11px] font-mono text-earth-300/80 italic">
            Conectando corrientes • Serie B en navegación
          </p>
        </div>
      </div>
    </div>
  );
}
