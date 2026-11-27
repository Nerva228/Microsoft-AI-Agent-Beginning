export const REPO_BASE_URL = 'https://github.com/Nerva228/Microsoft-AI-Agent-Beginning';

export const WORLDS = [
  {
    id: 1,
    icon: '🧭',
    title: '第一章：新手啟程島（Foundations）',
    subtitle: '搞懂環境準備、AI Agent 核心三要素、主流框架與設計原則',
    lessonIds: ['00', '01', '02', '03']
  },
  {
    id: 2,
    icon: '⚒️',
    title: '第二章：核心武器鍛造廠（Design Patterns）',
    subtitle: '掌握 Tool Calling、Agentic RAG、護欄防護、Planning、Multi-Agent 與自我反思',
    lessonIds: ['04', '05', '06', '07', '08', '09']
  },
  {
    id: 3,
    icon: '🧠',
    title: '第三章：記憶、脈絡與協定（Protocols & Context）',
    subtitle: '深入 Production 觀測、MCP / A2A 協定、Context Engineering、Memory 與 MAF 編排',
    lessonIds: ['10', '11', '12', '13', '14']
  },
  {
    id: 4,
    icon: '🛡️',
    title: '第四章：規模化、本地端與資安（Scale, Local & Security）',
    subtitle: '實戰 CUA 瀏覽器自動化、Foundry 生產部署、Foundry Local 離線代理與密碼學收據',
    lessonIds: ['15', '16', '17', '18']
  }
];

export const GOAL_SHORTCUTS = [
  {
    id: 'all',
    label: '🗺️ 全部 19 課主線',
    description: '從 00 到 18 完整掌握 AI Agent 架構與實戰，隨時可自由跳關。',
    lessonIds: null
  },
  {
    id: 'starter',
    label: '🌱 零基礎入門必讀',
    description: '第一次接觸 AI Agent？先刷這 5 課建立最穩的核心觀念與術語！',
    lessonIds: ['00', '01', '02', '03', '04']
  },
  {
    id: 'rag-tools',
    label: '🔍 知識庫與 Tool 實戰',
    description: '想做能查公司內部文件、呼叫 API 的實用型企業助手，推薦這條路線。',
    lessonIds: ['04', '05', '06', '11', '12']
  },
  {
    id: 'multi-workflow',
    label: '🤝 多代理與複雜流程',
    description: '學習任務拆解、團隊協作與 Microsoft Agent Framework (MAF) 工作流編排。',
    lessonIds: ['07', '08', '09', '13', '14']
  },
  {
    id: 'local-privacy',
    label: '💻 本地離線與電腦操作',
    description: '資料機密不能上雲端，或想讓 Agent 自動操作瀏覽器？專攻這幾課。',
    lessonIds: ['04', '11', '15', '17']
  },
  {
    id: 'prod-security',
    label: '🚀 上線部署與資安防護',
    description: '從 Prototype 走向企業級 Production：評估門檻、成本路由、Smoke Test 與防竄改稽核。',
    lessonIds: ['06', '10', '16', '18']
  }
];

export const RANKS = [
  { minXp: 0, title: 'Prompt 探索見習生', emoji: '🌱' },
  { minXp: 250, title: 'Tool 鍛造學徒', emoji: '🔧' },
  { minXp: 650, title: 'Agentic RAG 尋寶師', emoji: '🔮' },
  { minXp: 1200, title: 'Multi-Agent 戰術指揮官', emoji: '⚡' },
  { minXp: 1850, title: 'Foundry 系統架構師', emoji: '🏛️' },
  { minXp: 2450, title: 'AI Agent 傳奇宗師', emoji: '👑' }
];

export const BADGES = [
  {
    id: 'first-quest',
    emoji: '🎯',
    name: '初試啼聲',
    desc: '通過任一堂課的闖關測驗',
    check: (s) => Object.values(s.lessons).some((l) => l.quizPassed)
  },
  {
    id: 'sim-explorer',
    emoji: '📡',
    name: '訊號觀測員',
    desc: '在 3 堂不同課程操作完成動態流程模擬器',
    check: (s) => Object.values(s.lessons).filter((l) => l.simDone).length >= 3
  },
  {
    id: 'architect-mind',
    emoji: '🧭',
    name: '首席架構腦',
    desc: '通過 5 題「你是 AI 架構師」情境挑戰',
    check: (s) => Object.values(s.lessons).filter((l) => l.archDone).length >= 5
  },
  {
    id: 'code-crafter',
    emoji: '🧩',
    name: '免打字拼圖王',
    desc: '解開 5 堂課的 Python / MAF 程式碼拼圖',
    check: (s) => Object.values(s.lessons).filter((l) => l.puzzleDone).length >= 5
  },
  {
    id: 'world-1-clear',
    emoji: '🏝️',
    name: '啟程島制霸',
    desc: '完成第一章（00–03）所有課程測驗',
    check: (s) => ['00', '01', '02', '03'].every((id) => s.lessons[id]?.quizPassed)
  },
  {
    id: 'rag-tool-pro',
    emoji: '🛠️',
    name: '工具與檢索達人',
    desc: '完成第 04 課 Tool Use 與第 05 課 Agentic RAG',
    check: (s) => ['04', '05'].every((id) => s.lessons[id]?.quizPassed)
  },
  {
    id: 'world-2-clear',
    emoji: '⚔️',
    name: '核心武器大師',
    desc: '完成第二章（04–09）所有設計模式課程',
    check: (s) => ['04', '05', '06', '07', '08', '09'].every((id) => s.lessons[id]?.quizPassed)
  },
  {
    id: 'protocol-pioneer',
    emoji: '🔌',
    name: '協定先行者',
    desc: '完成第 11 課 MCP / A2A / NLWeb 通訊協定',
    check: (s) => Boolean(s.lessons['11']?.quizPassed)
  },
  {
    id: 'world-3-clear',
    emoji: '🧠',
    name: '脈絡與記憶領航員',
    desc: '完成第三章（10–14）所有課程測驗',
    check: (s) => ['10', '11', '12', '13', '14'].every((id) => s.lessons[id]?.quizPassed)
  },
  {
    id: 'local-champion',
    emoji: '💻',
    name: '離線隱私守護者',
    desc: '完成第 17 課 Foundry Local 本地端 AI Agent',
    check: (s) => Boolean(s.lessons['17']?.quizPassed)
  },
  {
    id: 'security-shield',
    emoji: '🔐',
    name: '密碼學稽核官',
    desc: '完成第 06 課可信賴代理與第 18 課密碼學收據安全',
    check: (s) => ['06', '18'].every((id) => s.lessons[id]?.quizPassed)
  },
  {
    id: 'all-19-master',
    emoji: '🏆',
    name: '全課程大滿貫',
    desc: '通過 00–18 全部 19 堂課測驗！',
    check: (s) =>
      [
        '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
        '10', '11', '12', '13', '14', '15', '16', '17', '18'
      ].every((id) => s.lessons[id]?.quizPassed)
  }
];
