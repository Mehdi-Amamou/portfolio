# Portfolio — Mehdi Amamou

Site one-page bilingue (FR par défaut, EN) pour trouver des clients en freelance : PME, commerçants, artistes, associations.
Mehdi Amamou : étudiant ingénieur en 4e année de génie informatique (cybersécurité) à l'École Polytechnique de Sousse, président de Securinets EPS, développeur web freelance (Symfony, Next.js, back-office inclus, hébergement et mise en ligne inclus). Il travaille en français, en anglais et en arabe.

70 % des visiteurs sont sur téléphone : on conçoit d'abord en 390 px. Le site sert lui-même de démonstration : spectaculaire, mais fluide (60 fps sur un téléphone moyen) et léger.

## La maquette fait foi : dossier `design/` (lecture seule)

| Fichier | Rôle |
|---|---|
| `design/maquette.html` | La page complète en HTML statique (FR). Ouvre-la à 390, 768, 1024, 1440 et 1920 px : c'est la cible visuelle. |
| `design/site.css` | Toute la feuille de style : tokens, composants, responsive en container queries (`.mh` est le conteneur). |
| `design/contenu.json` | Tous les textes FR/EN (`messages`), les 5 projets (`projets`), la navigation, les liens. |
| `design/etats-telephone.png`, `design/etats-desktop.png` | Les états : menu mobile, menu CV, carte au survol / au tap, modale projet, formulaire (erreurs, envoyé), hero en anglais, préloader. |
| `design/images/` | Avatar et portrait détourés, image Open Graph. |

Reproduis la maquette, ne la réinvente pas. Garde la structure HTML et les classes `.mh-*`. Ne modifie jamais `design/`. Si un détail manque ou se contredit, demande-moi.

Notes sur la maquette :
- `is-hover`, `is-tap`, `is-pressed`, `is-focus` figent des états pour la maquette : en production, utilise les vrais `:hover`, `:active`, `:focus-visible` et `whileTap`.
- Header, barre basse, menus et modale vivent dans une couche sticky (`.mh-fixed > .mh-vp`). Tu peux passer en `position: fixed` ou en portail si c'est plus simple, tant que le rendu reste identique.
- Fragments flottants, illustrations des services et mockups ordinateur + téléphone sont en CSS pur : pas d'images.

## Stack

- Next.js (dernière version stable, App Router, TypeScript, dossier `src/`). Server Components par défaut, `"use client"` seulement pour l'interactif.
- CSS : `design/site.css` copiée en `src/app/site.css` et importée dans le layout. Pas de Tailwind.
- Polices : Geist et Geist Mono via `next/font`, branchées sur `--font` et `--mono`.
- i18n : next-intl, `fr` (défaut, sans préfixe) et `en` (`/en`). Détection Accept-Language au premier passage puis cookie `NEXT_LOCALE`. Le sélecteur FR/EN change de langue sans recharger toute la page. Balises hreflang.
- Animations : Motion (`motion/react`) pour les composants ; GSAP + ScrollTrigger seulement pour la timeline Méthode et l'horizon (import dynamique). Avec `prefers-reduced-motion`, tout est coupé (`useReducedMotion`).
- Formulaire : Server Action + zod + honeypot + limite par IP, envoi d'e-mail via Nodemailer (SMTP dans `.env`, jamais commité).
- Production : VPS OVH (Ubuntu) avec PM2 + Nginx + Let's Encrypt, `output: "standalone"`.

## Règles

- Mobile d'abord : aucun scroll horizontal, marges de 20 px, zones tactiles ≥ 44 px, texte courant ≥ 16 px, champs de formulaire à 16 px.
- Rien d'inventé : pas de faux avis, de faux logos, de chiffres ou de captures inventés. Tout ce qui est entre crochets `[ ]` reste un emplacement visible jusqu'à ce que je fournisse le contenu.
- Témoignages : section masquée en production tant qu'il n'y a pas de vrais avis.
- Accessibilité AA : contrastes de `site.css`, focus visible, vrais `<button>` / `<a>`, `aria-label` sur les boutons-icônes, modales avec focus piégé + Échap + scroll bloqué, `alt` pertinents.
- Aucun effet qui dépend du survol sur écran tactile : curseur personnalisé, halo et tilt seulement si `(pointer: fine)`.
- Performance : Lighthouse mobile ≥ 95 ; n'animer que `transform` et `opacity` ; `next/image` ; JS minimal (GSAP et terminal en import dynamique).

## Contenu à fournir par Mehdi (laisser les emplacements)

Captures des projets (ordinateur + téléphone), captures avant / après, `public/cv/cv-fr.pdf` et `public/cv/cv-en.pdf`, lien GitHub, fourchettes de budget en DT, résultats d'Etadames et du site FTE, nombre de membres de la plateforme Securinets, projet 5, avis clients, nom de domaine.

## Façon de travailler (en autonomie)

- Enchaîne les étapes 1 à 7 de `PROMPTS.md` sans attendre mon feu vert entre les étapes.
- Fin de chaque étape : `npm run lint` et `npm run build` sans erreur ; captures Playwright à 390×844 et 1440×900 (attendre 1,5 s pour les animations d'entrée) comparées à `design/maquette.html` à la même taille ; correction des écarts ; commit git en français (push si un remote existe) ; mise à jour de `PROGRESS.md` (étapes faites, reste à faire, infos manquantes).
- S'il manque une information (domaine, SMTP, captures, CV…), garde l'emplacement, note-le dans `PROGRESS.md` et continue. Ne t'arrête que si tu es vraiment bloqué.
- Étape 8 (serveur) : prépare tout (configuration, scripts, commandes), mais demande-moi avant de te connecter au VPS ou d'y modifier quoi que ce soit.
- Si la session est coupée, reprends là où `PROGRESS.md` s'est arrêté.
- À la fin : lance le site en local, donne-moi l'adresse, puis la liste courte de ce que je dois fournir.
- En cas de doute, la maquette gagne.
