-- Migración incremental para traza de eventos de interacción
-- Proyecto: plural_river_game (kfuaxtjfdvctatgsaubs)

-- 1. Asegurar columna discovered_items en user_traversal_state si no existiera
ALTER TABLE public.user_traversal_state
ADD COLUMN IF NOT EXISTS discovered_items TEXT[] NOT NULL DEFAULT '{}';

-- 2. Crear tabla append-only para la traza de interacción
CREATE TABLE IF NOT EXISTS public.interaction_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  territory_id TEXT,
  target_id TEXT,
  session_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Índices de consulta eficiente
CREATE INDEX IF NOT EXISTS idx_interaction_events_user_id ON public.interaction_events(user_id);
CREATE INDEX IF NOT EXISTS idx_interaction_events_occurred_at ON public.interaction_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_interaction_events_territory_id ON public.interaction_events(territory_id);
CREATE INDEX IF NOT EXISTS idx_interaction_events_event_name ON public.interaction_events(event_name);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.interaction_events ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de seguridad idempotentes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'interaction_events' 
      AND policyname = 'Users can view their own interaction events'
  ) THEN
    CREATE POLICY "Users can view their own interaction events"
      ON public.interaction_events
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'interaction_events' 
      AND policyname = 'Users can insert their own interaction events'
  ) THEN
    CREATE POLICY "Users can insert their own interaction events"
      ON public.interaction_events
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
