# PROMPTS — portfolio Mehdi Amamou

Claude Code enchaîne ces étapes seul, dans l'ordre (voir « Façon de travailler » dans CLAUDE.md).
Chaque étape se termine par : lint + build, captures 390 et 1440 comparées à la maquette, commit, mise à jour de PROGRESS.md.
Après une coupure : « Reprends le développement là où PROGRESS.md s'est arrêté ».

---

## Étape 1 — Socle, i18n, header, menus et barre basse

- Crée le projet Next.js dans ce dossier (App Router, TypeScript, ESLint, dossier `src/`, alias `@/*`, sans Tailwind). Si create-next-app refuse le dossier non vide, crée-le dans un dossier temporaire puis déplace les fichiers ici, sans toucher à `design/`, `CLAUDE.md` et `PROMPTS.md`.
- Dépendances : next-intl, motion, gsap, zod, nodemailer (+ @types/nodemailer), Playwright en dev.
- `design/site.css` → `src/app/site.css` (sans modifier les classes) ; `design/images/*` → `public/images/` ; `og-image.png` → `public/og-image.png`. Pas de fichier `opengraph-image` dans `app/` : l'image de partage doit pouvoir être désactivée (voir étape 7).
- Polices Geist et Geist Mono (`next/font`) branchées sur `--font` et `--mono`.
- next-intl : `fr` (défaut, sans préfixe) et `en`, détection Accept-Language + cookie `NEXT_LOCALE`. Génère `messages/fr.json` et `messages/en.json` depuis `design/contenu.json` (clé `messages`), `src/content/projects.ts` (clé `projets`, typé) et `src/content/site.ts` (nav, liens).
- Layout : `<html lang>` selon la locale ; racine `<div class="mh is-motion" style="--screen:100svh"><div class="mh-page">` comme dans la maquette.
- Header : logo « mehdi▌ », navigation (≥ 1024 px), sélecteur FR/EN avec indicateur glissant (layoutId), bouton CV + menu (popover ≥ 768 px, feuille basse en dessous), « Devis gratuit » (≥ 768 px), burger (< 1024 px). Verre qui se tasse au scroll (64 → 56 px) et version sombre `.is-dark` au-dessus des zones sombres (IntersectionObserver sur `#parcours` et le panneau contact).
- Menu mobile plein écran : ouverture en cercle depuis le burger (clip-path), liens numérotés en stagger 60 ms, CV, Devis + WhatsApp ; Échap, focus piégé, scroll bloqué.
- Barre basse téléphone (Devis gratuit + WhatsApp) et barre de progression du scroll (`useScroll` → `scaleX` sous le header).
- Sections vides avec leurs ancres (`#accueil`, `#services`, `#projets`, `#methode`, `#parcours`, `#temoignages`, `#contact`) et footer vide.

## Étape 2 — Hero et préloader

- Hero `#accueil` à l'identique de la maquette.
- Pastille : avatar `public/images/mehdi-avatar-detouree.webp` (`next/image` 64×64, classes `mh-avatar mh-avatar--detouree`, `alt=""`), nom, rôle (≥ 600 px), statut « Ouvert aux projets » avec pastille menthe qui pulse.
- Titre révélé mot par mot : stagger 70 ms (50 ms sur téléphone), y 0,32 em → 0, flou 8 px → 0, opacity ; curseur ▌ qui clignote ensuite ; le groupe surligné reste sur une ligne dès 768 px. Le texte complet reste lisible par les lecteurs d'écran (span visuellement masqué).
- Fond : grille de points, halo indigo qui « respire » (CSS, 9 s), arc d'horizon.
- Fragments flottants (devis, HTTPS, back-office, mini-site) : parallaxe souris ±12 px (`useMotionValue` + `useSpring`) si `pointer: fine` ; sur téléphone, gyroscope ±8 px (DeviceOrientation, permission iOS demandée au premier tap), sinon flottement lent en CSS.
- Boutons « Voir mes projets » / « Me contacter » : scroll doux vers l'ancre, décalé de la hauteur du header. Puces de service.
- Barre basse : elle monte après 600 ms.
- Préloader ≤ 800 ms, seulement à la première visite (sessionStorage) : « mehdi▌ » + barre, puis rideau qui monte (clip-path). Jamais avec reduced-motion.

## Étape 3 — Services et Méthode

Services `#services` (4 cartes et leurs illustrations CSS, à l'identique) :
- Desktop : entrée en stagger 80 ms (y 24 → 0, `whileInView`, once, amount 0.3) ; halo qui suit le pointeur (`--hx` / `--hy` en requestAnimationFrame) + tilt ±3° (`useSpring`), seulement si `pointer: fine`.
- Téléphone : carrousel natif en scroll-snap (aucune librairie), carte suivante visible, compteur « 1 / 4 » + barre liés au scroll (IntersectionObserver), carte centrée scale 0,96 → 1.

Méthode `#methode` (5 étapes) :
- ≥ 1024 px : timeline horizontale ; la ligne indigo se remplit au scroll (GSAP ScrollTrigger, scrub, section épinglée sur ~120 % d'écran) ; chaque étape s'active quand la ligne l'atteint (pastille pleine + halo, texte qui monte de 12 px).
- Téléphone : timeline verticale sans épinglage, remplissage via `useScroll` (offset `["start 70%", "end 60%"]`), étapes en `whileInView`, pastille scale 0,8 → 1.
- GSAP en import dynamique, côté client uniquement.

## Étape 4 — Projets

- Données : `src/content/projects.ts`. Filtres Tous / Sites vitrines / Catalogue & devis / Plateformes avec compteurs ; pastille active glissante (layoutId) ; grille réorganisée avec `AnimatePresence` + `layout`.
- Desktop : grille, Lanergy en vedette sur toute la largeur ; au survol : carte +6 px, ordinateur basculé de 4°, téléphone qui glisse.
- Téléphone : slider plein écran en scroll-snap, compteur 01 / 05 + barre, flèches de 44 px.
- Clic / tap : modale ouverte depuis la carte (layoutId sur le mockup). Desktop : centrée. Téléphone : feuille plein écran qui monte (spring), fermeture en glissant vers le bas (`drag="y"`). Partout : Échap, ✕, clic sur le fond, focus piégé, scroll bloqué, précédent / suivant.
- Avant / après : poignée glissable basée sur `<input type="range">` (doigt et clavier).
- Visuels : composant `ProjectShot` qui affiche l'emplacement « [capture à fournir] » tant que l'image n'existe pas dans `public/projets/<id>/` (`desktop.webp`, `mobile.webp`, `avant.webp`, `apres.webp`).

## Étape 5 — Parcours, Témoignages et Footer

Parcours `#parcours` (zone sombre) :
- Arcs d'horizon en entrée et en sortie (scaleX 0,9 → 1,05 lié au scroll) ; le header passe en version sombre.
- 3 cartes du parcours en stagger 90 ms (x −16 → 0) ; bloc CV avec `/cv/cv-fr.pdf` et `/cv/cv-en.pdf` (attribut `download`).
- Terminal : saisie caractère par caractère (35 ms par caractère, 300 ms entre commandes ; 2× plus rapide sur téléphone), lancée une seule fois à l'entrée (IntersectionObserver), relançable au clic. Tout le texte est dans le DOM dès le départ, seule l'apparition est animée. Barre de titre style Linux, sans pastilles macOS.

Témoignages `#temoignages` : 3 emplacements ; section affichée seulement si `src/content/testimonials.ts` contient de vrais avis (les emplacements restent visibles en dev). Desktop : fondu + y 20 → 0 en stagger 100 ms, guillemets dessinés (pathLength 0 → 1). Téléphone : carrousel scroll-snap.

Footer : mot-symbole géant « mehdi▌ » dont les lettres montent une à une (stagger 50 ms), puis le curseur s'allume et clignote ; « Retour en haut » en scroll doux ; marge basse sur téléphone pour ne pas passer sous la barre.

## Étape 6 — Contact et formulaire

- Panneau sombre (halo CSS lent), badge « Réponse sous 24 h » qui pulse, liens WhatsApp / e-mail / LinkedIn, GitHub `[à fournir]`.
- Formulaire : nom, e-mail, projet, budget indicatif (puces radio). Validation zod côté client (au blur, puis en direct une fois l'erreur affichée) et côté serveur. Erreur = couleur + icône + phrase, résumé « N champs à corriger » en `role="alert"`. Bouton en chargement pendant l'envoi.
- Succès : le formulaire se replie, carte avec coche dessinée (scale 0,4 → 1, spring), récapitulatif, bouton WhatsApp, « Nouveau message ».
- Server Action : honeypot, limite simple par IP (5 envois / 10 min en mémoire), envoi Nodemailer (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` dans `.env`). Crée `.env.example` sans secrets. Réponse dans la langue du visiteur.
- Téléphone : la barre basse se masque quand le formulaire est visible ; `inputMode="email"` ; bouton d'envoi pleine largeur.

## Étape 7 — Finitions, SEO et qualité

- Curseur personnalisé desktop (point + disque « Voir » sur les projets), seulement si `pointer: fine`.
- reduced-motion : vérifie chaque composant (aucune animation, tout le contenu visible tout de suite).
- SEO : metadata FR/EN (title, description), alternates hreflang + canonical, `sitemap.ts`, `robots.ts`, JSON-LD Person (nom, métier, sameAs LinkedIn), favicon « m▌ » (fond #0D0F1A).
- Image de partage en deux versions, choisies par la variable d'environnement `OG_IMAGE` :
  - `avec` (par défaut) : `public/og-image.png` en `og:image` et `twitter:image` (1200×630, texte alternatif), `twitter:card` = `summary_large_image` ;
  - `sans` : aucune balise `og:image` ni `twitter:image`, `twitter:card` = `summary`, tout le reste identique (titre, description, url, langue).
  - Scripts npm : `build` (version avec image) et `build:sans-image` (`OG_IMAGE=sans`). Construis et lance les deux, puis montre-moi les balises `<head>` générées dans chaque cas (FR et EN).
- Accessibilité : navigation clavier complète, axe sans erreur.
- Tests Playwright : aucun scroll horizontal à 390, 768, 1024, 1440 et 1920 ; menu mobile ; menu CV ; modale ; formulaire (erreurs puis succès avec un transport SMTP simulé) ; bascule FR/EN.
- Lighthouse mobile ≥ 95 sur les 4 scores ; corrige ce qui bloque.

## Étape 8 — Mise en ligne sur le VPS OVH

- `next.config` : `output: "standalone"` ; script de build qui copie `.next/static` et `public` dans le dossier standalone.
- PM2 (`ecosystem.config.js`, port libre, par exemple 3001), Nginx en reverse proxy pour `[domaine]` et `www.[domaine]` (redirection vers une seule version), HTTPS Let's Encrypt (certbot), compression, cache long des fichiers statiques, en-têtes de sécurité (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP compatible avec next/font et Motion).
- Variables d'environnement SMTP et `OG_IMAGE` (`avec` ou `sans`) sur le serveur uniquement, jamais dans le dépôt.
- Prépare tout dans le dépôt (configs Nginx et PM2, script de déploiement, checklist), puis demande-moi mon accord et le nom de domaine avant de te connecter au VPS. Donne-moi ensuite la marche à suivre pour mettre le site à jour.
