import test from 'node:test';import assert from 'node:assert/strict';import {TOPICS,kindFor,makeTask,numberWord,readNumber,columnSteps} from '../mathe-4/regeln.mjs';
test('Genau eine Sachaufgabe pro Runde bei jeder Themenwahl',()=>{
 for(const topic of Object.keys(TOPICS)){const kinds=Array.from({length:10},(_,i)=>kindFor(topic,i));assert.equal(kinds.filter(k=>k==='sach').length,1);assert.equal(kinds[9],'sach');}
 const mix=Array.from({length:10},(_,i)=>kindFor('mix',i));for(const kind of ['plus','minus','rechteck','quadrat','division','mal','zehner','hunderter','zahlen'])assert.ok(mix.includes(kind));
});
test('Aufgaben und Lösungen stimmen in beiden Zahlenräumen, auch an den Grenzen',()=>{
 for(const max of [10000,100000])for(const r of [0,.11,.5,.91,.999999])for(let i=0;i<10;i++){
  const kind=kindFor('mix',i),t=makeTask(kind,max,()=>r,i);assert.ok(t.hint.length>10);assert.ok(t.steps.length>0);for(const answer of t.answers)assert.ok(Number.isInteger(answer)&&answer>=0&&answer<=max);
  if(kind==='plus')assert.equal(t.answers[0],t.a+t.b);
  if(kind==='minus')assert.equal(t.answers[0],t.a-t.b);
  if(kind==='rechteck'||kind==='quadrat'){assert.equal(t.answers[0],2*(t.a+t.b));assert.equal(t.unit,'cm');if(kind==='quadrat')assert.equal(t.a,t.b);}
  if(kind==='division')assert.equal(t.answers[0]*t.b,t.a);
  if(kind==='mal'){assert.equal(t.answers[0]+t.answers[1],t.answers[2]);assert.equal(t.answers[2],t.a*t.b);assert.equal(t.answers[1]%10,0);assert.ok(t.a>=100&&t.a<=999&&t.b>=10&&t.b<=99);}
  if(t.sequence){assert.equal(t.answers[0],t.sequence[1]+t.step);assert.equal(t.answers[1],t.answers[0]+t.step);}
  if(kind==='sach')assert.equal(t.answers[0],t.a*t.b+t.extra);
 }
});
test('Zahlenschreibweise, Zahlwörter und Eingaben berücksichtigen Nullen und Tausender',()=>{
 for(let i=0;i<3;i++){const t=makeTask('zahlen',100000,()=>.37,i);if(t.variant===1)assert.equal(Number(t.answers.join('')),t.a);else assert.equal(t.answers[0],t.a);}
 assert.equal(numberWord(1005),'eintausendfünf');assert.equal(numberWord(3042),'dreitausendzweiundvierzig');assert.equal(numberWord(99999),'neunundneunzigtausendneunhundertneunundneunzig');
 assert.equal(readNumber('10.005'),10005);assert.equal(readNumber('10 005'),10005);assert.equal(readNumber('0'),0);assert.equal(readNumber(''),null);assert.equal(readNumber('2,5'),null);
 const steps=columnSteps(1000,1,'−');assert.ok(steps[0].includes('10 − 1 = 9'));assert.ok(steps[1].includes('9 − 0 = 9'));assert.ok(!steps.join(' ').includes('−1'));
});
