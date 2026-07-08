# 🛠️ Guide de Survie Git & Déploiement — MMEA

Ce guide rassemble toutes les commandes et routines à utiliser au quotidien pour gérer le code du site et s'en sortir sans stress en cas de pépin.

---

## 🚀 1. La Routine Quotidienne (Mettre en ligne des changements)

C'est la suite de commandes classique à utiliser dès qu'une modification esthétique ou textuelle fonctionne bien dans VS Code et qu'elle doit être publiée sur Vercel.

```bash
# Étape 1 : On prépare tous les fichiers modifiés
git add .

# Étape 2 : On valide les changements avec un message clair
git commit -m "Description de ce que tu as fait (ex: Mise à jour des images)"

# Étape 3 : On envoie sur GitHub (Vercel déploie automatiquement dans la foulée)
git push origin main

```

*(Note : Si la branche principale s'appelle master au lieu de main, il faut remplacer le dernier mot par master)*.

---

## 🚑 2. En cas d'Urgence : Revenir en arrière

Si un code complexe a été testé, que tout a cassé et qu'il faut effacer les dernières modifications pour revenir à un moment précis où le site fonctionnait.

### Étape A : Trouver le point de restauration

1. Aller sur le tableau de bord **Vercel** ou sur **GitHub**.


2. Repérer la version stable qui fonctionnait bien dans l'historique des déploiements.


3. Récupérer l'identifiant court à 7 caractères (le SHA, ex: 339bc94).



### Étape B : Forcer le retour dans le passé

Exécuter ces deux commandes dans le terminal VS Code :

```bash
# 1. Force le VS Code local à revenir exactement à cette version
git reset --hard IDENTIFIANT_COURT

# 2. Force GitHub à s'aligner sur ce retour en arrière (écrase les versions buguées)
git push origin main --force

```

---

## ⏰ 3. Le Cas Particulier : Forcer Vercel à se réveiller

Parfois, après un `--force push`, Vercel refuse le bouton "Redeploy" et affiche une erreur *(Production Deployment cannot be redeployed)* car il est perdu dans les dates. Pour le forcer à compiler le code actuel sans rien modifier dans les fichiers, il faut utiliser le **commit vide** :

```bash
# 1. On crée un faux commit invisible juste pour déclencher Vercel
git commit --allow-empty -m "Forcer le deploiement de la version propre"

# 2. On envoie normalement
git push origin main

```

---

## 🔍 4. Commandes de Contrôle utiles

Si un doute persiste sur l'état du projet avant de faire un push, ces commandes rapides sont très utiles :

* **`git status`** : Montre la liste des fichiers modifiés qui ne sont pas encore envoyés.


* **`git log --oneline -n 5`** : Affiche les 5 derniers commits enregistrés pour situer l'historique.


## Connecter le projet à GitHub et Vercel

### 1. Initialiser Git et pousser le projet sur GitHub

Dans le terminal VS Code, à la racine du dossier du projet (`mmea.ch`) :

```bash
git init
git add .
git commit -m "Initial commit - mmea.ch"
git branch -M main
git remote add origin https://github.com/ck4k2n59v5-hub/mmea.ch.git
git push -u origin main
```

> Astuce : on peut tout coller en une seule fois — chaque ligne s'exécute l'une après l'autre.

- `git init` → transforme le dossier en repo Git
- `git add .` → prépare tous les fichiers pour le commit
- `git commit -m "..."` → enregistre un instantané du projet avec un message
- `git branch -M main` → renomme la branche principale en `main`
- `git remote add origin <url>` → lie le dossier local au repo GitHub
- `git push -u origin main` → envoie tout sur GitHub (premier push : possible demande d'authentification)

### 2. Connecter le repo à Vercel

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Cliquer sur **"Import Git Repository"**
3. Si le repo `mmea.ch` n'apparaît pas (repo privé) → cliquer sur **"Adjust GitHub App Permissions"** pour donner accès à Vercel
4. Sélectionner `mmea.ch`, laisser les paramètres par défaut (site statique HTML/CSS) et cliquer **Deploy**

Après ça, chaque `git push` sur `main` redéploie automatiquement le site.

### 3. Workflow régulier (à chaque session de travail)

Soit en ligne de commande :

```bash
git add .
git commit -m "Description des changements"
git push
```

Soit via l'onglet **Source Control** de VS Code (icône avec les petits cercles) : voir les fichiers modifiés, écrire le message de commit, cliquer sur "Commit" puis "Sync/Push".

### 4. Récupérer le projet sur un nouvel ordinateur

```bash
git clone https://github.com/ck4k2n59v5-hub/mmea.ch.git
cd mmea.ch
code .
```

Aucun chemin particulier à recréer : les chemins du code sont relatifs, et la connexion à GitHub est stockée dans le dossier `.git` du projet, peu importe son emplacement sur le disque.

### 5. Déplacer ou réorganiser le dossier du projet

- Déplacer le dossier `mmea.ch` complet (avec `.git`) ne casse rien.
- Dans VS Code : **File > Open Folder** vers le nouvel emplacement.
- Vérifier avant tout déplacement que `git status` affiche *"nothing to commit, working tree clean"* (rien en attente de commit).

### ⚠️ Le seul vrai risque

Du travail modifié en local mais jamais poussé sur GitHub n'existe nulle part ailleurs. Règle d'or : **commit + push régulièrement**, surtout avant de changer/réorganiser son ordinateur.
