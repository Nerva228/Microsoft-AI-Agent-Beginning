import { ALL_FLASHCARDS } from '../data/index.js';
import {
  getState,
  toggleReviewCard,
  markCardMastered
} from '../state/store.js';
import { escapeHtml } from '../utils/dom.js';

export function renderDeckView(container) {
  let filterMode = 'all'; // 'all' | 'review' | 'mastered' | 'random5'
  let searchQuery = '';
  let randomSample = [];
  const flipped = new Set();

  function pickRandom5() {
    const copy = [...ALL_FLASHCARDS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    randomSample = copy.slice(0, 5);
  }

  function render() {
    const st = getState();
    let list = ALL_FLASHCARDS;

    if (filterMode === 'review') {
      list = ALL_FLASHCARDS.filter((c) => st.reviewDeck.includes(c.id));
    } else if (filterMode === 'mastered') {
      list = ALL_FLASHCARDS.filter((c) => st.masteredDeck.includes(c.id));
    } else if (filterMode === 'random5') {
      list = randomSample;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.term.toLowerCase().includes(q) ||
          c.definition.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    container.innerHTML = `
      <section aria-labelledby="deck-heading">
        <div class="section-header">
          <div class="section-eyebrow">Flashcard Deck · 全課程 ${ALL_FLASHCARDS.length} 張中英術語隨身卡</div>
          <h1 id="deck-heading" class="page-title">AI Agent 專有名詞翻牌庫</h1>
          <p class="page-subtitle">
            等公車、搭捷運 1 分鐘就能刷 5 張！掌握台灣繁中白話解析＋英文專業術語。
          </p>
        </div>

        <div class="card" style="margin-bottom:16px;">
          <input
            type="search"
            id="deck-search-input"
            value="${escapeHtml(searchQuery)}"
            placeholder="🔍 搜尋術語（例如：MCP、RAG、SLM、Ed25519、Memory...）"
            style="width:100%;padding:11px 14px;border-radius:var(--radius-md);border:1.5px solid var(--border-strong);background:var(--bg-canvas);margin-bottom:10px;"
          />

          <div class="chip-scroller" style="padding-bottom:2px;">
            <button type="button" class="filter-chip ${filterMode === 'all' ? 'is-selected' : ''}" data-mode="all">
              全部 (${ALL_FLASHCARDS.length})
            </button>
            <button type="button" id="deck-random5-btn" class="filter-chip ${filterMode === 'random5' ? 'is-selected' : ''}" data-mode="random5">
              🎲 隨機抽考 5 張
            </button>
            <button type="button" class="filter-chip ${filterMode === 'review' ? 'is-selected' : ''}" data-mode="review">
              📌 待複習 (${st.reviewDeck.length})
            </button>
            <button type="button" class="filter-chip ${filterMode === 'mastered' ? 'is-selected' : ''}" data-mode="mastered">
              ✓ 已記熟 (${st.masteredDeck.length})
            </button>
          </div>
        </div>

        ${
          list.length === 0
            ? `<div class="card" style="text-align:center;color:var(--text-secondary);">
                目前此分類沒有符合的術語卡，可切換回「全部」或點選「🎲 隨機抽考 5 張」！
              </div>`
            : `<div class="flashcard-grid">
                ${list
                  .map((fc) => {
                    const isFlipped = flipped.has(fc.id);
                    const inReview = st.reviewDeck.includes(fc.id);
                    const isMastered = st.masteredDeck.includes(fc.id);
                    return `
                      <div>
                        <div
                          class="flashcard-scene ${isFlipped ? 'is-flipped' : ''}"
                          data-flip="${fc.id}"
                          role="button"
                          tabindex="0"
                        >
                          <div class="flashcard-inner">
                            <div class="flashcard-face flashcard-front">
                              <div>
                                <div style="display:flex;justify-content:space-between;gap:6px;">
                                  <span class="tag-pill">${escapeHtml(fc.category)}</span>
                                  <span class="tag-pill">Lesson ${fc.lessonId}</span>
                                </div>
                                <div class="flashcard-term" style="margin-top:10px;">${escapeHtml(fc.term)}</div>
                              </div>
                              <div class="flashcard-hint">👆 點擊翻面看白話解釋</div>
                            </div>
                            <div class="flashcard-face flashcard-back">
                              <div>
                                <div style="font-size:0.86rem;font-weight:700;margin-bottom:6px;">
                                  ${escapeHtml(fc.definition)}
                                </div>
                                <div style="font-size:0.79rem;color:var(--text-secondary);">
                                  💡 ${escapeHtml(fc.example)}
                                </div>
                              </div>
                              <button type="button" data-route="#/lesson/${fc.lessonId}" style="border:none;background:transparent;padding:0;cursor:pointer;color:var(--brand-text);font-size:0.78rem;font-weight:800;text-align:left;">
                                前往第 ${fc.lessonId} 課 ➔
                              </button>
                            </div>
                          </div>
                        </div>
                        <div style="display:flex;gap:6px;margin-top:8px;">
                          <button type="button" class="btn btn--sm" style="flex:1;" data-rev="${fc.id}">
                            ${inReview ? '📌 移除待複習' : '📌 待複習'}
                          </button>
                          <button type="button" class="btn btn--sm" style="flex:1;" data-mas="${fc.id}">
                            ${isMastered ? '✓ 已記熟' : '✓ 記熟'}
                          </button>
                        </div>
                      </div>
                    `;
                  })
                  .join('')}
              </div>`
        }
      </section>
    `;

    const input = container.querySelector('#deck-search-input');
    input?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const nextInput = container.querySelector('#deck-search-input');
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(pos, pos);
      }
    });

    container.querySelectorAll('[data-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        filterMode = mode;
        if (mode === 'random5') pickRandom5();
        render();
      });
    });

    container.querySelectorAll('[data-flip]').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const id = el.getAttribute('data-flip');
        if (flipped.has(id)) flipped.delete(id);
        else flipped.add(id);
        el.classList.toggle('is-flipped');
      });
    });

    container.querySelectorAll('[data-rev]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleReviewCard(btn.getAttribute('data-rev'));
        render();
      });
    });

    container.querySelectorAll('[data-mas]').forEach((btn) => {
      btn.addEventListener('click', () => {
        markCardMastered(btn.getAttribute('data-mas'));
        render();
      });
    });
  }

  render();
}
