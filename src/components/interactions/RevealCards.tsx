'use client';

import React, { useState } from 'react';
import { InteractionConclusion } from './InteractionConclusion';
import { Eye, ChevronDown, Check } from 'lucide-react';

export interface RevealCardItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
}

export interface RevealCardsProps {
  cards: RevealCardItem[];
  instruction?: string;
  onComplete: (revealedIds: string[]) => void;
  conclusionCopy?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export function RevealCards({
  cards,
  instruction = 'Explora cada uno de los artefactos haciendo clic o navegando con teclado:',
  onComplete,
  conclusionCopy = 'Has revelado e inspeccionado todas las dimensiones de diseño.',
  onNext,
  nextLabel,
}: RevealCardsProps) {
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleCard = (id: string) => {
    let nextOpened: string[];
    if (openedIds.includes(id)) {
      nextOpened = openedIds.filter((item) => item !== id);
    } else {
      nextOpened = [...openedIds, id];
    }
    setOpenedIds(nextOpened);

    // Si todas las cartas han sido abiertas al menos una vez
    if (cards.every((c) => nextOpened.includes(c.id) || openedIds.includes(c.id))) {
      if (!isCompleted) {
        setIsCompleted(true);
        onComplete(cards.map((c) => c.id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-xl bg-earth-900/50 border border-canopy-700/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6 text-xs font-mono uppercase tracking-wider text-river-400">
          <Eye className="w-4 h-4" />
          <span>{instruction}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card) => {
            const isOpen = openedIds.includes(card.id);
            return (
              <div
                key={card.id}
                className={`rounded-xl border transition-all overflow-hidden flex flex-col ${
                  isOpen
                    ? 'bg-river-950/70 border-river-400/50 shadow-md ring-1 ring-river-400/30'
                    : 'bg-canopy-950/60 border-canopy-800 hover:border-canopy-600'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleCard(card.id)}
                  className="w-full p-5 text-left flex items-start justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isOpen && <Check className="w-4 h-4 text-river-400 shrink-0" />}
                      <h4 className="font-serif font-semibold text-earth-100 text-base">
                        {card.title}
                      </h4>
                    </div>
                    <div className="text-xs text-earth-300 font-sans">{card.subtitle}</div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-earth-300 transition-transform duration-300 shrink-0 mt-1 ${
                      isOpen ? 'rotate-180 text-river-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-earth-200 border-t border-canopy-800/60 font-sans leading-relaxed animate-in fade-in duration-300">
                    {card.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-canopy-800 flex items-center justify-between text-xs text-earth-300">
          <span>
            Artefactos explorados: {openedIds.length} de {cards.length}
          </span>
          {isCompleted && (
            <span className="text-river-300 font-semibold flex items-center gap-1">
              ✓ Inspección completada
            </span>
          )}
        </div>
      </div>

      {isCompleted && (
        <InteractionConclusion
          title="Horizontes Revelados"
          copy={conclusionCopy}
          onContinue={onNext}
          transitionLabel={nextLabel}
        />
      )}
    </div>
  );
}
