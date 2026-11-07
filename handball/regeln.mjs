// Einfach veränderbare Regeln für unseren Einhorn-Cup.
export const SETTINGS={seconds:90,runSpeed:190,hookDistance:56,hookCooldown:1.2,throwSpeed:620,goalTop:175,goalBottom:345,keeperReach:27,counterRunSeconds:2.6,counterWarningSeconds:.45,counterThrowSpeed:620};
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

// Ein Haken ist nur direkt vor einer Gegnerin möglich und bleibt ein kurzer Seitenschritt.
export function hookTarget(player,defenders,side=0){
 const nearby=defenders.filter(d=>d.x-player.x>=-15&&d.x-player.x<=80&&Math.hypot(d.x-player.x,d.y-player.y)<=85).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));
 if(!nearby.length)return null;
 const opponent=nearby[0];
 const options=[-1,1].map(direction=>({x:clamp(player.x+12,80,825),y:opponent.y+direction*46,direction})).filter(t=>t.y>=90&&t.y<=430&&Math.hypot(t.x-player.x,t.y-player.y)<=SETTINGS.hookDistance&&defenders.every(d=>Math.hypot(t.x-d.x,t.y-d.y)>=38));
 options.sort((a,b)=>{if(side&&a.direction!==b.direction)return a.direction===side?-1:1;return Math.abs(a.y-player.y)-Math.abs(b.y-player.y);});
 return options[0]||null;
}
