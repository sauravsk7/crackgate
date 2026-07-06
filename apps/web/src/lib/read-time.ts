export function readTime(body: string): number {
  return Math.max(1, Math.round(body.split(" ").length / 200));
}
