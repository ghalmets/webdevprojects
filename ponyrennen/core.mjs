// Hier könnt ihr Dauer, Punkte, Tempo und Sprunghöhe verändern.
export const SETTINGS = {
  roundSeconds: 60, startingHearts: 3, carrotPoints: 10,
  speeds: [.15, .19, .23], // Annäherung pro Sekunde
  spawnInterval: 3.2, carrotChance: .60,
  safeSecondsAfterHit: 1.6, jumpVelocity: 5.8, gravity: 8,
};
export function advanceJump(height, velocity, dt, down = false) {
  const nextVelocity = velocity - (SETTINGS.gravity + (down ? 18 : 0)) * dt;
  const nextHeight = Math.max(0, height + nextVelocity * dt);
  return { height: nextHeight, velocity: nextHeight === 0 ? 0 : nextVelocity };
}
export function clearsObstacle(type, height, down) {
  return type === 'branch' ? down && height < .35 : height > .32;
}
export function collectsCarrot(height, carrotHeight) {
  return Math.abs(height - carrotHeight) < .55;
}

// Kontakt am Boden vor den Hufen, nicht an den Ohren.
export const CONTACT_Y = 430;
export function groundY(distance) { return 146 + (1 - distance) ** 2 * (CONTACT_Y - 146); }
export function actionDue(distance, speed) { return distance > 0 && distance / speed <= .7; }
