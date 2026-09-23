# Spécification : demo-dice

## Objectif

Créer une démo web autonome d’un simulateur de lancer de dé à 12 faces. La personne voit un dé stylisé au centre de la page et clique sur un bouton placé sous le dé pour lancer une nouvelle valeur avec une animation visuelle claire et agréable.

La démo doit reprendre l’esprit visuel des références fournies, avec une interface légère, lisible et centrée sur le dé. Le fond de la page reste blanc et la couleur principale du dé doit pouvoir être modifiée à un seul endroit.

## Périmètre fonctionnel

Le dé produit une valeur entière aléatoire de 1 à 12 inclus. Chaque valeur correspond exactement au contenu suivant :

| Valeur | Face affichée |
|---:|---|
| 1 | `!` |
| 2 | vide |
| 3 | vide |
| 4 | `○` |
| 5 | `★` |
| 6 | `○○` |
| 7 | `★○` |
| 8 | `★★` |
| 9 | `○○○` |
| 10 | `★○○` |
| 11 | `★★○` |
| 12 | `★★★` |

Le premier état du dé affiche une valeur déterministe ou un état d’attente à définir avant l’implémentation. Le bouton lance le dé, déclenche l’animation et affiche le résultat à la fin de celle-ci. Le bouton est indisponible pendant l’animation afin d’éviter plusieurs lancers simultanés.

## Stack technique

- HTML vanille pour la structure sémantique.
- CSS vanille pour la mise en page, le style du dé et l’animation.
- JavaScript vanille pour le tirage aléatoire, le rendu des faces et la gestion de l’interaction.
- Aucune dépendance obligatoire. Une librairie chargée par CDN pourra être ajoutée uniquement si elle apporte une valeur claire au rendu.

## Commandes

Le projet est une page statique sans outil de build prévu à ce stade.

```text
Développement : ouvrir demo-dice/index.html dans un navigateur moderne
Validation : ouvrir la console du navigateur et effectuer les vérifications manuelles décrites ci-dessous
```

## Structure de projet prévue

```text
demo-dice/
├── index.html       → Structure de la démo et contenu accessible
├── styles.css       → Mise en page, variables de thème et animations
├── script.js        → Tirage, rendu des faces et interactions
├── README.md        → Présentation et mode d’utilisation du projet
└── SPEC.md          → Source de vérité fonctionnelle et visuelle
```

## Direction visuelle

- Fond blanc.
- Dé placé au centre de la zone principale, avec le bouton directement sous lui.
- Forme du dé en pentagone à cinq côtés, inspirée d’un dé polygonal de jeu de rôle, avec une présence visuelle forte et une profondeur légère.
- Couleur du dé déclarée dans une variable CSS dédiée, par exemple `--die-color`, afin de permettre un changement rapide sans chercher dans plusieurs règles.
- Contraste suffisant entre le dé, les symboles et le fond.
- Le bouton doit avoir un état normal, survol, focus clavier et désactivé pendant le lancer.
- Le style peut s’inspirer de CodePen et de D&D Beyond sans copier leur interface ni ajouter de composants hors périmètre.

## Style de code

Le code doit rester lisible et limité à la responsabilité de chaque fichier. Les noms JavaScript utilisent le camelCase, les classes CSS utilisent le kebab-case et les constantes de configuration sont regroupées au début du script.

Exemple de contrat de données attendu :

```js
const faceContents = {
  1: '!',
  2: '',
  3: '',
  4: '○',
  5: '★',
  6: '○○',
  7: '★○',
  8: '★★',
  9: '○○○',
  10: '★○○',
  11: '★★○',
  12: '★★★'
};
```

Le rendu doit utiliser le contenu de cette configuration plutôt que multiplier des conditions spécifiques dans le HTML ou le CSS.

## Accessibilité et comportement responsive

- Le contrôle de lancer est un vrai élément `button` avec un nom explicite.
- Le résultat courant est exposé à l’aide d’un texte accessible, par exemple via `aria-live="polite"`.
- La détection de `prefers-reduced-motion: reduce` doit réduire ou supprimer les mouvements non essentiels.
- Le dé doit rester lisible sur mobile, tablette et écran large sans débordement horizontal.
- Le focus clavier doit être visible.
- Les faces 2 et 3 restent volontairement visuellement vides, mais la valeur numérique doit rester compréhensible par le texte accessible.

## Stratégie de test

La première version ne nécessite pas de framework de test ni de dépendance supplémentaire. La validation se fait dans un navigateur moderne :

1. Vérifier au chargement que le dé, le bouton et le résultat accessible sont présents.
2. Cliquer plusieurs fois sur le bouton et confirmer qu’une valeur comprise entre 1 et 12 est produite.
3. Vérifier chaque correspondance valeur/symboles du tableau ci-dessus.
4. Vérifier que le dé anime son état pendant le lancer, puis revient à un état stable avec le résultat final.
5. Vérifier que le bouton ne déclenche pas de lancers concurrents pendant l’animation.
6. Vérifier les états clavier, survol et désactivé du bouton.
7. Vérifier l’affichage à une largeur mobile et avec l’option de réduction des mouvements activée.
8. Modifier uniquement `--die-color` et confirmer que la couleur du dé change sans modifier le reste du rendu.

## Limites

- Toujours : conserver la table des 12 faces comme source unique du contenu; garder la couleur du dé configurable; tester l’interaction après toute modification; respecter les contraintes HTML/CSS/JS vanille.
- Demander avant : ajouter une dépendance CDN; ajouter un historique de lancers; ajouter plusieurs dés ou des réglages utilisateur; intégrer le simulateur dans le thème WordPress ou une autre application.
- Ne jamais : supprimer ou modifier la correspondance des faces sans décision explicite; ajouter des composants hors périmètre; masquer les erreurs JavaScript en retirant les vérifications utiles; introduire des secrets ou des données externes.

## Critères de réussite

- La page est utilisable en ouvrant directement `index.html`.
- Un clic sur le bouton déclenche une animation puis affiche une valeur de 1 à 12.
- Les 12 valeurs produisent exactement les faces spécifiées.
- Le dé et le bouton sont visuellement centrés sur un fond blanc.
- La couleur du dé est modifiable depuis une variable CSS dédiée.
- L’animation est perceptible, cohérente et respecte `prefers-reduced-motion`.
- Le bouton et le résultat sont utilisables au clavier et compréhensibles par un lecteur d’écran.
- Aucun framework ni étape de compilation n’est nécessaire.

## Hypothèses actuelles

1. `demo-dice` est une démo statique indépendante, sans intégration WordPress pour cette première version.
2. Le tirage est purement aléatoire côté navigateur et n’a pas de besoin de cryptographie.
3. Il n’y a pas d’historique, de son, de score ou de réglage du nombre de dés dans le périmètre initial.
4. Les symboles `○` et `★` sont rendus comme caractères texte afin de respecter exactement la nomenclature fournie.

## Contrôles de manoeuvrabilité

La page comprend une section « Manoeuvrabilité » avec un menu déroulant proposant `-`, `★`, `★★`, `★★★` ou `S`, ainsi qu’un contrôle segmenté proposant `+`, `=` ou `-`.

Ces contrôles sont utilisables au clavier, conservent leur sélection et restent indépendants du lancer de dé jusqu’à ce qu’une règle de calcul leur soit attribuée.

### Résolution de la manoeuvrabilité

- `-` ajoute zéro étoile.
- `★`, `★★` ou `★★★` ajoutent respectivement une, deux ou trois étoiles en remplissant les cercles vides de la face, dans l’ordre.
- Dans le contrôle segmenté, `=` conserve cette quantité, `+` ajoute une possibilité de remplissage et `-` en retire une, sans passer sous zéro.
- Si au moins un cercle reste vide après l’ajout, le résultat vaut `0`.
- Si tous les cercles sont remplis, le résultat vaut le nombre total d’étoiles visibles.
- Une face composée uniquement d’étoiles donne toujours son nombre d’étoiles, sans ajout supplémentaire.
- `S` affiche d’abord la lettre `S` sur une face vide, puis la transforme en `★★★` et donne un résultat de `3`.
- La face `!` donne toujours `!`, quel que soit le choix du dropdown.

La face originale reste visible avant la résolution. Les cercles se remplissent ensuite de gauche à droite avec une surface blanche qui monte progressivement du bas vers le haut à l’intérieur de chaque cercle, un par un. Si un cercle reste vide, les étoiles créées pendant cette tentative se vident de droite à gauche avec la surface qui redescend, puis la face revient à son état initial avant l’annonce du résultat `0`.

## Questions ouvertes

- Quelle valeur ou quel état doit être affiché avant le premier lancer : une face initiale, un point d’interrogation ou un dé vide ?
- Le titre visible doit-il être simplement « Simulateur de dé » ou avoir un libellé spécifique ?
- Souhaites-tu une forme de dé précise, par exemple un d12 clairement polygonal, ou puis-je choisir la forme CSS qui offre le meilleur compromis entre style et simplicité ?
- Quelle couleur initiale veux-tu utiliser pour le dé ?
