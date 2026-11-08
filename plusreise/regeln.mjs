export const LEVELS={
 mix:{label:'Lernmix · Schwerpunkt Zehner-Plus',max:100},
 zehner:{label:'Reine Zehner addieren',max:100},
 gemischt:{label:'Reiner Zehner + gemischte Zahl',max:100},
 ergaenzen:{label:'Ergänzen · reinen Zehner finden',max:100},
 buendeln:{label:'Einer zu Zehnern bündeln',max:100},
 stellen:{label:'Zehner- und Einerstelle erkennen',max:100},
 einer:{label:'Einer minus Einer',max:9},
 minus:{label:'Zweistellig minus einstellig · Zehnerübergang',max:100}
};
// Sechs von zehn Mix-Aufgaben sind die gewünschten Zehner-Plusrechnungen.
export const MIX_PLAN=['zehner','gemischt','stellen','ergaenzen','einer','gemischt','buendeln','zehner','minus','ergaenzen'];
const pools={zehner:[],gemischt:[],stellen:[],einer:[],minus:[],ergaenzen:[],buendeln:[]};
function calculation(kind,a,b,op){return {kind,a,b,op,answer:op==='+'?a+b:a-b,prompt:op==='+'?'WIE VIEL IST DAS ZUSAMMEN?':'WIE VIEL BLEIBT ÜBRIG?',display:`${a} ${op} ${b} = ?`};}
for(let a=10;a<=90;a+=10)for(let b=10;a+b<=100;b+=10)pools.zehner.push(calculation('zehner',a,b,'+'));
for(let tens=10;tens<=90;tens+=10)for(let mixed=11;mixed+tens<=100;mixed++)if(mixed%10!==0){pools.gemischt.push(calculation('gemischt',tens,mixed,'+'));pools.gemischt.push(calculation('gemischt',mixed,tens,'+'));}
for(let a=10;a<=99;a++)for(const place of ['Zehner','Einer'])pools.stellen.push({kind:'stellen',a,place,answer:place==='Zehner'?Math.floor(a/10):a%10,prompt:`WELCHE ZIFFER STEHT AN DER ${place.toUpperCase()}STELLE?`,display:String(a)});
for(let a=1;a<=9;a++)for(let b=1;b<=a;b++)pools.einer.push(calculation('einer',a,b,'−'));
for(let a=10;a<=99;a++)for(let b=1;b<=9;b++)if(a%10<b)pools.minus.push(calculation('minus',a,b,'−'));
// Ergänzungen stammen ausschließlich aus denselben Zehner-Plusaufgaben.
for(const base of [...pools.zehner,...pools.gemischt])for(const missing of ['a','b'])if(base[missing]%10===0)pools.ergaenzen.push({...base,kind:'ergaenzen',missing,total:base.answer,answer:base[missing],prompt:'WELCHE ZAHL FEHLT IM KÄSTCHEN?',display:`${missing==='a'?'□':base.a} + ${missing==='b'?'□':base.b} = ${base.answer}`});
for(let a=10;a<=100;a++)pools.buendeln.push({kind:'buendeln',a,answer:Math.floor(a/10),answerOnes:a%10,prompt:'BÜNDLE JEWEILS 10 EINER ZU EINEM ZEHNER.',display:`${a} Einer`});
export function makeTask(level='mix',random=Math.random,taskIndex=0){
 const kind=level==='mix'?MIX_PLAN[taskIndex%MIX_PLAN.length]:level;
 const pool=pools[kind];return {...pool[Math.min(pool.length-1,Math.floor(random()*pool.length))]};
}
export function solutionFor(task){
 if(task.kind==='buendeln')return `${task.a} Einer = ${task.answer} Zehner und ${task.answerOnes} Einer.`;
 if(task.kind==='ergaenzen')return `${task.a} + ${task.b} = ${task.total}. Die fehlende Zahl ist ${task.answer}.`;
 return task.kind==='stellen'?`${task.a}: An der ${task.place}stelle steht ${task.answer}.`:`${task.a} ${task.op} ${task.b} = ${task.answer}.`;}
export function hintFor(task){
 const {a,b,kind}=task;
 if(kind==='buendeln')return `Nimm immer 10 Einer und mache daraus ein Zehnerpaket. Wie viele volle Pakete kannst du aus ${a} Einern machen? Trage die Pakete bei Zehner ein und den Rest bei Einer. Auch 0 ist als Rest möglich.`;
 if(kind==='ergaenzen'){const known=task.missing==='a'?b:a;return `Starte bei ${known} und ergänze bis ${task.total}. Es fehlt ein reiner Zehner. Die Einer bleiben gleich: Vergleiche die Anzahl der Zehner. Du kannst auch ${task.total} − ${known} rechnen.`;}
 if(kind==='zehner')return `Rechne mit Zehnerpaketen: ${a} sind ${a/10} Zehner und ${b} sind ${b/10} Zehner. Addiere die Pakete. Jeder Zehner ist 10 wert.`;
 if(kind==='gemischt'){const mixed=a%10?a:b,tens=a%10?b:a;return `Zerlege ${mixed} in ${Math.floor(mixed/10)} Zehner und ${mixed%10} Einer. Bei + ${tens} kommen nur ${tens/10} Zehner dazu. Die Einer bleiben gleich!`;}
 if(kind==='stellen')return task.place==='Zehner'?'Bei einer zweistelligen Zahl steht die Zehnerziffer links. Sie zählt die vollen Zehnerpakete. Die Einerziffer steht rechts.':'Die Einerziffer ist die letzte Ziffer ganz rechts. Auch 0 kann an der Einerstelle stehen.';
 if(kind==='einer')return `Starte bei ${a}. Nimm ${b} weg oder gehe ${b} Schritte rückwärts. Wenn nichts übrig bleibt, ist das Ergebnis 0.`;
 const ones=a%10;
 if(ones===0)return `Tausche bei ${a} einen Zehner gegen 10 Einer. Das sind ${a-10} und 10. Nimm von den 10 Einern ${b} weg. Die ${a-10} bleiben dazu.`;
 return `Gehe zuerst bis zum Zehner zurück: ${a} − ${ones} = ${a-ones}. Von ${b} musst du dann noch ${b-ones} wegnehmen.`;
}
