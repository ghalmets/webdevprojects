import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import * as rules from '../autofahrt/regeln.mjs';
test('Gas, Rückwärtsgang, Ausrollen und Lenkrichtung',()=>{
 const gas=rules.stepCar({...rules.START},{gas:true},.1);assert.ok(gas.y<rules.START.y);assert.ok(gas.speed>0);
 const reverse=rules.stepCar({...rules.START},{reverse:true},.1);assert.ok(reverse.y>rules.START.y);assert.ok(reverse.speed<0);
 const left=rules.stepCar({...rules.START,speed:100},{left:true},.1);assert.ok(left.angle<rules.START.angle);
 const backwards=rules.stepCar({...rules.START,speed:-100},{left:true},.1);assert.ok(backwards.angle>rules.START.angle);
 assert.ok(rules.stepCar({...rules.START,speed:100},{},.1).speed<100);
});
test('Fähnchen sind frei; jede Hindernisreihe lässt einen ausreichend breiten Weg',()=>{
 for(const cp of rules.CHECKPOINTS)assert.ok(!rules.hitsObstacle(cp.x,cp.y));
 for(const o of rules.OBSTACLES){assert.ok(rules.hitsObstacle(o.x+o.w/2,o.y+o.h/2));assert.ok(o.x-209>80||791-o.x-o.w>80);}
});
function game(){const nodes=new Map(),pen=new Proxy({},{get:()=>()=>{},set:()=>true});const el=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',addEventListener(){},focus(){},getContext:()=>pen});return nodes.get(id);};const box={...rules,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},Math};vm.createContext(box);vm.runInContext(fs.readFileSync(new URL('../autofahrt/spiel.mjs',import.meta.url),'utf8').replace(/^import .*\n/,''),box);return s=>vm.runInContext(s,box);}
test('Vampire stoppen, Schutzzeit befreit, Fähnchen und Ziel funktionieren',()=>{
 const run=game();run('start();keys.add("ArrowUp");update(.1);draw()');assert.ok(run('car.y')<rules.START.y);
 run('keys.clear();protection=0;const v=vampirePosition(time,0);car={...START,x:v.x,y:v.y};update(0)');assert.ok(run('stopTime')>0);
 run('update(1);keys.add("ArrowDown");update(.1)');assert.ok(run('car.speed')<0);
 run('keys.clear();car={...START,y:CHECKPOINTS[2].y-20};update(0);reset()');assert.equal(run('checkpoint'),2);assert.equal(run('car.y'),rules.CHECKPOINTS[2].y);
 run('pause();update(1);draw()');assert.equal(run('mode'),'paused');run('start();car.y=100;update(0);draw()');assert.equal(run('mode'),'finished');run('start()');assert.equal(run('checkpoint'),0);
});
test('Lange Rallye bleibt vollständig befahrbar und innerhalb der Weltgrenzen',()=>{
 assert.ok(rules.START.y-150>5000);assert.equal(rules.OBSTACLES.length,17);assert.equal(rules.VAMPIRE_COUNT,6);
 assert.equal(rules.SETTINGS.forwardSpeed,390);
 for(let i=0;i<rules.VAMPIRE_COUNT;i++){const v=rules.vampirePosition(0,i);assert.ok(v.y>150&&v.y<rules.START.y);}
 let car={...rules.START};for(let i=0;i<1000;i++)car=rules.stepCar(car,{reverse:true},.04);
 assert.ok(car.y<=rules.SETTINGS.worldHeight-80);assert.ok(Number.isFinite(car.y));
});
test('Lenken reagiert im Stand und bei langsamer Fahrt ohne bei hohem Tempo zu übersteuern',()=>{
 const stationary=rules.stepCar({...rules.START},{left:true},.1);assert.ok(stationary.angle<rules.START.angle);assert.equal(stationary.x,rules.START.x);assert.equal(stationary.y,rules.START.y);
 const slow=rules.stepCar({...rules.START,speed:35},{gas:true,right:true},.1);
 const fast=rules.stepCar({...rules.START,speed:390},{gas:true,right:true},.1);
 assert.ok(slow.angle>rules.START.angle);assert.ok(fast.angle>rules.START.angle);
 assert.ok(slow.angle-rules.START.angle>fast.angle-rules.START.angle);
 const straight=rules.stepCar({...rules.START},{left:true,right:true},.1);assert.equal(straight.angle,rules.START.angle);
});
