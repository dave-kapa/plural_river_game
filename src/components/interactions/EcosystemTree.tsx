'use client';

import React, { useState } from 'react';
import { InteractionConclusion } from './InteractionConclusion';
import { GitBranch, CheckCircle2 } from 'lucide-react';

export interface EcosystemNode {
  id: string;
  label: string;
  layer: 'raíz' | 'tronco' | 'ramaje' | 'fruto';
  description: string;
  systemicRole: string;
}

export interface EcosystemTreeProps {
  nodes: EcosystemNode[];
  instruction?: string;
  onComplete: (visitedNodeIds: string[]) => void;
  conclusionCopy?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export function EcosystemTree({
  nodes,
  instruction = 'Explora los nodos del ecosistema para comprender las relaciones sistémicas:',
  onComplete,
  conclusionCopy = 'Has explorado todas las capas del ecosistema.',
  onNext,
  nextLabel,
}: EcosystemTreeProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>(nodes[0]?.id || '');
  const [visitedNodes, setVisitedNodes] = useState<string[]>([nodes[0]?.id || '']);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectNode = (id: string) => {
    setActiveNodeId(id);
    const nextVisited = Array.from(new Set([...visitedNodes, id]));
    setVisitedNodes(nextVisited);

    if (nextVisited.length === nodes.length && !isCompleted) {
      setIsCompleted(true);
      onComplete(nextVisited);
    }
  };

  const currentNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-xl bg-earth-900/50 border border-canopy-700/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6 text-xs font-mono uppercase tracking-wider text-river-400">
          <GitBranch className="w-4 h-4" />
          <span>{instruction}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Navegación de nodos / capas del árbol */}
          <div className="space-y-2 md:col-span-1">
            <h4 className="text-xs font-mono uppercase tracking-wider text-earth-300 mb-2">
              Capas del Ecosistema
            </h4>
            {nodes.map((node) => {
              const isSelected = node.id === activeNodeId;
              const isVisited = visitedNodes.includes(node.id);

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleSelectNode(node.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all border flex items-center justify-between text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                    isSelected
                      ? 'bg-river-900 border-river-400 text-earth-50 shadow-md ring-1 ring-river-400'
                      : isVisited
                      ? 'bg-canopy-950/80 border-canopy-700 text-earth-200 hover:border-river-500'
                      : 'bg-canopy-950/40 border-canopy-800 text-earth-300 hover:border-canopy-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-river-400"></span>
                    <span className="font-serif">{node.label}</span>
                  </div>
                  {isVisited && (
                    <CheckCircle2 className="w-4 h-4 text-river-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel de detalle del nodo activo */}
          {currentNode && (
            <div className="md:col-span-2 p-6 rounded-xl border border-canopy-700 bg-canopy-950/80 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-canopy-800 pb-3">
                  <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-river-950 border border-river-700 text-river-300">
                    Estrato: {currentNode.layer}
                  </span>
                  <span className="text-xs font-mono text-earth-400">
                    Nodo {visitedNodes.indexOf(currentNode.id) + 1} de {nodes.length}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-semibold text-earth-50">
                  {currentNode.label}
                </h3>

                <p className="text-sm font-sans text-earth-200 leading-relaxed">
                  {currentNode.description}
                </p>

                <div className="p-3 rounded-lg bg-canopy-900/60 border border-canopy-800 text-xs text-earth-300">
                  <strong className="text-river-300 font-mono">Función sistémica: </strong>
                  {currentNode.systemicRole}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-canopy-800 text-xs text-earth-400">
                Navega todos los estratos para completar el mapeo ecológico.
              </div>
            </div>
          )}
        </div>
      </div>

      {isCompleted && (
        <InteractionConclusion
          title="Ecosistema Mapeado"
          copy={conclusionCopy}
          onContinue={onNext}
          transitionLabel={nextLabel}
        />
      )}
    </div>
  );
}
