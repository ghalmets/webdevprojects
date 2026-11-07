import {SETTINGS,HEDGES,movePlayer,touching} from './regeln.mjs';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const keys=new Set();let mode='ready',round=1,score=0,time=0,cooldown=0,chatTimer=0;
let player={x:80,y:420},vampire={x:480,y:300},gems=[];
const greetings=['Lotta: „Ich bin dir nicht böse! Darf ich bitte vorbei?“','Vampirinchen: „Entschuldige, Lotta! Mein Magen hat geknurrt.“','Lotta: „Du hast Blutdurst? Ich habe lieber einen Picknickkorb dabei!“'];
let chatIndex=0;
function say(text){$('dialog').textContent=text;chatTimer=4;}
function setup(){player={x:80,y:420};vampire={x:480,y:300};gems=[{x:175,y:225},{x:460,y:440},{x:795,y:235}];score=0;time=0;cooldown=1;keys.clear();$('score').textContent=0;$('level').textContent=`Garten ${round} / ${SETTINGS.rounds}`;say('Lotta: „Ich hole die drei Mondsteine. Bis gleich, Vampirinchen!“');}
function overlay(tag,title,text,button){$('tag').textContent=tag;$('title').textContent=title;$('description').textContent=text;$('start').textContent=button;$('overlay').hidden=false;}
function start(){if(mode==='paused'){mode='playing';$('overlay').hidden=true;$('pause').textContent='Pause';return;}if(mode==='won')round++;if(mode==='finished')round=1;setup();mode='playing';$('overlay').hidden=true;$('pause').disabled=false;$('pause').textContent='Pause';}
function pause(){if(mode==='paused'){start();return;}if(mode!=='playing')return;keys.clear();mode='paused';$('pause').textContent='Weiter';overlay('KLEINE MONDSCHEINPAUSE','Alles wartet auf dich.','Lotta und Vampirinchen verschnaufen kurz.','Weiter geht’s →');}
function win(){keys.clear();$('pause').disabled=true;mode=round===SETTINGS.rounds?'finished':'won';say('Vampirinchen: „Guten Heimweg, Lotta! Bis zum nächsten Mondschein!“');overlay('FREUNDLICHKEIT GEWINNT',mode==='finished'?'Drei Gärten geschafft!':'Am Gartentor angekommen!',mode==='finished'?'Lotta hat alle Mondsteine gesammelt und Vampirinchen freundlich hinter sich gelassen. Ein schönes Nachtabenteuer!':'Alle Mondsteine sind dabei. Lotta winkt Vampirinchen zum Abschied zu. Im nächsten Garten geht es weiter.',mode==='finished'?'Nochmal spielen →':'Zum nächsten Garten →');$('start').focus({preventScroll:true});}
function update(dt){if(mode!=='playing')return;time+=dt;cooldown=Math.max(0,cooldown-dt);chatTimer=Math.max(0,chatTimer-dt);
 const dx=Number(keys.has('ArrowRight')||keys.has('d'))-Number(keys.has('ArrowLeft')||keys.has('a'));
 const dy=Number(keys.has('ArrowDown')||keys.has('s'))-Number(keys.has('ArrowUp')||keys.has('w'));
 movePlayer(player,dx,dy,dt);
 vampire.y=325+Math.sin(time*SETTINGS.vampireSpeeds[round-1]/100)*125;
 vampire.x=480+Math.sin(time*.6)*35;
 if(touching(player,vampire)&&cooldown===0){cooldown=3;say(greetings[chatIndex++%greetings.length]);/* Freundliche Begegnung: keine Strafe, kein Zurücksetzen. */}
 for(const gem of gems)if(!gem.collected&&touching(player,gem,30)){gem.collected=true;score++;$('score').textContent=score;say(score===3?'Lotta: „Alle Mondsteine gefunden! Jetzt zum leuchtenden Tor rechts!“':'Lotta: „Ein Mondstein! Der funkelt aber schön.“');}
 if(player.x>865&&player.y>350){if(score===3)win();else if(chatTimer===0)say('Lotta: „Mir fehlen noch Mondsteine. Ich suche weiter!“');}
}
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();}
function line(points,color,width=3){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function character(p,isVampire){const bob=mode==='playing'?Math.sin(time*9)*2:0;ctx.save();ctx.translate(p.x,p.y+bob);ellipse(0,7,23,8,'#17132966');
 if(isVampire)poly([[-13,-59],[-39,-3],[0,-14],[36,0],[14,-59]],'#974d79');
 line([[-8,-12],[-10,4]],'#453951',6);line([[8,-12],[10,4]],'#453951',6);
 poly([[-12,-49],[12,-49],[19,-9],[-19,-9]],isVampire?'#5d416f':'#d88b78');
 ellipse(0,-65,19,23,isVampire?'#e3d9ed':'#f3d0ae');
 if(isVampire){poly([[-20,-66],[-20,-85],[0,-93],[20,-82],[18,-63],[7,-79],[0,-75],[-8,-80]],'#382a4c');poly([[-5,-55],[-1,-48],[2,-55]],'white');}
 else{poly([[-20,-54],[-23,-80],[-10,-91],[12,-88],[24,-70],[20,-48],[13,-55],[13,-74],[-8,-80],[-13,-64]],'#986847');ellipse(-17,-79,8,5,'#e6b9d4');}
 ellipse(-6,-66,2,2,'#47354c');ellipse(7,-66,2,2,'#47354c');line([[-4,-56],[1,-54],[6,-56]],'#9e6474',1.7);
 line([[-12,-42],[-24,-25]],isVampire?'#d6c9e6':'#f3d0ae',5);line([[12,-42],[23,-27]],isVampire?'#d6c9e6':'#f3d0ae',5);
 ctx.textAlign='center';ctx.font='bold 12px system-ui';ctx.fillStyle='#fff0dc';ctx.fillText(isVampire?'Vampirinchen':'Lotta',0,-104);ctx.restore();}
function draw(){ctx.fillStyle='#302840';ctx.fillRect(0,0,960,520);ellipse(790,61,36,36,'#f1deb1');ellipse(805,52,30,30,'#302840');
 for(let i=0;i<30;i++)ellipse((i*137+25)%960,(i*59+20)%155,1.4,1.4,'#c6b4d7');
 // Schloss und Bäume in der Ferne; Figuren werden von der Seite gezeigt.
 ctx.fillStyle='#252139';ctx.fillRect(50,70,115,115);ctx.fillRect(65,40,25,145);ctx.fillRect(130,50,25,135);poly([[60,40],[78,12],[95,40]],'#252139');poly([[125,50],[143,22],[161,50]],'#252139');
 for(let i=0;i<3;i++){ctx.fillStyle='#c3a979';ctx.fillRect(78+i*28,100,10,17);}
 ctx.fillStyle='#53634e';ctx.fillRect(0,175,960,345);ctx.fillStyle='#91816f';ctx.fillRect(0,210,960,60);ctx.fillRect(0,425,960,65);ctx.fillRect(405,210,145,280);ctx.fillRect(770,210,180,280);
 for(let i=0;i<13;i++){line([[i*80,180],[i*80,151]],'#7e7781',3);line([[i*80,160],[i*80+80,160]],'#7e7781',2);}
 for(let i=0;i<40;i++){const x=(i*151)%960,y=285+(i*47)%130;ellipse(x,y,2,3,'#a49aab');}
 // Zieltor bleibt rechts sichtbar.
 ctx.fillStyle=score===3?'#d8c18c':'#8a7899';ctx.fillRect(866,340,7,96);ctx.fillRect(931,340,7,96);line([[869,340],[901,316],[935,340]],score===3?'#f1d597':'#8a7899',6);
 ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillStyle='#f4e2be';ctx.fillText(score===3?'ZUM AUSGANG →':'TOR · 3 MONDSTEINE',877,462);
 for(const h of HEDGES){ctx.fillStyle='#384e44';ctx.fillRect(h.x,h.y,h.w,h.h);for(let j=0;j<5;j++)ellipse(h.x+15+j*28,h.y+8,21,20,'#65785b');}
 for(const g of gems)if(!g.collected){const y=g.y-15+Math.sin(time*2)*3;ellipse(g.x,g.y+6,14,5,'#27213444');poly([[g.x,y-17],[g.x+13,y],[g.x,y+17],[g.x-13,y]],'#e9cc83');line([[g.x,y-11],[g.x+5,y]],'#fff2c8',2);}
 [ {p:player,v:false},{p:vampire,v:true} ].sort((a,b)=>a.p.y-b.p.y).forEach(c=>character(c.p,c.v));
 if(cooldown>1&&mode==='playing'){ctx.fillStyle='#f0deba';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.fillText('♡ Alles gut! Lauf einfach weiter.',480,505);}
}
let last=0;function frame(now){const dt=last?Math.min((now-last)/1000,.04):0;last=now;update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
$('start').addEventListener('click',start);$('pause').addEventListener('click',pause);
window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(key)&&mode==='playing'){e.preventDefault();keys.add(key);}if((key==='p'||key==='Escape')&&!e.repeat)pause();});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>{keys.clear();if(mode==='playing')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});
document.querySelectorAll('[data-key]').forEach(button=>{button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);if(mode==='playing')keys.add(button.dataset.key);});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(button.dataset.key));});
setup();
