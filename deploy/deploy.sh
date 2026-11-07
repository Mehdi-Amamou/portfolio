#!/usr/bin/env bash
# Mise à jour du site, depuis l'ordinateur de développement :
#   ./deploy/deploy.sh ubuntu@adresse-du-serveur
# Copie le code, construit sur le serveur (le .env y reste) et recharge PM2.
# Le build remplace les fichiers du site en place : quelques erreurs sont possibles pendant cette minute.
set -euo pipefail

TARGET="${1:?Usage : deploy.sh <utilisateur>@<serveur>}"
APP_DIR=/var/www/portfolio
cd "$(dirname "$0")/.."

rsync -az --delete \
  --exclude .git --exclude node_modules --exclude .next --exclude '.env*' \
  --exclude design --exclude tests --exclude .captures --exclude .lighthouse \
  --exclude test-results --exclude playwright-report --exclude .DS_Store \
  ./ "$TARGET:$APP_DIR/"
rsync -az .env.example "$TARGET:$APP_DIR/.env.example"

ssh "$TARGET" bash -s <<REMOTE
set -euo pipefail
cd "$APP_DIR"
grep -q '^SMTP_HOST=.\+' .env || echo "Attention : SMTP_HOST est vide, le formulaire affichera une erreur."
npm ci --no-audit --no-fund
npm run build
pm2 startOrReload ecosystem.config.js --update-env
pm2 save >/dev/null
sleep 2
curl -fsS -o /dev/null http://127.0.0.1:3001/ && echo "Site en ligne."
REMOTE
