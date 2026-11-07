import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import * as rules from '../plusreise/regeln.mjs';
test('Nur Plusaufgaben im gewählten Zahlenraum und mit richtigem Zehnerübergang',()=>{
 for(const level of Object.keys(rules.LEVELS))for(let i=0;i<101;i++){
  const t=rules.makeTask(level,()=>i/101);assert.ok(t.a>0&&t.b>0);assert.equal(t.answer,t.a+t.b);assert.ok(t.answer<=rules.LEVELS[level].max);
  const crossing=t.a%10+t.b%10>=10;if(level==='mittel')assert.ok(!crossing);if(level==='knifflig')assert.ok(crossing);
 }
 assert.ok(rules.hintFor({a:28,b:7}).includes('28 + 2 = 30'));assert.ok(rules.hintFor({a:23,b:34}).includes('34 = 30 + 4'));
});
test('Falsche Eingaben kosten keine Sonne, richtige zählen einmal und zehn beenden die Runde',()=>{
 const nodes=new Map();const el=id=>{if(!nodes.has(id))nodes.set(id,{value:id==='level'?'mittel':'',textContent:'',hidden:false,style:{},addEventListener(){},setAttribute(){},focus(){}});return nodes.get(id);};const box={...rules,document:{getElementById:el,querySelectorAll:()=>[]},Math};vm.createContext(box);vm.runInContext(fs.readFileSync(new URL('../plusreise/spiel.mjs',import.meta.url),'utf8').replace(/^import .*\n/,''),box);const run=s=>vm.runInContext(s,box);
 run('$("answer").value="";check()');assert.equal(run('solved'),0);
 run('$("answer").value="999";check()');assert.equal(run('solved'),0);assert.ok(!run('locked'));
 run('$("answer").value=String(task.answer);check();check()');assert.equal(run('solved'),1);assert.ok(run('locked'));
 for(let i=1;i<10;i++)run('nextTask();$("answer").value=String(task.answer);check()');assert.equal(run('solved'),10);assert.equal(el('progress-fill').style.width,'100%');
 run('restart()');assert.equal(run('solved'),0);assert.ok(!run('locked'));assert.equal(el('progress-fill').style.width,'0%');
});
