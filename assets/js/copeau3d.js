/* ════════ MORET — LE COPEAU 3D (accueil uniquement) ════════
   Nécessite Three.js r128 + partials.js (essences). Se retire de
   lui-même si WebGL est indisponible ou si l'utilisateur préfère
   réduire les animations. ═════════════════════════════════════ */
(function(){
'use strict';
function mq(q){try{return window.matchMedia&&window.matchMedia(q).matches}catch(e){return false}}
var reduced=mq('(prefers-reduced-motion: reduce)');
/* — LE COPEAU 3D : raboté à l'entrée, à faire tourner — */
(function(){
  if(reduced||!window.THREE)return;
  var kick=function(){},threeColorTo=null;
  var mount=document.getElementById('stage');if(!mount)return;
  var renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch(e){return}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  mount.appendChild(renderer.domElement);
  var scene=new THREE.Scene();
  var cam=new THREE.PerspectiveCamera(34,1,.1,50);cam.position.set(0,0,6.4);
  scene.add(new THREE.AmbientLight(0xFFE8CC,.55));
  var key=new THREE.DirectionalLight(0xFFDFAE,1);key.position.set(2.5,3,4);scene.add(key);
  var rim=new THREE.DirectionalLight(0x9FB6CC,.3);rim.position.set(-3,-2,-2);scene.add(rim);

  /* ruban en spirale = le copeau */
  var STEPS=380,TURNS=2.35,W=.5,pos=[],col=[],idx=[];
  for(var i=0;i<=STEPS;i++){
    var t=i/STEPS,a=t*TURNS*Math.PI*2;
    var r=.28+1.05*Math.pow(t,1.22);
    var x=Math.cos(a)*r,y=Math.sin(a)*r,zc=.05*Math.sin(a*2.2);
    var s=.55+.45*t;
    pos.push(x,y,zc-W/2, x,y,zc+W/2);
    col.push(s,s*.985,s*.955, s,s*.985,s*.955);
    if(i<STEPS){var k4=i*2;idx.push(k4,k4+1,k4+2, k4+1,k4+3,k4+2)}
  }
  var g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  g.setIndex(idx);g.computeVertexNormals();
  var mat=new THREE.MeshStandardMaterial({vertexColors:true,color:new THREE.Color((ESS[essKey]||ESS.chene).c),roughness:.5,metalness:.08,side:THREE.DoubleSide});
  var grp=new THREE.Group();grp.add(new THREE.Mesh(g,mat));
  grp.rotation.set(-.5,.4,.18);scene.add(grp);

  /* sciure en suspension */
  var PN=90,pp=[];
  for(var j=0;j<PN;j++)pp.push((Math.random()*2-1)*4,(Math.random()*2-1)*2.6,(Math.random()*2-1)*2);
  var pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(pp,3));
  scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0xD9B98A,size:.035,transparent:true,opacity:.5,depthWrite:false})));

  var vel=.004,drag=false,lx=0,pulse=1,scaleBase=1,baseX=1.5,baseY=-.05;
  var ESS=(window.MMEA&&window.MMEA.essences)||{chene:{c:0xD99C55}};
  var essKey=(window.MMEA&&window.MMEA.getEssence&&window.MMEA.getEssence())||'chene';
  var target=new THREE.Color((ESS[essKey]||ESS.chene).c);
  if(window.MMEA)window.MMEA.onEssence(function(k,v){target=new THREE.Color(v.c)});
  window.MMEA_COPEAU={kick:function(v){vel+=v;pulse=1.07}};

  var dom=renderer.domElement,tapT=0,moved=0;
  dom.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX;tapT=Date.now();moved=0;mount.classList.add('grab')});
  addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lx;lx=e.clientX;moved+=Math.abs(dx);grp.rotation.y+=dx*.006;vel=dx*.0009});
  addEventListener('pointerup',function(){if(!drag)return;drag=false;mount.classList.remove('grab');if(Date.now()-tapT<220&&moved<6)kick(.05)});

  /* Pose continue : 0 = bureau (copeau à droite du texte), 1 = téléphone
     (copeau au-dessus). Interpolation douce entre 1180px et 620px, puis
     easing dans la boucle d'animation -> aucun saut au redimensionnement. */
  function pose(w){
    var t=(1180-w)/(1180-620); t=Math.max(0,Math.min(1,t)); t=t*t*(3-2*t);
    return { x:1.5*(1-t), y:-.05+1.34*t, s:1-.38*t };
  }
  var tgt=pose(mount.clientWidth||innerWidth);
  baseX=tgt.x; baseY=tgt.y; scaleBase=tgt.s; grp.position.set(baseX,baseY,0);
  function layout(){
    var w=mount.clientWidth||innerWidth,h=mount.clientHeight||innerHeight;
    renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
    tgt=pose(w);
  }
  layout();addEventListener('resize',layout);

  var t0=null,shave=-1;
  g.setDrawRange(0,0);
  (function anim(ts){
    requestAnimationFrame(anim);
    if(ts===undefined)return;
    if(t0===null)t0=ts;
    var el=(ts-t0)/1000;
    var p=Math.min(1,Math.max(0,(el-1.15)/1.9));p=1-Math.pow(1-p,3);
    if(p!==shave){shave=p;g.setDrawRange(0,Math.floor(STEPS*p)*6)}
    if(!drag){grp.rotation.y+=.0035+vel;vel*=.94}
    grp.rotation.x=-.5+Math.sin(el*.6)*.05;
    baseX+=(tgt.x-baseX)*.09; baseY+=(tgt.y-baseY)*.09; scaleBase+=(tgt.s-scaleBase)*.09;
    grp.position.x=baseX;
    grp.position.y=baseY+Math.sin(el*1.1)*.06;
    pulse+=(1-pulse)*.08;grp.scale.setScalar(scaleBase*pulse);
    mat.color.lerp(target,.06);
    var ap=pg.attributes.position;
    for(var q=1;q<PN*3;q+=3){ap.array[q]+=.0016;if(ap.array[q]>2.6)ap.array[q]=-2.6}
    ap.needsUpdate=true;
    renderer.render(scene,cam);
  })();
})();
})();
