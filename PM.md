# Nuzlocke Tracker — Product Roadmap

## Vision

Application web (PWA) pour suivre ses runs Nuzlocke sur les jeux Pokémon, utilisable principalement sur mobile (iPhone via Safari + écran d'accueil). Stockage 100 % local, sans compte, sans backend.

## V1 — Scope actuel

### Fonctionnalités
- Création et gestion de Nuzlocks (nom + jeu)
- Suivi zone par zone avec capture, surnom, échec de capture
- Autocomplétion Pokémon (noms FR via PokéAPI)
- Sprites Pokémon
- Persistance IndexedDB
- PWA installable, mode hors-ligne (consultation des Nuzlocks existants)
- Page des règles du Nuzlocke

### Jeux supportés
- Pokémon Diamant Étincelant (Switch)
- Pokémon Perle Scintillante (Switch)
- Liste de zones Sinnoh partagée

### Hors scope V1
- Statut vivant/mort des Pokémon en combat
- Niveaux
- Règle des doublons
- Synchronisation multi-appareils
- Compte utilisateur
- Autres jeux (DS, autres régions)

## Architecture technique

- **Frontend** : Next.js (App Router) + TypeScript + Tailwind CSS
- **Design** : Material Design 3, thème noir et blanc
- **Stockage** : IndexedDB (couche d'abstraction pour évolutivité)
- **API externe** : PokéAPI (noms FR, sprites) avec cache local
- **Déploiement** : Vercel

## Idées futures

### V2 — Enrichissement du suivi
- Statut des Pokémon (équipe / mort / boîte)
- Niveau actuel
- Notes par zone ou par Pokémon
- Compteur de morts / badges
- Export / import JSON des données

### V3 — Mode Hardcore
- Règle : si le starter meurt → run terminée
- Règle : pas de revive
- Variantes de règles configurables par Nuzlock

### V4 — Multi-jeux
- Pokémon Or HeartGold / Argent SoulSilver (Johto + Kanto)
- Pokémon Rubis Oméga / Saphir Alpha (Hoenn)
- Pokémon Écarlate / Violet (Paldea)
- Architecture : `Game` → `ZoneList` (déjà prévue en V1)

### V5 — Multi-appareils
- Compte utilisateur (optionnel)
- Sync cloud (Supabase, Firebase, ou custom)
- Import depuis export JSON V2

### V6 — Social / partage
- Partage public d'un Nuzlock (lecture seule)
- Image récapitulative exportable (résumé des captures)

## Principes produit

1. **Mobile first** — l'expérience iPhone est la référence
2. **Offline first** — les données utilisateur restent accessibles hors-ligne
3. **Simplicité** — pas de friction à la création d'un Nuzlock
4. **Extensibilité** — ajout de jeux et règles sans refonte
