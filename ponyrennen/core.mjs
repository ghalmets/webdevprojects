// Hier könnt ihr Dauer, Punkte, Tempo und Sprunghöhe verändern.
export const SETTINGS = {
  roundSeconds: 60, startingHearts: 3, carrotPoints: 10,
  speeds: [.19, .24, .29], // Annäherung pro Sekunde
  spawnInterval: 1.8, carrotChance: .60,
  safeSecondsAfterHit: 1.6, jumpVelocity: 4.8, gravity: 9,
};
export function advanceJump(height, velocity, dt, down = false) {
  const nextVelocity = velocity - (SETTINGS.gravity + (down ? 18 : 0)) * dt;
  const nextHeight = Math.max(0, height + nextVelocity * dt);
  return { height: nextHeight, velocity: nextHeight === 0 ? 0 : nextVelocity };
}
export function clearsObstacle(type, height, down) {
  return type === 'branch' ? down && height < .18 : height > .55;
}
export function collectsCarrot(height, carrotHeight) {
  return Math.abs(height - carrotHeight) < .55;
}
