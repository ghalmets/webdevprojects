export const SETTINGS={tile:72,speed:165,radius:13,rounds:3};
export function makeMaze(size=13,random=Math.random){
 const grid=Array.from({length:size},()=>Array(size).fill(1));const stack=[[1,size-2]];grid[size-2][1]=0;
 while(stack.length){const [x,z]=stack[stack.length-1];const choices=[[0,-2],[2,0],[0,2],[-2,0]].filter(([dx,dz])=>x+dx>0&&x+dx<size-1&&z+dz>0&&z+dz<size-1&&grid[z+dz][x+dx]);
 if(!choices.length){stack.pop();continue;}const [dx,dz]=choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];grid[z+dz/2][x+dx/2]=0;grid[z+dz][x+dx]=0;stack.push([x+dx,z+dz]);}
 const exits=[{x:1,z:0,name:'Sonnentor'},{x:size-1,z:1,name:'Blumentor'},{x:size-2,z:size-1,name:'Mondtor'}];
 for(const e of exits)grid[e.z][e.x]=0;
 grid[size-1][1]=0; // Gartentür hinter Lana.
 for(let i=0;i<3;i++){const entrance=Array(size).fill(1);entrance[1]=0;grid.push(entrance);} // Längerer Eingang gibt Omi einen sichtbaren Abstand.
 return {grid,size,exits,start:{x:SETTINGS.tile*1.5,z:SETTINGS.tile*(size-1.5)}};
}
export function walkable(maze,x,z){const r=SETTINGS.radius,t=SETTINGS.tile;return [[-r,-r],[-r,r],[r,-r],[r,r]].every(([dx,dz])=>maze.grid[Math.floor((z+dz)/t)]?.[Math.floor((x+dx)/t)]===0);}
export function moveLana(maze,player,dx,dz,dt){const norm=Math.hypot(dx,dz)||1;const x=player.x+dx/norm*SETTINGS.speed*dt,z=player.z+dz/norm*SETTINGS.speed*dt;if(walkable(maze,x,player.z))player.x=x;if(walkable(maze,player.x,z))player.z=z;return player;}
export function exitAt(maze,player){return maze.exits.findIndex(e=>Math.floor(player.x/SETTINGS.tile)===e.x&&Math.floor(player.z/SETTINGS.tile)===e.z);}

// Omi findet ihren Weg durch die Gänge und geht niemals durch eine Wand.
export function findPath(maze,from,to){
 const t=SETTINGS.tile,start={x:Math.floor(from.x/t),z:Math.floor(from.z/t)},goal={x:Math.floor(to.x/t),z:Math.floor(to.z/t)};
 const id=p=>`${p.x},${p.z}`,queue=[start],parents=new Map([[id(start),null]]);
 for(let i=0;i<queue.length;i++){const p=queue[i];if(p.x===goal.x&&p.z===goal.z){const path=[];let cursor=p;while(cursor){path.push(cursor);cursor=parents.get(id(cursor));}return path.reverse();}
 for(const [dx,dz] of [[0,-1],[1,0],[0,1],[-1,0]]){const n={x:p.x+dx,z:p.z+dz};if(maze.grid[n.z]?.[n.x]===0&&!parents.has(id(n))){parents.set(id(n),p);queue.push(n);}}}return [];
}
export function stepOmi(maze,omi,player,dt,speed=100){
 const path=findPath(maze,omi,player);if(!path.length)return {...omi};const t=SETTINGS.tile,cell=path[0],next=path[1];let target;
 if(!next)target=player;
 else if(next.x!==cell.x&&Math.abs(omi.z-(cell.z+.5)*t)>1)target={x:omi.x,z:(cell.z+.5)*t};
 else if(next.z!==cell.z&&Math.abs(omi.x-(cell.x+.5)*t)>1)target={x:(cell.x+.5)*t,z:omi.z};
 else target={x:(next.x+.5)*t,z:(next.z+.5)*t};
 const dx=target.x-omi.x,dz=target.z-omi.z,length=Math.hypot(dx,dz);if(length===0)return {...omi};const step=Math.min(speed*dt,length),x=omi.x+dx/length*step,z=omi.z+dz/length*step;
 return walkable(maze,x,z)?{x,z}:{...omi};
}
