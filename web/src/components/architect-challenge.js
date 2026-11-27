import { escapeHtml } from '../utils/dom.js';
import { completeActivity } from '../state/store.js';

export function renderArchitectChallenge(container, lesson) {
  const ch = lesson.architectChallenge;
  let pickedIdx = null;

  function render() {
    const picked = pickedIdx !== null ? ch.options[pickedIdx] : null;

    container.innerHTML = `
      <section class="card" aria-label="你是 AI 架構師情境決策挑戰">
        <div class="section-eyebrow">🧭 你是 AI 架構師 · 實戰決策挑戰</div>
        <h2 style="margin:0 0 10px;font-size:1.15rem;">真實開發難題情境</h2>
        <div style="background:var(--bg-subtle);border:1px solid var(--border-subtle);padding:14px;border-radius:var(--radius-md);margin-bottom:12px;">
          <p style="margin:0 0 8px;">${escapeHtml(ch.situation)}</p>
          <p style="margin:0;font-weight:800;color:var(--cobalt-text);">❓ ${escapeHtml(ch.question)}</p>
        </div>

        <div class="choice-list">
          ${ch.options
            .map((opt, idx) => {
              let cls = 'choice-btn';
              if (pickedIdx === idx) {
                cls += opt.isBest ? ' is-correct' : ' is-wrong';
              } else if (picked?.isBest && opt.isBest) {
                cls += ' is-correct';
              }
              return `
                <button
                  type="button"
                  id="arch-opt-btn-${idx}"
                  class="${cls}"
                  data-idx="${idx}"
                >
                  <span style="font-weight:800;margin-right:6px;">方案 ${String.fromCharCode(65 + idx)}.</span>
                  ${escapeHtml(opt.label)}
                </button>
              `;
            })
            .join('')}
        </div>

        ${
          picked
            ? `<div class="feedback-callout ${picked.isBest ? 'is-good' : 'is-warn'}">
                <div style="font-weight:800;margin-bottom:6px;">
                  ${picked.isBest ? '✅ 架構決策大成功！系統上線結果：' : '⚠️ 踩到架構地雷了！系統上線後果（可點其他方案重試）：'}
                </div>
                <p style="margin:0 0 8px;font-weight:700;">${escapeHtml(picked.consequence)}</p>
                <p style="margin:0;color:var(--text-secondary);">💡 <strong>架構師解析：</strong>${escapeHtml(picked.explanation)}</p>
              </div>`
            : ''
        }
      </section>
    `;

    container.querySelectorAll('[data-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        pickedIdx = Number(btn.getAttribute('data-idx'));
        if (ch.options[pickedIdx].isBest) {
          completeActivity(lesson.id, 'archDone', 30, `破解第 ${lesson.id} 課架構師決策挑戰`);
        }
        render();
      });
    });
  }

  render();
}
