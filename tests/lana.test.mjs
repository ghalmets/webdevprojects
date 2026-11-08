import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import * as rules from '../lana-labyrinth/regeln.mjs';
test('Jeder der drei Ausgänge ist in allen Labyrinthgrößen erreichbar',()=>{
 for(const size of [13,15,17])for(const value of [0,.37,.999]){
  const maze=rules.makeMaze(size,()=>value),queue=[[1,size-2]],seen=new Set([`1,${size-2}`]);
  for(let i=0;i<queue.length;i++){const [x,z]=queue[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=`${nx},${nz}`;if(maze.grid[nz]?.[nx]===0&&!seen.has(k)){seen.add(k);queue.push([nx,nz]);}}}
  for(const e of maze.exits)assert.ok(seen.has(`${e.x},${e.z}`));assert.equal(maze.exits.length,3);assert.ok(rules.walkable(maze,maze.start.x,maze.start.z));
  for(const e of maze.exits)assert.ok(rules.walkable(maze,(e.x+.5)*rules.SETTINGS.tile,(e.z+.5)*rules.SETTINGS.tile));
 }
});
test('Lana kann weder durch Hecken noch aus der Welt laufen',()=>{
 const maze=rules.makeMaze(13,()=>0),p={...maze.start};assert.ok(!rules.walkable(maze,0,0));
 for(let i=0;i<120;i++)rules.moveLana(maze,p,-1,0,1/60);assert.ok(rules.walkable(maze,p.x,p.z));assert.ok(p.x>rules.SETTINGS.tile);
});
test('Tore zählen nur einmal; drei Labyrinthe, Pause und Neustart funktionieren',()=>{
 const nodes=new Map(),pen=new Proxy({},{get:()=>()=>{},set:()=>true});const el=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',addEventListener(){},setAttribute(){},focus(){},getContext:()=>pen});return nodes.get(id);};const box={...rules,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},Math};vm.createContext(box);vm.runInContext(fs.readFileSync(new URL('../lana-labyrinth/spiel.mjs',import.meta.url),'utf8').replace(/^import .*\n/,''),box);const run=s=>vm.runInContext(s,box);
 run('start();player={x:(maze.exits[0].x+.5)*SETTINGS.tile,z:(maze.exits[0].z+.5)*SETTINGS.tile};update(0);update(0);draw()');assert.equal(run('found.size'),1);
 for(let round=1;round<=3;round++){run('for(const e of maze.exits){player={x:(e.x+.5)*SETTINGS.tile,z:(e.z+.5)*SETTINGS.tile};update(0);}draw()');assert.equal(run('mode'),round===3?'finished':'won');if(round<3)run('start()');}
 run('start();toggleMap();pause();draw()');assert.equal(run('round'),1);assert.equal(run('found.size'),0);assert.ok(run('showMap'));assert.equal(run('mode'),'paused');run('start()');assert.equal(run('mode'),'playing');
});
