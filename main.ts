import { mkdir, cp, readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || join(__dirname, 'output');

async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

async function copyTree(src: string, dest: string): Promise<void> {
  await ensureDir(dest);
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyTree(srcPath, destPath);
    } else if (entry.isFile()) {
      await cp(srcPath, destPath);
    }
  }
}



async function validate(out: string): void {
  const indexPath = join(out, "game", "index.html");
  const indexStat = await stat(indexPath);
  if (!indexStat.isFile()) {
    throw new Error(`Expected file at ${indexPath}`);
  }

  const screenshotsDir = join(out, "screenshots");
  const files = await readdir(screenshotsDir);
  if (files.length < 3) {
    throw new Error(`Expected at least 3 screenshots, found ${files.length}`);
  }

  console.log(`Validation passed: index.html found and ${files.length} screenshots counted.`);
}

async function main(): Promise<void> {
  await ensureDir(OUTPUT_DIR);

  const gameSrc = join(__dirname, "game");
  const gameDest = join(OUTPUT_DIR, "game");
  await copyTree(gameSrc, gameDest);

  const screenshotsSrc = join(__dirname, "screenshots");
  const screenshotsDest = join(OUTPUT_DIR, "screenshots");
  await copyTree(screenshotsSrc, screenshotsDest);

  const dossier = await buildDossier(OUTPUT_DIR, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000
  });

  const dossierPath = join(OUTPUT_DIR, "dossier.json");
  await writeFile(dossierPath, JSON.stringify(dossier, null, 2), "utf-8");

  await validate(OUTPUT_DIR);
}

await main();
