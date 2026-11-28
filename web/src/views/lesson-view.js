import { getLessonById, getAdjacentLessons } from '../data/index.js';
import { getState, markLessonVisited } from '../state/store.js';
import { escapeHtml, openLightbox } from '../utils/dom.js';
import { renderVideoSectionHtml, renderResourcesHtml } from '../components/media-links.js';
import { renderFlowSimulator } from '../components/flow-simulator.js';
import { renderArchitectChallenge } from '../components/architect-challenge.js';
import { renderCodeLab } from '../components/code-lab.js';
import { renderFlashcardsAndQuiz } from '../components/flashcards-quiz.js';

const STAGES = [
  { id: 'overview', icon: '📖', label: '重點與影片' },
  { id: 'sim', icon: '⚡', label: '動態模擬' },
  { id: 'arch', icon: '🧭', label: '架構師挑戰' },
  { id: 'code', icon: '🧩', label: '程式碼拼圖' },
  { id: 'quiz', icon: '🏆', label: '翻牌與測驗' },
  { id: 'resources', icon: '🔗', label: '詳解與資源' }
];

export function renderLessonView(container, lessonId, initialStage = 'overview') {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    container.innerHTML = `
      <div class="card" style="text-align:center;">
        <h1>找不到該課程關卡</h1>
        <a href="#/map" class="btn btn--primary">返回技能樹地圖</a>
      </div>
    `;
    return;
  }

  markLessonVisited(lesson.id);

  let activeStage = STAGES.some((s) => s.id === initialStage) ? initialStage : 'overview';
  let selectedVideoIdx = 0;

  function render() {
    const st = getState();
    const rec = st.lessons[lesson.id] || {};
    const { prev, next } = getAdjacentLessons(lesson.id);
    const stageIdx = STAGES.findIndex((s) => s.id === activeStage);
    const nextStage = stageIdx < STAGES.length - 1 ? STAGES[stageIdx + 1] : null;

    const doneMap = {
      overview: Boolean(rec.visited),
      sim: Boolean(rec.simDone),
      arch: Boolean(rec.archDone),
      code: Boolean(rec.puzzleDone),
      quiz: Boolean(rec.quizPassed),
      resources: Boolean(rec.visited)
    };

    container.innerHTML = `
      <article aria-labelledby="lesson-main-title">
        <div class="lesson-topbar">
          <button type="button" data-route="#/map" id="back-to-map-btn" class="btn btn--sm">← 返回地圖</button>
          <span class="tag-pill">Lesson ${lesson.id} · 約 ${lesson.estimatedMinutes} 分鐘 · +${lesson.xpReward} XP</span>
        </div>

        <header class="section-header">
          <h1 id="lesson-main-title" class="page-title">${escapeHtml(lesson.title)}</h1>
          <p class="page-subtitle">${escapeHtml(lesson.subtitle)}</p>
        </header>

        <nav class="stage-stepper" aria-label="本課互動學習階段">
          ${STAGES.map(
            (s) => `
            <button
              type="button"
              id="stage-tab-${s.id}"
              class="stage-pill ${activeStage === s.id ? 'is-active' : ''} ${
                doneMap[s.id] ? 'is-done' : ''
              }"
              data-stage="${s.id}"
            >
              <span>${s.icon}</span>
              <span>${escapeHtml(s.label)}</span>
              ${doneMap[s.id] && activeStage !== s.id ? '<span>✓</span>' : ''}
            </button>`
          ).join('')}
        </nav>

        <div id="lesson-stage-body"></div>

        <footer style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          ${
            nextStage
              ? `<button type="button" id="next-stage-btn" class="btn btn--primary btn--block">
                  下一環節：${nextStage.icon} ${escapeHtml(nextStage.label)} ➔
                </button>`
              : ''
          }
          <div style="display:flex;justify-content:space-between;width:100%;gap:10px;">
            ${
              prev
                ? `<button type="button" data-route="#/lesson/${prev.id}" class="btn btn--sm">◀ 上一課 (${prev.id})</button>`
                : `<span></span>`
            }
            ${
              next
                ? `<button type="button" data-route="#/lesson/${next.id}" class="btn btn--sm">下一課 (${next.id}) ▶</button>`
                : `<button type="button" data-route="#/profile" class="btn btn--amber btn--sm">👑 查看畢業成就</button>`
            }
          </div>
        </footer>
      </article>
    `;

    const stageBody = container.querySelector('#lesson-stage-body');

    if (activeStage === 'overview') {
      stageBody.innerHTML = `
        <div class="micro-deck">
          ${lesson.microCards
            .map(
              (card, idx) => `
            <section class="micro-card">
              <span class="micro-card-step">重點卡 ${idx + 1} / ${lesson.microCards.length} · ${escapeHtml(card.tag)}</span>
              <h3>${escapeHtml(card.title)}</h3>
              <p>${escapeHtml(card.body)}</p>
              ${
                card.bullets?.length
                  ? `<ul class="key-points-list">
                      ${card.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
                    </ul>`
                  : ''
              }
              ${
                card.image
                  ? `<div class="diagram-frame">
                      <img
                        src="${escapeHtml(card.image.src)}"
                        alt="${escapeHtml(card.image.caption)}"
                        class="diagram-img"
                        loading="lazy"
                        data-zoom-src="${escapeHtml(card.image.src)}"
                        data-zoom-cap="${escapeHtml(card.image.caption)}"
                      />
                      <p class="diagram-caption">🔍 ${escapeHtml(card.image.caption)}</p>
                    </div>`
                  : ''
              }
            </section>`
            )
            .join('')}
        </div>
        ${renderVideoSectionHtml(lesson.videos, selectedVideoIdx)}
      `;

      stageBody.querySelectorAll('[data-zoom-src]').forEach((img) => {
        img.addEventListener('click', () => {
          openLightbox(img.getAttribute('data-zoom-src'), img.getAttribute('data-zoom-cap'));
        });
      });

      stageBody.querySelectorAll('[data-vid-idx]').forEach((btn) => {
        btn.addEventListener('click', () => {
          selectedVideoIdx = Number(btn.getAttribute('data-vid-idx'));
          render();
        });
      });
    } else if (activeStage === 'sim') {
      renderFlowSimulator(stageBody, lesson);
    } else if (activeStage === 'arch') {
      renderArchitectChallenge(stageBody, lesson);
    } else if (activeStage === 'code') {
      renderCodeLab(stageBody, lesson);
    } else if (activeStage === 'quiz') {
      renderFlashcardsAndQuiz(stageBody, lesson);
    } else if (activeStage === 'resources') {
      stageBody.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${lesson.deepDive
            .map(
              (sec) => `
            <section class="card">
              <div class="section-eyebrow">📚 課後實戰詳解筆記</div>
              <h2 style="margin:0 0 8px;font-size:1.12rem;">${escapeHtml(sec.heading)}</h2>
              <p style="margin:0;color:var(--text-secondary);">${escapeHtml(sec.content)}</p>
              ${
                sec.checklist
                  ? `<ul class="key-points-list" style="margin-top:12px;">
                      ${sec.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                    </ul>`
                  : ''
              }
            </section>`
            )
            .join('')}

          <section class="card">
            <div class="section-eyebrow">🔗 已驗證官方資源、Notebook 與延伸連結</div>
            <h2 style="margin:0 0 6px;font-size:1.12rem;">點擊直接開啟對應程式碼與官方教材</h2>
            ${renderResourcesHtml(lesson.resources)}
          </section>
        </div>
      `;
    }

    container.querySelectorAll('[data-stage]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeStage = btn.getAttribute('data-stage');
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    container.querySelector('#next-stage-btn')?.addEventListener('click', () => {
      if (nextStage) {
        activeStage = nextStage.id;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    container
      .querySelector('.stage-pill.is-active')
      ?.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
  }

  render();
}
