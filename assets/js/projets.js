/* ════════════════════════════════════════════════════════════════════════
   MMEA — PROJETS / RÉALISATIONS (source unique)
   ────────────────────────────────────────────────────────────────────────
   👉 TU N'ENCODES CHAQUE PROJET QU'UNE SEULE FOIS, ICI.
      • La page Réalisations affiche TOUS les projets.
      • L'accueil affiche UNIQUEMENT ceux marqués  vedette: true.
      Plus besoin de recopier quoi que ce soit d'une page à l'autre.

   ────────────────────────────────────────────────────────────────────────
   COMMENT AJOUTER UN PROJET :
   Copie un bloc { ... } complet, colle-le, et adapte les valeurs :

     {
       titre   : "Nom du projet",              // titre affiché
       lieu    : "Type — Commune",             // petite ligne sous le titre
       cat     : "cuisine",                    // catégorie pour le filtre (voir liste plus bas)
       vedette : true,                         // true = apparaît AUSSI sur l'accueil
       cover   : "/assets/img/realisations/projet-XX.webp",  // la photo de la vignette
       alt     : "Description courte de la photo",       // texte pour l'accessibilité/SEO
       medias  : [                             // les photos/vidéos vues en grand au clic
         { href: "/assets/img/realisations/projet-XX.webp", label: "Vue d'ensemble" }
          { href: "Lien youtube", label: "Vue d'ensemble" } -> pour vidéos youtubes
       ]
     },

   • Plusieurs photos : ajoute des lignes dans "medias".
   • Une vidéo YouTube : { href: "https://youtu.be/CODE", label: "...", video: true }
   • CATÉGORIES possibles pour "cat" (doivent correspondre aux boutons du filtre) :
       "cuisine"  "escalier"  "porte"  "cloison"  "ebenisterie"  "exterieur"

   ⚠️ Détail technique : garde bien les virgules entre chaque bloc { } et
      chaque ligne de "medias". C'est la seule chose à laquelle faire attention.
   ════════════════════════════════════════════════════════════════════════ */

var MMEA_PROJETS = [

  {
    titre   : "Scène sur mesure",
    lieu    : "Sur mesure — Romainmôtier",
    cat     : "cuisine",
    vedette : true,
    cover   : "/assets/img/realisations/romainmotier-scene/01.webp",
    alt     : "Scène sur mesure",
    medias  : [
      { href: "/assets/img/realisations/romainmotier-scene/01.webp", label: "Scène" },
      { href: "/assets/img/realisations/romainmotier-scene/02.webp", label: "Scène et tiroirs" },
      { href: "/assets/img/realisations/romainmotier-scene/03.webp", label: "Scène vue d'ensemble" },
      { href: "/assets/img/realisations/romainmotier-scene/04.webp", label: "Scène et rangements" }
      // ,{ href: "/assets/img/realisations/romainmotier/romainmotier-01-detail.webp", label: "Détail" }
    ]
  },

  {
    titre   : "Armoire d'entrée",
    lieu    : "Sur mesure - Romainmôtier",
    cat     : "ebenisterie",
    vedette : true,
    cover   : "/assets/img/realisations/romainmotier-armoire/01.webp",
    alt     : "Armoire d'entrée",
    medias  : [
      { href: "/assets/img/realisations/romainmotier-armoire/01.webp", label: "Vue d'ensemble" },
      { href: "/assets/img/realisations/romainmotier-armoire/02.webp", label: "Rapprochement" },
      { href: "/assets/img/realisations/romainmotier-armoire/03.webp", label: "Détail" },
      { href: "/assets/img/realisations/romainmotier-armoire/04.webp", label: "Armoire" },
      { href: "/assets/img/realisations/romainmotier-armoire/05.webp", label: "Détail" }
    ]
  },

  {
    titre   : "Bar & comptoir sur mesure",
    lieu    : "Sur mesure - Romainmôtier",
    cat     : "cuisine",
    vedette : true,
    cover   : "/assets/img/realisations/romainmotier-bar/01.webp",
    alt     : "Bar & comptoir sur mesure",
    medias  : [
      { href: "/assets/img/realisations/romainmotier-bar/01.webp", label: "Vue d'ensemble" },
      { href: "/assets/img/realisations/romainmotier-bar/02.webp", label: "Bar & comptoir" },
      { href: "/assets/img/realisations/romainmotier-bar/03.webp", label: "Côté gauche" }
    ]
  },

  {
    titre   : "Dressing & rangements",
    lieu    : "Sur mesure — Etoy",
    cat     : "cuisine",
    vedette : true,
    cover   : "/assets/img/realisations/projet-04.webp",
    alt     : "Dressing et rangements sur mesure",
    medias  : [
      { href: "/assets/img/realisations/projet-04.webp", label: "Vue d'ensemble" }
    ]
  },

  {
    titre   : "Porte d'entrée & fenêtres",
    lieu    : "Menuiserie ext. — Saint-Prex",
    cat     : "porte",
    vedette : true,
    cover   : "/assets/img/realisations/projet-05.webp",
    alt     : "Porte d'entrée en bois et fenêtres",
    medias  : [
      { href: "/assets/img/realisations/projet-05.webp", label: "Vue d'ensemble" }
    ]
  },

  {
    titre   : "Cloisons vitrées",
    lieu    : "Agencement de bureaux — Lausanne",
    cat     : "cloison",
    vedette : true,
    cover   : "/assets/img/realisations/projet-06.webp",
    alt     : "Cloisons vitrées d'open-space",
    medias  : [
      { href: "/assets/img/realisations/projet-06.webp", label: "Vue d'ensemble" }
    ]
  },

  {
    titre   : "Cuisine en chêne massif",
    lieu    : "Agencement — Yens",
    cat     : "cuisine",
    vedette : false,
    cover   : "/assets/img/realisations/projet-07.webp",
    alt     : "Cuisine en chêne massif",
    medias  : [
      { href: "/assets/img/realisations/projet-07.webp", label: "Vue d'ensemble" }
    ]
  },

  {
    titre   : "Escalier droit contemporain",
    lieu    : "Bois & métal — Morges",
    cat     : "escalier",
    vedette : false,
    cover   : "/assets/img/realisations/projet-08.webp",
    alt     : "Escalier droit contemporain",
    medias  : [
      { href: "/assets/img/realisations/projet-08.webp", label: "Vue d'ensemble" }
    ]
  },

  {
    titre   : "Cloison coupe-feu certifiée",
    lieu    : "Bâtiment public — Vaud",
    cat     : "cloison",
    vedette : false,
    cover   : "/assets/img/realisations/projet-09.webp",
    alt     : "Cloison coupe-feu certifiée",
    medias  : [
      { href: "/assets/img/realisations/projet-09.webp", label: "Vue d'ensemble" }
    ]
  },

  {
    titre   : "Couvert & abri de jardin",
    lieu    : "Menuiserie ext. — Aubonne",
    cat     : "exterieur",
    vedette : false,
    cover   : "/assets/img/realisations/projet-10.webp",
    alt     : "Couvert et abri de jardin",
    medias  : [
      { href: "/assets/img/realisations/projet-10.webp", label: "Vue d'ensemble" }
    ]
  },

  {
    titre   : "Meuble TV sur mesure",
    lieu    : "Ébénisterie — Etoy",
    cat     : "ebenisterie",
    vedette : false,
    cover   : "/assets/img/realisations/projet-11.webp",
    alt     : "Meuble TV sur mesure",
    medias  : [
      { href: "/assets/img/realisations/projet-11.webp", label: "Vue d'ensemble" }
    ]
  },

  {
    titre   : "Portes intérieures",
    lieu    : "Menuiserie int. — Lausanne",
    cat     : "porte",
    vedette : false,
    cover   : "/assets/img/realisations/projet-12.webp",
    alt     : "Portes intérieures",
    medias  : [
      { href: "/assets/img/realisations/projet-12.webp", label: "Vue d'ensemble" }
    ]
  }

];


/* ════════════════════════════════════════════════════════════════════════
   ⚙️  MOTEUR — tu n'as normalement pas besoin de toucher ce qui suit.
   Il transforme la liste ci-dessus en vignettes, exactement dans le même
   format que ton site (visionneuse photo, filtre, animations conservés).
   ════════════════════════════════════════════════════════════════════════ */
(function () {

  function echappe(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Génère le HTML d'un projet (une <figure>) identique à l'original.
  function figure(p, numero, vedette) {
    var rv = vedette ? ' rv' : '';
    var styleI = vedette ? ' style="--i:' + numero + '"' : '';
    var num = (numero < 10 ? '0' : '') + numero;

    var liens = (p.medias || []).map(function (m) {
      var attr = m.video ? ' data-type="video"' : '';
      return '<a href="' + echappe(m.href) + '"' + attr + '>' + echappe(m.label) + '</a>';
    }).join('');

    return '' +
      '<figure class="proj' + rv + '"' + styleI + ' data-cat="' + echappe(p.cat) + '">' +
        '<div class="proj-img">' +
          '<img src="' + echappe(p.cover) + '" alt="' + echappe(p.alt) + '" loading="lazy" onerror="this.remove()"/>' +
          '<span class="proj-ph" aria-hidden="true"><svg viewBox="0 0 74 65"><use href="#copeau"/></svg>Visuel à venir — ' + num + '</span>' +
        '</div>' +
        '<figcaption><h3>' + echappe(p.titre) + '</h3><p>' + echappe(p.lieu) + '</p></figcaption>' +
        '<div class="proj-medias" hidden>' + liens + '</div>' +
      '</figure>';
  }

  // Remplit chaque conteneur portant l'attribut data-projets.
  //   data-projets="vedette" → uniquement les projets vedette (accueil)
  //   data-projets="all"     → tous les projets (page Réalisations)
  document.querySelectorAll('[data-projets]').forEach(function (grille) {
    var mode = grille.getAttribute('data-projets');
    var liste = (mode === 'vedette')
      ? MMEA_PROJETS.filter(function (p) { return p.vedette; })
      : MMEA_PROJETS;

    grille.innerHTML = liste.map(function (p, i) {
      return figure(p, i + 1, mode === 'vedette');
    }).join('');
  });

  /* ────────────────────────────────────────────────────────────────────────
     FILET DE SÉCURITÉ — révélation des vignettes de l'accueil
     ────────────────────────────────────────────────────────────────────────
     Sur l'accueil, les vignettes « vedette » démarrent invisibles (opacity:0)
     et se révèlent quand la section « Réalisations » entre à l'écran.
     L'observateur principal de la page exige que ~22 % de la section soit
     visible d'un coup. En affichage 1 colonne (demi-écran / mobile), la section
     empilée est si haute que ce seuil n'est jamais atteint → les projets
     restaient invisibles. Ici on révèle avec un seuil de 0 (dès qu'un bord
     apparaît), donc quelle que soit la hauteur. Sans effet sur l'affichage en
     2 ou 3 colonnes, ni sur la page Réalisations (pas de vignettes « rv »).
     ──────────────────────────────────────────────────────────────────────── */
  document.querySelectorAll('[data-projets]').forEach(function (grille) {
    if (!grille.querySelector('.rv')) return;               // accueil uniquement
    var sect = grille.closest('.io') || grille.closest('[data-io]') || grille;
    var reveal = function () { sect.classList.add('in-view'); };
    if (!('IntersectionObserver' in window)) { reveal(); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(); obs.disconnect(); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    obs.observe(sect);
  });

})();
