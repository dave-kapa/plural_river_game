-- Migración de persistencia para Plural Gameful River
-- Ejecutable en el Editor SQL de Supabase

-- Habilitar extensión UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de progreso de territorios (vinculada a auth.users anónimo)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    territory_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('locked', 'unlocked', 'visited', 'completed')),
    interaction_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, territory_id)
);

-- 2. Tabla de estado general de la travesía (entrada, afluentes visitados, bitácora, última ruta)
CREATE TABLE IF NOT EXISTS public.user_traversal_state (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_completed BOOLEAN NOT NULL DEFAULT FALSE,
    visited_tributaries TEXT[] NOT NULL DEFAULT '{}',
    discovered_items TEXT[] NOT NULL DEFAULT '{}',
    journal_entries JSONB NOT NULL DEFAULT '{}'::jsonb,
    credits_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    last_visited_route TEXT NOT NULL DEFAULT '/mapa',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_traversal_state ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de seguridad: cada usuario anónimo o autenticado solo accede a sus propios registros
CREATE POLICY "Users can view their own territory progress"
    ON public.user_progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own territory progress"
    ON public.user_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own territory progress"
    ON public.user_progress
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own territory progress (reset)"
    ON public.user_progress
    FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para user_traversal_state
CREATE POLICY "Users can view their own traversal state"
    ON public.user_traversal_state
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own traversal state"
    ON public.user_traversal_state
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own traversal state"
    ON public.user_traversal_state
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own traversal state (reset)"
    ON public.user_traversal_state
    FOR DELETE
    USING (auth.uid() = user_id);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_territory_id ON public.user_progress(territory_id);
