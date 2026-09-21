'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, FastForward, Sparkles, BookOpen } from 'lucide-react';

interface ManifestoTypewriterProps {
  paragraphs: string[];
  startTrigger?: boolean;
}

export function ManifestoTypewriter({
  paragraphs,
  startTrigger = false,
}: ManifestoTypewriterProps) {
  // Índice del párrafo que se está escribiendo actualmente
  const [currentParaIdx, setCurrentParaIdx] = useState<number>(0);
  // Cuántos caracteres del párrafo actual se han mostrado
  const [charCount, setCharCount] = useState<number>(0);
  // Estado de reproducción
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedOnceRef = useRef<boolean>(false);

  // Iniciar cuando startTrigger pasa a true
  useEffect(() => {
    if (startTrigger && !hasStartedOnceRef.current) {
      hasStartedOnceRef.current = true;
      startTypingFromScratch();
    }
  }, [startTrigger]);

  const startTypingFromScratch = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentParaIdx(0);
    setCharCount(0);
    setIsFinished(false);
    setIsPlaying(true);

    let pIdx = 0;
    let cIdx = 0;

    const typeStep = () => {
      if (pIdx >= paragraphs.length) {
        setIsPlaying(false);
        setIsFinished(true);
        return;
      }

      const text = paragraphs[pIdx];
      cIdx += 1;
      setCharCount(cIdx);
      setCurrentParaIdx(pIdx);

      if (cIdx < text.length) {
        const char = text[cIdx - 1];
        let delay = 18; // velocidad base fluida
        if (char === '.' || char === ':') delay = 160; // pausa natural en puntos
        else if (char === ',' || char === ';') delay = 90; // pausa en comas
        timeoutRef.current = setTimeout(typeStep, delay);
      } else {
        // Párrafo completado: pausa antes del siguiente
        pIdx += 1;
        cIdx = 0;
        timeoutRef.current = setTimeout(typeStep, 350);
      }
    };

    timeoutRef.current = setTimeout(typeStep, 200);
  };

  const handleShowAll = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentParaIdx(paragraphs.length);
    setCharCount(paragraphs[paragraphs.length - 1]?.length || 0);
    setIsPlaying(false);
    setIsFinished(true);
  };

  const handleReplay = () => {
    startTypingFromScratch();
  };

  // Párrafos completados anteriores al actual
  const completedParagraphs = paragraphs.slice(0, currentParaIdx);
  // Párrafo actualmente en escritura
  const activeParagraph = currentParaIdx < paragraphs.length ? paragraphs[currentParaIdx] : null;
  const activeVisibleText = activeParagraph ? activeParagraph.slice(0, charCount) : '';

  return (
    <div
      ref={containerRef}
      className="p-6 sm:p-10 rounded-2xl border-burnt-papyrus text-parchment-ink space-y-5 relative select-text"
    >
      {/* Cabecera del manifiesto con controles de animación visibles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#a87a48]/40">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6b471c]">
          <BookOpen className="w-4 h-4 text-[#8a4b18]" />
          <span className="font-semibold text-[#3d240d]">Manifiesto de Apertura Fluvial</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Indicador de estado de la animación */}
          {isPlaying && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-solar-500/20 text-solar-700 text-[11px] font-mono border border-solar-500/30 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-solar-500" />
              <span>Escribiendo en vivo...</span>
            </span>
          )}

          {isPlaying && (
            <button
              type="button"
              onClick={handleShowAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-parchment-200 hover:bg-parchment-300 text-[11px] font-mono text-parchment-ink border border-parchment-400 transition-colors"
              title="Mostrar todo el texto inmediatamente"
            >
              <FastForward className="w-3 h-3" />
              <span>Mostrar todo</span>
            </button>
          )}

          {isFinished && (
            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-forest-900/90 hover:bg-forest-850 text-[11px] font-mono text-water-200 border border-jade-600/60 shadow-sm transition-all hover:scale-105 active:scale-95"
              title="Volver a ver la animación de escritura"
            >
              <RotateCcw className="w-3 h-3 text-solar-400" />
              <span>Reproducir animación</span>
            </button>
          )}
        </div>
      </div>

      {/* Cuerpo del manifiesto con efecto typewriter secuencial */}
      <div className="space-y-4 text-base sm:text-lg font-serif leading-relaxed">
        {/* Párrafos ya terminados */}
        {completedParagraphs.map((p, idx) => (
          <p key={idx} className="text-parchment-ink/95">
            {p}
          </p>
        ))}

        {/* Párrafo activo escribiéndose con cursor parpadeante */}
        {activeParagraph && (
          <p className="text-parchment-ink/95 font-medium">
            <span>{activeVisibleText}</span>
            {isPlaying && (
              <span
                className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 ml-1 bg-coral-500 animate-pulse align-middle"
                aria-hidden="true"
              />
            )}
          </p>
        )}

        {/* Si aún no ha iniciado, mostrar el primer párrafo con cursor listo o placeholder */}
        {!isPlaying && !isFinished && (
          <p className="text-parchment-ink/60 italic text-sm font-mono flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-solar-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Esperando lectura del manifiesto...</span>
          </p>
        )}
      </div>
    </div>
  );
}
