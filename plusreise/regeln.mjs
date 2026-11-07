export const LEVELS={leicht:{label:'Bis 20',max:20},mittel:{label:'Bis 100 · ohne Zehnerübergang',max:100},knifflig:{label:'Bis 100 · mit Zehnerübergang',max:100}};
export function makeTask(level='mittel',random=Math.random){
 const tasks=[];
 for(let a=1;a<LEVELS[level].max;a++)for(let b=1;b<=Math.min(50,LEVELS[level].max-a);b++){
  const crossing=a%10+b%10>=10;
  if(level==='mittel'&&crossing)continue;
  if(level==='knifflig'&&!crossing)continue;
  tasks.push({a,b,answer:a+b});
 }
 return tasks[Math.min(tasks.length-1,Math.floor(random()*tasks.length))];
}
export function hintFor({a,b}){
 const gap=10-a%10;
 if(a%10+b%10>=10&&b>gap)return `Fülle zuerst den nächsten Zehner: ${a} + ${gap} = ${a+gap}. Von ${b} bleiben noch ${b-gap} übrig. Zähle sie dazu!`;
 const tens=Math.floor(b/10)*10,ones=b%10;
 if(tens&&ones)return `Zerlege die zweite Zahl: ${b} = ${tens} + ${ones}. Rechne zuerst ${a} + ${tens} und zähle dann ${ones} dazu.`;
 return `Starte bei ${a} und zähle ${b} Schritte weiter. Du kannst deine Finger oder den Zahlenstrahl benutzen.`;
}
