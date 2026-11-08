export const SETTINGS={tile:72,speed:165,radius:13,rounds:3};
export function makeMaze(size=13,random=Math.random){
 const grid=Array.from({length:size},()=>Array(size).fill(1));const stack=[[1,size-2]];grid[size-2][1]=0;
 while(stack.length){const [x,z]=stack[stack.length-1];const choices=[[0,-2],[2,0],[0,2],[-2,0]].filter(([dx,dz])=>x+dx>0&&x+dx<size-1&&z+dz>0&&z+dz<size-1&&grid[z+dz][x+dx]);
 if(!choices.length){stack.pop();continue;}const [dx,dz]=choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];grid[z+dz/2][x+dx/2]=0;grid[z+dz][x+dx]=0;stack.push([x+dx,z+dz]);}
 const exits=[{x:1,z:0,name:'Sonnentor'},{x:size-1,z:1,name:'Blumentor'},{x:size-2,z:size-1,name:'Mondtor'}];
 for(const e of exits)grid[e.z][e.x]=0;
 return {grid,size,exits,start:{x:SETTINGS.tile*1.5,z:SETTINGS.tile*(size-1.5)}};
}
export function walkable(maze,x,z){const r=SETTINGS.radius,t=SETTINGS.tile;return [[-r,-r],[-r,r],[r,-r],[r,r]].every(([dx,dz])=>maze.grid[Math.floor((z+dz)/t)]?.[Math.floor((x+dx)/t)]===0);}
export function moveLana(maze,player,dx,dz,dt){const norm=Math.hypot(dx,dz)||1;const x=player.x+dx/norm*SETTINGS.speed*dt,z=player.z+dz/norm*SETTINGS.speed*dt;if(walkable(maze,x,player.z))player.x=x;if(walkable(maze,player.x,z))player.z=z;return player;}
export function exitAt(maze,player){return maze.exits.findIndex(e=>Math.floor(player.x/SETTINGS.tile)===e.x&&Math.floor(player.z/SETTINGS.tile)===e.z);}
