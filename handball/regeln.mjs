// Einfach veränderbare Regeln für unseren Einhorn-Cup.
export const SETTINGS={seconds:90,runSpeed:190,hookDistance:82,hookCooldown:1.8,throwSpeed:620,goalTop:175,goalBottom:345,keeperReach:27,counterRunSeconds:2.6,counterWarningSeconds:.45,counterThrowSpeed:620};
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function canShoot(player){return player.x>=650;}
export function saveAt(keeperY,ballY,reach=43){return Math.abs(keeperY-ballY)<=reach;}
export function passTarget(players,active,defenders){
 const candidates=players.map((p,i)=>({p,i})).filter(c=>c.i!==active);
 candidates.sort((a,b)=>{
  const clearance=p=>Math.min(...defenders.map(d=>Math.hypot(d.x-p.x,d.y-p.y)),500);
  return (b.p.x+clearance(b.p)*.7)-(a.p.x+clearance(a.p)*.7);
 });return candidates[0].i;
}

// Die Einhörner starten rechts und laufen bis vor den linken Torraum.
export function counterPosition(seconds,index=0){
 const progress=clamp(seconds/SETTINGS.counterRunSeconds,0,1);
 return {x:800-progress*485+index*65,y:260+Math.sin(seconds*2+index*2)*65+(index===1?-65:index===2?65:0)};
}
