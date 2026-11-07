export const SETTINGS = { playerSpeed: 190, vampireSpeeds: [85, 105, 125], rounds: 3 };
export const BOUNDS = { left: 35, right: 925, top: 190, bottom: 470 };
export const HEDGES = [{x:245,y:275,w:140,h:62},{x:580,y:350,w:140,h:62}];
export function touchesHedge(x,y) {
 return HEDGES.some(h=>x+17>h.x&&x-17<h.x+h.w&&y+11>h.y&&y-11<h.y+h.h);
}
export function movePlayer(player,dx,dy,dt) {
 const length=Math.hypot(dx,dy)||1;
 const x=Math.max(BOUNDS.left,Math.min(BOUNDS.right,player.x+dx/length*SETTINGS.playerSpeed*dt));
 const y=Math.max(BOUNDS.top,Math.min(BOUNDS.bottom,player.y+dy/length*SETTINGS.playerSpeed*dt));
 if(!touchesHedge(x,player.y))player.x=x;
 if(!touchesHedge(player.x,y))player.y=y;
 return player;
}
export function touching(a,b,radius=40){return Math.hypot(a.x-b.x,a.y-b.y)<radius;}
