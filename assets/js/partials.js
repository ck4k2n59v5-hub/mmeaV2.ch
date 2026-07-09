/* ════════════════════════════════════════════════════════════════════════
   MMEA — SOCLE PARTAGÉ v2 « Le Copeau »  (source unique)
   ────────────────────────────────────────────────────────────────────────
   👉 POUR MODIFIER LE MENU : tu modifies UNIQUEMENT la liste ci-dessous,
      exactement comme avant. Le reste (en-tête, menu plein écran, pied de
      page, curseur, visionneuse, essences) est géré automatiquement.

   Astuce : un élément SANS "href" (href: null) devient un simple intitulé
   non cliquable qui chapeaute ses sous-liens (ex. « Services »).
   ════════════════════════════════════════════════════════════════════════ */

var MMEA_MENU = [
  { label: "Savoir-faire", href: "/#savoir-faire" },
  { label: "Services", href: null, children: [
      { label: "Cuisines & agencements", href: "/services/cuisines-agencements/" },
      { label: "Escaliers",              href: "/services/escaliers/" },
      { label: "Portes & fenêtres",      href: "/services/portes-fenetres/" },
      { label: "Cloisons",               href: "/services/cloisons/" },
      { label: "Ébénisterie & mobilier", href: "/services/ebenisterie-mobilier/" },
      { label: "Menuiserie extérieure",  href: "/services/menuiserie-exterieure/" }
  ]},
  { label: "Réalisations", href: "/realisations/" },
  { label: "Précision", href: "/#precision" },
  { label: "L'atelier", href: "/#atelier"   },
  { label: "Contact",   href: "/#contact"   }
];
var MMEA_CTA = { label: "Devis gratuit", href: "/#contact" };

/* ════════ ⚙️ MOTEUR — pas besoin de toucher ce qui suit ════════ */
(function () {
  'use strict';
  function mq(q){ try{ return window.matchMedia && window.matchMedia(q).matches }catch(e){ return false } }
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var fine    = mq('(pointer: fine)');
  var root    = document.documentElement;

  /* ----- 0. Emblème : le copeau (logo D « la virgule ») ------------------ */
  if (!document.getElementById('copeau')) {
    var sprite = document.createElementNS('http://www.w3.org/2000/svg','svg');
    sprite.setAttribute('aria-hidden','true');
    sprite.setAttribute('style','position:absolute;width:0;height:0;overflow:hidden');
    sprite.innerHTML = '<defs>'
      + '<symbol id="copeau" viewBox="0 0 33.7 35.4"><path d="M 3.00,24.78 L 3.68,24.78 L 4.37,24.78 L 5.05,24.78 L 5.74,24.78 L 6.42,24.78 L 7.11,24.78 L 7.79,24.78 L 8.47,24.78 L 9.16,24.78 L 9.84,24.78 L 10.53,24.78 L 11.21,24.78 L 11.89,24.78 L 12.58,24.78 L 13.26,24.78 L 13.95,24.78 L 14.63,24.78 L 15.32,24.78 L 15.74,24.79 L 16.23,24.74 L 16.82,24.66 L 17.38,24.54 L 17.94,24.39 L 18.48,24.21 L 19.00,23.99 L 19.51,23.75 L 19.99,23.47 L 20.46,23.17 L 20.90,22.84 L 21.32,22.48 L 21.72,22.10 L 22.09,21.70 L 22.43,21.28 L 22.74,20.84 L 23.02,20.38 L 23.28,19.91 L 23.50,19.42 L 23.69,18.93 L 23.84,18.43 L 23.97,17.92 L 24.06,17.40 L 24.12,16.89 L 24.15,16.37 L 24.14,15.86 L 24.10,15.35 L 24.03,14.84 L 23.93,14.35 L 23.80,13.86 L 23.64,13.38 L 23.45,12.92 L 23.24,12.48 L 22.99,12.04 L 22.72,11.63 L 22.43,11.24 L 22.12,10.87 L 21.78,10.52 L 21.42,10.19 L 21.05,9.89 L 20.66,9.62 L 20.26,9.37 L 19.84,9.15 L 19.41,8.95 L 18.97,8.79 L 18.53,8.65 L 18.08,8.54 L 17.62,8.46 L 17.17,8.41 L 16.71,8.39 L 16.26,8.39 L 15.81,8.43 L 15.36,8.49 L 14.93,8.58 L 14.50,8.70 L 14.08,8.84 L 13.67,9.01 L 13.28,9.21 L 12.90,9.42 L 12.54,9.66 L 12.20,9.92 L 11.87,10.20 L 11.57,10.50 L 11.28,10.81 L 11.02,11.14 L 10.78,11.48 L 10.56,11.84 L 10.37,12.21 L 10.20,12.58 L 10.06,12.97 L 9.94,13.36 L 9.85,13.75 L 9.78,14.15 L 9.74,14.55 L 9.73,14.95 L 9.74,15.34 L 9.77,15.74 L 9.83,16.12 L 9.91,16.50 L 10.02,16.88 L 10.14,17.24 L 10.29,17.59 L 10.46,17.93 L 10.65,18.26 L 10.86,18.57 L 11.09,18.87 L 11.34,19.15 L 11.60,19.41 L 11.87,19.65 L 12.16,19.88 L 12.46,20.08 L 12.77,20.27 L 13.09,20.43 L 13.42,20.57 L 13.75,20.69 L 14.09,20.79 L 14.43,20.86 L 14.77,20.92 L 15.11,20.95 L 15.46,20.96 L 15.80,20.95 L 16.13,20.91 L 16.47,20.86 L 16.79,20.79 L 17.11,20.69 L 17.42,20.58 L 17.72,20.45 L 18.01,20.29 L 18.28,20.13 L 18.55,19.94 L 18.80,19.75 L 19.03,19.53 L 19.25,19.31 L 19.46,19.07 L 19.64,18.83 L 19.81,18.57 L 19.97,18.30 L 20.10,18.03 L 20.21,17.75 L 20.31,17.47 L 20.39,17.18 L 20.45,16.89 L 20.49,16.60 L 20.51,16.31 L 20.51,16.02 L 20.49,15.73 L 20.46,15.45 L 20.41,15.17 L 20.34,14.90 L 20.26,14.64 L 20.15,14.38 L 20.04,14.13 L 19.91,13.89 L 19.76,13.67 L 19.60,13.45 L 19.43,13.25 L 19.25,13.06 L 19.06,12.88 L 18.86,12.71 L 18.65,12.57 L 18.43,12.43 L 18.21,12.31 L 17.98,12.21 L 17.75,12.12 L 17.51,12.05 L 17.27,11.99 L 17.03,11.95 L 16.79,11.93 L 16.55,11.92 L 16.32,11.93 L 16.07,11.95 L 14.76,11.82 L 15.93,11.20 L 16.19,11.13 L 16.48,11.07 L 16.77,11.03 L 17.07,11.01 L 17.38,11.01 L 17.69,11.03 L 18.00,11.07 L 18.31,11.13 L 18.63,11.22 L 18.94,11.33 L 19.25,11.46 L 19.56,11.61 L 19.85,11.78 L 20.14,11.98 L 20.43,12.20 L 20.70,12.44 L 20.95,12.70 L 21.19,12.98 L 21.42,13.28 L 21.63,13.59 L 21.82,13.93 L 21.99,14.28 L 22.14,14.65 L 22.27,15.03 L 22.37,15.42 L 22.45,15.82 L 22.50,16.23 L 22.52,16.65 L 22.52,17.08 L 22.49,17.51 L 22.43,17.94 L 22.34,18.37 L 22.23,18.80 L 22.08,19.23 L 21.91,19.65 L 21.70,20.06 L 21.47,20.46 L 21.21,20.86 L 20.92,21.23 L 20.60,21.60 L 20.26,21.94 L 19.89,22.27 L 19.50,22.57 L 19.09,22.85 L 18.65,23.11 L 18.19,23.33 L 17.72,23.54 L 17.23,23.71 L 16.72,23.85 L 16.20,23.96 L 15.67,24.04 L 15.13,24.08 L 14.59,24.09 L 14.04,24.06 L 13.48,24.00 L 12.93,23.90 L 12.38,23.77 L 11.84,23.60 L 11.30,23.39 L 10.77,23.14 L 10.25,22.86 L 9.75,22.55 L 9.27,22.20 L 8.81,21.82 L 8.36,21.40 L 7.94,20.95 L 7.55,20.48 L 7.19,19.97 L 6.85,19.44 L 6.55,18.89 L 6.28,18.31 L 6.05,17.71 L 5.86,17.09 L 5.70,16.46 L 5.58,15.81 L 5.51,15.15 L 5.47,14.48 L 5.48,13.81 L 5.53,13.13 L 5.63,12.46 L 5.77,11.78 L 5.95,11.11 L 6.18,10.45 L 6.45,9.80 L 6.76,9.17 L 7.12,8.55 L 7.52,7.95 L 7.96,7.37 L 8.44,6.82 L 8.95,6.30 L 9.50,5.80 L 10.09,5.34 L 10.71,4.92 L 11.35,4.53 L 12.03,4.18 L 12.73,3.88 L 13.46,3.61 L 14.20,3.39 L 14.97,3.22 L 15.74,3.10 L 16.53,3.02 L 17.33,3.00 L 18.13,3.03 L 18.93,3.10 L 19.74,3.23 L 20.53,3.41 L 21.32,3.65 L 22.10,3.93 L 22.86,4.27 L 23.61,4.65 L 24.33,5.09 L 25.03,5.57 L 25.70,6.10 L 26.34,6.67 L 26.95,7.29 L 27.52,7.94 L 28.05,8.64 L 28.54,9.38 L 28.98,10.14 L 29.38,10.94 L 29.72,11.77 L 30.02,12.62 L 30.26,13.49 L 30.45,14.39 L 30.58,15.30 L 30.65,16.22 L 30.67,17.14 L 30.62,18.08 L 30.52,19.01 L 30.36,19.94 L 30.14,20.87 L 29.85,21.78 L 29.51,22.68 L 29.12,23.56 L 28.66,24.41 L 28.15,25.25 L 27.58,26.05 L 26.96,26.82 L 26.29,27.55 L 25.57,28.24 L 24.81,28.89 L 24.00,29.49 L 23.15,30.05 L 22.26,30.55 L 21.34,31.00 L 20.39,31.39 L 19.41,31.72 L 18.40,32.00 L 17.39,32.21 L 16.26,32.37 L 15.32,32.38 L 14.63,32.38 L 13.95,32.38 L 13.26,32.38 L 12.58,32.38 L 11.89,32.38 L 11.21,32.38 L 10.53,32.38 L 9.84,32.38 L 9.16,32.38 L 8.47,32.38 L 7.79,32.38 L 7.11,32.38 L 6.42,32.38 L 5.74,32.38 L 5.05,32.38 L 4.37,32.38 L 3.68,32.38 L 3.00,32.38 Z" fill="currentColor"/></symbol>'
      + '<symbol id="fleche" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>'
      + '</defs>';
    document.body.appendChild(sprite);
  }

  /* ----- 1. Essences : l'accent du site, mémorisé de page en page -------- */
  var ESS = {
    chene :{ acc:'#D99C55', deep:'#B5824A', ink:'#8A6132', c:0xD99C55 },
    noyer :{ acc:'#B47A45', deep:'#8A5A33', ink:'#74492A', c:0x8F5F35 },
    frene :{ acc:'#E3C283', deep:'#C6A15C', ink:'#7E6428', c:0xE0BC7F },
    meleze:{ acc:'#D08A52', deep:'#A9683A', ink:'#8B5630', c:0xC98450 }
  };
  var essCbs = [];
  function getEssence(){
    try { var k = localStorage.getItem('mmea-essence'); if (ESS[k]) return k; } catch(e){}
    return 'chene';
  }
  function setEssence(k){
    var v = ESS[k]; if (!v) return;
    root.style.setProperty('--acc', v.acc);
    root.style.setProperty('--acc-deep', v.deep);
    root.style.setProperty('--acc-ink', v.ink);
    try { localStorage.setItem('mmea-essence', k); } catch(e){}
    document.querySelectorAll('[data-ess]').forEach(function(c){
      c.setAttribute('aria-pressed', c.getAttribute('data-ess') === k ? 'true' : 'false');
    });
    essCbs.forEach(function(cb){ try{ cb(k, v); }catch(e){} });
  }
  window.MMEA = {
    setEssence: setEssence,
    getEssence: getEssence,
    essences: ESS,
    onEssence: function(cb){ essCbs.push(cb); }
  };

  /* ----- 2. En-tête + menu plein écran + pied de page -------------------- */
  var liens = MMEA_MENU.map(function (m, i) {
    var kids = '';
    if (m.children) {
      kids = '<div class="p-kids">' + m.children.map(function (c, ci) {
        return '<a href="' + c.href + '" style="--k:' + ci + '">' + c.label + '</a>';
      }).join('') + '</div>';
    }
    var num = (i + 1 < 10 ? '0' : '') + (i + 1);
    /* href renseigné → lien ; href absent/null → simple intitulé de groupe */
    var big = m.href
      ? '<a class="big" style="--i:' + i + '" href="' + m.href + '"><small>' + num + '</small>' + m.label + '</a>'
      : '<span class="big is-label" style="--i:' + i + '"><small>' + num + '</small>' + m.label + '</span>';
    return '<div class="p-item">' + big + kids + '</div>';
  }).join('');

  var headerHTML =
    '<header id="hd">' +
      '<nav class="nav wrap" aria-label="Navigation principale">' +
        '<a class="brand" href="/" aria-label="MORET — Menuiserie et Agencement, accueil">' +
          '<svg viewBox="0 0 33.7 35.4" aria-hidden="true"><use href="#copeau"/></svg><b>MORET</b>' +
        '</a>' +
        '<div class="nav-r">' +
          '<a class="pill" href="' + MMEA_CTA.href + '">' + MMEA_CTA.label + '</a>' +
          '<button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="panel">' +
            '<span class="lbl">Menu</span><span class="bars" aria-hidden="true"><span></span><span></span></span>' +
          '</button>' +
        '</div>' +
      '</nav>' +
    '</header>' +
    '<div id="panel" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="inner">' + liens +
        '<div class="foot">' +
          '<a href="tel:+41797433721">079 743 37 21</a>' +
          '<a href="mailto:samuel.moret@moret-s.ch">samuel.moret@moret-s.ch</a>' +
          '<span>Moulin au Loup 4, 1169 Yens</span>' +
        '</div>' +
      '</div>' +
    '</div>';

  var footerHTML =
    '<footer>' +
      '<a class="big-cta" href="/#contact"><b>Parlons bois.</b><span>Devis gratuit — réponse rapide ' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#fleche"/></svg></span></a>' +
      '<div class="wrap foot">' +
        '<span>© <span id="yr">2026</span> MORET — Menuiserie &amp; Agencement · Moulin au Loup 4, 1169 Yens</span>' +
        '<span class="legal">' +
          '<a href="/">Accueil</a><a href="/realisations/">Réalisations</a><a href="/secteurs/">Secteurs</a>' +
          '<a href="/infos/mentions-legales/">Mentions légales</a><a href="/infos/protection-donnees/">Protection des données</a>' +
        '</span>' +
      '</div>' +
    '</footer>';

  var slot = document.getElementById('site-nav');
  if (slot) slot.innerHTML = headerHTML;
  else document.body.insertAdjacentHTML('afterbegin', headerHTML);
  var fslot = document.getElementById('site-footer');
  if (fslot) fslot.innerHTML = footerHTML;
  else document.body.insertAdjacentHTML('beforeend', footerHTML);

  setEssence(getEssence());

  /* ----- 3. Comportements de l'en-tête ----------------------------------- */
  var hd = document.getElementById('hd');
  function onSc(){ hd.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onSc, { passive: true }); onSc();

  var mb = document.getElementById('menuBtn');
  var panel = document.getElementById('panel');
  function setMenu(open){
    document.body.classList.toggle('menu-open', open);
    mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    var l = mb.querySelector('.lbl'); if (l) l.textContent = open ? 'Fermer' : 'Menu';
  }
  mb.addEventListener('click', function(){ setMenu(!document.body.classList.contains('menu-open')); });
  document.querySelectorAll('#panel a, header a').forEach(function(a){
    a.addEventListener('click', function(){ setMenu(false); });
  });
  panel.addEventListener('click', function(e){ if (!e.target.closest('a')) setMenu(false); });
  window.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });

  /* ----- 4. Curseur personnalisé (ordinateur) ---------------------------- */
  if (fine && !reduced) {
    var cur = document.createElement('div'); cur.id = 'cur'; cur.setAttribute('aria-hidden','true');
    document.body.appendChild(cur);
    var cx = innerWidth/2, cy = innerHeight/2, mx = cx, my = cy, shown = false;
    addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; if(!shown){shown=true;cur.classList.add('on');} }, {passive:true});
    addEventListener('mousedown', function(){ cur.classList.add('down'); });
    addEventListener('mouseup',   function(){ cur.classList.remove('down'); });
    document.addEventListener('mouseover', function(e){ if (e.target.closest('a,button,[data-hot],input,select,textarea,.proj,.slide')) cur.classList.add('hot'); });
    document.addEventListener('mouseout',  function(e){ if (e.target.closest('a,button,[data-hot],input,select,textarea,.proj,.slide')) cur.classList.remove('hot'); });
    (function loop(){ cx+=(mx-cx)*.22; cy+=(my-cy)*.22; cur.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
  }

  /* ----- 5. Révélations au défilement (+ filet de sécurité seuil 0) ------ */
  if ('IntersectionObserver' in window) {
    var show = function(el){ el.classList.add('in-view'); };
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ show(e.target); io.unobserve(e.target);} }); }, {threshold:.14, rootMargin:'0px 0px -6% 0px'});
    var safe = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ show(e.target); safe.unobserve(e.target);} }); }, {threshold:0, rootMargin:'0px 0px -10% 0px'});
    document.querySelectorAll('[data-io]').forEach(function(el){ io.observe(el); safe.observe(el); });
  } else {
    document.querySelectorAll('[data-io]').forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ----- 6. Compteurs, accordéons, boutons magnétiques ------------------- */
  function count(el){
    var n = parseFloat(el.getAttribute('data-n')), dec = parseInt(el.getAttribute('data-dec')||'0',10);
    var D = reduced ? 0 : 1300, t0 = null;
    function fmt(v){ return dec ? v.toFixed(dec).replace('.', ',') : String(Math.round(v)); }
    if (!D){ el.textContent = fmt(n); return; }
    (function st(t){ if(t===undefined){requestAnimationFrame(st);return;} if(!t0)t0=t; var p=Math.min(1,(t-t0)/D); p=1-Math.pow(1-p,3); el.textContent=fmt(n*p); if(p<1)requestAnimationFrame(st); })();
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ count(e.target); cio.unobserve(e.target);} }); }, {threshold:.4});
    document.querySelectorAll('[data-n]').forEach(function(el){ cio.observe(el); });
  } else { document.querySelectorAll('[data-n]').forEach(count); }

  var accs = [].slice.call(document.querySelectorAll('.acc'));
  accs.forEach(function(a){
    var h = a.querySelector('.acc-h'); if (!h) return;
    h.addEventListener('click', function(){
      var was = a.hasAttribute('data-open');
      accs.forEach(function(o){ o.removeAttribute('data-open'); var oh=o.querySelector('.acc-h'); if(oh)oh.setAttribute('aria-expanded','false'); });
      if (!was){ a.setAttribute('data-open',''); h.setAttribute('aria-expanded','true'); }
    });
  });

  if (fine && !reduced) {
    document.querySelectorAll('.mag').forEach(function(b){
      b.addEventListener('mousemove', function(e){
        var r=b.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
        b.style.transform='translate('+x*.18+'px,'+y*.22+'px)';
      });
      b.addEventListener('mouseleave', function(){ b.style.transform=''; });
    });
  }

  /* ----- 7. Visionneuse (photos & vidéos des réalisations) --------------- */
  document.body.insertAdjacentHTML('beforeend',
    '<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Visionneuse des réalisations" hidden>' +
      '<div class="lb-backdrop" id="lbBackdrop" aria-hidden="true"></div>' +
      '<div class="lb-head"><span class="lb-title" id="lbTitle"></span><span class="lb-count" id="lbCount"></span></div>' +
      '<div class="lb-media" id="lbMedia"></div><p class="lb-cap" id="lbCap"></p>' +
      '<button class="lb-btn lb-close" id="lbClose" type="button" aria-label="Fermer (Échap)">&#10005;</button>' +
      '<button class="lb-btn lb-prev" id="lbPrev" type="button" aria-label="Média précédent">&#8592;</button>' +
      '<button class="lb-btn lb-next" id="lbNext" type="button" aria-label="Média suivant">&#8594;</button>' +
    '</div>');
  var lb=document.getElementById('lb'), lbMedia=document.getElementById('lbMedia'),
      lbTitle=document.getElementById('lbTitle'), lbCount=document.getElementById('lbCount'),
      lbCap=document.getElementById('lbCap');
  var lbList=[], lbIdx=0, lbFrom=null;
  function ytId(u){ var m=String(u).match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{6,})/); return m?m[1]:''; }
  function renderLb(){
    var m=lbList[lbIdx]; if(!m) return;
    lbMedia.innerHTML='';
    if (m.video) {
      var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+ytId(m.href)+'?autoplay=1&rel=0';
      f.allow='autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen=true;
      lbMedia.appendChild(f);
    } else {
      var im=document.createElement('img'); im.src=m.href; im.alt=m.label||''; lbMedia.appendChild(im);
    }
    lbCap.textContent=m.label||'';
    lbCount.textContent=(lbIdx+1)+' / '+lbList.length;
  }
  function openLb(titre, medias, from){
    if (!medias.length) return;
    lbList=medias; lbIdx=0; lbFrom=from||null;
    lbTitle.textContent=titre||''; lb.hidden=false;
    document.body.classList.add('lock'); renderLb();
    document.getElementById('lbClose').focus();
  }
  function closeLb(){
    lb.hidden=true; lbMedia.innerHTML=''; document.body.classList.remove('lock');
    if (lbFrom && lbFrom.focus) lbFrom.focus();
  }
  function nav(d){ lbIdx=(lbIdx+d+lbList.length)%lbList.length; renderLb(); }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbBackdrop').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function(){ nav(-1); });
  document.getElementById('lbNext').addEventListener('click', function(){ nav(1); });
  window.addEventListener('keydown', function(e){
    if (lb.hidden) return;
    if (e.key==='Escape') closeLb();
    if (e.key==='ArrowLeft') nav(-1);
    if (e.key==='ArrowRight') nav(1);
  });
  function mediasOf(fig){
    return [].slice.call(fig.querySelectorAll('.proj-medias a')).map(function(a){
      return { href:a.getAttribute('href'), label:a.textContent, video:a.getAttribute('data-type')==='video' };
    });
  }
  document.addEventListener('click', function(e){
    var fig=e.target.closest('.proj,[data-lb]');
    if (!fig || e.target.closest('a:not(.proj-medias a)')) return;
    var titre=(fig.querySelector('h3,b')||{}).textContent||'';
    openLb(titre, mediasOf(fig), fig);
  });
  window.MMEA.openLb = openLb;

  /* ----- 8. Année courante ------------------------------------------------ */
  var yr=document.getElementById('yr'); if (yr) yr.textContent=new Date().getFullYear();
})();
