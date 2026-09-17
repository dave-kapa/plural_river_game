'use client';

import React from 'react';
import Link from 'next/link';
import { TRIBUTARIES_DATA } from '@/data/tributaries';
import { Check, Sparkles, Award } from 'lucide-react';

interface TributariesBranchProps {
  isTerritory5Unlocked: boolean;
  visitedTributaries: string[];
  creditsUnlocked: boolean;
}

export function TributariesBranch({
  isTerritory5Unlocked,
  visitedTributaries,
  creditsUnlocked,
}: TributariesBranchProps) {
  const allTributaries = Object.values(TRIBUTARIES_DATA);

  return (
    <div className="w-full mt-12 p-6 md:p-8 rounded-2xl bg-canopy-950/80 border border-canopy-800/80 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-canopy-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
            El Delta Fluvial
          </span>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-earth-50 mt-1">
            Los Tres Afluentes y la Desembocadura
          </h3>
          <p className="text-xs md:text-sm text-earth-300 mt-1 max-w-xl">
            {isTerritory5Unlocked
              ? 'El cauce principal se ramifica. Puedes navegar los tres afluentes en cualquier orden. Al recorrerlos todos, la desembocadura revelará los créditos.'
              : 'Este tramo se desbloqueará una vez completado el Territorio 4.'}
          </p>
        </div>

        {creditsUnlocked && (
          <Link
            href="/creditos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-editorial-gold text-canopy-950 font-medium text-sm hover:brightness-110 shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
          >
            <Award className="w-4 h-4" />
            <span>Acceder a Créditos y Cierre</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
        {allTributaries.map((trib) => {
          const isVisited = visitedTributaries.includes(trib.id);

          if (!isTerritory5Unlocked) {
            return (
              <div
                key={trib.id}
                className="p-5 rounded-xl border border-canopy-900 bg-canopy-950/40 text-earth-400/50 cursor-not-allowed"
              >
                <div className="text-xs font-mono mb-2">Afluente Bloqueado</div>
                <h4 className="font-serif font-semibold text-base mb-1">{trib.title}</h4>
                <p className="text-xs">{trib.subtitle}</p>
              </div>
            );
          }

          return (
            <Link
              key={trib.id}
              href={`/afluentes/${trib.id}`}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                isVisited
                  ? 'bg-river-950/70 border-river-400/60 text-earth-100 shadow-md ring-1 ring-river-400/30'
                  : 'bg-canopy-900/60 border-canopy-700 text-earth-200 hover:border-river-400 hover:bg-canopy-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono uppercase text-editorial-accent">
                    Afluente
                  </span>
                  {isVisited && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-river-300">
                      <Check className="w-3.5 h-3.5" />
                      <span>Explorado</span>
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-base md:text-lg text-earth-50 group-hover:text-river-200 transition-colors">
                  {trib.title}
                </h4>
                <p className="text-xs font-sans text-earth-300 mt-2 leading-relaxed">
                  {trib.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-canopy-800 text-xs font-medium text-river-300 flex items-center justify-between">
                <span>{isVisited ? 'Revisitar afluente →' : 'Explorar cauce →'}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
