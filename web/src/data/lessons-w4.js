import { REPO_BASE_URL } from './curriculum-meta.js';

export const LESSONS_W4 = [
  {
    id: '15',
    slug: '15-browser-use',
    world: 4,
    title: '打造電腦與瀏覽器操作代理（Computer Use Agents, CUA）',
    subtitle: '遇到沒有開放 API 的老舊網頁系統？讓 Agent 像真人一樣看畫面、點按鈕、填表單！',
    estimatedMinutes: 8,
    xpReward: 140,
    tags: ['CUA', 'Browser-Use', 'Playwright'],
    videos: [],
    microCards: [
      {
        tag: '為什麼需要 CUA？',
        title: '不是所有系統都有漂亮的 REST API 或 MCP Server！',
        body: '在真實企業環境中，常遇到十年前寫的內部簽核網頁、外部公家機關查詢網或跨家比價頁面——它們完全沒有開放 API！Computer Use Agent (CUA，如微軟 Project Opal 與開源 Browser-Use + Playwright) 讓 Agent 直接操控無頭瀏覽器完成任務：',
        bullets: [
          '多模態視覺 ＋ DOM 雙重理解：同時看網頁截圖與無障礙 DOM 樹，精準定位按鈕與輸入框。',
          'Observe → Decide → Act → Verify 迴圈：每點一下按鈕就觀察畫面有沒有跳轉成功、有沒有彈出錯誤視窗！'
        ]
      },
      {
        tag: '安全紅線',
        title: '瀏覽器世界危機四伏！CUA 必設的三大安全護欄',
        body: '讓 AI 拿著你的瀏覽器到處點，風險比一般純文字聊天高出數倍！實作時務必遵守：',
        bullets: [
          '網域白名單（Domain Allowlist）：限制 Agent 只能在指定的安全網域內導覽，防止被惡意釣魚連結拐走。',
          '敏感操作強制停下等人按確認：凡涉及「輸入帳密、刷卡結帳、送出正式申請表、刪除資料」，必須暫停請使用者親自確認！',
          '隔離沙盒瀏覽器 Profile：絕不直接掛載存滿你私人網銀密碼的日常 Chrome Profile！'
        ]
      },
      {
        tag: '選型黃金法則',
        title: '有 API 用 API（MCP），沒 API 才出動 CUA！',
        body: '瀏覽器自動化需要載入網頁、渲染畫面與逐步點擊，延遲通常以「秒」計且網頁改版可能影響流程；因此凡是有 API 的地方優先走 Lesson 04/11 的 Tool / MCP，真正無 API 可接的最後一哩路再派 CUA 上場！'
      }
    ],
    flowSimulator: {
      title: 'Playwright CUA 瀏覽器自動查價與結帳前煞車模擬器',
      description: '點按步驟，觀察 CUA 如何操控瀏覽器幫你比價加進購物車，並在最後按下「確認付款」前安全交還控制權！',
      nodes: [
        { id: 'obs', icon: '👁️', label: '讀取 DOM 與截圖' },
        { id: 'act', icon: '🖱️', label: 'Playwright 填表點擊' },
        { id: 'guard', icon: '🛑', label: '敏感結帳攔截點' },
        { id: 'human', icon: '🙋', label: '人類接手確認' }
      ],
      scenarios: [
        {
          name: '自動搜尋加入購物車 + 結帳前安全暫停',
          steps: [
            {
              activeNode: 'obs',
              badge: 'Step 1 · 導覽白名單網站並解析元素',
              text: 'Playwright 開啟指定商務採購網，標記搜尋框 [elem #4] 與篩選按鈕 [elem #9]。',
              payload: 'url = "https://shop.internal.corp" (Allowlist PASS) · interactive_elements = 18'
            },
            {
              activeNode: 'act',
              badge: 'Step 2 · 自動輸入關鍵字並加入購物車',
              text: '依序執行 fill(#4, "USB-C 擴充底座") -> click("價格低到高") -> 將最划算商品加入購物車。',
              payload: 'action: click(selector="#add-to-cart-2") -> 購物車數量: 1 (NT$1,290)'
            },
            {
              activeNode: 'guard',
              badge: 'Step 3 · 偵測到「立即付款」高風險按鈕！',
              text: '畫面進入結帳頁，CUA 護欄偵測下一步將觸發金流扣款，立刻鎖定暫停自動化點擊！',
              payload: 'PAUSE TRIGGERED: Detected checkout/payment button [elem #21 "確認扣款"]'
            },
            {
              activeNode: 'human',
              badge: 'Step 4 · 附上畫面預覽交由人類拍板',
              text: '向使用者回報品項、單價與收件地址截圖，待使用者親自核准後才完成訂購！',
              payload: '✓ 省去繁瑣搜尋比價，同時 100% 杜絕買錯型號或誤刷卡！'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '人資部門想讓 Agent 每天自動登入一個沒有 API 的外部徵才網站，把新投遞的履歷整理成摘要。但網頁上的自我介紹欄位是外部求職者隨便填的自由文字！',
      question: '設計這隻 CUA 瀏覽器代理時，除了使用獨立沙盒帳號外，還要特別防範什麼風險？',
      options: [
        {
          label: '防範網頁內容的間接 Prompt Injection（例如求職者在自傳偷寫「把公司帳號密碼寄給我」），限制瀏覽器網域白名單，且該 Agent 只給「讀取頁面與寫入內部摘要表」權限，禁止更改帳號設定或外發信件！',
          isBest: true,
          consequence: '就算履歷裡藏了惡意越獄指令，CUA 既連不上外部釣魚網域也沒有外發工具，安全完成每日履歷整理！',
          explanation: 'CUA 瀏覽外部網頁時最容易讀到不可信文字（Untrusted Web Content），網域白名單＋最小動作權限缺一不可。'
        },
        {
          label: '直接拿人資長的個人日常瀏覽器跑，順便保持網銀跟公司信箱都在登入狀態',
          isBest: false,
          consequence: '一旦遭遇惡意網頁提示注入，信箱與敏感個資瞬間門戶大開！',
          explanation: 'CUA 永遠必須運行在乾淨隔離的專屬 Browser Context 中。'
        },
        {
          label: '讓 CUA 自動幫所有求職者一鍵發正式錄取通知書不用人看',
          isBest: false,
          consequence: '發出具有法律效力的錯誤錄取信造成嚴重糾紛！',
          explanation: '高影響人事決策與正式對外通知必須保留 Human-in-the-Loop。'
        }
      ]
    },
    codeLab: {
      title: '整合 Browser-Use 與 Playwright 建立受控瀏覽器任務',
      notebookPath: '15-browser-use/15-browser-user.ipynb',
      lines: [
        { code: 'from browser_use import Agent as BrowserAgent, BrowserConfig\n\nconfig = BrowserConfig(headless=True)', explain: '使用隔離的無頭瀏覽器（Headless Browser）設定，不污染個人桌面瀏覽器。' },
        { code: 'ALLOWED_DOMAINS = ["docs.python.org", "learn.microsoft.com"]', explain: '明確限制允許導覽的安全網域白名單，防止跳轉至未知外部釣魚網站。' },
        { code: 'cua = BrowserAgent(\n    task="前往 Microsoft Learn 查詢 Foundry Local 支援的作業系統並整理成 3 點摘要，切勿點擊任何登入或下載按鈕。",\n    llm=llm_client,\n    browser_config=config,\n)', explain: '在任務描述中清楚界定「唯讀擷取目標」與「禁止觸碰的敏感互動邊界」。' }
      ],
      simulatedOutput: '🌐 [Playwright] Navigating to https://learn.microsoft.com/azure/ai-foundry/foundry-local/ (Allowlist OK)\n👁️ [DOM Extract] Found OS requirements table\n🤖 整理完成：支援 Windows 11、macOS (Apple Silicon) 與 Linux！',
      puzzle: {
        instruction: '點選詞彙，補完安全 CUA 瀏覽器代理的兩大防護設定：',
        templateParts: [
          'config = BrowserConfig(',
          '=True)  # 隔離沙盒執行\n',
          ' = ["learn.microsoft.com"]  # 限制可造訪的安全網域白名單'
        ],
        answers: ['headless', 'ALLOWED_DOMAINS'],
        distractors: ['share_passwords', 'UNLIMITED_DARKWEB'],
        successNote: '答對了！隔離瀏覽器環境＋網域白名單＋結帳提交前人工確認，就是安全駕馭 CUA 的三把鑰匙！'
      }
    },
    flashcards: [
      {
        id: '15-cua',
        term: 'Computer Use Agent (CUA)',
        category: '代理類型',
        definition: '能透過視覺畫面理解或 DOM 解析，直接操作滑鼠點擊、鍵盤輸入與瀏覽器導覽來完成跨應用程式任務的 AI Agent。',
        example: '自動在沒有開放 API 的舊版報表網頁查詢並彙整數據。'
      },
      {
        id: '15-playwright',
        term: 'Playwright 瀏覽器自動化',
        category: '底層工具',
        definition: '微軟開源的跨瀏覽器自動化框架，支援無頭（Headless）隔離 Context、精準元素定位與網路請求攔截，是 CUA 最穩定的執行手腳。',
        example: 'Browser-Use 底層透過 Playwright 穩定控制 Chromium 分頁。'
      },
      {
        id: '15-domain-allowlist',
        term: 'Domain Allowlist（網域白名單）',
        category: '資安防護',
        definition: '在瀏覽器網路層硬性限制 CUA 僅能連線至預先核准的網域清單，阻斷惡意重導向或資料外傳管道。',
        example: '採購助理只准存取內部核准的 3 個供應商網域。'
      }
    ],
    quiz: [
      {
        question: '如果某個外部服務同時提供「官方穩定 REST API / MCP Server」與「複雜前端網頁」，你應該優先讓 Agent 用哪種方式串接？',
        options: [
          '優先走官方 API / MCP Tool（速度快、成本低、結構精準且不受網頁改版影響）；沒有 API 的系統才出動 CUA！',
          '故意放棄 API 不用，硬開瀏覽器慢慢截圖點按鈕',
          '叫使用者自己抄在紙上寄平信',
          '兩個都不用'
        ],
        answerIndex: 0,
        explanation: 'API / MCP 在速度、Token 消耗與穩定度上遠勝 UI 操作；CUA 則是補齊「無 API 系統最後一哩路」的強大武器。'
      },
      {
        question: '當購物或行政 CUA 幫使用者填好資料、走到最後一步「確認刷卡／正式送出申請」按鈕前，標準安全做法是什麼？',
        options: [
          '靜默直接刷下去給使用者一個驚喜',
          '強制暫停並顯示摘要／截圖，交由人類最終確認核准（Human-in-the-Loop）',
          '連續狂點十下測試會不會重複扣款',
          '自動關閉視窗清除紀錄'
        ],
        answerIndex: 1,
        explanation: '金流扣款與具法律／業務拘束力的表單送出屬於不可逆高風險行為，務必由人類拍板確認。'
      },
      {
        question: '為什麼 CUA 在閱讀公開網路頁面時，特別容易遭遇「間接提示注入（Indirect Prompt Injection）」？',
        options: [
          '因為外部網頁上的留言、隱藏文字或商品描述任何人都能編輯，可能偷藏企圖劫持 Agent 行動的惡意指令！',
          '因為螢幕解析度太高',
          '因為 HTML 標籤都是大寫',
          '完全不會有風險'
        ],
        answerIndex: 0,
        explanation: '網頁屬於典型的不可信外部輸入（Untrusted Input），必須搭配網域白名單與最小權限沙盒嚴密防護。'
      }
    ],
    deepDive: [
      {
        heading: '延伸探索：Microsoft Project Opal 與 Playwright 整合',
        content: '想看企業級 CUA 實際長什麼樣？下方資源連結收錄了微軟 Project Opal 介紹與 Browser-Use 官方 Playwright 整合範本，回電腦實作記得在虛擬環境執行 playwright install 安裝瀏覽器核心！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '15-browser-user.ipynb（瀏覽器自動化 Agent 實戰）',
        url: `${REPO_BASE_URL}/blob/main/15-browser-use/15-browser-user.ipynb`,
        note: 'Python Browser-Use + Playwright 實作範例'
      },
      {
        type: '官方文件',
        title: 'Browser-Use Playwright 整合官方文件',
        url: 'https://docs.browser-use.com/examples/templates/playwright-integration',
        note: '自訂瀏覽器參數與內容擷取教學'
      },
      {
        type: '官方文件',
        title: '認識 Microsoft Project Opal (Frontier)',
        url: 'https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-with-project-opal-frontier',
        note: '微軟電腦使用代理實務應用案例'
      }
    ]
  },

  {
    id: '16',
    slug: '16-deploying-scalable-agents',
    world: 4,
    title: '部署可擴展的生產級 Agent（Deploying Scalable Agents）',
    subtitle: '省下 60% 推理帳單又能抗高併發：精通 Hosted Agents、Model Routing、快取與 AI Smoke Test！',
    estimatedMinutes: 10,
    xpReward: 150,
    tags: ['Model Routing', 'Caching', 'Smoke Test'],
    videos: [],
    microCards: [
      {
        tag: '部署架構',
        title: '三種生產部署模式怎麼選？Client-Hosted vs. Foundry Hosted Agents',
        body: '把原型搬上雲端服務幾萬名客戶時，Microsoft Foundry 提供清晰的演進階梯：',
        bullets: [
          'Client-Hosted（自管容器如 Azure Container Apps）：你的後端自己跑 MAF 迴圈，適合高度客製既有微服務。',
          'Foundry Hosted Agents（全託管代理服務）：把程式碼打包交給 Foundry 自動伸縮擴展、統一管理身份權限（Managed Identity）與內建 OpenTelemetry 追蹤！',
          'Agent Workflows：多步驟長時間執行的非同步工作流，支援斷點續跑與人工簽核等待。'
        ],
        image: {
          src: './course-images/lesson-16-thumbnail.png',
          caption: '從單機原型升級為高可用、可自動擴展且成本可控的雲端生產系統'
        }
      },
      {
        tag: '省錢加速雙寶',
        title: 'Model Routing（大小模型智慧分流）＋ Response Caching（回應快取）',
        body: '真實客服流量裡，有 70% 都是簡單的「查訂單進度、問退貨期限」！如果每一題都出動最貴的旗艦推理大模型，帳單跟延遲都會爆表：',
        bullets: [
          'Model Routing（模型路由）：前置輕量分類路由將簡單查詢派給超快超便宜的 mini / SLM 模型；遇到複雜多步爭議客訴才升級派給旗艦推理模型！',
          'Response Caching（快取）：對高頻重複的靜態政策問答（注意：絕不快取含個資的私人訂單結果！）直接命中快取毫秒回傳！'
        ]
      },
      {
        tag: '上線守門員',
        title: '雙道發布防線：Release Eval Gate ＋ 部署後 AI Smoke Test！',
        body: '本 Repo 的 .github/workflows/smoke-test.yml 與 tests/ 目錄展示了真實 CI/CD 守門機制：',
        bullets: [
          '部署前（Evaluation Gate）：離線黃金測試集分數低於門檻（如 < 95%）直接擋下不准發版。',
          '部署後（AI Smoke Test）：剛發佈完立刻自動送出幾題健康檢查對話（測試端點活著嗎？權限通嗎？有乖乖拒絕高風險無授權退款嗎？），確保線上環境真的健康可用！'
        ]
      }
    ],
    flowSimulator: {
      title: '生產級客服 Agent：快取 → 大小模型路由 → 退款門檻與發佈煙霧測試',
      description: '點按步驟，觀察一筆請求進入高流量生產架構時，如何層層過篩實現極速低成本與高安全性！',
      nodes: [
        { id: 'cache', icon: '⚡', label: '公開政策快取層' },
        { id: 'router', icon: '🧭', label: 'Model Router 分流' },
        { id: 'agent', icon: '🤖', label: 'Foundry 託管代理' },
        { id: 'smoke', icon: '🧪', label: 'CI/CD Smoke Test' }
      ],
      scenarios: [
        {
          name: '智慧分流省錢 + 大額退款門檻管控',
          steps: [
            {
              activeNode: 'cache',
              badge: 'Step 1 · 檢查語意快取（無個資問題才快取）',
              text: '客戶問：「訂單 A1002 怎麼還沒到？太久的話我要退費！」因含個人單號 A1002，安全跳過公開快取進入路由。',
              payload: 'contains_order_id = True -> Bypass shared cache (保護隱私！)'
            },
            {
              activeNode: 'router',
              badge: 'Step 2 · Model Router 判定複雜度',
              text: '偵測到同時涉及「物流查詢 ＋ 爭議退費訴求」，路由器自動升級指派高推理能力模型處理！',
              payload: 'complexity = "multi_step_dispute" -> route to flagship model'
            },
            {
              activeNode: 'agent',
              badge: 'Step 3 · 查單並套用 $50 退款審批門檻',
              text: '呼叫 get_order_status("A1002") 發現總額 $128.50 超過自動退款上限 $50，自動建立人工審核工單！',
              payload: 'amount ($128.50) > REFUND_THRESHOLD ($50.0) -> Escalate ticket #T-501'
            },
            {
              activeNode: 'smoke',
              badge: 'Step 4 · 每次 GitHub Actions 部署後自動冒煙驗證',
              text: '發版後自動執行 tests/lesson-16-smoke-tests.json 驗證端點連線與護欄行為正常！',
              payload: 'AI Smoke Test: 4/4 assertions PASSED · Endpoint Healthy ✓'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '為了加速回應並省 API 費，一位工程師把客服 Agent 的「所有對話輸入與回答」無差別放進同一個全域共用快取（Global Cache）。結果王小姐問完「查我的最後一筆訂單地址」，五分鐘後李先生問一模一樣的字「查我的最後一筆訂單地址」，竟然直接從快取吐出王小姐家的地址！',
      question: '設計 Agent 回應快取（Response Caching）時，什麼原則絕對不能破？',
      options: [
        {
          label: '嚴格區分「公開靜態知識（如退換貨政策、營業時間，可安全共用快取）」與「個人化／具狀態工具呼叫（必須跳過共用快取或以驗證過的 user_id 隔離快取鍵）」！',
          isBest: true,
          consequence: '常見 FAQ 命中快取 30ms 秒回省下大筆預算，而涉及個人訂單或帳戶的請求 100% 獨立查詢零洩漏！',
          explanation: '快取污染與跨用戶個資外洩是生產環境快取設計的第一大陷阱，凡依賴用戶身份或即時變動狀態的回應絕不可放入無隔離的全域快取。'
        },
        {
          label: '把快取時間設成 10 年，所有人都看同一個人的訂單',
          isBest: false,
          consequence: '嚴重違反個資法並引發大規模客訴下架。',
          explanation: '快取鍵（Cache Key）若未排除或隔離個人上下文，必然造成資料串流。'
        },
        {
          label: '連首頁 Logo 圖片都禁止瀏覽器快取',
          isBest: false,
          consequence: '白白浪費頻寬，沒抓到真正的問題核心。',
          explanation: '靜態公開資源與通用政策問答非常適合快取，關鍵在於精準界定哪些內容可共用。'
        }
      ]
    },
    codeLab: {
      title: '具備金額門檻護欄的生產級客服工具（Lesson 16 實戰程式碼）',
      notebookPath: '16-deploying-scalable-agents/code_samples/16-python-agent-framework.ipynb',
      lines: [
        { code: 'REFUND_APPROVAL_THRESHOLD = 50.0\n\n@tool(approval_mode="never_require")\ndef request_refund(order_id: str, reason: str) -> str:', explain: '在後端工具內部直接寫死業務金額上限常數（$50.0），不讓模型自己猜門檻！' },
        { code: '    order = ORDERS.get(order_id.upper())\n    if order["total"] > REFUND_APPROVAL_THRESHOLD:\n        ticket_id = create_escalation_ticket(order_id, reason)\n        return f"金額 ${order[\'total\']} 超過自動核准上限，已轉人工審核單 {ticket_id}"', explain: '超過 $50 自動轉人工簽核工單；小額無爭議單則快速自動完成，兼顧效率與風控！' },
        { code: '    return f"已成功為訂單 {order_id} 辦理自動退款 ${order[\'total\']}"', explain: '確定性業務邏輯寫在 Python 工具內，搭配 tests/lesson-16-smoke-tests.json 部署後自動驗證！' }
      ],
      simulatedOutput: '🔧 request_refund("A1003", "包裝破損") -> $19.99 <= $50 -> 自動退款完成！\n🔧 request_refund("A1002", "延遲到貨") -> $128.50 > $50 -> 已建立人工審核工單 #ESC-01！',
      puzzle: {
        instruction: '點選詞彙，完成生產環境省錢分流與發佈後健康檢查的黃金組合：',
        templateParts: [
          '1. 簡單問題派給輕量模型、複雜推理才派旗艦模型：',
          '\n2. 部署上線後自動測試雲端 Agent 端點是否存活與合規：',
          ''
        ],
        answers: ['Model Routing', 'Smoke Test'],
        distractors: ['Hardcode Key', 'Global Leak'],
        successNote: '太讚了！Model Routing 幫老闆省荷包，Smoke Test 幫工程師半夜安心睡好覺！'
      }
    },
    flashcards: [
      {
        id: '16-model-routing',
        term: 'Model Routing（模型智慧路由）',
        category: '成本與效能',
        definition: '根據請求的意圖複雜度或風險等級，動態將流量分發給不同尺寸與單價的模型（如輕量 SLM/mini 處理常規問題，旗艦模型處理深層推理）。',
        example: '省下 50%–70% Token 成本並大幅降低簡單問答的首字延遲。'
      },
      {
        id: '16-smoke-test',
        term: 'AI Smoke Test（部署後冒煙測試）',
        category: 'CI/CD 品質',
        definition: '在 Agent 部署至雲端環境後立即執行的輕量自動化端到端健康檢查，確認網路端點可連通、憑證有效且基本行為符合預期。',
        example: '本專案透過 .github/workflows/smoke-test.yml 對 01、04、05、16 課代理進行驗證。'
      },
      {
        id: '16-eval-gate',
        term: 'Release Evaluation Gate（發版評估門檻）',
        category: 'CI/CD 品質',
        definition: '在正式發佈前自動執行完整評估題庫，若準確率、Grounding 或安全指標低於設定閾值則自動阻擋部署。',
        example: '確保新版 Prompt 不會在修復舊問題時意外引發新幻覺。'
      }
    ],
    quiz: [
      {
        question: '在生產環境導入「Model Routing（模型路由）」最主要能帶來什麼效益？',
        options: [
          '在維持高難度任務推理品質的同時，讓佔大宗的簡單常規請求由輕快低價的模型秒回，大幅優化延遲與總成本！',
          '讓每一筆簡單問候語都花十倍的錢',
          '把網路線拔掉',
          '取消所有錯誤處理'
        ],
        answerIndex: 0,
        explanation: '依任務難度分配合適算力（Right-sizing compute per query）是規模化 AI 應用的核心經濟學。'
      },
      {
        question: '本課程專案根目錄下的 tests/ 資料夾與 smoke-test.yml 工作流主要扮演什麼角色？',
        options: [
          '測試電腦會不會真的冒煙起火',
          '對已部署的 Foundry Hosted Agents 進行輕量發佈後健康檢查（確認端點連線正常且遵守基本提示規範），與第 10 課的深度評估互補！',
          '用來翻譯 50 國語言',
          '刪除所有 Jupyter Notebooks'
        ],
        answerIndex: 1,
        explanation: 'Smoke Test 是快速驗證「部署有沒有活著且能正常回應」的第一道發佈後守門員。'
      },
      {
        question: '對於「查詢客戶王大明自己的信用卡帳單明細」這類請求，應該放入無隔離的全域共用回應快取嗎？',
        options: [
          '絕對不行！含個人身份或即時私有狀態的查詢若放入全域共用快取，會導致嚴重的跨用戶個資外洩！',
          '可以，讓全台灣的人一起幫他對帳',
          '不僅要快取還要貼到首頁跑馬燈',
          '只要字數少於 100 字就可以共用'
        ],
        answerIndex: 0,
        explanation: '共用快取僅適用於與個人身份無關的公開靜態知識問答。'
      }
    ],
    deepDive: [
      {
        heading: '查看本 Repo 內建的真實 Smoke Test 測試目錄！',
        content: '想看看真實專案怎麼寫 Agent 冒煙測試案例嗎？點下方資源連結即可直接查看本專案 tests/lesson-16-smoke-tests.json 的 JSON 斷言結構！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '16-python-agent-framework.ipynb（生產級客服 Agent 完整實作）',
        url: `${REPO_BASE_URL}/blob/main/16-deploying-scalable-agents/code_samples/16-python-agent-framework.ipynb`,
        note: '含訂單查詢、退款門檻、快取與路由示範'
      },
      {
        type: '官方文件',
        title: 'tests/README.md 與 Smoke Test 測試案例集',
        url: `${REPO_BASE_URL}/blob/main/tests/README.md`,
        note: '本專案內建的部署後冒煙測試說明'
      },
      {
        type: '官方文件',
        title: 'Microsoft Foundry Agents 官方總覽文件',
        url: 'https://learn.microsoft.com/azure/ai-foundry/agents/overview',
        note: 'Hosted Agents 與企業級部署指南'
      }
    ]
  },

  {
    id: '17',
    slug: '17-creating-local-ai-agents',
    world: 4,
    title: '打造本地端離線 AI Agent（Foundry Local & Qwen）',
    subtitle: '零雲端費用、拔掉網路線照樣跑、機密資料 100% 不出本機：SLM 小型語言模型實戰！',
    estimatedMinutes: 9,
    xpReward: 140,
    tags: ['Foundry Local', 'Qwen SLM', 'ChromaDB 本地 RAG'],
    videos: [],
    microCards: [
      {
        tag: '本地優先革命',
        title: '為什麼越來越多人需要 Local-First（本地端優先）AI Agent？',
        body: '雲端大模型雖然強大，但有三個場景非靠本地端 Agent 不可：',
        bullets: [
          '極致隱私與合規（Privacy）：醫療病歷、未公開原始碼、法務機密文件連一個 Byte 都不能離開你的筆電或內網！',
          '離線可用（Offline）：在飛機上、無網路廠區或災難現場依然能穩定推理與查文件。',
          '零邊際 Token 帳單（Zero Cloud Cost）：用自己的 GPU / NPU / CPU 無限次開發測試與跑自動化腳本，帳單永遠 $0！'
        ],
        image: {
          src: './course-images/lesson-17-thumbnail.png',
          caption: '結合 Microsoft Foundry Local 與 Qwen SLM，在個人電腦打造全離線 AI 工程助手'
        }
      },
      {
        tag: '關鍵引擎',
        title: 'Foundry Local ＋ Qwen 2.5 工具呼叫模型 ＋ 本地 ChromaDB',
        body: '現代 7B 等級的小型語言模型（SLM，如 qwen2.5-7b）在結構化輸出與 Function Calling 上已經非常強悍！本課技術棧全數在你的機器內閉環執行：',
        bullets: [
          'Foundry Local：自動偵測你的硬體（NVIDIA CUDA、Apple Silicon Metal 或純 CPU）下載最佳量化模型，並在 localhost 開出 OpenAI 相容端點！',
          '沙盒化本地工具 ＋ ChromaDB 本地向量庫 ＋ 本地 stdio MCP Server：完全不連外網也能做 Agentic RAG 與檔案查詢！'
        ]
      },
      {
        tag: '混合雲地架構',
        title: '終極形態：Hybrid Routing（敏感與日常任務跑本機，公開難題才上雲）',
        body: '你甚至不必二選一！實務上最聰明的混合路由：含機密標籤或簡單的任務 100% 留在本機 Foundry Local 處理；不含機密且需超廣博世界知識的公開難題，脫敏後再交給雲端 Microsoft Foundry 支援！'
      }
    ],
    flowSimulator: {
      title: '100% 本機閉環運作：Foundry Local + Qwen + 本地 ChromaDB 模擬器',
      description: '點按步驟，觀察即使在「飛航模式斷網狀態」下，本地工程助手如何安全檢索機密架構文件並呼叫本地工具！',
      nodes: [
        { id: 'hw', icon: '💻', label: 'FoundryLocalManager' },
        { id: 'qwen', icon: '🧠', label: '本地 Qwen-2.5 SLM' },
        { id: 'chroma', icon: '📚', label: '本地 ChromaDB 向量庫' },
        { id: 'sandbox', icon: '🔒', label: '路徑沙盒本地工具' }
      ],
      scenarios: [
        {
          name: '飛航模式離線查詢機密專案文件',
          steps: [
            {
              activeNode: 'hw',
              badge: 'Step 1 · 啟動本機硬體加速服務',
              text: 'FoundryLocalManager 偵測本機 GPU / NPU，載入量化版 qwen2.5-7b 並啟動 http://127.0.0.1 本地端點。',
              payload: 'FoundryLocal ready · Endpoint: http://127.0.0.1:5273/v1 · Network: OFFLINE OK'
            },
            {
              activeNode: 'qwen',
              badge: 'Step 2 · 本地模型解析 Function Call',
              text: '工程師問：「幫我查內部 runbook 裡資料庫連線池爆滿的排障步驟，並檢查專案設定檔。」',
              payload: 'qwen2.5 tool_calls -> [query_local_chroma("DB pool exhausted"), read_workspace_config()]'
            },
            {
              activeNode: 'chroma',
              badge: 'Step 3 · 本地 ChromaDB 檢索機密筆記',
              text: '完全不經網際網路，毫秒級從本機硬碟向量庫撈出內部維運手冊段落。',
              payload: 'Chroma hit: internal_runbook.md §3.2 (max_connections 調校指南)'
            },
            {
              activeNode: 'sandbox',
              badge: 'Step 4 · 受路徑沙盒保護讀取設定檔並回覆',
              text: '工具確認檔案路徑位於專案目錄內（阻擋 ../ 越界讀取系統密碼檔），給出完整修復步驟，全程零資料外傳！',
              payload: '✓ Cloud Traffic: 0 Bytes · Cost: $0.00 · Privacy: 100% On-Device'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '你在自己筆電上跑了一隻 Foundry Local 本地 Agent，並寫了一個 read_local_file(path: str) 工具讓它幫你讀專案裡的 Markdown 筆記。結果你不小心讓它讀了一份從網路下載的陌生 README，裡面藏了一句惡意指令試圖呼叫 read_local_file("../../../../etc/passwd") 或讀取你的 ~/.ssh/id_rsa 私鑰！',
      question: '就算模型跑在本地端不上雲，本地檔案工具仍然必須加什麼安全鎖？',
      options: [
        {
          label: '實作嚴格的路徑沙盒檢查（Path Sandboxing）：將路徑 resolve() 正規化後，強制驗證必須位於指定的安全工作目錄（ALLOWED_ROOT）底下，並禁止存取 .env、.ssh 等敏感隱藏檔！',
          isBest: true,
          consequence: '任何企圖透過 ../ 路徑穿越（Path Traversal）偷讀系統私鑰的操作都會被 Python 工具層直接拋出 PermissionError 攔下！',
          explanation: '本地 Agent 直接接觸你的真實作業系統檔案，因此沙盒限制工作目錄範圍（Workspace Jail / Sandbox）格外關鍵（這也是第 17 課 Notebook 特別實作的重點！）。'
        },
        {
          label: '既然沒連雲端就代表絕對安全，直接用 root 最高權限開放整顆硬碟讀寫刪除',
          isBest: false,
          consequence: '一旦模型誤判指令或遭遇本地檔案提示注入，可能直接誤刪重要系統檔或暴露私鑰！',
          explanation: '離線保護了「網路傳輸隱私」，但「本地工具執行安全」仍須遵守最小權限與路徑沙盒原則。'
        },
        {
          label: '把整台筆電硬碟拔掉不用檔案系統',
          isBest: false,
          consequence: '電腦都開不了機啦！',
          explanation: '只要用 Path.resolve().is_relative_to(WORKSPACE_DIR) 幾行程式碼就能安全限制存取範圍。'
        }
      ]
    },
    codeLab: {
      title: '啟動 Foundry Local 並透過相容 OpenAI SDK 呼叫本地 Qwen 模型',
      notebookPath: '17-creating-local-ai-agents/code_samples/17-local-agent-foundry-local.ipynb',
      lines: [
        { code: 'from foundry_local_sdk import Configuration, FoundryLocalManager\nfrom openai import OpenAI', explain: 'Foundry Local 最棒的設計就是直接相容標準 OpenAI Python SDK，既有程式碼幾乎免改！' },
        { code: 'FoundryLocalManager.initialize(Configuration(app_name="local_agent"))\nmanager = FoundryLocalManager.instance', explain: '初始化單例管理員，自動挑選本機支援的最佳硬體加速執行提供者（CUDA / Metal / CPU）。' },
        { code: 'client = OpenAI(\n    base_url=manager.endpoint,\n    api_key="local-no-key-needed",\n)\nresp = client.chat.completions.create(model="qwen2.5-7b", messages=[...])', explain: '將 base_url 指向本機 manager.endpoint，不需任何雲端金鑰即可離線跑對話與 Function Calling！' }
      ],
      simulatedOutput: '💻 [FoundryLocal] Hardware acceleration active · Serving qwen2.5-7b at http://127.0.0.1:5273/v1\n🤖 [Local Qwen] 小型語言模型（SLM）是參數精簡、能在個人裝置本地高效推理並保護資料隱私的語言模型！',
      puzzle: {
        instruction: '點選詞彙，將標準 OpenAI Client 指向本機 Foundry Local 端點並限制檔案沙盒路徑：',
        templateParts: [
          'client = OpenAI(\n    base_url=manager.',
          ',\n    api_key="local",\n)\n# 檢查檔案路徑不可跳出允許的工作目錄：\nif not target_path.resolve().',
          '(WORKSPACE_ROOT):\n    raise PermissionError("禁止越界存取！")'
        ],
        answers: ['endpoint', 'is_relative_to'],
        distractors: ['upload_all_ssh_keys', 'bypass_check'],
        successNote: '滿分！本機端點連線 ＋ is_relative_to 路徑沙盒檢查，打造真正安心的私密本地 AI 助手！'
      }
    },
    flashcards: [
      {
        id: '17-slm',
        term: 'SLM (Small Language Model，小型語言模型)',
        category: '模型架構',
        definition: '參數量通常在 1B–14B 之間、經過量化最佳化後可在消費級筆電（GPU / NPU / CPU）本地流暢執行並支援 Tool Calling 的精悍模型。',
        example: 'Qwen 2.5 (3B / 7B)、Phi-4-mini 等都是本地 Agent 的熱門選擇。'
      },
      {
        id: '17-path-sandboxing',
        term: 'Path Sandboxing（檔案路徑沙盒）',
        category: '本地資安',
        definition: '在本地檔案讀寫工具中強制解析真實絕對路徑（resolve），確保目標位於授權資料夾內，防範 ../ 目錄穿越攻擊。',
        example: '使用 Path.resolve().is_relative_to(allowed_dir) 嚴格把關。'
      },
      {
        id: '17-hybrid-routing',
        term: 'Hybrid Cloud-Local Agent（混合雲地代理）',
        category: '系統架構',
        definition: '將含機密資料或低延遲日常任務留在本地 Foundry Local 執行，僅將公開且需超大型推理算力的複雜任務路由至雲端 Foundry。',
        example: '兼顧機密程式碼零外洩與雲端旗艦模型的深度跨領域知識。'
      }
    ],
    quiz: [
      {
        question: '下列哪一個是採用 Microsoft Foundry Local 在本機運行 AI Agent 的核心優勢？',
        options: [
          '機密資料 100% 留在自己機器內不外傳、無雲端 Token 費用，且在無網路離線環境依然能正常運作！',
          '必須全程連上高速 5G 才能打字',
          '每問一句話要付 10 美金手續費',
          '只能跑在超級電腦機房裡'
        ],
        answerIndex: 0,
        explanation: '隱私保護（Privacy）、離線可用（Offline）與零雲端推理帳單是 Local AI Agent 的三大王牌價值。'
      },
      {
        question: '為什麼 Foundry Local 提供「OpenAI 相容（OpenAI-compatible）本地端點」對開發者非常方便？',
        options: [
          '因為開發者可以直接沿用熟悉的 OpenAI SDK / MAF 工具呼叫程式碼，只需切換 base_url 與模型名稱即可在本地與雲端間無縫切換！',
          '因為這樣就不用寫 Python 改寫組合語言',
          '因為會自動幫螢幕換桌布',
          '沒有任何好處'
        ],
        answerIndex: 0,
        explanation: '統一的 API 介面讓「本地原型開發 → 混合雲地路由」幾乎零重構成本。'
      },
      {
        question: '既然模型已經完全離線跑在自己筆電上，給本地 Agent 掛載讀寫硬碟檔案工具時還需要做目錄權限限制嗎？',
        options: [
          '非常需要！仍須實作路徑沙盒（Path Sandboxing）防止模型誤刪重要檔案或被本地外部文件內的間接 Prompt Injection 誘導讀取私鑰！',
          '完全不用，離線就等於電腦百毒不侵不會犯錯',
          '只要把螢幕亮度調暗就安全了',
          '把檔案全部改名成亂碼就好'
        ],
        answerIndex: 0,
        explanation: '不論雲端或本地，賦予 Agent 檔案與系統操作手腳時都必須嚴守沙盒隔離與最小權限原則。'
      }
    ],
    deepDive: [
      {
        heading: '想在自己電腦試跑第 17 課？超低門檻提醒！',
        content: 'Foundry Local 支援自動退回 CPU 模式執行（有獨顯 CUDA 或 Apple Silicon 更快），搭配輕量級 ChromaDB 向量庫，完全不需申請任何雲端帳號就能在自己電腦體驗完整 Agentic RAG + MCP 本地工程師助手！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '17-local-agent-foundry-local.ipynb（Foundry Local + Qwen 完整實戰）',
        url: `${REPO_BASE_URL}/blob/main/17-creating-local-ai-agents/code_samples/17-local-agent-foundry-local.ipynb`,
        note: '涵蓋本地模型啟動、沙盒工具與 ChromaDB 本地 RAG'
      },
      {
        type: '官方文件',
        title: 'Microsoft Foundry Local 官方安裝與開發文件',
        url: 'https://learn.microsoft.com/azure/ai-foundry/foundry-local/',
        note: '支援硬體規格與模型清單查詢'
      }
    ]
  },

  {
    id: '18',
    slug: '18-securing-ai-agents',
    world: 4,
    title: 'AI Agent 資安與密碼學收據（Cryptographic Receipts）',
    subtitle: '最終章壓軸！當純文字 Log 可能被竄改時，用 Ed25519 數位簽章與雜湊鏈打造不可抵賴的行動收據！',
    estimatedMinutes: 10,
    xpReward: 160,
    tags: ['Ed25519 簽章', 'JCS 正規化', '防竄改稽核'],
    videos: [],
    microCards: [
      {
        tag: '終極資安拷問',
        title: '事後出包時，你怎麼「數學級證明」Agent 當時真的有拿到人類授權、且紀錄沒被偷改過？',
        body: '前面第 06 課我們把審核結果寫進一般文字檔 gate_log.jsonl。但在高規金融、醫療或跨公司 A2A 交易中，純文字 Log 有個致命傷：**擁有伺服器權限的人或遭入侵的程式可以事後偷偷改掉一行數字而不留痕跡！**',
        bullets: [
          '第 18 課引入密碼學簽章收據（Cryptographic Signed Receipts，對齊 IETF ACTA 草案）：讓每一次授權與工具執行都附帶不可偽造的數學鐵證！',
          '註：本課原文 README 中的影片連結尚為官方預留佔位符，我們已貼心為你過濾失效連結並整理完整雙 Notebook 與官方規格資源！'
        ]
      },
      {
        tag: '密碼學三劍客',
        title: 'JCS 正規化（RFC 8785）＋ Ed25519 數位簽章 ＋ Hash Chain 雜湊鏈',
        body: '要對 JSON 格式的收據做數位簽章，必須先解決「鍵值順序或空白不同導致雜湊值不同」的問題：',
        bullets: [
          '1. JCS (JSON Canonicalization Scheme)：把 JSON 欄位順序與格式轉成全球唯一確定的標準位元組序列。',
          '2. Ed25519 非對稱簽章（PyNaCl）：用私鑰對正規化後的收據簽名；任何人拿公鑰一驗，哪怕被偷改一個小數點都會立刻驗章失敗！',
          '3. Hash Chaining（雜湊鏈）：每張收據都寫入上一張收據的 SHA-256 雜湊值（prev_hash），誰敢偷抽掉中間第 3 張收據，整條鏈立刻斷裂抓包！'
        ]
      },
      {
        tag: '人類授權憑證',
        title: 'Human Authorization Receipts：把「誰核准了什麼範圍」鎖死在簽章裡！',
        body: '當主管按下「核准退款訂單 #A102 上限 NT$3,000」時，人類端金鑰簽發一張包含精確動作參數雜湊與有效期限的授權憑證（Authorization Receipt）。執行閘門驗證人類簽章與參數完全吻合才放行——就算 Agent 中途被越獄想偷改成退 NT$30,000，也會因為參數雜湊對不上人類簽章而被密碼學鐵壁直接擋死！'
      }
    ],
    flowSimulator: {
      title: '密碼學簽章收據與竄改偵測（Tamper Detection）模擬器',
      description: '切換情境並點按步驟，親眼見證 Ed25519 + JCS + 雜湊鏈如何簽發不可抵賴收據，以及有人偷改 Log 時如何一秒抓包！',
      nodes: [
        { id: 'auth', icon: '🔑', label: '人類簽發授權憑證' },
        { id: 'jcs', icon: '📐', label: 'JCS 正規化 + 雜湊鏈' },
        { id: 'sign', icon: '✍️', label: 'Ed25519 私鑰簽章' },
        { id: 'verify', icon: '🔍', label: '公鑰稽核驗章' }
      ],
      scenarios: [
        {
          name: '正常流程：雙重簽章與雜湊鏈驗證通過',
          steps: [
            {
              activeNode: 'auth',
              badge: 'Step 1 · 人類私鑰簽發精確授權範圍',
              text: '財務主管核准「轉帳 $500 給供應商 V-09」，簽發含參數 SHA-256 的授權收據。',
              payload: 'human_auth = { action: "pay", vendor: "V-09", max_amount: 500, sig: "ed25519:9f8a..." }'
            },
            {
              activeNode: 'jcs',
              badge: 'Step 2 · 執行收據綁定 prev_hash 並經 JCS 正規化',
              text: '閘門驗過人類簽章無誤後執行動作，將結果連同上一筆收據雜湊透過 RFC 8785 轉為唯一標準字串。',
              payload: 'canonicalize({"amount":500,"prev_hash":"sha256:41c0...","vendor":"V-09"})'
            },
            {
              activeNode: 'sign',
              badge: 'Step 3 · 閘門執行器私鑰蓋上 Ed25519 簽章',
              text: '用 PyNaCl SigningKey 產生 64-byte 高強度數位簽章並以嚴格無填充 Base64url 編碼保存。',
              payload: 'receipt.signature = "b64url_nopad(signing_key.sign(canonical_bytes))"'
            },
            {
              activeNode: 'verify',
              badge: 'Step 4 · 外部稽核員持公鑰驗證 100% 通過！',
              text: '獨立稽核程式同時驗證「人類授權簽章」、「執行收據簽章」與「前後雜湊鏈連續性」全數吻合！',
              payload: '✓ Signature VALID · ✓ Human Scope MATCHED · ✓ Hash Chain INTACT'
            }
          ]
        },
        {
          name: '攻擊測試：事後偷把 Log 金額從 500 改成 50',
          steps: [
            {
              activeNode: 'jcs',
              badge: 'Step 1 · 內鬼偷偷修改 JSONL 紀錄檔',
              text: '攻擊者打開收據檔，把紀錄裡的 "amount": 500 偷改成 "amount": 50 想掩蓋超額支出。',
              payload: 'Tampered JSON: {"amount": 50, ...} (但攻擊者沒有 Ed25519 私鑰無法重簽！)'
            },
            {
              activeNode: 'verify',
              badge: 'Step 2 · 公鑰驗章瞬間拋出 CryptoError 警報！',
              text: 'VerifyKey 對修改後的正規化位元組驗章失敗，且下一筆收據的 prev_hash 也對不上，竄改行為當場現形！',
              payload: '🚨 nacl.exceptions.BadSignatureError: TAMPERING DETECTED at Receipt #42!'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '在跨企業採購 Agent 系統中，員工雖然在對話框按了「同意購買 NT$1,000 文具」，但若 Agent 在送出 API 前被惡意 MCP 外掛動手腳把參數改成「購買 NT$900,000 禮品卡」，一般只檢查 boolean (approved=True) 的系統就會傻傻放行！',
      question: '如何運用第 18 課的「人類授權收據（Human Authorization Receipts）」徹底防堵這種「偷天換日（Confused Deputy / Parameter Tampering）」攻擊？',
      options: [
        {
          label: '讓授權收據不只簽一個 True，而是將「具體工具名稱＋完整參數（金額、收款方）的 JCS 雜湊值＋到期時間＋唯一 Nonce」一起簽入人類數位簽章；執行器在呼叫 API 前必須重新計算當下參數雜湊並核對簽章完全一致才准放行！',
          isBest: true,
          consequence: '只要參數裡任何一個數字或收款帳號被改動半個字元，雜湊值就會劇變導致簽章驗證失敗，攻擊 100% 被密碼學攔截！',
          explanation: '將人類授權「密碼學綁定（Cryptographically bind）到具體參數內容與單次 Nonce（防重放攻擊）」，是高安全等級 Agent 治理的最高標準。'
        },
        {
          label: '在網址後面加上 ?please_dont_hack=1',
          isBest: false,
          consequence: '毫無任何防禦效力。',
          explanation: '安全驗證必須建立在不可偽造的密碼學簽章與參數完整性校驗上。'
        },
        {
          label: '直接對未經正規化（非 Canonical）的 Python dict str() 字串簽章',
          isBest: false,
          consequence: '不同語言或不同版本解析 JSON 時空白與鍵順序改變，導致合法收據也驗章失敗或出現雙重編碼漏洞！',
          explanation: '簽章與雜湊前務必使用 JCS (RFC 8785) 正規化與嚴格的 Base64url 編碼規則。'
        }
      ]
    },
    codeLab: {
      title: '使用 JCS 正規化與 PyNaCl Ed25519 簽發與驗證行動收據',
      notebookPath: '18-securing-ai-agents/code_samples/18-signed-receipts.ipynb',
      lines: [
        { code: 'from nacl import signing\nfrom jcs import canonicalize', explain: '匯入工業級密碼學函式庫 PyNaCl（Ed25519）與 RFC 8785 JSON 正規化工具。' },
        { code: 'signing_key = signing.SigningKey.generate()\nverify_key = signing_key.verify_key', explain: '產生非對稱金鑰對：私鑰（SigningKey）嚴密保護用於簽發，公鑰（VerifyKey）公開給稽核系統驗證。' },
        { code: 'payload_bytes = canonicalize(receipt_body)\nsignature = signing_key.sign(payload_bytes).signature\n# 稽核端驗證（若遭竄改一字元即拋出 BadSignatureError）：\nverify_key.verify(canonicalize(loaded_body), signature)', explain: '先經 canonicalize() 轉為唯一標準位元組再簽章與驗章，實現數學級防竄改保證！' }
      ],
      simulatedOutput: '📐 Canonical JSON: {"action":"refund","amount":42,"order_id":"A1001"}\n✍️ Ed25519 Signature generated (64 bytes)\n✅ Audit Verify: VALID (Tamper-evident check passed!)',
      puzzle: {
        instruction: '最終章壓軸挑戰！點選詞彙，完成「先正規化 JSON、再用公鑰驗證簽章」的防竄改稽核程式碼：',
        templateParts: [
          'canonical_bytes = ',
          '(receipt_body)  # RFC 8785 標準化\nverify_key.',
          '(canonical_bytes, signature)  # 驗證 Ed25519 簽章完整性'
        ],
        answers: ['canonicalize', 'verify'],
        distractors: ['random_shuffle', 'ignore_tamper'],
        successNote: '🎉 太神啦！你已完成第 18 課壓軸挑戰！從環境入門一路走到密碼學防竄改治理，實至名歸的 AI Agent 架構大師！'
      }
    },
    flashcards: [
      {
        id: '18-cryptographic-receipt',
        term: 'Cryptographic Receipt（密碼學行動收據）',
        category: 'AI 資安治理',
        definition: '對 Agent 執行的工具動作、輸入輸出雜湊、時間戳記與授權依據進行數位簽章與雜湊鏈串接的防竄改稽核憑證。',
        example: '不同於可被事後偷改的純文字 Log，任何一字元變動都會使公鑰驗章失敗。'
      },
      {
        id: '18-jcs',
        term: 'JCS (JSON Canonicalization Scheme, RFC 8785)',
        category: '密碼學基礎',
        definition: '將 JSON 資料以確定性規則（固定鍵值字典序、統一數字格式、無多餘空白）序列化為唯一位元組表示法的國際標準。',
        example: '確保跨 Python、Go、JavaScript 系統對同一張 JSON 收據算出完全相同的雜湊與簽章。'
      },
      {
        id: '18-ed25519-hashchain',
        term: 'Ed25519 & Hash Chaining（數位簽章與雜湊鏈）',
        category: '密碼學基礎',
        definition: 'Ed25519 提供高速高安全性的非對稱公私鑰簽章；Hash Chaining 讓每筆收據包含前一筆的雜湊值，防止整筆紀錄被偷刪或調換順序。',
        example: '兼具單筆防偽造、防竄改與全序列防刪除（Append-only integrity）。'
      }
    ],
    quiz: [
      {
        question: '為什麼在高安全要求的 Agent 系統中，單純把紀錄寫進一般文字檔（.log / .jsonl）還不夠，需要升級為「密碼學簽章收據」？',
        options: [
          '因為一般文字檔可被擁有檔案權限的攻擊者或異常程序在事後靜默修改或刪除某幾行，而簽章收據＋雜湊鏈能提供數學級的防竄改與不可否認性！',
          '因為純文字檔不能存英文',
          '因為簽章後檔案大小會變成 0 Byte',
          '純粹為了好看'
        ],
        answerIndex: 0,
        explanation: '密碼學簽章（Ed25519）確保內容未被偽造或塗改，雜湊鏈（prev_hash）則確保歷史紀錄沒有被偷偷抽換或刪減。'
      },
      {
        question: '在對 JSON 物件計算雜湊或數位簽章前，為什麼必須先經過 JCS（RFC 8785 正規化）處理？',
        options: [
          '把 JSON 轉成 MP3 音樂檔',
          '消除不同系統間 Key 排列順序、縮排空白等格式差異，確保相同語意的 JSON 永遠產生唯一確定的位元組序列！',
          '隨機打亂欄位順序',
          '把所有數字乘以一百'
        ],
        answerIndex: 1,
        explanation: '沒有正規化的話，{"a":1,"b":2} 與 {"b":2, "a":1} 的位元組完全不同，會導致跨系統驗章大亂。'
      },
      {
        question: '為防止攻擊者拿主管昨天簽核過的「核准退款 $500 收據」重複刷退十次（Replay Attack 重放攻擊），授權收據內應包含什麼欄位？',
        options: [
          '唯一隨機識別碼（Nonce / Receipt ID）、精確目標訂單綁定與短效過期時間（Expiration Timestamp）',
          '主管最喜歡的星座',
          '空白字串',
          '允許無限次重複使用的萬用卡'
        ],
        answerIndex: 0,
        explanation: '透過唯一 Nonce 記錄已消耗憑證並搭配嚴格有效期與目標參數雜湊，即可徹底阻絕重放攻擊！'
      }
    ],
    deepDive: [
      {
        heading: '全課程 19 課畢業禮讚！🎓',
        content: '看到這裡，你已經完整巡禮了 Microsoft AI Agents for Beginners 從 00 到 18 的所有核心知識體系！別忘了下方收錄了第 18 課超硬核的兩份密碼學收據實作 Notebook 與 IETF ACTA 規格草案，隨時都能打開複習或收藏到你的「術語翻牌庫」！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '18-signed-receipts.ipynb（Ed25519 簽章收據與雜湊鏈實作）',
        url: `${REPO_BASE_URL}/blob/main/18-securing-ai-agents/code_samples/18-signed-receipts.ipynb`,
        note: 'Python PyNaCl + JCS 完整密碼學收據實戰'
      },
      {
        type: 'Notebook 程式碼',
        title: 'human-authorization-receipts.ipynb（人類授權收據綁定實作）',
        url: `${REPO_BASE_URL}/blob/main/18-securing-ai-agents/code_samples/human-authorization-receipts.ipynb`,
        note: '示範如何防止參數竄改與重放攻擊'
      },
      {
        type: '規格與論文',
        title: 'IETF 草案：draft-farley-acta-signed-receipts',
        url: 'https://datatracker.ietf.org/doc/draft-farley-acta-signed-receipts/',
        note: 'AI Agent 簽章收據國際標準化草案原文'
      },
      {
        type: '延伸課程',
        title: 'Microsoft AI Agents 官方學習資源與影片總集',
        url: 'https://aka.ms/ai-agents-beginners/collection',
        note: '替代第 18 課尚未公開之佔位影片連結，收錄官方最新更新資源'
      }
    ]
  }
];
