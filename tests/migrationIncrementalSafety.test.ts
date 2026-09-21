import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Validación de Seguridad e Idempotencia de la Migración Incremental', () => {
  const migrationPath = path.resolve(__dirname, '../supabase/migrations/20260917150000_add_interaction_events.sql');
  const initialMigrationPath = path.resolve(__dirname, '../supabase/migrations/20260917000000_create_traversal_progress.sql');

  it('el archivo de migración incremental existe y está marcado como PREPARADA — PENDIENTE DE APLICACIÓN REMOTA', () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
    const content = fs.readFileSync(migrationPath, 'utf-8');
    expect(content).toContain('ESTADO: PREPARADA — PENDIENTE DE APLICACIÓN REMOTA');
  });

  it('es estrictamente incremental y NO contiene sentencias destructivas', () => {
    const raw = fs.readFileSync(migrationPath, 'utf-8');
    // Eliminar comentarios SQL de una sola línea y de bloque
    const sqlWithoutComments = raw
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .toUpperCase();

    expect(sqlWithoutComments).not.toContain('DROP TABLE');
    expect(sqlWithoutComments).not.toContain('DROP COLUMN');
    expect(sqlWithoutComments).not.toContain('TRUNCATE');
    expect(sqlWithoutComments).not.toContain('CASCADE CONSTRAINTS');
  });

  it('no recrea tablas existentes de la migración inicial (user_progress, user_traversal_state)', () => {
    const content = fs.readFileSync(migrationPath, 'utf-8');
    expect(content).not.toMatch(/CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?public\.user_progress/i);
    expect(content).not.toMatch(/CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?public\.user_traversal_state/i);
  });

  it('asegura la columna discovered_items usando IF NOT EXISTS de forma no destructiva', () => {
    const content = fs.readFileSync(migrationPath, 'utf-8');
    expect(content).toMatch(/ALTER\s+TABLE\s+public\.user_traversal_state\s+ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+discovered_items\s+TEXT\[\]/i);
  });

  it('crea la tabla interaction_events usando IF NOT EXISTS con clave foránea a auth.users', () => {
    const content = fs.readFileSync(migrationPath, 'utf-8');
    expect(content).toMatch(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.interaction_events/i);
    expect(content).toContain('user_id UUID NOT NULL REFERENCES auth.users(id)');
    expect(content).toContain('session_id TEXT');
    expect(content).toContain('event_name TEXT NOT NULL');
    expect(content).toContain('metadata JSONB NOT NULL DEFAULT \'{}\'::jsonb');
  });

  it('habilita RLS y define políticas idempotentes con aislamiento estricto por auth.uid() = user_id', () => {
    const content = fs.readFileSync(migrationPath, 'utf-8');
    expect(content).toContain('ALTER TABLE public.interaction_events ENABLE ROW LEVEL SECURITY;');
    expect(content).toContain('pg_policies');
    expect(content).toContain('auth.uid() = user_id');
    expect(content).toContain('Users can view their own interaction events');
    expect(content).toContain('Users can insert their own interaction events');
  });

  it('los índices creados son idempotentes (IF NOT EXISTS)', () => {
    const content = fs.readFileSync(migrationPath, 'utf-8');
    const indexMatches = content.match(/CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS/gi);
    expect(indexMatches).not.toBeNull();
    expect(indexMatches!.length).toBeGreaterThanOrEqual(3);
  });
});
