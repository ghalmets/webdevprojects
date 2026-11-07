import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import * as rules from '../handball/regeln.mjs';
test('Wurfzone, Torwartreichweite und Passen haben klare Grenzen',()=>{
 assert.ok(!rules.canShoot({x:600}));assert.ok(rules.canShoot({x:650}));assert.ok(rules.saveAt(260,290));assert.ok(!rules.saveAt(260,330));
 assert.notEqual(rules.passTarget([{x:100,y:200},{x:300,y:100},{x:350,y:350}],0,[{x:300,y:100}]),0);
});
function game(){const nodes=new Map(),pen=new Proxy({},{get:()=>()=>{},set:()=>true});const el=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',addEventListener(){},focus(){},getContext:()=>pen});return nodes.get(id);};const box={...rules,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},Math};vm.createContext(box);vm.runInContext(fs.readFileSync(new URL('../handball/spiel.mjs',import.meta.url),'utf8').replace(/^import .*\n/,''),box);return s=>vm.runInContext(s,box);}
test('Laufen, Haken, Pass, eigener Schuss und Torwartwechsel',()=>{
 const run=game();run('start();keys.add("ArrowRight");update(.1);keys.clear();draw()');assert.ok(run('players[active].x')>180);
 run('shoot()');assert.equal(run('phase'),'attack');run('players[active]={x:450,y:220};hook()');assert.ok(run('hookTimer')>0);const y=run('players[active].y');run('hook()');assert.equal(run('players[active].y'),y);
 run('update(.2);pass()');assert.notEqual(run('active'),0);run('players[active].x=760;shoot();for(let i=0;i<100;i++)update(.04);draw()');assert.equal(run('phase'),'keeper');
 run('targetY=260;keeperY=260;for(let i=0;i<100;i++)update(.04);draw()');assert.equal(run('away'),0);assert.ok(['result','attack'].includes(run('phase')));
 run('goalkeeping();targetY=340;keeperY=175;for(let i=0;i<100;i++)update(.04)');assert.equal(run('away'),1);
 run('pause();update(1)');assert.equal(run('mode'),'paused');run('start();remaining=.01;update(.02);draw()');assert.equal(run('mode'),'finished');run('start()');assert.equal(run('home'),0);assert.equal(run('away'),0);
});
test('Gegenangriff läuft zum Tor, wechselt Werferin und wirft erst nach dem Anlauf',()=>{
 const run=game();run('start();goalkeeping()');const initial=run('runners[0].x');
 run('update(.5);draw()');assert.ok(run('runners[0].x')<initial);assert.equal(run('shot'),null);
 run('update(.8)');assert.equal(run('thrower'),1);assert.equal(run('shot'),null);
 run('update(1)');assert.equal(run('shot'),null);
 run('update(.31);draw()');assert.ok(run('shot'));assert.ok(run('shot.x')<run('runners[1].x'));
 assert.ok(rules.SETTINGS.counterThrowSpeed>400);
 assert.ok(rules.SETTINGS.counterWarningSeconds<1);
 assert.ok(!rules.saveAt(260,295,rules.SETTINGS.keeperReach));
 assert.ok(rules.saveAt(260,280,rules.SETTINGS.keeperReach));
});

test('Haken nur vor einer nahen Gegnerin; kurzer seitlicher Weg ohne weite Sprünge',()=>{
 assert.equal(rules.hookTarget({x:180,y:260},[{x:490,y:220}]),null);
 assert.equal(rules.hookTarget({x:600,y:220},[{x:490,y:220}]),null);
 const p={x:450,y:220},defenders=[{x:490,y:220}];
 for(const side of [-1,1]){const t=rules.hookTarget(p,defenders,side);assert.ok(t);assert.equal(t.direction,side);assert.ok(Math.hypot(t.x-p.x,t.y-p.y)<=56);assert.ok(Math.abs(t.x-p.x)<=12);assert.ok(Math.hypot(t.x-490,t.y-220)>=38);}
 const edge=rules.hookTarget({x:450,y:95},[{x:490,y:95}],-1);assert.ok(edge.y>=90);
 const run=game();run('start();hook()');assert.equal(run('hookMove'),null);assert.equal(run('hookTimer'),0);
 run('players[active]={x:450,y:220};hook();update(.08)');assert.ok(run('hookMove'));assert.ok(run('players[active].x')<462);
 run('update(.08);draw()');assert.equal(run('hookMove'),null);assert.ok(Math.abs(run('players[active].y')-220)<=46);
});
