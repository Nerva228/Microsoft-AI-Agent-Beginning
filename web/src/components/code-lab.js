import { escapeHtml } from '../utils/dom.js';
import { completeActivity } from '../state/store.js';
import { REPO_BASE_URL } from '../data/index.js';

export function renderCodeLab(container, lesson) {
  const lab = lesson.codeLab;
  const puzzle = lab.puzzle;

  let selectedLine = 0;
  let showOutput = false;
  let filledSlots = Array(puzzle.answers.length).fill(null);
  let slotStatuses = Array(puzzle.answers.length).fill(null); // null | 'correct' | 'wrong'
  let checkedState = null; // null | 'pass' | 'fail'

  // Deterministic shuffle based on lesson ID
  const rawTokens = [...puzzle.answers, ...puzzle.distractors].map((text, idx) => ({
    id: `tok-${idx}`,
    text
  }));
  const seed = Number(lesson.id) + 7;
  const bank = [...rawTokens].sort((a, b) => {
    const ha = (a.text.charCodeAt(0) * 31 + seed + a.id.charCodeAt(4)) % 17;
    const hb = (b.text.charCodeAt(0) * 31 + seed + b.id.charCodeAt(4)) % 17;
    return ha - hb;
  });

  function render() {
    const usedTokenIds = new Set(filledSlots.filter(Boolean).map((t) => t.id));
    const notebookUrl = `${REPO_BASE_URL}/blob/main/${lab.notebookPath}`;

    const puzzleHtml = puzzle.templateParts
      .map((part, idx) => {
        const chunk = escapeHtml(part);
        if (idx >= puzzle.answers.length) return chunk;
        const slotVal = filledSlots[idx];
        const status = slotStatuses[idx];

        let stateClass = '';
        let prefix = '';
        if (status === 'correct') {
          stateClass = 'is-correct';
          prefix = '✓ ';
        } else if (status === 'wrong') {
          stateClass = 'is-wrong';
          prefix = '✕ ';
        } else if (slotVal) {
          stateClass = 'is-filled';
        }

        const isLocked = status === 'correct';
        return `${chunk}<button type="button" id="puzzle-slot-${idx}" class="puzzle-slot ${stateClass}" data-slot="${idx}" ${
          isLocked ? 'disabled title="已答對鎖定"' : ''
        }>${prefix}${slotVal ? escapeHtml(slotVal.text) : `空格 ${idx + 1}`}</button>`;
      })
      .join('');

    container.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <section class="card" aria-label="Python 精華程式碼逐段解說">
          <div class="section-eyebrow">🐍 Python / MAF 精華拆解（點選任一行看白話說明）</div>
          <h2 style="margin:0 0 8px;font-size:1.14rem;">${escapeHtml(lab.title)}</h2>

          <div class="code-viewer" role="listbox" aria-label="程式碼區段清單">
            ${lab.lines
              .map(
                (line, idx) => `
              <button
                type="button"
                id="code-line-btn-${idx}"
                class="code-line-btn ${selectedLine === idx ? 'is-selected' : ''}"
                data-line="${idx}"
              >
                <span class="code-line-num">${idx + 1}</span>
                <span class="code-line-code">${escapeHtml(line.code)}</span>
              </button>`
              )
              .join('')}
          </div>

          <div class="code-explain-box">
            <strong>💡 第 ${selectedLine + 1} 段白話解說：</strong>
            ${escapeHtml(lab.lines[selectedLine].explain)}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:10px;">
            <button type="button" id="run-sim-output-btn" class="btn btn--primary btn--sm">
              ${showOutput ? '▼ 隱藏模擬執行結果' : '▶ 模擬執行看輸出'}
            </button>
            <a
              href="${escapeHtml(notebookUrl)}"
              target="_blank"
              rel="noopener noreferrer"
              id="open-github-nb-link"
              class="btn btn--sm"
            >📓 前往 GitHub 看完整 Notebook ↗</a>
          </div>

          ${
            showOutput
              ? `<div class="sim-console" style="margin-top:12px;margin-bottom:0;">
                  <span class="sim-console-badge">Simulated Terminal Output</span>
                  <div class="sim-payload" style="margin-top:4px;">${escapeHtml(lab.simulatedOutput)}</div>
                </div>`
              : ''
          }
        </section>

        <section class="card" aria-label="免打字點選式程式碼拼圖">
          <div class="section-eyebrow">🧩 免打字點選拼圖挑戰（+35 XP）</div>
          <p style="margin:0 0 10px;font-weight:700;">${escapeHtml(puzzle.instruction)}</p>
          <p style="margin:0 0 10px;font-size:0.82rem;color:var(--text-muted);">
            👆 點選下方積木填入空格；檢查答案後，<strong>答對會加綠框鎖定</strong>，<strong>答錯會標紅框</strong>（點紅框即可退回重選）。
          </p>

          <div class="puzzle-template">${puzzleHtml}</div>

          <div class="token-bank" aria-label="候選詞彙積木">
            ${bank
              .map(
                (tok) => `
              <button
                type="button"
                id="puzzle-${tok.id}"
                class="token-chip ${usedTokenIds.has(tok.id) ? 'is-used' : ''}"
                data-tok="${tok.id}"
                ${usedTokenIds.has(tok.id) ? 'disabled' : ''}
              >${escapeHtml(tok.text)}</button>`
              )
              .join('')}
          </div>

          <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
            <button type="button" id="puzzle-check-btn" class="btn btn--primary btn--sm" ${
              checkedState === 'pass' ? 'disabled' : ''
            }>✨ 檢查拼圖答案</button>
            ${
              checkedState === 'pass'
                ? ''
                : `<button type="button" id="puzzle-clear-btn" class="btn btn--sm">↺ 退回未鎖定空格</button>`
            }
          </div>

          ${
            checkedState === 'pass'
              ? `<div class="feedback-callout is-good">
                  <strong>🎉 拼圖全數綠框鎖定過關！</strong> ${escapeHtml(puzzle.successNote)}
                </div>`
              : checkedState === 'fail'
                ? `<div class="feedback-callout is-warn">
                    <strong>🔍 已標記檢查結果：</strong> 綠框（✓）代表正確並已鎖定；請點擊<strong>紅框（✕）空格</strong>退回錯誤詞彙再挑一次！
                  </div>`
                : ''
          }
        </section>
      </div>
    `;

    container.querySelectorAll('[data-line]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedLine = Number(btn.getAttribute('data-line'));
        render();
      });
    });

    container.querySelector('#run-sim-output-btn')?.addEventListener('click', () => {
      showOutput = !showOutput;
      render();
    });

    container.querySelectorAll('[data-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-slot'));
        // Locked correct slots cannot be returned!
        if (slotStatuses[idx] === 'correct') return;
        if (filledSlots[idx]) {
          filledSlots[idx] = null;
          slotStatuses[idx] = null;
          if (checkedState === 'fail') checkedState = null;
          render();
        }
      });
    });

    container.querySelectorAll('[data-tok]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tokId = btn.getAttribute('data-tok');
        const tokObj = bank.find((t) => t.id === tokId);
        if (!tokObj) return;
        // Find first empty non-locked slot, or if all slots have values, replace the first 'wrong' slot!
        let targetIdx = filledSlots.findIndex((s, i) => s === null && slotStatuses[i] !== 'correct');
        if (targetIdx === -1) {
          targetIdx = slotStatuses.findIndex((st) => st === 'wrong');
        }
        if (targetIdx === -1) return;
        filledSlots[targetIdx] = tokObj;
        slotStatuses[targetIdx] = null;
        if (checkedState === 'fail') checkedState = null;
        render();
      });
    });

    container.querySelector('#puzzle-clear-btn')?.addEventListener('click', () => {
      for (let i = 0; i < filledSlots.length; i++) {
        if (slotStatuses[i] !== 'correct') {
          filledSlots[i] = null;
          slotStatuses[i] = null;
        }
      }
      checkedState = null;
      render();
    });

    container.querySelector('#puzzle-check-btn')?.addEventListener('click', () => {
      let allRight = true;
      for (let i = 0; i < puzzle.answers.length; i++) {
        if (filledSlots[i] && filledSlots[i].text === puzzle.answers[i]) {
          slotStatuses[i] = 'correct';
        } else {
          slotStatuses[i] = 'wrong';
          allRight = false;
        }
      }
      if (allRight) {
        checkedState = 'pass';
        completeActivity(lesson.id, 'puzzleDone', 35, `解開第 ${lesson.id} 課程式碼拼圖`);
      } else {
        checkedState = 'fail';
      }
      render();
    });
  }

  render();
}
