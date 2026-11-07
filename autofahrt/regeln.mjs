export const SETTINGS={worldHeight:2500,carRadius:19,acceleration:180,forwardSpeed:260,reverseSpeed:125,friction:95,steering:1.9};
export const START={x:500,y:2320,angle:-Math.PI/2,speed:0};
export const CHECKPOINTS=[{x:500,y:2320},{x:500,y:1780},{x:500,y:1180},{x:500,y:580}];
export const OBSTACLES=[
 {x:290,y:2110,w:180,h:55},{x:600,y:1960,w:155,h:60},
 {x:300,y:1610,w:165,h:65},{x:580,y:1440,w:180,h:55},
 {x:260,y:1010,w:200,h:65},{x:600,y:850,w:160,h:65},
 {x:300,y:425,w:170,h:60},{x:590,y:270,w:160,h:60}
];
export function hitsObstacle(x,y,obstacles=OBSTACLES){return obstacles.some(o=>{
 const nearX=Math.max(o.x,Math.min(o.x+o.w,x)),nearY=Math.max(o.y,Math.min(o.y+o.h,y));
 return Math.hypot(x-nearX,y-nearY)<SETTINGS.carRadius;
});}
export function stepCar(car,input,dt){
 let speed=car.speed;
 if(input.gas&&!input.reverse)speed=Math.min(SETTINGS.forwardSpeed,speed+SETTINGS.acceleration*dt);
 else if(input.reverse&&!input.gas)speed=Math.max(-SETTINGS.reverseSpeed,speed-SETTINGS.acceleration*dt);
 else speed=Math.sign(speed)*Math.max(0,Math.abs(speed)-SETTINGS.friction*dt);
 const steering=(Number(Boolean(input.right))-Number(Boolean(input.left)))*SETTINGS.steering*Math.min(1,Math.abs(speed)/65)*Math.sign(speed);
 const angle=car.angle+steering*dt;
 const x=Math.max(209,Math.min(791,car.x+Math.cos(angle)*speed*dt));
 const y=Math.max(70,Math.min(2420,car.y+Math.sin(angle)*speed*dt));
 return {x,y,angle,speed};
}
export function vampirePosition(time,index){return {x:500+Math.sin(time*(.65+index*.07)+index*1.8)*225,y:[1850,1300,700][index]};}
