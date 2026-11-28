import { WORLDS, GOAL_SHORTCUTS, RANKS, BADGES, REPO_BASE_URL } from './curriculum-meta.js';
import { LESSONS_W1 } from './lessons-w1.js';
import { LESSONS_W2 } from './lessons-w2.js';
import { LESSONS_W3 } from './lessons-w3.js';
import { LESSONS_W4 } from './lessons-w4.js';

export const ALL_LESSONS = [
  ...LESSONS_W1,
  ...LESSONS_W2,
  ...LESSONS_W3,
  ...LESSONS_W4
];

export const LESSON_MAP = Object.fromEntries(ALL_LESSONS.map((lesson) => [lesson.id, lesson]));

export const ALL_FLASHCARDS = ALL_LESSONS.flatMap((lesson) =>
  lesson.flashcards.map((card) => ({
    ...card,
    lessonId: lesson.id,
    lessonTitle: lesson.title
  }))
);

export function getLessonById(id) {
  return LESSON_MAP[id] || null;
}

export function getAdjacentLessons(id) {
  const idx = ALL_LESSONS.findIndex((l) => l.id === id);
  return {
    prev: idx > 0 ? ALL_LESSONS[idx - 1] : null,
    next: idx >= 0 && idx < ALL_LESSONS.length - 1 ? ALL_LESSONS[idx + 1] : null
  };
}

export { WORLDS, GOAL_SHORTCUTS, RANKS, BADGES, REPO_BASE_URL };
