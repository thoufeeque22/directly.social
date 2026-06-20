/**
 * Inserts a snippet into a string at the given cursor position,
 * intelligently adding a separator before/after the snippet as needed.
 *
 * @param value       - The current full string value of the input.
 * @param snippet     - The text to insert.
 * @param separator   - The separator to use (e.g. ' ' or '\n').
 * @param cursorStart - The start of the selection (insertion point).
 * @param cursorEnd   - The end of the selection (replaced with snippet).
 * @returns           - The new string with the snippet inserted.
 */
export function insertAtCursor(
  value: string,
  snippet: string,
  separator: string,
  cursorStart: number,
  cursorEnd: number,
): string {
  const before = value.slice(0, cursorStart);
  const after = value.slice(cursorEnd);
  const needsSepBefore = before.length > 0 && !before.endsWith(separator);
  const needsSepAfter = after.length > 0 && !after.startsWith(separator);
  return `${before}${needsSepBefore ? separator : ''}${snippet}${needsSepAfter ? separator : ''}${after}`;
}
