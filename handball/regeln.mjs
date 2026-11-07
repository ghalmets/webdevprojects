// Einfach veränderbare Regeln für unseren Einhorn-Cup.
export const SETTINGS={seconds:90,runSpeed:190,hookDistance:82,hookCooldown:1.8,throwSpeed:620,goalTop:175,goalBottom:345};
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function canShoot(player){return player.x>=650;}
export function saveAt(keeperY,ballY){return Math.abs(keeperY-ballY)<=43;}
export function passTarget(players,active,defenders){
 const candidates=players.map((p,i)=>({p,i})).filter(c=>c.i!==active);
 candidates.sort((a,b)=>{
  const clearance=p=>Math.min(...defenders.map(d=>Math.hypot(d.x-p.x,d.y-p.y)),500);
  return (b.p.x+clearance(b.p)*.7)-(a.p.x+clearance(a.p)*.7);
 });return candidates[0].i;
}
