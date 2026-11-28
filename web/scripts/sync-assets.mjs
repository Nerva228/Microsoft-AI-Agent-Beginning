import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_LESSONS } from '../src/data/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(webRoot, '..');
const destDir = path.join(webRoot, 'public', 'course-images');

// Build lookup map of original English images across 00-18 lesson images/ and root images/
const englishImageSources = new Map();
const searchDirs = [
  ...fs
    .readdirSync(repoRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^[0-1][0-9]-/.test(entry.name))
    .map((entry) => path.join(repoRoot, entry.name, 'images')),
  path.join(repoRoot, 'images')
];

for (const dir of searchDirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (/\.(webp|png|jpg|jpeg|svg)$/i.test(file) && !englishImageSources.has(file)) {
      englishImageSources.set(file, path.join(dir, file));
    }
  }
}

// Collect exact image filenames referenced by lesson microCards
const neededFiles = new Set();
for (const lesson of ALL_LESSONS) {
  for (const card of lesson.microCards || []) {
    if (card.image?.src) {
      const filename = card.image.src.replace(/^\.\/course-images\//, '');
      neededFiles.add(filename);
    }
  }
}

fs.rmSync(destDir, { recursive: true, force: true });
fs.mkdirSync(destDir, { recursive: true });

let copied = 0;
const missing = [];

for (const filename of neededFiles) {
  const srcPath = englishImageSources.get(filename);
  if (!srcPath) {
    missing.push(filename);
    continue;
  }
  fs.copyFileSync(srcPath, path.join(destDir, filename));
  copied++;
}

if (missing.length > 0) {
  console.error('❌ Missing original English images:', missing.join(', '));
  process.exit(1);
}

console.log(`✓ Synced ${copied} original English course diagrams to web/public/course-images/`);

