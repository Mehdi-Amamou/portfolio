const path = require("node:path");

module.exports = {
  apps: [
    {
      name: "portfolio",
      script: path.join(__dirname, ".next/standalone/server.js"),
      cwd: path.join(__dirname, ".next/standalone"),
      // Les secrets restent dans le .env du serveur, jamais dans le dépôt.
      // ipv4first : « localhost » doit écouter sur 127.0.0.1, là où Nginx se connecte.
      node_args: `--env-file=${path.join(__dirname, ".env")} --dns-result-order=ipv4first`,
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        // Toujours « localhost », jamais 127.0.0.1 ni 0.0.0.0 : Next ramène l'URL vue par proxy.ts à
        // localhost mais pas la sienne, et la réécriture de / vers /fr boucle si les deux diffèrent.
        HOSTNAME: "localhost",
      },
    },
  ],
};
