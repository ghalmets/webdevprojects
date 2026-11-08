import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import * as rules from '../lana-keksflucht/regeln.mjs';
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
 const nodes=new Map(),pen=new Proxy({},{get:()=>()=>{},set:()=>true});const el=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',addEventListener(){},setAttribute(){},focus(){},getContext:()=>pen});return nodes.get(id);};const box={...rules,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},Math};vm.createContext(box);vm.runInContext(fs.readFileSync(new URL('../lana-keksflucht/spiel.mjs',import.meta.url),'utf8').replace(/^import .*\n/,''),box);const run=s=>vm.runInContext(s,box);
 run('start();player={x:(maze.exits[0].x+.5)*SETTINGS.tile,z:(maze.exits[0].z+.5)*SETTINGS.tile};update(0);update(0);draw()');assert.equal(run('found.size'),1);
 for(let round=1;round<=3;round++){run('for(const e of maze.exits){player={x:(e.x+.5)*SETTINGS.tile,z:(e.z+.5)*SETTINGS.tile};update(0);}draw()');assert.equal(run('mode'),round===3?'finished':'won');if(round<3)run('start()');}
 run('start();toggleMap();pause();draw()');assert.equal(run('round'),1);assert.equal(run('found.size'),0);assert.ok(run('showMap'));assert.equal(run('mode'),'paused');run('start()');assert.equal(run('mode'),'playing');
});

function chaseGame(){ const nodes=new Map(),pen=new Proxy({},{get:()=>()=>{},set:()=>true});const el=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',addEventListener(){},setAttribute(){},focus(){},getContext:()=>pen});return nodes.get(id);};const box={...rules,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},Math};vm.createContext(box);vm.runInContext(fs.readFileSync(new URL('../lana-keksflucht/spiel.mjs',import.meta.url),'utf8').replace(/^import .*\n/,''),box);return s=>vm.runInContext(s,box);
}

test('Omi findet einen gangbaren Weg und erreicht Lana ohne durch Wände zu laufen',()=>{
 for(const value of [0,.37,.999]){
  const maze=rules.makeMaze(13,()=>value),target={...maze.start};let omi={x:target.x+18,z:target.z+rules.SETTINGS.tile*.7};
  assert.ok(rules.walkable(maze,omi.x,omi.z));assert.ok(rules.findPath(maze,omi,target).length>0);
  // Ein fernes Tor erzwingt mehrere Kurven statt einer direkten Linie.
  target.x=(maze.exits[1].x+.5)*rules.SETTINGS.tile;target.z=(maze.exits[1].z+.5)*rules.SETTINGS.tile;
  for(let i=0;i<6000&&Math.hypot(omi.x-target.x,omi.z-target.z)>5;i++){omi=rules.stepOmi(maze,omi,target,.04,100);assert.ok(rules.walkable(maze,omi.x,omi.z));}
  assert.ok(Math.hypot(omi.x-target.x,omi.z-target.z)<6);
 }
});
test('Vorsprung, Kartenpause und neuer Versuch behalten Karte und gefundene Tore',()=>{
 const run=chaseGame();run('start()');const z=run('omi.z');run('update(.1)');assert.equal(run('omi.z'),z);assert.ok(run('headStart')>0);
 run('toggleMap()');const time=run('time');run('update(2)');assert.equal(run('time'),time);assert.equal(run('omi.z'),z);run('toggleMap()');
 run('found.add(0);headStart=0;omi={...player};update(0)');assert.equal(run('mode'),'caught');assert.equal(run('found.size'),1);
 const grid=run('JSON.stringify(maze.grid)');run('start()');assert.equal(run('mode'),'playing');assert.equal(run('found.size'),1);assert.equal(run('JSON.stringify(maze.grid)'),grid);assert.equal(run('headStart'),4);
});
