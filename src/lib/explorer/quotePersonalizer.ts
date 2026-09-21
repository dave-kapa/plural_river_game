/**
 * Helper para personalizar textos entre comillas (" ", “ ”, « »)
 * incorporando el nombre del explorador de forma natural y elegante en español.
 */

export function personalizeQuotation(text: string, explorerName?: string): string {
  if (!text) return '';
  if (!explorerName || !explorerName.trim()) return text;

  const name = explorerName.trim();
  let trimmed = text.trim();

  // Si ya incluye el nombre, evitar duplicaciones
  if (trimmed.includes(name)) return trimmed;

  // Si el texto ya tiene comillas exteriores, removerlas para trabajar con el contenido limpio
  const hasOuterCurlyQuotes = trimmed.startsWith('“') && trimmed.endsWith('”');
  const hasOuterStraightQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
  const hasOuterAngularQuotes = trimmed.startsWith('«') && trimmed.endsWith('»');

  if (hasOuterCurlyQuotes || hasOuterStraightQuotes || hasOuterAngularQuotes) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  // 1. Pregunta (inicia con ¿)
  if (trimmed.startsWith('¿')) {
    const afterOpen = trimmed.slice(1);
    const firstChar = afterOpen.charAt(0).toLowerCase();
    const rest = afterOpen.slice(1);
    return `${name}, ¿${firstChar}${rest}`;
  }

  // 2. Pregunta en inglés o sin apertura ¿ (inicia con ?, Who, What, etc.)
  if (trimmed.endsWith('?')) {
    const firstChar = trimmed.charAt(0).toLowerCase();
    const rest = trimmed.slice(1);
    return `${name}, ¿${firstChar}${rest}`;
  }

  // 3. Afirmación / Hallazgo nuclear
  const firstChar = trimmed.charAt(0).toLowerCase();
  const rest = trimmed.slice(1);
  return `${name}, ${firstChar}${rest}`;
}

/**
 * Devuelve el texto personalizado y envuelto en comillas tipográficas “...”
 */
export function formatQuotation(text: string, explorerName?: string): string {
  const inner = personalizeQuotation(text, explorerName);
  return `“${inner}”`;
}
