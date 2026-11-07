export const SETTINGS={worldHeight:6000,carRadius:19,acceleration:300,forwardSpeed:390,reverseSpeed:170,friction:110,steering:2.9};
export const START={x:500,y:5820,angle:-Math.PI/2,speed:0};
export const CHECKPOINTS=Array.from({length:6},(_,i)=>({x:500,y:START.y-i*1000}));
export const VAMPIRE_COUNT=6;
// Verschiedene Engstellen pro Abschnitt; die Fähnchen selbst bleiben frei.
export const OBSTACLES=CHECKPOINTS.flatMap((cp,section)=>[
 {x:250,y:cp.y-260,w:260,h:65},
 {x:530,y:cp.y-500,w:230,h:65},
 {x:section%2?350:440,y:cp.y-740,w:140,h:65}
]).filter(o=>o.y>=200);
export function hitsObstacle(x,y,obstacles=OBSTACLES){return obstacles.some(o=>{
 const nearX=Math.max(o.x,Math.min(o.x+o.w,x)),nearY=Math.max(o.y,Math.min(o.y+o.h,y));
 return Math.hypot(x-nearX,y-nearY)<SETTINGS.carRadius;
});}
export function stepCar(car,input,dt){
 let speed=car.speed;
 if(input.gas&&!input.reverse)speed=Math.min(SETTINGS.forwardSpeed,speed+SETTINGS.acceleration*dt);
 else if(input.reverse&&!input.gas)speed=Math.max(-SETTINGS.reverseSpeed,speed-SETTINGS.acceleration*dt);
 else speed=Math.sign(speed)*Math.max(0,Math.abs(speed)-SETTINGS.friction*dt);
 // Beim Anfahren sofort reagieren; bei hohem Tempo weniger leicht übersteuern.
 const turnInput=Number(Boolean(input.right))-Number(Boolean(input.left));
 const speedRatio=Math.min(1,Math.abs(speed)/SETTINGS.forwardSpeed);
 const turnRate=SETTINGS.steering-speedRatio*1.2;
 const lowSpeedAssist=.65+.35*Math.min(1,Math.abs(speed)/35);
 const steering=turnInput*turnRate*lowSpeedAssist*(speed<0?-1:1);
 const angle=car.angle+steering*dt;
 const x=Math.max(209,Math.min(791,car.x+Math.cos(angle)*speed*dt));
 const y=Math.max(70,Math.min(SETTINGS.worldHeight-80,car.y+Math.sin(angle)*speed*dt));
 return {x,y,angle,speed};
}
export function vampirePosition(time,index){return {x:500+Math.sin(time*(.9+index*.06)+index*1.8)*250,y:START.y-150-index*1000};}
