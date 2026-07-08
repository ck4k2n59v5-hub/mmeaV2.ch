# -*- coding: utf-8 -*-
"""
Génère les pages "secteurs" (référencement local) pour MMEA.
Design system « Le Copeau » : tête sombre + /assets/css/atelier.css partagé.
Cible : nouvelle arborescence  secteurs/<slug>/index.html  +  secteurs/index.html (hub)

▶ Pour AJOUTER un secteur : ajoute une entrée dans SECTEURS (+ un texte dans INTROS)
  puis relance ce script.

MàJ :
  · Espacement vertical revu (fin des blocs collés sur le hub et en bas des pages).
  · Textes variés par commune (intro unique + rotation accroche/sous-titre/CTA/étapes)
    pour éviter que Google traite les pages comme des quasi-doublons.
"""
import os, json, html

BASE = "https://mmea.ch"
OUT = os.path.join(os.path.dirname(__file__), "site")

# ── CSS commun (identique aux pages métiers) ───────────────────────────────
CSS = ""  # design system partagé : /assets/css/atelier.css (« Le Copeau »)

# ── Données : 1 entrée = 1 secteur ─────────────────────────────────────────
# groupe = pour les liens croisés entre secteurs voisins
SECTEURS = [
  # La Côte (cœur d'activité)
  {"slug":"morges","ville":"Morges","region":"District de Morges","groupe":"La Côte",
   "accroche":"sur les rives du Léman","voisins":["Saint-Prex","Tolochenaz","Lonay","Préverenges","Yens"]},
  {"slug":"aubonne","ville":"Aubonne","region":"La Côte","groupe":"La Côte",
   "accroche":"au cœur de La Côte viticole","voisins":["Allaman","Etoy","Saint-Prex","Rolle","Yens"]},
  {"slug":"etoy","ville":"Etoy","region":"La Côte","groupe":"La Côte",
   "accroche":"entre Morges et Rolle","voisins":["Aubonne","Buchillon","Saint-Prex","Allaman","Yens"]},
  {"slug":"saint-prex","ville":"Saint-Prex","region":"La Côte","groupe":"La Côte",
   "accroche":"au bord du lac","voisins":["Morges","Etoy","Lussy-sur-Morges","Villars-sous-Yens","Yens"]},
  {"slug":"rolle","ville":"Rolle","region":"La Côte","groupe":"La Côte",
   "accroche":"sur La Côte viticole","voisins":["Gilly","Bursins","Aubonne","Perroy","Mont-sur-Rolle"]},
  {"slug":"gland","ville":"Gland","region":"District de Nyon","groupe":"La Côte",
   "accroche":"entre Nyon et Rolle","voisins":["Nyon","Begnins","Vich","Coinsins","Prangins"]},
  {"slug":"nyon","ville":"Nyon","region":"District de Nyon","groupe":"La Côte",
   "accroche":"sur la Côte nyonnaise","voisins":["Gland","Prangins","Founex","Coppet","Crans-près-Céligny"]},
  {"slug":"cossonay","ville":"Cossonay","region":"Arrière-pays morgien","groupe":"La Côte",
   "accroche":"dans l'arrière-pays morgien","voisins":["Penthalaz","La Sarraz","Aclens","Gollion","L'Isle"]},
  # Lausanne & Ouest lausannois
  {"slug":"lausanne","ville":"Lausanne","region":"District de Lausanne","groupe":"Lausanne",
   "accroche":"au cœur du canton","voisins":["Pully","Prilly","Renens","Épalinges","Le Mont-sur-Lausanne"]},
  {"slug":"renens","ville":"Renens","region":"Ouest lausannois","groupe":"Lausanne",
   "accroche":"dans l'Ouest lausannois","voisins":["Ecublens","Bussigny","Chavannes-près-Renens","Crissier","Prilly"]},
  {"slug":"lutry","ville":"Lutry","region":"Lavaux","groupe":"Lausanne",
   "accroche":"dans le vignoble de Lavaux","voisins":["Pully","Paudex","Villette","Cully","Belmont-sur-Lausanne"]},
  # Nord vaudois & Gros-de-Vaud
  {"slug":"yverdon-les-bains","ville":"Yverdon-les-Bains","region":"Nord vaudois","groupe":"Nord",
   "accroche":"dans le Nord vaudois","voisins":["Grandson","Orbe","Chavornay","Yvonand","Chamblon"]},
  {"slug":"echallens","ville":"Échallens","region":"Gros-de-Vaud","groupe":"Nord",
   "accroche":"dans le Gros-de-Vaud","voisins":["Assens","Bercher","Bottens","Cheseaux-sur-Lausanne","Villars-le-Terroir"]},
  # Riviera & Chablais
  {"slug":"vevey","ville":"Vevey","region":"Riviera","groupe":"Riviera",
   "accroche":"sur la Riviera vaudoise","voisins":["La Tour-de-Peilz","Montreux","Corseaux","Blonay","Saint-Légier"]},
  {"slug":"montreux","ville":"Montreux","region":"Riviera","groupe":"Riviera",
   "accroche":"sur la Riviera vaudoise","voisins":["Vevey","Villeneuve","Clarens","Veytaux","La Tour-de-Peilz"]},
  {"slug":"aigle","ville":"Aigle","region":"Chablais vaudois","groupe":"Riviera",
   "accroche":"dans le Chablais","voisins":["Bex","Ollon","Villeneuve","Leysin","Yvorne"]},
  # Broye
  {"slug":"payerne","ville":"Payerne","region":"Broye vaudoise","groupe":"Broye",
   "accroche":"dans la Broye","voisins":["Avenches","Lucens","Moudon","Corcelles-près-Payerne","Estavayer"]},
  {"slug":"moudon","ville":"Moudon","region":"Broye vaudoise","groupe":"Broye",
   "accroche":"dans la Broye vaudoise","voisins":["Lucens","Bercher","Châtillens","Syens","Bronay"]},
]

# ── Intro unique par commune (le levier principal anti-doublon) ─────────────
# Texte libre : ancrage local concret, ~40-55 mots. Modifiable à volonté.
INTROS = {
 "morges":"Vous avez un projet à Morges ? Chef-lieu de district au bord du Léman, la ville mêle immeubles anciens, villas et appartements récents — autant de contextes où un agencement bien pensé change tout. Depuis Yens, à quelques minutes, nous concevons et posons des ouvrages en bois adaptés à chaque intérieur.",
 "aubonne":"À Aubonne, entre vignoble et bourg médiéval, les intérieurs demandent souvent de conjuguer caractère ancien et confort d'aujourd'hui. Notre atelier de Yens, tout proche, réalise sur mesure les agencements, escaliers et menuiseries qui s'accordent à ces maisons de La Côte.",
 "etoy":"Situé entre Morges et Rolle, Etoy voit fleurir villas et rénovations le long de La Côte. Pour ces projets, nous concevons depuis Yens des cuisines, dressings et menuiseries sur mesure, pensés pour durer et s'intégrer à votre lieu de vie.",
 "saint-prex":"Bourg lacustre au patrimoine préservé, Saint-Prex accueille aussi bien de vieilles demeures que des constructions récentes. Notre atelier familial de Yens y intervient pour tous vos travaux de menuiserie et d'agencement sur mesure, du premier conseil jusqu'à la pose.",
 "rolle":"Entre lac et coteaux viticoles, Rolle et ses environs comptent de belles propriétés à agencer ou rénover. Depuis Yens, nous y réalisons cuisines, escaliers, portes, fenêtres et mobilier sur mesure, avec le soin d'un atelier artisanal.",
 "gland":"Ville en plein essor entre Nyon et Rolle, Gland mêle quartiers résidentiels récents et maisons familiales. Nos menuisiers, basés à Yens, y conçoivent et posent des agencements sur mesure adaptés aussi bien aux intérieurs contemporains qu'aux rénovations.",
 "nyon":"Au bord du lac, Nyon et la Côte nyonnaise concentrent villas, appartements et bâtiments de caractère. Depuis notre atelier de Yens, nous y réalisons cuisines, escaliers et menuiseries sur mesure, du premier conseil jusqu'à une pose soignée.",
 "cossonay":"Perché au-dessus de la Venoge, Cossonay et son arrière-pays comptent fermes rénovées et maisons de village. Notre atelier de Yens y façonne sur mesure escaliers, cuisines et menuiseries qui respectent le caractère de ces bâtisses.",
 "lausanne":"Capitale vaudoise aux quartiers très variés, Lausanne offre autant d'appartements à optimiser que de maisons à rénover. Depuis Yens, nous concevons des agencements sur mesure — cuisines, dressings, bibliothèques, escaliers — pensés pour tirer parti de chaque mètre carré.",
 "renens":"Au cœur de l'Ouest lausannois, Renens conjugue immeubles d'habitation et espaces à réinventer. Nos menuisiers de Yens y réalisent cuisines, cloisons et rangements sur mesure, pour gagner à la fois en confort et en volume de rangement.",
 "lutry":"Aux portes de Lavaux, Lutry aligne ruelles anciennes et maisons vigneronnes face au lac. Notre atelier de Yens y intervient pour des agencements et menuiseries sur mesure qui s'accordent au charme de ce patrimoine inscrit.",
 "yverdon-les-bains":"Deuxième ville du canton, Yverdon-les-Bains et le Nord vaudois réunissent centre historique et quartiers récents. Depuis Yens, nous y concevons et posons cuisines, escaliers, portes et fenêtres sur mesure, avec le même soin artisanal.",
 "echallens":"Au centre du Gros-de-Vaud, Échallens et ses villages vivent au rythme de la campagne vaudoise. Notre atelier de Yens y réalise sur mesure les agencements, escaliers et menuiseries des maisons familiales comme des fermes rénovées.",
 "vevey":"Au bord du Léman, sur la Riviera, Vevey mêle appartements de caractère et villas avec vue. Depuis Yens, nous y concevons cuisines, dressings et menuiseries sur mesure, du conseil à la pose, pour mettre en valeur ces intérieurs.",
 "montreux":"De ses quais fleuris à ses hauteurs, Montreux offre des intérieurs très divers, face au lac et aux Alpes. Notre atelier de Yens y réalise agencements, escaliers et menuiseries sur mesure, adaptés à chaque appartement ou maison de la Riviera.",
 "aigle":"Au pied des vignes et des Alpes, Aigle commande l'entrée du Chablais vaudois. Depuis Yens, nous y intervenons pour tous vos ouvrages en bois sur mesure — cuisines, escaliers, menuiseries et mobilier — des habitations de plaine aux chalets d'altitude.",
 "payerne":"Riche de son abbatiale, Payerne rayonne sur la Broye vaudoise et ses campagnes. Notre atelier de Yens y façonne sur mesure cuisines, escaliers et menuiseries, pour les maisons de village comme pour les fermes en rénovation.",
 "moudon":"Ancienne cité médiévale au bord de la Broye, Moudon conserve un riche patrimoine bâti. Nos menuisiers de Yens y réalisent des agencements et menuiseries sur mesure qui respectent le cachet de ces demeures anciennes.",
}

# ── Formule « région élargie » par groupe (pour la phrase de zone) ──────────
REGION_LARGE = {
  "La Côte":"sur toute La Côte",
  "Lausanne":"dans le bassin lausannois",
  "Nord":"dans le Nord vaudois",
  "Riviera":"sur la Riviera et le Chablais",
  "Broye":"dans la Broye",
}

# ── Pools de variantes (rotation déterministe par index) ───────────────────
LEADS = [
  "Atelier familial à Yens, nous concevons, fabriquons et posons vos ouvrages en bois sur mesure à {ville} et dans ses environs — {accroche}. Cuisines, escaliers, portes, fenêtres, cloisons et ébénisterie, du conseil à la pose.",
  "Menuiserie et agencement sur mesure à {ville} : depuis notre atelier de Yens, {accroche}, nous dessinons, fabriquons et posons cuisines, escaliers, portes, fenêtres, cloisons et mobilier — un seul interlocuteur, du premier croquis à la pose.",
  "À {ville} comme dans tout le canton, notre atelier familial de Yens réalise vos projets bois sur mesure, {accroche}. Cuisines, escaliers, portes et fenêtres, cloisons, ébénisterie : nous vous accompagnons du conseil jusqu'à l'installation.",
  "Basés à Yens, {accroche}, nous mettons notre savoir-faire de menuisiers-ébénistes au service de vos projets à {ville} : agencements de cuisine, escaliers, portes et fenêtres, cloisons et mobilier, conçus et posés sur mesure.",
]

SUBS = [
  "Chaque ouvrage est conçu, fabriqué et posé sur mesure, dans notre atelier de Yens.",
  "Du dessin à la pose, tout est réalisé sur mesure dans notre atelier de Yens, à quelques minutes de {ville}.",
  "Conception, fabrication et pose : un même atelier, à Yens, pour l'ensemble de votre projet à {ville}.",
]

# chaque variante = liste de 4 (titre, description) ; {ville} autorisé dans la description
FEATS = [
  [
    ("Conseil &amp; devis gratuit", "Prise de mesures sur place à {ville}, sans engagement."),
    ("Conception sur mesure", "Plans, matériaux, teintes et finitions validés avec vous."),
    ("Fabrication à l'atelier", "Ouvrages façonnés dans notre atelier du Moulin au Loup, à Yens."),
    ("Pose soignée", "Installation par nos soins, jusqu'au dernier ajustement."),
  ],
  [
    ("Écoute &amp; devis gratuit", "Nous venons prendre les mesures à {ville}, sans engagement."),
    ("Étude sur mesure", "Plans, essences de bois, teintes et finitions choisis avec vous."),
    ("Fabrication à Yens", "Chaque pièce est façonnée dans notre atelier du Moulin au Loup."),
    ("Pose &amp; finitions", "Installation réalisée par nos soins, jusqu'au moindre détail."),
  ],
]

CTAS = [
  ("Un projet à {ville} ?", "Parlons-en : conseil, mesures et devis gratuit, sans engagement."),
  ("Envie de concrétiser un projet à {ville} ?", "Contactez-nous pour un premier échange : conseil et devis gratuits, sans engagement."),
  ("Un projet en tête à {ville} ?", "Discutons-en autour d'un devis gratuit — mesures sur place et conseils compris."),
]

DESCS = [
  "Menuiserie, agencement et ébénisterie sur mesure à {ville} : cuisines, escaliers, portes, fenêtres, cloisons. Atelier familial à Yens, du conseil à la pose à {ville} et alentours.",
  "Cuisines, escaliers, portes, fenêtres, cloisons et mobilier sur mesure à {ville}. Atelier familial de menuiserie-ébénisterie à Yens : conseil, fabrication et pose à {ville} et dans les environs.",
]

ZONES = [
  "Au départ de notre atelier de Yens, nous intervenons à {ville}, {voisins}, ainsi que {region_large} et dans tout le canton de Vaud.",
  "Depuis Yens, nos menuisiers se déplacent à {ville} et alentour — {voisins} — comme {region_large} et partout dans le canton de Vaud.",
]

def pick(pool, i):
  return pool[i % len(pool)]

SERVICES = [
  ("cuisines-agencements","Cuisines &amp; agencements"),
  ("portes-fenetres","Portes &amp; fenêtres"),
  ("escaliers","Escaliers"),
  ("cloisons","Cloisons"),
  ("ebenisterie-mobilier","Ébénisterie &amp; mobilier"),
  ("menuiserie-exterieure","Menuiserie extérieure"),
]

FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%232C231B'/%3E%3Cpath d='M9 22 Q9 11 18 11 Q26 11 26 17 Q26 21 21 21 Q17 21 17 18' fill='none' stroke='%23B5824A' stroke-width='2.4' stroke-linecap='round'/%3E%3C/svg%3E"

def e(t): return html.escape(str(t), quote=True)

def services_grid():
  return "\n      ".join('<a href="/services/%s/">%s</a>' % (s, n) for s, n in SERVICES)

def feat_html(idx, ville):
  items = pick(FEATS, idx)
  return "\n      ".join(
    '<li><b>%s</b><span>%s</span></li>' % (b, span.format(ville=e(ville)))
    for b, span in items)

def footer():
  return '<div id="site-footer"></div>'

def analytics():
  return """<script src="/assets/js/partials.js"></script>
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>"""

def head(title, desc, url, area_served, breadcrumb):
  ld_service = {
    "@context":"https://schema.org","@type":"Service",
    "serviceType":"Menuiserie & agencement","name":"Menuiserie & agencement — MORET",
    "url":url,"areaServed":area_served,
    "provider":{"@type":"Carpenter","name":"MORET — Menuiserie & Agencement",
      "telephone":"+41797433721","email":"samuel.moret@moret-s.ch","url":BASE+"/",
      "address":{"@type":"PostalAddress","streetAddress":"Moulin au Loup 4","addressLocality":"Yens",
        "postalCode":"1169","addressRegion":"Vaud","addressCountry":"CH"}}}
  ld_bc = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":breadcrumb}
  return """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<meta name="theme-color" content="#16110B" />
<link rel="canonical" href="{url}" />
<link rel="icon" type="image/svg+xml" href="{favicon}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="MORET — Menuiserie & Agencement" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{desc}" />
<meta property="og:locale" content="fr_CH" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{base}/assets/img/og/partage.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{desc}" />
<meta name="twitter:image" content="{base}/assets/img/og/partage.jpg" />
<script type="application/ld+json">
{ld_service}
</script>
<script type="application/ld+json">
{ld_bc}
</script>
<link rel="preconnect" href="https://api.fontshare.com" crossorigin />
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800&f[]=switzer@400,500,600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/css/atelier.css" />
<script>document.documentElement.classList.add('js');</script>
</head>""".format(title=e(title), desc=e(desc), url=e(url), favicon=FAVICON, base=BASE,
                  ld_service=json.dumps(ld_service, ensure_ascii=False, indent=2),
                  ld_bc=json.dumps(ld_bc, ensure_ascii=False, indent=2))

def secteur_page(s, idx):
  url = "%s/secteurs/%s/" % (BASE, s["slug"])
  ville, region = s["ville"], s["region"]
  voisins = s["voisins"]
  voisins_txt = ", ".join(voisins[:-1]) + " et " + voisins[-1] if len(voisins) > 1 else voisins[0]
  region_large = REGION_LARGE.get(s["groupe"], "dans le canton de Vaud")
  area = [ville] + voisins + ["La Côte", "Canton de Vaud"]
  title = "Menuiserie & agencement à %s (%s) | MORET" % (ville, region)
  desc = pick(DESCS, idx).format(ville=ville)   # échappé dans head()
  breadcrumb = [
    {"@type":"ListItem","position":1,"name":"Accueil","item":BASE+"/"},
    {"@type":"ListItem","position":2,"name":"Secteurs","item":BASE+"/secteurs/"},
    {"@type":"ListItem","position":3,"name":ville,"item":url},
  ]
  # liens croisés : autres secteurs du même groupe
  cross = [x for x in SECTEURS if x["groupe"] == s["groupe"] and x["slug"] != s["slug"]]
  cross_links = "\n      ".join('<a href="/secteurs/%s/">%s</a>' % (x["slug"], e(x["ville"])) for x in cross)
  cross_links += '\n      <a href="/secteurs/">Toutes nos zones →</a>'

  # variantes de texte (déjà substituées → plus aucune accolade)
  lead = pick(LEADS, idx).format(ville=e(ville), accroche=e(s["accroche"]))
  sub = pick(SUBS, idx).format(ville=e(ville))
  cta_h2, cta_p = pick(CTAS, idx)
  cta_h2 = cta_h2.format(ville=e(ville)); cta_p = cta_p.format(ville=e(ville))
  intro = INTROS.get(s["slug"],
    "Vous avez un projet de menuiserie ou d'agencement à %s ? Depuis notre atelier de Yens, "
    "nous concevons et posons des ouvrages en bois sur mesure, %s." % (e(ville), e(s["accroche"])))
  zone_txt = pick(ZONES, idx).format(ville=e(ville), voisins=e(voisins_txt), region_large=e(region_large))

  body = """
<body>
<a class="skip" href="#main">Aller au contenu</a>
<div id="site-nav"></div>

<main id="main">
<section class="page-hero">
  <svg class="wm" viewBox="0 0 33.7 35.4" aria-hidden="true"><use href="#copeau"/></svg>
  <div class="wrap">
    <nav class="crumb" aria-label="Fil d'Ariane"><a href="/">Accueil</a> <a href="/secteurs/">Secteurs</a> <span>{ville}</span></nav>
    <p class="tag">{region}</p>
    <h1>Menuiserie &amp; agencement <span class="ghost">à {ville}.</span></h1>
    <p class="lead">{lead}</p>
    <div class="actions" style="display:flex;gap:14px;flex-wrap:wrap;margin-top:34px">
      <a class="btn btn-acc mag" href="/#contact">Demander un devis</a>
      <a class="btn btn-line mag" href="/realisations/">Voir nos réalisations</a>
    </div>
  </div>
</section>

<section class="sect io" data-io style="padding-bottom:0">
  <div class="wrap"><div class="prose rv" style="--i:0;max-width:64ch;font-size:1.1rem"><p>{intro}</p></div></div>
</section>

<section class="sect io" data-io>
  <div class="wrap">
    <p class="tag rv" style="--i:0">Nos savoir-faire à {ville}</p>
    <h2 class="rv" style="--i:1">Tout le bois,<br/><span class="ghost">sur mesure.</span></h2>
    <p class="lead rv" style="--i:2" style="margin-top:16px">{sub}</p>
    <div class="xp-grid rv" style="--i:3">
      {services}
    </div>
  </div>
</section>

<section class="sect io" data-io style="padding-top:0">
  <div class="wrap">
    <p class="tag rv" style="--i:0">Notre approche</p>
    <h2 class="rv" style="--i:1">Du conseil <span class="ghost">à la pose.</span></h2>
    <ul class="feat-grid rv" style="--i:2">
      {feat}
    </ul>
    <div class="cta-band rv" style="--i:3">
      <div><h2 style="text-transform:uppercase">{cta_h2}</h2><p>{cta_p}</p></div>
      <a class="btn btn-acc mag" href="/#contact">Demander un devis</a>
    </div>
  </div>
</section>

<section class="sect io" data-io style="padding-top:0">
  <div class="wrap">
    <h2 class="rv" style="--i:0;font-size:clamp(1.6rem,3vw,2.2rem)">Autres secteurs <span class="ghost">à proximité.</span></h2>
    <div class="communes">
      {cross}
    </div>
    <p class="prose rv" style="--i:2;margin-top:40px;font-size:15px"><strong>Où nous intervenons autour de {ville} :</strong> {zone}</p>
  </div>
</section>
</main>

{footer}

{analytics}
</body>
</html>""".format(region=e(region), ville=e(ville), lead=lead, intro=intro, sub=sub,
                  services=services_grid(), feat=feat_html(idx, ville),
                  cta_h2=cta_h2, cta_p=cta_p, cross=cross_links, zone=zone_txt,
                  footer=footer(), analytics=analytics())
  return head(title, desc, url, area, breadcrumb) + body

def hub_page():
  url = BASE + "/secteurs/"
  title = "Nos zones d'intervention dans le canton de Vaud | MORET"
  desc = ("Menuiserie et agencement sur mesure dans tout le canton de Vaud : La Côte, Lausanne, "
          "Nord vaudois, Riviera, Chablais et Broye. Atelier familial à Yens.")
  breadcrumb = [
    {"@type":"ListItem","position":1,"name":"Accueil","item":BASE+"/"},
    {"@type":"ListItem","position":2,"name":"Secteurs","item":url},
  ]
  # regroupe par groupe
  order = ["La Côte","Lausanne","Nord","Riviera","Broye"]
  labels = {"La Côte":"La Côte","Lausanne":"Lausanne & Ouest lausannois",
            "Nord":"Nord vaudois & Gros-de-Vaud","Riviera":"Riviera & Chablais","Broye":"Broye"}
  blocks = ""
  for gi, g in enumerate(order):
    items = [x for x in SECTEURS if x["groupe"] == g]
    links = "\n      ".join('<a href="/secteurs/%s/">%s</a>' % (x["slug"], e(x["ville"])) for x in items)
    # 1er bloc : pas de filet (il suit directement le hero) ; espacement régulier ensuite
    style = "padding:64px 0 10px" if gi == 0 else "padding:34px 0 10px"
    blocks += """
<section class="sect io" data-io style="{style}">
  <div class="wrap">
    <h2 class="rv" style="--i:0;font-size:clamp(1.5rem,2.8vw,2rem)">{label}</h2>
    <div class="communes">
      {links}
    </div>
  </div>
</section>""".format(style=style, label=e(labels[g]), links=links)

  body = """
<body>
<a class="skip" href="#main">Aller au contenu</a>
<div id="site-nav"></div>

<main id="main">
<section class="page-hero">
  <svg class="wm" viewBox="0 0 33.7 35.4" aria-hidden="true"><use href="#copeau"/></svg>
  <div class="wrap">
    <nav class="crumb" aria-label="Fil d'Ariane"><a href="/">Accueil</a> <span>Secteurs</span></nav>
    <p class="tag">Canton de Vaud</p>
    <h1>Nos zones <span class="ghost">d'intervention.</span></h1>
    <p class="lead">Atelier familial à Yens, sur La Côte, nous réalisons vos projets de menuiserie et d'agencement sur mesure dans tout le canton de Vaud. Choisissez votre secteur ci-dessous.</p>
    <div class="actions" style="display:flex;gap:14px;flex-wrap:wrap;margin-top:34px">
      <a class="btn btn-acc mag" href="/#contact">Demander un devis</a>
      <a class="btn btn-line mag" href="/realisations/">Voir nos réalisations</a>
    </div>
  </div>
</section>
{blocks}
<section class="sect" style="padding-top:0">
  <div class="wrap">
    <div class="cta-band">
      <div><h2 style="text-transform:uppercase">Votre commune n'est pas listée&nbsp;?</h2><p>Nous intervenons dans tout le canton de Vaud. Contactez-nous pour en parler.</p></div>
      <a class="btn btn-acc mag" href="/#contact">Nous contacter</a>
    </div>
  </div>
</section>
</main>

{footer}

{analytics}
</body>
</html>""".format(blocks=blocks, footer=footer(), analytics=analytics())
  return head(title, desc, url, ["Canton de Vaud","La Côte","Lausanne","Nyon","Morges"], breadcrumb) + body

def write(path, content):
  os.makedirs(os.path.dirname(path), exist_ok=True)
  with open(path, "w", encoding="utf-8") as f:
    f.write(content)

def main():
  # hub
  write(os.path.join(OUT, "secteurs", "index.html"), hub_page())
  # secteurs
  for i, s in enumerate(SECTEURS):
    write(os.path.join(OUT, "secteurs", s["slug"], "index.html"), secteur_page(s, i))
  # fragment sitemap
  urls = [BASE + "/secteurs/"] + ["%s/secteurs/%s/" % (BASE, s["slug"]) for s in SECTEURS]
  frag = "\n".join(
    '  <url><loc>%s</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>' % u
    for u in urls)
  write(os.path.join(OUT, "sitemap-secteurs.fragment.xml"), frag + "\n")
  print("Pages générées : %d secteurs + 1 hub" % len(SECTEURS))
  print("→ %s/secteurs/" % OUT)

if __name__ == "__main__":
  main()
