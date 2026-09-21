'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface AudioContextValue {
  isMuted: boolean;
  isPlaying: boolean;
  toggleMute: () => void;
  startAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextValue | null>(null);

const AUDIO_MUTED_KEY = 'plural_audio_muted';
const AUDIO_SRC = '/audio/ambiente.mp3';

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);

  // Inicializar estado y elemento de audio en el cliente
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Cargar preferencia previa de silencio (por defecto: false / sonido activo)
    const savedMuted = window.localStorage.getItem(AUDIO_MUTED_KEY);
    const initialMuted = savedMuted === 'true';
    setIsMuted(initialMuted);

    // Crear y configurar audio element
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0.45; // Volumen ambiental armónico
    audio.muted = initialMuted;
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Intentar reproducción automática si el navegador lo permite
    const tryAutoplay = async () => {
      try {
        if (!initialMuted) {
          await audio.play();
        }
      } catch {
        // Política de autoplay del navegador: esperará al primer gesto del usuario
      }
    };
    tryAutoplay();

    // Escuchar el primer clic/interacción global para desbloquear autoplay si estaba pendiente
    const handleFirstInteraction = async () => {
      if (userInteractedRef.current) return;
      userInteractedRef.current = true;
      if (audioRef.current && !audioRef.current.muted && audioRef.current.paused) {
        try {
          await audioRef.current.play();
        } catch {
          // Si el archivo aún está cargando o falla, no bloquear la app
        }
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Sincronizar estado de mute con el elemento de audio y localStorage
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(AUDIO_MUTED_KEY, String(next));
      }
      if (audioRef.current) {
        audioRef.current.muted = next;
        if (!next && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  // Iniciar audio explícitamente desde acciones como el botón del modal
  const startAudio = useCallback(async () => {
    userInteractedRef.current = true;
    if (audioRef.current) {
      if (!isMuted && audioRef.current.paused) {
        try {
          await audioRef.current.play();
        } catch (err) {
          console.warn('Audio play request failed or blocked:', err);
        }
      }
    }
  }, [isMuted]);

  return (
    <AudioContext.Provider value={{ isMuted, isPlaying, toggleMute, startAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
}
