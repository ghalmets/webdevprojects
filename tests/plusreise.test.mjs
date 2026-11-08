import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import * as rules from '../plusreise/regeln.mjs';
test('Aufgaben passen zu Zehnern, Stellenwerten und Minus über den Zehner',()=>{
 for(const level of Object.keys(rules.LEVELS))for(let i=0;i<201;i++){
  const t=rules.makeTask(level,()=>i/201,i);assert.ok(t.a>=0&&t.a<=100);assert.ok(t.answer>=0&&t.answer<=100);
  if(t.kind==='stellen'){assert.ok(t.a>=10&&t.a<=99);assert.equal(t.answer,t.place==='Zehner'?Math.floor(t.a/10):t.a%10);}
  else if(t.kind==='buendeln'){assert.equal(t.answer*10+t.answerOnes,t.a);assert.ok(t.answerOnes>=0&&t.answerOnes<=9);}
  else if(t.kind==='ergaenzen'){assert.equal(t.total,t.a+t.b);assert.equal(t.answer,t[t.missing]);assert.equal(t.answer%10,0);assert.ok(t.a%10===0||t.b%10===0);assert.ok(t.total<=100);}
  else{assert.equal(t.answer,t.op==='+'?t.a+t.b:t.a-t.b);assert.ok(t.b>=1&&t.b<=100);}
  if(t.kind==='zehner'){assert.equal(t.a%10,0);assert.equal(t.b%10,0);}
  if(t.kind==='gemischt'){assert.ok((t.a%10===0)!==(t.b%10===0));assert.ok(t.a>=10&&t.b>=10);}
  if(t.kind==='einer'){assert.ok(t.a<=9&&t.b<=9);assert.ok(t.a>=t.b);}
  if(t.kind==='minus'){assert.ok(t.a>=10&&t.a<=99&&t.b<=9);assert.ok(t.a%10<t.b);}
  assert.ok(rules.hintFor(t).length>20);assert.ok(rules.solutionFor(t).length>3);
 }
 const tasks=Array.from({length:10},(_,i)=>rules.makeTask('mix',()=>.5,i));
 assert.equal(tasks.filter(t=>t.op==='+').length,6);assert.equal(tasks.filter(t=>t.kind==='stellen').length,1);assert.equal(tasks.filter(t=>t.op==='−').length,2);assert.equal(tasks.filter(t=>t.kind==='buendeln').length,1);assert.equal(tasks.filter(t=>t.kind==='ergaenzen').length,2);
 assert.ok(rules.hintFor({kind:'minus',a:32,b:7}).includes('32 − 2 = 30'));
 assert.ok(rules.hintFor({kind:'minus',a:30,b:7}).includes('10 Einer'));
 assert.equal(rules.solutionFor({kind:'stellen',a:60,place:'Einer',answer:0}),'60: An der Einerstelle steht 0.');
});
test('Falsche Eingaben kosten keine Sonne, richtige zählen einmal und zehn beenden die Runde',()=>{
 const nodes=new Map();const el=id=>{if(!nodes.has(id))nodes.set(id,{value:id==='level'?'mix':'',textContent:'',hidden:false,style:{},addEventListener(){},setAttribute(){},focus(){}});return nodes.get(id);};const box={...rules,document:{getElementById:el,querySelectorAll:()=>[]},Math};vm.createContext(box);vm.runInContext(fs.readFileSync(new URL('../plusreise/spiel.mjs',import.meta.url),'utf8').replace(/^import .*\n/,''),box);const run=s=>vm.runInContext(s,box);
 run('$("answer").value="";check()');assert.equal(run('solved'),0);
 run('$("answer").value="999";check()');assert.equal(run('solved'),0);assert.ok(!run('locked'));
 run('$("answer").value=String(task.answer);check();check()');assert.equal(run('solved'),1);assert.ok(run('locked'));
 for(let i=1;i<10;i++)run('nextTask();$("answer").value=String(task.answer);if(task.kind==="buendeln")$("answer-ones").value=String(task.answerOnes);check()');assert.equal(run('solved'),10);assert.equal(el('progress-fill').style.width,'100%');
 run('$("level").value="buendeln";restart();task={kind:"buendeln",a:20,answer:2,answerOnes:0};$("answer").value="2";check()');assert.equal(run('solved'),0);
 run('$("answer-ones").value="1";check()');assert.equal(run('solved'),0);
 run('$("answer-ones").value="0";check()');assert.equal(run('solved'),1);assert.ok(run('locked'));
 run('restart()');assert.equal(run('solved'),0);assert.ok(!run('locked'));assert.equal(el('progress-fill').style.width,'0%');
});

test('Bei Ergänzungen fehlt immer ein reiner Zehner, beide Lückenpositionen kommen vor',()=>{
 const positions=new Set();for(let i=0;i<1000;i++){const t=rules.makeTask('ergaenzen',()=>i/1000);positions.add(t.missing);assert.equal(t.answer%10,0);const known=t.missing==='a'?t.b:t.a;assert.equal(known%10,t.total%10);assert.ok(t.a>=10&&t.b>=10);assert.ok(t.a%10===0||t.b%10===0);assert.equal((t.missing==='a'?t.answer:t.a)+(t.missing==='b'?t.answer:t.b),t.total);assert.ok(t.display.includes('□'));assert.ok(rules.solutionFor(t).includes(String(t.answer)));}
 assert.equal(positions.size,2);
 for(const random of [()=>0,()=>.99999]){const t=rules.makeTask('buendeln',random);assert.equal(t.a,t.answer*10+t.answerOnes);}
});
