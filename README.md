# demo-dice

Démo statique d’un simulateur de lancer de dé à 12 faces.

## Utilisation

Ouvrir `index.html` dans un navigateur moderne, puis cliquer sur **Lancer le dé**.

La démo fonctionne sans installation, compilation ou dépendance externe.

La configuration principale se trouve au début de `script.js`, dans `appConfig` :

- chaque objet de `diceGroups` crée un groupe avec son `id`, son `title`, son `rollButtonLabel` et son tableau `dices`;
- chaque objet ajouté au tableau `dices` d’un groupe crée un dé; son `id` doit être unique, `label` définit le titre de ses contrôles et `color` définit sa couleur;
- `general.faces` définit le contenu des douze faces communes à tous les dés;
- `general.animation.roll.speed` contrôle la vitesse du brassage et `general.animation.fill.speed` celle du remplacement d’un cercle par une étoile; pour les deux, `0` désactive l’animation, `0.5` est lent, `1` est normal, `2` est rapide et `3` est très rapide;
- `general.generalControleSettings` définit les libellés, les options et les valeurs initiales communes du dropdown et du contrôle segmenté, ainsi que le titre du log;
- `general.generalActions` définit les libellés des boutons d’export, d’import et de sauvegarde, le nom du fichier CSV et la clé de stockage local;

Chaque dé possède sa propre copie des contrôles de manoeuvrabilité et conserve ses sélections indépendamment. Leurs libellés et options proviennent de la même configuration générale. Le bouton d’un groupe lance uniquement les dés de ce groupe.

Chaque dé affiche un log contenant uniquement son dernier lancer : face originale, qualité, modificateur et résultat. Un nouveau lancer remplace le log précédent.

Lors d’un lancer animé, les faces changent progressivement pendant que le dé effectue un mouvement léger. Le résultat final et le log sont calculés à la fin du brassage. Une valeur de `0` est la seule configuration qui désactive l’animation.

Lorsqu’un niveau étoile ou `S` remplit un cercle de la face, une couche de la couleur du symbole monte du bas du cercle jusqu’à le remplir, comme un gaz. Le cercle rempli devient ensuite une étoile. Plusieurs cercles sont remplis avec un léger décalage, puis le résultat et le log sont affichés.

Les actions générales permettent d’exporter les réglages de tous les dés en CSV, de réimporter ce fichier et de sauvegarder les réglages dans le stockage local du navigateur. Une sauvegarde locale valide est restaurée automatiquement au chargement de la page.

Le CSV contient les colonnes `group_id`, `group_title`, `die_id`, `die_label`, `dropdown_value` et `segmented_value`. L’import utilise `die_id`, `dropdown_value` et `segmented_value` pour retrouver et configurer chaque dé.

La spécification et la checklist d’implémentation se trouvent dans `docs/`.
