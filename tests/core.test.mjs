import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, overlaps, SETTINGS, TRACK } from '../core.mjs';
test('Pony bleibt am oberen und unteren Wiesenrand',()=>{
 assert.equal(clamp(-100,TRACK.top,TRACK.bottom),TRACK.top);
 assert.equal(clamp(999,TRACK.top,TRACK.bottom),TRACK.bottom);
 assert.equal(clamp(250,TRACK.top,TRACK.bottom),250);
});
test('Objekte treffen nur in unmittelbarer Nähe',()=>{
 const pony={x:180,y:250};
 assert.ok(overlaps(pony,{x:190,y:260}));
 assert.ok(!overlaps(pony,{x:190,y:310}));
 assert.ok(!overlaps(pony,{x:230,y:250}));
});
test('Auch bei hohem Tempo bleibt zwischen Hindernissen Zeit zum Ausweichen',()=>{
 const travelBetweenRows=60/SETTINGS.ponyMoveSpeed;
 assert.ok(SETTINGS.spawnInterval>travelBetweenRows*2);
 assert.equal(SETTINGS.startingHearts,3);
});
