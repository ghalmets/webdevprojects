import { SETTINGS, TRACK, overlaps, clamp } from './core.mjs';

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const ctx = canvas.getContext('2d');
const keys = new Set();
let mode = 'ready', items = [], particles = [], score = 0, hearts = SETTINGS.startingHearts;
let remaining = SETTINGS.roundSeconds, y = 275, spawnTimer = 0, invincible = 0, world = 0, elapsed = 0;
let color = '#ad7657', speedLevel = 0, best = 0;
try { best = Number(localStorage.getItem('pony-sprint-best')) || 0; } catch { /* Auch ohne Browser-Speicher spielbar. */ }
$('best').textContent = `REKORD ${best}`;

function updateHUD() {
  $('score').textContent = score;
  $('lives').textContent = '♥ '.repeat(hearts) + '♡ '.repeat(SETTINGS.startingHearts - hearts);
  $('lives').setAttribute('aria-label', `${hearts} Herzen`);
  $('time').textContent = Math.ceil(remaining);
}
function showOverlay(tag, title, text, button, hint = '') {
  $('overlay-tag').textContent = tag; $('overlay-title').textContent = title;
  $('overlay-text').textContent = text; $('start').textContent = button;
  $('overlay-hint').textContent = hint; $('overlay').hidden = false;
}
function start() {
  if (mode === 'paused') { mode = 'playing'; $('overlay').hidden = true; $('pause').textContent = 'Ⅱ'; $('pause').setAttribute('aria-label', 'Spiel pausieren'); return; }
  items = []; particles = []; score = 0; hearts = SETTINGS.startingHearts;
  remaining = SETTINGS.roundSeconds; y = 275; invincible = 0; spawnTimer = .1; elapsed = 0;
  keys.clear(); mode = 'playing'; $('overlay').hidden = true; $('pause').disabled = false;
  $('pause').textContent = 'Ⅱ'; $('pause').setAttribute('aria-label', 'Spiel pausieren'); updateHUD();
}
function pause() {
  if (mode === 'paused') { start(); return; }
  if (mode !== 'playing') return;
  mode = 'paused'; keys.clear(); $('pause').textContent = '▶'; $('pause').setAttribute('aria-label', 'Spiel fortsetzen');
  showOverlay('KLEINE VERSCHNAUFPAUSE', 'Dein Pony macht Pause.', 'Alles wartet auf dich. Bereit zum Weiterreiten?', 'Weiterreiten →', 'P oder Escape zum Fortsetzen');
}
function finish() {
  mode = 'finished'; keys.clear(); $('pause').disabled = true;
  const record = score > best;
  best = Math.max(best, score);
  try { localStorage.setItem('pony-sprint-best', String(best)); } catch { /* Speicherung ist optional. */ }
  $('best').textContent = `REKORD ${best}`;
  showOverlay(record ? 'JUHU! EIN NEUER REKORD' : 'DAS WAR EIN SCHÖNER AUSRITT', hearts ? 'Im Ziel angekommen!' : 'Nochmal auf die Hufe!', `${$('pony-label').textContent} hat ${score} Punkte gesammelt. ${hearts ? 'Was für ein Abenteuer!' : 'Beim nächsten Mal klappt’s bestimmt!'} `, 'Nochmal losreiten →', `Dein Rekord: ${best} Punkte`);
  $('start').focus({ preventScroll: true });
}
function burst(x, py, hit) {
  for (let i = 0; i < 10; i++) particles.push({ x, y: py, vx: (Math.random()-.5)*130, vy: -Math.random()*110, life: .65, hit });
}
function spawn() {
  // Nur ein Objekt je Reihe: Oben oder unten bleibt immer Platz zum Ausweichen.
  items.push({ x: 1060, y: 183 + Math.floor(Math.random()*4)*60, type: Math.random() < SETTINGS.starChance ? 'star' : Math.random() < .5 ? 'log' : 'rock', phase: Math.random()*6 });
}
function update(dt) {
  if (mode !== 'playing') return;
  elapsed += dt; remaining = Math.max(0, remaining-dt);
  const speed = SETTINGS.speeds[speedLevel]; world += speed*dt;
  const direction = Number(keys.has('ArrowDown') || keys.has('s')) - Number(keys.has('ArrowUp') || keys.has('w'));
  y = clamp(y + direction*SETTINGS.ponyMoveSpeed*dt, TRACK.top, TRACK.bottom);
  invincible = Math.max(0, invincible-dt); spawnTimer -= dt;
  if (spawnTimer <= 0) { spawn(); spawnTimer += SETTINGS.spawnInterval; }
  for (const item of items) {
    item.x -= speed*dt;
    if (!item.used && overlaps({x:TRACK.ponyX,y}, item)) {
      if (item.type === 'star') { score += SETTINGS.starPoints; item.used = true; burst(item.x,item.y,false); }
      else if (invincible <= 0) { hearts--; item.used = true; invincible = SETTINGS.safeSecondsAfterHit; burst(item.x,item.y,true); }
    }
  }
  items = items.filter(item => item.x > -80 && !item.used);
  particles.forEach(p => { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 130*dt; p.life -= dt; });
  particles = particles.filter(p => p.life > 0); updateHUD();
  if (hearts <= 0 || remaining <= 0) finish();
}

// Alles wird mit Formen gezeichnet. Keine Bilddateien und keine Downloads nötig.
function ellipse(x,py,rx,ry,fill) { ctx.fillStyle=fill; ctx.beginPath(); ctx.ellipse(x,py,rx,ry,0,0,Math.PI*2); ctx.fill(); }
function shape(points,fill) { ctx.fillStyle=fill;ctx.beginPath();points.forEach(([x,py],i)=>i?ctx.lineTo(x,py):ctx.moveTo(x,py));ctx.closePath();ctx.fill(); }
function line(points,stroke,width=2) {ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();points.forEach(([x,py],i)=>i?ctx.lineTo(x,py):ctx.moveTo(x,py));ctx.stroke();}
function star(x,py,r=15) {const points=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5;const s=i%2?r*.46:r;points.push([x+Math.cos(a)*s,py+Math.sin(a)*s]);}shape(points,'#e4b84f');ellipse(x-3,py-4,2,3,'#ffdf7d');}
function tree(x,py,s=1) {ctx.save();ctx.translate(x,py);ctx.scale(s,s);line([[0,0],[0,-50]],'#8b9774',5);ellipse(-12,-53,22,29,'#97ad7e');ellipse(12,-58,24,31,'#a4b98b');ellipse(0,-77,24,27,'#a8bd8c');ctx.restore();}
function pony(x,py,t) {
 ctx.save();ctx.translate(x,py);ctx.scale(.94,.94);
 ellipse(0,17,47,10,'#71865224');
 const stride=mode==='playing'?Math.sin(t*15)*13:2;
 line([[-19,-8],[-24+stride,14],[-15+stride,14]],'#855d49',8);
 line([[18,-8],[29-stride,13],[36-stride,13]],'#855d49',8);
 // Schweif und Mähne.
 line([[-33,-25],[-48,-31],[-55,-19],[-62,-18]],'#5f4c3e',10);
 ellipse(-1,-22,39,23,color);
 line([[-20,-14],[-17-stride,18],[-8-stride,18]],color,9);
 line([[21,-15],[21+stride,18],[31+stride,18]],color,9);
 line([[-8-stride,18],[-15-stride,18]],'#51473d',5);line([[24+stride,18],[33+stride,18]],'#51473d',5);
 shape([[10,-29],[25,-66],[43,-62],[37,-18]],color);
 line([[18,-32],[24,-55],[32,-66]],'#5f4c3e',10);
 ellipse(42,-62,22,14,color);ellipse(59,-57,13,10,color);
 shape([[31,-72],[31,-91],[40,-75]],color);shape([[43,-73],[49,-89],[52,-71]],color);
 shape([[33,-77],[34,-85],[37,-77]],'#d3a487');
 ellipse(48,-65,3,3,'#303a30');ellipse(49,-66,1,1,'white');ellipse(65,-57,2,2,'#775540');
 line([[54,-70],[54,-49],[36,-43]],'#687d56',2.8);
 shape([[-15,-41],[12,-41],[15,-23],[-17,-23]],'#7d9368');
 line([[-10,-38],[7,-38]],'#c2d29d',2);
 ctx.restore();
}
function draw() {
 ctx.clearRect(0,0,1000,460);
 ctx.fillStyle='#e8edcf';ctx.fillRect(0,0,1000,460);
 ctx.fillStyle='#eff1d8';ctx.fillRect(0,0,1000,110);
 ellipse(830,27,38,38,'#f4e4aa');
 // Sanfte Hügel und die Baumreihe am Horizont.
 ellipse(170,137,280,91,'#c6d4ab');ellipse(630,142,350,100,'#d4dfb7');ellipse(1030,138,260,79,'#b9cda0');
 for(let i=-1;i<10;i++) {const tx=i*145-((world*.16)%145);tree(tx,136,.75+(i%3)*.13);}
 ctx.fillStyle='#c0d39f';ctx.fillRect(0,141,1000,319);
 shape([[0,179],[1000,165],[1000,403],[0,419]],'#dbe2ac');
 shape([[0,191],[1000,177],[1000,390],[0,406]],'#e1e6b8');
 // Leichte Spuren lassen die Bewegung lesbar werden.
 ctx.setLineDash([18,30]);line([[0,234],[1000,220]],'#cbd5a071',1.5);line([[0,310],[1000,296]],'#cbd5a071',1.5);line([[0,384],[1000,370]],'#cbd5a071',1.5);ctx.setLineDash([]);
 for(let i=-1;i<15;i++){const fx=i*86-(world*.65%86);line([[fx,148],[fx,173]],'#a3ae80',4);line([[fx-42,156],[fx+44,155]],'#abb68a',3);}
 for(let i=0;i<45;i++) {const fx=((i*137-world*.85)%1100+1100)%1100-50;const fy=i%2?430+(i*13)%25:153+(i*3)%16;line([[fx,fy],[fx-2,fy-6]],'#98af79',1.5);if(i%3===0){ellipse(fx+3,fy-5,2.6,2.6,i%2?'#f5efd5':'#f4db8b');}}
 const drawables=[...items,{type:'pony',y,x:TRACK.ponyX}].sort((a,b)=>a.y-b.y);
 for (const item of drawables) {
  if(item.type==='pony') {ctx.save();if(invincible>0)ctx.globalAlpha=.5+Math.sin(elapsed*24)*.25;pony(item.x,item.y,elapsed);ctx.restore();continue;}
  ellipse(item.x,item.y+18,item.type==='star'?15:29,5,'#7c915329');
  if(item.type==='star')star(item.x,item.y-2+Math.sin(elapsed*3+item.phase)*4);
  else if(item.type==='log'){ctx.fillStyle='#ab8662';ctx.fillRect(item.x-29,item.y-14,58,27);ellipse(item.x-29,item.y,8,14,'#957353');ellipse(item.x+29,item.y,8,14,'#d4b68a');ellipse(item.x+29,item.y,4,9,'#bc976a');line([[item.x-19,item.y-5],[item.x+17,item.y-5]],'#8e6c4c',2);}
  else{shape([[item.x-30,item.y+13],[item.x-26,item.y-6],[item.x-8,item.y-22],[item.x+17,item.y-17],[item.x+30,item.y+13]],'#99a293');shape([[item.x-8,item.y-22],[item.x+17,item.y-17],[item.x+30,item.y+13],[item.x+2,item.y+3]],'#acb2a2');}
 }
 particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life/.65);ellipse(p.x,p.y,3,3,p.hit?'#ce8f7c':'#e9ba4f');});ctx.globalAlpha=1;
}
let last=0;
function frame(now) { const dt=last?Math.min((now-last)/1000,.05):0;last=now;update(dt);draw();requestAnimationFrame(frame); }
requestAnimationFrame(frame);
$('start').addEventListener('click',start);$('pause').addEventListener('click',pause);
window.addEventListener('keydown',e=>{
 if (['INPUT','TEXTAREA','SELECT','BUTTON'].includes(e.target.tagName))return;
 const key=e.key.length===1?e.key.toLowerCase():e.key;
 if(['ArrowUp','ArrowDown','w','s'].includes(key)){if(mode==='playing'){e.preventDefault();keys.add(key);}}
 if((key==='p'||key==='Escape')&&!e.repeat)pause();
});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
window.addEventListener('blur',()=>{keys.clear();if(mode==='playing')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});
for(const [id,key] of [['up','ArrowUp'],['down','ArrowDown']]){
 const button=$(id);button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);if(mode==='playing')keys.add(key);});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(key));
}
$('pony-name').addEventListener('input',e=>{$('pony-label').textContent=e.target.value.trim()||'Flocke';});
document.querySelectorAll('.swatch').forEach(button=>button.addEventListener('click',()=>{color=button.dataset.color;document.querySelectorAll('.swatch').forEach(s=>{s.classList.toggle('active',s===button);s.setAttribute('aria-pressed',String(s===button));});}));
$('speed').addEventListener('input',e=>{speedLevel=Number(e.target.value)-1;$('speed-label').textContent=['Gemütlich','Flott','Wilder Galopp'][speedLevel];});
updateHUD();
