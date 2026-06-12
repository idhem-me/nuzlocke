# Changelog

## [0.3.2] — 2026-06-12

### Corrigé
- Autocomplétion Pokémon sur iPhone (Safari iOS) : sélection des suggestions au tap — migration vers les hooks Floating UI (`useDismiss`, `useListNavigation`, `useRole`, `useInteractions`) pour gérer correctement le tactile ; suppression de la fermeture immédiate au `blur` (cause principale : `relatedTarget` null sur iOS) ; sélection via `onPointerDown` + `preventDefault` ; attributs anti-interférence iOS sur l'input (`autoCorrect`, `autoCapitalize`, `spellCheck`)

## [0.3.1] — 2026-06-12

### Modifié
- Liste des zones Sinnoh (BDSP) : 8 noms corrigés (noms officiels FR du jeu), 27 zones ajoutées, ordre de progression revu
- Type `Zone` : champ optionnel `category` (`route`, `ville`, `grotte`, `post-ligue`, etc.)

### Ajouté
- Villes : Féli-Cité, Charbourg, Vestigion, Floraville, Littorella, Unionpolis, Bonville, Rivamar, Verchamps, Joliberges, Ligue Pokémon
- Routes & chenaux : 211, 216, 217, Chenal 220
- Rives des lacs Courage et Savoir
- Lieux : Entrée de Charbourg, Tour Perdue, Colonnes Lances, Temple de Frimapic, Parc Rosa Rugosa, Aire de Combat / Survie / Détente, Échange, Cadeau Mystère

## [0.3.0] — 2026-06-12

### Corrigé
- Menu d'autocomplétion Pokémon : rendu via portal + Floating UI pour éviter le clipping par la carte de zone (`overflow-hidden` du repli animé), avec flip, hauteur max viewport et navigation clavier
- Positionnement du menu d'autocomplétion : ancrage synchrone sur l'input (`strategy: fixed`) pour corriger le décalage vers le haut de page

### Modifié
- Repli / dépli global : agit désormais sur **toutes** les zones (saisies ou vides), avec indicateur « Non renseignée » en vue compacte

### Ajouté
- Repli / dépli des zones sur l'écran de suivi (bouton global dans la top app bar + chevron par zone)
- Vue compacte d'une zone repliée : nom, sprite, surnom ou espèce, badge « Échec »
- Persistance de l'état replié par Nuzlock dans IndexedDB (`collapsedZones`)

## [0.2.2] — 2026-06-12

### Modifié
- « Mes Nuzlockes » raccourci en « Nuzlockes » (nav + titre accueil)
- Rail desktop : fixe, pleine hauteur viewport, titre « Nuzlocke » retiré

## [0.2.1] — 2026-06-12

### Modifié
- Navigation bar / rail MD3 : gélule active autour de l'icône uniquement, label stable
- Retrait du FAB sur l'accueil (la bottom nav suffit)

## [0.2.0] — 2026-06-12

### Modifié
- Refonte UI/UX pour conformité Material Design 3 (thème noir & blanc conservé)
- Boutons MD3 : filled, tonal, outlined, text, error — avec state layers et focus visible
- Champs de saisie en style **outlined** MD3 (label flottant, cohérent sur toute l'app)
- Top app bar MD3 avec retour icon-only (`arrow_back`) sur les sous-pages
- Bottom nav et navigation rail : indicateur actif MD3, `aria-current`
- Suppression d'un Nuzlock via menu overflow (`more_vert`) + confirmation dialog
- États de chargement : skeleton (liste) et linear progress (préchargement PokéAPI)
- Snackbar MD3 après suppression (« Nuzlock supprimé »)
- Checkbox MD3 custom, menu d'autocomplétion stylé MD3
- État échec de capture : surface grisée sans opacité globale
- Zoom iOS autorisé (suppression de `maximumScale: 1`)

### Ajouté
- Composants UI centralisés : `IconButton`, `Fab`, `TopAppBar`, `Menu`, `Snackbar`, `ProgressIndicator`, `Skeleton`, `Icons`
- FAB « Nouveau Nuzlock » sur l'accueil quand la liste n'est pas vide
- Tokens MD3 étendus (typographie, surface-container, scrim, inverse-surface)

## [0.1.1] — 2026-06-12

### Modifié
- « Mes Nuzlocks » renommé en « Mes Nuzlockes »
- Date de début d'aventure affichée à la création du Nuzlock (`createdAt`)
- Date et heure automatiques à l'ajout d'un Pokémon ou en cas d'échec de capture (`capturedAt`)

## [0.1.0] — 2026-06-12

### Ajouté
- Initialisation du projet Next.js + TypeScript + Tailwind CSS v4
- Configuration PWA (Serwist, manifest, service worker)
- Fichiers projet : `PM.md`, `.cursorrules`, `CHANGELOG.md`, `README.md`
- Data model TypeScript (Nuzlock, Game, Zone, Capture)
- Couche d'abstraction IndexedDB pour Nuzlocks et cache Pokémon
- Données zones Sinnoh (Diamant Étincelant / Perle Scintillante)
- Registre de jeux extensible
- Pages : Mes Nuzlocks, Nouveau Nuzlock, Règles du Nuzlocke
- Écran de suivi avec autocomplétion PokéAPI, sprites, échec de capture
- Composants UI Material Design 3 (thème noir et blanc)
- Navigation bottom nav (mobile) / rail latéral (desktop)
- Cache PokéAPI avec préchargement des espèces en français
- Instructions de déploiement Vercel
