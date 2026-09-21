import { ProgressionRepository } from './types';
import { LocalStorageProgressionRepository } from './localStorageRepo';
import { SupabaseProgressionRepository } from './supabaseRepo';
import { getSupabaseClient, isSupabaseConfigured } from '../supabase/client';

let repositoryInstance: ProgressionRepository | null = null;

export function getProgressionRepository(): ProgressionRepository {
  if (repositoryInstance) {
    return repositoryInstance;
  }

  if (process.env.NEXT_PUBLIC_FORCE_LOCAL_STORAGE === 'true') {
    repositoryInstance = new LocalStorageProgressionRepository();
    return repositoryInstance;
  }

  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    if (client) {
      repositoryInstance = new SupabaseProgressionRepository(client);
      return repositoryInstance;
    }
  }

  repositoryInstance = new LocalStorageProgressionRepository();
  return repositoryInstance;
}

export * from './types';
export * from './localStorageRepo';
export * from './supabaseRepo';
