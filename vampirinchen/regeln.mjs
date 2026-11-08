export const SETTINGS = { playerSpeed: 190, vampireSpeeds: [85, 105, 125], rounds: 3 };
export const BOUNDS = { left: 35, right: 925, top: 190, bottom: 470 };
export const HEDGES = [{x:245,y:275,w:140,h:62},{x:580,y:350,w:140,h:62}];
export function touchesHedge(x,y) {
 return HEDGES.some(h=>x+17>h.x&&x-17<h.x+h.w&&y+11>h.y&&y-11<h.y+h.h);
}
export function movePlayer(player,dx,dy,dt,bounds=BOUNDS,blocks=HEDGES) {
 const length=Math.hypot(dx,dy)||1;
 const x=Math.max(bounds.left,Math.min(bounds.right,player.x+dx/length*SETTINGS.playerSpeed*dt));
 const y=Math.max(bounds.top,Math.min(bounds.bottom,player.y+dy/length*SETTINGS.playerSpeed*dt));
 if(!blocks.some(h=>x+17>h.x&&x-17<h.x+h.w&&player.y+11>h.y&&player.y-11<h.y+h.h))player.x=x;
 if(!blocks.some(h=>player.x+17>h.x&&player.x-17<h.x+h.w&&y+11>h.y&&y-11<h.y+h.h))player.y=y;
 return player;
}
export function touching(a,b,radius=40){return Math.hypot(a.x-b.x,a.y-b.y)<radius;}

export const BRIDGES=[{name:'Mondbrücke',top:230,bottom:294,center:262},{name:'Sternbrücke',top:388,bottom:452,center:420}];
export const BRIDGE_SPAN={left:700,right:1500};
export const CELLAR_KEYS=[{x:750,y:230,name:'Mondschlüssel'},{x:2050,y:435,name:'Sternschlüssel'},{x:3450,y:230,name:'Herzschlüssel'},{x:4700,y:435,name:'Blitzschlüssel'}];
const stones=(count,from,to)=>Array.from({length:count},(_,i)=>({x:from+i*(to-from)/(count-1),y:i%2?435:230}));
const patrols=(count,from,to)=>Array.from({length:count},(_,i)=>({x:from+i*(to-from)/(count-1),y:320}));
export const CHAPTERS = [
 {name:'Der riesige Schlossgarten',width:4400,start:{x:80,y:430},target:'Sammle 14 Mondsteine. 19 Vampire bewachen den Weg zum Schloss vor dir.',gems:stones(14,300,3900),blocks:[{x:550,y:290,w:230,h:65},{x:1400,y:350,w:220,h:65},{x:2400,y:280,w:220,h:70},{x:3300,y:340,w:200,h:65}],vampires:patrols(19,460,4050)},
 {name:'Die zwei Hängebrücken',width:2700,start:{x:80,y:350},target:'Hole den Schlüssel. Wähle Mondbrücke links oder Sternbrücke rechts. Danach durch die Falltür fallen. Unten warten drei Eingänge!',gems:[{x:380,y:350}],blocks:[],vampires:[...patrols(8,220,620),...patrols(11,1580,2140)]},
 {name:'Der lange Schlosskeller',width:5600,start:{x:80,y:435},target:'Sammle 8 Mondsteine und 4 Schlüssel. Errate bei der Leiter den richtigen Schlüssel.',gems:stones(8,400,5000),blocks:[{x:450,y:290,w:200,h:70},{x:1390,y:340,w:230,h:65},{x:2500,y:280,w:220,h:65},{x:3650,y:340,w:220,h:65},{x:4600,y:280,w:210,h:65}],vampires:patrols(19,550,5150)},
 {name:'Der Turm des Obervampirs',width:1800,start:{x:80,y:435},target:'Sammle 8 Zaubersteine. Sprich mit beiden Turmwachen, dann beim Obervampir ↑ für deinen Flügelwunsch drücken.',gems:stones(8,250,1320),blocks:[],vampires:[...patrols(16,350,1320),{x:1440,y:290,name:'Linke Turmwache',guard:true},{x:1470,y:410,name:'Rechte Turmwache',guard:true}]},
 {name:'Mit Flügeln nach Hause',width:2600,start:{x:100,y:300},target:'Du kannst fliegen! Fliege in der Luft! ↑ steigen, ↓ sinken, ←/→ ausweichen. Zum Haus rechts fliegen.',gems:[],blocks:[],vampires:patrols(19,300,2300)}
];
export function bridgeAt(y){return BRIDGES.findIndex(b=>y>=b.top+4&&y<=b.bottom-4);}
export function onBridge(x,y){return x<BRIDGE_SPAN.left||x>BRIDGE_SPAN.right||bridgeAt(y)!==-1;}

// Begegnungen werden an den Füßen in der Spielwelt gemessen, nicht an einer Bildschirmkante.
export function closeEncounter(lotta,vampire){return Math.abs(lotta.x-vampire.x)<=32&&Math.abs(lotta.y-vampire.y)<=26;}
export function chaseProject(x,y,lotta){
 const depth=x-lotta.x+300;if(depth<210||depth>1800)return null;
 const scale=300/depth;return {x:480+(y-335)*2*scale,y:135+305*scale,scale};
}

export const FLIGHT={speed:145,minHeight:65,maxHeight:195,climbSpeed:85};
export function flightCollision(lotta,altitude,vampire,height){return closeEncounter(lotta,vampire)&&Math.abs(altitude-height)<32;}
export function vampireAltitude(time,index){return 125+Math.sin(time*.65+index*1.6)*48;}

export const AVATARS={
 lea:{name:'Lea',portrait:'lea.svg',description:'Lea mit mittelbraunen langen Haaren, gelbem Kleid und lila Sandalen',outfit:'dress',dress:'#e6c453',top:'#e6c453',bottom:'#e6c453',skin:'#edc5aa',shoes:'#9966b4',sandals:true,hairStyle:'long',hairTop:'#986847',hair:'#885b3e',highlight:'#c69a69',wings:'#e6d4a5'},
 luna:{name:'Luna',portrait:'luna.svg',description:'Luna mit wuscheligen schwarzen Haaren, dunkler Haut, dunkelblauem T-Shirt, schwarzem Rock und braunen Schuhen',outfit:'skirt',dress:'#25242b',top:'#243c68',bottom:'#25242b',skin:'#8d583e',shoes:'#765039',sandals:false,hairStyle:'curly',hairTop:'#25212a',hair:'#17151d',highlight:'#443746',wings:'#b8c8eb'},
 lilly:{name:'Lilly',portrait:'lilly.svg',description:'Lilly mit blonden schulterlangen Haaren, braunem T-Shirt, grüner Hose und braunen Schuhen',outfit:'pants',dress:'#678b55',top:'#886149',bottom:'#678b55',skin:'#edc5aa',shoes:'#765039',sandals:false,hairStyle:'shoulder',hairTop:'#d6b575',hair:'#c29d5e',highlight:'#efdc9b',wings:'#d5dfb5'},
 hanna:{name:'Hanna',portrait:'hanna.svg',description:'Hanna mit mittelbraunen Haaren, weißem Einhorn-T-Shirt, gepunkteten Leggings und weißen Schuhen',outfit:'leggings',dress:'#8d719d',top:'#fffaf0',bottom:'#8d719d',skin:'#edc5aa',shoes:'#fffaf4',sandals:false,hairStyle:'shoulder',hairTop:'#986847',hair:'#885b3e',highlight:'#c69a69',wings:'#e4d7f1',unicorn:true}
};
