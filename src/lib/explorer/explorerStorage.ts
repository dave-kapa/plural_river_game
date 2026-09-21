/**
 * Utilidades para guardar y recuperar el nombre del explorador en localStorage y Cookies
 */

const STORAGE_KEY = 'plural_explorer_name';
const COOKIE_NAME = 'plural_explorer_name';

export function getStoredExplorerName(): string {
  if (typeof window === 'undefined') return '';

  try {
    // 1. Intentar desde localStorage
    const localName = window.localStorage.getItem(STORAGE_KEY);
    if (localName && localName.trim()) {
      return localName.trim();
    }

    // 2. Intentar desde cookies
    const cookieMatch = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${COOKIE_NAME}=`));

    if (cookieMatch) {
      const value = decodeURIComponent(cookieMatch.split('=')[1] || '');
      if (value.trim()) {
        // Sincronizar en localStorage
        window.localStorage.setItem(STORAGE_KEY, value.trim());
        return value.trim();
      }
    }
  } catch (err) {
    console.warn('Error reading explorer name:', err);
  }

  return '';
}

export function saveStoredExplorerName(name: string): void {
  if (typeof window === 'undefined') return;

  const trimmed = name.trim();
  try {
    // 1. Guardar en localStorage
    if (trimmed) {
      window.localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    // 2. Guardar en cookie (duración: 1 año, SameSite Lax)
    const maxAge = trimmed ? 31536000 : 0;
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
      trimmed
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (err) {
    console.warn('Error saving explorer name:', err);
  }
}
