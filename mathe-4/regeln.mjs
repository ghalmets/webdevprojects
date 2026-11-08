export const TOPICS={mix:'Alles gemischt',plus:'Schriftlich addieren',minus:'Schriftlich subtrahieren',umfang:'Umfang: Rechteck & Quadrat',division:'Dividieren ohne Rest',mal:'Mehrstellig multiplizieren',schritte:'10er- & 100er-Schritte',zahlen:'Zahlenschreibweise'};
export const MIX_PLAN=['plus','minus','rechteck','quadrat','division','mal','zehner','hunderter','zahlen','sach'];
export function kindFor(topic,index){if(index===9)return 'sach';if(topic==='mix')return MIX_PLAN[index];if(topic==='umfang')return index%2?'quadrat':'rechteck';if(topic==='schritte')return index%2?'hunderter':'zehner';return topic;}
export const format=n=>n.toLocaleString('de-AT');
const units=['','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun'];
export function numberWord(n){
 if(n===0)return 'null';if(n<10)return units[n];if(n<20)return ['zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn'][n-10];
 if(n<100){const one=n%10;return (one?(one===1?'ein':units[one])+'und':'')+['','','zwanzig','dreißig','vierzig','fünfzig','sechzig','siebzig','achtzig','neunzig'][Math.floor(n/10)];}
 if(n<1000){const hundreds=Math.floor(n/100);return (hundreds===1?'ein':units[hundreds])+'hundert'+(n%100?numberWord(n%100):'');}
 const thousands=Math.floor(n/1000);return (thousands===1?'ein':numberWord(thousands))+'tausend'+(n%1000?numberWord(n%1000):'');
}
export function columnSteps(a,b,op){
 const width=Math.max(String(a).length,String(b).length),places=['Einer','Zehner','Hunderter','Tausender','Zehntausender','Hunderttausender'];let carry=0;const steps=[];
 const digits=String(a).padStart(width,'0').split('').reverse().map(Number);
 for(let i=0;i<width;i++){
  const x=Math.floor(a/10**i)%10,y=Math.floor(b/10**i)%10;
  if(op==='+'){const total=x+y+carry;steps.push(`${places[i]}: ${x} + ${y}${carry?' + '+carry+' Übertrag':''} = ${total}. Schreibe ${total%10}${total>=10?', übertrage 1 in die nächste Spalte.':'.'}`);carry=Math.floor(total/10);}
  else{let prefix='';if(digits[i]<y){let donor=i+1;while(digits[donor]===0)donor++;digits[donor]--;for(let k=donor-1;k>i;k--)digits[k]=9;digits[i]+=10;prefix=`Tausche aus der ${places[donor]}stelle${donor>i+1?' schrittweise über die Zwischenstellen':''} bis zur Stelle ${places[i]}. `;}
   steps.push(`${places[i]}: ${prefix}${digits[i]} − ${y} = ${digits[i]-y}.`);}
 }
 if(op==='+'&&carry)steps.push('Schreibe den letzten Übertrag 1 ganz links dazu.');return steps;
}
export function makeTask(kind,max=10000,random=Math.random,index=0){
 const int=(min,limit)=>min+Math.min(limit-min,Math.floor(random()*(limit-min+1)));
 const base={kind,unit:'',title:'',prompt:'',hint:'',steps:[],answers:[],labels:[],columns:String(max).length};
 if(kind==='plus'||kind==='minus'){
  let a,b;if(kind==='plus'){a=int(100,Math.floor(max*.65));b=int(100,max-a);}else{a=int(1000,max-1);b=int(100,a-1);}
  const op=kind==='plus'?'+':'−';return {...base,a,b,op,title:kind==='plus'?'Schriftlich addieren':'Schriftlich subtrahieren',prompt:'Die Zahlen stehen stellenrichtig untereinander. Trage das Ergebnis von rechts nach links ein. Die Hilfszeile ist für deine Überträge oder Tausch-Notizen.',hint:kind==='plus'?'Beginne bei den Einern. Ab 10 überträgst du einen Zehner in die nächste Spalte.':'Beginne rechts bei den Einern. Reicht eine Ziffer nicht, tausche eine Einheit aus der nächsthöheren Stelle gegen 10 kleinere Einheiten.',steps:columnSteps(a,b,op),answers:[kind==='plus'?a+b:a-b],labels:['Ergebnis']};
 }
 if(kind==='rechteck'||kind==='quadrat'){
  const a=int(3,30),b=kind==='quadrat'?a:int(2,a-1);return {...base,a,b,title:kind==='quadrat'?'Umfang eines Quadrats':'Umfang eines Rechtecks',prompt:'Wie lang ist der Weg einmal rund um die Figur?',unit:'cm',hint:kind==='quadrat'?'Das Quadrat hat vier gleich lange Seiten: U = 4 · a.':'Beim Rechteck sind gegenüberliegende Seiten gleich lang: U = a + b + a + b = 2 · (a + b).',steps:[kind==='quadrat'?`U = 4 · ${a} = ${4*a} cm.`:`U = 2 · (${a} + ${b}) = 2 · ${a+b} = ${2*(a+b)} cm.`],answers:[2*(a+b)],labels:['Umfang']};
 }
 if(kind==='division'){
  const b=int(2,9),quotient=int(12,Math.min(9999,Math.floor(max/b)));return {...base,a:quotient*b,b,title:'Dividieren ohne Rest',prompt:'Wie oft passt der Divisor in die große Zahl? Diese Aufgabe geht ohne Rest auf.',hint:'Teile von links nach rechts. Deine Probe ist: Ergebnis · Divisor = Ausgangszahl.',steps:[`Zerlege ${format(quotient*b)} in passende Vielfache von ${b}.`,`Die Probe: ${format(quotient)} · ${b} = ${format(quotient*b)}.`],answers:[quotient],labels:['Ergebnis']};
 }
 if(kind==='mal'){
  const b=int(12,29),a=int(100,Math.min(999,Math.floor(max/b))),first=a*(b%10),second=a*Math.floor(b/10)*10;
  return {...base,a,b,op:'×',title:'Mehrstellig multiplizieren',prompt:'Multipliziere erst mit den Einern, dann mit den Zehnern. Das zweite Teilprodukt enthält die Zehner-Null. Addiere beide Teilprodukte.',hint:`Zerlege ${b} in ${Math.floor(b/10)*10} + ${b%10}. Die Zehner-Reihe ist um eine Stelle nach links verschoben.`,steps:[`${format(a)} · ${b%10} = ${format(first)}.`,`${format(a)} · ${Math.floor(b/10)*10} = ${format(second)}.`,`${format(first)} + ${format(second)} = ${format(a*b)}.`],answers:[first,second,a*b],labels:['Teilprodukt · Einer','Teilprodukt · Zehner (mit Null)','Gesamtergebnis']};
 }
 if(kind==='zehner'||kind==='hunderter'){
  const step=kind==='zehner'?10:100,direction=Math.floor(index/2)%2?-1:1,start=int(direction>0?0:4*step,direction>0?max-4*step:max);
  return {...base,a:start,step:step*direction,title:`Zählen in ${step}er-Schritten`,prompt:`Zähle in ${step}er-Schritten ${direction>0?'vorwärts':'rückwärts'}. Ergänze die letzten beiden Zahlen.`,hint:`${direction>0?'Addiere':'Subtrahiere'} immer ${step}. Achte besonders auf den Übergang beim Hunderter oder Tausender.`,steps:[`Jeder Pfeil bedeutet ${direction>0?'+':'−'} ${step}.`],sequence:[start,start+step*direction],answers:[start+2*step*direction,start+3*step*direction],labels:['Nächste Zahl','Zahl danach']};
 }
 if(kind==='zahlen'){
  const a=int(100,max-1),variant=index%3,places=(max===10000?['T','H','Z','E']:['ZT','T','H','Z','E']),digits=String(a).padStart(places.length,'0').split('').map(Number);
  if(variant===1)return {...base,a,variant,title:'Zahl als Stellenwerte schreiben',prompt:`Zerlege ${format(a)}. Trage bei jeder Stelle die richtige Ziffer ein – auch eine 0.`,hint:'E = Einer, Z = Zehner, H = Hunderter, T = Tausender, ZT = Zehntausender. Lies die Stellen von rechts nach links.',steps:[places.map((p,i)=>`${digits[i]} ${p}`).join(' + ')],answers:digits,labels:places};
  return {...base,a,variant,title:variant===2?'Zahlwort als Zahl schreiben':'Stellenwerte als Zahl schreiben',prompt:variant===2?numberWord(a):places.map((p,i)=>`${digits[i]} ${p}`).join(' + '),hint:'Ordne jeder Stelle ihren Platz zu. Fehlt eine Stelle, schreibst du dort eine 0. Punkte oder Leerzeichen als Tausendertrennung sind erlaubt.',steps:[`${numberWord(a)} = ${format(a)}.`],answers:[a],labels:['Zahl in Ziffern']};
 }
 if(kind==='sach'){
  const classes=int(3,6),perClass=int(18,36),extra=int(20,60);return {...base,a:classes,b:perClass,extra,title:'Eine Sachaufgabe zum Schluss',prompt:`Für das Schulfest bestellt jede von ${classes} Klassen ${perClass} Muffins. Die Eltern bringen zusätzlich ${extra} Muffins mit. Wie viele Muffins gibt es insgesamt?`,unit:'Muffins',hint:'Rechne zuerst: Anzahl der Klassen · Muffins pro Klasse. Addiere danach die Muffins der Eltern.',steps:[`${classes} · ${perClass} = ${classes*perClass} Muffins.`,`${classes*perClass} + ${extra} = ${classes*perClass+extra} Muffins insgesamt.`],answers:[classes*perClass+extra],labels:['Insgesamt']};
 }
 throw new Error('Unbekannte Aufgabe: '+kind);
}
export function readNumber(value){const clean=String(value).replace(/[.\s\u00a0\u202f]/g,'');return /^\d+$/.test(clean)?Number(clean):null;}
