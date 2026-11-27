import { REPO_BASE_URL } from './curriculum-meta.js';

export const LESSONS_W1 = [
  {
    id: '00',
    slug: '00-course-setup',
    world: 1,
    title: '課程環境與啟程準備（Course Setup）',
    subtitle: '搞懂 Microsoft Foundry、Azure OpenAI Responses API 與免雲端的 Foundry Local 開發環境',
    estimatedMinutes: 6,
    xpReward: 120,
    tags: ['Microsoft Foundry', 'Python 3.12', 'az login'],
    videos: [],
    microCards: [
      {
        tag: '環境全景',
        title: '三種模型提供者（Provider），依你的設備與預算自由選',
        body: '這門課的所有範例都圍繞 Microsoft Agent Framework (MAF) 與新一代 Responses API 設計。在電腦上實作時，你有三條路可以走：',
        bullets: [
          'Microsoft Foundry / Azure OpenAI（雲端主力）：支援最新 Responses API、Server-side Agent 管理與觀測追蹤。',
          'Foundry Local（完全免費、離線跑）：直接在你自己的筆電／桌機跑 Qwen 等 SLM，不用 API Key 也不花雲端費用！',
          'OpenAI 相容端點（如 MiniMax）：只要支援標準介面，也能輕鬆切換測試。'
        ],
        image: {
          src: './course-images/forked-repo.33f27ca1901baa6a.webp',
          caption: '先 Fork 專案到自己的 GitHub 帳號，就能在 Codespaces 或本機自由修改實驗'
        }
      },
      {
        tag: '重要更新',
        title: '別踩坑！GitHub Models 已退役，全面改用無金鑰驗證',
        body: '早期教材常見的 GitHub Models 已於 2026 年退役且不支援 Responses API。現在官方推薦最安全的做法是不在程式碼硬塞 API Key，而是用 Azure CLI 登入。',
        bullets: [
          '安裝 Python 3.12+ 並建立獨立虛擬環境（venv），避免套件衝突。',
          '複製 .env.example 為 .env，填入 AZURE_AI_PROJECT_ENDPOINT 與模型部署名稱。',
          '終端機執行 az login，搭配 DefaultAzureCredential 或 AzureCliCredential 完成 Entra ID 無金鑰驗證。'
        ],
        image: {
          src: './course-images/project-endpoint.8cf04c9975bbfbf1.webp',
          caption: '從 Microsoft Foundry Portal 複製 Project Endpoint 貼進 .env 即可連線'
        }
      },
      {
        tag: '手機學習心法',
        title: '現在人在外面只有手機？先在這裡把架構腦練起來！',
        body: '你不需要現在打開電腦跑 pip install 才能學 AI Agent。本互動網站已經把每課的核心觀念、訊號流、架構決策與關鍵 Python 片段濃縮好，通勤刷完觀念，回家開電腦 10 分鐘就能跑通！',
        bullets: [
          '每課都有「動態流程模擬器」讓你親眼看見 Agent 內部怎麼運作。',
          '「免打字程式碼拼圖」幫你熟悉 MAF 語法，回電腦看 Notebook 不陌生。'
        ]
      }
    ],
    flowSimulator: {
      title: '開發環境驗證與 Foundry 無金鑰連線流程',
      description: '點按「下一步」，觀察你的本機 Python 程式如何安全地透過 Entra ID 呼叫 Microsoft Foundry 模型。',
      nodes: [
        { id: 'env', icon: '📄', label: '.env 設定檔' },
        { id: 'cli', icon: '🔐', label: 'az login 憑證' },
        { id: 'client', icon: '🧰', label: 'FoundryChatClient' },
        { id: 'cloud', icon: '☁️', label: 'Microsoft Foundry' }
      ],
      scenarios: [
        {
          name: '標準無金鑰連線（推薦）',
          steps: [
            {
              activeNode: 'env',
              badge: 'Step 1 · 讀取設定',
              text: 'load_dotenv() 載入專案端點與模型名稱，絕不把機密寫死在 .py 裡。',
              payload: 'AZURE_AI_PROJECT_ENDPOINT="https://my-proj.services.ai.azure.com/..."\nAZURE_AI_MODEL_DEPLOYMENT_NAME="gpt-5-mini"'
            },
            {
              activeNode: 'cli',
              badge: 'Step 2 · 取得 Entra Token',
              text: 'AzureCliCredential 自動向本機已登入的 az CLI 換取短期安全 Token，免管 API Key 外洩風險。',
              payload: 'credential = AzureCliCredential() -> Bearer eyJ0eXAiOiJKV1Qi...'
            },
            {
              activeNode: 'client',
              badge: 'Step 3 · 初始化 Client',
              text: '建立 Microsoft Agent Framework 的 FoundryChatClient 實例。',
              payload: 'provider = FoundryChatClient(project_endpoint=endpoint, model=model, credential=credential)'
            },
            {
              activeNode: 'cloud',
              badge: 'Step 4 · 連線就緒',
              text: '成功連上 Microsoft Foundry Agent Service V2，準備建立你的第一個 Agent！',
              payload: 'HTTP 200 OK · Agent Service V2 Ready'
            }
          ]
        },
        {
          name: '常見錯誤：忘記設環境變數',
          steps: [
            {
              activeNode: 'env',
              badge: 'Step 1 · 讀取 .env',
              text: '開發者忘了把 .env.example 複製成 .env，導致 os.getenv() 回傳 None。',
              payload: 'AZURE_AI_PROJECT_ENDPOINT = None'
            },
            {
              activeNode: 'client',
              badge: 'Step 2 · 啟動前防呆攔截',
              text: '良好的啟動檢查會在發送網路請求前立刻拋出清楚的 ValueError 提示缺漏欄位！',
              payload: 'ValueError: Missing required env var: AZURE_AI_PROJECT_ENDPOINT'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '團隊剛要把 AI Agent 實驗專案放上 GitHub 協作，實習生為了方便測試，直接把 Azure API Key 寫在 Notebook 變數裡準備 git push。',
      question: '身為技術把關者，你該要求團隊採用哪種標準配置？',
      options: [
        {
          label: '改用 .env 管理端點設定（確認 .env 在 .gitignore 內），並統一用 az login + DefaultAzureCredential 無金鑰驗證',
          isBest: true,
          consequence: '程式碼庫乾淨零機密外洩，每位成員用自己的 Entra ID 權限安全存取 Foundry！',
          explanation: '這正是 Microsoft Foundry 與本課程強調的最佳實踐：設定與程式碼分離，並以身分驗證（Entra ID）取代靜態金鑰。'
        },
        {
          label: '把 API Key 用 Base64 編碼後再放進 GitHub，這樣爬蟲就看不懂了',
          isBest: false,
          consequence: '上線不到 5 分鐘就被自動化掃描器解碼盜刷額度！',
          explanation: 'Base64 只是編碼不是加密，任何放在公開或共用 Repo 的靜態金鑰都等同公開裸奔。'
        },
        {
          label: '規定大家都不准用 Git，改用隨身碟傳 .ipynb 檔案',
          isBest: false,
          consequence: '版本徹底混亂，完全失去團隊協作與 CI Smoke Test 能力。',
          explanation: '問題出在機密管理方式，而非版本控制工具。善用 .env.example 搭配 .gitignore 即可完美解決。'
        }
      ]
    },
    codeLab: {
      title: '初始化 Microsoft Foundry 無金鑰連線',
      notebookPath: '01-intro-to-ai-agents/code_samples/01-python-agent-framework.ipynb',
      lines: [
        { code: 'import os\nfrom dotenv import load_dotenv', explain: '匯入標準環境變數模組與 python-dotenv 套件。' },
        { code: 'from azure.identity import AzureCliCredential', explain: '使用 Azure CLI 登入態進行無金鑰（Keyless）Entra ID 驗證。' },
        { code: 'from agent_framework.foundry import FoundryChatClient', explain: '從 Microsoft Agent Framework 匯入對接 Foundry Agent Service V2 的專用 Client。' },
        { code: 'load_dotenv()\nprovider = FoundryChatClient(\n    project_endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"],\n    model=os.environ["AZURE_AI_MODEL_DEPLOYMENT_NAME"],\n    credential=AzureCliCredential(),\n)', explain: '組合 Endpoint、模型部署名稱與憑證，一行完成雲端 Agent 服務連線！' }
      ],
      simulatedOutput: '✓ Loaded .env configuration\n✓ Authenticated via AzureCliCredential\n✓ Microsoft Foundry provider configured successfully!',
      puzzle: {
        instruction: '請依序點選下方詞彙，補完無金鑰初始化 FoundryChatClient 的關鍵程式碼：',
        templateParts: [
          'load_dotenv()\nprovider = ',
          '(\n    project_endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"],\n    model=os.environ["AZURE_AI_MODEL_DEPLOYMENT_NAME"],\n    credential=',
          '(),\n)'
        ],
        answers: ['FoundryChatClient', 'AzureCliCredential'],
        distractors: ['HardcodedApiKey', 'GitHubModelsClient'],
        successNote: '太棒了！FoundryChatClient 搭配 AzureCliCredential 就是貫穿整門 19 堂課的標準起手式。'
      }
    },
    flashcards: [
      {
        id: '00-maf',
        term: 'Microsoft Agent Framework (MAF)',
        category: '核心框架',
        definition: '微軟整合 Semantic Kernel 與 AutoGen 經驗打造的新一代生產級 AI Agent 開發框架，支援 Python 與 .NET。',
        example: '透過 FoundryChatClient.as_agent() 幾行程式就能建立掛載工具的 Agent。'
      },
      {
        id: '00-responses-api',
        term: 'Responses API',
        category: 'API 架構',
        definition: '新一代統一 API 介面，將對話生成、Tool Calling、多模態輸入與有狀態上下文整合在單一端點中。',
        example: '取代舊式繁瑣的手動迴圈拼接，是本課程預設採用的模型呼叫標準。'
      },
      {
        id: '00-foundry-local',
        term: 'Foundry Local',
        category: '本地執行',
        definition: '在個人電腦本地端執行開源小型語言模型（SLM，如 Qwen）並提供 OpenAI 相容 API 的執行引擎。',
        example: '沒有 Azure 訂閱或需要離線保護隱私時，可在筆電免費跑 Agent（詳見第 17 課）。'
      }
    ],
    quiz: [
      {
        question: '在本課程中，連接 Microsoft Foundry 最推薦的身份驗證方式是什麼？',
        options: [
          '把 API Key 直接寫在 Python 程式碼字串中',
          '執行 az login 搭配 AzureCliCredential / DefaultAzureCredential 無金鑰驗證',
          '使用已退役的 GitHub Models 個人 Token',
          '關閉所有驗證直接公開端點'
        ],
        answerIndex: 1,
        explanation: '使用 az login 搭配 Entra ID 憑證不需在檔案裡保存長效金鑰，安全性最高且符合生產環境規範。'
      },
      {
        question: '如果你暫時沒有雲端預算或想在飛機上離線實驗 AI Agent，課程提供哪個替代方案？',
        options: ['Foundry Local', 'Azure Search API', 'GitHub Actions', '純手寫正則表達式'],
        answerIndex: 0,
        explanation: 'Foundry Local 讓你直接在本地端硬體執行 Qwen 等 SLM，並提供相容 OpenAI 的本地端點。'
      },
      {
        question: '.env 檔案在專案中的正確管理原則為何？',
        options: [
          '直接 git add -f 推上公開 Repo 方便別人用',
          '從 .env.example 複製建立，並確保 .env 被列入 .gitignore 不進版控',
          '改名成 README.md',
          '每次執行完手動刪除整個虛擬環境'
        ],
        answerIndex: 1,
        explanation: '.env.example 提供欄位範本進版控，真實的 .env 僅留在本機並由 .gitignore 排除。'
      }
    ],
    deepDive: [
      {
        heading: '環境準備實戰 Checklist（回電腦實作時照著勾）',
        content: '當你準備好打開電腦實際跑 Jupyter Notebook 時，只要依序確認這四步即可順暢執行：',
        checklist: [
          '確認 python --version 為 Python 3.12 或以上版本。',
          '建立虛擬環境：python3 -m venv venv && source venv/bin/activate，接著 pip install -r requirements.txt。',
          '複製 cp .env.example .env 並填入 AZURE_AI_PROJECT_ENDPOINT 與 AZURE_AI_MODEL_DEPLOYMENT_NAME。',
          '執行 az login 登入你的 Azure 帳號後，即可啟動 VS Code 或 jupyter notebook 開始實作！'
        ]
      }
    ],
    resources: [
      {
        type: '官方文件',
        title: 'Lesson 00 課程設定原文講義（GitHub）',
        url: `${REPO_BASE_URL}/blob/main/00-course-setup/README.md`,
        note: '含完整 Windows / macOS / Codespaces 圖文步驟'
      },
      {
        type: '官方文件',
        title: 'Microsoft Foundry 官方入口（ai.azure.com）',
        url: 'https://ai.azure.com',
        note: '建立雲端專案與部署模型的地方'
      },
      {
        type: '官方文件',
        title: 'Azure CLI 安裝教學',
        url: 'https://aka.ms/installazurecli',
        note: '支援 Windows、macOS 與 Linux'
      },
      {
        type: '社群交流',
        title: 'Microsoft Foundry Discord 開發者社群',
        url: 'https://aka.ms/ai-agents/discord',
        note: '遇到環境卡關可直接發問交流'
      }
    ]
  },

  {
    id: '01',
    slug: '01-intro-to-ai-agents',
    world: 1,
    title: '認識 AI Agent 與應用場景（Intro to AI Agents）',
    subtitle: '為什麼一般 Chatbot 只是「動嘴」，而 AI Agent 能夠真正「動手辦事」？',
    estimatedMinutes: 8,
    xpReward: 130,
    tags: ['Sensors & Actuators', 'Agent 類型', 'Use Cases'],
    videos: [
      {
        youtubeId: '3zgm60bXmQk',
        title: 'Lesson 01：Introduction to AI Agents 官方教學短片',
        note: '可在頁內直接播放，或點下方按鈕開啟 YouTube App 搭配自動繁中字幕觀看'
      }
    ],
    microCards: [
      {
        tag: '核心定義',
        title: 'AI Agent ＝ LLM 大腦 ＋ 環境感知 ＋ 工具行動 ＋ 記憶',
        body: '單純的 LLM 只能「你問一句、它回一段文字」。而 AI Agent 是一個完整系統，能觀察環境狀態、推理規劃，並呼叫外部工具真正改變世界（例如查空房、刷卡訂票、寄確認信）。',
        bullets: [
          'Environment（環境）：Agent 運作的舞台，例如旅遊預訂平台或企業內部系統。',
          'Sensors（感測器）：讀取環境狀態的管道，例如查詢航班即時票價與庫存 API。',
          'Actuators（執行器）：實際對環境採取行動的手腳，例如送出訂位請求、發送通知。'
        ],
        image: {
          src: './course-images/what-are-ai-agents.1ec8c4d548af601a.webp',
          caption: '點圖可放大：AI Agent 結合 LLM、Tools、Memory 與環境互動的核心構造'
        }
      },
      {
        tag: '分類圖譜',
        title: '從簡單規則到多代理協作：7 種常見 AI Agent 類型',
        body: '不是每個問題都需要最複雜的系統！以「旅遊助理」為例，Agent 可依智慧與自主程度分為：',
        bullets: [
          'Simple Reflex（簡單反射型）：看到關鍵字「客訴」就直接轉真人客服，無記憶無規劃。',
          'Goal-based & Utility-based（目標／效用導向）：為了「訂好東京五日遊」自動拆步驟，還在預算與轉機時間之間算最優解！',
          'Hierarchical & Multi-Agent（階層式／多代理）：總管 Agent 把「取消行程」拆給機票、飯店、租車三個子 Agent 同步處理。'
        ]
      },
      {
        tag: '實務判斷',
        title: '什麼時候該用 AI Agent？什麼時候「千萬別用」？',
        body: '殺雞焉用牛刀！如果流程固定且百分之百可預測（例如計算稅率、固定欄位表單驗證），寫傳統程式 if/else 又快又省錢。AI Agent 真正發光的地方是：',
        bullets: [
          '開放式問題（Open-ended problems）：無法事先寫死所有步驟，需要動態推理找路。',
          '多步驟跨工具任務（Multi-step workflows）：需要查完 A 系統，依結果決定要不要改查 B 或執行 C。',
          '隨回饋持續演進：能結合使用者偏好記憶（如「我習慣坐靠窗座位」）越用越貼心。'
        ],
        image: {
          src: './course-images/when-to-use-ai-agents.54becb3bed74a479.webp',
          caption: '評估開放性、多步流程與持續改進需求，決定是否導入 AI Agent'
        }
      }
    ],
    flowSimulator: {
      title: '一般 Chatbot vs. 旅遊預訂 AI Agent 運作差異',
      description: '切換上方情境並點按「下一步」，比較純 LLM 聊天機器人與具備 Sensors / Actuators 的 TravelAgent 如何處理同一句需求。',
      nodes: [
        { id: 'user', icon: '🧑‍💻', label: '使用者需求' },
        { id: 'llm', icon: '🧠', label: 'LLM 推理核心' },
        { id: 'tool', icon: '🛫', label: '目的地與航班 Tool' },
        { id: 'memory', icon: '🗂️', label: '偏好記憶庫' }
      ],
      scenarios: [
        {
          name: '具備工具與記憶的 TravelAgent',
          steps: [
            {
              activeNode: 'user',
              badge: 'User Prompt',
              text: '使用者說：「幫我推薦一個下週適合潛水的溫暖海島，順便看有沒有符合我習慣的航班。」',
              payload: 'input = "推薦溫暖海島 + 符合習慣航班"'
            },
            {
              activeNode: 'memory',
              badge: '讀取 Memory（感測）',
              text: 'Agent 先查閱長期記憶，發現這位旅客偏好「直飛、靠窗座位、避開紅眼班機」。',
              payload: 'memory.recall(user_id) -> { seat: "window", red_eye: false }'
            },
            {
              activeNode: 'tool',
              badge: '呼叫 get_destinations（行動）',
              text: 'LLM 決定呼叫旅遊資料庫工具查詢當季溫暖海島與即時班表，而非憑空亂編！',
              payload: 'tool_call: get_destinations(theme="beach_warm") -> ["Bali", "Okinawa"]'
            },
            {
              activeNode: 'llm',
              badge: '綜合決策回覆',
              text: '結合真實航班庫存與旅客偏好，產出精準可執行的峇里島與沖繩早班直飛建議！',
              payload: '推薦沖繩早班直飛 CI120（已為您篩選靠窗空位），是否幫您保留？'
            }
          ]
        },
        {
          name: '純 LLM 一般聊天機器人（無工具）',
          steps: [
            {
              activeNode: 'user',
              badge: 'User Prompt',
              text: '同樣問：「幫我推薦下週適合潛水的海島並查符合我習慣的航班。」',
              payload: 'input = "推薦溫暖海島 + 符合習慣航班"'
            },
            {
              activeNode: 'llm',
              badge: '僅靠訓練資料猜測',
              text: '沒有記憶也不知道你是誰，沒有工具也查不到即時票價，只能給出籠統教科書回答甚至幻覺出不存在的班號！',
              payload: '「建議您可以去馬爾地夫或峇里島喔！至於即時航班請您自行上航空公司網站查詢～」'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '電商老闆看完 AI 新聞很興奮，叫你把網站上「滿千折百的結帳金額計算公式」跟「複雜跨單退換貨客服處理」全部改寫成 AI Agent。',
      question: '根據第 01 課「何時該用 AI Agent」原則，你應該怎麼建議老闆？',
      options: [
        {
          label: '「滿千折百」維持傳統確定性程式碼（零延遲零算錯）；把資源集中在需要查物流、讀照片、跨多步判斷的「退換貨客服 Agent」！',
          isBest: true,
          consequence: '結帳毫秒級反應且帳務 100% 精準，客服人力則大幅省下 60% 重複查單時間！',
          explanation: '規則明確且不可出錯的算術邏輯用傳統程式最可靠；開放式、需跨系統查詢與多輪判斷的流程才是 AI Agent 的主場。'
        },
        {
          label: '全部都交給 GPT 模型算，連購物車加法都發 API 給 LLM 推理',
          isBest: false,
          consequence: '結帳變慢 4 秒、雲端帳單暴增，偶爾還算錯折扣被客訴！',
          explanation: '把確定性公式交給機率型語言模型是典型的過度設計（Over-engineering）。'
        },
        {
          label: '兩個都不要用 AI，叫客服團隊背誦 500 頁 SOP 手動查單就好',
          isBest: false,
          consequence: '大促銷期間客服信箱塞爆，客戶等三天還拿不到退貨進度。',
          explanation: '跨物流查詢、訂單狀態核對與初步退換貨分流正是 Goal-based / Tool-using Agent 最擅長的場景。'
        }
      ]
    },
    codeLab: {
      title: '打造你的第一個 TravelAgent（Microsoft Agent Framework）',
      notebookPath: '01-intro-to-ai-agents/code_samples/01-python-agent-framework.ipynb',
      lines: [
        { code: '@tool(approval_mode="never_require")\ndef get_destinations() -> list[str]:\n    """取得熱門度假目的地清單。"""\n    return ["Barcelona", "Tokyo", "Bali", "Sydney"]', explain: '用 @tool 裝飾器把一般 Python 函式變成 Agent 看得懂的工具！Docstring 非常重要，LLM 會靠這行說明判斷何時呼叫它。' },
        { code: 'agent = provider.as_agent(\n    name="TravelAgent",\n    instructions="你是貼心的旅遊顧問，請使用 get_destinations 工具推薦地點。",\n    tools=[get_destinations],\n)', explain: '透過 provider.as_agent() 組裝名稱、System Instructions（角色指令）與工具清單。' },
        { code: 'response = await agent.run(\n    "我想找溫暖的海灘度假，推薦去哪裡？"\n)\nprint(response)', explain: '呼叫 agent.run()！Agent 會自動先執行 get_destinations() 拿到清單，再挑選溫暖海灘 Bali 回覆使用者。' }
      ],
      simulatedOutput: '🔧 [Tool Call] get_destinations() -> ["Barcelona", "Tokyo", "Bali", "Sydney"]\n🤖 TravelAgent: 推薦您前往峇里島（Bali）！那裡擁有溫暖陽光、迷人海灘與豐富的度假村選擇。',
      puzzle: {
        instruction: '點選下方詞彙，組裝出能呼叫 get_destinations 工具並執行對話的 TravelAgent：',
        templateParts: [
          'agent = provider.',
          '(\n    name="TravelAgent",\n    instructions="請使用工具推薦度假地點",\n    ',
          '=[get_destinations],\n)\nresponse = await agent.',
          '("推薦溫暖海灘")'
        ],
        answers: ['as_agent', 'tools', 'run'],
        distractors: ['compile_sql', 'css_style'],
        successNote: '完美過關！as_agent() 掛載 tools，再用 await agent.run() 啟動推理迴圈。'
      }
    },
    flashcards: [
      {
        id: '01-sensors-actuators',
        term: 'Sensors & Actuators（感測器與執行器）',
        category: '核心構造',
        definition: 'Sensors 讓 Agent 讀取外部環境資訊（如查天氣 API）；Actuators 讓 Agent 對環境執行實際動作（如訂房、發信）。',
        example: '旅遊 Agent 查空房是 Sensor，刷卡下訂是 Actuator。'
      },
      {
        id: '01-utility-agent',
        term: 'Utility-based Agent（效用導向代理）',
        category: 'Agent 類型',
        definition: '不只滿足於「達成目標」，還會在價格、時間、舒適度等多重條件間權衡分數，找出最佳解。',
        example: '幫你挑出「轉機最少且票價不超過兩萬」的最划算航班組合。'
      },
      {
        id: '01-mas',
        term: 'Multi-Agent System (MAS)',
        category: 'Agent 類型',
        definition: '由多個各自具備專長與工具的獨立 Agent 協作（或競爭辯論）來完成單一 Agent 難以負荷的大型任務。',
        example: '機票 Agent、住宿 Agent 與當地嚮導 Agent 共同排出一份完整行程。'
      }
    ],
    quiz: [
      {
        question: '讓 AI Agent 與「純聊天 LLM」產生本質差異的核心關鍵是什麼？',
        options: [
          '字體顏色比較漂亮',
          '結合環境感知（Sensors）、工具行動能力（Actuators / Tools）與記憶系統來自主完成目標',
          '只能回答是非題',
          '不需要任何語言模型也能理解自然語言'
        ],
        answerIndex: 1,
        explanation: 'AI Agent 不只是生成文字，而是能透過工具與記憶在環境中感知並採取行動的完整系統。'
      },
      {
        question: '若一個客服機器人只寫死一條規則：「只要信件出現『退款』兩個字就自動轉寄給財務部」，這屬於哪種 Agent？',
        options: [
          'Simple Reflex Agent（簡單反射型代理）',
          'Utility-based Agent（效用導向代理）',
          'Learning Agent（學習型代理）',
          'Hierarchical Agent（階層式代理）'
        ],
        answerIndex: 0,
        explanation: '完全依賴固定條件觸發固定動作、不含內部狀態模型或規劃推理，稱為 Simple Reflex Agent。'
      },
      {
        question: '下列哪一種情境「最不適合」硬套 AI Agent，反而該用傳統程式直接寫？',
        options: [
          '根據客戶模糊的旅遊偏好跨三個平台規劃五天四夜自由行',
          '台灣營業稅 5% 固定稅額四捨五入計算',
          '自動閱讀錯誤 Log、搜尋知識庫並草擬修復建議的多步排障助手',
          '依顧客過往購買紀錄與即時庫存動態議價的採購助手'
        ],
        answerIndex: 1,
        explanation: '固定明確的數學公式用傳統程式一行搞定，速度快、成本零且絕不幻覺出錯。'
      }
    ],
    deepDive: [
      {
        heading: '課後隨手練習：用 Agent 三要素拆解你身邊的日常任務',
        content: '下次你想做一個 AI 專案時，先別急著寫 Prompt，試著在腦中回答這三個問題：1. 它的 Environment（環境）在哪裡？ 2. 它需要哪些唯讀查詢工具當 Sensors？ 3. 它需要哪些寫入／執行工具當 Actuators（又有哪些高風險動作必須先問過人類）？想清楚這三點，你的架構就成功一半了！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '01-python-agent-framework.ipynb（TravelAgent 完整範例）',
        url: `${REPO_BASE_URL}/blob/main/01-intro-to-ai-agents/code_samples/01-python-agent-framework.ipynb`,
        note: 'Python MAF 實作程式碼'
      },
      {
        type: '官方文件',
        title: 'Lesson 01 原文完整講義',
        url: `${REPO_BASE_URL}/blob/main/01-intro-to-ai-agents/README.md`,
        note: '含 .NET 版本連結與 Smoke Test 說明'
      },
      {
        type: '延伸課程',
        title: 'Microsoft Learn：AI Agents for Beginners 官方學習資源集',
        url: 'https://aka.ms/ai-agents-beginners/collection',
        note: '微軟官方整理的補充閱讀清單'
      }
    ]
  },

  {
    id: '02',
    slug: '02-explore-agentic-frameworks',
    world: 1,
    title: '探索 AI Agent 框架生態（Explore Agentic Frameworks）',
    subtitle: '為什麼不自己手刻 while 迴圈？比較 MAF、AutoGen、Semantic Kernel 與 LangGraph',
    estimatedMinutes: 8,
    xpReward: 130,
    tags: ['MAF', 'Foundry Agent Service', '生態系比較'],
    videos: [
      {
        youtubeId: 'ODwF-EZo_O8',
        title: 'Lesson 02：Explore AI Agent Frameworks 官方影片',
        note: '解析主流開源框架與雲端託管服務的定位差異'
      }
    ],
    microCards: [
      {
        tag: '痛點剖析',
        title: '自己從零手刻 Agent 迴圈會遇到什麼麻煩？',
        body: '剛學 API 時很容易覺得：「我自己寫個 while loop 接 OpenAI API 不就好了？」但一進入真實專案，你馬上會撞上五座大山：',
        bullets: [
          '工具參數解析、型別驗證（Pydantic）與例外重試邏輯寫到崩潰。',
          '多輪對話狀態（State）與長短期記憶（Memory）難以跨執行緒維護。',
          '多個 Agent 之間怎麼交接（Handoff）、平行執行或設中斷點？',
          '出錯時黑盒子一片，缺乏標準化 OpenTelemetry 追蹤（Tracing）。'
        ],
        image: {
          src: './course-images/lesson-2-thumbnail.c65f44c93b8558df.webp',
          caption: 'Agent 框架幫你把工具串接、狀態管理、多代理協作與可觀測性標準化'
        }
      },
      {
        tag: '重磅演進',
        title: 'Microsoft Agent Framework (MAF)：集兩大前輩之大成',
        body: '過去微軟生態有兩個超人氣專案：擅長多代理實驗的 AutoGen，以及擅長企業級穩定整合的 Semantic Kernel。現在微軟將兩者精華融合為統一的 Microsoft Agent Framework (MAF)！',
        bullets: [
          '同時提供 Python 與 .NET 一致的開發體驗與 API 概念。',
          '小從 10 行單一 Agent 原型，大到確定性圖形工作流（WorkflowBuilder）都能無縫升級。',
          '內建 OpenTelemetry 追蹤、Middleware 攔截器與 MCP 協定支援。'
        ]
      },
      {
        tag: '選型指南',
        title: 'MAF vs. Foundry Agent Service vs. LangGraph 怎麼選？',
        body: '它們不是互斥的敵人，而是不同層次的好夥伴：',
        bullets: [
          'Microsoft Agent Framework (SDK 層)：你在程式碼中定義邏輯、工具與編排的開發框架。',
          'Microsoft Foundry Agent Service V2（雲端平台層）：幫你託管執行環境、安全身份、內建雲端搜尋與 Portal 視覺化監控。',
          'LangChain / LangGraph：第三方熱門圖形狀態機生態，甚至也能直接打包部署成 Foundry Hosted Agent！'
        ]
      }
    ],
    flowSimulator: {
      title: '手刻原始 API vs. 使用 MAF + Foundry 框架層次對照',
      description: '點按步驟，觀察一個請求在 Microsoft Agent Framework 架構中經過哪些自動化基礎建設。',
      nodes: [
        { id: 'app', icon: '📱', label: '你的應用程式' },
        { id: 'maf', icon: '🧩', label: 'MAF 編排核心' },
        { id: 'tools', icon: '🛠️', label: '型別安全 Tools' },
        { id: 'foundry', icon: '☁️', label: 'Foundry 託管與觀測' }
      ],
      scenarios: [
        {
          name: 'MAF 自動處理工具迴圈與追蹤',
          steps: [
            {
              activeNode: 'app',
              badge: 'Step 1 · 呼叫 agent.run()',
              text: '應用程式只需傳入使用者訊息，不必手寫 JSON Schema 或 while 迴圈。',
              payload: 'await agent.run("幫我查台北明天天氣並建議穿搭")'
            },
            {
              activeNode: 'maf',
              badge: 'Step 2 · 自動產生 Schema 與路由',
              text: 'MAF 自動讀取 Python Type Hints 與 Annotated 註解，轉成標準 Tool Schema 送交模型。',
              payload: 'Auto-schema: get_weather(city: str) -> JSON Schema validated'
            },
            {
              activeNode: 'tools',
              badge: 'Step 3 · 安全執行並回填結果',
              text: '當模型要求呼叫工具，MAF 自動驗證參數、執行函式，並把結果塞回對話脈絡繼續推理。',
              payload: 'get_weather("Taipei") -> "22°C 多雲短暫雨"'
            },
            {
              activeNode: 'foundry',
              badge: 'Step 4 · 自動寫入 Trace 與回覆',
              text: '整個過程的延遲、Token 消耗與工具呼叫紀錄自動同步到 Foundry Portal 供除錯分析！',
              payload: 'Trace recorded · Latency: 1.1s · Output: "建議攜帶折疊傘與薄外套"'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '你的新創團隊同時有 Python 資料科學家跟 C#/.NET 後端工程師，準備合力打造一套企業客服多代理系統，並要求上線後在 Azure 上有完整的監控與權限控管。',
      question: '哪一種框架選型最能讓兩組工程師共用設計語言並順利上雲？',
      options: [
        {
          label: '採用 Microsoft Agent Framework (MAF) 搭配 Microsoft Foundry Agent Service V2',
          isBest: true,
          consequence: 'Python 與 .NET 團隊共用相同的 Agent / Workflow / Tool 抽象概念，還能直接在 Foundry Portal 集中觀測！',
          explanation: 'MAF 原生支援雙語言對齊，且與 Foundry Agent Service V2 深度整合，省去自建跨語言狀態與追蹤底層的龐大成本。'
        },
        {
          label: '規定不准用任何框架，兩邊各自用 curl 拼 HTTP 字串跟寫正則表達式解析 JSON',
          isBest: false,
          consequence: '光修 JSON 括號漏掉跟非同步 Timeout Bug 就耗掉三個月，還沒寫到業務邏輯。',
          explanation: '重複造輪子會讓團隊深陷底層序列化與錯誤處理泥淖。'
        },
        {
          label: '只用純前端 CSS 動畫假裝有 AI 回覆',
          isBest: false,
          consequence: '展示時被客戶隨便換句話問就穿幫了！',
          explanation: '真實業務需求需要具備推理與工具調度能力的後端 Agent 架構。'
        }
      ]
    },
    codeLab: {
      title: '比較直接呼叫 Azure OpenAI 與 FoundryChatClient 建立串流 Agent',
      notebookPath: '02-explore-agentic-frameworks/code_samples/02-python-agent-framework.ipynb',
      lines: [
        { code: 'from typing import Annotated\nfrom agent_framework import tool', explain: '結合 Python 標準 Annotated 與 MAF 的 @tool，讓參數說明直接寫在型別旁邊！' },
        { code: '@tool(approval_mode="never_require")\ndef get_menu_specials(\n    meal_type: Annotated[str, "餐期：breakfast, lunch 或 dinner"]\n) -> str:\n    return "主廚推薦：松露野菇燉飯 $420"', explain: 'LLM 會精準讀到 Annotated 裡的中文提示，知道該傳入哪種字串格式。' },
        { code: 'agent = provider.as_agent(\n    name="BistroConcierge",\n    instructions="你是餐廳禮賓助理，請查詢當日特餐回答客人。",\n    tools=[get_menu_specials],\n)', explain: '將餐廳特餐工具掛載到 BistroConcierge 代理上。' },
        { code: 'async for chunk in agent.run("今晚晚餐有什麼特餐？", stream=True):\n    print(chunk, end="", flush=True)', explain: '加上 stream=True 並用 async for 迭代，就能像打字機一樣即時串流顯示回應，大幅提升手機端體感速度！' }
      ],
      simulatedOutput: '🔧 [Tool] get_menu_specials(meal_type="dinner")\n🤖 今晚晚餐為您推薦我們的主廚特餐：**松露野菇燉飯（$420）**，香氣濃郁非常受歡迎！',
      puzzle: {
        instruction: '點選正確詞彙，為工具參數加上型別說明並開啟串流（Streaming）輸出：',
        templateParts: [
          'def get_specials(meal: ',
          '[str, "餐期名稱"]) -> str:\n    return "牛排特餐"\n\nasync for chunk in agent.run("晚餐吃什麼？", ',
          '=True):\n    print(chunk, end="")'
        ],
        answers: ['Annotated', 'stream'],
        distractors: ['Deprecated', 'blocking_sleep'],
        successNote: '答對了！Annotated 提供語意化參數描述，stream=True 讓使用者不用乾等整段生成完畢。'
      }
    },
    flashcards: [
      {
        id: '02-autogen-sk',
        term: 'AutoGen & Semantic Kernel 與 MAF 的關係',
        category: '框架演進',
        definition: 'AutoGen 開創了靈活的多代理對話實驗，Semantic Kernel 奠定了企業級插件與穩定度；MAF 則是融合兩者優勢的正式統一繼任框架。',
        example: '新專案建議直接採用 Microsoft Agent Framework (MAF) 起步。'
      },
      {
        id: '02-foundry-service',
        term: 'Foundry Agent Service V2',
        category: '雲端託管',
        definition: 'Microsoft Foundry 提供的伺服器端 Agent 執行與管理平台，讓你的 Agent 註冊在雲端、可在 Portal 檢視並受企業級資安保護。',
        example: '使用 FoundryChatClient 建立的 Agent 可在 Foundry 介面直接檢視狀態與觀測紀錄。'
      },
      {
        id: '02-streaming',
        term: 'Streaming（串流回應）',
        category: '使用者體驗',
        definition: '模型每生成幾個 Token 就立刻推送到前端顯示，降低首字延遲（TTFT）焦慮感。',
        example: '在 MAF 中只需傳入 stream=True 並使用 async for 接收。'
      }
    ],
    quiz: [
      {
        question: 'Microsoft Agent Framework (MAF) 主要是整合了微軟哪兩個知名開源專案的經驗而成？',
        options: [
          'jQuery 與 Bootstrap',
          'AutoGen 與 Semantic Kernel',
          'Word 與 Excel',
          'Linux 與 Docker'
        ],
        answerIndex: 1,
        explanation: 'MAF 結合了 AutoGen 的多代理編排靈活性與 Semantic Kernel 的企業級型別安全與穩定基礎。'
      },
      {
        question: '在定義 MAF 工具函式時，使用 typing.Annotated[str, "說明文字"] 的主要好處是什麼？',
        options: [
          '讓電腦風扇轉比較慢',
          '自動將參數型別與語意說明轉成 JSON Schema，幫助 LLM 填入正確格式的參數',
          '把變數加密成亂碼',
          '限制函式只能在星期一執行'
        ],
        answerIndex: 1,
        explanation: '清楚的型別與參數說明能大幅減少 LLM 傳錯參數格式（Hallucinated arguments）的機率。'
      },
      {
        question: '如果團隊已經有用 LangGraph 寫好的 Agent，能放到 Microsoft Foundry 上運行嗎？',
        options: [
          '完全不行，必須全部砍掉重練',
          '可以！Foundry 支援將 LangChain / LangGraph 包裝部署為 Foundry Hosted Agents',
          '只能印在紙上人工執行',
          '必須先把 Python 轉成組合語言'
        ],
        answerIndex: 1,
        explanation: 'Microsoft Foundry 採開放架構，除了原生支援 MAF，也支援託管 LangGraph 等第三方框架代理。'
      }
    ],
    deepDive: [
      {
        heading: '選框架時的「三秒鐘黃金法則」',
        content: '初學者常陷入「框架選擇困難症」。其實只要看團隊現況：若從零開始想一路順暢銜接生產環境與多代理工作流，直接選 Microsoft Agent Framework (MAF)；若想省去自管容器與監控基礎設施，底層接上 Foundry Agent Service V2 就對了！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '02-python-agent-framework.ipynb（Foundry 版）',
        url: `${REPO_BASE_URL}/blob/main/02-explore-agentic-frameworks/code_samples/02-python-agent-framework.ipynb`,
        note: '使用 FoundryChatClient 實作串流與工具呼叫'
      },
      {
        type: 'Notebook 程式碼',
        title: '02-python-agent-framework-azure-openai.ipynb（Azure OpenAI 直連版）',
        url: `${REPO_BASE_URL}/blob/main/02-explore-agentic-frameworks/code_samples/02-python-agent-framework-azure-openai.ipynb`,
        note: '展示直接連接 Azure OpenAI Responses API 的寫法'
      },
      {
        type: '官方文件',
        title: 'Microsoft Agent Framework 官方文件總覽',
        url: 'https://learn.microsoft.com/agent-framework/overview/',
        note: 'Python 與 .NET 完整開發手冊'
      }
    ]
  },

  {
    id: '03',
    slug: '03-agentic-design-patterns',
    world: 1,
    title: 'AI Agent 設計原則與模式總覽（Design Principles）',
    subtitle: '好用的 Agent 不是靠「塞超長 Prompt」，而是遵守 Space、Time、Core 三大設計心法！',
    estimatedMinutes: 7,
    xpReward: 130,
    tags: ['UX 設計原則', 'Space / Time / Core', '透明可控'],
    videos: [
      {
        youtubeId: 'm9lM8qqoOEA',
        title: 'Lesson 03：AI Agentic Design Principles 官方影片',
        note: '學習如何設計讓使用者信任、好溝通又不越權的 AI Agent'
      }
    ],
    microCards: [
      {
        tag: '設計哲學',
        title: 'Microsoft 提出的 Agent 三大設計維度：Space、Time、Core',
        body: '把 Agent 做出來不難，難的是做出「讓人敢用、愛用」的體驗。這堂課以微軟經典的 Agent 設計框架拆解三大面向：',
        bullets: [
          'Agent（Space 空間維度）：它在哪裡運作？如何連接人、事件與知識，而不只是把人關在單調對話框裡？',
          'Agent（Time 時間維度）：它如何回顧過去（歷史記憶）、感知現在（即時狀態通知）、並主動規劃未來下一步？',
          'Agent（Core 核心素養）：擁抱不確定性（透明揭露信心度）、建立信任與把最終控制權留給使用者！'
        ],
        image: {
          src: './course-images/agentic-design-principles.1cfdf8b6d3cc73c2.webp',
          caption: '點圖放大：涵蓋 Space（空間連接）、Time（時間脈絡）與 Core（信任控制）的設計原則'
        }
      },
      {
        tag: '核心素養',
        title: '擁抱不確定性（Embrace Uncertainty）與透明化（Transparency）',
        body: 'LLM 天生是機率模型，偶爾會誤解模糊指令。優秀的 Agent 絕不會「不懂裝懂硬幹」，而是：',
        bullets: [
          '遇到模糊指令先主動追問澄清（例如：「您說訂下週五去東京，請問要單程還是來回？」）。',
          '清楚顯示目前正在呼叫哪個工具、參考了哪份文件來源（Citation），不當黑盒子。',
          '讓使用者隨時能「踩煞車（Interrupt / Undo）」或修改偏好設定。'
        ]
      },
      {
        tag: '模式地圖',
        title: '預告接下來的五大實戰設計模式（Lessons 04–09）',
        body: '掌握設計心法後，下一章我們就會進入五大經典工程模式武器庫：',
        bullets: [
          'Tool Use（第 04 課）＋ Agentic RAG（第 05 課）：賦予手腳與查證事實的能力。',
          'Trustworthy Guardrails（第 06 課）：建立安全邊界與人工審核門檻。',
          'Planning（第 07 課）、Multi-Agent（第 08 課）與 Metacognition 自我反思（第 09 課）：解鎖複雜任務拆解與自我糾錯！'
        ]
      }
    ],
    flowSimulator: {
      title: '糟糕黑盒體驗 vs. 符合設計原則的透明可控 Agent',
      description: '比較面對模糊高風險指令「幫我把上個月沒用到的雲端主機清掉」時，兩種設計的差別。',
      nodes: [
        { id: 'input', icon: '💬', label: '模糊指令' },
        { id: 'inspect', icon: '🔍', label: '盤點與透明度' },
        { id: 'confirm', icon: '🙋', label: '澄清與控制權' },
        { id: 'exec', icon: '✅', label: '安全執行' }
      ],
      scenarios: [
        {
          name: '遵循 Space/Time/Core 設計原則（推薦）',
          steps: [
            {
              activeNode: 'input',
              badge: '接收模糊高風險請求',
              text: '使用者說：「幫我把上個月沒用到的測試雲端主機清掉。」（「沒用到」定義不明確！）',
              payload: 'intent = cleanup_unused_vms (ambiguity: HIGH, impact: DESTRUCTIVE)'
            },
            {
              activeNode: 'inspect',
              badge: '透明揭露查詢過程',
              text: 'Agent 先唯讀查詢過去 30 天 CPU < 1% 的清單，並在畫面顯示資料來源與篩選標準。',
              payload: 'Found 2 VMs: [dev-test-01 (CPU 0.2%), staging-db-backup (CPU 0.4%)]'
            },
            {
              activeNode: 'confirm',
              badge: '保留控制權給人類',
              text: '主動提示其中一台名稱含 backup 可能是備份機，列出清單請使用者勾選確認後才刪！',
              payload: 'Prompt user: "偵測到 staging-db-backup 低負載但疑似備份用途，請確認僅刪除 dev-test-01？"'
            },
            {
              activeNode: 'exec',
              badge: '精準執行並留存紀錄',
              text: '獲得明確授權後僅刪除 dev-test-01，並提供操作摘要方便日後回溯。',
              payload: 'Deleted: dev-test-01 · Skipped: staging-db-backup · Audit ID #8821'
            }
          ]
        },
        {
          name: '違反設計原則的黑盒莽撞 Agent',
          steps: [
            {
              activeNode: 'input',
              badge: '接收模糊請求',
              text: '收到同一句「把上個月沒用到的主機清掉」，完全不確認「沒用到」的標準。',
              payload: 'intent = delete_vms_immediately'
            },
            {
              activeNode: 'exec',
              badge: '黑盒直接砍光災難備援機',
              text: '不顯示清單、不詢問確認，直接把平常待機但超重要的災難備援資料庫砍了！使用者連取消按鈕都沒有！',
              payload: 'CRITICAL OUTAGE: Deleted dr-standby-prod without confirmation!'
            }
          ]
        }
      ]
    },
    architectChallenge: {
      situation: '你在設計一款幫業務人員自動草擬並寄出客戶報價信的 AI Agent。產品經理問：「要不要讓 Agent 猜完客戶需求就直接靜默把報價單寄出去，這樣最自動化？」',
      question: '依據 Lesson 03 的「信任與使用者控制權（Trust & Control）」設計原則，你怎麼設計這個互動？',
      options: [
        {
          label: '讓 Agent 自動查好歷史成交價、標註參考依據並生成報價草稿預覽卡，由業務一鍵確認（或微調折扣）後才正式寄出',
          isBest: true,
          consequence: '既省下業務 90% 查資料寫信時間，又杜絕報錯價寄給大客戶的商業風險，團隊超放心天天用！',
          explanation: '自動化前置繁瑣步驟（Space/Time 整合），但在高影響對外動作保留「透明預覽＋人類最終控制權（Core）」，是成功 Agent 產品的黃金準則。'
        },
        {
          label: '完全黑盒靜默寄出，而且不讓業務看到寄了多少錢給客戶',
          isBest: false,
          consequence: '某天模型多打一個零或少算一個零寄出報價單，公司直接賠慘且無人敢再用這套工具。',
          explanation: '缺乏透明度（Transparency）與控制權（Control）會瞬間摧毀使用者對 Agent 的信任。'
        },
        {
          label: '每打一個英文字母就跳出視窗問業務「確定要打這個字母嗎？」',
          isBest: false,
          consequence: '干擾過度，比自己手寫一封信還慢十倍！',
          explanation: '好的設計是在「關鍵決策點与高風險動作」請求確認，而不是用瑣碎彈窗轟炸使用者。'
        }
      ]
    },
    codeLab: {
      title: '在 System Instructions 寫入「透明、誠實、先澄清後行動」設計原則',
      notebookPath: '03-agentic-design-patterns/code_samples/03-python-agent-framework.ipynb',
      lines: [
        { code: 'DESIGN_PRINCIPLES_PROMPT = """\n你是透明且尊重使用者控制權的旅遊規劃 Agent：\n1. 資訊不足時（如未給預算或日期），先禮貌提出 1-2 個簡短問題澄清，絕不自行瞎猜。\n2. 推薦行程時，明確說明是依據哪個工具回傳的資料。\n3. 執行任何預訂或取消前，必須先列出摘要請使用者確認。\n"""', explain: '把抽象的 UX 設計原則具體轉化為結構化的 System Instructions 行為準則！' },
        { code: 'concierge = provider.as_agent(\n    name="TransparentConcierge",\n    instructions=DESIGN_PRINCIPLES_PROMPT,\n    tools=[search_hotels, check_weather],\n)', explain: '只有唯讀查詢工具開放自動呼叫，寫入動作則受原則約束先確認。' },
        { code: 'reply = await concierge.run("幫我訂下禮拜去日本最貴的飯店")', explain: '面對「下禮拜哪幾天？哪個城市？確定要下訂嗎？」等模糊高金額指令，Agent 會先查價並回報確認，而不是直接刷卡。' }
      ],
      simulatedOutput: '🤖 TransparentConcierge: 在為您預訂前，想先與您確認兩個細節：\n1. 請問預計前往日本哪個城市（如東京、京都）及確切入住／退房日期？\n2. 查得東京安縵每晚約 NT$48,000（來源：search_hotels），確認日期後我會先列出總價供您核准再下訂！',
      puzzle: {
        instruction: '點選下方關鍵概念詞彙，完成符合微軟 Agent 設計原則的行為指令：',
        templateParts: [
          '1. 遇到模糊需求時先主動 ',
          '，不憑空猜測。\n2. 回覆時清楚標註資料來源以維持 ',
          '。\n3. 執行不可逆動作前務必交由使用者最終 ',
          '。'
        ],
        answers: ['澄清問題', '透明度', '確認控制'],
        distractors: ['隱藏來源', '靜默刪除'],
        successNote: '太讚了！「主動澄清、過程透明、最終控制權在人」正是打造高信任度 Agent 的三大支柱。'
      }
    },
    flashcards: [
      {
        id: '03-space-time-core',
        term: 'Space · Time · Core 設計框架',
        category: '設計原則',
        definition: '微軟歸納的 Agent 體驗三維度：Space（連接人、事件與工具環境）、Time（串聯過去記憶、當下狀態與未來規劃）、Core（擁抱不確定性、透明與可控）。',
        example: '設計產品時可用這三個維度檢視 Agent 是否只是一個呆板的文字框。'
      },
      {
        id: '03-transparency',
        term: 'Transparency（透明度原則）',
        category: '使用者信任',
        definition: '讓使用者清楚知道「AI 正在做什麼、用了什麼工具、依據哪份資料得出結論」，以及它的能力邊界在哪。',
        example: '在畫面上顯示「已查詢訂單 API · 參考退貨政策第 3 條」。'
      },
      {
        id: '03-embrace-uncertainty',
        term: 'Embrace Uncertainty（擁抱不確定性）',
        category: '設計原則',
        definition: '承認機率模型可能遇到歧義或未知狀況，設計優雅的追問澄清、信心度提示與降級轉接機制。',
        example: '當查無明確紀錄時誠實告知並提供轉接專人選項，絕不硬編假答案。'
      }
    ],
    quiz: [
      {
        question: '在微軟的 Agent 設計原則中，「Time（時間維度）」強調 Agent 應該具備什麼能力？',
        options: [
          '把字體換成時鐘圖案',
          '回顧過去歷史脈絡、反映當下執行狀態，並協助規劃未來下一步行動',
          '故意延遲 60 秒才回答問題讓使用者覺得它在思考',
          '只能在每天中午 12 點運作'
        ],
        answerIndex: 1,
        explanation: 'Time 維度關注過去（記憶與歷史）、現在（即時反饋）與未來（主動建議與規劃）的連續體驗。'
      },
      {
        question: '當使用者的指令非常模糊、而且一旦做錯會造成金錢損失時，好的 Agent 應該怎麼做？',
        options: [
          '隨便猜一個最貴的選項直接執行',
          '擁抱不確定性，先向使用者提問澄清關鍵條件，並在執行前顯示預覽請求確認',
          '直接當機閃退不給任何訊息',
          '把錯誤推給網路問題'
        ],
        answerIndex: 1,
        explanation: '先澄清歧義並在不可逆操作前交還控制權，才能建立長久的使用者信任。'
      },
      {
        question: '恭喜即將完成第一章（啟程島）！下列哪一個「不是」提高 Agent 透明度的好做法？',
        options: [
          '顯示目前呼叫了哪一個查詢工具',
          '附上參考文件的段落連結或 Citation',
          '刻意隱藏所有資料來源並宣稱 Agent 永遠 100% 不會犯錯',
          '清楚告知使用者這個 Agent 有哪些權限與限制'
        ],
        answerIndex: 2,
        explanation: '隱藏來源與誇大準確率會讓使用者無法核實真偽，一旦出錯就會徹底失去信任。'
      }
    ],
    deepDive: [
      {
        heading: '第一章總結：從「會寫程式」到「懂設計好用的 Agent」',
        content: '恭喜你走完新手啟程島（00–03）！現在你已經知道環境怎麼無金鑰連接 Foundry、什麼場景該用 Agent、為什麼選 Microsoft Agent Framework，以及 Space / Time / Core 體驗設計原則。下一章（04–09）我們就要開始親手鍛造五大核心設計模式武器了！'
      }
    ],
    resources: [
      {
        type: 'Notebook 程式碼',
        title: '03-python-agent-framework.ipynb（設計原則實作範例）',
        url: `${REPO_BASE_URL}/blob/main/03-agentic-design-patterns/code_samples/03-python-agent-framework.ipynb`,
        note: '示範如何將設計原則落實到 Agent 指令與互動設計'
      },
      {
        type: '官方文件',
        title: 'Lesson 03 原文講義：AI Agentic Design Principles',
        url: `${REPO_BASE_URL}/blob/main/03-agentic-design-patterns/README.md`,
        note: '完整 Space / Time / Core 設計細則'
      }
    ]
  }
];
