# Tâches : demo-dice

## Phase 1 : Fondation

- [x] Tâche 1 : créer la structure HTML accessible et les points d’ancrage du dé
  - Acceptation : `index.html` contient une structure sémantique, un dé, un bouton de lancer et une zone de statut accessible.
  - Vérification : ouvrir `index.html` directement et confirmer que les contrôles sont présents et utilisables au clavier.
  - Fichiers : `index.html`
  - Dépendances : aucune
  - Taille : S

- [x] Tâche 2 : créer le thème visuel, la mise en page responsive et les états de base
  - Acceptation : le fond est blanc, les groupes et les dés sont centrés, chaque groupe possède son titre et son bouton, chaque dé contrôle son identifiant et sa couleur, et les boutons possèdent leurs états normal, survol, focus et désactivé.
  - Vérification : redimensionner la fenêtre sur mobile et desktop; ajouter un groupe et un dé dans la configuration, puis modifier sa couleur.
  - Fichiers : `styles.css`
  - Dépendances : Tâche 1
  - Taille : S

## Point de contrôle : Fondation

- [x] La page s’ouvre sans compilation.
- [x] Le rendu de base est lisible sur mobile et desktop.

## Phase 2 : Fonctionnalité principale

- [x] Tâche 3 : ajouter la table des 12 faces et le rendu du résultat
  - Acceptation : une configuration unique contient les valeurs 1 à 12 et le rendu affiche exactement `!`, les faces vides, `○` et `★` selon la spec.
  - Vérification : forcer temporairement chaque valeur depuis la console ou le code de test manuel et contrôler le contenu affiché.
  - Fichiers : `script.js`
  - Dépendances : Tâches 1 et 2
  - Taille : S

- [x] Tâche 4 : ajouter le tirage aléatoire et la mise à jour immédiate du résultat
  - Acceptation : un clic tire une valeur entre 1 et 12 pour chaque dé du groupe et affiche immédiatement leurs résultats.
  - Vérification : lancer chaque groupe et confirmer que seuls ses dés sont mis à jour.
  - Fichiers : `script.js`, `styles.css`
  - Dépendances : Tâche 3
  - Taille : M

## Point de contrôle : Fonctionnalité principale

- [x] Les valeurs produites restent dans l’intervalle 1–12.
- [x] Les douze correspondances sont exactes.
- [x] Chaque bouton agit uniquement sur son groupe.

## Phase 3 : Accessibilité et finition

- [x] Tâche 5 : prendre en charge la réduction des mouvements et les états clavier
  - Acceptation : le focus est visible et le résultat est annoncé par une zone `aria-live` sans dépendre uniquement de la couleur.
  - Vérification : naviguer au clavier et activer la réduction des mouvements dans les réglages du navigateur ou du système.
  - Fichiers : `styles.css`, `script.js`
  - Dépendances : Tâche 4
  - Taille : S

- [ ] Tâche 6 : documenter l’utilisation et effectuer la validation manuelle complète
  - Acceptation : `README.md` explique comment ouvrir la démo et la checklist de la spec est vérifiée.
  - Vérification : refaire les vérifications de chargement, rendu des douze faces, responsive, clavier et personnalisation de couleur.
  - Fichiers : `README.md`
  - Dépendances : Tâches 1 à 5
  - Taille : S

- [x] Tâche 7 : ajouter les contrôles de manoeuvrabilité
  - Acceptation : chaque dé possède son propre libellé de section, un menu avec `-`, `★`, `★★`, `★★★`, `S`, ainsi qu’un contrôle segmenté `+`, `=`, `-`; les sélections sont indépendantes, tandis que les réglages du dropdown et du contrôle segmenté viennent de `general.generalControleSettings`.
  - Vérification : sélectionner chaque valeur et chaque opérateur au clavier et à la souris.
  - Fichiers : `index.html`, `styles.css`
  - Dépendances : Tâche 5
  - Taille : S

- [ ] Tâche 8 : résoudre le résultat du dé selon le dropdown et le contrôle segmenté
  - Acceptation : les étoiles sélectionnées remplacent immédiatement les cercles de gauche à droite; `+` ajoute une possibilité de remplissage, `-` en retire une et `=` conserve la valeur; si un cercle reste vide, les étoiles ajoutées restent visibles et le résultat vaut `0`; `S` équivaut à `★★★` sur les faces non vides et transforme une face vide en `★★★`; la combinaison niveau `-` et modification `-` vide toute face autre que `!` et donne `0`; `!` reste toujours `!`.
  - Vérification : tester les cas `★○` avec `★`, `★○○` avec `★`, une face uniquement composée d’étoiles, une face avec des cercles et `S`, une face vide avec `S`, plusieurs faces avec la combinaison `-`/`-` et la face `!`.
  - Fichiers : `script.js`, `styles.css`
  - Dépendances : Tâche 7
  - Taille : M

- [x] Tâche 9 : afficher le log du dernier lancer pour chaque dé
  - Acceptation : chaque lancer remplace le log du dé par quatre lignes lisibles présentant la face originale, la qualité, le modificateur et le résultat mis en évidence.
  - Vérification : lancer plusieurs groupes avec des réglages différents et confirmer que chaque log affiche uniquement le dernier lancer du dé concerné.
  - Fichiers : `script.js`, `styles.css`
  - Dépendances : Tâche 8
  - Taille : S

- [x] Tâche 10 : ajouter les actions générales de gestion des settings
  - Acceptation : les libellés des trois boutons sont configurables; l’export télécharge tous les réglages en CSV; l’import applique les valeurs compatibles à tous les dés correspondants; la sauvegarde locale est restaurée au chargement.
  - Vérification : exporter des réglages variés, les modifier, réimporter le CSV, puis sauvegarder et recharger la page.
  - Fichiers : `index.html`, `script.js`, `styles.css`
  - Dépendances : Tâche 7
  - Taille : M

- [x] Tâche 11 : ajouter une animation de brassage configurable
  - Acceptation : `general.animation.roll.speed` contrôle proportionnellement la durée et la rapidité du brassage; `0` affiche immédiatement le résultat; le log et la face finale sont mis à jour à la fin de l’animation.
  - Vérification : tester les vitesses `0`, `0.5`, `1`, `2` et `3`.
  - Fichiers : `script.js`, `styles.css`
  - Dépendances : Tâche 4
  - Taille : S

- [x] Tâche 12 : animer le remplissage des cercles
  - Acceptation : chaque cercle rempli par un niveau étoile ou `S` se transforme visuellement en étoile; `general.animation.fill.speed` contrôle la vitesse et `0` rend le remplacement immédiat.
  - Vérification : tester une face avec un, deux et trois cercles, avec un niveau étoile puis avec `S`, aux vitesses `0`, `0.5`, `1`, `2` et `3`.
  - Fichiers : `script.js`, `styles.css`
  - Dépendances : Tâche 8
  - Taille : S

## Point de contrôle : Terminé

- [ ] Tous les critères de réussite de `SPEC.md` sont satisfaits.
- [ ] La revue humaine du rendu et du comportement est terminée.
- [ ] Aucun commit n’est créé dans le cadre de cette étape.
