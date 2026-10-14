# Spécification : demo-dice

## Objectif

Créer une démo web autonome d’un simulateur de lancer de dé à 12 faces. La personne voit des dés stylisés regroupés sur la page et clique sur le bouton d’un groupe pour obtenir immédiatement de nouvelles valeurs.

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

Le premier état du dé affiche une valeur déterministe ou un état d’attente à définir avant l’implémentation. Le bouton lance les dés de son groupe et affiche immédiatement leurs résultats.

## Stack technique

- HTML vanille pour la structure sémantique.
- CSS vanille pour la mise en page et le style du dé.
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
├── styles.css       → Mise en page et variables de thème
├── script.js        → Tirage, rendu des faces et interactions
├── README.md        → Présentation et mode d’utilisation du projet
└── SPEC.md          → Source de vérité fonctionnelle et visuelle
```

## Direction visuelle

- Fond blanc.
- Module limité au simulateur, sans reproduire le header ni le footer de la page de référence.
- Dés regroupés dans des panneaux bordés sous un titre, avec un bouton d’action bleu directement sous chaque groupe.
- Groupes disposés côte à côte sur grand écran, puis empilés sur tablette et mobile; les dés d’un groupe s’empilent également sur petit écran.
- Forme du dé en pentagone plat à cinq côtés, avec un contour noir et une couleur propre à chaque dé.
- Couleur de chaque dé déclarée dans son objet au sein de `appConfig.diceGroups`, puis transmise à la variable CSS interne `--die-color`.
- Contraste suffisant entre le dé, les symboles et le fond.
- Le bouton doit avoir un état normal, survol et focus clavier.
- Le dropdown et le contrôle segmenté conservent leur ordre au-dessus de chaque dé.

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

Le rendu doit utiliser le contenu de cette configuration plutôt que multiplier des conditions spécifiques dans le HTML ou le CSS. L’objet `appConfig` contient une collection `diceGroups`; chaque groupe définit son identifiant, son titre, le libellé de son bouton et sa collection `dices`. Chaque objet de `dices` crée un dé et définit son identifiant unique, sa couleur et le libellé de sa section de contrôles. Les faces sont définies dans `general`; `general.generalControleSettings` contient les libellés, les options et les valeurs initiales communes du dropdown et du contrôle segmenté, ainsi que le titre du log. Chaque dé reçoit ses propres instances des contrôles et conserve ses sélections indépendamment.

`general.generalActions` contient les libellés configurables des trois boutons généraux, le nom du fichier CSV exporté et la clé de stockage local. `general.animation.roll.speed` contrôle la rapidité du brassage et `general.animation.fill.speed` celle du remplacement d’un cercle par une étoile. Pour chaque animation, `0` la désactive, `0.5` la ralentit de moitié, `1` utilise la vitesse normale et toute valeur supérieure l’accélère proportionnellement.

## Accessibilité et comportement responsive

- Le contrôle de lancer est un vrai élément `button` avec un nom explicite.
- Le résultat courant est exposé à l’aide d’un texte accessible, par exemple via `aria-live="polite"`.
- Le dé doit rester lisible sur mobile, tablette et écran large sans débordement horizontal.
- Le focus clavier doit être visible.
- Pendant le brassage, les faces temporaires changent et le dé bouge; le résultat et le log ne sont remplacés qu’à la fin de l’animation.
- Avec `general.animation.roll.speed: 0`, le brassage est désactivé; avec `general.animation.fill.speed: 0`, les cercles remplis deviennent immédiatement des étoiles.
- Les faces 2 et 3 restent volontairement visuellement vides, mais la valeur numérique doit rester compréhensible par le texte accessible.

## Stratégie de test

La première version ne nécessite pas de framework de test ni de dépendance supplémentaire. La validation se fait dans un navigateur moderne :

1. Vérifier au chargement que le dé, le bouton et le résultat accessible sont présents.
2. Cliquer plusieurs fois sur le bouton et confirmer qu’une valeur comprise entre 1 et 12 est produite.
3. Vérifier chaque correspondance valeur/symboles du tableau ci-dessus.
4. Vérifier que le résultat et le log sont mis à jour immédiatement après le lancer.
5. Vérifier que chaque bouton lance uniquement les dés de son groupe.
6. Vérifier les états clavier, survol et désactivé des boutons.
7. Vérifier l’affichage à une largeur mobile et avec l’option de réduction des mouvements activée.
8. Ajouter un groupe et un dé dans `appConfig.diceGroups`, confirmer leur création, puis modifier la couleur du nouveau dé sans affecter les autres.

## Limites

- Toujours : conserver la table des 12 faces comme source unique du contenu; garder la couleur du dé configurable; tester l’interaction après toute modification; respecter les contraintes HTML/CSS/JS vanille.
- Demander avant : ajouter une dépendance CDN; conserver plusieurs lancers dans le log; donner des options ou des libellés différents selon le dé; intégrer le simulateur dans le thème WordPress ou une autre application.
- Ne jamais : supprimer ou modifier la correspondance des faces sans décision explicite; ajouter des composants hors périmètre; masquer les erreurs JavaScript en retirant les vérifications utiles; introduire des secrets ou des données externes.

## Critères de réussite

- La page est utilisable en ouvrant directement `index.html`.
- Un clic sur le bouton affiche immédiatement une valeur de 1 à 12 pour chaque dé du groupe.
- Les 12 valeurs produisent exactement les faces spécifiées.
- Le dé et le bouton sont visuellement centrés sur un fond blanc.
- Chaque objet de `appConfig.diceGroups` produit un groupe avec son propre bouton; chaque objet de son tableau `dices` produit un dé dont la couleur est configurable indépendamment.
- Le bouton et le résultat sont utilisables au clavier et compréhensibles par un lecteur d’écran.
- Aucun framework ni étape de compilation n’est nécessaire.

## Hypothèses actuelles

1. `demo-dice` est une démo statique indépendante, sans intégration WordPress pour cette première version.
2. Le tirage est purement aléatoire côté navigateur et n’a pas de besoin de cryptographie.
3. Chaque dé possède un log limité à son dernier lancer; il n’y a pas de son ni de score.
4. Les symboles `○` et `★` sont rendus comme caractères texte afin de respecter exactement la nomenclature fournie.

## Contrôles de manoeuvrabilité

Chaque dé comprend sa propre section dont le libellé est défini dans son objet de `dices`, à l’intérieur d’un groupe de `diceGroups`, avec un menu déroulant proposant `-`, `★`, `★★`, `★★★` ou `S`, ainsi qu’un contrôle segmenté proposant `+`, `=` ou `-`. Les libellés de ces deux contrôles, leurs options et leurs valeurs initiales proviennent de `general.generalControleSettings`.

Ces contrôles sont utilisables au clavier. Chaque paire de contrôles conserve sa sélection et agit uniquement sur le dé auquel elle est rattachée.

## Log des dés

Chaque dé affiche son propre log. Il contient uniquement le dernier lancer, présenté sur quatre lignes : valeur et face originales, qualité, modificateur, puis résultat mis en évidence. Le résultat autonome et le titre du log restent accessibles aux lecteurs d’écran, mais ne sont pas répétés visuellement. Un nouveau lancer remplace le contenu précédent.

## Actions générales

Trois boutons indépendants des groupes apparaissent sous le module :

- l’export produit un fichier CSV UTF-8 contenant le groupe, l’identifiant, le libellé, la valeur du dropdown et la valeur du contrôle segmenté de chaque dé;
- l’import lit ce CSV, retrouve chaque dé par `die_id`, valide les valeurs disponibles et applique les réglages compatibles;
- la sauvegarde locale enregistre les réglages actuels dans `localStorage`; ils sont restaurés automatiquement au prochain chargement.

Un statut accessible indique la réussite ou l’échec de chaque opération. L’import d’un CSV ne déclenche pas automatiquement une sauvegarde locale.

### Résolution de la manoeuvrabilité

- `-` ajoute zéro étoile.
- `★`, `★★` ou `★★★` ajoutent respectivement une, deux ou trois étoiles en remplissant les cercles vides de la face, dans l’ordre.
- Dans le contrôle segmenté, `=` conserve cette quantité, `+` ajoute une possibilité de remplissage et `-` en retire une, sans passer sous zéro.
- Si au moins un cercle reste vide après l’ajout, le résultat vaut `0`.
- Si tous les cercles sont remplis, le résultat vaut le nombre total d’étoiles visibles.
- Une face composée uniquement d’étoiles donne toujours son nombre d’étoiles, sans ajout supplémentaire.
- Sur une face vide, `S` affiche d’abord la lettre `S`, puis la transforme en `★★★` et donne un résultat de `3`.
- Sur toute autre face, `S` fournit trois possibilités de remplissage, comme le niveau `★★★`, et respecte le modificateur `+`, `=` ou `-`.
- Lorsque le niveau et le modificateur valent tous les deux `-`, toute face autre que `!` devient vide et donne un résultat de `0`.
- La face `!` donne toujours `!`, quel que soit le choix du dropdown.

Les cercles disponibles se remplissent de la couleur du symbole, du bas vers le haut et de gauche à droite, avant de devenir des étoiles. Avec `general.animation.fill.speed: 0`, ce remplacement est immédiat. Si un cercle reste vide, les étoiles ajoutées restent visibles et le résultat annoncé est `0`.

## Questions ouvertes

- Quelle valeur ou quel état doit être affiché avant le premier lancer : une face initiale, un point d’interrogation ou un dé vide ?
- Le titre visible doit-il être simplement « Simulateur de dé » ou avoir un libellé spécifique ?
- Souhaites-tu une forme de dé précise, par exemple un d12 clairement polygonal, ou puis-je choisir la forme CSS qui offre le meilleur compromis entre style et simplicité ?
- Quelle couleur initiale veux-tu utiliser pour le dé ?
