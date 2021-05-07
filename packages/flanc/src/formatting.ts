export function latinize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\uffff]/g, '');
}
