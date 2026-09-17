'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetTraversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetTraversalModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetTraversalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      aria-describedby="reset-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl bg-canopy-950 border border-editorial-accent/50 p-6 md:p-8 shadow-2xl text-earth-100 space-y-5"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-editorial-accent/20 text-editorial-accent border border-editorial-accent/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 id="reset-modal-title" className="font-serif font-bold text-lg text-earth-50">
              Reiniciar la travesía
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-earth-400 hover:text-earth-200 p-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p id="reset-modal-desc" className="text-sm text-earth-300 font-sans leading-relaxed">
          Esta acción borrará el progreso de la experiencia y cerrará nuevamente los territorios.
          <br /><br />
          ¿Quieres volver al comienzo?
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-canopy-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-earth-200 hover:bg-canopy-900 border border-canopy-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
          >
            Conservar mi recorrido
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-editorial-accent hover:bg-editorial-accent/90 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
          >
            Comenzar nuevamente
          </button>
        </div>
      </div>
    </div>
  );
}
