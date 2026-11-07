// Prépare les images à partir de assets/ : lancé avant `dev` et `build`.
// - assets/photos/ : la photo détourée → avatar recadré sur le visage et portrait.
// - assets/projects/<id>/ : toutes les captures, triées par nom de fichier.
// Les sources sont en WebP qualité 85, 1920 px de large au plus, sans métadonnées : elles sont copiées
// telles quelles. Toute autre image (PNG, JPG, WebP trop grand ou avec métadonnées) est convertie
// avec les mêmes réglages. Rien à changer dans le code quand on ajoute ou retire une capture :
// le manifeste est régénéré à chaque fois.
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGE = /\.(png|jpe?g|webp|avif|tiff?)$/i;
const OUT = "public/generated";
const MANIFEST = ".generated/captures.json";
const MAX_WIDTH = 1920;
const QUALITY = 85;

// Cadrage de l'avatar, en fraction de la photo carrée : tête et haut des épaules, comme la maquette.
const FACE = { left: 0.26, top: 0.075, size: 0.5 };

const byName = (a, b) => a.localeCompare(b, "fr", { numeric: true });
const images = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => IMAGE.test(f)).sort(byName) : []);
const slug = (file) =>
  path.parse(file).name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const isFresh = (source, target) => existsSync(target) && statSync(target).mtimeMs >= statSync(source).mtimeMs;

// Copie directe d'un WebP déjà prêt, sinon conversion (une seule compression avec perte).
async function toWebp(source, output) {
  const meta = await sharp(source).metadata();
  const ready = meta.format === "webp" && meta.width <= MAX_WIDTH && !meta.exif && !meta.xmp && !meta.icc;
  if (ready) return copyFileSync(source, output);
  await sharp(source)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);
}

async function photo() {
  const [file] = images("assets/photos");
  if (!file) return console.warn("[assets] aucune photo dans assets/photos/");
  const source = path.join("assets/photos", file);
  mkdirSync(`${OUT}/photo`, { recursive: true });

  const avatar = `${OUT}/photo/avatar.webp`;
  const portrait = `${OUT}/photo/portrait.webp`;
  if (isFresh(source, avatar) && isFresh(source, portrait)) return;

  const { width, height } = await sharp(source).metadata();
  const side = Math.round(Math.min(width, height) * FACE.size);
  await sharp(source)
    .rotate()
    .extract({ left: Math.round(width * FACE.left), top: Math.round(height * FACE.top), width: side, height: side })
    .resize(256, 256)
    .webp({ quality: QUALITY })
    .toFile(avatar);
  await sharp(source).rotate().resize(1080, 1080, { fit: "inside" }).webp({ quality: QUALITY }).toFile(portrait);
  console.log("[assets] photo : avatar et portrait générés");
}

async function captures() {
  const manifest = {};
  const root = "assets/projects";
  const projects = existsSync(root) ? readdirSync(root).filter((d) => statSync(path.join(root, d)).isDirectory()) : [];

  for (const id of projects) {
    const target = `${OUT}/projets/${id}`;
    mkdirSync(target, { recursive: true });
    const kept = new Set();
    manifest[id] = [];

    for (const file of images(path.join(root, id))) {
      const source = path.join(root, id, file);
      const name = `${slug(file)}.webp`;
      const output = path.join(target, name);
      kept.add(name);
      if (!isFresh(source, output)) {
        await toWebp(source, output);
        console.log(`[assets] ${id}/${name}`);
      }
      const { width, height } = await sharp(output).metadata();
      manifest[id].push({ src: `/generated/projets/${id}/${name}`, width, height });
    }

    // Une capture retirée de assets/ disparaît aussi du site.
    for (const old of readdirSync(target)) if (!kept.has(old)) rmSync(path.join(target, old));
  }

  // Dossiers de projets supprimés
  if (existsSync(`${OUT}/projets`)) {
    for (const old of readdirSync(`${OUT}/projets`)) if (!projects.includes(old)) rmSync(`${OUT}/projets/${old}`, { recursive: true });
  }

  mkdirSync(path.dirname(MANIFEST), { recursive: true });
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  const total = Object.values(manifest).reduce((sum, list) => sum + list.length, 0);
  console.log(`[assets] ${total} captures dans ${projects.length} projets`);
}

await photo();
await captures();
