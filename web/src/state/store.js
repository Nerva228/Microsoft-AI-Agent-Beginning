import { RANKS, BADGES, ALL_LESSONS } from '../data/index.js';
import { showToast } from '../utils/dom.js';

const STORAGE_KEY = 'agent_quest_tw_state_v1';
const THEME_KEY = 'agent_quest_theme';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultState() {
  return {
    xp: 0,
    streak: 1,
    lastStudyDate: todayKey(),
    lastLessonId: '01',
    goalFilter: 'all',
    lessons: {},
    reviewDeck: [],
    masteredDeck: []
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      ...defaultState(),
      ...parsed,
      lessons: parsed.lessons && typeof parsed.lessons === 'object' ? parsed.lessons : {},
      reviewDeck: Array.isArray(parsed.reviewDeck) ? parsed.reviewDeck : [],
      masteredDeck: Array.isArray(parsed.masteredDeck) ? parsed.masteredDeck : []
    };
  } catch {
    return defaultState();
  }
}

let state = loadState();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in private mode
  }
  for (const fn of listeners) fn(state);
}

function touchStudyStreak() {
  const today = todayKey();
  if (state.lastStudyDate === today) return;
  const prev = new Date(`${state.lastStudyDate}T00:00:00`);
  const cur = new Date(`${today}T00:00:00`);
  const diffDays = Math.round((cur - prev) / 86400000);
  if (diffDays === 1) {
    state.streak = (state.streak || 1) + 1;
    showToast(`🔥 連續學習第 ${state.streak} 天！保持超棒節奏！`);
  } else if (diffDays > 1) {
    state.streak = 1;
  }
  state.lastStudyDate = today;
}

function ensureLessonRecord(lessonId) {
  if (!state.lessons[lessonId]) {
    state.lessons[lessonId] = {
      visited: false,
      simDone: false,
      archDone: false,
      puzzleDone: false,
      quizPassed: false,
      bestStars: 0
    };
  }
  return state.lessons[lessonId];
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getUnlockedBadges(s = state) {
  return BADGES.filter((b) => b.check(s));
}

function awardXpWithBadgeCheck(amount, reasonLabel) {
  const beforeBadges = new Set(getUnlockedBadges(state).map((b) => b.id));
  touchStudyStreak();
  state.xp += amount;
  persist();

  if (amount > 0 && reasonLabel) {
    showToast(`✨ +${amount} XP｜${reasonLabel}`);
  }

  const afterBadges = getUnlockedBadges(state);
  for (const badge of afterBadges) {
    if (!beforeBadges.has(badge.id)) {
      setTimeout(() => {
        showToast(`${badge.emoji} 解鎖新成就徽章：【${badge.name}】！`, 3400);
      }, 450);
    }
  }
}

export function markLessonVisited(lessonId) {
  const rec = ensureLessonRecord(lessonId);
  rec.visited = true;
  state.lastLessonId = lessonId;
  touchStudyStreak();
  persist();
}

export function setGoalFilter(goalId) {
  state.goalFilter = goalId;
  persist();
}

export function completeActivity(lessonId, activityKey, xpBonus, label) {
  const rec = ensureLessonRecord(lessonId);
  if (rec[activityKey]) return false;
  rec[activityKey] = true;
  awardXpWithBadgeCheck(xpBonus, label);
  return true;
}

export function recordQuizResult(lessonId, correctCount, totalCount, baseXpReward) {
  const rec = ensureLessonRecord(lessonId);
  const ratio = correctCount / totalCount;
  const stars = ratio === 1 ? 3 : ratio >= 0.66 ? 2 : ratio > 0 ? 1 : 0;
  const passed = correctCount >= Math.ceil(totalCount * 0.66);

  let earnedXp = 0;
  if (passed && !rec.quizPassed) {
    rec.quizPassed = true;
    earnedXp += baseXpReward;
  } else if (stars > rec.bestStars) {
    earnedXp += 35;
  }

  if (stars > rec.bestStars) {
    rec.bestStars = stars;
  }

  if (earnedXp > 0) {
    awardXpWithBadgeCheck(earnedXp, `通過第 ${lessonId} 課闖關測驗（${stars}★）`);
  } else {
    persist();
  }

  return { stars, passed, earnedXp };
}

export function toggleReviewCard(cardId) {
  const idx = state.reviewDeck.indexOf(cardId);
  if (idx >= 0) {
    state.reviewDeck.splice(idx, 1);
    persist();
    return false;
  }
  state.reviewDeck.push(cardId);
  state.masteredDeck = state.masteredDeck.filter((id) => id !== cardId);
  persist();
  showToast('📌 已加入「待複習牌組」，隨時可在底部單字庫抽考！');
  return true;
}

export function markCardMastered(cardId) {
  if (!state.masteredDeck.includes(cardId)) {
    state.masteredDeck.push(cardId);
    state.reviewDeck = state.reviewDeck.filter((id) => id !== cardId);
    awardXpWithBadgeCheck(5, '熟記一張專有名詞卡');
  }
}

export function getCurrentRank(xp = state.xp) {
  let current = RANKS[0];
  let next = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].minXp) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
    }
  }
  return { current, next };
}

export function getCompletionSummary(s = state) {
  const total = ALL_LESSONS.length;
  const passed = ALL_LESSONS.filter((l) => s.lessons[l.id]?.quizPassed).length;
  const percent = Math.round((passed / total) * 100);
  return { total, passed, percent };
}

export function exportProgressCode() {
  const payload = JSON.stringify(state);
  const bytes = new TextEncoder().encode(payload);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return 'AQTW1:' + btoa(binary);
}

export function importProgressCode(codeStr) {
  const trimmed = String(codeStr || '').trim();
  if (!trimmed.startsWith('AQTW1:')) {
    throw new Error('進度碼格式不正確（需以 AQTW1: 開頭）');
  }
  const b64 = trimmed.slice(6);
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const parsed = JSON.parse(new TextDecoder().decode(bytes));
  if (typeof parsed.xp !== 'number' || typeof parsed.lessons !== 'object') {
    throw new Error('進度碼內容毀損無法解析');
  }
  state = {
    ...defaultState(),
    ...parsed
  };
  persist();
  return state;
}

export function resetProgress() {
  state = defaultState();
  persist();
}

export function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  const meta = document.getElementById('meta-theme-color');
  if (meta) {
    meta.setAttribute('content', next === 'dark' ? '#161a22' : '#f9f7f2');
  }
  for (const fn of listeners) fn(state);
  return next;
}
