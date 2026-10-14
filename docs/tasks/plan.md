# Plan d’implémentation : demo-dice

## Vue d’ensemble

Construire une page statique autonome qui présente des dés à 12 faces, affiche la correspondance de symboles fournie et permet de lancer chaque groupe avec un résultat immédiat. La solution restera limitée à HTML, CSS et JavaScript vanille, sans étape de compilation.

## Décisions d’architecture

- La page sera composée de trois fichiers séparés : `index.html`, `styles.css` et `script.js`.
- La table des faces sera définie une seule fois dans `script.js`; le DOM sera mis à jour depuis cette table.
- La forme du dé sera construite en CSS comme un pentagone à cinq côtés afin de garder la couleur et les dimensions faciles à modifier.
- Le bouton de chaque groupe mettra immédiatement à jour uniquement ses propres dés.
- L’état initial utilisera un dé vide avec un texte accessible indiquant qu’aucun lancer n’a encore été effectué, sauf décision contraire sur les questions ouvertes de la spec.
- Chaque groupe sera créé depuis `appConfig.diceGroups` avec son titre, son bouton configurable et sa collection de dés. Chaque dé gardera un identifiant unique, une couleur, un libellé de section et ses propres contrôles; les faces ainsi que la définition du dropdown et du contrôle segmenté resteront communes.

## Graphe de dépendances

```text
Structure HTML accessible
        │
        ├── Variables et mise en page CSS
        │       │
        │       └── Style du dé et états du bouton
        │
        └── Table des faces et logique de rendu JavaScript
                │
                └── Interaction de lancer et mise à jour du log
```

## Liste des tâches

### Phase 1 : Fondation

- Tâche 1 : créer la structure HTML accessible et les points d’ancrage du dé
- Tâche 2 : créer le thème visuel, la mise en page responsive et les états de base

### Point de contrôle : Fondation

- La page s’ouvre directement dans un navigateur.
- Le dé, le bouton et la zone de résultat sont visibles.
- Le fond est blanc et la mise en page fonctionne sur une largeur mobile.

### Phase 2 : Fonctionnalité principale

- Tâche 3 : ajouter la table des 12 faces et le rendu du résultat
- Tâche 4 : ajouter le tirage aléatoire et la mise à jour immédiate du résultat

### Point de contrôle : Fonctionnalité principale

- Un clic produit une valeur de 1 à 12.
- Chaque valeur affiche exactement les symboles définis dans la spec.
- Chaque bouton agit uniquement sur les dés de son groupe.

### Phase 3 : Accessibilité et finition

- Tâche 5 : prendre en charge la réduction des mouvements et les états clavier
- Tâche 6 : documenter l’utilisation et effectuer la validation manuelle complète
- Tâche 7 : ajouter les contrôles de manoeuvrabilité

### Point de contrôle : Terminé

- Les critères de réussite de `SPEC.md` sont vérifiés.
- Le parcours clavier et le texte accessible sont cohérents.
- Un objet ajouté à `appConfig.diceGroups` crée un groupe; un objet ajouté à son tableau `dices` crée un dé supplémentaire dont la couleur est indépendante.
- Le projet est prêt pour une revue humaine avant commit.

## Risques et mesures

| Risque | Impact | Mesure |
|---|---|---|
| Les faces 2 et 3 sont visuellement vides | La valeur peut sembler absente | Afficher la valeur numérique dans la zone accessible et dans le statut du résultat |
| La forme CSS varie selon les dimensions d’écran | Rendu incohérent | Utiliser une taille fluide bornée par `clamp()` et vérifier mobile/desktop |
| Les caractères symboles ne sont pas rendus de façon uniforme | Aspect variable selon la police | Choisir une pile de polices de secours et vérifier dans un navigateur moderne |

## Questions ouvertes reportées

- Confirmer le libellé final du titre.
- La forme du dé est fixée à un pentagone à cinq côtés; la couleur initiale reste à confirmer après la première revue visuelle.
- Confirmer si l’état initial vide convient.

## Ordre d’exécution

Les tâches sont séquentielles, car le JavaScript dépend des éléments HTML et des classes CSS définis auparavant. La validation visuelle et fonctionnelle vient après l’intégration des trois couches.
