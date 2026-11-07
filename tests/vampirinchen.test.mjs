import test from 'node:test';
import assert from 'node:assert/strict';
import {movePlayer,touchesHedge,touching,BOUNDS,SETTINGS} from '../vampirinchen/regeln.mjs';
test('Lotta bewegt sich in vier Richtungen und bleibt im Garten',()=>{
 const p={x:100,y:420};movePlayer(p,1,0,.1);assert.ok(p.x>100);movePlayer(p,-1,0,.1);assert.equal(p.x,100);
 movePlayer(p,0,-1,.1);assert.ok(p.y<420);movePlayer(p,0,1,.1);assert.equal(p.y,420);
 movePlayer(p,-1,0,10);assert.equal(p.x,BOUNDS.left);
 movePlayer(p,0,1,10);assert.equal(p.y,BOUNDS.bottom);
});
test('Hecken blockieren; Wege oberhalb und unterhalb bleiben frei',()=>{
 assert.ok(touchesHedge(300,300));assert.ok(!touchesHedge(300,220));assert.ok(!touchesHedge(300,440));
 const p={x:220,y:300};movePlayer(p,1,0,.1);assert.equal(p.x,220);
});
test('Diagonale Bewegung ist nicht schneller und Begegnungen haben einen Radius',()=>{
 const p={x:100,y:420};movePlayer(p,1,-1,.1);assert.ok(Math.abs(Math.hypot(p.x-100,p.y-420)-SETTINGS.playerSpeed*.1)<.001);
 assert.ok(touching({x:10,y:10},{x:15,y:15}));assert.ok(!touching({x:10,y:10},{x:100,y:100}));
});
