/* ════════════════════════════════════════════════════════════════════════
   MMEA — LE MEUBLE TÉMOIN EN 3D  (section « Précision » de l'accueil)
   ────────────────────────────────────────────────────────────────────────
   Un vrai meuble que le visiteur fait pivoter à la main. Sa teinte suit
   l'essence choisie (mêmes boutons que « l'établi des essences » en haut
   de page — un seul réglage pour tout le site, mémorisé de page en page).

   👉 POUR AJUSTER, tu modifies UNIQUEMENT le bloc MMEA_MEUBLE ci-dessous :
      • modele   : le fichier 3D (.glb) affiché. Pour en changer, dépose le
                   nouveau fichier dans assets/models/ et adapte le chemin.
      • teintes  : la couleur bois de chaque essence (codes hexadécimaux).
                   Le veinage d'origine est conservé, seule la teinte change.
      • contraste / lumiere : réglage fin de la recoloration
                   (plus de contraste = veinage plus marqué ;
                    plus de lumière = bois globalement plus clair).
      • vitesse  : rotation automatique quand on ne touche à rien
                   (0 pour la désactiver complètement).
      • porte    : l'animation de la porte coulissante.
                   – noeud : le nom de la pièce mobile dans le fichier 3D
                   – sens  : 1 = glisse vers la droite, -1 = vers la gauche
                   – course: portion de la largeur de porte parcourue (0 à 1)
                   – duree : durée de la glissade, en millisecondes
                   Mets  porte: null  pour désactiver la porte (le bouton
                   « Ouvrir la porte » disparaît alors tout seul).
   Le reste (chargement, lumières, cadrage, tactile) est géré automatiquement.
   ════════════════════════════════════════════════════════════════════════ */

var MMEA_MEUBLE = {
  modele: '/assets/models/meuble-temoin.glb',
  teintes: {
    chene : '#C7935B',
    noyer : '#6B4830',
    frene : '#E5D2A6',
    meleze: '#BE7D46'
  },
  contraste: 1.0,
  lumiere: 0.05,
  vitesse: 0.0032,
  porte: { noeud: 'modern_wooden_cabinet_door_l', sens: 1, course: 0.96, duree: 850 }
};

/* ════════ ⚙️ MOTEUR — pas besoin de toucher ce qui suit ════════ */
(function () {
  'use strict';

  var stage = document.getElementById('m3dStage');
  if (!stage) return;                                     /* pas de section sur cette page */

  var note    = document.getElementById('m3dNote');
  var btnP    = document.getElementById('m3dPorte');
  function mq(q){ try{ return window.matchMedia && window.matchMedia(q).matches }catch(e){ return false } }
  var reduced = mq('(prefers-reduced-motion: reduce)');

  function ko(msg){ if (note) note.textContent = msg; }

  /* — démarrage paresseux : on ne construit la scène qu'à l'approche — */
  var started = false, visible = true;
  function tryInit(){
    if (started) return; started = true;
    if (!window.THREE || !THREE.GLTFLoader) { ko('Le meuble 3D n\u2019a pas pu se charger.'); return; }
    try { init(); } catch (e) { ko('Le meuble 3D n\u2019a pas pu se charger.'); }
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ visible = e.isIntersecting; if (e.isIntersecting) tryInit(); });
    }, { rootMargin: '600px 0px' });
    io.observe(stage);
  } else { tryInit(); }

  function init(){
    /* — rendu — */
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) { ko('Votre navigateur ne permet pas la 3D (WebGL).'); return; }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    stage.insertBefore(renderer.domElement, note || null);

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, stage.clientWidth / Math.max(1, stage.clientHeight), .1, 100);

    /* — lumières : hémisphère chaude + clef + liseré couleur d'essence — */
    scene.add(new THREE.HemisphereLight(0xFFEFD8, 0x201509, .95));
    var clef = new THREE.DirectionalLight(0xFFE6C4, 1.25); clef.position.set(2.2, 2.6, 3);   scene.add(clef);
    var rim  = new THREE.DirectionalLight(0xD99C55, .55);  rim.position.set(-2.5, 1.6, -2.6); scene.add(rim);

    var pivot = new THREE.Group(); scene.add(pivot);

    /* — état d'interaction — */
    var rotY = -0.55, tilt = 0.10, velY = 0;
    var dragging = false, px = 0, py = 0, idleT = 0;
    var pending = 0;                                       /* images à rendre « à la demande » */

    /* — porte coulissante — */
    var porte = null, pOuvre = false, pFrom = 0, pTo = 0, pT0 = -1, pVal = 0;
    var P = MMEA_MEUBLE.porte;

    /* — recoloration : veinage conservé, teinte par essence — */
    var mats = [], lum = null, lw = 0, lh = 0, texCache = {}, srcTex = null;
    function collecte(objet){
      objet.traverse(function(o){
        if (!o.isMesh) return;
        (Array.isArray(o.material) ? o.material : [o.material]).forEach(function(m){
          if (m && mats.indexOf(m) === -1) mats.push(m);
        });
      });
    }
    function prepareLum(){
      if (lum) return true;
      var m0 = null;
      for (var i = 0; i < mats.length; i++) if (mats[i].map && mats[i].map.image) { m0 = mats[i]; break; }
      if (!m0) return false;
      try {
        srcTex = m0.map;
        var img = srcTex.image;
        lw = Math.min(1024, img.width || 1024); lh = Math.min(1024, img.height || 1024);
        var c = document.createElement('canvas'); c.width = lw; c.height = lh;
        var x = c.getContext('2d'); x.drawImage(img, 0, 0, lw, lh);
        var d = x.getImageData(0, 0, lw, lh).data;
        lum = new Float32Array(lw * lh);
        for (var p = 0, j = 0; p < d.length; p += 4, j++) {
          lum[j] = (d[p] * .2126 + d[p + 1] * .7152 + d[p + 2] * .0722) / 255;
        }
        return true;
      } catch (e) { lum = null; return false; }
    }
    function hexRVB(h){
      var n = parseInt(String(h).replace('#', ''), 16);
      return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
    }
    function textureEssence(k){
      if (texCache[k]) return texCache[k];
      if (!prepareLum()) return null;
      var t = hexRVB(MMEA_MEUBLE.teintes[k] || MMEA_MEUBLE.teintes.chene);
      var C = MMEA_MEUBLE.contraste, L = MMEA_MEUBLE.lumiere;
      var c = document.createElement('canvas'); c.width = lw; c.height = lh;
      var x = c.getContext('2d'), im = x.createImageData(lw, lh), d = im.data;
      for (var j = 0, p = 0; j < lum.length; j++, p += 4) {
        var v = Math.pow(lum[j], .92) * C + L;
        d[p]     = Math.min(255, Math.max(0, t[0] * v * 255));
        d[p + 1] = Math.min(255, Math.max(0, t[1] * v * 255));
        d[p + 2] = Math.min(255, Math.max(0, t[2] * v * 255));
        d[p + 3] = 255;
      }
      x.putImageData(im, 0, 0);
      var tex = new THREE.CanvasTexture(c);
      tex.flipY = false;                                   /* convention glTF */
      tex.encoding = THREE.sRGBEncoding;
      if (srcTex) { tex.wrapS = srcTex.wrapS; tex.wrapT = srcTex.wrapT; }
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;
      texCache[k] = tex;
      return tex;
    }
    function teinte(k){
      var tex = textureEssence(k);
      if (tex) mats.forEach(function(m){ if (m.map) m.map = tex; });
      else {                                               /* repli : simple voile de couleur */
        var t = hexRVB(MMEA_MEUBLE.teintes[k] || MMEA_MEUBLE.teintes.chene);
        mats.forEach(function(m){ if (m.color) m.color.setRGB(.35 + t[0] * .65, .35 + t[1] * .65, .35 + t[2] * .65); });
      }
      if (window.MMEA && MMEA.essences[k]) rim.color.set(MMEA.essences[k].acc);
      pending = 3;
    }

    /* — chargement du meuble — */
    new THREE.GLTFLoader().load(MMEA_MEUBLE.modele, function(gltf){
      var modele = gltf.scene;
      collecte(modele);

      /* centrage + cadrage caméra d'après la boîte englobante */
      var boite = new THREE.Box3().setFromObject(modele);
      var centre = boite.getCenter(new THREE.Vector3());
      var taille = boite.getSize(new THREE.Vector3());
      modele.position.sub(centre);
      pivot.add(modele);
      var maxDim = Math.max(taille.x, taille.y * 1.25, taille.z);
      var dist = (maxDim / 2) / Math.tan(camera.fov * Math.PI / 360) * 1.24;
      camera.near = dist / 20; camera.far = dist * 8;
      camera.position.set(0, taille.y * .06, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      /* porte coulissante (si la pièce existe dans le fichier) */
      if (P && P.noeud) {
        var n = modele.getObjectByName(P.noeud);
        if (n) {
          var bb = new THREE.Box3().setFromObject(n);
          porte = { n: n, x0: n.position.x, amp: (bb.max.x - bb.min.x) * (P.course || .96) * (P.sens || 1) };
          if (btnP) {
            btnP.hidden = false;
            btnP.addEventListener('click', function(){
              pOuvre = !pOuvre;
              btnP.textContent = pOuvre ? 'Fermer la porte' : 'Ouvrir la porte';
              pFrom = pVal; pTo = pOuvre ? 1 : 0; pT0 = performance.now();
              if (window.MMEA_COPEAU) MMEA_COPEAU.kick(.06);
            });
          }
        }
      }

      /* teinte de départ + suivi des essences (socle partials.js) */
      teinte(window.MMEA ? MMEA.getEssence() : 'chene');
      if (window.MMEA) MMEA.onEssence(function(k){ teinte(k); });

      stage.classList.add('pret');
      idleT = performance.now();
      pending = 3;
    }, undefined, function(){ ko('Le meuble 3D n\u2019a pas pu se charger.'); });

    /* — pivoter à la main (souris, doigt, clavier) — */
    stage.addEventListener('pointerdown', function(e){
      dragging = true; px = e.clientX; py = e.clientY;
      stage.classList.add('drag');
      if (stage.setPointerCapture) { try { stage.setPointerCapture(e.pointerId); } catch (_){} }
    });
    stage.addEventListener('pointermove', function(e){
      if (!dragging) return;
      var r = stage.getBoundingClientRect();
      var dx = (e.clientX - px) / Math.max(1, r.width);
      var dy = (e.clientY - py) / Math.max(1, r.height);
      px = e.clientX; py = e.clientY;
      velY = dx * Math.PI * 1.15;
      rotY += velY;
      tilt = Math.min(.5, Math.max(-.12, tilt + dy * 1.4));
      idleT = performance.now();
    });
    function lache(){ dragging = false; stage.classList.remove('drag'); idleT = performance.now(); }
    stage.addEventListener('pointerup', lache);
    stage.addEventListener('pointercancel', lache);
    stage.addEventListener('keydown', function(e){
      if (e.key === 'ArrowLeft')  { velY = -.045; idleT = performance.now(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { velY =  .045; idleT = performance.now(); e.preventDefault(); }
    });

    /* — redimensionnement — */
    function taillePlateau(){
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      pending = 2;
    }
    if ('ResizeObserver' in window) new ResizeObserver(taillePlateau).observe(stage);
    else window.addEventListener('resize', taillePlateau);

    /* — boucle : rendu uniquement quand il se passe quelque chose — */
    function easeIO(t){ return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    (function boucle(t){
      requestAnimationFrame(boucle);
      if (t === undefined) return;

      var auto = !reduced && MMEA_MEUBLE.vitesse > 0 && !dragging && (t - idleT) > 2600;
      if (auto) rotY += MMEA_MEUBLE.vitesse * Math.min(1, (t - idleT - 2600) / 1200);
      if (!dragging) { rotY += velY; velY *= .90; if (Math.abs(velY) < .00012) velY = 0; }

      var portesBouge = false;
      if (porte && pT0 >= 0) {
        var k = reduced ? 1 : Math.min(1, (t - pT0) / Math.max(1, P.duree || 850));
        pVal = pFrom + (pTo - pFrom) * easeIO(k);
        porte.n.position.x = porte.x0 + porte.amp * pVal;
        if (k >= 1) pT0 = -1; else portesBouge = true;
      }

      pivot.rotation.y = rotY;
      pivot.rotation.x = tilt;

      if (visible && (auto || dragging || velY !== 0 || portesBouge || pending > 0)) {
        if (pending > 0) pending--;
        renderer.render(scene, camera);
      }
    })();
  }
})();
