import { REPO_BASE_URL } from './curriculum-meta.js';

export const LESSONS_W3 = [
  {
    id: '10',
    slug: '10-ai-agents-production',
    world: 3,
    title: 'AI Agent 邁向生產環境：可觀測性與評估（Production & Eval）',
    subtitle: 'Demo 跑通只完成 20%！上線必備 OpenTelemetry Tracing、離線／線上評估與成本護欄',
    estimatedMinutes: 9,
    xpReward: 140,
    tags: ['Observability', 'OpenTelemetry', 'Evaluation'],
    videos: [
      {
        youtubeId: 'l4TP6IyJxmQ',
        title: 'Lesson 10：AI Agents in Production 官方影片',
        note: '掌握真實生產環境的除錯追蹤、指標評估與成本控管'
      }
    ],
    microCards: [
      {
        tag: '殘酷現實',
        title: '為什麼在本機 Demo 很聰明的 Agent，一上線面對真實用戶就崩潰？',
        body: '本機測試你只問 5 句乖巧的問題；上線後每天幾萬人亂問、外部 API 偶爾逾時、多輪對話把 Token 燒穿！沒有「儀表板與X光機」，你連錯在哪一步都抓不到：',
        bullets: [
          '非確定性多步路徑：同一個問題每次走的工具順序可能不同，傳統單純看 HTTP 200 根本看不出回答內容對不對！',
          '延遲與成本失控：某個子代理不小心陷入 8 輪重試，單次對話成本暴增 15 倍。'
        ],
        image: {
          src: './course-images/lesson-10-thumbnail.2b79a30773db093e.webp',
          caption: '從實驗室走向企業級生產環境，可觀測性（Observability）與持續評估是生命線'
        }
      },
      {
        tag: '透視 X 光機',
        title: 'Traces 與 Spans：用 OpenTelemetry 把黑盒子變透明！',
        body: '現代 Agent 觀測採用開放標準 OpenTelemetry（可串接 Microsoft Foundry Portal、Langfuse 等平台），記錄階層式追蹤樹（Trace Tree）：',
        bullets: [
          'Trace（單次完整任務）：記錄使用者從發問到拿到最終答案的總時間與總 Token。',
          'Span（每個細部動作）：展開可清楚看到「第 1 步 LLM 推理耗時 0.8s → 第 2 步呼叫 SQL 工具失敗重試耗時 3.2s → 第 3 步彙整耗時 0.6s」，瓶頸一目了然！'
        ]
      },
      {
        tag: '雙軌品質把關',
        title: 'Offline Evaluation（上線前黃金題庫考驗）＋ Online Evaluation（線上即時監控）',
        body: '每次改動 System Prompt 或換新模型前，千萬別憑感覺「肉眼看兩題覺得還行」就上線！',
        bullets: [
          '離線評估（Offline Eval）：準備 50–200 題涵蓋刁鑽邊界案例的黃金測試集（Golden Dataset），自動測算工具選擇準確率、Grounding 忠實度（如 RAGAS 指標）與任務完成率。',
          '線上監控（Online Eval）：抽樣真實流量用 LLM-as-a-Judge 檢查幻覺率、使用者倒讚率與每日預算警報！'
        ]
      }
    ],
    flowSimulator: {
      title: 'OpenTelemetry Trace Tree 生產除錯模擬器',
      description: '點按步驟，扮演值班 SRE 工程師展開一筆「報帳審核 Agent 回應超慢（耗時 9.4 秒）」的 Trace 找出真兇！',
      nodes: [
        { id: 'trace', icon: '🌲', label: 'Root Trace (9.4s)' },
        { id: 'span1', icon: '🧾', label: 'OCR 收據解析 Span' },
        { id: 'span2', icon: '🐢', label: '匯率 API 重試 Span' },
        { id: 'eval', icon: '📊', label: '修復與 Eval 驗證' }
      ],
      scenarios: [
        {
          name: '透過 Span 時間軸抓出外部 API 逾時真兇',
          steps: [
            {
              activeNode: 'trace',
              badge: 'Step 1 · 收到延遲告警',
              text: '監控面板跳出 P95 延遲飆破 9 秒！大家原本懷疑是 GPT 模型變慢，點開 Trace #tr-9041 查看真相。',
              payload: 'Trace #tr-9041 · Total: 9,420ms · Tokens: 1,420 · Status: OK'
            },
            {
              activeNode: 'span1',
              badge: 'Step 2 · 檢查前段推理與 OCR Span',
              text: '展開第一個子 Span：模型規劃＋讀取發票金額只花了 780ms，非常健康！',
              payload: '├─ Span [llm.plan + parse_receipt]: 780ms ✓'
            },
            {
              activeNode: 'span2',
              badge: 'Step 3 · 抓到兇手！外部匯率 API 無快取連卡兩次',
              text: '第二個工具 Span 顯示呼叫舊版匯率伺服器 Timeout 兩次各等 4 秒，第 3 次才成功！根本不是 LLM 慢！',
              payload: '├─ Span [tool.get_fx_rate]: 8,150ms ⚠️ (2x 4000ms timeout retries!)'
            },
            {
              activeNode: 'eval',
              badge: 'Step 4 · 加上匯率快取並跑黃金測試集上線',
              text: '為當日匯率加上 1 小時本地快取後，跑 100 題離線評估確認準確率 99%，總延遲驟降至 1.2 秒！',
              payload: 'Fixed Trace P95: 1,180ms (-87%) · Eval Faithfulness: 0.99 PASS'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '團隊打算把客服 Agent 底層模型從較貴的大模型換成便宜 70% 的輕量模型來省錢。工程師改完一行環境變數，自己隨手問了兩句「你好」「營業時間」覺得沒問題，準備週五下班前直接推上正式環境！',
      question: '身為資深工程師，你應該要求在推上線前補上什麼標準動作？',
      options: [
        {
          label: '先用黃金測試題庫（含多步工具呼叫、退款邊界案例與防越獄題）跑完整 Offline Evaluation，確認任務成功率與忠實度未退步，上線後再先導流 5% 觀察 Online Trace 指標！',
          isBest: true,
          consequence: '離線評估立刻抓出輕量模型在某個複合參數工具漏填欄位的問題，修好 Schema 描述後才安全灰度上線，既省下 70% 成本又零客訴！',
          explanation: '更換模型或修改核心 Prompt 就像修改資料庫核心邏輯，必須有自動化評估（Eval Regression Gate）與觀測指標護航。'
        },
        {
          label: '週五晚上直接 100% 全量切換，把告警通知關掉安心去露營',
          isBest: false,
          consequence: '週末兩天輕量模型漏呼叫退貨驗證 API，週一回公司發現累積兩千筆錯誤工單！',
          explanation: '憑 2 題直覺測試（Vibe Check）就全量換模型是生產環境頭號大忌。'
        },
        {
          label: '永遠禁止更新任何模型或程式碼',
          isBest: false,
          consequence: '錯失新模型降本增效的巨大紅利。',
          explanation: '建立自動化 Eval 管線的目的正是為了讓團隊敢於快速、安全地迭代升級。'
        }
      ]
    },
    codeLab: {
      title: '啟用 OpenTelemetry 觀測追蹤並記錄評估指標',
      notebookPath: '10-ai-agents-production/code_samples/10-python-agent-framework.ipynb',
      lines: [
        { code: 'from opentelemetry import trace\ntracer = trace.get_tracer("expense-claim-agent")', explain: '使用業界標準 OpenTelemetry Tracer，可無縫匯出至 Foundry Monitor 或 Langfuse。' },
        { code: 'with tracer.start_as_current_span("process_expense_claim") as span:\n    span.set_attribute("claim.amount_twd", 4200)\n    result = await expense_agent.run(claim_request)', explain: '用 Span 包裹任務執行，並掛上業務屬性（如報帳金額、部門），方便事後篩選分析！' },
        { code: '    span.set_attribute("agent.approved", result.approved)\n    print(f"Trace ID: {span.get_span_context().trace_id:032x}")', explain: '印出唯一 Trace ID，若客服回報某筆單異常，輸入 Trace ID 一秒調出完整推理與工具紀錄！' }
      ],
      simulatedOutput: '🌲 Span [process_expense_claim] started (amount_twd=4200)\n  ├─ Span [foundry.chat] 640ms · tokens=512\n  └─ Span [tool.verify_receipt_policy] 95ms -> PASS\n✓ Completed! Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736',
      puzzle: {
        instruction: '點選詞彙，為報帳 Agent 加上 OpenTelemetry Span 追蹤與自訂屬性紀錄：',
        templateParts: [
          'with tracer.',
          '("process_claim") as span:\n    span.',
          '("claim.amount", 4200)\n    result = await expense_agent.run(req)'
        ],
        answers: ['start_as_current_span', 'set_attribute'],
        distractors: ['hide_all_errors', 'delete_logs'],
        successNote: '完美！有了 Span 與業務屬性標記，生產環境任何效能瓶頸或異常推理都無所遁形！'
      }
    },
    flashcards: [
      {
        id: '10-trace-span',
        term: 'Trace & Span（追蹤樹與時間跨度）',
        category: '可觀測性',
        definition: 'Trace 代表一次端到端請求的完整生命週期；Span 則是其中每一個獨立步驟（如一次 LLM 呼叫、一次檢索或工具執行）的耗時與輸入輸出紀錄。',
        example: '展開一筆 Trace 可看見底下包含 3 個 LLM Spans 與 2 個 Tool Spans。'
      },
      {
        id: '10-llm-as-judge',
        term: 'LLM-as-a-Judge（模型裁判評估法）',
        category: '自動評估',
        definition: '使用具備明確評分標準（Rubric）的強大語言模型，自動化批改 Agent 輸出的相關性、忠實度（有無幻覺）與語氣品質。',
        example: '自動化為 200 題測試集打 1–5 分並挑出違背參考文件的回答。'
      },
      {
        id: '10-golden-dataset',
        term: 'Golden Dataset（黃金測試資料集）',
        category: '品質工程',
        definition: '由領域專家整理並驗證過標準答案／預期工具路徑的代表性測試題庫（包含正常題、刁鑽邊界題與惡意攻擊題）。',
        example: '每次發版前必跑黃金測試集，確保新改動沒有修好 A 卻弄壞 B（Regression）。'
      }
    ],
    quiz: [
      {
        question: '為什麼傳統網站只看「HTTP 200 成功率」與「CPU 使用率」，對生產環境的 AI Agent 來說遠遠不夠？',
        options: [
          '因為 Agent 可能回傳 HTTP 200，但內容其實產生了嚴重幻覺、叫錯工具或繞了 10 圈白燒 Token，必須靠 Trace 與語意評估才能發現！',
          '因為 AI Agent 不用網路傳輸',
          '因為 HTTP 200 代表伺服器當機',
          '因為 CPU 使用率永遠是 0%'
        ],
        answerIndex: 0,
        explanation: 'AI 系統的失敗往往是「靜默的語意品質退化或路徑失控」，必須結合 OpenTelemetry Tracing 與內容品質評估。'
      },
      {
        question: '在 OpenTelemetry 觀測架構中，「一筆完整使用者請求底下拆解出的單次工具呼叫紀錄」稱為什麼？',
        options: ['Span', 'Cookie', 'CSS Selector', 'Floppy Disk'],
        answerIndex: 0,
        explanation: '一筆完整的端到端請求為一個 Trace，內部由多個具父子階層關係的 Spans 組成。'
      },
      {
        question: '每次更換底層模型或大幅修改 System Prompt 前，最可靠的防退步做法是什麼？',
        options: [
          '自己隨便問一句「早安」沒壞就上線',
          '執行涵蓋常見與邊界情境的 Golden Dataset 離線評估（Offline Evaluation），比對改版前後各項指標分數',
          '擲筊決定要不要上線',
          '直接刪除所有錯誤紀錄'
        ],
        answerIndex: 1,
        explanation: '系統化的離線評估基準測試（Benchmarking）是防止模型升級或改寫 Prompt 造成意外退化的唯一科學方法。'
      }
    ],
    deepDive: [
      {
        heading: '生產環境四大必盯黃金指標',
        content: '上線後建議在儀表板固定追蹤四個數字：1) 品質指標（Grounding 忠實度、工具正確率、用戶正負評）；2) 延遲指標（TTFT 首字時間與 P95 總耗時）；3) 成本指標（平均每單任務 Token 花費）；4) 安全護欄觸發率（Prompt Injection 攔截次數與人工升級率）。'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '10-expense_claim-demo.ipynb（費用報銷審核生產示範）',
        url: `${REPO_BASE_URL}/blob/main/10-ai-agents-production/code_samples/10-expense_claim-demo.ipynb`,
        note: '完整實戰案例示範'
      },
      {
        type: 'Notebook 程式碼',
        title: '10-python-agent-framework.ipynb（MAF 觀測與追蹤）',
        url: `${REPO_BASE_URL}/blob/main/10-ai-agents-production/code_samples/10-python-agent-framework.ipynb`,
        note: '整合追蹤與評估流程'
      },
      {
        type: '官方文件',
        title: 'OpenTelemetry 官方網站',
        url: 'https://opentelemetry.io/',
        note: '雲端原生分散式追蹤開放標準'
      }
    ]
  },

  {
    id: '11',
    slug: '11-agentic-protocols',
    world: 3,
    title: 'Agent 通訊協定：MCP、A2A 與 NLWeb',
    subtitle: '告別每接一個工具就重寫一套轉接頭！認識 AI 時代的 USB-C 標準協定三劍客',
    estimatedMinutes: 9,
    xpReward: 150,
    tags: ['MCP', 'A2A Protocol', 'NLWeb'],
    videos: [
      {
        youtubeId: 'X-Dh9R3Opn8',
        title: 'Lesson 11：Using Agentic Protocols (MCP, A2A & NLWeb) 官方影片',
        note: '一次搞懂這三個最熱門的開放協定各自解決哪一層的互通問題！'
      }
    ],
    microCards: [
      {
        tag: '工具層標準',
        title: 'MCP (Model Context Protocol)：AI Agent 界的「USB-C 萬用轉接頭」！',
        body: '以前有 M 個框架想接 N 種外部工具（GitHub、Slack、PostgreSQL、本地檔案），社群得重複寫 M × N 套外掛！MCP 統一了標準介面：',
        bullets: [
          'MCP Host / Client（你的 Agent 應用）透過標準協定連線至任何 MCP Server。',
          'MCP Server 標準化暴露三種能力：Tools（可執行動作）、Resources（唯讀文件資料）與 Prompts（預設範本）。寫一次 Server，所有支援 MCP 的 Agent 都能即插即用！'
        ],
        image: {
          src: './course-images/mcp-diagram.e4ca1cbd551444a1.webp',
          caption: '點圖放大：MCP 讓 Host / Client 透過統一協定連接各種外部工具與資料庫 Server'
        }
      },
      {
        tag: '跨代理層標準',
        title: 'A2A (Agent-to-Agent Protocol)：不同團隊、不同框架 Agent 之間的「外交語言」！',
        body: 'MCP 解決的是「Agent 怎麼拿工具」；那如果你的 MAF 旅遊總管想請另一家合作夥伴用 LangGraph 寫的「租車專家 Agent」幫忙呢？這就是 A2A 的主場！',
        bullets: [
          'Agent Card（代理名片）：每隻遠端 Agent 公開自己的專長、輸入輸出格式與驗證方式（Discovery）。',
          '不必暴露內部私有記憶或原始程式碼，跨系統 Agent 就能安全派發長時任務、回報進度與交換成果（Artifacts）！'
        ],
        image: {
          src: './course-images/A2A-Diagram.8666928d648acc26.webp',
          caption: 'A2A 協定讓分屬不同平台或組織的獨立 Agent 能互相發現能力並協同辦事'
        }
      },
      {
        tag: '網站自然語言層',
        title: 'NLWeb (Natural Language Web)：讓每個網站原生變成「可對話的 MCP 知識節點」！',
        body: '由微軟推動的開源專案 NLWeb，善用網站原本就有的 Schema.org、RSS 等結構化標記，讓任何電商、食譜或新聞網站輕鬆開出自然語言問答端點，同時每個 NLWeb 實例本身就是一台標準 MCP Server！',
        image: {
          src: './course-images/nlweb-diagram.c1e2390b310e5fe4.webp',
          caption: 'NLWeb 結合網站既有 Schema.org 結構化資料與向量索引，同時服務人類與 AI Agent'
        }
      }
    ],
    flowSimulator: {
      title: 'MCP ＋ A2A ＋ NLWeb 三大協定聯手實戰模擬',
      description: '觀察你的個人助理 Agent 如何同時運用三大開放協定，無縫完成跨平台訂房與餐廳查詢！',
      nodes: [
        { id: 'host', icon: '🧑‍✈️', label: '個人總管 Agent' },
        { id: 'mcp', icon: '🔌', label: '行事曆 MCP Server' },
        { id: 'a2a', icon: '🤝', label: '遠端訂房專員 (A2A)' },
        { id: 'nlweb', icon: '🌐', label: '餐廳官網 (NLWeb)' }
      ],
      scenarios: [
        {
          name: '三協定分工協作全流程',
          steps: [
            {
              activeNode: 'host',
              badge: 'Step 1 · 收到跨系統任務',
              text: '使用者說：「看我下週五哪天有空，訂一晚台中飯店並找附近有包廂的台菜餐廳。」',
              payload: 'Goal: 查個人行事曆 + 跨平台訂飯店 + 查餐廳官網包廂資訊'
            },
            {
              activeNode: 'mcp',
              badge: 'Step 2 · 透過 MCP 讀取個人工具',
              text: 'Agent 用 MCP Client 呼叫Google/Outlook 行事曆 MCP Server 的 list_events 工具（垂直工具整合）。',
              payload: '[MCP] call tool: calendar.list_free_slots("next_week") -> 週五至週六全天有空'
            },
            {
              activeNode: 'a2a',
              badge: 'Step 3 · 透過 A2A 委派外部專職 Agent',
              text: '讀取旅遊夥伴公開的 Agent Card，透過 A2A 協定將「台中週五雙人房議價與保留」任務交給遠端專家 Agent！',
              payload: '[A2A] delegate task -> partner-hotel-agent.example/a2a -> 已保留草悟道商旅'
            },
            {
              activeNode: 'nlweb',
              badge: 'Step 4 · 透過 NLWeb 詢問餐廳結構化資料',
              text: '直接向支援 NLWeb（相容 MCP）的知名台菜官網發送自然語言查詢，秒拿精確包廂低消資訊，免爬蟲硬抓 HTML！',
              payload: '[NLWeb /ask] "週五晚餐有 6 人包廂嗎？" -> 有獨立包廂（Schema.org 驗證，低消 NT$6,000）'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '公司內部有 4 個不同部門（分別用 Python MAF、.NET MAF、VS Code Copilot 與本地端 Claude/Foundry 工具），大家都需要連接公司同一套「JIRA 工單查詢與 Git 知識庫工具」。如果每個部門各自手刻一套外掛，維護成本會翻四倍！',
      question: '這時候導入哪一個協定最對症下藥？',
      options: [
        {
          label: '將內部 JIRA 與知識庫封裝成一台標準的 MCP (Model Context Protocol) Server，四個部門的所有開發工具與 Agent 框架都能直接連線共用！',
          isBest: true,
          consequence: '從 M×N 重複造輪子變成 M+N！工具邏輯只要在 MCP Server 更新一次，全公司所有 Agent 同步受惠！',
          explanation: 'MCP 專為標準化「模型／Agent 連接外部工具與上下文資源」而生，是目前跨 IDE 與跨框架支援最廣的開放標準。'
        },
        {
          label: '強迫全公司四個部門把所有專案砍掉，只准用 Bash 腳本貼文字檔',
          isBest: false,
          consequence: '團隊抗議且失去各平台優勢。',
          explanation: '開放協定的美妙之處就是不必強迫統一上層應用，只要統一通訊介面即可互通。'
        },
        {
          label: '叫每個 Agent 用截圖 OCR 去硬讀 JIRA 網頁畫面',
          isBest: false,
          consequence: '又慢又貴又脆弱，明明有 API 卻繞遠路！',
          explanation: '有現成 API 時優先透過標準 MCP Tool 串接，速度快百倍且結構精準（沒有 API 的老舊系統才用第 15 課的 CUA 瀏覽器操作）。'
        }
      ]
    },
    codeLab: {
      title: '在 Microsoft Agent Framework 掛載 MCP 工具與 A2A 概念',
      notebookPath: '11-agentic-protocols/code_samples/11-mcp-agent-framework.ipynb',
      lines: [
        { code: '# 透過 MCP 連接外部住宿搜尋服務（如 Airbnb / 內部訂房 MCP Server）\n@tool(approval_mode="never_require")\ndef search_accommodations(\n    location: Annotated[str, "搜尋城市"],\n    guests: Annotated[int, "入住人數"] = 2,\n) -> str:\n    """透過標準化工具介面查詢可預訂房源清單。"""', explain: 'MCP Server 暴露出來的 Tool Schema（名稱、說明、參數型別）會被 MAF 自動轉換為 Agent 可直接呼叫的工具！' },
        { code: 'travel_agent = provider.as_agent(\n    name="MCPTravelPlanner",\n    instructions="使用已連接的 MCP 住宿與景點工具，為旅客規劃高評分住宿。",\n    tools=[search_accommodations],\n)', explain: '對上層 Agent 而言，無論底層是本地 Python 函式還是遠端 MCP Server，呼叫體驗完全一致！' }
      ],
      simulatedOutput: '🔌 [MCP Discovery] Connected to accommodation-mcp-server (3 tools discovered)\n🔧 [MCP Tool Call] search_accommodations(location="Tokyo", guests=2)\n🤖 MCPTravelPlanner: 為您查得「新宿現代公寓（評分 4.8 · 每晚 $120）」符合雙人入住需求！',
      puzzle: {
        instruction: '請配對正確的協定名稱，完成 AI Agent 三大開放協定的精準定位：',
        templateParts: [
          '1. Agent 連接外部工具與資料資源的標準轉接頭：',
          '\n2. 跨組織／跨框架獨立 Agent 之間發現能力與委派任務：',
          '\n3. 讓網站利用 Schema.org 原生支援自然語言查詢：',
          ''
        ],
        answers: ['MCP', 'A2A', 'NLWeb'],
        distractors: ['FTP', 'SMTP'],
        successNote: '三大協定一次秒懂！MCP 管「接工具」、A2A 管「跨代理協作」、NLWeb 管「網站原生對話介面」！'
      }
    },
    flashcards: [
      {
        id: '11-mcp',
        term: 'MCP (Model Context Protocol)',
        category: '通訊協定',
        definition: '標準化應用程式／AI Agent 如何向語言模型提供外部上下文資源（Resources）、可執行工具（Tools）與提示範本（Prompts）的開放協定。',
        example: '接上 GitHub MCP Server，Agent 立刻學會查 PR、讀 Issue 與搜程式碼。'
      },
      {
        id: '11-a2a',
        term: 'A2A (Agent-to-Agent Protocol)',
        category: '通訊協定',
        definition: '讓不同廠商或不同框架建構的獨立自主 Agent，透過公開 Agent Card 互相發現能力、委派長時任務並安全交換結果的標準協定。',
        example: '企業客服 Agent 透過 A2A 向物流公司的追蹤 Agent 查詢包裹即時動態。'
      },
      {
        id: '11-nlweb',
        term: 'NLWeb (Natural Language Web)',
        category: '通訊協定',
        definition: '利用網站既有的結構化標記（Schema.org / RSS）快速為網站建立自然語言問答介面，且天然相容成為 MCP Server 的開源架構。',
        example: '電商網站部署 NLWeb 後，人類與外部購物 Agent 都能直接用自然語言精準查商品。'
      }
    ],
    quiz: [
      {
        question: '「MCP（Model Context Protocol）」與「A2A（Agent-to-Agent）」兩者分工關係最貼切的比喻是什麼？',
        options: [
          '兩個完全一樣只是拼錯字',
          'MCP 像工匠手上的「萬用工具插座（連接工具與資料庫）」；A2A 像不同專業工匠之間的「對講機與派工合約（跨代理協作）」',
          'MCP 只能傳圖片，A2A 只能傳音樂',
          '用了 MCP 就永遠不能用多代理'
        ],
        answerIndex: 1,
        explanation: 'MCP 負責 Agent 對工具／資源的垂直連接；A2A 負責自主 Agent 與另一隻自主 Agent 之間的水平協作，兩者相輔相成！'
      },
      {
        question: '在 A2A 協定中，遠端 Agent 用什麼機制向外界宣告「我會做什麼、接受什麼輸入格式、怎麼驗證身份」？',
        options: ['Agent Card（代理名片）', '紙本傳單', '系統藍白畫面', '隱藏起來不讓人知道'],
        answerIndex: 0,
        explanation: 'Agent Card（通常以標準 JSON 描述發佈於固定路徑）讓客戶端 Agent 能動態進行能力發現（Capability Discovery）。'
      },
      {
        question: 'NLWeb 主要是善用網站原本就常具備的哪種結構化資料標準，快速建立精準的自然語言介面？',
        options: ['Schema.org / RSS 等結構化網頁資料', 'Flash 動畫檔', '隨機亂碼', 'BIOS 設定'],
        answerIndex: 0,
        explanation: '無數食譜、商品、活動網站早已內建 Schema.org 標記給搜尋引擎看，NLWeb 直接將其轉化為高品質的語意查詢與 MCP 節點。'
      }
    ],
    deepDive: [
      {
        heading: '雙 Notebook 動手練：MCP 與 A2A 範例都在本課資料夾！',
        content: '本課同時提供 11-mcp-agent-framework.ipynb 與 11-a2a-agent-framework.ipynb 兩份實作範例，讓你對照體會「掛載工具」與「跨代理委派」在程式碼寫法上的清晰分工！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '11-mcp-agent-framework.ipynb（MCP 實戰）',
        url: `${REPO_BASE_URL}/blob/main/11-agentic-protocols/code_samples/11-mcp-agent-framework.ipynb`,
        note: 'Python MAF 整合 MCP 工具範例'
      },
      {
        type: 'Notebook 程式碼',
        title: '11-a2a-agent-framework.ipynb（A2A 跨代理實戰）',
        url: `${REPO_BASE_URL}/blob/main/11-agentic-protocols/code_samples/11-a2a-agent-framework.ipynb`,
        note: '示範 Agent Card 與跨代理互動'
      },
      {
        type: '延伸課程',
        title: 'Microsoft MCP for Beginners 專題課程',
        url: 'https://aka.ms/mcp-for-beginners',
        note: '想深入自製 MCP Server 必看的姊妹課程'
      },
      {
        type: '規格與論文',
        title: 'NLWeb 官方開源專案（GitHub）',
        url: 'https://github.com/nlweb-ai/NLWeb',
        note: 'Natural Language Web 原始碼與架構說明'
      }
    ]
  },

  {
    id: '12',
    slug: '12-context-engineering',
    world: 3,
    title: 'Context Engineering 脈絡工程',
    subtitle: 'Context Window 再大也不是垃圾桶！學會挑選、壓縮、隔離脈絡，治好「聊越久越笨」的毛病',
    estimatedMinutes: 8,
    xpReward: 140,
    tags: ['Context Rot', 'Summarization', '脈絡隔離'],
    videos: [
      {
        youtubeId: 'F5zqRV7gEag',
        title: 'Lesson 12：Context Engineering for AI Agents 官方影片',
        note: '從「寫好一句 Prompt」升級到「動態編排整個 Context Window 資訊配置」'
      }
    ],
    microCards: [
      {
        tag: '觀念躍遷',
        title: '從 Prompt Engineering 到 Context Engineering（脈絡工程）',
        body: '如果說 Prompt Engineering 是「把一句指令寫漂亮」；那 Context Engineering 就是「在每次呼叫模型的那一瞬間，精準決定哪些系統指令、歷史摘要、檢索片段與工具回傳該放進有限的注意力視窗（Context Window），又有哪些雜訊必須丟掉！」',
        image: {
          src: './course-images/context-types.fc10b8927ee43f06.webp',
          caption: '點圖放大：構成 Agent 脈絡的多種來源——指令、對話歷史、工具結果、記憶與外部知識'
        }
      },
      {
        tag: '隱形殺手',
        title: '就算模型支援 200K / 1M Tokens，為什麼全塞進去反而變笨？',
        body: '千萬別迷信大視窗就無腦全塞！研究與實戰都證實了三大現象：',
        bullets: [
          'Context Rot / Lost-in-the-Middle（脈絡腐敗／迷失中間）：無關的歷史廢話與冗長 JSON 工具輸出越多，模型對真正關鍵條件的注意力就被稀釋得越嚴重！',
          'Context Poisoning（錯誤污染）：第 2 輪某次錯誤猜測若一直留在對話紀錄裡，後面 10 輪都會被它帶偏。',
          '每輪重複重傳幾萬個歷史 Token，延遲與費用呈平方級累加！'
        ]
      },
      {
        tag: '四大王牌手法',
        title: '精準治本四招：Write（外寫）、Select（精挑）、Compress（壓縮摘要）、Isolate（子代理隔離）',
        body: '實戰最有效的脈絡管理策略：',
        bullets: [
          '滾動對話摘要（Chat Summarization）：當對話超過 N 輪，將舊對話濃縮成精煉重點摘要，只保留最近幾輪原文。',
          '修剪肥胖工具輸出（Tool Output Pruning）：API 回傳 50 個無用欄位時，先在 Python 濾出關鍵 4 個欄位再餵給模型！',
          '子代理脈絡隔離（Sub-agent Isolation）：讓子代理去讀完 30 頁長文，只把 300 字結論傳回主代理，保持主視窗乾淨清爽！'
        ],
        image: {
          src: './course-images/best-practices.f4170873dc554f58.webp',
          caption: 'Context Engineering 最佳實踐：精選、壓縮與隔離高信噪比資訊'
        }
      }
    ],
    flowSimulator: {
      title: '無腦全塞爆視窗 vs. 滾動摘要與工具修剪（Context Compaction）',
      description: '比較在長達 25 輪的客服除錯對話中，有無 Context Engineering 對準確率與 Token 消耗的驚人差異！',
      nodes: [
        { id: 'raw', icon: '📥', label: '原始工具與長對話' },
        { id: 'prune', icon: '✂️', label: '修剪無用 JSON 欄位' },
        { id: 'sum', icon: '🗜️', label: '滾動歷史摘要' },
        { id: 'focus', icon: '🎯', label: '高信噪比推理' }
      ],
      scenarios: [
        {
          name: '啟用修剪 + 滾動摘要（清爽高準確率）',
          steps: [
            {
              activeNode: 'raw',
              badge: 'Step 1 · 攔截肥胖原始資料',
              text: '訂單 API 回傳 18KB 原始 JSON（含 90 個內部除錯欄位），且對話已累積 20 輪。',
              payload: 'raw_tool_json = 4,800 tokens | raw_history = 14,000 tokens'
            },
            {
              activeNode: 'prune',
              badge: 'Step 2 · 工具回傳瘦身（Pruning）',
              text: '工具層只保留 order_id、status、items、eta 四個業務欄位，瞬間砍掉 92% 雜訊！',
              payload: 'pruned_tool_output = 120 tokens (信噪比提升 10 倍！)'
            },
            {
              activeNode: 'sum',
              badge: 'Step 3 · 舊輪次壓縮為結構化摘要',
              text: '將前 16 輪閒聊壓縮成 150 tokens 的「已確認事實清單」，搭配最近 4 輪完整對話。',
              payload: 'summary = "客戶王先生 · 訂單#A102 · 希望改週六上午配送" (150 tokens)'
            },
            {
              activeNode: 'focus',
              badge: 'Step 4 · 快、準、省完成回應',
              text: '模型視窗乾淨無雜訊，零遺忘客戶限制條件，Token 成本省下 85%！',
              payload: 'Total Input: 1,150 tokens · Latency: 0.7s · Constraint Recall: 100%'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '你的團隊做了一隻「程式碼庫健檢 Agent」，每次使用者問問題，主 Agent 就呼叫 read_file 連讀 15 個大檔案，把 8 萬個 Token 的原始碼全堆在主對話歷史裡。問到第 3 題時，Agent 開始胡言亂語忘記第 1 題講過的架構規範！',
      question: '運用第 12 課 Context Engineering 技巧，哪種架構調整最聰明？',
      options: [
        {
          label: '採用「子代理脈絡隔離（Context Isolation）＋ 滾動摘要」：派專職檔案分析子 Agent 在獨立視窗讀檔並只回傳精簡結構摘要給主 Agent，定期壓縮舊輪次對話！',
          isBest: true,
          consequence: '主 Agent 的 Context Window 永遠維持在精煉清晰的幾千 Token，連續聊 30 輪依然頭腦清醒、速度飛快！',
          explanation: '隔離高體積中間過程（Isolate）並只傳遞高密度結論（Compress），是解決多步工具脈絡爆炸的王道解法。'
        },
        {
          label: '把使用者的問題從 Context 裡刪掉，只留 8 萬字原始碼',
          isBest: false,
          consequence: '模型連問題是什麼都不知道了！',
          explanation: '使用者當前目標與核心限制條件正是絕對不可刪除的高優先脈絡。'
        },
        {
          label: '規定使用者每問完一題就強制登出重開帳號',
          isBest: false,
          consequence: '多輪追問體驗徹底歸零。',
          explanation: '透過對話摘要（Chat Summarization）就能在不犧牲連貫體驗的前提下控制視窗長度。'
        }
      ]
    },
    codeLab: {
      title: '實作對話視窗滾動摘要（Chat Summarization 精華）',
      notebookPath: '12-context-engineering/code_samples/12-chat_summarization.ipynb',
      lines: [
        { code: 'MAX_RECENT_TURNS = 6  # 保留最近 6 則完整對話，更早的濃縮為摘要', explain: '設定滑動視窗門檻：兼顧近期對話細節與長期重點記憶。' },
        { code: 'if len(messages) > MAX_RECENT_TURNS:\n    older = messages[:-MAX_RECENT_TURNS]\n    recent = messages[-MAX_RECENT_TURNS:]', explain: '切分出「需要壓縮的早期對話（older）」與「保留原貌的近期對話（recent）」。' },
        { code: '    summary = await summarizer_agent.run(\n        f"請濃縮以下對話的關鍵事實、使用者偏好與待辦結論：\\n{older}"\n    )\n    messages = [{"role": "system", "content": f"先前對話摘要：{summary}"}] + recent', explain: '用輕量摘要取代冗長歷史紀錄，讓 Context Window 永遠保持黃金信噪比！' }
      ],
      simulatedOutput: '🗜️ 觸發脈絡壓縮：前 14 則訊息（5,820 tokens）-> 濃縮摘要（165 tokens，節省 97%！）\n🤖 主代理帶著精準摘要與最近 6 則對話繼續流暢回應！',
      puzzle: {
        instruction: '點選詞彙，完成「超過門檻時壓縮舊對話、保留近期對話」的脈絡管理邏輯：',
        templateParts: [
          'if len(messages) > MAX_RECENT_TURNS:\n    older = messages[:-MAX_RECENT_TURNS]\n    ',
          ' = messages[-MAX_RECENT_TURNS:]\n    summary = await summarizer.run(older)\n    messages = [{"role": "system", "content": ',
          '}] + recent'
        ],
        answers: ['recent', 'summary'],
        distractors: ['raw_100mb_dump', 'undefined'],
        successNote: '答對了！滾動摘要加上近期滑動視窗，是所有生產級多輪對話 Agent 必備的省錢提速神技！'
      }
    },
    flashcards: [
      {
        id: '12-context-engineering',
        term: 'Context Engineering（脈絡工程）',
        category: '核心技術',
        definition: '系統化設計與動態管理在每次推理呼叫時進入模型 Context Window 的所有資訊（指令、歷史、工具結果、記憶與檢索知識），最大化信噪比。',
        example: '自動過濾無關 API 欄位、壓縮舊對話並動態注入最相關的 3 條規則。'
      },
      {
        id: '12-context-rot',
        term: 'Context Rot / Lost-in-the-Middle',
        category: '模型特性',
        definition: '隨著輸入脈絡拉長且混雜過多低相關資訊，模型對夾在中間段落的關鍵事實與限制條件注意力顯著下降的現象。',
        example: '塞了十篇無關文章後，模型漏看了藏在第 4 頁的一句重要除外條款。'
      },
      {
        id: '12-context-isolation',
        term: 'Context Isolation（脈絡隔離）',
        category: '多代理技巧',
        definition: '將耗費大量中間 Token 的搜尋或閱讀任務委派給擁有獨立 Context Window 的子 Agent，主 Agent 僅接收濃縮後的乾淨結論。',
        example: '主代理派 Log 分析子代理讀完萬行錯誤檔，只收回 5 行根因結論。'
      }
    ],
    quiz: [
      {
        question: '既然現代 LLM 支援高達 128K 甚至百萬級 Context Window，為什麼我們還需要 Context Engineering？',
        options: [
          '因為無腦塞滿無關雜訊會引發 Context Rot（注意力稀釋導致變笨）、錯誤污染，且每輪重傳龐大 Token 會讓延遲與成本暴增！',
          '純粹因為工程師太閒想多寫幾行程式',
          '因為超過 100 個字網路線就會斷掉',
          '完全不需要，把整顆硬碟轉成文字塞進去就對了'
        ],
        answerIndex: 0,
        explanation: 'Context Window 是「珍貴的工作檯面」而非儲藏室，檯面越乾淨聚焦，推理品質與速度就越好。'
      },
      {
        question: '當外部 REST API 回傳一個包含 80 個欄位（其中 75 個是前端排版與無用內部狀態碼）的巨型 JSON 時，最佳做法是什麼？',
        options: [
          '原封不動把整包 80 個欄位塞進對話歷史',
          '在 @tool 函式回傳前先做欄位修剪（Pruning），只擷取對任務有意義的 5 個核心欄位回傳給模型',
          '把 JSON 印出來拍照再轉 Base64 塞回去',
          '乾脆不回傳任何東西'
        ],
        answerIndex: 1,
        explanation: '在工具邊界先淨化與精簡回傳結構，是最簡單卻回報率最高的 Context Engineering 技巧！'
      },
      {
        question: '「把前 20 輪冗長對話濃縮成一段關鍵事實摘要，並搭配最近 4–6 輪完整對話一起送給模型」稱為什麼技巧？',
        options: [
          'Rolling Chat Summarization（滾動對話摘要／滑動視窗）',
          'SQL Injection',
          'Overfitting',
          'CSS Flexbox'
        ],
        answerIndex: 0,
        explanation: '結合長期濃縮摘要與近期完整對話，能在固定 Token 預算內維持無限輪次的流暢互動。'
      }
    ],
    deepDive: [
      {
        heading: 'Context（第 12 課）與 Memory（第 13 課）怎麼區分？',
        content: '用電腦硬體比喻超好懂：**Context Window 就像 CPU 旁的「快取／RAM 工作檯」**（容量有限、當次推理直接讀取）；而下一課要學的 **Agent Memory 則是「SSD 長期資料庫」**（跨天、跨對話持久保存，需要時再精選載入工作檯）！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '12-chat_summarization.ipynb（對話壓縮與摘要實戰）',
        url: `${REPO_BASE_URL}/blob/main/12-context-engineering/code_samples/12-chat_summarization.ipynb`,
        note: '示範長對話自動摘要與脈絡瘦身'
      },
      {
        type: '官方文件',
        title: 'Lesson 12 原文講義：Context Engineering for AI Agents',
        url: `${REPO_BASE_URL}/blob/main/12-context-engineering/README.md`,
        note: '完整脈絡類型分類與最佳實踐指南'
      }
    ]
  },

  {
    id: '13',
    slug: '13-agent-memory',
    world: 3,
    title: 'Agent Memory 記憶管理架構',
    subtitle: '讓 Agent 跨對話記住你的習慣與過去經驗：拆解語意記憶、情節記憶、程序記憶與知識圖譜',
    estimatedMinutes: 8,
    xpReward: 140,
    tags: ['Short/Long-term Memory', 'Episodic & Semantic', 'Cognee'],
    videos: [
      {
        youtubeId: 'QrYbHesIxpw',
        title: 'Lesson 13：Memory for AI Agents 官方影片',
        note: '學習如何設計會成長、記住個人偏好同時尊重隱私遺忘權的記憶系統'
      }
    ],
    microCards: [
      {
        tag: '記憶分類學',
        title: '不只分長短期！借鏡人類大腦的四大 Agent 記憶類型',
        body: '沒有長期記憶的 Agent，每次重開對話都像失憶症患者一樣重問「請問您對什麼食物過敏？」。完整的記憶架構分為：',
        bullets: [
          'Working / Short-term Memory（短期工作記憶）：當前這一輪對話 Session 內的上下文狀態。',
          'Semantic Memory（語意事實記憶）：跨對話記住的客觀事實與使用者偏好（如「使用者慣用 Python 3.12、不吃牛肉」）。',
          'Episodic Memory（情節經驗記憶）：記住過去某次具體互動事件（「上個月幫這位客戶處理過日本機票改期成功案例」）。',
          'Procedural Memory（程序技能記憶）：記住做事的標準 SOP 流程與從回饋中學到的慣例。'
        ],
        image: {
          src: './course-images/lesson-13-thumbnail.959e3bc52d210c64.webp',
          caption: '結構化記憶系統讓 AI Agent 從一次性工具進化為越用越懂你的個人化夥伴'
        }
      },
      {
        tag: '儲存技術',
        title: '向量庫還不夠？結合 Knowledge Graph（知識圖譜，如 Cognee）！',
        body: '單純把對話紀錄切塊丟進向量庫，遇到「張經理調部門後改由誰簽核？」這種實體關係更新很容易新舊打架！結合結構化 KV 資料庫 ＋ 向量檢索 ＋ 知識圖譜（如本課範例使用的 Cognee），能精準表達「人—專案—偏好」之間的關聯與覆寫更新！'
      },
      {
        tag: '隱私與治理',
        title: '記住該記的，更要「懂得忘記不該記的」！',
        body: '記憶系統一旦上線，資安與隱私就是重中之重：',
        bullets: [
          '嚴格租戶隔離（User / Tenant Scoping）：A 客戶的記憶絕對不能在 B 客戶查詢時被檢索出來！',
          '不把信用卡號、密碼、一次性驗證碼寫入長期記憶。',
          '提供透明的「檢視記憶／一鍵清除記憶（Right to be Forgotten）」與過期淘汰（TTL）機制。'
        ]
      }
    ],
    flowSimulator: {
      title: '跨對話記憶寫入（Consolidation）與召回（Recall）模擬器',
      description: '觀察使用者在「週一第一次聊天」與「週五開啟全新對話」時，Agent 如何萃取並運用長期語意與情節記憶！',
      nodes: [
        { id: 'chat1', icon: '💬', label: '週一對話萃取' },
        { id: 'store', icon: '🗄️', label: '長期記憶庫 (Scoped)' },
        { id: 'chat2', icon: '👋', label: '週五全新對話' },
        { id: 'reply', icon: '💡', label: '個人化貼心回應' }
      ],
      scenarios: [
        {
          name: '跨 Session 記住飲食禁忌與過往經驗',
          steps: [
            {
              activeNode: 'chat1',
              badge: '週一 · 記憶萃取（Memory Extraction）',
              text: '對話中提到：「我對甲殼類海鮮嚴重過敏，另外上次訂的那家京都町家民宿超棒！」',
              payload: 'extract_facts() -> [\n  Semantic: {allergy: "shellfish"},\n  Episodic: {liked_stay: "Kyoto Machiya Inn"}\n]'
            },
            {
              activeNode: 'store',
              badge: '寫入隔離記憶空間',
              text: '綁定 user_id="u_882" 存入長期記憶庫，並附上時間戳記與來源可信度。',
              payload: 'memory_store.upsert(namespace="user:u_882", records=2)'
            },
            {
              activeNode: 'chat2',
              badge: '週五 · 開啟全新 Session 發問',
              text: '使用者只簡短問一句：「幫我推薦大阪晚餐餐廳跟傳統風格住宿！」（完全沒重提過敏的事！）',
              payload: 'new_session_input = "推薦大阪晚餐跟傳統住宿"'
            },
            {
              activeNode: 'reply',
              badge: '自動召回記憶保護安全！',
              text: 'Agent 檢索 u_882 記憶，主動避開螃蟹蝦料理餐廳，並延續京都町家的喜好推薦大阪傳統老屋旅宿！',
              payload: 'Recall hit! -> 「已自動為您排除含蝦蟹甲殼類餐廳，並挑選類似您上次喜愛的町家風格旅宿！」'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '你在開發銀行理財顧問 Agent 的長期記憶功能。某工程師直接把所有客戶的聊天內容混在同一個沒有 user_id 篩選條件的全域 Vector Index 裡，連客戶順手貼的身分證字號也原封不動存進去！',
      question: '這套記憶設計踩了哪兩個致命地雷？該怎麼修？',
      options: [
        {
          label: '1) 檢索與寫入強制加上嚴格的 user_id / tenant_id 權限過濾（防止跨客戶個資外洩）；2) 寫入前先經過 PII 敏感資訊脫敏過濾，並提供客戶「查看與刪除個人記憶」介面！',
          isBest: true,
          consequence: '每位客戶的偏好記憶安全隔離絕不串門子，且完全符合金融個資合規與被遺忘權要求！',
          explanation: '跨用戶記憶洩漏（Cross-tenant memory leakage）與未過濾敏感憑證是實作 Agent Memory 時最危險的資安漏洞。'
        },
        {
          label: '維持全域共用索引，當客戶問別人的存款時請模型「假裝沒看到」',
          isBest: false,
          consequence: '隨便一句引導就會把其他VIP客戶的資產狀況洩漏出去，引發重大法規裁罰！',
          explanation: '存取控制必須在資料庫查詢層（Metadata Filter / Namespace）硬性隔離，絕不能把別人的資料撈進 Context 再求模型閉嘴。'
        },
        {
          label: '把所有記憶都存在網址列 Query String 上超過 10 萬字',
          isBest: false,
          consequence: '網址過長直接報 HTTP 414 錯誤且瀏覽紀錄全部曝光。',
          explanation: '長期記憶應存放於受身份驗證保護的伺服器端或加密本地儲存中。'
        }
      ]
    },
    codeLab: {
      title: '實作具備 User Namespace 隔離的記憶寫入與檢索工具',
      notebookPath: '13-agent-memory/13-agent-memory.ipynb',
      lines: [
        { code: 'def save_user_memory(user_id: str, fact: str, mem_type: str = "semantic") -> None:\n    """將萃取出的偏好或重要事件存入該使用者專屬隔離空間。"""\n    MEMORY_DB.setdefault(user_id, []).append({"type": mem_type, "fact": fact})', explain: '所有記憶寫入一律以驗證過的 user_id 作為隔離鍵（Namespace），不與其他使用者混放！' },
        { code: 'def recall_user_memories(user_id: str) -> list[dict]:\n    """在開啟新對話時載入該使用者的長期記憶清單。"""\n    return MEMORY_DB.get(user_id, [])', explain: '新 Session 開始時，只精準召回屬於當前使用者的記憶注入脈絡。' }
      ],
      simulatedOutput: '💾 [Memory Saved · user=u_882] semantic: 偏好深色模式、Python 3.12 範例\n🔍 [Memory Recalled · New Session] 已載入 2 筆個人化偏好記憶！',
      puzzle: {
        instruction: '請配對正確的記憶類型英文術語：',
        templateParts: [
          '1. 記住客觀事實與使用者長期偏好（如不吃花生）：',
          ' Memory\n2. 記住過去某次具體互動事件與經驗案例：',
          ' Memory'
        ],
        answers: ['Semantic', 'Episodic'],
        distractors: ['Volatile_BIOS', 'Random_Noise'],
        successNote: '記超熟！Semantic 管「事實與偏好」，Episodic 管「過往經歷與具體案例」！'
      }
    },
    flashcards: [
      {
        id: '13-semantic-memory',
        term: 'Semantic Memory（語意記憶）',
        category: '記憶架構',
        definition: '儲存跨對話穩定的事實知識、使用者個人偏好與實體關係（例如職業、過敏原、慣用程式語言）。',
        example: '「使用者住在台中，偏好高鐵靠窗座位」。'
      },
      {
        id: '13-episodic-memory',
        term: 'Episodic Memory（情節記憶）',
        category: '記憶架構',
        definition: '記錄過去特定時間點發生的具體互動過程與成敗經驗，可作為未來類似任務的 Few-shot 參考案例。',
        example: '「2026 年 10 月曾協助排解過 Docker 連接埠衝突問題，採用方案 B 成功」。'
      },
      {
        id: '13-memory-scoping',
        term: 'Memory Scoping & TTL（記憶隔離與存活期限）',
        category: '隱私安全',
        definition: '透過 user_id / tenant_id 強制隔離不同用戶記憶，並為具時效性的記憶設定過期時間（TTL）與手動刪除權。',
        example: '「本週出差住大阪」設 7 天過期，而「對海鮮過敏」設為長期保存。'
      }
    ],
    quiz: [
      {
        question: '「記住使用者對甲殼類過敏、習慣閱讀台灣繁體中文」屬於哪一種長期記憶？',
        options: [
          'Semantic Memory（語意事實與偏好記憶）',
          '螢幕保護程式',
          'CPU L1 快取',
          '網路封包碰撞'
        ],
        answerIndex: 0,
        explanation: '關於使用者穩定屬性、偏好與客觀事實的知識屬於 Semantic Memory。'
      },
      {
        question: '在多用戶 SaaS 服務中設計 Agent Memory，最重要的資安紅線是什麼？',
        options: [
          '記憶越多越好不用管是誰的',
          '嚴格執行 User / Tenant 命名空間隔離（Scoping），過濾敏感憑證，並提供使用者查看與刪除記憶的控制權',
          '把所有用戶密碼明文寫進記憶裡',
          '禁止使用任何資料庫'
        ],
        answerIndex: 1,
        explanation: '租戶隔離與敏感資料過濾是防止跨客戶資料外洩的核心防線。'
      },
      {
        question: '為什麼本課進階範例會結合 Cognee 等「知識圖譜（Knowledge Graph）」來管理記憶？',
        options: [
          '為了畫出漂亮的蜘蛛網當桌布',
          '能結構化表達人、事、物之間的關聯，並在狀態改變（如換部門、改偏好）時精準更新節點關係而不留矛盾舊碎片',
          '因為向量搜尋不能存中文',
          '為了讓硬碟空間佔滿'
        ],
        answerIndex: 1,
        explanation: '圖譜結構特別擅長處理多實體間的關聯推理與動態事實更新。'
      }
    ],
    deepDive: [
      {
        heading: '雙 Notebook 推薦：基礎記憶 vs. Cognee 圖譜記憶',
        content: '本課收錄了 13-agent-memory.ipynb 與進階的 13-agent-memory-cognee.ipynb 兩份實戰筆記本，想進一步打造超聰明知識圖譜記憶系統千萬別錯過！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '13-agent-memory.ipynb（Agent 記憶核心實作）',
        url: `${REPO_BASE_URL}/blob/main/13-agent-memory/13-agent-memory.ipynb`,
        note: '示範長短期記憶讀寫管理'
      },
      {
        type: 'Notebook 程式碼',
        title: '13-agent-memory-cognee.ipynb（Cognee 知識圖譜記憶）',
        url: `${REPO_BASE_URL}/blob/main/13-agent-memory/13-agent-memory-cognee.ipynb`,
        note: '進階語意圖譜記憶整合範例'
      }
    ]
  },

  {
    id: '14',
    slug: '14-microsoft-agent-framework',
    world: 3,
    title: '深入 Microsoft Agent Framework (MAF) 高階編排',
    subtitle: '一次集齊 6 大生產級利器：Sequential、Concurrent、條件路由、Handoff、HITL 與 Middleware！',
    estimatedMinutes: 10,
    xpReward: 150,
    tags: ['WorkflowBuilder', 'Middleware', 'Conditional Edges'],
    videos: [],
    microCards: [
      {
        tag: '架構全貌',
        title: 'MAF 兩大核心支柱：Chat Agents ＋ Graph Workflows',
        body: '第 14 課是整套課程把先前所有設計模式「落地成乾淨工程架構」的集大成章節！MAF 讓你自由混合兩種力量：',
        bullets: [
          'AI Agents（彈性推理節點）：由 FoundryChatClient 驅動，負責處理自然語言理解、工具呼叫與動態決策。',
          'Workflows（確定性圖形管線）：透過 WorkflowBuilder 把多個 Agent 與純 Python 函式用有向圖（Edges）串起來，保證流程可預測、好測試！'
        ],
        image: {
          src: './course-images/framework-intro.077af16617cf130c.webp',
          caption: '點圖放大：Microsoft Agent Framework 統一了單一代理與複雜多步驟圖形工作流'
        }
      },
      {
        tag: '秘密武器',
        title: 'Middleware（中介攔截層）：不改業務邏輯就能統一加上護欄與日誌！',
        body: '寫過 Web 後端（如 Express / FastAPI）一定愛死 Middleware！在 MAF 中，你可以掛載 Agent / Function Middleware，在每次呼叫模型或工具「前後」自動執行：',
        bullets: [
          '統一過濾輸入輸出的個資（PII Redaction）或惡意詞彙。',
          '計算每次工具呼叫耗時、統一檢查權限、或實作快取短路（Short-circuit）回傳！'
        ],
        image: {
          src: './course-images/agent-components.410a06daf87b4fef.webp',
          caption: 'MAF 代理核心組件：模型提供者、指令、工具、記憶與 Middleware 攔截管線'
        }
      },
      {
        tag: '六大實戰劇本',
        title: '本課一次提供 6 份即戰力 Notebook 範本！',
        body: '打開本課的 code-samples，你會拿到企業最常寫的六種標準樣板：',
        bullets: [
          '14-sequential（循序接棒）、14-concurrent（平行扇出匯總）、14-conditional-workflow（依分數或條件走不同分支）。',
          '14-handoff（動態專員交接）、14-human-loop（工作流暫停等人工簽核再續跑）、14-middleware（統一攔截計時與審計）！'
        ]
      }
    ],
    flowSimulator: {
      title: 'MAF Conditional Workflow ＋ Middleware 攔截管線模擬器',
      description: '點按步驟，觀察一個掛有 Middleware 的條件分支工作流（Conditional Workflow）如何依評分結果自動分流！',
      nodes: [
        { id: 'mw', icon: '🛡️', label: 'Middleware 前置檢查' },
        { id: 'front', icon: '🛎️', label: '景點推薦 Agent' },
        { id: 'concierge', icon: '⭐', label: '評分審查 Agent' },
        { id: 'branch', icon: '🔀', label: '條件路由分支' }
      ],
      scenarios: [
        {
          name: '高分直通 vs. 低分退回重選（Conditional Edge）',
          steps: [
            {
              activeNode: 'mw',
              badge: 'Step 1 · Middleware 攔截記錄與脫敏',
              text: '請求進入工作流前，Middleware 自動記錄時間戳記並隱碼處理使用者電話號碼。',
              payload: '[Middleware] PII masked · timer started · request authorized'
            },
            {
              activeNode: 'front',
              badge: 'Step 2 · FrontDesk 產出結構化景點卡片',
              text: '前台 Agent 輸出 Pydantic 格式的 AttractionRecommendation（台北象山步道）。',
              payload: 'AttractionRecommendation(city="Taipei", attraction_name="象山親山步道")'
            },
            {
              activeNode: 'concierge',
              badge: 'Step 3 · Concierge 禮賓官獨立打分',
              text: '禮賓官考量今日暴雨特報，給予戶外登山 popularity_score = 3（低於門檻 7 分）！',
              payload: 'AttractionReview(popularity_score=3, reason="今日大雨步道濕滑不建議前往")'
            },
            {
              activeNode: 'branch',
              badge: 'Step 4 · Conditional Edge 智慧分流！',
              text: '條件邊偵測 score < 7，自動走「室內備案分支」改推台北 101 觀景台與故宮，保障旅客體驗！',
              payload: 'condition(score < 7) == True -> Route to IndoorBackupAgent -> 推薦國立故宮博物院 ✓'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '公司有 12 隻不同部門寫的 MAF Agent，資安長臨時下令：「下週起，所有 Agent 呼叫任何外部工具前，都必須統一記錄稽核 Log 並擋掉包含身分證字號的參數！」工程師苦惱難道要去改 12 個專案裡上百個 @tool 函式嗎？',
      question: '在 Microsoft Agent Framework (MAF) 中，最優雅零重複的解法是什麼？',
      options: [
        {
          label: '撰寫一個共用的 Function / Agent Middleware（中介層），在呼叫 next() 前統一執行身分證正規表達式檢查與寫入 Audit Log，一行掛載到所有 Agent 上！',
          isBest: true,
          consequence: '完全不用動上百個業務工具的內部程式碼，橫切關注點（Cross-cutting concerns）一次乾淨搞定！',
          explanation: 'Middleware 正是處理日誌、計時、權限驗證、PII 過濾與快取等橫切邏輯的標準架構利器。'
        },
        {
          label: '人工複製貼上同一段 if 檢查碼到 120 個工具函式裡，以後改規則再重貼 120 次',
          isBest: false,
          consequence: '漏貼兩個函式立刻產生資安破口，維護起來痛苦萬分。',
          explanation: '違反 DRY（Don\'t Repeat Yourself）原則，極易遺漏出錯。'
        },
        {
          label: '把所有工具全部停用讓 Agent 變回純聊天機器人',
          isBest: false,
          consequence: '所有自動化業務直接停擺。',
          explanation: '善用 Middleware 即可在不犧牲功能的前提下無痛加上合規防護。'
        }
      ]
    },
    codeLab: {
      title: '撰寫 MAF Middleware 攔截器與條件工作流（Lesson 14 精華）',
      notebookPath: '14-microsoft-agent-framework/code-samples/14-middleware.ipynb',
      lines: [
        { code: 'async def audit_middleware(context, next_handler):\n    print(f"[Audit] 準備呼叫：{context.function.name}")\n    start = time.perf_counter()', explain: '在真正執行工具（next_handler）之前，先攔截記錄工具名稱與起始時間，甚至可在此檢查參數合規性！' },
        { code: '    await next_handler(context)\n    elapsed = (time.perf_counter() - start) * 1000\n    print(f"[Audit] 完成！耗時 {elapsed:.1f}ms")', explain: '呼叫 await next_handler(context) 放行執行，結束後自動統計毫秒耗時或清洗輸出結果。' },
        { code: 'agent = provider.as_agent(\n    name="AuditedAgent",\n    instructions="協助查詢訂單狀態",\n    tools=[get_order],\n    middleware=[audit_middleware],\n)', explain: '只需傳入 middleware=[...]，所有工具呼叫瞬間擁有企業級審計與計時能力！' }
      ],
      simulatedOutput: '[Audit] 準備呼叫：get_order\n🔧 Executing get_order(order_id="TW-998")\n[Audit] 完成！耗時 42.6ms\n🤖 AuditedAgent: 您的訂單 TW-998 已出貨，預計明日送達！',
      puzzle: {
        instruction: '點選詞彙，補完能計算執行時間並放行下一步的 MAF Middleware 函式：',
        templateParts: [
          'async def audit_middleware(context, ',
          '):\n    print("Before call")\n    await ',
          '(context)\n    print("After call")'
        ],
        answers: ['next_handler', 'next_handler'],
        distractors: ['force_crash', 'infinite_wait'],
        successNote: '恭喜通關第三章（10–14）！你已經掌握了從生產觀測、三大協定、脈絡記憶到 MAF 進階編排的全套內功！'
      }
    },
    flashcards: [
      {
        id: '14-middleware',
        term: 'Agent / Function Middleware（中介軟體）',
        category: 'MAF 架構',
        definition: '包覆在模型推理或工具呼叫外層的攔截函式管線，可在執行前後統一處理日誌、權限檢查、PII 脫敏、重試與快取。',
        example: '透過 await next_handler(context) 控制是否放行或短路回傳。'
      },
      {
        id: '14-conditional-edge',
        term: 'Conditional Workflow（條件分支工作流）',
        category: 'MAF 架構',
        definition: '在 WorkflowBuilder 圖形中根據前一個節點的結構化輸出結果（如風險等級或評分高低），動態決定流向哪一條後續分支。',
        example: '金額 > 5 萬走「財務長簽核節點」，否則走「自動核銷節點」。'
      },
      {
        id: '14-hosted-langgraph',
        term: 'Foundry Hosted Agents（跨框架雲端託管）',
        category: '平台整合',
        definition: 'Microsoft Foundry 除了原生運行 MAF 代理，也支援將開發者寫好的 MAF Workflow 或 LangGraph 代理容器化託管為雲端服務端點。',
        example: '本地寫好複雜圖形工作流後，一鍵發佈成受 Entra ID 保護的企業 API。'
      }
    ],
    quiz: [
      {
        question: '在 Microsoft Agent Framework (MAF) 中，想為所有工具呼叫統一加上「執行耗時紀錄」與「敏感字詞攔截」，最推薦寫在哪裡？',
        options: [
          'Middleware（中介攔截層）',
          'CSS 樣式表裡',
          '每個使用者自己的記事本裡',
          'README 的免責聲明裡'
        ],
        answerIndex: 0,
        explanation: 'Middleware 讓橫切關注點（Logging、Security、Caching）與核心業務工具程式碼乾淨解耦。'
      },
      {
        question: '當工作流需要「依據禮賓審核分數 >= 8 分直接輸出，否則轉交備案專家重排」時，應該使用哪種模式？',
        options: [
          'Conditional Workflow（條件分支工作流）',
          '完全隨機亂跳',
          '把所有節點刪掉',
          '單純靜態 HTML'
        ],
        answerIndex: 0,
        explanation: '結合 Pydantic 結構化分數與條件邊（Conditional Edges），能做出既具 AI 彈性又百分之百受控的分支路由。'
      },
      {
        question: '如果在 Middleware 檢查發現使用者傳入的參數違反資安政策，Middleware 可以怎麼做？',
        options: [
          '不呼叫 next_handler(context)，直接攔截短路（Short-circuit）並回傳安全的拒絕訊息！',
          '只能眼睜睜看著它執行完再哭',
          '自動幫駭客升級權限',
          '把伺服器關機'
        ],
        answerIndex: 0,
        explanation: 'Middleware 握有是否呼叫 next_handler 的控制權，可在危險動作真正觸發前將其完美擋下。'
      }
    ],
    deepDive: [
      {
        heading: '六份黃金樣板一次收藏！',
        content: '第 14 課雖然沒有附影片，但它的 6 個 Notebook（Sequential、Concurrent、Conditional、Handoff、Human-loop、Middleware）堪稱整座 Repo 含金量最高的工程實戰寶庫，點下方連結就能直接檢視完整程式碼！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: 'Lesson 14 六大工作流範例總目錄（GitHub）',
        url: `${REPO_BASE_URL}/tree/main/14-microsoft-agent-framework/code-samples`,
        note: '一次瀏覽 Sequential / Concurrent / Conditional / Handoff / HITL / Middleware'
      },
      {
        type: '官方文件',
        title: 'Microsoft Learn：Microsoft Agent Framework 官方手冊',
        url: 'https://learn.microsoft.com/en-us/agent-framework/overview/?pivots=programming-language-python',
        note: '最新 Python API 與架構教學'
      },
      {
        type: '官方文件',
        title: '在 Foundry 託管跨框架 Hosted Agents 指南',
        url: 'https://learn.microsoft.com/azure/foundry/how-to/develop/langchain-hosted-agents',
        note: '了解如何將複雜工作流部署上雲'
      }
    ]
  }
];
