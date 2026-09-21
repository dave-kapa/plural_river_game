'use client';

import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { formatQuotation } from '@/lib/explorer/quotePersonalizer';

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
  const { explorerName } = useProgression();

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-metallic-gold mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="border-metallic-gold-inner p-6 md:p-8 bg-gradient-to-r from-forest-900/95 via-water-950/90 to-forest-900/95 backdrop-blur-md text-earth-100 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-solar-500/20 p-2.5 text-solar-300 border border-solar-500/40 shrink-0 shadow-inner">
          <Sparkles className="w-6 h-6 text-solar-400" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-solar-300 font-bold bg-solar-950/60 px-2.5 py-0.5 rounded border border-solar-500/30">
              Hallazgo Nuclear de la Travesía
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-earth-50 tracking-tight">
            {title}
          </h3>
          <p className="text-earth-200 leading-relaxed font-serif text-base sm:text-lg italic pt-1">
            {formatQuotation(copy, explorerName)}
          </p>
          {onContinue && (
            <div className="pt-3">
              <button
                type="button"
                onClick={onContinue}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-coral-500 to-solar-500 hover:from-coral-600 hover:to-solar-400 text-white font-serif font-bold text-sm shadow-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400"
              >
                <span>{transitionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
