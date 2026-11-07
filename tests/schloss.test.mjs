import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as rules from '../vampirinchen/regeln.mjs';
function game(){const nodes=new Map(),pen=new Proxy({},{get:()=>()=>{},set:()=>true});const el=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',addEventListener(){},focus(){},getContext:()=>pen});return nodes.get(id);};const box={...rules,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},Math};vm.createContext(box);vm.runInContext(fs.readFileSync(new URL('../vampirinchen/spiel.mjs',import.meta.url),'utf8').replace(/^import .*\n/,''),box);return s=>vm.runInContext(s,box);}
test('Alle Kapitel führen über Falltür, Leiter und Flügel sicher nach Hause',()=>{
 const run=game();run('start();player={x:2300,y:400};update(0)');assert.equal(run('mode'),'playing');
 run('for(const g of gems){player={x:g.x,y:g.y};update(0);}player={x:2300,y:400};update(0)');assert.equal(run('mode'),'chapter');
 run('start();player={x:380,y:350};update(0);player={x:900,y:350};update(0);draw()');assert.equal(run('chapter'),1);
 run('player={x:1200,y:350};update(0);player={x:1600,y:350};update(0);draw()');assert.ok(run('fallTime')>0);run('update(1.4)');assert.equal(run('mode'),'chapter');
 run('start();player={x:1100,y:230};update(0);player={x:1970,y:350};keys.add("ArrowUp");for(let i=0;i<100;i++)update(.02);draw()');assert.equal(run('mode'),'chapter');assert.equal(run('chapter'),2);
 run('start();for(const g of gems){player={x:g.x,y:g.y};update(0);}player={x:1290,y:370};keys.add("ArrowUp");update(0);draw()');assert.ok(run('wings'));assert.equal(run('mode'),'chapter');
 run('start();player={x:2490,y:420};update(0);draw()');assert.equal(run('mode'),'finished');
 run('start();pause();draw()');assert.equal(run('chapter'),0);assert.ok(!run('wings'));assert.equal(run('mode'),'paused');
});
test('Alle Sammelobjekte sind über begehbare Wege erreichbar',()=>{
 for(const level of rules.CHAPTERS.slice(0,4)){
  const seen=new Set(),queue=[{...level.start}];const key=p=>`${Math.round((p.x-level.start.x)/10)},${Math.round((p.y-level.start.y)/10)}`;seen.add(key(queue[0]));
  for(let i=0;i<queue.length;i++){const p=queue[i];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const n={...p};rules.movePlayer(n,dx,dy,10/rules.SETTINGS.playerSpeed,{left:35,right:level.width-35,top:200,bottom:470},level.blocks);
   if(level===rules.CHAPTERS[1]&&!rules.onBridge(n.x,n.y))continue;
   const k=key(n);if(!seen.has(k)){seen.add(k);queue.push(n);}
  }}
  for(const gem of level.gems)assert.ok(queue.some(p=>rules.touching(p,gem,30)),`${level.name}: ${gem.x},${gem.y}`);
  assert.ok(queue.some(p=>p.x>level.width-160),level.name+' Ausgang erreichbar');
 }
});
