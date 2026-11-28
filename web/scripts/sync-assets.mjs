import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(webRoot, '..');
const srcDir = path.join(repoRoot, 'translated_images', 'zh-TW');
const destDir = path.join(webRoot, 'public', 'course-images');

fs.mkdirSync(destDir, { recursive: true });

if (!fs.existsSync(srcDir)) {
  console.error('Missing translated_images/zh-TW directory:', srcDir);
  process.exit(1);
}

const files = fs.readdirSync(srcDir).filter((f) => /\.(webp|png|jpg|jpeg|svg)$/i.test(f));
let copied = 0;

for (const file of files) {
  const from = path.join(srcDir, file);
  const to = path.join(destDir, file);
  fs.copyFileSync(from, to);
  copied++;
}

console.log(`✓ Synced ${copied} zh-TW course diagrams to web/public/course-images/`);
