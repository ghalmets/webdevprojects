import {CHAPTERS,movePlayer,touching,onBridge,BRIDGES,BRIDGE_SPAN,bridgeAt,CELLAR_KEYS,closeEncounter,chaseProject,FLIGHT,flightCollision,vampireAltitude,AVATARS} from './regeln.mjs?v=freundinnen-16';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const reducedMotion=typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const vampirinchenPortrait=typeof Image==='function'?new Image():null;if(vampirinchenPortrait)vampirinchenPortrait.src='vampirinchen.svg?v=freundinnen-16';
const keys=new Set();let mode='ready',chapter=0,score=0,time=0,cooldown=0,chatTimer=0,camera=0,climb=0,fallTime=0,wings=false,bridgeDone=false,selectedBridge=-1,inventory=[],correctKey=-1,ladderUnlocked=false,activeTalk=null,talkStep=0,correctDoor=0,entranceChosen=true,fear=.35,visualTime=0,lives=3,hurtTimer=0,flightHeight=120,landing=false,selectedLotta='lea';
let player={x:80,y:430},gems=[],vampires=[];
const current=()=>CHAPTERS[chapter];
const avatar=()=>AVATARS[selectedLotta];
const named=text=>String(text).replaceAll('Lotta',avatar().name).replaceAll('LOTTA',avatar().name.toUpperCase());
function say(text){$('dialog').textContent=named(text);chatTimer=5;}
function setup(){const level=current();player={...level.start};gems=level.gems.map(g=>({...g,collected:false}));vampires=level.vampires.map((v,i)=>({...v,homeX:v.x,homeY:v.y,name:v.name||(i===0?'Vampirinchen':'Vampir '+(i+1))}));score=0;time=0;lives=3;hurtTimer=1.5;flightHeight=120;landing=false;if(chapter===4)wings=true;cooldown=1;climb=0;fallTime=0;bridgeDone=false;selectedBridge=-1;inventory=CELLAR_KEYS.map(k=>({...k,collected:false,tried:false}));correctKey=Math.floor(Math.random()*inventory.length);ladderUnlocked=false;fear=chapter===4?.05:.35;entranceChosen=chapter!==2;activeTalk=null;talkStep=0;$('conversation').hidden=true;$('door-choice').hidden=true;camera=0;keys.clear();$('level').textContent=named(`${chapter+1} / 5 · ${level.name}`);hud();say(level.target);}
function hud(){
 $('lives').textContent=named('♥ '.repeat(lives)+'♡ '.repeat(3-lives));$('lives').setAttribute('aria-label',`${lives} von 3 Leben`);$('control-hint').textContent=named(chapter===4?'↑ Steigen · ↓ Sinken · ← / → Seitwärts · P Pause':'↑ Vorwärts · ↓ Zurück · ← / → Seitwärts · P Pause');
 $('feeling').textContent=named(fear>.7?'♡ Starkes Herzklopfen':fear>.3?'♡ Ein bisschen Angst':'♡ Wieder mutiger');
 $('score').textContent=named(chapter===4?`${Math.round(flightHeight)} m Flughöhe`:chapter===2?`${score}/${gems.length} Steine · ${inventory.filter(k=>k.collected).length}/4 Schlüssel`: `${score} / ${gems.length} ${chapter===1?'Schlüssel':'Mondsteine'}`);
 $('key-choice').hidden=!(chapter===2&&player.x>current().width-350);
 document.querySelectorAll('[data-lock-key]').forEach((button,i)=>{button.disabled=!inventory[i]?.collected||inventory[i]?.tried||ladderUnlocked;button.textContent=`${inventory[i]?.tried?'✗ ':''}${CELLAR_KEYS[i].name}`;});
 $('lock-status').textContent=named(ladderUnlocked?'✓ Aufgeschlossen! Halte ↑ an der Leiter.':'Welcher Schlüssel passt? Du darfst alle ausprobieren.');
}
function chooseLotta(value){
 if(!Object.hasOwn(AVATARS,value))return;const oldName=avatar().name;selectedLotta=value;for(const id of ['dialog','talk-text','talk-thought','reply-one','reply-two','title','description'])$(id).textContent=$(id).textContent.replaceAll(oldName,avatar().name);
 document.querySelectorAll('[data-lotta]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lotta===value)));
 $('selected-portrait').alt=avatar().description;$('selected-portrait').src=avatar().portrait+'?v=freundinnen-16';
 $('hero-name').textContent=named(avatar().name);$('portrait-caption').textContent=named(`Das bist du: ${avatar().name} ✨`);
 document.title=avatar().name+' & Vampirinchen';
 if(mode==='ready'){$('title').textContent=named(`Hallo, ${avatar().name}!`);}

}
function loseLife(reason){
 if(hurtTimer>0)return true;
 lives=Math.max(0,lives-1);hurtTimer=1.8;fear=1;hud();
 if(lives===0){mode='gameover';keys.clear();$('conversation').hidden=true;$('door-choice').hidden=true;$('pause').disabled=true;overlay('DIE DREI HERZEN SIND AUFGEBRAUCHT','Noch ein Versuch in diesem Kapitel?','Du startest dieses Kapitel mit drei neuen Leben. Die gewählte Figur bleibt dieselbe.','Kapitel neu versuchen →');$('start').focus({preventScroll:true});return false;}
 say(`${reason} Ein Herz weniger – noch ${lives} Leben. Du bist kurz geschützt.`);return true;
}
function finishHome(){mode='finished';keys.clear();$('pause').disabled=true;overlay('ZU HAUSE ANGEKOMMEN','Gute Nacht, Lotta!','Lotta ist durch die Luft nach Hause geflogen, den fliegenden Vampiren ausgewichen und sicher vor ihrer Haustür gelandet.','Das Abenteuer nochmal spielen →');$('start').focus({preventScroll:true});}
function updateFlight(dt,vertical,side){
 if(landing){flightHeight=Math.max(0,flightHeight-95*dt);if(flightHeight===0)finishHome();hud();return;}
 player.x=Math.min(current().width-110,player.x+FLIGHT.speed*dt);
 player.y=Math.max(200,Math.min(470,player.y+side*175*dt));
 flightHeight=Math.max(FLIGHT.minHeight,Math.min(FLIGHT.maxHeight,flightHeight+vertical*FLIGHT.climbSpeed*dt));
 vampires.forEach((v,i)=>{v.x=v.homeX+Math.sin(time*.6+i)*22;v.y=v.homeY+Math.sin(time*.9+i*1.7)*105;v.altitude=vampireAltitude(time,i);});
 for(const v of vampires)if(!v.passed&&flightCollision(player,flightHeight,v,v.altitude)){
  if(!loseLife('Ein fliegender Vampir hat dich erwischt.'))return;
  if(hurtTimer>0)v.passed=true;
 }
 if(player.x>2250&&chatTimer===0)say('Dein Haus ist rechts! Lenke nach rechts. Lotta landet dort automatisch.');
 if(player.x>2430&&player.y>340){landing=true;say('Geschafft! Lotta setzt zur Landung vor ihrem Haus an.');}
 hud();
}
function tryKey(index){
 if(mode!=='playing'||chapter!==2||player.x<=current().width-350||ladderUnlocked)return;
 const key=inventory[index];if(!key||!key.collected||key.tried)return;
 if(index===correctKey){ladderUnlocked=true;say('KLICK! Der richtige Schlüssel! Sammle noch fehlende Mondsteine und halte dann ↑ an der Leiter.');}
 else{key.tried=true;say('Dieser Schlüssel passt nicht. Probiere einen anderen – du verlierst nichts.');}
 hud();
}
function beginTalk(vampire){
 if(mode!=='playing')return;mode='talk';activeTalk=vampire;talkStep=0;keys.clear();
 fear=1;hud();say('Lotta denkt: „Oh nein, ein Vampir! Mein Herz klopft. Ich traue mich trotzdem zu fragen.“');$('talk-thought').textContent=named(vampire.boss?'Lotta denkt: „Der Obervampir ist so groß! Ich habe Angst … aber ich möchte nach Hause.“':'Lotta denkt: „Meine Hände zittern. Hoffentlich lässt er mich vorbei.“');
 $('conversation').hidden=false;$('talk-name').textContent=named(vampire.name);$('talk-portrait').hidden=vampire.name!=='Vampirinchen';
 $('talk-text').textContent=named(vampire.boss?'Obervampir: „Du hast Mut und Freundlichkeit bewiesen. Was wünschst du dir, Lotta?“':`${vampire.name}: „Halt! Wer bist du und wohin möchtest du?“`);
 $('reply-one').textContent=named(vampire.boss?'Ich wünsche mir Flügel, um nach Hause zu fliegen.':'I-ich bin Lotta … Bitte lass mich vorbei.');
 $('reply-two').textContent=named(vampire.boss?'Kannst du mir beim Heimfliegen helfen?':'Ich habe ein bisschen Angst. Kannst du mir helfen?');
 $('reply-one').focus({preventScroll:true});
}
function reply(choice){
 if(mode!=='talk'||!activeTalk)return;
 if(talkStep===0){talkStep=1;fear=.55;hud();$('talk-thought').textContent=named('Lotta atmet tief durch. Ihr Herz klopft noch, aber sie fühlt sich schon etwas sicherer.');$('talk-text').textContent=named(activeTalk.boss?'Obervampir: „Sehr gern! Für deinen Mut und deine Freundlichkeit schenke ich dir silberne Flügel.“':choice===0?`${activeTalk.name}: „Du brauchst dich vor mir nicht zu fürchten, Lotta. Ich mache dir Platz.“`:`${activeTalk.name}: „Natürlich helfe ich dir. Atme ruhig durch – ich lasse dich vorbei.“`);
 $('reply-one').textContent=named(activeTalk.boss?'Danke! Ich bin bereit zum Fliegen!':'Danke … jetzt habe ich nicht mehr so viel Angst.');$('reply-two').textContent=named(activeTalk.boss?'Das ist wunderbar! Danke!':'Puh! Danke. Ich gehe jetzt vorsichtig weiter.');return;}
 fear=.2;hud();const boss=activeTalk.boss;activeTalk.passed=true;activeTalk=null;$('conversation').hidden=true;keys.clear();mode='playing';
 if(boss){wings=true;next('Ein Wunsch wird wahr!','Der Obervampir schenkt Lotta Flügel. Die Kamera begleitet Lotta von hinten durch den Nachthimmel. Fliege nach vorne und zum leuchtenden Haus!');}
 else{say('Lotta atmet auf: „Puh! Das war unheimlich. Aber ich habe mich getraut!“');canvas.focus({preventScroll:true});}
}
function chooseDoor(index){
 if(mode!=='doors'||chapter!==2||!Number.isInteger(index)||index<0||index>2)return;
 $('door-choice').hidden=true;keys.clear();
 if(index===correctDoor){entranceChosen=true;mode='playing';say('Der richtige Eingang! Jetzt geht es tiefer in den Schlosskeller. Suche Mondsteine und Schlüssel.');canvas.focus({preventScroll:true});}
 else{chapter=0;wings=false;setup();mode='outside';$('pause').disabled=true;overlay('DIESE TÜR FÜHRT NACH DRAUSSEN','Wieder vor dem Schloss!','Lotta ist durch eine Außentür gegangen. Alle Mondsteine, Schlüssel und Gespräche werden zurückgesetzt. Das Abenteuer beginnt wieder ganz vorne im Garten. Merke dir die falsche Tür!','Von vorne im Garten starten →');$('start').focus({preventScroll:true});}
}
function showDoors(){
 mode='doors';keys.clear();$('door-choice').hidden=false;
 $('door-one').focus({preventScroll:true});
 say('Drei Türen: Nur eine führt in den Keller. Die anderen führen nach draußen und starten das ganze Abenteuer neu.');
}
function overlay(tag,title,text,button){$('tag').textContent=named(tag);$('title').textContent=named(title);$('description').textContent=named(text);$('start').textContent=named(button);$('overlay').hidden=false;}
function start(){if(mode==='paused'){mode='playing';$('overlay').hidden=true;$('pause').textContent=named('Pause');return;}if(mode==='chapter')chapter++;if(mode==='ready'||mode==='finished')correctDoor=Math.floor(Math.random()*3);if(mode==='finished'||mode==='outside'){chapter=0;wings=false;}setup();mode='playing';$('overlay').hidden=true;$('pause').disabled=false;$('pause').textContent=named('Pause');}
function pause(){if(mode==='paused'){start();return;}if(mode!=='playing')return;keys.clear();mode='paused';$('pause').textContent=named('Weiter');overlay('KLEINE MONDSCHEINPAUSE','Alles wartet auf dich.',current().target,'Weiter geht’s →');}
function next(title,text){keys.clear();mode='chapter';$('pause').disabled=true;overlay('DAS ABENTEUER GEHT WEITER',title,text,'Weiter →');$('start').focus({preventScroll:true});}
function update(dt){if(mode!=='playing')return;time+=dt;hurtTimer=Math.max(0,hurtTimer-dt);fear=Math.max(.1,fear-dt*.07);const looming=vampires.some(v=>!v.passed&&v.homeX-player.x>0&&v.homeX-player.x<240);if(looming)fear=Math.max(fear,.55);cooldown=Math.max(0,cooldown-dt);chatTimer=Math.max(0,chatTimer-dt);
 if(fallTime>0){fallTime-=dt;if(fallTime<=0){chapter=2;setup();mode='playing';showDoors();say('Plumps! Lotta ist weich gelandet. Vor ihr sind drei Eingänge – nur einer führt in den richtigen Keller.');}return;}
 if(chapter===2&&!entranceChosen){showDoors();return;}
 const dx=Number(keys.has('ArrowUp')||keys.has('w'))-Number(keys.has('ArrowDown')||keys.has('s'));
 const dy=Number(keys.has('ArrowRight')||keys.has('d'))-Number(keys.has('ArrowLeft')||keys.has('a'));
 if(chapter===4){updateFlight(dt,dx,dy);return;}
 const before={...player};const speedFactor=chapter===1&&player.x>=BRIDGE_SPAN.left-20&&player.x<=BRIDGE_SPAN.right+20?.6:chapter===4?1.5:1;
 const atLadder=chapter===2&&player.x>current().width-200&&Math.abs(player.y-350)<80&&ladderUnlocked&&score===gems.length&&inventory.every(k=>k.collected)&&dx>0;
 if(!atLadder)movePlayer(player,dx,dy,dt*speedFactor,{left:35,right:current().width-35,top:chapter===4?140:200,bottom:470},current().blocks);
 if(chapter===1){
  if(!onBridge(player.x,player.y)){
   player={x:before.x>BRIDGE_SPAN.right?BRIDGE_SPAN.right+55:BRIDGE_SPAN.left-55,y:selectedBridge>=0?BRIDGES[selectedBridge].center:350};
   if(!bridgeDone)selectedBridge=-1;
   cooldown=1;if(!loseLife('Lotta ist von der wackeligen Brücke gerutscht.'))return;say('Wähle links die Mondbrücke oder rechts die Sternbrücke und bleib auf den Planken.');
  }else if(player.x>=BRIDGE_SPAN.left&&player.x<=BRIDGE_SPAN.right){
   const lane=bridgeAt(player.y);
   if(selectedBridge===-1&&before.x<BRIDGE_SPAN.left){selectedBridge=lane;say(`Lotta wählt die ${BRIDGES[lane].name}. Vorsichtig hinüber!`);}
  }
  if(selectedBridge>=0&&before.x<=BRIDGE_SPAN.right&&player.x>BRIDGE_SPAN.right){bridgeDone=true;say('Brücke geschafft! Jetzt geht es zur Falltür.');}
 }
 vampires.forEach((v,i)=>{v.y=v.guard?v.homeY:v.homeY+Math.sin(time*.85+i*1.7)*110;v.x=v.guard?v.homeX:v.homeX+Math.sin(time*.5+i)*30;});
 // Erst ein tatsächliches Zusammentreffen auf derselben Spur löst das Gespräch aus.
 const nearby=vampires.find(v=>!v.passed&&closeEncounter(player,v));
 if(nearby){if(!nearby.guard&&!loseLife('Lotta ist mit einem Vampir zusammengestoßen.'))return;beginTalk(nearby);hud();return;}
 for(const gem of gems)if(!gem.collected&&touching(player,gem,32)){gem.collected=true;score++;hud();say(score===gems.length?current().target+' Alles eingesammelt!': 'Lotta: „Gefunden! Weiter geht’s.“');}
 if(chapter===2)for(const key of inventory)if(!key.collected&&touching(player,key,30)){key.collected=true;hud();say(`${key.name} gefunden! Erst an der Leiter erfährst du, ob er passt.`);}
 if(chapter===0&&player.x>current().width-180){if(score===gems.length)next('Willkommen im Schloss!','Die Mondsteine öffnen das Schlosstor. Drinnen warten zwei Hängebrücken. Wähle eine und überquere sie, um die Falltür zu erreichen.');else if(chatTimer===0)say('Am Tor fehlen noch Mondsteine. Suche im großen Garten!');}
 if(chapter===1&&player.x>2250&&player.x<2390&&score===1&&bridgeDone){fallTime=1.3;keys.clear();fear=1;hud();say('Lotta: „Aaaah! Der Boden geht auf!“ Ihr Herz rast, dann landet sie weich auf Heu.');return;}
 if(chapter===1&&player.x>2150&&(!bridgeDone||score===0)&&chatTimer===0)say('Erst den Schlüssel holen und eine der beiden Hängebrücken vollständig überqueren.');
 if(chapter===2&&player.x>current().width-200&&Math.abs(player.y-350)<80&&ladderUnlocked&&score===gems.length&&inventory.every(k=>k.collected)&&dx>0){climb+=dt;if(climb>=1.5)next('Wieder oben!','Lotta klettert Sprosse für Sprosse nach oben. Die Treppe führt direkt in den Turm zum Obervampir.');}else climb=0;
 if(chapter===2&&player.x>current().width-350&&chatTimer===0)say(ladderUnlocked?(score===gems.length&&inventory.every(k=>k.collected)?'Halte ↑ an der Leiter gedrückt.':'Es fehlen noch Mondsteine oder Schlüssel im Keller.'):'Probiere unten einen deiner gefundenen Schlüssel am Schloss aus.');
 if(chapter===3&&Math.abs(player.x-(current().width-210))<55&&Math.abs(player.y-350)<45&&dx>0){
  if(!vampires.filter(v=>v.guard).every(v=>v.passed)){if(chatTimer===0)say('Vor dem Obervampir warten zwei Wachen. Gehe nah zu jeder Wache und sprich mit ihr.');}
  else if(score===gems.length){beginTalk({name:'Obervampir',boss:true,x:current().width-210,y:350});return;}
  else if(chatTimer===0)say('Obervampir: „Bring mir alle acht Zaubersteine, dann erfülle ich deinen Wunsch.“');
 }
 hud();
 camera=Math.max(0,Math.min(current().width-960,player.x-330));
}
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();}
function line(points,color,width=3){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function character(p,isVampire){const bob=mode==='playing'?Math.sin(time*9)*2:0;ctx.save();ctx.translate(p.x,p.y+bob);ellipse(0,7,23,8,'#17132966');
 if(isVampire&&p.name==='Vampirinchen'){
  if(vampirinchenPortrait&&vampirinchenPortrait.complete&&vampirinchenPortrait.naturalWidth){ctx.drawImage(vampirinchenPortrait,-47,-105,94,115);}
  else{poly([[-21,-78],[-26,-24],[-17,-11],[20,-11],[28,-25],[21,-78]],'#624573');poly([[-15,-52],[-37,0],[0,-12],[37,0],[15,-52]],'#ba7e9f');poly([[-12,-47],[12,-47],[20,-7],[-20,-7]],'#895e98');ellipse(0,-65,18,23,'#f0e1ed');line([[-18,-74],[-23,-48],[-18,-20]],'#624573',9);line([[18,-74],[23,-48],[18,-20]],'#624573',9);ellipse(-6,-66,2,3,'#4a345c');ellipse(6,-66,2,3,'#4a345c');line([[-5,-55],[0,-52],[5,-55]],'#a96d8e',2);ellipse(17,-82,4,4,'#f2d7a0');}
  ctx.textAlign='center';ctx.font='bold 12px system-ui';ctx.fillStyle='#f3d8eb';ctx.fillText('Vampirinchen',0,-112);ctx.restore();return;
 }

 if(!isVampire && wings){poly([[-12,-40],[-80,-92],[-92,-40],[-55,-5],[-12,-18]],'#c9b6ed');poly([[12,-40],[80,-92],[92,-40],[55,-5],[12,-18]],'#c9b6ed');}
 if(isVampire)poly([[-13,-59],[-39,-3],[0,-14],[36,0],[14,-59]],'#974d79');
 line([[-8,-12],[-10,4]],'#453951',6);line([[8,-12],[10,4]],'#453951',6);
 poly([[-12,-49],[12,-49],[19,-9],[-19,-9]],isVampire?'#5d416f':'#d88b78');
 ellipse(0,-65,19,23,isVampire?'#e3d9ed':'#f3d0ae');
 if(isVampire){poly([[-20,-66],[-20,-85],[0,-93],[20,-82],[18,-63],[7,-79],[0,-75],[-8,-80]],'#382a4c');poly([[-5,-55],[-1,-48],[2,-55]],'white');}
 else{poly([[-20,-54],[-23,-80],[-10,-91],[12,-88],[24,-70],[27,-18],[18,-4],[12,-17],[13,-55],[13,-74],[-8,-80],[-13,-64],[-15,-18],[-24,-6],[-28,-20]],'#986847');line([[-21,-56],[-23,-34],[-20,-14]],'#c39562',2);line([[21,-56],[23,-34],[20,-14]],'#c39562',2);ellipse(-17,-79,8,5,'#e6b9d4');}
 if(p.boss)poly([[-20,-88],[-24,-110],[-8,-99],[0,-116],[9,-99],[24,-110],[20,-88]],'#e2bf6e');
 ellipse(-6,-66,2,2,'#47354c');ellipse(7,-66,2,2,'#47354c');line([[-4,-56],[1,-54],[6,-56]],'#9e6474',1.7);
 line([[-12,-42],[-24,-25]],isVampire?'#d6c9e6':'#f3d0ae',5);line([[12,-42],[23,-27]],isVampire?'#d6c9e6':'#f3d0ae',5);
 ctx.textAlign='center';ctx.font='bold 12px system-ui';ctx.fillStyle='#fff0dc';ctx.fillText(isVampire?(p.boss?'Obervampir':p.name||'Vampir'):'Lotta',0,-104);ctx.restore();}
function label(text,x,y,color='#f3dfb1'){ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(text,x,y);}
// Leicht erhöhte Kamera hinter Lotta. Sie bleibt sichtbar und bewegt sich seitlich im Bild.
function project(x,y){return chaseProject(x,y,player);}
function lottaFromBehind(){
 const walking=chapter!==4&&mode==='playing'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].some(k=>keys.has(k));
 const stride=walking&&!reducedMotion?Math.sin(visualTime*10)*5:0;
 if(chapter!==4)ellipse(0,2,25,8,'#cfe3d775');
 const flap=chapter===4&&!reducedMotion?Math.sin(visualTime*6)*15:0;
 if(wings){ctx.save();ctx.translate(0,flap);poly([[-12,-51],[-78,-91],[-89,-38],[-47,-20],[-13,-33]],avatar().wings);poly([[12,-51],[78,-91],[89,-38],[47,-20],[13,-33]],avatar().wings);ctx.restore();}
 line([[-8,-17],[-9,chapter===4?-5:1+stride]],'#563c49',8);line([[8,-17],[9,chapter===4?-5:1-stride]],'#563c49',8);
 line([[-17,-56],[-25,-30]],'#edc5aa',7);line([[17,-56],[25,-30]],'#edc5aa',7);
 poly([[-14,-67],[14,-67],[25,-18],[-25,-18]],avatar().dress);
 ellipse(0,-88,21,24,avatar().hairTop);
 poly([[-20,-90],[-23,-70],[-20,-48],[-25,-31],[-12,-39],[0,-34],[15,-40],[25,-31],[20,-61],[21,-91]],avatar().hair);
 line([[-12,-87],[-15,-64],[-10,-43]],avatar().highlight,3);line([[12,-87],[14,-65],[10,-43]],avatar().highlight,3);
 if(avatar().accessory==='star'){poly([[15,-103],[18,-97],[25,-96],[20,-91],[21,-84],[15,-87],[9,-84],[10,-91],[5,-96],[12,-97]],'#f2d49b');}else{poly([[-5,-95],[-20,-103],[-22,-89],[-5,-90],[5,-90],[22,-89],[20,-103],[5,-95]],avatar().accessoryColor);ellipse(0,-93,5,5,'#f3d8e3');}
 label('DU · '+avatar().name.toUpperCase(),0,28,'#e8f5e7');
}
function floorPatch(x1,x2,y1,y2,color){const near=Math.max(x1,player.x-85),far=Math.min(x2,player.x+1450);if(near>=far)return;const a=project(near,y1),b=project(near,y2),c=project(far,y2),d=project(far,y1);if(a&&b&&c&&d)poly([[a.x,a.y],[b.x,b.y],[c.x,c.y],[d.x,d.y]],color);}
function draw(){
 const level=current();ctx.fillStyle=chapter===2?'#292436':'#35314e';ctx.fillRect(0,0,960,520);
 if(chapter===0||chapter===4){ellipse(790,65,33,33,'#efddb0');for(let i=0;i<30;i++)ellipse((i*137+22)%960,(i*59+20)%155,1.3,1.3,'#c6b4d7');}
 ctx.fillStyle=chapter===0?'#53634e':chapter===4?'#536b72':'#625567';ctx.fillRect(0,chapter===4?390:170,960,chapter===4?130:350);
 if(chapter===4){for(let i=0;i<9;i++){const x=((i*157-player.x*.35)%1150+1150)%1150-90;const y=95+(i%3)*80;ellipse(x,y,55,13,'#d1cbe244');ellipse(x+27,y-7,38,16,'#ded6ec33');}poly([[0,430],[180,385],[330,415],[550,370],[760,410],[960,380],[960,520],[0,520]],'#6a8379');}
 if(chapter!==4)floorPatch(player.x-85,level.width,200,470,chapter===0?'#968771':'#84737d');
 if(chapter!==4)for(let x=Math.floor(player.x/70)*70;x<player.x+1300;x+=70){for(const y of [200,470]){const p=project(x,y);if(p)line([[p.x,p.y],[p.x,p.y-38*p.scale]],'#b49d80',Math.max(1,p.scale*3));}}
 // Brücken laufen links und rechts durch die Tiefe ins Schloss.
 if(chapter===1){floorPatch(BRIDGE_SPAN.left,BRIDGE_SPAN.right,190,480,'#1b1729');for(const bridge of BRIDGES){floorPatch(BRIDGE_SPAN.left,BRIDGE_SPAN.right,bridge.top,bridge.bottom,'#ad8b64');for(let x=BRIDGE_SPAN.left;x<BRIDGE_SPAN.right;x+=35){const a=project(x,bridge.top),b=project(x,bridge.bottom);if(a&&b)line([[a.x,a.y],[b.x,b.y]],'#72563f',Math.max(1,a.scale*2));}const p=project(BRIDGE_SPAN.left+60,bridge.center);if(p)label(bridge.name,p.x,p.y-45*p.scale);}
 if(fallTime>0)floorPatch(2250,2390,275,425,'#100e19');}
 const objects=[];
 for(const block of level.blocks){floorPatch(block.x,block.x+block.w,block.y,block.y+block.h,chapter===0?'#56764e':'#8e775f');}
 for(const block of level.blocks)objects.push({x:block.x,y:block.y+block.h/2,type:'block',block});
 for(const gem of gems)if(!gem.collected)objects.push({...gem,type:'gem'});
 if(chapter===2)for(const key of inventory)if(!key.collected)objects.push({...key,type:'key'});
 for(const v of vampires)objects.push({...v,type:'vampire'});
 objects.push({x:player.x,y:player.y,type:'lotta'});
 if(chapter===2&&!entranceChosen)for(let i=0;i<3;i++)objects.push({x:320,y:235+i*100,type:'choiceDoor',number:i+1});
 if(chapter===0)objects.push({x:level.width-100,y:350,type:'door'});
 if(chapter===2)objects.push({x:level.width-130,y:350,type:'ladder'});
 if(chapter===3)objects.push({x:level.width-210,y:350,type:'vampire',boss:true,name:'Obervampir'});
 if(chapter===4)objects.push({x:2490,y:400,type:'house'});
 objects.sort((a,b)=>b.x-a.x);
 for(const o of objects){const p=project(o.x,o.y);if(!p||p.x<-250||p.x>1210)continue;ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.scale,p.scale);
 if(chapter===4&&(o.type==='lotta'||o.type==='vampire')){ellipse(0,0,o.type==='lotta'?24:18,5,'#121b3030');ctx.translate(0,-(o.type==='lotta'?flightHeight:o.altitude||125));if(o.type==='vampire'){poly([[-10,-45],[-60,-80],[-72,-32],[-29,-23]],'#795784');poly([[10,-45],[60,-80],[72,-32],[29,-23]],'#795784');}}
 if(o.type==='lotta'){if(hurtTimer>0&&Math.floor(visualTime*8)%2)ctx.globalAlpha=.55;if(climb>0)ctx.translate(0,-climb*65);lottaFromBehind();}
 if(o.type==='vampire'){if(chapter===4&&o.passed)ctx.globalAlpha=.35;ctx.strokeStyle=o.passed?'#a5cf9a':'#e6b784';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,25,8,0,0,Math.PI*2);ctx.stroke();character({x:0,y:0,boss:o.boss,name:o.name},true);if(o.passed)label('✓ Danke!',0,-122,'#c3e0ad');}
 if(o.type==='gem'){poly([[0,-40],[15,-20],[0,0],[-15,-20]],'#e9cc83');}
 if(o.type==='key'){ellipse(0,-30,10,10,'#edc982');line([[0,-20],[0,2],[8,2]],'#edc982',5);label(o.name,0,-55);}
 if(o.type==='block'){ctx.fillStyle=chapter===0?'#354d3d':'#735e4d';ctx.fillRect(-o.block.h,-45,o.block.h*2,45);}
 if(o.type==='ladder'){line([[-25,0],[-25,-160]],'#c6a375',7);line([[25,0],[25,-160]],'#c6a375',7);for(let y=0;y>-160;y-=20)line([[-25,y],[25,y]],'#e5c69b',5);label('LEITER',0,-180);}
 if(o.type==='choiceDoor'){ctx.fillStyle=['#795c89','#5b7978','#9b7856'][o.number-1];ctx.fillRect(-32,-125,64,125);line([[-32,0],[-32,-125],[32,-125],[32,0]],'#d5b68b',4);ellipse(20,-60,4,4,'#e9cf8f');label('TÜR '+o.number,0,-145);}
 if(o.type==='door'||o.type==='house'){ctx.fillStyle='#a68a83';ctx.fillRect(-65,-160,130,160);poly([[-80,-160],[0,-225],[80,-160]],'#574361');ctx.fillStyle='#f1cf87';ctx.fillRect(-20,-65,40,65);label(o.type==='house'?'ZU HAUSE':'SCHLOSS',0,-235);}
 ctx.restore();}
 if(fallTime>0){ctx.fillStyle='#14101ce0';ctx.fillRect(0,0,960,520);label('Plumps! Die Falltür öffnet sich …',480,260);}
 ctx.fillStyle='#241e35e8';ctx.fillRect(12,12,936,42);ctx.textAlign='left';ctx.font='12px system-ui';ctx.fillStyle='#f0dfb7';ctx.fillText(level.target,24,38);
 ctx.fillStyle='#d3b5e7';ctx.fillRect(20,502,920*player.x/level.width,5);
 // Orientierung für Gegenstände neben oder hinter Lotta, damit alle Funde auffindbar bleiben.
 const remaining=[...gems.filter(g=>!g.collected),...(chapter===2?inventory.filter(k=>!k.collected):[])];
 const closest=remaining.sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];
 if(closest){const text=closest.x<player.x-25?'↓ Fund hinter dir':closest.y<player.y-30?'← Fund links':closest.y>player.y+30?'Fund rechts →':'↑ Fund voraus';ctx.fillStyle='#211b32dd';ctx.fillRect(330,65,300,34);label(text,480,88);}
 const nextGuard=chapter===3?vampires.filter(v=>v.guard&&!v.passed).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0]:null;
 if(nextGuard&&player.x>1300){label(nextGuard.y<player.y?'← Zur linken Turmwache':'Zur rechten Turmwache →',480,120);}
 if(climb>0){ctx.fillStyle='#b7d6a9';ctx.fillRect(300,465,360*climb/1.5,8);}
}
let last=0;function frame(now){const dt=last?Math.min((now-last)/1000,.04):0;last=now;if(mode!=='paused')visualTime+=dt;update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
document.querySelectorAll('[data-lock-key]').forEach((button,i)=>button.addEventListener('click',()=>tryKey(i)));
document.querySelectorAll('[data-door]').forEach((button,i)=>button.addEventListener('click',()=>chooseDoor(i)));
$('reply-one').addEventListener('click',()=>reply(0));$('reply-two').addEventListener('click',()=>reply(1));
document.querySelectorAll('[data-lotta]').forEach(button=>button.addEventListener('click',()=>chooseLotta(button.dataset.lotta)));
$('start').addEventListener('click',start);$('pause').addEventListener('click',pause);
window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;const key=e.key.length===1?e.key.toLowerCase():e.key;if(mode==='doors'&&['1','2','3'].includes(key)&&!e.repeat){e.preventDefault();chooseDoor(Number(key)-1);return;}if(mode==='talk'&&(key==='1'||key==='2')&&!e.repeat){e.preventDefault();reply(Number(key)-1);return;}if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(key)&&mode==='playing'){e.preventDefault();keys.add(key);}if((key==='p'||key==='Escape')&&!e.repeat)pause();});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>{keys.clear();if(mode==='playing')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});
document.querySelectorAll('[data-key]').forEach(button=>{button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);if(mode==='playing')keys.add(button.dataset.key);});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(button.dataset.key));});
setup();chooseLotta('lea');
