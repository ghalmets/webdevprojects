import test from 'node:test';
import assert from 'node:assert/strict';
import { SETTINGS, advanceJump, clearsObstacle, collectsCarrot } from '../ponyrennen/core.mjs';
test('Sprung steigt, überwindet Baumstamm und landet wieder am Boden', () => {
 let height = 0, velocity = SETTINGS.jumpVelocity, peak = 0;
 for (let i=0;i<120;i++) {
  ({height,velocity}=advanceJump(height,velocity,1/60)); peak=Math.max(peak,height);
 }
 assert.ok(peak > .55);
 assert.equal(height,0); assert.equal(velocity,0);
 assert.ok(clearsObstacle('log',peak,false));
 assert.ok(!clearsObstacle('log',0,false));
});
test('Unten bringt das Pony schneller nach unten und duckt unter Ästen',()=>{
 const normal=advanceJump(1,0,.1);
 const down=advanceJump(1,0,.1,true);
 assert.ok(down.height < normal.height);
 assert.ok(clearsObstacle('branch',0,true));
 assert.ok(!clearsObstacle('branch',0,false));
 assert.ok(!clearsObstacle('branch',1,true));
 assert.equal(advanceJump(0,0,1,true).height,0);
});
test('Karotten müssen in der passenden Höhe eingesammelt werden',()=>{
 assert.ok(collectsCarrot(0,0)); assert.ok(collectsCarrot(1,1));
 assert.ok(!collectsCarrot(0,1)); assert.ok(!collectsCarrot(1,0));
});
test('Mehr Erholungszeit und großzügige Hindernishöhen',()=>{
 const fullJumpSeconds=2*SETTINGS.jumpVelocity/SETTINGS.gravity;
 assert.ok(SETTINGS.spawnInterval > fullJumpSeconds + 1.5);
 assert.ok(clearsObstacle('log',.4,false));
 assert.ok(clearsObstacle('branch',.25,true));
 assert.ok(!clearsObstacle('log',0,false));
 assert.ok(!clearsObstacle('branch',0,false));
});
test('Hindernisse erreichen erst an der Huf-Linie den Kontaktpunkt', async()=>{
 const {groundY,CONTACT_Y,actionDue}=await import('../ponyrennen/core.mjs');
 assert.equal(groundY(0),CONTACT_Y);
 assert.ok(groundY(.2)<CONTACT_Y);
 for(const speed of SETTINGS.speeds){
  assert.ok(actionDue(speed*.6,speed));
  assert.ok(!actionDue(speed*.8,speed));
  let h=0,v=SETTINGS.jumpVelocity;
  for(let i=0;i<36;i++)({height:h,velocity:v}=advanceJump(h,v,1/60));
  assert.ok(clearsObstacle('log',h,false));
 }
});
