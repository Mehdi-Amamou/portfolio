#!/usr/bin/env bash
# Première installation, à lancer UNE fois sur le VPS, depuis le dossier du projet :
#   sudo bash deploy/setup-server.sh <domaine> <email-letsencrypt>
# Prudent : ne remplace ni Node, ni PM2, ni aucun site Nginx existant, et s'arrête si le port est pris.
set -euo pipefail

DOMAINE="${1:?Usage : setup-server.sh <domaine> <email>}"
EMAIL="${2:?Usage : setup-server.sh <domaine> <email>}"
PORT=3001
APP_DIR=/var/www/portfolio
SITE=/etc/nginx/sites-available/portfolio
HERE="$(cd "$(dirname "$0")" && pwd)"
OWNER="${SUDO_USER:-$(whoami)}"

[ "$(id -u)" -eq 0 ] || { echo "À lancer avec sudo." >&2; exit 1; }

echo "== Vérifications"
if ss -ltn "sport = :$PORT" | grep -q LISTEN && ! sudo -u "$OWNER" pm2 describe portfolio >/dev/null 2>&1; then
  echo "Le port $PORT est déjà utilisé. Changer PORT ici, dans ecosystem.config.js et portfolio.conf.template." >&2
  exit 1
fi
if grep -rls --include='*' -E "server_name[^;]*\b$DOMAINE\b" /etc/nginx/sites-enabled/ 2>/dev/null | grep -v portfolio; then
  echo "$DOMAINE est déjà déclaré dans un autre site Nginx." >&2
  exit 1
fi

echo "== Paquets manquants"
apt-get update -qq
for package in nginx certbot rsync; do
  dpkg -s "$package" >/dev/null 2>&1 || apt-get install -y -qq "$package"
done

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y -qq nodejs
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
NODE_MINIMUM=20
[ "$NODE_MAJOR" -ge "$NODE_MINIMUM" ] || {
  echo "Node $NODE_MAJOR installé : Next 16 demande Node $NODE_MINIMUM ou plus." >&2
  echo "Il n'est pas remplacé d'office car d'autres sites peuvent en dépendre." >&2
  exit 1
}
command -v pm2 >/dev/null 2>&1 || npm install -g pm2

echo "== Dossiers"
mkdir -p "$APP_DIR" /var/www/certbot
chown -R "$OWNER":"$OWNER" "$APP_DIR"
if [ ! -f "$APP_DIR/.env" ]; then
  sed "s#\[domaine\]#$DOMAINE#" "$HERE/../.env.example" > "$APP_DIR/.env"
  chown "$OWNER":"$OWNER" "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
  echo "   $APP_DIR/.env créé : renseigner SMTP_* avant le premier déploiement."
fi

echo "== Certificat HTTPS"
install -m 644 "$HERE/nginx/security-headers.conf" /etc/nginx/snippets/portfolio-security.conf
if [ ! -d "/etc/letsencrypt/live/$DOMAINE" ]; then
  sed "s/DOMAINE/$DOMAINE/g" "$HERE/nginx/portfolio-acme.conf.template" > "$SITE"
  ln -sf "$SITE" /etc/nginx/sites-enabled/portfolio
  nginx -t
  systemctl reload nginx
  certbot certonly --webroot -w /var/www/certbot -d "$DOMAINE" -d "www.$DOMAINE" \
    --email "$EMAIL" --agree-tos --no-eff-email --non-interactive
fi

echo "== Site Nginx définitif"
sed "s/DOMAINE/$DOMAINE/g" "$HERE/nginx/portfolio.conf.template" > "$SITE"
ln -sf "$SITE" /etc/nginx/sites-enabled/portfolio
nginx -t
systemctl reload nginx

echo "== Renouvellement : recharge Nginx après chaque certificat"
mkdir -p /etc/letsencrypt/renewal-hooks/deploy
install -m 755 /dev/stdin /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'HOOK'
#!/bin/sh
systemctl reload nginx
HOOK

echo "== PM2 au démarrage du serveur"
env PATH="$PATH" pm2 startup systemd -u "$OWNER" --hp "$(eval echo "~$OWNER")" >/dev/null

echo "Terminé. Depuis votre ordinateur : ./deploy/deploy.sh <utilisateur>@<serveur>"
