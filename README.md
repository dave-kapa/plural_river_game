# Plural Gameful River

Estructura técnica inicial para el micrositio interactivo **Plural Gameful River**, una experiencia web breve y navegable diseñada como una travesía fluvial por un ecosistema tropical editorial, para presentar cómo la capacidad de diseño gameful se integra dentro del **Método Plural**.

---

## 🌊 Arquitectura Narrativa y Flujo Fluvial

El sitio no funciona como una presentación lineal estática ni recurre a elementos de gamificación superficial (puntos, badges, monedas o rankings). En su lugar, el avance se visibiliza orgánicamente en el mapa: cauces iluminados, estaciones activadas y crecimiento del delta.

```
0. Entrada: "El cambio es un ecosistema"
       ↓ (desbloquea)
1. Territorio 1: "¿Qué cambia al incorporar una mirada gameful?"
       ↓ (al completar, desbloquea 2 y 3 en paralelo)
┌───────────────────────────────────────┐
│ • Territorio 2: "¿Qué puede resolver?" │
│ • Territorio 3: "¿Qué permite diseñar?"│
│ (Recorribles en cualquier orden)       │
└───────────────────────────────────────┘
       ↓ (al completar AMBOS 2 y 3)
4. Territorio 4: "¿Cómo vive dentro del Método Plural?"
       ↓ (al completar)
5. Territorio 5: "¿Dónde comenzamos?"
       ↓ (delta abierto con 3 afluentes en cualquier orden)
┌────────────────────────────────────────────────────────┐
│ • Evaluation as Experience                             │
│ • From Intervention to Product                         │
│ • New Horizons                                         │
└────────────────────────────────────────────────────────┘
       ↓ (al visitar los 3 afluentes)
Créditos y Epílogo
```

---

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 14](https://nextjs.org/) con App Router (`src/app`).
- **Lenguaje**: TypeScript en modo estricto.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) configurado con paleta editorial tropical (`canopy`, `river`, `earth`, `editorial`).
- **Iconografía**: [Lucide React](https://lucide.dev/).
- **Persistencia**: Patrón repositorio dual (`LocalStorage` para local y `Supabase` para producción remota).
- **Pruebas**: [Vitest](https://vitest.dev/) para reglas de desbloqueo y persistencia.

---

## 🚀 Ejecución del Proyecto

### 1. Requisitos Previos
- Node.js 18+ o 20+
- npm, pnpm o yarn

### 2. Instalación y Servidor de Desarrollo
```bash
# Instalar dependencias
npm install

# Iniciar servidor local
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Ejecución de Pruebas Unitarias
```bash
npm test
```

### 4. Compilación para Producción
```bash
npm run build
npm start
```

---

## 🗄️ Configuración de Persistencia (Local vs. Supabase)

El sistema utiliza una abstracción de persistencia (`src/lib/persistence/index.ts`):
- **Modo Local (Por defecto)**: Si no se configuran variables de entorno de Supabase, el sitio funciona inmediatamente en cualquier navegador persistiendo el estado en `localStorage`.
- **Modo Supabase**: Si se proporcionan las variables de entorno, utiliza automáticamente la tabla remota con **autenticación anónima** (sin recopilar emails ni nombres).

### Conexión con Supabase:
1. Crea un nuevo proyecto en [Supabase](https://supabase.com).
2. Ve a **Authentication > Providers > Anonymous Sign-ins** y actívalo.
3. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Define tus credenciales:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
5. Ve a **SQL Editor** en Supabase y ejecuta el script de migración ubicado en:
   [`supabase/migrations/20260917000000_create_traversal_progress.sql`](./supabase/migrations/20260917000000_create_traversal_progress.sql).
   Este script crea las tablas `user_progress` y `user_traversal_state` con políticas completas de **Row Level Security (RLS)**.

---

## 🚢 Despliegue en Vercel

1. Sube el repositorio a GitHub o GitLab.
2. Importa el repositorio en [Vercel](https://vercel.com).
3. (Opcional) Si usarás Supabase, agrega en la pestaña **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Haz clic en **Deploy**. El proyecto no requiere configuración adicional de build (`npm run build`).

---

## 📂 Dónde Reemplazar el Contenido Editorial

Todo el contenido textual, preguntas y configuraciones de las dinámicas está estrictamente separado de los componentes de interfaz en la carpeta `src/data/`:

| Archivo | Contenido que gobierna |
|---|---|
| [`src/data/entry.ts`](./src/data/entry.ts) | Título, subtítulo, introducción y principios ecológicos de la pantalla 0. |
| [`src/data/territories.ts`](./src/data/territories.ts) | Textos narrativos, preguntas funcionales, bloques de contenido e interacciones de los Territorios 1 al 5. |
| [`src/data/tributaries.ts`](./src/data/tributaries.ts) | Descripciones, pilares clave y preguntas de acción de los tres afluentes. |
| [`src/data/credits.ts`](./src/data/credits.ts) | Reflexión final, créditos del equipo y referencia metodológica al Método Plural. |

---

## 🧩 Componentes de Interacción Reutilizables

En `src/components/interactions/` se incluyen implementaciones funcionales accesibles:
1. `FillBlankSentence`: Completar frases eligiendo palabras clave.
2. `MultiConceptSelector`: Selección accesible de múltiples conceptos con retroalimentación.
3. `PairMatching`: Emparejamiento de conceptos sin arrastre forzado.
4. `CategorySorter`: Clasificación por categorías con botones táctiles y de teclado.
5. `RevealCards`: Revelación progresiva con foco accesible.
6. `EcosystemTree`: Exploración por capas estratificadas del ecosistema.
7. `MatrixTableBuilder`: Construcción progresiva de matrices comparativas.
8. `TributarySelector`: Navegación y conmutación de afluentes del delta.
9. `InteractionConclusion`: Mensaje de estado y transición hacia el siguiente cauce.

---

## 📍 Qué Elementos son Placeholders en esta Fase

- Los textos específicos de las interacciones y pilares son borradores concisos diseñados para validar el flujo técnico.
- La ilustración cartográfica del río utiliza trazados vectoriales SVG paramétricos y abstractos listos para recibir arte visual definitivo cuando se desarrolle la dirección de arte final.
