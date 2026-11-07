// Die Spielregeln: Hier lassen sich eigene Ideen besonders einfach ausprobieren.
export const SETTINGS = {
  roundSeconds: 60,
  startingHearts: 3,
  starPoints: 10,
  speeds: [180, 240, 310], // Pixel pro Sekunde
  ponyMoveSpeed: 255,
  spawnInterval: 1.18,
  starChance: 0.62,
  safeSecondsAfterHit: 1.6,
};
export const TRACK = { top: 158, bottom: 387, ponyX: 180 };
export function overlaps(pony, item) {
  return Math.abs(pony.x - item.x) < 38 && Math.abs(pony.y - item.y) < 27;
}
export function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
