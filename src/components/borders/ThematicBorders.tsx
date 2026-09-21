'use client';

import React from 'react';
import { LianaVineBorders } from '@/components/home/LianaVineBorders';

export { LianaVineBorders };

interface ThematicContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Contenedor verde con marco botánico de lianas y hojas
 */
export function LianaContainer({ children, className = '' }: ThematicContainerProps) {
  return (
    <div className={`relative ${className}`}>
      <LianaVineBorders />
      {children}
    </div>
  );
}

/**
 * Contenedor con borde de papiro desgastado y quemado
 */
export function BurntPapyrusContainer({ children, className = '' }: ThematicContainerProps) {
  return (
    <div className={`border-burnt-papyrus rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

/**
 * Marco con auténtico efecto metálico oro (borde nuevo con fondo original de contenedor)
 */
export function MetallicGoldFrame({
  children,
  className = '',
  innerClassName = '',
}: ThematicContainerProps & { innerClassName?: string }) {
  return (
    <div className={`border-metallic-gold ${className}`}>
      <div className={`border-metallic-gold-inner ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
