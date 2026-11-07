# PROGRESS — portfolio Mehdi Amamou

Reprise après coupure : « Reprends le développement là où PROGRESS.md s'est arrêté ».

## Étapes

- [x] 1. Socle, i18n, header, menus, barre basse
- [x] 2. Hero et préloader
- [x] 3. Services et Méthode
- [x] 4. Projets
- [x] 5. Parcours, Témoignages, Footer
- [x] 6. Contact et formulaire
- [x] 7. Finitions, SEO, qualité
- [x] 8. Mise en ligne VPS : préparation terminée. **En attente de Mehdi** : domaine, accès SSH, SMTP et accord avant toute connexion. Voir `deploy/MISE-EN-LIGNE.md`.

## Décisions

- Le plan s'appelle `PROMPTS_1.md` dans ce dossier (CLAUDE.md dit `PROMPTS.md`) : fichier laissé tel quel.
- Next 16 : `src/proxy.ts` remplace `middleware.ts`. `cacheComponents` désactivé, le site est 100 % statique (SSG).
- Sélecteur FR/EN : indicateur glissant de `site.css` (`.mh-lang::before` + `.is-en`) au lieu de `layoutId`. Même rendu, moins de JS, et deux sélecteurs (header, footer) ne se gênent pas. État optimiste pour que l'indicateur glisse pendant le changement de langue.
- `src/app/site.css` est la copie exacte de la maquette ; tout ajout de production est dans `src/app/extras.css`.
- « Avis » : absent du menu desktop et du footer (comme la maquette), présent dans le menu mobile seulement si la section Témoignages est affichée.
- Header : la hauteur (64 → 56 px) passe en transition CSS `height`. C'est la seule exception à « transform et opacity » ; elle ne joue qu'une fois au franchissement du seuil, sur un élément isolé.

- Préloader : script inline + CSS, sans React ni dépendance au chargement du JS. Les animations du hero sont en pause pendant qu'il joue (`html[data-pre]`).
- Fragments du hero : décalage écrit sur la propriété CSS `translate` pour garder les `transform: rotate()` de la maquette.
- Ancres : `scroll-margin-top` calculé pour poser le contenu juste sous le header malgré le padding de section, sans JS.

- Méthode : l'épinglage est un `position: sticky` en CSS (`extras.css`), GSAP ne fait que le scrub. `.mh` étant un container query, un `position: fixed` à l'intérieur (ce qu'utilise le pin de GSAP) peut se caler sur le conteneur selon les navigateurs ; le sticky évite ce risque et garde la même hauteur de page avant et après le chargement du JS. Sous 760 px de haut, pas d'épinglage (le contenu ne tiendrait pas).
- Apparitions au scroll : le contenu est visible par défaut, le JS ne l'« arme » qu'à l'hydratation s'il est sous la ligne de flottaison (`use-reveal.ts`). Détection `inView` de Motion, animation en CSS. Un JS qui échoue ne masque donc jamais rien.

- Projets : le survol des cartes utilise les propriétés CSS `translate` et `scale`, car `layout` de Motion laisse `transform: none` en inline. Pastille de filtre en `layoutId` (ajout d'un `span.mh-filter-pill`, rendu identique à `.mh-filter.is-on`).
- Modale : le `layoutId` ne vaut que pour le projet d'ouverture ; après précédent / suivant, seul le texte change en fondu.
- Captures : un fichier `public/projets/<id>/{desktop,mobile,avant,apres}.webp` remplace l'emplacement au prochain build.

- Écart assumé avec la maquette : liens de navigation éclaircis sur le header sombre. `site.css` les laisse gris foncé sur fond sombre, contraste insuffisant (règle AA de CLAUDE.md).
- Terminal : texte rendu côté serveur, seul le code de frappe (`terminal-typing.ts`) est en import dynamique. Bouton « Rejouer » masqué, visible au focus clavier. Seules les commandes sont tapées ; les sorties apparaissent ligne par ligne, comme dans un vrai terminal.
- Mot-symbole : chaque lettre porte son propre dégradé, car `background-clip: text` ne suit pas des enfants transformés.
- Témoignages : numérotation « 05 → 07 » dans les eyebrows tant que la section 06 est masquée en production (textes de la maquette gardés).

- Formulaire : `useActionState` + `<form action>`, il fonctionne donc aussi sans JavaScript. `zod/mini` pour limiter le poids côté client. Budget en `<button aria-pressed>` comme la maquette, à sélection unique.
- SMTP : sans `SMTP_HOST`, le développement simule l'envoi (console). En production sans SMTP, le visiteur voit le message d'erreur avec le renvoi vers WhatsApp : jamais de faux « Message envoyé ». `SMTP_MOCK=1` force la simulation pour les tests.
- Limite par IP : `X-Real-IP` posé par Nginx en priorité. Le début de `X-Forwarded-For` est falsifiable par le client.
- Textes ajoutés hors `contenu.json` (fonctionnels, à relire) : `contact.errRate`, `contact.errSend`, `about.termReplay`, `meta.*`, `notFound.*`.

- `NextIntlClientProvider` retiré : aucun composant client ne traduit, les textes arrivent en props. 16 Ko de JS en moins (chunk `IntlMessageFormat`). Le sélecteur de langue écrit lui-même le cookie `NEXT_LOCALE`.
- Corrections d'accessibilité : `cvAria` EN passé à « Download my CV (résumé) » (WCAG 2.5.3, le nom accessible doit contenir le texte visible « CV ») ; zones défilantes atteignables au clavier ; logo à 44 px de zone tactile ; barre basse dans un `<nav>`.
- Safari ne donne pas le focus à un bouton cliqué : les déclencheurs se le donnent eux-mêmes pour que le focus revienne bien à la fermeture.
- Tests : `npm test` (Chromium). Sur macOS 14, Playwright 1.65 ne pilote plus son WebKit figé (`Unknown setting: PushAPIEnabled`). La même suite a été passée sur WebKit 26 avec Playwright 1.56 dans un dossier temporaire : 31 réussis, 10 ignorés (axe et cas réservés à Chromium).
- Lighthouse mobile mesuré avec `Accept-Language: fr` et `SITE_URL` égal à l'adresse testée : sinon le Chrome de Lighthouse subit une redirection vers `/en` et le canonical pointe ailleurs, ce qui fausse les scores.
- Balises des deux versions de l'image de partage : `docs/balises-partage.md`.

## Résultats étape 7

- Lighthouse mobile FR et EN : Performance 100, Accessibilité 100, Bonnes pratiques 100, SEO 100 (LCP 0,9 s, TBT 30 ms, CLS 0), mesuré en local sur `next start`.
- Géométrie comparée à la maquette à 390, 768, 1024, 1440 et 1920 px : aucun écart, hormis le `scale(.96)` demandé sur les cartes services non centrées à 390 px.
- Playwright Chromium 41/41, axe sans violation (pages, menu, modale, formulaire en erreur).

## Résultats étape 8

- `output: "standalone"` ; `npm run build` copie `.next/static` et `public` dans le dossier standalone ; `npm start` lance ce serveur.
- Bug bloquant trouvé et corrigé : avec `HOSTNAME=127.0.0.1` (ou `0.0.0.0`), `/` bouclait en 307 en standalone et renvoyait 500 derrière Nginx. Next ramène l'URL de `request.url` à `localhost` mais pas son `initUrl` (`resolve-routes.js`, ligne 118) : la réécriture de next-intl vers `/fr` passait pour externe. Correction : `HOSTNAME=localhost` et `--dns-result-order=ipv4first` pour écouter sur 127.0.0.1. Invisible avec `next start`.
- Nginx validé dans un conteneur avec `portfolio.conf`, sur les ports 80 et 443 : tout passe, sans erreur navigateur ni violation CSP.
- `Permissions-Policy` ne bloque volontairement ni `gyroscope` ni `accelerometer`, sinon la parallaxe du hero s'arrête sur Android.
- CSP avec `'unsafe-inline'` : les scripts inline de Next sur des pages statiques ne permettent pas de nonce. Risque limité ici, le site n'affiche aucun contenu tiers.

## Mise à jour : photo, coordonnées, galerie, liens des sites, terminal

- Photo : `assets/photos/` (et non `assets/images/`). C'est le même cliché que la maquette, en HD. `scripts/prepare-assets.mjs` en tire l'avatar recadré sur le visage (cadrage identique à la maquette) et un portrait (JSON-LD), sans métadonnées. La maquette ne prévoit une photo qu'à un endroit, l'avatar du hero ; l'image Open Graph contient déjà ce même cliché. Aucun emplacement photo n'a été ajouté dans Parcours (le design n'en a pas).
- Captures : `assets/projects/<id>/`, toutes affichées, triées par nom de fichier, converties en WebP sans métadonnées dans `public/generated/` (non versionné) avec un manifeste `.generated/captures.json`. Le script tourne avant `dev` et `build` : ajouter ou retirer une capture ne demande aucun changement de code. La première capture remplit l'écran de l'ordinateur ; le téléphone garde « [capture] » tant qu'aucune capture en hauteur n'existe dans le dossier.
- Galerie à la place de l'avant / après (composant, styles, textes et données supprimés, y compris le bloc `.mh-ba` de `src/app/site.css`) : scroll-snap natif, flèches et clavier, compteur, zoom plein écran, seules les captures voisines sont chargées. Échap ferme d'abord le zoom, puis la modale (pile de couches dans `use-focus-trap.ts`).
- Projets : données dans `src/content/projects.json`, champs `url` et `live`. `live: false` affiche « Bientôt en ligne » désactivé.
- Coordonnées réelles (WhatsApp avec message pré-rempli FR/EN, LinkedIn, GitHub) ; liens externes en `target="_blank" rel="noopener noreferrer"` avec `aria-label` « … (nouvel onglet) ».
- Terminal : invite `$`, titre `~/portfolio`, plus aucun nom d'utilisateur. Aucune occurrence de « root » dans le HTML de production FR et EN.
- next/image : AVIF puis WebP (`images.formats`).

## Manque (emplacements gardés)

- Domaine, SMTP, CV PDF, budgets en DT, résultats Etadames et FTE, nombre de membres Securinets, projet 5, avis clients, année de chaque projet, captures en hauteur pour l'écran du téléphone, mise en ligne de Lanergy et Etadames (`live`).
