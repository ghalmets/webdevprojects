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
 run('player={x:2300,y:350};update(0);draw()');assert.equal(run('mode'),'playing');assert.ok(run('fallTime')>0);run('update(1.4);draw()');assert.equal(run('chapter'),2);assert.equal(run('mode'),'doors');run('chooseDoor(correctDoor)');assert.equal(run('mode'),'playing');
 run('vampires.forEach(v=>v.passed=true);player={x:5450,y:350};tryKey(0)');assert.ok(!run('ladderUnlocked'));
 run('for(const g of gems){player={x:g.x,y:g.y};update(0);}for(const k of inventory){player={x:k.x,y:k.y};update(0);}player={x:5450,y:350};tryKey((correctKey+1)%4)');assert.ok(!run('ladderUnlocked'));
 run('tryKey(correctKey);keys.add("ArrowUp");for(let i=0;i<100;i++)update(.02);draw()');assert.equal(run('mode'),'chapter');
 run('start();vampires.forEach(v=>v.passed=true);for(const g of gems){player={x:g.x,y:g.y};update(0);}player={x:1600,y:370};keys.add("ArrowUp");update(0);draw()');assert.equal(run('mode'),'talk');run('reply(0);reply(0)');assert.ok(run('wings'));assert.equal(run('mode'),'chapter');
 run('start();vampires.forEach(v=>v.passed=true);player={x:2490,y:420};update(0);draw()');assert.equal(run('mode'),'finished');
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

test('Keine unsichtbare Sperrlinie: seitliches Vorbeigehen geht, echte Nähe startet ein Gespräch',()=>{
 const run=game();run('start();vampires.slice(1).forEach(v=>v.passed=true);player={x:450,y:210};keys.add("ArrowUp");update(.1);keys.clear();draw()');assert.equal(run('mode'),'playing');assert.ok(run('player.x')>460);
 run('player={x:425,y:320};keys.add("ArrowUp");update(.1);draw()');assert.equal(run('mode'),'talk');
 const x=run('player.x'),time=run('time');run('keys.add("ArrowUp");update(1)');assert.equal(run('player.x'),x);assert.equal(run('time'),time);
 run('reply(1)');assert.equal(run('mode'),'talk');assert.ok(!run('vampires[0].passed'));run('reply(0)');assert.equal(run('mode'),'playing');assert.ok(run('vampires[0].passed'));
 run('keys.add("ArrowUp");update(.1)');assert.ok(run('player.x')>x);assert.equal(run('mode'),'playing');
});
test('Verfolgerkamera: Lotta bewegt sich seitlich im Bild und ihre Füße sind der Bezugspunkt',()=>{
 const run=game();run('start();keys.add("ArrowUp");update(.1);keys.clear()');assert.ok(run('player.x')>80);
 run('keys.add("ArrowDown");update(.1);keys.clear()');assert.equal(run('player.x'),80);
 const y=run('player.y');run('keys.add("ArrowLeft");update(.1);keys.clear()');assert.ok(run('player.y')<y);
 run('keys.add("ArrowRight");update(.1);keys.clear();draw()');assert.equal(run('player.y'),y);
 assert.equal(run('project(player.x,player.y).y'),440);const screenX=run('project(player.x,player.y).x');run('player.y+=20');assert.ok(run('project(player.x,player.y).x')>screenX);assert.equal(run('project(player.x-100,player.y)'),null);
});

test('Falsche Kellertüren setzen alle Funde und Gespräche auf den Gartenanfang zurück',()=>{
 for(const correct of [0,1,2])for(const choice of [0,1,2]){
  const run=game();run(`start();correctDoor=${correct};chapter=1;setup();mode='playing';score=1;bridgeDone=true;vampires.forEach(v=>v.passed=true);player={x:2300,y:350};update(0);update(1.4);draw()`);
  assert.equal(run('mode'),'doors');const x=run('player.x');run('keys.add("ArrowUp");update(1)');assert.equal(run('player.x'),x);
  run(`chooseDoor(${choice})`);
  if(choice===correct){assert.equal(run('mode'),'playing');assert.ok(run('entranceChosen'));assert.equal(run('fallTime'),0);assert.equal(run('chapter'),2);run('update(0)');assert.equal(run('mode'),'playing');}
  else{assert.equal(run('mode'),'outside');assert.equal(run('chapter'),0);assert.equal(run('score'),0);assert.ok(run('gems.every(g=>!g.collected)'));assert.ok(run('vampires.every(v=>!v.passed)'));assert.ok(run('inventory.every(k=>!k.collected)'));assert.ok(!run('ladderUnlocked'));assert.ok(!run('wings'));run('start()');assert.equal(run('mode'),'playing');assert.equal(run('chapter'),0);assert.equal(run('player.x'),rules.CHAPTERS[0].start.x);assert.equal(run('correctDoor'),correct);}
 }
});

test('Zwei Turmwachen verlangen je ein vollständiges Gespräch vor dem Obervampir',()=>{
 const run=game();run('start();chapter=3;setup();mode="playing";vampires.filter(v=>!v.guard).forEach(v=>v.passed=true);score=gems.length;player={x:1560,y:350};keys.add("ArrowUp");update(0)');assert.equal(run('mode'),'playing');assert.ok(!run('wings'));run('player={x:1410,y:290};update(.1);draw()');
 assert.equal(run('mode'),'talk');assert.equal(run('activeTalk.name'),'Linke Turmwache');
 run('reply(0)');assert.ok(!run('vampires.find(v=>v.guard).passed'));run('reply(0)');
 run('player={x:1445,y:410};keys.add("ArrowUp");update(.1)');assert.equal(run('mode'),'talk');assert.equal(run('activeTalk.name'),'Rechte Turmwache');
 assert.ok(!run('wings'));run('reply(1);reply(0)');assert.ok(run('vampires.filter(v=>v.guard).every(v=>v.passed)'));
 run('player={x:1560,y:350};keys.add("ArrowUp");update(0)');assert.equal(run('activeTalk.name'),'Obervampir');run('reply(0);reply(0)');assert.ok(run('wings'));assert.equal(run('mode'),'chapter');
});
test('Lottas Angst steigt bei Vampiren und sinkt während eines beruhigenden Gesprächs',()=>{
 const run=game();run('start();player={x:425,y:320};keys.add("ArrowUp");update(.1);draw()');
 assert.equal(run('fear'),1);assert.ok(run('$("talk-thought").textContent').includes('zittern'));assert.ok(run('$("reply-two").textContent').includes('Angst'));
 run('reply(1)');assert.equal(run('fear'),.55);assert.ok(run('$("talk-thought").textContent').includes('sicherer'));
 run('reply(0)');assert.equal(run('fear'),.2);assert.equal(run('mode'),'playing');assert.ok(run('$("dialog").textContent').includes('getraut'));
});

test('Genau 19 Vampire je Level einschließlich Obervampir und seiner beiden Wachen',()=>{
 for(const [index,level] of rules.CHAPTERS.entries()){
  assert.equal(level.vampires.length+(index===3?1:0),19,level.name);
  for(const v of level.vampires){assert.ok(v.x>level.start.x&&v.x<level.width-150);if(index===1)assert.ok(v.x<rules.BRIDGE_SPAN.left||v.x>rules.BRIDGE_SPAN.right);}
 }
 assert.equal(rules.CHAPTERS[3].vampires.filter(v=>v.guard).length,2);
 const run=game();run('start();chapter=4;setup();mode="playing";player={x:300,y:300};update(0)');assert.equal(run('mode'),'talk');run('reply(0);reply(0)');assert.equal(run('mode'),'playing');
});

test('Begegnung wird erst unmittelbar an Lottas Füßen ausgelöst, nicht weit vorne oder seitlich',()=>{
 const lotta={x:500,y:335};assert.ok(!rules.closeEncounter(lotta,{x:570,y:335}));assert.ok(!rules.closeEncounter(lotta,{x:520,y:400}));assert.ok(rules.closeEncounter(lotta,{x:530,y:335}));
 const feet=rules.chaseProject(lotta.x,lotta.y,lotta);const near=rules.chaseProject(530,335,lotta);const far=rules.chaseProject(650,335,lotta);
 assert.equal(feet.y,440);assert.ok(near.y>410&&near.y<feet.y);assert.ok(far.y<near.y);
});
