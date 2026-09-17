'use client';

import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface InteractionConclusionProps {
  title?: string;
  copy: string;
  transitionLabel?: string;
  onContinue?: () => void;
}

export function InteractionConclusion({
  title = 'Territorio Cartografiado',
  copy,
  transitionLabel = 'Continuar Travesía',
  onContinue,
}: InteractionConclusionProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-8 rounded-xl border border-river-400/40 bg-river-900/60 p-6 md:p-8 backdrop-blur-sm text-earth-100 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-500"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-river-500/20 p-2 text-river-400 border border-river-400/30 shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-serif font-bold text-earth-50 tracking-wide">
            {title}
          </h3>
          <p className="text-earth-200 leading-relaxed font-sans text-base">
            {copy}
          </p>
          {onContinue && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onContinue}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-editorial-accent hover:bg-editorial-accent/90 text-white font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 focus-visible:ring-offset-2 focus-visible:ring-offset-canopy-950"
              >
                <span>{transitionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
