import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_LESSONS, WORLDS } from '../src/data/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(webRoot, '..');

const BANNED_ML_TERMS = ['服務器', '本機克隆', '拉取請求', '代碼庫', '軟件', '數組', '字節'];
const YT_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

let errors = [];

// 1. Check total lessons = 19 (00..18)
const expectedIds = Array.from({ length: 19 }, (_, i) => String(i).padStart(2, '0'));
const actualIds = ALL_LESSONS.map((l) => l.id);
if (JSON.stringify(expectedIds) !== JSON.stringify(actualIds)) {
  errors.push(`Expected lesson IDs 00..18, got: ${actualIds.join(', ')}`);
}

// 2. Check WORLDS coverage
const worldIds = WORLDS.flatMap((w) => w.lessonIds);
if (JSON.stringify(expectedIds) !== JSON.stringify(worldIds)) {
  errors.push(`WORLDS lessonIds mismatch: ${worldIds.join(', ')}`);
}

// 3. Validate each lesson's structure, assets, links, and terminology
for (const lesson of ALL_LESSONS) {
  const prefix = `[Lesson ${lesson.id}]`;

  if (!lesson.title || !lesson.subtitle) {
    errors.push(`${prefix} Missing title or subtitle`);
  }

  // Videos check
  for (const vid of lesson.videos || []) {
    if (vid.youtubeId.includes('PLACEHOLDER') || !YT_ID_REGEX.test(vid.youtubeId)) {
      errors.push(`${prefix} Invalid or placeholder YouTube ID: "${vid.youtubeId}"`);
    }
  }

  // MicroCards & local images check
  if (!Array.isArray(lesson.microCards) || lesson.microCards.length < 3) {
    errors.push(`${prefix} Expected >= 3 microCards`);
  }
  for (const card of lesson.microCards || []) {
    if (card.image?.src) {
      const rel = card.image.src.replace(/^\.\//, '');
      const fullImgPath = path.join(webRoot, 'public', rel);
      if (!fs.existsSync(fullImgPath)) {
        errors.push(`${prefix} Missing image file in web/public/: ${rel}`);
      }
    }
  }

  // Flow simulator check
  const sim = lesson.flowSimulator;
  if (!sim || !sim.nodes?.length || !sim.scenarios?.length) {
    errors.push(`${prefix} Missing flowSimulator nodes or scenarios`);
  } else {
    const nodeIds = new Set(sim.nodes.map((n) => n.id));
    for (const sc of sim.scenarios) {
      for (const st of sc.steps) {
        if (!nodeIds.has(st.activeNode)) {
          errors.push(`${prefix} Simulator step references unknown activeNode "${st.activeNode}"`);
        }
      }
    }
  }

  // Architect challenge check
  const arch = lesson.architectChallenge;
  if (!arch || !arch.options?.some((o) => o.isBest)) {
    errors.push(`${prefix} Architect challenge missing best option`);
  }

  // CodeLab & Notebook path check
  const lab = lesson.codeLab;
  if (!lab || !lab.notebookPath || !lab.lines?.length || !lab.puzzle) {
    errors.push(`${prefix} Missing codeLab fields`);
  } else {
    const nbFullPath = path.join(repoRoot, lab.notebookPath);
    if (!fs.existsSync(nbFullPath)) {
      errors.push(`${prefix} Notebook path does not exist in repo: ${lab.notebookPath}`);
    }
    if (lab.puzzle.templateParts.length !== lab.puzzle.answers.length + 1) {
      errors.push(`${prefix} Puzzle templateParts length must equal answers.length + 1`);
    }
  }

  // Flashcards & Quiz check
  if (!lesson.flashcards || lesson.flashcards.length < 3) {
    errors.push(`${prefix} Expected >= 3 flashcards`);
  }
  if (!lesson.quiz || lesson.quiz.length < 3) {
    errors.push(`${prefix} Expected >= 3 quiz items`);
  }
  for (const q of lesson.quiz || []) {
    if (q.answerIndex < 0 || q.answerIndex >= q.options.length) {
      errors.push(`${prefix} Quiz answerIndex out of bounds`);
    }
  }

  // Resources URL check
  if (!lesson.resources || lesson.resources.length < 2) {
    errors.push(`${prefix} Expected >= 2 external resources`);
  }
  for (const r of lesson.resources || []) {
    if (!/^https:\/\/.+/.test(r.url) || r.url.includes('PLACEHOLDER')) {
      errors.push(`${prefix} Invalid resource URL: ${r.url}`);
    }
  }

  // Taiwan terminology check
  const serialized = JSON.stringify(lesson);
  for (const bad of BANNED_ML_TERMS) {
    if (serialized.includes(bad)) {
      errors.push(`${prefix} Contains non-Taiwan term "${bad}"`);
    }
  }
}

if (errors.length > 0) {
  console.error('❌ Content validation failed:');
  for (const err of errors) console.error('  -', err);
  process.exit(1);
}

const totalVideos = ALL_LESSONS.reduce((n, l) => n + l.videos.length, 0);
const totalCards = ALL_LESSONS.reduce((n, l) => n + l.flashcards.length, 0);
const totalQuiz = ALL_LESSONS.reduce((n, l) => n + l.quiz.length, 0);
console.log(
  `✓ Validated all ${ALL_LESSONS.length} lessons (00-18) | ${totalVideos} YouTube videos | ${totalCards} Flashcards | ${totalQuiz} Quiz questions | 0 broken paths or banned terms!`
);
