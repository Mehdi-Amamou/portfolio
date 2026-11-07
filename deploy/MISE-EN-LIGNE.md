# Mise en ligne sur le VPS OVH

Rien n'a été lancé sur le serveur. À faire avec l'accord de Mehdi, dans cet ordre.

Validé en local, sans le VPS : serveur standalone lancé comme sous PM2, derrière le vrai `portfolio.conf` dans un conteneur Nginx (HTTP/2, certificat autosigné) : redirections, en-têtes de sécurité, cache, gzip, CSP, formulaire et bascule de langue. Non testé : `setup-server.sh` et `deploy.sh` eux-mêmes (ils n'ont jamais tourné), Let's Encrypt, le SMTP réel.

## Avant de commencer

- [ ] Nom de domaine acheté. Enregistrements DNS `A` (et `AAAA` si IPv6) de `[domaine]` et `www.[domaine]` vers l'IP du VPS.
- [ ] Accès SSH au VPS, utilisateur avec `sudo`.
- [ ] Compte SMTP : hôte, port, utilisateur, mot de passe.
- [ ] Mémoire du VPS : `next build` demande environ 1,5 Go de libre. Sous 2 Go de RAM, ajouter un fichier swap.
- [ ] Si d'autres sites tournent sur ce VPS : noter leurs ports. Le script s'arrête si 3001 est pris et ne touche ni à leurs sites Nginx, ni à Node, ni à PM2.

## Première installation

```bash
# 1. Copier le dossier deploy et .env.example sur le serveur
ssh <utilisateur>@<serveur> 'mkdir -p ~/portfolio-setup'
rsync -az deploy .env.example <utilisateur>@<serveur>:~/portfolio-setup/

# 2. Installer (paquets manquants, dossiers, certificat, Nginx, PM2 au démarrage)
ssh -t <utilisateur>@<serveur> 'cd ~/portfolio-setup && sudo bash deploy/setup-server.sh [domaine] <email>'

# 3. Renseigner les secrets, sur le serveur uniquement
ssh -t <utilisateur>@<serveur> 'nano /var/www/portfolio/.env'

# 4. Premier déploiement, depuis cet ordinateur
./deploy/deploy.sh <utilisateur>@<serveur>
```

Le `.env` du serveur contient `SITE_URL`, `OG_IMAGE`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` et n'est jamais versionné.

## Mettre le site à jour

```bash
./deploy/deploy.sh <utilisateur>@<serveur>
```

Le build remplace le site en place : il peut répondre mal pendant la minute que dure la commande.

`SITE_URL` et `OG_IMAGE` sont lus au build : après les avoir changés dans le `.env` du serveur, relancer cette commande. Les variables SMTP sont lues à l'exécution.

Déposer un contenu, puis relancer la commande :
- captures : `assets/projects/<id>/` (toutes affichées, triées par nom de fichier ; la première sert de vignette) ;
- photo : `assets/photos/` (avatar et portrait recadrés automatiquement) ;
- CV : `public/cv/cv-fr.pdf` et `public/cv/cv-en.pdf` ;
- site d'un projet en ligne : `"live": true` dans `src/content/projects.json`.

## Vérifier après la mise en ligne

```bash
curl -I https://[domaine]                  # 200, en-têtes de sécurité présents
curl -I http://[domaine]                   # 301 vers https
curl -I https://www.[domaine]              # 301 vers la version sans www
curl -I https://[domaine]/_next/static/    # en-têtes de sécurité aussi sur les statiques
ssh <utilisateur>@<serveur> 'pm2 status portfolio && pm2 logs portfolio --lines 20 --nostream'
```

- Envoyer un vrai message depuis le formulaire et vérifier qu'il arrive dans `CONTACT_TO`.
- Tester le partage du lien (LinkedIn, WhatsApp).
- Lighthouse mobile sur l'adresse réelle.

## À ne pas changer

`HOSTNAME=localhost` dans `ecosystem.config.js` est indispensable. Avec `127.0.0.1` ou `0.0.0.0`, `/` boucle sur une redirection 307 en production (Next compare deux origines qui ne correspondent plus, voir PROGRESS.md). `next start` ne montre pas ce problème, le site standalone si.

## Revenir en arrière

```bash
git checkout <commit-précédent> && ./deploy/deploy.sh <utilisateur>@<serveur> && git checkout main
```
