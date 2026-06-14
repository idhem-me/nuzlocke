# Intégrer un nouveau jeu

Guide pour ajouter une `ZoneList` complète, ordonnée par progression (badges, Ligue, post-ligue), sans erreurs de placement ni oublis.

**Référence implémentée :** `src/data/games/sinnoh-bdsp.ts`  
**Rendu UI :** `buildProgressBlocks()` dans `src/lib/nuzlock/badges.ts`

---

## 1. Fichiers concernés

| Fichier | Action |
|---------|--------|
| `src/data/games/<region>-<jeu>.ts` | **Créer** — badges, ligue, zones |
| `src/data/games/index.ts` | Enregistrer le jeu dans `GAMES` + `ZONE_LISTS` |
| `CHANGELOG.md` | Noter l’ajout (date + version) |

Les captures utilisateur sont indexées par `zone.id` (stable). Ne jamais renommer un `id` existant en production — seulement corriger `name`, `order`, `badgeSectionId`.

---

## 2. Inventaire exhaustif des zones

### 2.1 Principe

**Une zone = un lieu où le joueur peut rencontrer un Pokémon sauvage ou obtenir un Pokémon « comptable » Nuzlocke** (premier rencontré / reçu sur ce lieu).

Inclure **toutes** les zones, y compris :

- Routes, villes, grottes, lacs, chenaux, parcs, ruines, bâtiments, îles, etc.
- Zones « secondaires » obligatoires :
  - **Échange** (`id: "echange"`, `category: "special"`)
  - **Cadeau Mystère** (`id: "cadeau-mystere"`, `category: "special"`)
- Zones débloquées tard (post-ligue, Pokédex National, HM, événements)
- Lieux optionnels mais avec rencontres (Forge Fuego, Grands Souterrains, Tour Perdue, etc.)

### 2.2 Checklist d’inventaire (à cocher avant codage)

Utiliser une feuille externe (tableur ou liste) avec une ligne par zone :

```
| id (slug) | name (FR officiel) | catégorie | badgeSectionId | HM / condition | source vérifiée |
```

**Sources recommandées (ordre de priorité) :**

1. [Poképedia](https://www.pokepedia.fr/) — noms FR des villes et lieux
2. Walkthrough BDSP / jeu concerné (Game8, Bulbapedia)
3. Carte in-game ou [Pokéarth Serebii](https://www.serebii.net/pokearth/)

**Piège fréquent :** ne pas confondre nom FR et nom anglais (ex. Sinnoh : *Littorella* = Sandgem, *Verchamps* = Pastoria, *Voilaroc* = Veilstone).

### 2.3 Catégories (`ZoneCategory`)

Choisir la catégorie la plus proche dans `src/types/game.ts` :

`route` · `ville` · `lac` · `rive` · `grotte` · `chenal` · `marais` · `mont` · `parc` · `ruines` · `batiment` · `prairie` · `jardin` · `ile` · `souterrain` · `post-ligue` · `special`

La catégorie sert surtout au regroupement post-ligue / special. Le **placement par badge** vient de `badgeSectionId`.

---

## 3. Badges et Ligue

### 3.1 Tableau des badges

Définir `badges: GymBadge[]` dans l’**ordre story du jeu** (pas l’ordre de découverte géographique).

```ts
{
  id: "roark",           // slug stable, unique dans ce jeu
  name: "Méga Charge",   // nom du badge en FR
  leaderName: "Pierrick",
  levelCap: 14,          // niveau max du Pokémon le plus fort du champion
  typeId: 6,             // type PokéAPI (Roche = 6)
}
```

`levelCap` = niveau du **dernier Pokémon du champion**, pas une moyenne. Vérifier sur Poképedia / guide niveaux.

### 3.2 Ligue

```ts
const LEAGUE: LeagueCheckpoint = {
  id: "ligue",
  name: "Ligue Pokémon",
  leaderName: "Cynthia",
  levelCap: 66,
};
```

---

## 4. Règles de `badgeSectionId` (cœur du système)

### 4.1 Ce que ça représente

Une zone appartient à la section du badge **dont le level cap s’applique au moment de la capture**.

Ce n’est **pas** uniquement « géographiquement proche de l’arène ». C’est : **« quand le joueur peut légalement y capturer pour ce Nuzlocke ? »**

### 4.2 Algorithme de décision

Pour chaque zone, répondre dans l’ordre :

1. **Quand le lieu devient-il accessible** (story, HM, objet, badge précédent) ?
2. **Quand le joueur peut-il y combattre des sauvages** (ou recevoir un Pokémon) ?
3. **Quel est le level cap Nuzlocke à ce moment-là** (dernier badge obtenu) ?

→ Assigner `badgeSectionId` = id du **dernier badge obtenu avant cette capture**.

### 4.3 Cas particuliers à traiter systématiquement

| Situation | Règle |
|-----------|--------|
| Lieu visible tôt, arène plus tard | Section du badge **au moment de la capture**, pas de la ville (ex. Unionpolis visitée avant Kiméra → section Mélina ; arène Kiméra = même ville, une seule zone) |
| HM obtenu vs HM utilisable | Distinguer **obtention** et **usage**. Surf reçu à Célestia (section Kiméra) ; routes/chenaux Surf **après** avoir battu Kiméra (section Byron) |
| Même route visitée deux fois | **Une seule zone** ; section = premier accès avec rencontres |
| Zone sans badge intermédiaire | Normal : le bloc se termine par le checkpoint du badge sur la **dernière zone** de la section |
| Post-champion / Pokédex National | Pas de `badgeSectionId` ; `category: "post-ligue"` |
| Échange / Cadeau Mystère | `category: "special"` uniquement (section « Autres ») |

### 4.4 Sections affichées (automatique)

`buildProgressBlocks()` produit :

| Contenu | En-tête UI |
|---------|------------|
| Première section (`badges[0]`) | « Début d'aventure » |
| Section `badges[n]` (n ≥ 1) | « Après Ne Badge » |
| Section ligue | « Après 8e Badge » (si 8 badges) |
| Sans badge, post-ligue | « Post-ligue » |
| `category: "special"` | « Autres » |

Checkpoint badge/ligue = **dernière zone** de chaque bloc (tri par `order`).

---

## 5. Ordre de découverte (`order`)

### 5.1 Règles

- Entiers **contigus** : `1 … N` sans doublon ni trou
- Tri = parcours story **typique**, pas 100 % libre open-world
- En cas de chemins parallèles (ex. Route 212 vs 214 vers Verchamps), choisir l’ordre le plus courant dans les walkthroughs et documenter en `note` si besoin

### 5.2 Grille de progression (template)

Remplir avant d’écrire le TS :

```
[ ] Début → 1er badge
[ ] Après 1er → 2e badge
[ ] …
[ ] Après avant-dernier → Ligue
[ ] Post-ligue (lister toutes)
[ ] Autres (échange, cadeau mystère)
```

Chaque ligne = liste ordonnée des `id` de zones.

---

## 6. Structure du fichier jeu

```ts
import type { GymBadge, LeagueCheckpoint, ZoneList } from "@/types/game";

const REGION_LEAGUE: LeagueCheckpoint = { /* … */ };

const REGION_BADGES: GymBadge[] = [ /* ordre story */ ];

export const maRegionZones: ZoneList = {
  id: "ma-region-jeu",       // = zoneListId dans Game
  name: "Ma Région (Jeu)",
  badges: REGION_BADGES,
  league: REGION_LEAGUE,
  zones: [
    {
      id: "bonaugure",         // slug kebab-case, stable, unique
      name: "Bonaugure",       // nom FR officiel
      order: 1,
      category: "ville",
      badgeSectionId: "roark",
      // note: "optionnel — HM, quête, confusion FR/EN"
    },
    // …
    { id: "echange", name: "Échange", order: N-1, category: "special" },
    { id: "cadeau-mystere", name: "Cadeau Mystère", order: N, category: "special" },
  ],
};
```

### 6.1 Enregistrement (`index.ts`)

```ts
import { maRegionZones } from "./ma-region-jeu";

export const GAMES: Game[] = [
  {
    id: "mon-jeu-id",
    name: "Pokémon …",
    shortName: "…",
    zoneListId: "ma-region-jeu",
    platform: "switch",
  },
];

const ZONE_LISTS: Record<string, ZoneList> = {
  "sinnoh-bdsp": sinnohBdspZones,
  "ma-region-jeu": maRegionZones,
};
```

Plusieurs jeux peuvent partager la même `zoneListId` (ex. Diamant et Perle BDSP → `sinnoh-bdsp`).

---

## 7. Validation automatisée (obligatoire)

Après édition, exécuter depuis la racine du projet :

```bash
npx tsx -e "
import { maRegionZones } from './src/data/games/ma-region-jeu.ts';
import { buildProgressBlocks } from './src/lib/nuzlock/badges.ts';

const zones = maRegionZones.zones;
const orders = zones.map(z => z.order).sort((a, b) => a - b);
const ids = zones.map(z => z.id);
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
const dupOrders = [...new Set(orders.filter((o, i) => orders.indexOf(o) !== i))];
const missing = [...Array(zones.length)].map((_, i) => i + 1).filter(n => !orders.includes(n));

console.log('Zones:', zones.length);
console.log('IDs dupliqués:', dupIds.length ? dupIds : 'aucun');
console.log('Orders dupliqués:', dupOrders.length ? dupOrders : 'aucun');
console.log('Orders manquants:', missing.length ? missing : 'aucun');

const badgeIds = new Set(maRegionZones.badges?.map(b => b.id) ?? []);
for (const z of zones) {
  if (z.badgeSectionId && !badgeIds.has(z.badgeSectionId)) {
    console.error('badgeSectionId inconnu:', z.id, '→', z.badgeSectionId);
  }
}

const required = ['echange', 'cadeau-mystere'];
for (const id of required) {
  if (!ids.includes(id)) console.error('Zone manquante:', id);
}

buildProgressBlocks(zones, maRegionZones.badges!, maRegionZones.league)
  .forEach(b => console.log(b.header + ':', b.zones.map(z => z.name).join(' → ')));
"
```

**Critères OK :**

- [ ] Aucun `id` dupliqué
- [ ] Orders `1 … N` contigus
- [ ] Tous les `badgeSectionId` existent dans `badges[]`
- [ ] `echange` et `cadeau-mystere` présents
- [ ] Parcours des blocs cohérent à la relecture story

Puis :

```bash
npm run build
```

---

## 8. Checklist finale (revue humaine ciblée)

Ne pas relire toute la liste à l’aveugle : vérifier **par classe de risque**.

### A. Noms FR (5 min)

- [ ] Chaque ville croisée avec Poképedia (pas de mélange EN/FR)
- [ ] Arènes associées au bon slug de badge (ville ≠ arène parfois)

### B. HM et déblocages (10 min)

Pour chaque HM / capacité field (Coupe, Surf, Force, Cascade, Escalade, etc.) :

- [ ] Lieu d’**obtention** → bonne section
- [ ] Lieux nécessitant l’**usage** → section **après** le badge qui autorise l’usage (pas seulement l’obtention du HM)

### C. Eau et chenaux (5 min)

- [ ] Tous les `chenal` et routes exclusivement Surf listés dans la section post-Surf
- [ ] Chenaux post-game (Aire de Combat, etc.) en `post-ligue` avec `note`

### D. Post-ligue (5 min)

- [ ] Routes 224+ / Battle Zone / légendaires post-National Dex → `post-ligue`
- [ ] Aucune zone story mid-game laissée en post-ligue

### E. Level caps (5 min)

- [ ] `levelCap` = max du champion sur chaque badge (source fiable)
- [ ] Pas de zone « trop tôt » avec cap trop élevé (signal : capture possible avant le badge affiché)

---

## 9. Pièges documentés (Sinnoh BDSP)

Leçons tirées de l’intégration Sinnoh — à généraliser :

| Erreur | Correction |
|--------|------------|
| Confondre noms FR (Littorella ≠ Pastoria) | Toujours Poképedia FR |
| Parc Éolien après 2e badge | Accessible après 1er badge (Rock Smash), avant Forêt |
| Route 211 en post-Kiméra | Accessible dès Vestigion (Coupe) |
| Grands Souterrains en post-ligue | Kit Explorateur à Vestigion |
| Forge Fuego / chenaux 218–221 en post-ligue | Après Kiméra (Surf utilisable) |
| Célestia = Bonville | Célestia = Celestic ; Bonville = Solaceon |
| Rivamar en section Kiméra | Rivamar = Sunyshore = Corne |
| `category: "souterrain"` sans `badgeSectionId` | Tombe en post-ligue via `getGroupKey()` — toujours mettre `badgeSectionId` si mid-game |

---

## 10. Ajouter un second jeu sur la même région

- **Réutiliser** la même `ZoneList` si les zones et la progression sont identiques (variantes Diamant/Perle).
- **Dupliquer** le fichier si la progression diffère (ex. Platine vs D/P : ordre des arènes, routes exclusives).
- Documenter en en-tête du fichier les différences éventuelles entre versions.

---

## 11. Résumé workflow

```
1. Inventaire complet (tableur) — toutes zones + échange + cadeau mystère
2. Badges + ligue (ordre story, level caps, typeId)
3. Grille par section badge (ids ordonnés)
4. Règle HM : obtention vs utilisation
5. Coder src/data/games/<region>.ts
6. Enregistrer dans index.ts
7. Script de validation tsx
8. npm run build
9. Checklist ciblée §8
10. CHANGELOG
```

Ce workflow vise à ce que la validation automatique attrape les erreurs structurelles (doublons, sections cassées) et que la relecture humaine se limite aux **cas à risque** (noms FR, HM, eau, post-ligue).
