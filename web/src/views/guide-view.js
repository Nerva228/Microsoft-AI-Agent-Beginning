import { escapeHtml } from '../utils/dom.js';
import { GOAL_SHORTCUTS, getLessonById } from '../data/index.js';

const ANATOMY_COMPONENTS = [
  {
    part: '🧠 Model（模型推理引擎）',
    role: '理解自然語言意圖、推理下一步並產出結構化決策',
    example: 'GPT-5-mini（雲端 Foundry）或 Qwen 2.5（本地 Foundry Local）',
    lessonId: '00'
  },
  {
    part: '🛠️ Tools（工具與行動手腳）',
    role: '查詢外部 API、執行 Python 運算、操作瀏覽器或寫入系統',
    example: '@tool 裝飾函式、Code Interpreter、MCP Server、Playwright',
    lessonId: '04'
  },
  {
    part: '📚 Knowledge（檢索知識依據）',
    role: '提供最新且可查證的企業文件與資料庫事實錨定（Grounding）',
    example: 'Azure AI Search 混合搜尋、本地 ChromaDB 向量庫',
    lessonId: '05'
  },
  {
    part: '🎛️ Context（當下脈絡視窗）',
    role: '精選並壓縮當次呼叫送入模型的指令、摘要與工具輸出',
    example: '滾動對話摘要、API 肥胖欄位修剪、子代理脈絡隔離',
    lessonId: '12'
  },
  {
    part: '🗄️ Memory（跨對話長期記憶）',
    role: '跨 Session 保存使用者偏好（語意）與過往成敗經驗（情節）',
    example: 'User Scoped 記憶庫、Cognee 知識圖譜',
    lessonId: '13'
  },
  {
    part: '🗺️ Planning（目標拆解與重規劃）',
    role: '將大型模糊任務拆分為結構化子步驟，遇阻礙時動態調整',
    example: 'Pydantic ExecutionPlan、ReAct 迴圈',
    lessonId: '07'
  },
  {
    part: '🎼 Orchestration（多代理與工作流編排）',
    role: '在多個專職 Agent 與條件節點間調度平行、循序或交接流程',
    example: 'MAF WorkflowBuilder、Handoff、A2A 跨代理協定',
    lessonId: '14'
  },
  {
    part: '🛡️ Trust & Governance（信任、評估與資安）',
    role: '確保行為安全可控、品質可量化且紀錄防竄改可稽核',
    example: 'Tiered Gate HITL、OpenTelemetry、Smoke Test、Ed25519 簽章收據',
    lessonId: '18'
  }
];

export function renderGuideView(container) {
  let selectedAnatomy = 0;

  function render() {
    const activePart = ANATOMY_COMPONENTS[selectedAnatomy];

    container.innerHTML = `
      <section aria-labelledby="guide-heading">
        <div class="section-header">
          <div class="section-eyebrow">Study Guide · 互動學習導航與架構速查表</div>
          <h1 id="guide-heading" class="page-title">AI Agent 八大核心組件與選課羅盤</h1>
          <p class="page-subtitle">
            改編自官方 STUDY_GUIDE.md：帶你一眼看穿完整 Agent 系統拼圖，找出今天最適合你的學習切入點！
          </p>
        </div>

        <div class="card" style="margin-bottom:18px;">
          <div class="section-eyebrow">🔬 點選組件看白話定位與對應課程</div>
          <h2 style="margin:0 0 10px;font-size:1.15rem;">一套生產級 AI Agent 系統由哪 8 塊積木組成？</h2>

          <div class="chip-scroller">
            ${ANATOMY_COMPONENTS.map(
              (item, idx) => `
              <button
                type="button"
                id="anatomy-chip-${idx}"
                class="filter-chip ${selectedAnatomy === idx ? 'is-selected' : ''}"
                data-anat="${idx}"
              >${escapeHtml(item.part.split('（')[0])}</button>`
            ).join('')}
          </div>

          <div style="background:var(--bg-subtle);border:1.5px solid var(--border-strong);border-radius:var(--radius-md);padding:16px;">
            <h3 style="margin:0 0 8px;font-size:1.08rem;">${escapeHtml(activePart.part)}</h3>
            <p style="margin:0 0 8px;"><strong>核心職責：</strong>${escapeHtml(activePart.role)}</p>
            <p style="margin:0 0 14px;color:var(--text-secondary);"><strong>代表技術：</strong>${escapeHtml(activePart.example)}</p>
            <a href="#/lesson/${activePart.lessonId}" class="btn btn--primary btn--sm">
              🎯 前往代表課程：Lesson ${activePart.lessonId} ➔
            </a>
          </div>
        </div>

        <div class="card">
          <div class="section-eyebrow">🧭 依你的實戰目標挑路線</div>
          <h2 style="margin:0 0 12px;font-size:1.15rem;">不用照死順序背！挑一條最有感的路線馬上開刷</h2>

          <div style="display:flex;flex-direction:column;gap:12px;">
            ${GOAL_SHORTCUTS.filter((g) => g.id !== 'all')
              .map((g) => {
                const firstLesson = getLessonById(g.lessonIds[0]);
                return `
                  <div style="padding:14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-subtle);">
                    <div style="font-weight:800;font-size:1rem;margin-bottom:4px;">${escapeHtml(g.label)}</div>
                    <p style="margin:0 0 10px;font-size:0.86rem;color:var(--text-secondary);">${escapeHtml(g.description)}</p>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
                      ${g.lessonIds
                        .map(
                          (lid) =>
                            `<a href="#/lesson/${lid}" class="btn btn--sm" style="min-height:32px;padding:4px 10px;">Lesson ${lid}</a>`
                        )
                        .join('')}
                      ${
                        firstLesson
                          ? `<a href="#/lesson/${firstLesson.id}" class="btn btn--primary btn--sm" style="margin-left:auto;">從第 ${firstLesson.id} 課開始 ▶</a>`
                          : ''
                      }
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </section>
    `;

    container.querySelectorAll('[data-anat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedAnatomy = Number(btn.getAttribute('data-anat'));
        render();
      });
    });
  }

  render();
}
