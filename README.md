# Nuzlocke Tracker

PWA de suivi de Nuzlocke Pokémon — stockage 100 % local, optimisée pour iPhone.

## Fonctionnalités

- Création et gestion de Nuzlocks (Diamant Étincelant / Perle Scintillante)
- Suivi zone par zone avec autocomplétion Pokémon (noms FR)
- Sprites via PokéAPI, cache local IndexedDB
- Mode hors-ligne pour consulter vos runs existants
- Installable sur l'écran d'accueil (iOS / Android)

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- IndexedDB (`idb`)
- PWA via Serwist
- PokéAPI

## Développement local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

> Le service worker est désactivé en développement. Tester le mode PWA avec un build de production.

```bash
npm run build
npm start
```

## Déploiement sur Vercel

1. Pousser le projet sur GitHub (ou GitLab / Bitbucket).
2. Se connecter sur [vercel.com](https://vercel.com) et importer le dépôt.
3. Vercel détecte automatiquement Next.js — aucune configuration spéciale requise.
4. Déployer. Le build exécute `next build` qui génère aussi le service worker.

### Variables d'environnement

Aucune variable requise pour la V1 (pas de backend, pas de clé API).

### PWA sur iPhone

1. Ouvrir l'app dans Safari.
2. Appuyer sur **Partager** → **Sur l'écran d'accueil**.
3. L'app s'ouvre en mode standalone.

> Au premier lancement, l'app télécharge la liste des Pokémon depuis PokéAPI (~1025 espèces). Une connexion internet est nécessaire pour cette étape initiale.

## Structure

Voir `.cursorrules` et `PM.md` pour le contexte projet et la roadmap.

## Licence

Projet personnel — usage libre.
