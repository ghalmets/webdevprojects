import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as rules from '../vampirinchen/regeln.mjs';
function game(){const nodes=new Map(),pen=new Proxy({},{get:()=>()=>{},set:()=>true});const el=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',addEventListener(){},focus(){},getContext:()=>pen});return nodes.get(id);};const box={...rules,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},Math};vm.createContext(box);vm.runInContext(fs.readFileSync(new URL('../vampirinchen/spiel.mjs',import.meta.url),'utf8').replace(/^import .*\n/,''),box);return s=>vm.runInContext(s,box);}
test('Beide Brücken, Schlüsselauswahl und alle Kapitel funktionieren',()=>{
 const run=game();
 run('start();vampires.forEach(v=>v.passed=true);player={x:4250,y:400};update(0)');assert.equal(run('mode'),'playing');
 run('for(const g of gems){player={x:g.x,y:g.y};update(0);}player={x:4250,y:400};update(0);draw()');assert.equal(run('mode'),'chapter');
 run('start();vampires.forEach(v=>v.passed=true);player={x:380,y:350};update(0);player={x:2300,y:350};update(0)');assert.equal(run('fallTime'),0);
 for(const lane of [0,1]){
  run(`chapter=1;setup();vampires.forEach(v=>v.passed=true);mode='playing';player={x:380,y:350};update(0);player={x:690,y:BRIDGES[${lane}].center};keys.add('ArrowUp');update(.1);keys.clear()`);
  assert.equal(run('selectedBridge'),lane);
  run(`player={x:1498,y:BRIDGES[${lane}].center};keys.add('ArrowUp');update(.1);keys.clear()`);
  assert.ok(run('bridgeDone'));
 }
 run('player={x:2300,y:350};update(0);draw();update(1.4)');assert.equal(run('mode'),'chapter');
 run('start();vampires.forEach(v=>v.passed=true);player={x:5450,y:350};tryKey(0)');assert.ok(!run('ladderUnlocked'));
 run('for(const g of gems){player={x:g.x,y:g.y};update(0);}for(const k of inventory){player={x:k.x,y:k.y};update(0);}player={x:5450,y:350};tryKey((correctKey+1)%4)');assert.ok(!run('ladderUnlocked'));
 run('tryKey(correctKey);keys.add("ArrowUp");for(let i=0;i<100;i++)update(.02);draw()');assert.equal(run('mode'),'chapter');
 run('start();vampires.forEach(v=>v.passed=true);for(const g of gems){player={x:g.x,y:g.y};update(0);}player={x:1600,y:370};keys.add("ArrowUp");update(0);draw()');assert.equal(run('mode'),'talk');run('reply(0);reply(0)');assert.ok(run('wings'));assert.equal(run('mode'),'chapter');
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
  for(const gem of [...level.gems,...(level===rules.CHAPTERS[2]?rules.CELLAR_KEYS:[])])assert.ok(queue.some(p=>rules.touching(p,gem,30)),`${level.name}: ${gem.x},${gem.y}`);
  assert.ok(queue.some(p=>p.x>level.width-160),level.name+' Ausgang erreichbar');
 }
});

test('Vampire sperren den Weg bis zum vollständigen Gespräch, auch beim seitlichen Vorbeigehen',()=>{
 const run=game();run('start();player={x:385,y:210};keys.add("ArrowUp");update(.1);draw()');assert.equal(run('mode'),'talk');assert.ok(run('player.x')<=run('vampires[0].homeX')-70);
 const x=run('player.x'),time=run('time');run('keys.add("ArrowUp");update(1)');assert.equal(run('player.x'),x);assert.equal(run('time'),time);
 run('reply(1)');assert.equal(run('mode'),'talk');assert.ok(!run('vampires[0].passed'));
 run('reply(0)');assert.equal(run('mode'),'playing');assert.ok(run('vampires[0].passed'));
 run('keys.add("ArrowUp");update(.1)');assert.ok(run('player.x')>x);assert.equal(run('mode'),'playing');
 run('player.x=385;player.y=450;update(0)');assert.equal(run('mode'),'playing');
});
test('Ich-Perspektive: vorwärts, zurück und seitwärts passen zur Blickrichtung',()=>{
 const run=game();run('start();keys.add("ArrowUp");update(.1);keys.clear()');assert.ok(run('player.x')>80);
 run('keys.add("ArrowDown");update(.1);keys.clear()');assert.equal(run('player.x'),80);
 const y=run('player.y');run('keys.add("ArrowLeft");update(.1);keys.clear()');assert.ok(run('player.y')<y);
 run('keys.add("ArrowRight");update(.1);keys.clear();draw()');assert.equal(run('player.y'),y);
 assert.ok(run('project(player.x+100,player.y).x')===480);assert.equal(run('project(player.x-100,player.y)'),null);
});
