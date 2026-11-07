import {SETTINGS,clamp,canShoot,saveAt,passTarget,counterPosition} from './regeln.mjs?v=maedchen-2';
const $=id=>document.getElementById(id),ctx=$('game').getContext('2d');
const keys=new Set();let mode='ready',phase='attack',home=0,away=0,remaining=SETTINGS.seconds,time=0,active=0,hookTimer=0,grace=0,lastDirection=1,phaseTime=0,shot=null,keeperY=260,targetY=260,players=[],defenders=[],runners=[],thrower=0;
function say(text){$('message').textContent=text;}
function hud(){$('home').textContent=home;$('away').textContent=away;$('clock').textContent=`${Math.ceil(remaining)} s`;const disabled=mode!=='playing'||phase!=='attack';$('shoot').disabled=disabled;$('pass').disabled=disabled;$('hook').disabled=disabled||hookTimer>0;}
function attack(){phase='attack';active=0;players=[{x:180,y:260},{x:340,y:145},{x:390,y:385}];defenders=[{x:490,y:220},{x:625,y:340},{x:735,y:230}];shot=null;grace=1;phaseTime=0;hookTimer=0;say('Dein Angriff! Laufe nach rechts zur gelben Wurfzone. Mit einem Haken kommst du vorbei.');hud();}
function start(){if(mode==='paused'){mode='playing';$('overlay').hidden=true;$('pause').textContent='Ⅱ';hud();return;}home=0;away=0;remaining=SETTINGS.seconds;time=0;keys.clear();mode='playing';$('overlay').hidden=true;$('pause').disabled=false;attack();}
function pause(){if(mode==='paused'){start();return;}if(mode!=='playing')return;mode='paused';keys.clear();$('pause').textContent='▶';$('tag').textContent='KURZE AUSZEIT';$('title').textContent='Durchatmen, Team!';$('description').textContent='Der Spielstand bleibt erhalten. Gleich geht’s weiter.';$('start').textContent='Weiterspielen →';$('overlay').hidden=false;hud();}
function finish(){mode='finished';keys.clear();$('pause').disabled=true;$('tag').textContent='ABPFIFF · GUT GESPIELT!';$('title').textContent=home>away?'Sieg für UHC Tulln!':home===away?'Ein spannendes Unentschieden!':'Die Einhörner gewinnen diese Runde.';$('description').textContent=`${home} : ${away} – Danke fürs faire Spiel! Beim nächsten Anpfiff warten neue Chancen.`;$('start').textContent='Revanche →';$('overlay').hidden=false;$('start').focus({preventScroll:true});hud();}
function shoot(){if(mode!=='playing'||phase!=='attack')return;const p=players[active];if(!canShoot(p)){say('Noch zu weit weg! Laufe nach rechts in die gelbe Wurfzone.');return;}phase='shot';shot={x:p.x,y:p.y,target:clamp(p.y,185,335),startX:p.x,startY:p.y};say('Wurf aufs Tor!');hud();}
function pass(){if(mode!=='playing'||phase!=='attack')return;const previous=active;active=passTarget(players,active,defenders);grace=.8;say(`Pass von Nummer ${previous+1} zu Nummer ${active+1}! Du steuerst jetzt die gelb markierte Spielerin.`);}
function hook(){if(mode!=='playing'||phase!=='attack'||hookTimer>0)return;const p=players[active];let dy=Number(keys.has('ArrowDown')||keys.has('s'))-Number(keys.has('ArrowUp')||keys.has('w'));if(!dy)dy=p.y>260?-1:1;p.y=clamp(p.y+dy*SETTINGS.hookDistance,90,430);p.x=clamp(p.x+35,80,825);grace=.85;hookTimer=SETTINGS.hookCooldown;say('Starker Haken! Jetzt bist du kurz an den Einhörnern vorbei.');hud();}
function goalkeeping(){phase='keeper';phaseTime=0;keeperY=260;targetY=185+Math.random()*150;shot=null;runners=[0,1,2].map(i=>counterPosition(0,i));thrower=0;say('Gegenangriff! Die Einhörner laufen aufs linke Tor zu. Du bist die Torhüterin – achte auf den späten Wurfhinweis!');hud();}
function result(text){phase='result';phaseTime=0;say(text);hud();}
function update(dt){if(mode!=='playing')return;time+=dt;remaining=Math.max(0,remaining-dt);hookTimer=Math.max(0,hookTimer-dt);grace=Math.max(0,grace-dt);phaseTime+=dt;
 const dx=Number(keys.has('ArrowRight')||keys.has('d'))-Number(keys.has('ArrowLeft')||keys.has('a'));
 const dy=Number(keys.has('ArrowDown')||keys.has('s'))-Number(keys.has('ArrowUp')||keys.has('w'));
 if(phase==='attack'){
  const p=players[active],norm=Math.hypot(dx,dy)||1;p.x=clamp(p.x+dx/norm*SETTINGS.runSpeed*dt,80,825);p.y=clamp(p.y+dy/norm*SETTINGS.runSpeed*dt,90,430);if(dy&&dy!==lastDirection){if(grace===0)grace=.2;lastDirection=dy;}
  players.forEach((mate,i)=>{if(i!==active){mate.x=clamp(p.x+125+(i%2)*35,150,805);mate.y=i%2?135:385;}});
  defenders.forEach((d,i)=>{d.y=clamp(d.y+(p.y-d.y)*dt*(.38+i*.08),95,425);d.x=490+i*120+Math.sin(time+i)*15;});
  if(grace===0&&defenders.some(d=>Math.hypot(d.x-p.x,d.y-p.y)<34)){p.x=Math.max(90,p.x-70);grace=1.2;say('Ein Einhorn versperrt den Weg. Versuch einen Pass oder einen Haken!');}
 }else if(phase==='shot'){
  shot.x+=SETTINGS.throwSpeed*dt;const progress=clamp((shot.x-shot.startX)/(920-shot.startX),0,1);shot.y=shot.startY+(shot.target-shot.startY)*progress;
  if(shot.x>=915){if(saveAt(260+Math.sin(time*1.5)*65,shot.y)){say('Die Einhorn-Torwartin hält. Nächste Chance kommt bestimmt!');}else{home++;say('TOOOR für UHC Tulln! Stark geworfen!');}phase='shotResult';phaseTime=0;}
 }else if(phase==='shotResult'){if(phaseTime>1.4)goalkeeping();}
 else if(phase==='keeper'){
  keeperY=clamp(keeperY+dy*SETTINGS.runSpeed*dt,175,345);
  runners=[0,1,2].map(i=>counterPosition(Math.min(phaseTime,SETTINGS.counterRunSeconds),i));
  // Ein Pass während des Gegenangriffs verändert, welches Einhorn werfen wird.
  thrower=phaseTime<1.2?0:1;
  if(phaseTime>=SETTINGS.counterRunSeconds){
   if(!shot){const p=runners[thrower];shot={x:p.x,y:p.y,startX:p.x,startY:p.y};}
   shot.x-=SETTINGS.counterThrowSpeed*dt;
   shot.y=shot.startY+(targetY-shot.startY)*clamp((shot.startX-shot.x)/(shot.startX-90),0,1);
   if(shot.x<=90){if(saveAt(keeperY,targetY,SETTINGS.keeperReach))result('GEHALTEN! Super Parade unserer Torhüterin! Jetzt greift dein Team wieder an.');else{away++;result('Tor für die Einhörner. Kopf hoch, Mädels – euer nächster Angriff wartet!');}}
  }
 }else if(phase==='result'&&phaseTime>1.5)attack();
 hud();if(remaining<=0)finish();
}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function line(points,c,w=3){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function athlete(p,unicorn=false,number=1,selected=false){ctx.save();ctx.translate(p.x,p.y);ellipse(0,9,19,7,'#123b3b25');if(selected){ctx.strokeStyle='#f5d066';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,27,32,0,0,Math.PI*2);ctx.stroke();}line([[-6,6],[-10,20]],'#1f4654',6);line([[6,6],[10,20]],'#1f4654',6);ctx.fillStyle=unicorn?'#c7a1db':'#285a72';ctx.fillRect(-13,-21,26,32);ellipse(0,-29,13,14,unicorn?'#f5edf8':'#eecba5');if(unicorn){line([[0,-42],[3,-57]],'#edc974',6);line([[-8,-38],[-15,-44]],'#bd81cc',5);}else{
 const hair=['#665146','#a57243','#4e3945'][number%3];
 ellipse(0,-40,12,6,hair);
 ellipse(15,-36,9,7,hair);line([[19,-34],[26,-25],[22,-14]],hair,7);
 ellipse(13,-37,3,3,'#f2d27c');
 }line([[-14,-15],[-22,-1]],unicorn?'#f0ddf5':'#eecba5',5);line([[14,-15],[22,-1]],unicorn?'#f0ddf5':'#eecba5',5);ctx.fillStyle='white';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText(number,0,1);ctx.restore();}
function draw(){ctx.fillStyle='#d1b18a';ctx.fillRect(0,0,1000,520);for(let x=0;x<1000;x+=80){ctx.fillStyle=x%160?'#ffffff06':'#00000003';ctx.fillRect(x,0,80,520);}ctx.fillStyle='#438d92';ctx.fillRect(50,65,900,390);ctx.fillStyle='#4b9698';ctx.fillRect(500,65,450,390);
 const keeping=phase==='keeper'||phase==='result';ctx.fillStyle='#eed67e55';ctx.fillRect(650,90,175,340);ctx.strokeStyle='#f2efe0';ctx.lineWidth=3;ctx.strokeRect(50,65,900,390);line([[500,65],[500,455]],'#f2efe0',2);ctx.beginPath();ctx.arc(500,260,47,0,Math.PI*2);ctx.stroke();
 // Torräume und Netze.
 for(const x of [50,950]){ctx.fillStyle='#346e7e';ctx.beginPath();ctx.ellipse(x,260,115,160,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ececdb';ctx.stroke();ctx.fillStyle='#f6eee055';ctx.fillRect(x===50?20:950,175,30,170);for(let y=175;y<=345;y+=17)line([[x===50?20:950,y],[x===50?50:980,y]],'#f4f1de',1);line([[x,175],[x,345]],'#fff3d5',6);}
 ctx.fillStyle='#234654';ctx.textAlign='center';ctx.font='bold 13px system-ui';ctx.fillText(keeping?'DEIN TOR · ↑ ↓':'ANGRIFF →',200,34);ctx.fillText(keeping?'EINHORN-WURF ←':'WURFZONE →',780,34);
 if(keeping){
  athlete({x:90,y:keeperY},false,1,true);
  const moving=runners.length?runners:[0,1,2].map(i=>counterPosition(0,i));
  moving.forEach((p,i)=>athlete(p,true,i+7));
  // Die Mitspielerinnen laufen hinter dem Gegenangriff zurück.
  moving.slice(0,2).forEach((p,i)=>athlete({x:clamp(p.x+130,180,885),y:clamp(p.y+(i?65:-65),100,420)},false,i+2));
  if(phase==='keeper'&&!shot){const p=moving[thrower];ellipse(p.x-22,p.y-7,8,8,'#ed9651');}
  const warning=phaseTime>=SETTINGS.counterRunSeconds-SETTINGS.counterWarningSeconds;
  if(phase==='keeper'&&warning){ctx.strokeStyle='#f7c4de';ctx.lineWidth=4;ctx.beginPath();ctx.arc(90,targetY,21,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle='#fff2dd';ctx.font='bold 15px system-ui';
  ctx.fillText(phase==='result'?'GUT GEKÄMPFT, MÄDELS!':shot?'WURF! SCHNELL REAGIEREN!':warning?'JETZT ZUR ROSA MARKIERUNG!':phaseTime<1.2?'GEGENANGRIFF! EINHÖRNER LAUFEN AUFS TOR':'EINHORN-PASS! WOHIN KOMMT DER WURF?',500,95);
 }
 else{defenders.forEach((d,i)=>athlete(d,true,i+4));athlete({x:915,y:260+Math.sin(time*1.5)*65},true,1);players.forEach((p,i)=>athlete(p,false,i+1,i===active));if(phase==='attack'&&players[active]){const p=players[active];ellipse(p.x+22,p.y-7,8,8,'#ed9651');if(canShoot(p)){ctx.fillStyle='#fff1ad';ctx.font='bold 14px system-ui';ctx.fillText('JETZT SCHIESSEN!',p.x,Math.max(95,p.y-72));}}}
 if(shot){ellipse(shot.x,shot.y,9,9,'#f3a15a');line([[shot.x-4,shot.y-4],[shot.x+4,shot.y+4]],'#9d542c',2);}
 ctx.fillStyle='#274754';ctx.font='12px system-ui';ctx.fillText('UHC TULLN U9 · EINHORN-CUP',500,495);
}
let last=0;function frame(now){const dt=last?Math.min((now-last)/1000,.04):0;last=now;update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
$('start').addEventListener('click',start);$('pause').addEventListener('click',pause);$('shoot').addEventListener('click',shoot);$('pass').addEventListener('click',pass);$('hook').addEventListener('click',hook);
window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(key)&&mode==='playing'){e.preventDefault();keys.add(key);}if(key===' '&&mode==='playing'){e.preventDefault();if(!e.repeat)shoot();}if(!e.repeat){if(key==='e')pass();if(key==='h')hook();if(key==='p'||key==='Escape')pause();}});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>{keys.clear();if(mode==='playing')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(mode==='playing')keys.add(b.dataset.key);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.key));});
attack();hud();
