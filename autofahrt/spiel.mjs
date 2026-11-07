import {SETTINGS,START,CHECKPOINTS,OBSTACLES,VAMPIRE_COUNT,hitsObstacle,stepCar,vampirePosition} from './regeln.mjs?v=rallye-2';
const $=id=>document.getElementById(id),ctx=$('game').getContext('2d');
const keys=new Set();let mode='ready',car={...START},time=0,camera=START.y-360,checkpoint=0,stopTime=0,protection=0,messageTime=0;
function say(text){$('message').textContent=text;messageTime=4;}
function hud(){$('distance').textContent=`Ziel: ${Math.max(0,Math.round(car.y-150))} m`;$('speed').textContent=`${car.speed<0?'R · ':''}${Math.round(Math.abs(car.speed)*.25)} km/h`;}
function overlay(tag,title,text,button){$('tag').textContent=tag;$('title').textContent=title;$('description').textContent=text;$('start').textContent=button;$('overlay').hidden=false;}
function start(){if(mode==='paused'){mode='playing';$('overlay').hidden=true;$('pause').textContent='Pause';return;}car={...START};checkpoint=0;time=0;stopTime=0;protection=1;keys.clear();mode='playing';$('overlay').hidden=true;$('pause').disabled=false;$('pause').textContent='Pause';say('Los geht’s! ↑ gibt Gas. Lenke mit ← / → durch die Lücken.');hud();}
function pause(){if(mode==='paused'){start();return;}if(mode!=='playing')return;keys.clear();mode='paused';$('pause').textContent='Weiter';overlay('KLEINE FAHRPAUSE','Motor kurz aus.','Deine Fahrt wartet auf dich. Gleich geht es weiter!','Weiterfahren →');}
function reset(){if(mode!=='playing')return;car={...START,...CHECKPOINTS[checkpoint]};stopTime=0;protection=2.5;keys.clear();say('Wieder freie Fahrt! Du startest am letzten grünen Fähnchen.');}
function update(dt){if(mode!=='playing')return;time+=dt;messageTime=Math.max(0,messageTime-dt);protection=Math.max(0,protection-dt);
 if(stopTime>0){stopTime=Math.max(0,stopTime-dt);car.speed=0;}else{
 const input={gas:keys.has('ArrowUp')||keys.has('w'),reverse:keys.has('ArrowDown')||keys.has('s'),left:keys.has('ArrowLeft')||keys.has('a'),right:keys.has('ArrowRight')||keys.has('d')};
 const next=stepCar(car,input,dt);
 if(hitsObstacle(next.x,next.y)){car.speed=0;if(messageTime===0)say('Eine Kiste ist im Weg! Mit ↓ zurückfahren und neu einlenken.');}else car=next;
 for(let i=0;i<VAMPIRE_COUNT;i++){const vampire=vampirePosition(time,i);if(protection===0&&Math.hypot(car.x-vampire.x,car.y-vampire.y)<39){stopTime=.8;protection=3;car.speed=0;say('Vampir: „Halt!“ Kurzer Stopp – dann kannst du weiter oder rückwärts ausweichen.');break;}}
 }
 for(let i=checkpoint+1;i<CHECKPOINTS.length;i++)if(car.y<=CHECKPOINTS[i].y){checkpoint=i;say('Fähnchen erreicht! Dein Rücksetzpunkt ist gespeichert.');}
 camera=Math.max(0,Math.min(SETTINGS.worldHeight-560,car.y-360));hud();
 if(car.y<150){mode='finished';keys.clear();$('pause').disabled=true;overlay('DU HAST ES GESCHAFFT!','Im Ziel angekommen!','Kurven, Kisten und Vampire hast du hinter dir gelassen. Dein Auto rollt sicher ins Ziel. Lust auf eine neue Nachtfahrt?','Nochmal fahren →');$('start').focus({preventScroll:true});}
}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function line(points,c,w=3){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function vampire(p){ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle='#7f4771';ctx.beginPath();ctx.moveTo(0,-25);ctx.lineTo(-29,24);ctx.lineTo(0,14);ctx.lineTo(29,24);ctx.closePath();ctx.fill();ellipse(0,-6,12,15,'#ddcee9');ellipse(0,-16,13,6,'#30293f');ellipse(-4,-7,1.5,1.5,'#34283e');ellipse(4,-7,1.5,1.5,'#34283e');line([[-3,2],[3,2]],'#885772',2);ctx.fillStyle='#f0dab0';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.fillText('HALT!',0,-33);ctx.restore();}
function draw(){ctx.fillStyle='#334b45';ctx.fillRect(0,0,1000,560);ctx.save();ctx.translate(0,-camera);
 ctx.fillStyle='#46545d';ctx.fillRect(190,0,620,SETTINGS.worldHeight);line([[200,0],[200,SETTINGS.worldHeight]],'#d0d0b7',5);line([[800,0],[800,SETTINGS.worldHeight]],'#d0d0b7',5);
 ctx.setLineDash([32,32]);line([[500,0],[500,SETTINGS.worldHeight]],'#d4c89a',4);ctx.setLineDash([]);
 for(let y=50;y<SETTINGS.worldHeight;y+=155){for(const x of [90,910]){ellipse(x+8,y+12,42,43,'#263d39');ellipse(x,y,35,39,'#53644c');ellipse(x-10,y-8,22,25,'#617153');}ellipse(180,y,5,5,'#eccb86');ellipse(820,y,5,5,'#eccb86');}
 for(let y=95;y<145;y+=20)for(let x=210;x<790;x+=40){ctx.fillStyle=(Math.floor(x/40)+Math.floor(y/20))%2?'#e5e4d3':'#27323a';ctx.fillRect(x,y,40,20);}ctx.fillStyle='#f1d498';ctx.font='bold 26px system-ui';ctx.textAlign='center';ctx.fillText('ZIEL',500,70);
 for(let i=1;i<CHECKPOINTS.length;i++){const cp=CHECKPOINTS[i];for(const x of [230,770]){line([[x,cp.y+25],[x,cp.y-30]],'#dfd1b0',4);ctx.fillStyle=i<=checkpoint?'#91ce91':'#638f76';ctx.fillRect(x,cp.y-30,35,20);}ctx.fillStyle='#d7e0b8';ctx.font='12px system-ui';ctx.fillText('FÄHNCHEN',500,cp.y-15);}
 OBSTACLES.forEach((o,i)=>{ctx.fillStyle='#ad7950';ctx.fillRect(o.x,o.y,o.w,o.h);ctx.strokeStyle='#e2b272';ctx.lineWidth=4;ctx.strokeRect(o.x+4,o.y+4,o.w-8,o.h-8);line([[o.x+6,o.y+6],[o.x+o.w-6,o.y+o.h-6]],'#d3a16c',4);if(i%2){ctx.fillStyle='#edd49b';ctx.fillRect(o.x,o.y+o.h/2-5,o.w,10);for(let x=o.x+8;x<o.x+o.w-15;x+=30)line([[x,o.y+o.h/2-5],[x+12,o.y+o.h/2+5]],'#5e5144',5);}});
 for(let i=0;i<VAMPIRE_COUNT;i++)vampire(vampirePosition(time,i));
 ctx.save();ctx.translate(car.x,car.y);ctx.rotate(car.angle+Math.PI/2);
 // Lichtkegel und das rote Auto in Draufsicht.
 ctx.fillStyle='#f5e9a31a';ctx.beginPath();ctx.moveTo(-15,-28);ctx.lineTo(-55,-135);ctx.lineTo(55,-135);ctx.lineTo(15,-28);ctx.closePath();ctx.fill();
 if(protection>0&&stopTime===0){ctx.strokeStyle='#c4d9b1';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,30,39,0,0,Math.PI*2);ctx.stroke();}
 ctx.fillStyle='#171f25';for(const x of [-24,14]){ctx.fillRect(x,-20,10,15);ctx.fillRect(x,12,10,15);}ctx.fillStyle='#c85650';ctx.fillRect(-19,-32,38,66);ellipse(0,-30,19,10,'#da7463');ellipse(0,31,19,7,'#b74948');ctx.fillStyle='#aac5c6';ctx.fillRect(-14,-20,28,13);ctx.fillStyle='#486770';ctx.fillRect(-14,15,28,10);ctx.fillStyle='#eedf9e';ctx.fillRect(-16,-35,8,5);ctx.fillRect(8,-35,8,5);ctx.restore();ctx.restore();
 if(stopTime>0){ctx.fillStyle='#21323bdf';ctx.fillRect(315,20,370,45);ctx.fillStyle='#eed6a7';ctx.font='bold 20px system-ui';ctx.textAlign='center';ctx.fillText('HALT! Ein Vampir stoppt dich kurz.',500,49);}
}
let last=0;function frame(now){const dt=last?Math.min((now-last)/1000,.04):0;last=now;update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
$('start').addEventListener('click',start);$('pause').addEventListener('click',pause);$('reset').addEventListener('click',reset);
window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(key)&&mode==='playing'){e.preventDefault();keys.add(key);}if(!e.repeat){if(key==='p'||key==='Escape')pause();if(key==='r')reset();}});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>{keys.clear();if(mode==='playing')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(mode==='playing')keys.add(b.dataset.key);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.key));});hud();
