import { escapeHtml } from '../utils/dom.js';
import {
  getState,
  toggleReviewCard,
  markCardMastered,
  recordQuizResult
} from '../state/store.js';
import { getAdjacentLessons } from '../data/index.js';

export function renderFlashcardsAndQuiz(container, lesson) {
  const flippedIds = new Set();
  const answers = Array(lesson.quiz.length).fill(null);
  let submittedResult = null;

  function render() {
    const st = getState();
    const { next } = getAdjacentLessons(lesson.id);

    container.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:18px;">
        <section class="card" aria-label="本課中英專有名詞翻牌卡">
          <div class="section-eyebrow">🃏 專有名詞 3D 翻牌卡（點擊卡片翻面看台灣白話解析）</div>
          <h2 style="margin:0 0 12px;font-size:1.14rem;">熟記核心英文術語，看官方文件不再卡關</h2>

          <div class="flashcard-grid">
            ${lesson.flashcards
              .map((fc) => {
                const isFlipped = flippedIds.has(fc.id);
                const inReview = st.reviewDeck.includes(fc.id);
                const isMastered = st.masteredDeck.includes(fc.id);
                return `
                  <div>
                    <div
                      id="flashcard-${fc.id}"
                      class="flashcard-scene ${isFlipped ? 'is-flipped' : ''}"
                      data-flip="${fc.id}"
                      role="button"
                      tabindex="0"
                      aria-label="翻轉卡片：${escapeHtml(fc.term)}"
                    >
                      <div class="flashcard-inner">
                        <div class="flashcard-face flashcard-front">
                          <div>
                            <span class="tag-pill">${escapeHtml(fc.category)}</span>
                            <div class="flashcard-term">${escapeHtml(fc.term)}</div>
                          </div>
                          <div class="flashcard-hint">👆 點擊翻面看白話解釋與實例</div>
                        </div>
                        <div class="flashcard-face flashcard-back">
                          <div>
                            <div style="font-size:0.86rem;font-weight:700;margin-bottom:6px;">
                              ${escapeHtml(fc.definition)}
                            </div>
                            <div style="font-size:0.79rem;color:var(--text-secondary);">
                              💡 實例：${escapeHtml(fc.example)}
                            </div>
                          </div>
                          <div class="flashcard-hint">👆 再次點擊翻回正面</div>
                        </div>
                      </div>
                    </div>
                    <div style="display:flex;gap:6px;margin-top:8px;">
                      <button
                        type="button"
                        class="btn btn--sm"
                        style="flex:1;${inReview ? 'border-color:var(--amber);color:var(--amber-text);' : ''}"
                        data-review="${fc.id}"
                      >${inReview ? '📌 已在待複習庫' : '📌 加入待複習'}</button>
                      <button
                        type="button"
                        class="btn btn--sm"
                        style="flex:1;${isMastered ? 'border-color:var(--brand);color:var(--brand-text);' : ''}"
                        data-master="${fc.id}"
                      >${isMastered ? '✓ 已記熟' : '✓ 標記記熟'}</button>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </section>

        <section class="card" aria-label="本課 Boss 闖關測驗">
          <div class="section-eyebrow">🏆 Boss 快問快答闖關（答對 2 題以上即點亮過關星章 ＋${lesson.xpReward} XP）</div>
          <h2 style="margin:0 0 14px;font-size:1.15rem;">驗收你的第 ${lesson.id} 課實戰戰力！</h2>

          <div style="display:flex;flex-direction:column;gap:18px;">
            ${lesson.quiz
              .map((q, qIdx) => {
                const userPick = answers[qIdx];
                return `
                  <div style="padding-bottom:14px;border-bottom:1px solid var(--border-subtle);">
                    <div style="font-weight:800;margin-bottom:10px;">
                      Q${qIdx + 1}. ${escapeHtml(q.question)}
                    </div>
                    <div class="choice-list" style="margin-top:8px;">
                      ${q.options
                        .map((opt, oIdx) => {
                          let cls = 'choice-btn';
                          if (userPick !== null) {
                            if (oIdx === q.answerIndex) cls += ' is-correct';
                            else if (oIdx === userPick) cls += ' is-wrong';
                          }
                          return `
                            <button
                              type="button"
                              id="quiz-q${qIdx}-opt${oIdx}"
                              class="${cls}"
                              data-q="${qIdx}"
                              data-o="${oIdx}"
                            >${escapeHtml(opt)}</button>
                          `;
                        })
                        .join('')}
                    </div>
                    ${
                      userPick !== null
                        ? `<div class="feedback-callout ${
                            userPick === q.answerIndex ? 'is-good' : 'is-warn'
                          }" style="margin-top:10px;">
                            <strong>${userPick === q.answerIndex ? '✅ 答對了！' : '💡 觀念訂正：'}</strong>
                            ${escapeHtml(q.explanation)}
                          </div>`
                        : ''
                    }
                  </div>
                `;
              })
              .join('')}
          </div>

          ${
            submittedResult
              ? `<div class="feedback-callout ${submittedResult.passed ? 'is-good' : 'is-warn'}" style="margin-top:16px;text-align:center;">
                  <div style="font-size:1.45rem;margin-bottom:4px;">
                    ${'★'.repeat(submittedResult.stars)}${'☆'.repeat(3 - submittedResult.stars)}
                  </div>
                  <div style="font-size:1.05rem;font-weight:800;margin-bottom:6px;">
                    ${
                      submittedResult.passed
                        ? `🎉 恭喜闖關成功！答對 ${submittedResult.correct} / ${lesson.quiz.length} 題`
                        : `差一點點！答對 ${submittedResult.correct} / ${lesson.quiz.length} 題，點選重考一次就能滿星過關！`
                    }
                  </div>
                  <div style="display:flex;justify-content:center;gap:10px;margin-top:12px;flex-wrap:wrap;">
                    <button type="button" id="quiz-retry-btn" class="btn btn--sm">↺ 重新挑戰衝 3 顆星</button>
                    ${
                      next
                        ? `<button type="button" data-route="#/lesson/${next.id}" id="next-lesson-cta" class="btn btn--primary btn--sm">🚀 前往下一課：Lesson ${next.id} ➔</button>`
                        : `<button type="button" data-route="#/profile" class="btn btn--amber btn--sm">👑 查看全課程畢業徽章！</button>`
                    }
                  </div>
                </div>`
              : `<p style="margin:14px 0 0;font-size:0.85rem;color:var(--text-muted);text-align:center;">
                  👆 完成全部 ${lesson.quiz.length} 題作答即可自動結算星數與 XP！
                </p>`
          }
        </section>
      </div>
    `;

    container.querySelectorAll('[data-flip]').forEach((cardEl) => {
      const toggle = () => {
        const id = cardEl.getAttribute('data-flip');
        if (flippedIds.has(id)) flippedIds.delete(id);
        else flippedIds.add(id);
        cardEl.classList.toggle('is-flipped');
      };
      cardEl.addEventListener('click', toggle);
      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });

    container.querySelectorAll('[data-review]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleReviewCard(btn.getAttribute('data-review'));
        render();
      });
    });

    container.querySelectorAll('[data-master]').forEach((btn) => {
      btn.addEventListener('click', () => {
        markCardMastered(btn.getAttribute('data-master'));
        render();
      });
    });

    container.querySelectorAll('[data-q]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qIdx = Number(btn.getAttribute('data-q'));
        const oIdx = Number(btn.getAttribute('data-o'));
        answers[qIdx] = oIdx;

        if (answers.every((a) => a !== null)) {
          const correct = answers.filter((a, idx) => a === lesson.quiz[idx].answerIndex).length;
          const res = recordQuizResult(lesson.id, correct, lesson.quiz.length, lesson.xpReward);
          submittedResult = { ...res, correct };
        }
        render();
      });
    });

    container.querySelector('#quiz-retry-btn')?.addEventListener('click', () => {
      for (let i = 0; i < answers.length; i++) answers[i] = null;
      submittedResult = null;
      render();
    });
  }

  render();
}
