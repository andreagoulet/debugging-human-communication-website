/**
 * Converts basic markdown syntax to HTML.
 * Supports: *italic*, **bold**, ***bold italic***, and [links](url)
 */
export function formatMarkdown(text: string): string {
  return text
    // Bold italic (must come before bold and italic)
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-teal-700 underline hover:text-teal-900">$1</a>');
}
