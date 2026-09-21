'use client';

import React from 'react';

/**
 * LianaVineBorders
 * Marco botánico de lianas y hojas en los mismos tonos verdes del proyecto
 * (jade-500 #2d8a6e, jade-600 #1a5c4a, jade-400 #3db892).
 *
 * Se posiciona absolutamente sobre el contenedor para envolver los bordes
 * sin alterar la estructura interna ni los clics del usuario.
 */
export function LianaVineBorders() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 overflow-visible"
      aria-hidden="true"
    >
      {/* ======================= BORDE SUPERIOR ======================= */}
      <svg
        className="absolute -top-2 left-8 right-8 w-[calc(100%-4rem)] h-5 overflow-visible"
        viewBox="0 0 800 20"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,10 Q 100,3 200,11 T 400,9 T 600,11 T 800,10"
          fill="none"
          stroke="#1a5c4a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 0,11 Q 120,15 240,9 T 480,12 T 720,8 T 800,11"
          fill="none"
          stroke="#2d8a6e"
          strokeWidth="1.8"
          strokeDasharray="12 4 8 3"
        />
        {/* Hojitas a lo largo del tallo superior */}
        <path
          d="M 150,10 C 145,2 165,0 170,8 C 160,11 155,10 150,10 Z"
          fill="#2d8a6e"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
        <path
          d="M 280,10 C 275,18 295,20 300,12 C 290,9 285,10 280,10 Z"
          fill="#3db892"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
        <path
          d="M 460,9 C 455,1 475,-1 480,7 C 470,10 465,9 460,9 Z"
          fill="#2d8a6e"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
        <path
          d="M 620,11 C 615,19 635,21 640,13 C 630,10 625,11 620,11 Z"
          fill="#3db892"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
      </svg>

      {/* ======================= BORDE INFERIOR ======================= */}
      <svg
        className="absolute -bottom-2 left-8 right-8 w-[calc(100%-4rem)] h-5 overflow-visible"
        viewBox="0 0 800 20"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,10 Q 110,17 220,9 T 440,11 T 660,8 T 800,10"
          fill="none"
          stroke="#1a5c4a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 0,9 Q 90,4 200,12 T 420,8 T 640,12 T 800,9"
          fill="none"
          stroke="#2d8a6e"
          strokeWidth="1.8"
        />
        {/* Hojitas inferiores */}
        <path
          d="M 180,10 C 175,18 195,20 200,12 C 190,9 185,10 180,10 Z"
          fill="#2d8a6e"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
        <path
          d="M 360,10 C 355,2 375,0 380,8 C 370,11 365,10 360,10 Z"
          fill="#3db892"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
        <path
          d="M 540,10 C 535,18 555,20 560,12 C 550,9 545,10 540,10 Z"
          fill="#2d8a6e"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
      </svg>

      {/* ======================= BORDE IZQUIERDO ======================= */}
      <svg
        className="absolute top-8 bottom-8 -left-2 w-5 h-[calc(100%-4rem)] overflow-visible"
        viewBox="0 0 20 600"
        preserveAspectRatio="none"
      >
        <path
          d="M 10,0 Q 3,100 11,200 T 9,400 T 10,600"
          fill="none"
          stroke="#1a5c4a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 11,0 Q 16,120 9,250 T 12,500 T 10,600"
          fill="none"
          stroke="#2d8a6e"
          strokeWidth="1.8"
        />
        <path
          d="M 10,180 C 2,175 0,195 8,200 C 11,190 10,185 10,180 Z"
          fill="#2d8a6e"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
        <path
          d="M 10,380 C 18,375 20,395 12,400 C 9,390 10,385 10,380 Z"
          fill="#3db892"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
      </svg>

      {/* ======================= BORDE DERECHO ======================= */}
      <svg
        className="absolute top-8 bottom-8 -right-2 w-5 h-[calc(100%-4rem)] overflow-visible"
        viewBox="0 0 20 600"
        preserveAspectRatio="none"
      >
        <path
          d="M 10,0 Q 17,110 9,220 T 11,440 T 10,600"
          fill="none"
          stroke="#1a5c4a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 9,0 Q 4,90 12,200 T 8,420 T 10,600"
          fill="none"
          stroke="#2d8a6e"
          strokeWidth="1.8"
        />
        <path
          d="M 10,220 C 18,215 20,235 12,240 C 9,230 10,225 10,220 Z"
          fill="#2d8a6e"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
        <path
          d="M 10,430 C 2,425 0,445 8,450 C 11,440 10,435 10,430 Z"
          fill="#3db892"
          stroke="#1a5c4a"
          strokeWidth="0.8"
        />
      </svg>

      {/* ======================= ESQUINA SUPERIOR IZQUIERDA ======================= */}
      <svg
        className="absolute -top-3.5 -left-3.5 w-16 h-16 overflow-visible"
        viewBox="0 0 64 64"
      >
        <path
          d="M 0,38 C 12,36 18,24 24,18 C 30,12 36,8 50,4"
          fill="none"
          stroke="#1a5c4a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 6,48 C 14,40 22,26 26,16 C 30,10 40,6 58,0"
          fill="none"
          stroke="#2d8a6e"
          strokeWidth="2"
        />
        <path
          d="M 22,22 C 26,26 28,32 25,35 C 22,38 18,35 19,31 C 20,27 24,27 25,29"
          fill="none"
          stroke="#3db892"
          strokeWidth="1.2"
        />
        <path
          d="M 18,18 C 10,12 8,24 16,26 C 18,22 18,19 18,18 Z"
          fill="#1a5c4a"
          stroke="#0e2820"
          strokeWidth="0.8"
        />
        <path
          d="M 26,16 C 24,6 36,4 38,14 C 32,16 28,16 26,16 Z"
          fill="#2d8a6e"
          stroke="#143d32"
          strokeWidth="0.8"
        />
        <path
          d="M 34,11 C 36,2 48,3 46,12 C 41,13 36,12 34,11 Z"
          fill="#3db892"
          stroke="#1d5243"
          strokeWidth="0.8"
        />
      </svg>

      {/* ======================= ESQUINA SUPERIOR DERECHA ======================= */}
      <svg
        className="absolute -top-3.5 -right-3.5 w-16 h-16 overflow-visible"
        viewBox="0 0 64 64"
      >
        <path
          d="M 64,38 C 52,36 46,24 40,18 C 34,12 28,8 14,4"
          fill="none"
          stroke="#1a5c4a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 58,48 C 50,40 42,26 38,16 C 34,10 24,6 6,0"
          fill="none"
          stroke="#2d8a6e"
          strokeWidth="2"
        />
        <path
          d="M 42,22 C 38,26 36,32 39,35 C 42,38 46,35 45,31 C 44,27 40,27 39,29"
          fill="none"
          stroke="#3db892"
          strokeWidth="1.2"
        />
        <path
          d="M 46,18 C 54,12 56,24 48,26 C 46,22 46,19 46,18 Z"
          fill="#1a5c4a"
          stroke="#0e2820"
          strokeWidth="0.8"
        />
        <path
          d="M 38,16 C 40,6 28,4 26,14 C 32,16 36,16 38,16 Z"
          fill="#2d8a6e"
          stroke="#143d32"
          strokeWidth="0.8"
        />
        <path
          d="M 30,11 C 28,2 16,3 18,12 C 23,13 28,12 30,11 Z"
          fill="#3db892"
          stroke="#1d5243"
          strokeWidth="0.8"
        />
      </svg>

      {/* ======================= ESQUINA INFERIOR IZQUIERDA ======================= */}
      <svg
        className="absolute -bottom-3.5 -left-3.5 w-16 h-16 overflow-visible"
        viewBox="0 0 64 64"
      >
        <path
          d="M 0,26 C 12,28 18,40 24,46 C 30,52 36,56 50,60"
          fill="none"
          stroke="#1a5c4a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 6,16 C 14,24 22,38 26,48 C 30,54 40,58 58,64"
          fill="none"
          stroke="#2d8a6e"
          strokeWidth="2"
        />
        <path
          d="M 22,42 C 26,38 28,32 25,29 C 22,26 18,29 19,33 C 20,37 24,37 25,35"
          fill="none"
          stroke="#3db892"
          strokeWidth="1.2"
        />
        <path
          d="M 18,46 C 10,52 8,40 16,38 C 18,42 18,45 18,46 Z"
          fill="#1a5c4a"
          stroke="#0e2820"
          strokeWidth="0.8"
        />
        <path
          d="M 26,48 C 24,58 36,60 38,50 C 32,48 28,48 26,48 Z"
          fill="#2d8a6e"
          stroke="#143d32"
          strokeWidth="0.8"
        />
      </svg>

      {/* ======================= ESQUINA INFERIOR DERECHA ======================= */}
      <svg
        className="absolute -bottom-3.5 -right-3.5 w-16 h-16 overflow-visible"
        viewBox="0 0 64 64"
      >
        <path
          d="M 64,26 C 52,28 46,40 40,46 C 34,52 28,56 14,60"
          fill="none"
          stroke="#1a5c4a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 58,16 C 50,24 42,38 38,48 C 34,54 24,58 6,64"
          fill="none"
          stroke="#2d8a6e"
          strokeWidth="2"
        />
        <path
          d="M 42,42 C 38,38 36,32 39,29 C 42,26 46,29 45,33 C 44,37 40,37 39,35"
          fill="none"
          stroke="#3db892"
          strokeWidth="1.2"
        />
        <path
          d="M 46,46 C 54,52 56,40 48,38 C 46,42 46,45 46,46 Z"
          fill="#1a5c4a"
          stroke="#0e2820"
          strokeWidth="0.8"
        />
        <path
          d="M 38,48 C 40,58 28,60 26,50 C 32,48 36,48 38,48 Z"
          fill="#2d8a6e"
          stroke="#143d32"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}
