# MMEA v2 « Le Copeau » — MIGRATION COMPLÈTE (étapes 1 à 6)

## Contenu du paquet — 30 pages + socle
| Élément | Action dans ton repo |
|---|---|
| `index.html` | remplace |
| `404.html` | remplace |
| `realisations/index.html` | remplace |
| `services/…/index.html` (×6) | remplacent |
| `secteurs/…` (18 communes + hub) | remplacent |
| `infos/mentions-legales/`, `infos/protection-donnees/` | remplacent |
| `assets/css/atelier.css` | **nouveau** — design system partagé |
| `assets/js/partials.js` | remplace (menu toujours éditable en tête de fichier) |
| `assets/js/copeau3d.js` | **nouveau** — la 3D de l'accueil |
| `outils/gen_secteurs.py` | remplace (données/textes intacts, template « Copeau ») |

**Inchangés, à garder tels quels** : `assets/js/projets.js` (tu ajoutes tes projets comme avant),
toutes les images, `vercel.json`, `outils/gen_sitemap.py`.
**À supprimer (plus utilisés)** : `assets/css/fonts.css` et `assets/fonts/*` (anciennes polices)
— ou garde-les le temps de basculer sur l'auto-hébergement (voir Polices).

## Déploiement
1. Copie le contenu du zip à la racine du repo (écrase les fichiers existants).
2. Test local : `python3 -m http.server` à la racine → http://localhost:8000
   (vérifie : accueil 3D, essences persistantes, /realisations/ + filtres, un service, un secteur, /infos/…, /404.html)
3. `python3 outils/gen_sitemap.py` pour rafraîchir le sitemap (dates Git).
4. `git add -A && git commit && git push` → Vercel déploie.

## Ce qui est préservé à l'identique
SEO complet page par page (titles, descriptions, canonicals, Open Graph, JSON-LD
Carpenter/Service/BreadcrumbList), formulaire Web3Forms (clé, champs, cases dynamiques,
honeypots, repli mailto, pré-remplissage `/?type=escalier#contact`), ancres de filtres
`/realisations/#cuisine`, textes anti-doublon des 18 secteurs, Vercel Analytics + Speed Insights.

## Nouveautés transverses
Essence de bois persistante (localStorage `mmea-essence`), visionneuse centralisée
(photos + YouTube sans cookies), curseur, menu plein écran, révélations, compteurs,
boutons magnétiques — le tout via `partials.js`, zéro duplication.

## Polices (RGPD)
CDN Fontshare pour l'instant. Pour l'auto-hébergement strict : télécharge
**Cabinet Grotesk** (500/700/800) + **Switzer** (400/500/600) sur fontshare.com
→ `assets/fonts/`, dis-le-moi et je te fournis le `fonts.css` v2 + le patch des `<head>`.

## Pour ajouter un secteur ou modifier le menu
Comme avant : `outils/gen_secteurs.py` (SECTEURS + INTROS) puis relance le script ;
menu = liste `MMEA_MENU` en tête de `assets/js/partials.js`.
