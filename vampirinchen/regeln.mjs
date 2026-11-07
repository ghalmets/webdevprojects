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

export const CHAPTERS = [
 {name:'Der große Schlossgarten',width:2400,start:{x:80,y:430},target:'Drei Mondsteine sammeln und rechts ins Schloss gehen.',gems:[{x:350,y:230},{x:1150,y:435},{x:1850,y:230}],blocks:[{x:550,y:290,w:230,h:65},{x:1400,y:350,w:220,h:65}],vampires:[{x:870,y:320},{x:1280,y:320},{x:1970,y:320}]},
 {name:'Die wackelige Brücke',width:1900,start:{x:80,y:350},target:'Den Schlüssel holen. Langsam mittig über die Holzbrücke zur Falltür.',gems:[{x:380,y:350}],blocks:[],vampires:[]},
 {name:'Im Schlosskeller',width:2100,start:{x:80,y:435},target:'Den Kellerschlüssel finden, Vampiren ausweichen und rechts mit ↑ die Leiter hochklettern.',gems:[{x:1100,y:230}],blocks:[{x:450,y:290,w:200,h:70},{x:1390,y:340,w:230,h:65}],vampires:[{x:800,y:320},{x:1250,y:320},{x:1720,y:320}]},
 {name:'Der Turm des Obervampirs',width:1500,start:{x:80,y:435},target:'Drei Zaubersteine finden und beim Obervampir ↑ drücken, um dir Flügel zu wünschen.',gems:[{x:350,y:230},{x:650,y:435},{x:950,y:230}],blocks:[],vampires:[]},
 {name:'Mit Flügeln nach Hause',width:2600,start:{x:100,y:300},target:'Du kannst fliegen! Folge dem Mond nach rechts bis zu Lottas Haus.',gems:[],blocks:[],vampires:[]}
];
export function onBridge(x,y){return x<600||x>1150||(y>=302&&y<=378);}
