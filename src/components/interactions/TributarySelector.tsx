'use client';

import React from 'react';
import Link from 'next/link';
import { TRIBUTARIES_DATA } from '@/data/tributaries';
import { InteractionConclusion } from './InteractionConclusion';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface TributarySelectorProps {
  visitedTributaries: string[];
  onCompleteAll?: () => void;
  conclusionCopy?: string;
  onContinueCredits?: () => void;
  creditsLabel?: string;
}

export function TributarySelector({
  visitedTributaries,
  conclusionCopy = 'Has explorado los tres afluentes del delta. El camino hacia los créditos y el epílogo está abierto.',
  onContinueCredits,
  creditsLabel = 'Ver Créditos y Cierre',
}: TributarySelectorProps) {
  const allTributaryKeys = Object.keys(TRIBUTARIES_DATA);
  const allVisited = allTributaryKeys.every((k) => visitedTributaries.includes(k));

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-xl bg-earth-900/50 border border-canopy-700/60 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-river-400">
            <Compass className="w-4 h-4" />
            <span>Tres afluentes divergentes (explóralos en cualquier orden)</span>
          </div>
          <span className="text-xs font-mono text-earth-300">
            {visitedTributaries.length} de {allTributaryKeys.length} afluentes visitados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {allTributaryKeys.map((key) => {
            const trib = TRIBUTARIES_DATA[key];
            const isVisited = visitedTributaries.includes(key);

            return (
              <div
                key={key}
                className={`rounded-xl border p-6 flex flex-col justify-between transition-all ${
                  isVisited
                    ? 'bg-river-950/80 border-river-400/50 shadow-md ring-1 ring-river-400/30'
                    : 'bg-canopy-950/60 border-canopy-800 hover:border-river-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-editorial-accent">
                      Afluente
                    </span>
                    {isVisited && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-river-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Explorado</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-earth-50 text-lg mb-2">
                    {trib.title}
                  </h4>

                  <p className="text-xs font-sans text-earth-200 leading-relaxed mb-4">
                    {trib.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-canopy-800/80 mt-2">
                  <Link
                    href={`/afluentes/${key}`}
                    className="inline-flex items-center justify-between w-full px-4 py-2 rounded-lg bg-canopy-900 hover:bg-river-800 text-earth-100 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
                  >
                    <span>{isVisited ? 'Revisitar afluente' : 'Adentrarse en este cauce'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {allVisited && (
        <InteractionConclusion
          title="Delta Fluvial Completo"
          copy={conclusionCopy}
          transitionLabel={creditsLabel}
          onContinue={onContinueCredits}
        />
      )}
    </div>
  );
}
