import {
  WORLDS,
  GOAL_SHORTCUTS,
  ALL_LESSONS,
  getLessonById
} from '../data/index.js';
import {
  getState,
  setGoalFilter,
  getCompletionSummary,
  getCurrentRank
} from '../state/store.js';
import { escapeHtml } from '../utils/dom.js';

export function renderMapView(container) {
  const st = getState();
  const summary = getCompletionSummary(st);
  const { current: rank, next: nextRank } = getCurrentRank(st.xp);

  const nextUnfinished =
    ALL_LESSONS.find((l) => !st.lessons[l.id]?.quizPassed) ||
    getLessonById(st.lastLessonId) ||
    ALL_LESSONS[0];

  const activeGoal =
    GOAL_SHORTCUTS.find((g) => g.id === st.goalFilter) || GOAL_SHORTCUTS[0];
  const highlightSet = activeGoal.lessonIds ? new Set(activeGoal.lessonIds) : null;

  container.innerHTML = `
    <section aria-labelledby="map-main-heading">
      <div class="section-header">
        <div class="section-eyebrow">Microsoft AI Agents for Beginners · 台灣繁中互動版</div>
        <h1 id="map-main-heading" class="page-title">AI Agent 技能樹闖關地圖</h1>
        <p class="page-subtitle">
          涵蓋 00–18 共 19 堂課，全部關卡皆可隨時自由點開！透過動態模擬、架構決策與免打字拼圖輕鬆吸收。
        </p>
      </div>

      <div class="continue-banner">
        <div class="continue-top">
          <div>
            <div style="font-size:0.78rem;font-weight:800;color:var(--brand-text);">
              ${rank.emoji} 目前稱號：${escapeHtml(rank.title)}
              ${nextRank ? `（再 ${nextRank.minXp - st.xp} XP 升階 ${escapeHtml(nextRank.title)}）` : '（已達最高宗師境界！）'}
            </div>
            <div style="font-size:1.08rem;font-weight:800;margin-top:4px;">
              推薦下一關：Lesson ${nextUnfinished.id} · ${escapeHtml(nextUnfinished.title)}
            </div>
          </div>
          <span class="tag-pill" style="flex-shrink:0;">已破關 ${summary.passed} / ${summary.total}</span>
        </div>

        <div class="progress-bar-track" aria-label="總課程完成進度 ${summary.percent}%">
          <div class="progress-bar-fill" style="width:${summary.percent}%"></div>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <a href="#/lesson/${nextUnfinished.id}" id="hero-continue-btn" class="btn btn--primary" style="flex:1;">
            🚀 立即進入第 ${nextUnfinished.id} 課（約 ${nextUnfinished.estimatedMinutes} 分鐘）
          </a>
          <a href="#/deck" class="btn">🃏 通勤刷單字卡</a>
        </div>
      </div>

      <div aria-label="依學習目標篩選推薦路線">
        <div style="font-size:0.82rem;font-weight:800;color:var(--text-secondary);margin-bottom:4px;">
          🎯 想專攻特定主題？點選下方捷徑高亮推薦路線：
        </div>
        <div class="chip-scroller">
          ${GOAL_SHORTCUTS.map(
            (g) => `
            <button
              type="button"
              id="goal-chip-${g.id}"
              class="filter-chip ${g.id === activeGoal.id ? 'is-selected' : ''}"
              data-goal="${g.id}"
            >${escapeHtml(g.label)}</button>`
          ).join('')}
        </div>
        <div style="font-size:0.83rem;color:var(--cobalt-text);background:var(--cobalt-soft);padding:9px 13px;border-radius:var(--radius-sm);margin-bottom:8px;">
          ${escapeHtml(activeGoal.description)}
          ${
            activeGoal.lessonIds
              ? ` <strong>（推薦順序：${activeGoal.lessonIds.join(' → ')}）</strong>`
              : ''
          }
        </div>
      </div>

      ${WORLDS.map((world) => {
        const worldLessons = world.lessonIds.map((id) => getLessonById(id)).filter(Boolean);
        const worldDoneCount = worldLessons.filter((l) => st.lessons[l.id]?.quizPassed).length;

        return `
          <section class="world-section" aria-label="${escapeHtml(world.title)}">
            <div class="world-banner">
              <div>
                <h2 class="world-title">${world.icon} ${escapeHtml(world.title)}</h2>
                <p class="world-desc">${escapeHtml(world.subtitle)}</p>
              </div>
              <span class="tag-pill" style="flex-shrink:0;">${worldDoneCount}/${worldLessons.length} 完成</span>
            </div>

            <div class="quest-list">
              ${worldLessons
                .map((lesson) => {
                  const rec = st.lessons[lesson.id] || {};
                  const completed = Boolean(rec.quizPassed);
                  const stars = rec.bestStars || 0;
                  const isHighlighted = highlightSet ? highlightSet.has(lesson.id) : false;
                  const isDimmed = highlightSet ? !highlightSet.has(lesson.id) : false;

                  return `
                    <a
                      href="#/lesson/${lesson.id}"
                      id="quest-node-${lesson.id}"
                      class="quest-node ${completed ? 'is-completed' : ''} ${
                        isHighlighted ? 'is-highlighted' : ''
                      } ${isDimmed ? 'is-dimmed' : ''}"
                    >
                      <div class="quest-badge-num">
                        <span>${completed ? '✓' : lesson.id}</span>
                      </div>
                      <div class="quest-meta">
                        <h3 class="quest-title">${escapeHtml(lesson.title)}</h3>
                        <p class="quest-sub">${escapeHtml(lesson.subtitle)}</p>
                        <div class="quest-pills">
                          <span class="tag-pill">⏱ ${lesson.estimatedMinutes}m</span>
                          ${lesson.videos.length > 0 ? `<span class="tag-pill">🎬 影片×${lesson.videos.length}</span>` : ''}
                          ${lesson.tags
                            .slice(0, 2)
                            .map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`)
                            .join('')}
                          <span class="stars-pill">
                            ${stars > 0 ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : `+${lesson.xpReward} XP`}
                          </span>
                        </div>
                      </div>
                    </a>
                  `;
                })
                .join('')}
            </div>
          </section>
        `;
      }).join('')}
    </section>
  `;

  container.querySelectorAll('[data-goal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setGoalFilter(btn.getAttribute('data-goal'));
      renderMapView(container);
    });
  });
}
