/**
 * Converts basic markdown syntax to HTML.
 * Supports: *italic*, **bold**, and ***bold italic***
 */
export function formatMarkdown(text: string): string {
  return text
    // Bold italic (must come before bold and italic)
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
