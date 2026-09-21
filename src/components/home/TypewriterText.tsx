'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms por carácter
  delay?: number; // ms antes de iniciar
  className?: string;
  cursorClassName?: string;
  startTrigger?: boolean; // Si es true, inicia
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 28,
  delay = 200,
  className = '',
  cursorClassName = 'text-solar-500 font-normal ml-0.5 animate-pulse',
  startTrigger = true,
  onComplete,
}: TypewriterTextProps) {
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Si prefiere reducción de movimiento, mostrar todo de inmediato
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedLength(text.length);
      setHasCompleted(true);
      onComplete?.();
      return;
    }

    if (!startTrigger || hasCompleted) return;

    // Delay inicial antes de escribir
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      let currentIdx = 0;

      const typeNextChar = () => {
        currentIdx += 1;
        setDisplayedLength(currentIdx);

        if (currentIdx < text.length) {
          // Pequeña variación natural en la velocidad de tecleo (typewriter natural)
          const naturalVariation = Math.random() * 15 - 7;
          const nextSpeed = Math.max(10, speed + naturalVariation);
          timeoutRef.current = setTimeout(typeNextChar, nextSpeed);
        } else {
          setIsTyping(false);
          setHasCompleted(true);
          onComplete?.();
        }
      };

      timeoutRef.current = setTimeout(typeNextChar, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, delay, startTrigger, hasCompleted, onComplete]);

  // Permitir clic para completar inmediatamente si el usuario desea leer de golpe
  const handleSkipTyping = () => {
    if (!hasCompleted) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDisplayedLength(text.length);
      setIsTyping(false);
      setHasCompleted(true);
      onComplete?.();
    }
  };

  const visibleText = text.slice(0, displayedLength);

  return (
    <p
      ref={containerRef}
      onClick={handleSkipTyping}
      title={!hasCompleted ? 'Haz clic para mostrar todo el texto' : undefined}
      className={`${className} ${!hasCompleted ? 'cursor-pointer select-text' : ''}`}
    >
      <span>{visibleText}</span>
      {isTyping && (
        <span className={cursorClassName} aria-hidden="true">
          |
        </span>
      )}
    </p>
  );
}
