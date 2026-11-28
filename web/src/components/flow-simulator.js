import { escapeHtml } from '../utils/dom.js';
import { completeActivity } from '../state/store.js';

export function renderFlowSimulator(container, lesson) {
  const sim = lesson.flowSimulator;
  let scenarioIdx = 0;
  let stepIdx = 0;
  let autoTimer = null;
  const seenSteps = new Set([0]);

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function render() {
    const scenario = sim.scenarios[scenarioIdx];
    const steps = scenario.steps;
    const currentStep = steps[stepIdx];
    seenSteps.add(stepIdx);
    const visitedNodes = new Set(steps.slice(0, stepIdx + 1).map((s) => s.activeNode));

    if (stepIdx === steps.length - 1 || seenSteps.size >= steps.length) {
      completeActivity(lesson.id, 'simDone', 25, `完成第 ${lesson.id} 課動態流程模擬`);
    }

    container.innerHTML = `
      <section class="sim-box" aria-label="動態 Agent 流程模擬器">
        <div class="section-eyebrow">⚡ 互動模擬器 · 可直接點擊任意節點或步驟文字切換（${stepIdx + 1} / ${steps.length}）</div>
        <h2 style="margin:0 0 6px;font-size:1.18rem;">${escapeHtml(sim.title)}</h2>
        <p style="margin:0 0 12px;color:var(--text-secondary);font-size:0.9rem;">${escapeHtml(sim.description)}</p>

        ${
          sim.scenarios.length > 1
            ? `<div class="chip-scroller" role="tablist" aria-label="切換模擬情境">
                ${sim.scenarios
                  .map(
                    (sc, idx) => `
                  <button
                    type="button"
                    id="sim-scenario-btn-${idx}"
                    class="filter-chip ${idx === scenarioIdx ? 'is-selected' : ''}"
                    data-sc="${idx}"
                  >${escapeHtml(sc.name)}</button>`
                  )
                  .join('')}
              </div>`
            : ''
        }

        <div class="sim-nodes-track" role="tablist" aria-label="點選架構節點">
          ${sim.nodes
            .map((node) => {
              const isCurrent = node.id === currentStep.activeNode;
              const isVisited = visitedNodes.has(node.id);
              const targetStepIdx = steps.findIndex((s) => s.activeNode === node.id);
              return `
                <button
                  type="button"
                  class="sim-node ${isCurrent ? 'is-current' : ''} ${isVisited ? 'is-visited' : ''}"
                  data-node-step="${targetStepIdx >= 0 ? targetStepIdx : 0}"
                  ${targetStepIdx < 0 ? 'disabled style="opacity:0.45;cursor:default;"' : ''}
                >
                  <span class="sim-node-icon">${escapeHtml(node.icon)}</span>
                  <span class="sim-node-label">${escapeHtml(node.label)}</span>
                </button>
              `;
            })
            .join('')}
        </div>

        <div class="sim-step-list" role="tablist" aria-label="直接點選文字步驟">
          ${steps
            .map((st, idx) => {
              const shortTitle = st.badge.includes('·') ? st.badge.split('·')[1].trim() : st.badge;
              return `
                <button
                  type="button"
                  id="sim-step-jump-${idx}"
                  class="sim-step-pill ${idx === stepIdx ? 'is-active' : ''}"
                  data-step-jump="${idx}"
                >${idx + 1}. ${escapeHtml(shortTitle)}</button>
              `;
            })
            .join('')}
        </div>

        <div class="sim-console">
          <span class="sim-console-badge">${escapeHtml(currentStep.badge)}</span>
          <div style="line-height:1.6;">${escapeHtml(currentStep.text)}</div>
          <div class="sim-payload">${escapeHtml(currentStep.payload)}</div>
        </div>

        <div class="sim-controls">
          <button type="button" id="sim-prev-btn" class="btn btn--sm" ${stepIdx === 0 ? 'disabled' : ''}>◀ 上一步</button>
          <button type="button" id="sim-next-btn" class="btn btn--primary btn--sm" ${stepIdx >= steps.length - 1 ? 'disabled' : ''}>
            下一步 ▶
          </button>
          <button type="button" id="sim-auto-btn" class="btn btn--sm">
            ${autoTimer ? '⏸ 暫停播放' : '▶ 自動播放'}
          </button>
          <button type="button" id="sim-reset-btn" class="btn btn--sm">↺ 重播</button>
        </div>
      </section>
    `;

    container.querySelectorAll('[data-sc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopAuto();
        scenarioIdx = Number(btn.getAttribute('data-sc'));
        stepIdx = 0;
        seenSteps.clear();
        render();
      });
    });

    container.querySelectorAll('[data-node-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopAuto();
        stepIdx = Number(btn.getAttribute('data-node-step'));
        render();
      });
    });

    container.querySelectorAll('[data-step-jump]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopAuto();
        stepIdx = Number(btn.getAttribute('data-step-jump'));
        render();
      });
    });

    container.querySelector('#sim-prev-btn')?.addEventListener('click', () => {
      stopAuto();
      if (stepIdx > 0) {
        stepIdx--;
        render();
      }
    });

    container.querySelector('#sim-next-btn')?.addEventListener('click', () => {
      stopAuto();
      if (stepIdx < steps.length - 1) {
        stepIdx++;
        render();
      }
    });

    container.querySelector('#sim-reset-btn')?.addEventListener('click', () => {
      stopAuto();
      stepIdx = 0;
      render();
    });

    container.querySelector('#sim-auto-btn')?.addEventListener('click', () => {
      if (autoTimer) {
        stopAuto();
        render();
        return;
      }
      if (stepIdx >= steps.length - 1) stepIdx = 0;
      render();
      autoTimer = setInterval(() => {
        if (!document.body.contains(container)) {
          stopAuto();
          return;
        }
        if (stepIdx < steps.length - 1) {
          stepIdx++;
          render();
        } else {
          stopAuto();
          render();
        }
      }, 2100);
      render();
    });
  }

  render();
}
