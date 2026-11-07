import { SETTINGS, advanceJump, clearsObstacle, collectsCarrot } from './core.mjs';

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const ctx = canvas.getContext('2d');
const keys = new Set();
let mode = 'ready', items = [], particles = [], score = 0, hearts = SETTINGS.startingHearts;
let height = 0, velocity = 0, down = false;
let remaining = SETTINGS.roundSeconds, spawnTimer = 0, invincible = 0, world = 0, elapsed = 0;
let color = '#ad7657', speedLevel = 0, best = 0;
try { best = Number(localStorage.getItem('pony-sprint-rider-best')) || 0; } catch { /* Auch ohne Browser-Speicher spielbar. */ }
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
  remaining = SETTINGS.roundSeconds; height = 0; velocity = 0; down = false; invincible = 0; spawnTimer = .1; elapsed = 0;
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
  try { localStorage.setItem('pony-sprint-rider-best', String(best)); } catch { /* Speicherung ist optional. */ }
  $('best').textContent = `REKORD ${best}`;
  showOverlay(record ? 'JUHU! EIN NEUER REKORD' : 'DAS WAR EIN SCHÖNER AUSRITT', hearts ? 'Im Ziel angekommen!' : 'Nochmal auf die Hufe!', `${$('pony-label').textContent} hat ${score} Punkte gesammelt. ${hearts ? 'Was für ein Abenteuer!' : 'Beim nächsten Mal klappt’s bestimmt!'} `, 'Nochmal losreiten →', `Dein Rekord: ${best} Punkte`);
  $('start').focus({ preventScroll: true });
}
function burst(x, py, hit) {
  for (let i = 0; i < 10; i++) particles.push({ x, y: py, vx: (Math.random()-.5)*130, vy: -Math.random()*110, life: .65, hit });
}
function jump() {
  if (mode === 'playing' && height === 0) { velocity = SETTINGS.jumpVelocity; down = false; }
}
function spawn() {
  const carrot = Math.random() < SETTINGS.carrotChance;
  items.push({ distance: 1, type: carrot ? 'carrot' : Math.random() < .7 ? 'log' : 'branch',
    altitude: carrot && Math.random() < .35 ? 1 : 0, resolved: false });
}
function update(dt) {
  if (mode !== 'playing') return;
  elapsed += dt; remaining = Math.max(0, remaining - dt);
  down = keys.has('ArrowDown') || keys.has('s');
  const next = advanceJump(height, velocity, dt, down);
  height = next.height; velocity = next.velocity;
  const speed = SETTINGS.speeds[speedLevel]; world += speed * dt;
  invincible = Math.max(0, invincible - dt); spawnTimer -= dt;
  if (spawnTimer <= 0) { spawn(); spawnTimer += SETTINGS.spawnInterval; }
  for (const item of items) {
    item.distance -= speed * dt;
    if (!item.resolved && item.distance <= .12) {
      item.resolved = true;
      if (item.type === 'carrot') {
        if (collectsCarrot(height, item.altitude)) {
          score += SETTINGS.carrotPoints; item.used = true; burst(500, 290, false);
        }
      } else if (!clearsObstacle(item.type, height, down) && invincible <= 0) {
        hearts--; invincible = SETTINGS.safeSecondsAfterHit; burst(500, 300, true);
      }
    }
  }
  items = items.filter(item => item.distance > -.2 && !item.used);
  particles.forEach(p => { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 130*dt; p.life -= dt; });
  particles = particles.filter(p => p.life > 0); updateHUD();
  if (hearts <= 0 || remaining <= 0) finish();
}

// Alles wird mit Formen gezeichnet. Keine Bilddateien und keine Downloads nötig.
function ellipse(x,py,rx,ry,fill) { ctx.fillStyle=fill; ctx.beginPath(); ctx.ellipse(x,py,rx,ry,0,0,Math.PI*2); ctx.fill(); }
function shape(points,fill) { ctx.fillStyle=fill;ctx.beginPath();points.forEach(([x,py],i)=>i?ctx.lineTo(x,py):ctx.moveTo(x,py));ctx.closePath();ctx.fill(); }
function line(points,stroke,width=2) {ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();points.forEach(([x,py],i)=>i?ctx.lineTo(x,py):ctx.moveTo(x,py));ctx.stroke();}
function carrot(x, y, scale) {
 ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
 line([[0,-17],[-12,-30]],'#5e9948',5);line([[0,-17],[2,-34]],'#699c4a',5);line([[0,-17],[15,-29]],'#7aaf53',5);
 shape([[-12,-16],[13,-16],[5,22]],'#ea9440');
 line([[-6,-7],[1,-5]],'#c87832',2);line([[1,3],[7,5]],'#c87832',2);
 ctx.restore();
}
function tree(x, y, size) {
 line([[x,y],[x,y-65*size]],'#8b9774',7*size);
 ellipse(x,y-70*size,35*size,45*size,'#9bb584');
 ellipse(x-17*size,y-58*size,25*size,30*size,'#8fa976');
}
function draw() {
 ctx.clearRect(0,0,1000,460);
 // Blick vom Sattel über die Ohren nach vorne. Beim Springen hebt sich die Kamera.
 const camera = height * 30 - (down && height === 0 ? 22 : 0);
 ctx.save(); ctx.translate(0,camera);
 ctx.fillStyle='#eef1d8';ctx.fillRect(0,-60,1000,580);
 ellipse(815,35,33,33,'#f4e4aa');
 ellipse(200,135,300,70,'#d2deb7');ellipse(730,142,370,80,'#c2d3a7');
 ctx.fillStyle='#bfd29c';ctx.fillRect(0,140,1000,400);
 shape([[456,140],[544,140],[980,520],[20,520]],'#dedfb0');
 shape([[472,140],[528,140],[830,520],[170,520]],'#e9e5bb');
 // Pfosten und Wegmarkierungen bewegen sich vom Horizont auf uns zu.
 for (let i=0;i<14;i++) {
   const progress=((i/14+world*.6)%1);
   const depth=progress*progress;
   const py=143+depth*360, half=43+depth*410;
   const size=.12+depth*1.4;
   for (const side of [-1,1]) {
     const x=500+side*half;
     line([[x,py],[x,py-35*size]],'#a2aa7b',5*size);
     if(i%3===0) tree(500+side*(half+50+depth*140),py,size);
     ellipse(500+side*(half+18),py,2+depth*4,1+depth*2,'#f5eac1');
   }
   line([[500-half*.36,py],[500-half*.36,py+8*size]],'#c7cb9970',2*size);
   line([[500+half*.36,py],[500+half*.36,py+8*size]],'#c7cb9970',2*size);
 }
 for(const item of [...items].sort((a,b)=>b.distance-a.distance)) {
   const near=1-item.distance;
   const scale=.12+near*near*1.35;
   const py=146+near*near*235;
   if(item.type==='carrot') {
     ellipse(500,py+8,17*scale,4*scale,'#82925830');
     carrot(500,py-20*scale-item.altitude*75*scale,scale);
   } else if(item.type==='log') {
     ctx.fillStyle='#a5825e';ctx.fillRect(500-110*scale,py-28*scale,220*scale,32*scale);
     ellipse(500+110*scale,py-12*scale,11*scale,16*scale,'#d2b184');
     line([[500-92*scale,py-15*scale],[500+90*scale,py-15*scale]],'#876747',3*scale);
   } else {
     line([[500-140*scale,py],[500-140*scale,py-120*scale]],'#8d7956',12*scale);
     line([[500+140*scale,py],[500+140*scale,py-120*scale]],'#8d7956',12*scale);
     line([[500-155*scale,py-100*scale],[500+155*scale,py-100*scale]],'#8d7956',22*scale);
     ellipse(500-95*scale,py-113*scale,55*scale,18*scale,'#8da673');
     ellipse(500+90*scale,py-113*scale,65*scale,18*scale,'#9bb481');
   }
 }
 ctx.restore();
 // Der eigene Ponyhals, Hinterkopf, Ohren und Zügel im Vordergrund.
 const bob=mode==='playing' && height===0 ? Math.sin(elapsed*12)*3 : 0;
 const headY=365+bob-height*12+(down&&height===0?50:0);
 ctx.save();ctx.translate(500,headY);
 if(invincible>0)ctx.globalAlpha=.5+Math.sin(elapsed*24)*.25;
 shape([[-86,130],[-52,30],[-37,-24],[37,-24],[52,30],[86,130]],color);
 ellipse(0,-5,45,48,color);
 shape([[-35,-24],[-42,-88],[-13,-38]],color);
 shape([[35,-24],[42,-88],[13,-38]],color);
 shape([[-31,-39],[-37,-73],[-21,-41]],'#d3a487');
 shape([[31,-39],[37,-73],[21,-41]],'#d3a487');
 shape([[-10,-46],[11,-46],[18,9],[6,36],[20,67],[8,112],[-10,130],[-16,60],[-5,14]],'#5f4c3e');
 line([[-40,2],[-51,62],[-128,125]],'#61794f',5);
 line([[40,2],[51,62],[128,125]],'#61794f',5);
 line([[-39,5],[39,5]],'#61794f',4);
 ctx.restore();
 particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life/.65);ellipse(p.x,p.y,4,4,p.hit?'#ce8f7c':'#ec9545');});ctx.globalAlpha=1;
}
let last=0;
function frame(now) { const dt=last?Math.min((now-last)/1000,.05):0;last=now;update(dt);draw();requestAnimationFrame(frame); }
requestAnimationFrame(frame);
$('start').addEventListener('click',start);$('pause').addEventListener('click',pause);
window.addEventListener('keydown',e=>{
 if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
 const key=e.key.length===1?e.key.toLowerCase():e.key;
 if(['ArrowUp','ArrowDown','w','s'].includes(key)){if(mode==='playing'){e.preventDefault();if(!keys.has(key)&&(key==='ArrowUp'||key==='w'))jump();keys.add(key);}}
 if((key==='p'||key==='Escape')&&!e.repeat)pause();
});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
window.addEventListener('blur',()=>{keys.clear();if(mode==='playing')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});
for(const [id,key] of [['up','ArrowUp'],['down','ArrowDown']]){
 const button=$(id);button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);if(mode==='playing'){if(key==='ArrowUp')jump();keys.add(key);}});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(key));
}
$('pony-name').addEventListener('input',e=>{$('pony-label').textContent=e.target.value.trim()||'Flocke';});
document.querySelectorAll('.swatch').forEach(button=>button.addEventListener('click',()=>{color=button.dataset.color;document.querySelectorAll('.swatch').forEach(s=>{s.classList.toggle('active',s===button);s.setAttribute('aria-pressed',String(s===button));});}));
$('speed').addEventListener('input',e=>{speedLevel=Number(e.target.value)-1;$('speed-label').textContent=['Gemütlich','Flott','Wilder Galopp'][speedLevel];});
updateHUD();
