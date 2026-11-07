import {CHAPTERS,movePlayer,touching,onBridge} from './regeln.mjs?v=schloss-2';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const keys=new Set();let mode='ready',chapter=0,score=0,time=0,cooldown=0,chatTimer=0,camera=0,climb=0,fallTime=0,wings=false,bridgeDone=false;
let player={x:80,y:430},gems=[],vampires=[];
const current=()=>CHAPTERS[chapter];
function say(text){$('dialog').textContent=text;chatTimer=5;}
function setup(){const level=current();player={...level.start};gems=level.gems.map(g=>({...g,collected:false}));vampires=level.vampires.map((v,i)=>({...v,homeX:v.x,homeY:v.y,name:i===0?'Vampirinchen':'Vampir '+(i+1)}));score=0;time=0;cooldown=1;climb=0;fallTime=0;bridgeDone=false;camera=0;keys.clear();$('level').textContent=`${chapter+1} / 5 · ${level.name}`;hud();say(level.target);}
function hud(){$('score').textContent=chapter===4?'Flügel bereit':`${score} / ${gems.length} ${chapter===1||chapter===2?'Schlüssel':'Zaubersteine'}`;}
function overlay(tag,title,text,button){$('tag').textContent=tag;$('title').textContent=title;$('description').textContent=text;$('start').textContent=button;$('overlay').hidden=false;}
function start(){if(mode==='paused'){mode='playing';$('overlay').hidden=true;$('pause').textContent='Pause';return;}if(mode==='chapter')chapter++;if(mode==='finished'){chapter=0;wings=false;}setup();mode='playing';$('overlay').hidden=true;$('pause').disabled=false;$('pause').textContent='Pause';}
function pause(){if(mode==='paused'){start();return;}if(mode!=='playing')return;keys.clear();mode='paused';$('pause').textContent='Weiter';overlay('KLEINE MONDSCHEINPAUSE','Alles wartet auf dich.',current().target,'Weiter geht’s →');}
function next(title,text){keys.clear();mode='chapter';$('pause').disabled=true;overlay('DAS ABENTEUER GEHT WEITER',title,text,'Weiter →');$('start').focus({preventScroll:true});}
function update(dt){if(mode!=='playing')return;time+=dt;cooldown=Math.max(0,cooldown-dt);chatTimer=Math.max(0,chatTimer-dt);
 if(fallTime>0){fallTime-=dt;if(fallTime<=0){next('Plumps! Im Schlosskeller!','Die Falltür hat sich geöffnet. Zum Glück landet Lotta weich auf einem Heuhaufen. Finde den Schlüssel und die Leiter zurück nach oben.');}return;}
 const dx=Number(keys.has('ArrowRight')||keys.has('d'))-Number(keys.has('ArrowLeft')||keys.has('a'));
 const dy=Number(keys.has('ArrowDown')||keys.has('s'))-Number(keys.has('ArrowUp')||keys.has('w'));
 const before={...player};const speedFactor=chapter===1&&player.x>=570&&player.x<=1170?.6:chapter===4?1.5:1;
 const atLadder=chapter===2&&player.x>1900&&Math.abs(player.y-350)<80&&score===1&&dy<0;
 if(!atLadder)movePlayer(player,dx,dy,dt*speedFactor,{left:35,right:current().width-35,top:chapter===4?140:200,bottom:470},current().blocks);
 if(chapter===1&&!onBridge(player.x,player.y)){player={x:before.x<875?560:1190,y:340};cooldown=1;say('Lotta: „Hui, wackelig! Ich bleibe in der Mitte auf den Holzplanken.“');}
 if(chapter===1&&player.x>1180)bridgeDone=true;
 vampires.forEach((v,i)=>{v.y=v.homeY+Math.sin(time*.85+i*1.7)*105;v.x=v.homeX+Math.sin(time*.5+i)*30;});
 for(const v of vampires)if(touching(player,v,39)&&cooldown===0){cooldown=2.2;player.x=Math.max(35,player.x-65);say(chapter===2?'Vampir: „Huch! Hier entlang geht es zur Leiter.“ Lotta versucht einen Weg außen herum.':'Vampirinchen: „Oh, entschuldige!“ Lotta ist nicht böse und huscht außen vorbei.');break;}
 for(const gem of gems)if(!gem.collected&&touching(player,gem,32)){gem.collected=true;score++;hud();say(score===gems.length?current().target+' Alles eingesammelt!': 'Lotta: „Gefunden! Weiter geht’s.“');}
 if(chapter===0&&player.x>2220){if(score===gems.length)next('Willkommen im Schloss!','Die Mondsteine öffnen das Schlosstor. Drinnen wartet eine wackelige Brücke – und hinter ihr eine geheimnisvolle Falltür.');else if(chatTimer===0)say('Am Tor fehlen noch Mondsteine. Suche im großen Garten!');}
 if(chapter===1&&player.x>1570&&player.x<1710&&score===1&&bridgeDone){fallTime=1.3;keys.clear();say('KLICK … die Falltür öffnet sich! Lotta fällt auf weiches Heu.');}
 if(chapter===1&&player.x>1480&&score===0&&chatTimer===0)say('Die Falltür ist verschlossen. Hol zuerst den Schlüssel vor der Brücke.');
 if(chapter===2&&player.x>1900&&Math.abs(player.y-350)<80&&score===1&&dy<0){climb+=dt;if(climb>=1.5)next('Wieder oben!','Lotta klettert Sprosse für Sprosse nach oben. Die Treppe führt direkt in den Turm zum Obervampir.');}else climb=0;
 if(chapter===2&&player.x>1850&&chatTimer===0)say(score===1?'Halte ↑ gedrückt, um die Leiter hochzuklettern.':'Die Leiter ist mit einem Schloss gesichert. Finde den Kellerschlüssel!');
 if(chapter===3&&player.x>1220&&dy<0){if(score===3){wings=true;next('Ein Wunsch wird wahr!','Lotta: „Ich wünsche mir Flügel, damit ich nach Hause fliegen kann!“ Der Obervampir lächelt: „Für deinen Mut und deine Freundlichkeit.“ Silberne Flügel wachsen – ab nach Hause!');}else if(chatTimer===0)say('Obervampir: „Bring mir die drei Zaubersteine, dann erfülle ich deinen Wunsch.“');}
 if(chapter===4&&player.x>2430&&player.y>300){mode='finished';keys.clear();$('pause').disabled=true;overlay('ZU HAUSE ANGEKOMMEN','Gute Nacht, Lotta!','Über Garten und Schloss ist Lotta nach Hause geflogen. Ihre neuen Flügel glitzern im Mondschein. Vampirinchen winkt aus dem Turm.','Das Abenteuer nochmal spielen →');$('start').focus({preventScroll:true});}
 camera=Math.max(0,Math.min(current().width-960,player.x-330));
}
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();}
function line(points,color,width=3){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function character(p,isVampire){const bob=mode==='playing'?Math.sin(time*9)*2:0;ctx.save();ctx.translate(p.x,p.y+bob);ellipse(0,7,23,8,'#17132966');
 if(!isVampire && wings){poly([[-12,-40],[-80,-92],[-92,-40],[-55,-5],[-12,-18]],'#c9b6ed');poly([[12,-40],[80,-92],[92,-40],[55,-5],[12,-18]],'#c9b6ed');}
 if(isVampire)poly([[-13,-59],[-39,-3],[0,-14],[36,0],[14,-59]],'#974d79');
 line([[-8,-12],[-10,4]],'#453951',6);line([[8,-12],[10,4]],'#453951',6);
 poly([[-12,-49],[12,-49],[19,-9],[-19,-9]],isVampire?'#5d416f':'#d88b78');
 ellipse(0,-65,19,23,isVampire?'#e3d9ed':'#f3d0ae');
 if(isVampire){poly([[-20,-66],[-20,-85],[0,-93],[20,-82],[18,-63],[7,-79],[0,-75],[-8,-80]],'#382a4c');poly([[-5,-55],[-1,-48],[2,-55]],'white');}
 else{poly([[-20,-54],[-23,-80],[-10,-91],[12,-88],[24,-70],[20,-48],[13,-55],[13,-74],[-8,-80],[-13,-64]],'#986847');ellipse(-17,-79,8,5,'#e6b9d4');}
 if(p.boss)poly([[-20,-88],[-24,-110],[-8,-99],[0,-116],[9,-99],[24,-110],[20,-88]],'#e2bf6e');
 ellipse(-6,-66,2,2,'#47354c');ellipse(7,-66,2,2,'#47354c');line([[-4,-56],[1,-54],[6,-56]],'#9e6474',1.7);
 line([[-12,-42],[-24,-25]],isVampire?'#d6c9e6':'#f3d0ae',5);line([[12,-42],[23,-27]],isVampire?'#d6c9e6':'#f3d0ae',5);
 ctx.textAlign='center';ctx.font='bold 12px system-ui';ctx.fillStyle='#fff0dc';ctx.fillText(isVampire?(p.boss?'Obervampir':p.name||'Vampir'):'Lotta',0,-104);ctx.restore();}
function label(text,x,y,color='#f3dfb1'){ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(text,x,y);}
function draw(){const level=current(),width=level.width;
 ctx.fillStyle=chapter===2?'#252333':chapter===4?'#303556':'#302840';ctx.fillRect(0,0,960,520);
 ellipse(790-camera*.05,61,36,36,'#f1deb1');ellipse(805-camera*.05,52,30,30,'#303047');
 for(let i=0;i<35;i++)ellipse((i*137+25-camera*.1+960)%960,(i*59+20)%155,1.4,1.4,'#c6b4d7');
 ctx.save();ctx.translate(-camera,0);
 if(chapter===0){
 ctx.fillStyle='#53634e';ctx.fillRect(0,175,width,345);ctx.fillStyle='#91816f';ctx.fillRect(0,210,width,60);ctx.fillRect(0,425,width,65);
 for(let x=80;x<width;x+=260){line([[x,175],[x,110]],'#72667a',10);ellipse(x,102,55,60,'#3d514c');}
 for(const h of level.blocks){ctx.fillStyle='#384e44';ctx.fillRect(h.x,h.y,h.w,h.h);for(let x=h.x+10;x<h.x+h.w;x+=28)ellipse(x,h.y+8,23,20,'#65785b');}
 ctx.fillStyle='#6c607d';ctx.fillRect(2200,150,190,320);poly([[2180,150],[2290,60],[2400,150]],'#493d64');ctx.fillStyle='#292437';ctx.fillRect(2240,290,100,180);label('ZUM SCHLOSS →',2285,270);
 }else if(chapter!==4){
 ctx.fillStyle=chapter===2?'#49414c':'#655c70';ctx.fillRect(0,175,width,345);
 for(let x=0;x<width;x+=100)for(let y=190;y<520;y+=55){line([[x,y],[x+96,y]],'#ffffff0d',2);line([[x,y],[x,y+50]],'#ffffff0c',2);}
 for(let x=170;x<width;x+=380){ctx.fillStyle='#2d263e';ctx.fillRect(x,65,65,100);ellipse(x+32,65,32,32,'#2d263e');ellipse(x+32,100,15,22,'#e9c58b');}
 for(const h of level.blocks){ctx.fillStyle='#786956';ctx.fillRect(h.x,h.y,h.w,h.h);line([[h.x,h.y],[h.x+h.w,h.y+h.h]],'#aa9471',4);}
 if(chapter===1){
 ctx.fillStyle='#211c31';ctx.fillRect(600,175,550,345);label('BLEIB AUF DEN HOLZPLANKEN',875,220);
 for(let x=600;x<1150;x+=32){const sway=Math.sin(time*2+x*.02)*3;ctx.fillStyle='#ac8a62';ctx.fillRect(x,304+sway,29,72);}
 line([[580,294],[1170,294]],'#e0c9a4',4);line([[580,389],[1170,389]],'#e0c9a4',4);
 ctx.fillStyle=fallTime>0?'#171320':'#806b59';ctx.fillRect(1570,275,140,150);line([[1575,280],[1705,420]],'#b49b77',3);label('FALLTÜR',1640,255);
 }if(chapter===2){
 for(let x=30;x<190;x+=25)line([[x,470],[x+50,425]],'#c4a464',7);
 line([[1940,200],[1940,440]],'#c6a375',8);line([[2000,200],[2000,440]],'#c6a375',8);for(let y=210;y<440;y+=24)line([[1940,y],[2000,y]],'#e0c29c',5);
 label(score===1?'↑ HALTEN · HOCHKLETTERN':'LEITER · SCHLÜSSEL NÖTIG',1955,180);
 if(climb>0){ctx.fillStyle='#b1dba9';ctx.fillRect(1910,455,120*climb/1.5,8);}
 }if(chapter===3){
 ctx.fillStyle='#9b5879';ctx.fillRect(1210,245,160,180);poly([[1210,245],[1290,190],[1370,245]],'#9b5879');character({x:1290,y:370,boss:true},true);label('↑ WÜNSCHE DIR FLÜGEL',1280,465);
 }
 }else{
 for(let x=0;x<width;x+=240){ellipse(x,440,180,65,'#535f76');ellipse(x+100,470,190,60,'#667d79');ellipse(x,170,65,17,'#b6adc34d');}
 ctx.fillStyle='#bda486';ctx.fillRect(2400,350,170,140);poly([[2380,350],[2485,270],[2590,350]],'#916c83');ctx.fillStyle='#f3d896';ctx.fillRect(2460,410,45,80);label('LOTTAS ZUHAUSE ↓',2460,260);
 }
 for(const g of gems)if(!g.collected){const y=g.y-18;poly([[g.x,y-17],[g.x+13,y],[g.x,y+17],[g.x-13,y]],'#e9cc83');label(chapter===1||chapter===2?'⚿':'✦',g.x,y+5,'#76556f');}
 const figures=[{p:player,v:false},...vampires.map(p=>({p,v:true}))].sort((a,b)=>a.p.y-b.p.y);
 for(const f of figures){ctx.save();if(fallTime>0&&!f.v){ctx.translate(player.x,player.y);ctx.scale(Math.max(.05,fallTime/1.3),Math.max(.05,fallTime/1.3));ctx.translate(-player.x,-player.y);}character(!f.v&&climb>0?{...f.p,y:f.p.y-climb*95}:f.p,f.v);ctx.restore();}
 ctx.restore();
 ctx.fillStyle='#241e35dd';ctx.fillRect(12,12,936,42);ctx.textAlign='left';ctx.font='13px system-ui';ctx.fillStyle='#f0dfb7';ctx.fillText(current().target,24,38);
 ctx.fillStyle='#d3b5e7';ctx.fillRect(20,502,920*player.x/width,5);
}
let last=0;function frame(now){const dt=last?Math.min((now-last)/1000,.04):0;last=now;update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
$('start').addEventListener('click',start);$('pause').addEventListener('click',pause);
window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(key)&&mode==='playing'){e.preventDefault();keys.add(key);}if((key==='p'||key==='Escape')&&!e.repeat)pause();});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>{keys.clear();if(mode==='playing')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});
document.querySelectorAll('[data-key]').forEach(button=>{button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);if(mode==='playing')keys.add(button.dataset.key);});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(button.dataset.key));});
setup();
