'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Compass, Sparkles, ArrowRight, User } from 'lucide-react';
import { useAudio } from '@/lib/audio/AudioContext';

interface ExplorerNameModalProps {
  isOpen: boolean;
  initialName?: string;
  onSave: (name: string) => void;
  onClose?: () => void;
}

export function ExplorerNameModal({
  isOpen,
  initialName = '',
  onSave,
  onClose,
}: ExplorerNameModalProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { startAudio } = useAudio();

  useEffect(() => {
    if (initialName) {
      setName(initialName);
    }
  }, [initialName]);

  useEffect(() => {
    if (isOpen) {
      // Enfocar el campo tras abrir
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Por favor introduce tu nombre o apodo de explorador para continuar.');
      return;
    }

    // Iniciar audio ambiental como respuesta a este gesto directo del usuario
    startAudio();

    onSave(trimmed);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="explorer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg p-0.5 rounded-3xl bg-gradient-to-br from-solar-400 via-jade-500 to-water-500 shadow-[0_0_50px_rgba(238,186,67,0.3)]">
        <div className="p-6 sm:p-8 rounded-[23px] bg-forest-950 text-earth-50 space-y-6">
          {/* Cabecera con insignia y brújula */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-500/10 border border-solar-400/40 text-solar-300 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-solar-400" />
              <span>Travesía Gameful • Método Plural</span>
            </div>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-forest-900 to-forest-800 border border-solar-400/50 flex items-center justify-center shadow-lg shadow-solar-500/10">
              <Compass className="w-7 h-7 text-solar-300 animate-spin" style={{ animationDuration: '12s' }} />
            </div>

            <h2
              id="explorer-modal-title"
              className="text-2xl sm:text-3xl font-serif font-bold text-earth-50 tracking-tight"
            >
              Bienvenido explorador
            </h2>

            <p className="text-sm sm:text-base text-earth-300 font-serif leading-relaxed">
              El río de la confluencia gamificada está a punto de abrirse ante ti. Registra tu nombre para personalizar tu bitácora de navegación, tus descubrimientos y tu recorrido por Plural X Gamify.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="explorer-name-input"
                className="block text-xs font-mono font-semibold uppercase tracking-wider text-water-200"
              >
                Introduce acá tu nombre:
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-water-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  ref={inputRef}
                  id="explorer-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Tu nombre o alias..."
                  maxLength={40}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-forest-900/90 border-2 border-jade-600/60 focus:border-solar-400 focus:ring-2 focus:ring-solar-400/30 text-earth-50 font-serif text-base placeholder-earth-400 outline-none transition-all shadow-inner"
                />
              </div>

              {error && (
                <p className="text-xs font-mono text-coral-400 animate-in fade-in duration-200">
                  {error}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-coral-500 via-coral-400 to-solar-500 hover:from-coral-600 hover:to-solar-400 text-white font-serif font-bold text-base shadow-xl hover:shadow-coral-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-water-300"
              >
                <span>Comenzar travesía</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <p className="text-[11px] font-mono text-center text-earth-400/70">
            Tu nombre se almacena de forma local para acompañar tu sesión, no se registra en ninguna base de datos.
          </p>
        </div>
      </div>
    </div>
  );
}
