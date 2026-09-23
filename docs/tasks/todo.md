# Tâches : demo-dice

## Phase 1 : Fondation

- [x] Tâche 1 : créer la structure HTML accessible et les points d’ancrage du dé
  - Acceptation : `index.html` contient une structure sémantique, un dé, un bouton de lancer et une zone de statut accessible.
  - Vérification : ouvrir `index.html` directement et confirmer que les contrôles sont présents et utilisables au clavier.
  - Fichiers : `index.html`
  - Dépendances : aucune
  - Taille : S

- [x] Tâche 2 : créer le thème visuel, la mise en page responsive et les états de base
  - Acceptation : le fond est blanc, le dé est centré, `--die-color` contrôle sa couleur et le bouton possède ses états normal, survol, focus et désactivé.
  - Vérification : redimensionner la fenêtre sur mobile et desktop; modifier `--die-color` dans les outils développeur.
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

- [x] Tâche 4 : ajouter le tirage aléatoire, l’animation et le verrouillage du bouton
  - Acceptation : un clic tire une valeur entre 1 et 12, anime le dé, affiche le résultat final et empêche les clics concurrents pendant l’animation.
  - Vérification : cliquer plusieurs fois, observer l’animation et vérifier que le bouton revient à son état actif à la fin.
  - Fichiers : `script.js`, `styles.css`
  - Dépendances : Tâche 3
  - Taille : M

## Point de contrôle : Fonctionnalité principale

- [x] Les valeurs produites restent dans l’intervalle 1–12.
- [x] Les douze correspondances sont exactes.
- [x] Le bouton est verrouillé pendant l’animation.

## Phase 3 : Accessibilité et finition

- [x] Tâche 5 : prendre en charge la réduction des mouvements et les états clavier
  - Acceptation : `prefers-reduced-motion: reduce` réduit l’animation; le focus est visible; le résultat est annoncé par une zone `aria-live` sans dépendre uniquement de la couleur ou du mouvement.
  - Vérification : naviguer au clavier et activer la réduction des mouvements dans les réglages du navigateur ou du système.
  - Fichiers : `styles.css`, `script.js`
  - Dépendances : Tâche 4
  - Taille : S

- [ ] Tâche 6 : documenter l’utilisation et effectuer la validation manuelle complète
  - Acceptation : `README.md` explique comment ouvrir la démo et la checklist de la spec est vérifiée.
  - Vérification : refaire les vérifications de chargement, rendu des douze faces, animation, responsive, clavier et personnalisation de couleur.
  - Fichiers : `README.md`
  - Dépendances : Tâches 1 à 5
  - Taille : S

- [x] Tâche 7 : ajouter les contrôles de manoeuvrabilité
  - Acceptation : la page contient un menu avec `-`, `★`, `★★`, `★★★`, `S`, ainsi qu’un contrôle segmenté `+`, `=`, `-`.
  - Vérification : sélectionner chaque valeur et chaque opérateur au clavier et à la souris.
  - Fichiers : `index.html`, `styles.css`
  - Dépendances : Tâche 5
  - Taille : S

- [ ] Tâche 8 : résoudre le résultat du dé selon le dropdown et le contrôle segmenté
  - Acceptation : la face originale reste visible; les étoiles sélectionnées remplissent les cercles de gauche à droite; `+` ajoute une possibilité de remplissage, `-` en retire une et `=` conserve la valeur; si un cercle reste vide, les étoiles nouvellement remplies se vident de droite à gauche et le résultat vaut `0`; `S` transforme une face vide en `★★★`; `!` reste toujours `!`.
  - Vérification : tester les cas `★○` avec `★`, `★○○` avec `★`, une face uniquement composée d’étoiles, une face vide avec `S` et la face `!`.
  - Fichiers : `script.js`, `styles.css`
  - Dépendances : Tâche 7
  - Taille : M

## Point de contrôle : Terminé

- [ ] Tous les critères de réussite de `SPEC.md` sont satisfaits.
- [ ] La revue humaine du rendu et du comportement est terminée.
- [ ] Aucun commit n’est créé dans le cadre de cette étape.
