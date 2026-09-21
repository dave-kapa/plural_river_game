import type { Metadata } from 'next';
import './globals.css';
import { ProgressionProvider } from '@/lib/progression/ProgressionContext';
import { VisualSetProvider } from '@/lib/visual/VisualSetContext';
import { AudioProvider } from '@/lib/audio/AudioContext';
import { VisualSetSwitcher } from '@/components/visual/VisualSetSwitcher';
import { TopNav } from '@/components/navigation/TopNav';

export const metadata: Metadata = {
  title: 'Plural Gameful River — Travesía de Diseño Ecosistémico',
  description:
    'Micrositio interactivo sobre la integración de la capacidad gameful dentro del Método Plural.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-forest-950 text-earth-100 flex flex-col min-h-screen selection:bg-water-500 selection:text-white">
        {/* Enlace accesible para saltar directo al contenido */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-water-400 focus:text-forest-950 focus:rounded-md focus:font-semibold"
        >
          Saltar al contenido principal
        </a>

        <AudioProvider>
          <VisualSetProvider>
            <ProgressionProvider>
              <TopNav />
              <main id="main-content" className="flex-1 w-full flex flex-col">
                {children}
              </main>
              <VisualSetSwitcher />
              <footer className="border-t border-forest-900 py-6 text-center text-xs text-earth-400 font-mono">
                <p>Plural Gameful River — Ecosistema editorial de diseño participativo.</p>
              </footer>
            </ProgressionProvider>
          </VisualSetProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
