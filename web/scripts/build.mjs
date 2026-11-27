import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const distDir = path.join(webRoot, 'dist');

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

// 1. Copy public/ assets into dist/ root (icons, manifest.webmanifest, sw.js, course-images/)
copyDirRecursive(path.join(webRoot, 'public'), distDir);

// 2. Copy src/ modules & styles into dist/src/
copyDirRecursive(path.join(webRoot, 'src'), path.join(distDir, 'src'));

// 3. Copy index.html & .nojekyll (so GitHub Pages serves ES modules & underscored files directly)
fs.copyFileSync(path.join(webRoot, 'index.html'), path.join(distDir, 'index.html'));
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('✓ Built production bundle into web/dist/ (.nojekyll included)');
