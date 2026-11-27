import {
  getState,
  subscribe,
  getCurrentRank,
  getTheme,
  toggleTheme
} from './state/store.js';
import { escapeHtml, initLightboxEvents } from './utils/dom.js';
import { renderMapView } from './views/map-view.js';
import { renderGuideView } from './views/guide-view.js';
import { renderLessonView } from './views/lesson-view.js';
import { renderDeckView } from './views/deck-view.js';
import { renderProfileView } from './views/profile-view.js';

const topBarEl = document.getElementById('top-bar');
const mainStageEl = document.getElementById('main-stage');
const bottomNavEl = document.getElementById('bottom-nav');

const NAV_ITEMS = [
  { id: 'map', href: '#/map', icon: '🗺️', label: '闖關地圖' },
  { id: 'guide', href: '#/guide', icon: '🧭', label: '選課指南' },
  { id: 'deck', href: '#/deck', icon: '🃏', label: '術語牌庫' },
  { id: 'profile', href: '#/profile', icon: '🏆', label: '成就與同步' }
];

function parseRoute() {
  const hash = window.location.hash || '#/map';
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/');

  if (parts[0] === 'lesson' && parts[1]) {
    return { view: 'lesson', lessonId: parts[1].padStart(2, '0'), stage: parts[2] || 'overview' };
  }
  if (['map', 'guide', 'deck', 'profile'].includes(parts[0])) {
    return { view: parts[0] };
  }
  return { view: 'map' };
}

function renderChrome() {
  const st = getState();
  const { current: rank } = getCurrentRank(st.xp);
  const theme = getTheme();
  const route = parseRoute();

  topBarEl.innerHTML = `
    <a href="#/map" class="brand-cluster" aria-label="回到 AI Agent 闖關地圖首頁">
      <img src="./icons/icon-192.png" alt="" class="brand-logo" />
      <div class="brand-titles">
        <span class="brand-name">AI Agent 闖關學</span>
        <span class="brand-rank">${rank.emoji} ${escapeHtml(rank.title)}</span>
      </div>
    </a>

    <div class="hud-stats">
      <span class="hud-chip hud-chip--streak" title="連續學習天數">🔥 ${st.streak}</span>
      <span class="hud-chip hud-chip--xp" title="累積經驗值">✨ ${st.xp} XP</span>
      <button
        type="button"
        id="theme-toggle-btn"
        class="theme-toggle-btn"
        aria-label="${theme === 'dark' ? '切換為日間溫暖淺色模式' : '切換為夜間護眼深色模式'}"
        title="${theme === 'dark' ? '切換日間模式' : '切換夜間模式'}"
      >${theme === 'dark' ? '☀️' : '🌙'}</button>
    </div>
  `;

  topBarEl.querySelector('#theme-toggle-btn')?.addEventListener('click', () => {
    toggleTheme();
  });

  const activeNavId = route.view === 'lesson' ? 'map' : route.view;
  bottomNavEl.innerHTML = NAV_ITEMS.map(
    (item) => `
    <a
      href="${item.href}"
      id="nav-tab-${item.id}"
      class="nav-tab ${activeNavId === item.id ? 'is-active' : ''}"
      aria-current="${activeNavId === item.id ? 'page' : 'false'}"
    >
      <span class="nav-tab-icon" aria-hidden="true">${item.icon}</span>
      <span>${escapeHtml(item.label)}</span>
    </a>`
  ).join('');
}

function renderRoute() {
  renderChrome();
  const route = parseRoute();

  if (route.view === 'lesson') {
    renderLessonView(mainStageEl, route.lessonId, route.stage);
  } else if (route.view === 'guide') {
    renderGuideView(mainStageEl);
  } else if (route.view === 'deck') {
    renderDeckView(mainStageEl);
  } else if (route.view === 'profile') {
    renderProfileView(mainStageEl);
  } else {
    renderMapView(mainStageEl);
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

subscribe(() => {
  renderChrome();
});

window.addEventListener('hashchange', renderRoute);
initLightboxEvents();
renderRoute();

if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
