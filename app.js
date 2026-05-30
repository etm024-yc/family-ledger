const STORAGE_KEY = "family-ledger-state-v1";
const USER_KEY = "family-ledger-current-user-v1";
const VIEW_KEY = "family-ledger-active-view-v1";
const SYNC_URL_KEY = "family-ledger-sync-url-v1";
const SYNC_TOKEN_KEY = "family-ledger-sync-token-v1";
const SYNC_AUTO_KEY = "family-ledger-sync-auto-v1";
const SYNC_LAST_KEY = "family-ledger-sync-last-v1";
const GUIDE_TODAY_KEY = "family-ledger-guide-hidden-date-v1";
const GUIDE_DONE_KEY = "family-ledger-guide-dismissed-version-v1";
const SYNC_DEBOUNCE_MS = 1500;
const SYNC_PULL_INTERVAL_MS = 5 * 60 * 1000;
const SYNC_RECENT_PULL_MS = 45 * 1000;
const SYNC_INPUT_WAIT_MS = 700;
const APP_RELEASE_VERSION = "v3";
const GUIDEBOOK_VERSION = "v3-guide-20260530";
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const crc32Table = createCrc32Table();
const viewIds = ["calendarView", "entryView", "analysisView", "settingsView"];
const LOCAL_CURRENCY_PAYMENT = "지역화폐";
const LOCAL_CURRENCY_DEFAULT_RATE = 10;

const defaultExpenseCategories = {
  "식비": ["외식", "간식", "카페", "배달", "픽업"],
  "주거/통신": ["관리비", "공과금", "통신비(인터넷, 티비 포함)"],
  "생활": ["가구/가전", "주방/욕실", "잡화", "미용", "의류", "세탁"],
  "건강/문화": ["병원", "운동", "보험", "문화생활", "여행", "도서"],
  "교육/육아": ["등록금", "학원", "교재비", "육아용품"],
  "교통/차량": ["대중교통", "주유", "세차", "자동차보험", "차량용품"],
  "경조사비": ["경조사비", "모임회비", "선물"],
  "세금/이자": ["주담대", "신용대출", "양도소득세", "연말정산"],
  "용돈": ["경진", "영철", "부모님"],
  "저축": ["적금", "예금", "투자"],
  "기타": ["기타"]
};

const defaultIncomeCategories = {
  "급여": ["월급", "상여", "수당"],
  "금융": ["이자", "배당", "투자수익"],
  "지원/환급": ["환급", "지원금", "용돈"],
  "기타": ["기타"]
};

const defaultCards = [
  { id: makeId(), name: "삼성카드", billingStartDay: 13, paymentDay: 25 },
  { id: makeId(), name: "하나카드", billingStartDay: 13, paymentDay: 28 },
  { id: makeId(), name: "신한카드", billingStartDay: 13, paymentDay: 27 },
  { id: makeId(), name: "국민카드", billingStartDay: 13, paymentDay: 26 },
  { id: makeId(), name: "현대카드", billingStartDay: 13, paymentDay: 25 }
];

const defaultTemplates = [
  {
    id: makeId(),
    type: "expense",
    major: "교통/차량",
    minor: "대중교통",
    amount: 1650,
    memo: "일반 버스",
    info: "교통카드"
  },
  {
    id: makeId(),
    type: "expense",
    major: "교통/차량",
    minor: "대중교통",
    amount: 3200,
    memo: "광역 버스",
    info: "교통카드"
  }
];

const palette = ["#217c57", "#c94343", "#2868c7", "#8a5a27", "#d8a51d", "#6f5bc7", "#008891", "#c15b8a"];
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
const defaultBudgetBuckets = ["생활비", "식비", "경진용돈", "영철용돈", "경조사비"];
const defaultUsers = ["영철", "경진"];
const legacyUserMap = {
  "나": "영철",
  "와이프": "경진"
};
const holidayData = {
  2025: [
    ["2025-01-28", "설날 연휴"],
    ["2025-01-29", "설날"],
    ["2025-01-30", "설날 연휴"],
    ["2025-03-03", "대체공휴일(삼일절)"],
    ["2025-05-05", "부처님오신날"],
    ["2025-05-06", "대체공휴일"],
    ["2025-10-05", "추석 연휴"],
    ["2025-10-06", "추석"],
    ["2025-10-07", "추석 연휴"],
    ["2025-10-08", "대체공휴일(추석)"]
  ],
  2026: [
    ["2026-02-16", "설날 연휴"],
    ["2026-02-17", "설날"],
    ["2026-02-18", "설날 연휴"],
    ["2026-03-02", "대체공휴일(삼일절)"],
    ["2026-05-24", "부처님오신날"],
    ["2026-05-25", "대체공휴일(부처님오신날)"],
    ["2026-06-03", "전국동시지방선거"],
    ["2026-08-17", "대체공휴일(광복절)"],
    ["2026-09-24", "추석 연휴"],
    ["2026-09-25", "추석"],
    ["2026-09-26", "추석 연휴"],
    ["2026-10-05", "대체공휴일(개천절)"]
  ],
  2027: [
    ["2027-02-06", "설날 연휴"],
    ["2027-02-07", "설날"],
    ["2027-02-08", "설날 연휴"],
    ["2027-02-09", "대체공휴일(설날)"],
    ["2027-05-13", "부처님오신날"],
    ["2027-08-16", "대체공휴일(광복절)"],
    ["2027-09-14", "추석 연휴"],
    ["2027-09-15", "추석"],
    ["2027-09-16", "추석 연휴"],
    ["2027-10-04", "대체공휴일(개천절)"],
    ["2027-10-11", "대체공휴일(한글날)"],
    ["2027-12-27", "대체공휴일(성탄절)"]
  ],
  2028: [
    ["2028-01-26", "설날 연휴"],
    ["2028-01-27", "설날"],
    ["2028-01-28", "설날 연휴"],
    ["2028-05-02", "부처님오신날"],
    ["2028-10-02", "추석 연휴"],
    ["2028-10-03", "추석"],
    ["2028-10-04", "추석 연휴"],
    ["2028-10-05", "대체공휴일"]
  ],
  2029: [
    ["2029-02-12", "설날 연휴"],
    ["2029-02-13", "설날"],
    ["2029-02-14", "설날 연휴"],
    ["2029-05-20", "부처님오신날"],
    ["2029-05-21", "대체공휴일(부처님오신날)"],
    ["2029-09-21", "추석 연휴"],
    ["2029-09-22", "추석"],
    ["2029-09-23", "추석 연휴"],
    ["2029-09-24", "대체공휴일(추석)"]
  ],
  2030: [
    ["2030-02-02", "설날 연휴"],
    ["2030-02-03", "설날"],
    ["2030-02-04", "설날 연휴"],
    ["2030-02-05", "대체공휴일(설날)"],
    ["2030-05-06", "대체공휴일(어린이날)"],
    ["2030-05-09", "부처님오신날"],
    ["2030-09-11", "추석 연휴"],
    ["2030-09-12", "추석"],
    ["2030-09-13", "추석 연휴"]
  ],
  2031: [
    ["2031-01-22", "설날 연휴"],
    ["2031-01-23", "설날"],
    ["2031-01-24", "설날 연휴"],
    ["2031-03-03", "대체공휴일(삼일절)"],
    ["2031-05-28", "부처님오신날"],
    ["2031-09-30", "추석 연휴"],
    ["2031-10-01", "추석"],
    ["2031-10-02", "추석 연휴"]
  ]
};
const typeLabels = {
  expense: "지출",
  income: "수입",
  "fixed-expense": "고정 지출",
  "fixed-income": "고정 수입",
  "card-payment": "카드 대금"
};

let currentUser = loadCurrentUser();
let state = loadState();
currentUser = ensureCurrentUser(currentUser);
let selectedDate = new Date();
let selectedYear = selectedDate.getFullYear();
let selectedMonth = selectedDate.getMonth();
let entryType = "expense";
let fixedType = "fixed-expense";
let pendingTemplate = null;
let editingTemplateId = "";
let syncTimer = null;
let isApplyingRemote = false;
let activeSettingsList = null;
let deleteConfirmResolve = null;
let guideStepIndex = 0;
let activeGuideTarget = null;
let activeGuideSteps = [];
let backgroundPullPromise = null;
let inputSyncQueue = Promise.resolve();
let lastSuccessfulPullAt = 0;

const els = {
  yearSelect: document.querySelector("#yearSelect"),
  monthSelect: document.querySelector("#monthSelect"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth"),
  missingBudgetButton: document.querySelector("#missingBudgetButton"),
  currentGuideButton: document.querySelector("#currentGuideButton"),
  searchButton: document.querySelector("#searchButton"),
  calendarGrid: document.querySelector("#calendarGrid"),
  templatePickBanner: document.querySelector("#templatePickBanner"),
  templatePickTitle: document.querySelector("#templatePickTitle"),
  templatePickText: document.querySelector("#templatePickText"),
  cancelTemplatePick: document.querySelector("#cancelTemplatePick"),
  monthIncome: document.querySelector("#monthIncome"),
  monthExpense: document.querySelector("#monthExpense"),
  monthBalance: document.querySelector("#monthBalance"),
  views: document.querySelectorAll(".view"),
  navButtons: document.querySelectorAll(".nav-button"),
  entryForm: document.querySelector("#entryForm"),
  editingEntryId: document.querySelector("#editingEntryId"),
  entryDate: document.querySelector("#entryDate"),
  entryAmount: document.querySelector("#entryAmount"),
  entryMemo: document.querySelector("#entryMemo"),
  entryInfo: document.querySelector("#entryInfo"),
  entryBudget: document.querySelector("#entryBudget"),
  majorCategory: document.querySelector("#majorCategory"),
  minorCategory: document.querySelector("#minorCategory"),
  resetEntry: document.querySelector("#resetEntry"),
  saveTemplate: document.querySelector("#saveTemplate"),
  quickTemplateButton: document.querySelector("#quickTemplateButton"),
  templateList: document.querySelector("#templateList"),
  quickTemplateModal: document.querySelector("#quickTemplateModal"),
  quickTemplateList: document.querySelector("#quickTemplateList"),
  closeQuickTemplateModal: document.querySelector("#closeQuickTemplateModal"),
  settingsListModal: document.querySelector("#settingsListModal"),
  settingsListTitle: document.querySelector("#settingsListTitle"),
  settingsListContent: document.querySelector("#settingsListContent"),
  closeSettingsListModal: document.querySelector("#closeSettingsListModal"),
  searchModal: document.querySelector("#searchModal"),
  searchInput: document.querySelector("#searchInput"),
  searchResults: document.querySelector("#searchResults"),
  closeSearchModal: document.querySelector("#closeSearchModal"),
  analysisDetailModal: document.querySelector("#analysisDetailModal"),
  analysisDetailTitle: document.querySelector("#analysisDetailTitle"),
  analysisDetailContent: document.querySelector("#analysisDetailContent"),
  closeAnalysisDetailModal: document.querySelector("#closeAnalysisDetailModal"),
  guideModal: document.querySelector("#guideModal"),
  guideNo: document.querySelector("#guideNo"),
  guideYes: document.querySelector("#guideYes"),
  guideDisable: document.querySelector("#guideDisable"),
  guideTour: document.querySelector("#guideTour"),
  guideTourHighlight: document.querySelector("#guideTourHighlight"),
  guideTourArrow: document.querySelector("#guideTourArrow"),
  guideTourCard: document.querySelector("#guideTourCard"),
  guideTourStep: document.querySelector("#guideTourStep"),
  guideTourTitle: document.querySelector("#guideTourTitle"),
  guideTourText: document.querySelector("#guideTourText"),
  guideTourPrev: document.querySelector("#guideTourPrev"),
  guideTourNext: document.querySelector("#guideTourNext"),
  guideTourExit: document.querySelector("#guideTourExit"),
  deleteConfirmModal: document.querySelector("#deleteConfirmModal"),
  deleteConfirmMessage: document.querySelector("#deleteConfirmMessage"),
  cancelDeleteConfirm: document.querySelector("#cancelDeleteConfirm"),
  confirmDeleteConfirm: document.querySelector("#confirmDeleteConfirm"),
  entryModal: document.querySelector("#entryModal"),
  modalForm: document.querySelector("#modalForm"),
  modalUserMeta: document.querySelector("#modalUserMeta"),
  modalBody: document.querySelector("#modalBody"),
  dayModal: document.querySelector("#dayModal"),
  dayModalTitle: document.querySelector("#dayModalTitle"),
  dayModalList: document.querySelector("#dayModalList"),
  dayModalAdd: document.querySelector("#dayModalAdd"),
  closeDayModal: document.querySelector("#closeDayModal"),
  closeDayModalFooter: document.querySelector("#closeDayModalFooter"),
  analysisMonthLabel: document.querySelector("#analysisMonthLabel"),
  aiAnalysisButton: document.querySelector("#aiAnalysisButton"),
  monthlyReportButton: document.querySelector("#monthlyReportButton"),
  aiAnalysisPanel: document.querySelector("#aiAnalysisPanel"),
  aiAnalysisContent: document.querySelector("#aiAnalysisContent"),
  majorChart: document.querySelector("#majorChart"),
  majorLegend: document.querySelector("#majorLegend"),
  minorChart: document.querySelector("#minorChart"),
  minorLegend: document.querySelector("#minorLegend"),
  cardPaymentGrandTotal: document.querySelector("#cardPaymentGrandTotal"),
  cardTotalList: document.querySelector("#cardTotalList"),
  expenseDelta: document.querySelector("#expenseDelta"),
  incomeDelta: document.querySelector("#incomeDelta"),
  localCurrencyAnalysisBalance: document.querySelector("#localCurrencyAnalysisBalance"),
  localCurrencyAnalysisSpent: document.querySelector("#localCurrencyAnalysisSpent"),
  localCurrencyAnalysisCharge: document.querySelector("#localCurrencyAnalysisCharge"),
  localCurrencyAnalysisBonus: document.querySelector("#localCurrencyAnalysisBonus"),
  localCurrencyAnalysisSupport: document.querySelector("#localCurrencyAnalysisSupport"),
  budgetAnalysisRange: document.querySelector("#budgetAnalysisRange"),
  budgetAnalysisList: document.querySelector("#budgetAnalysisList"),
  fixedForm: document.querySelector("#fixedForm"),
  fixedEditingId: document.querySelector("#fixedEditingId"),
  fixedDate: document.querySelector("#fixedDate"),
  fixedMajorCategory: document.querySelector("#fixedMajorCategory"),
  fixedMinorCategory: document.querySelector("#fixedMinorCategory"),
  fixedAmount: document.querySelector("#fixedAmount"),
  fixedInfo: document.querySelector("#fixedInfo"),
  fixedBudget: document.querySelector("#fixedBudget"),
  fixedMemo: document.querySelector("#fixedMemo"),
  fixedRepeatUnit: document.querySelector("#fixedRepeatUnit"),
  fixedRepeatInterval: document.querySelector("#fixedRepeatInterval"),
  fixedHolidayRule: document.querySelector("#fixedHolidayRule"),
  resetFixed: document.querySelector("#resetFixed"),
  fixedList: document.querySelector("#fixedList"),
  budgetBucketForm: document.querySelector("#budgetBucketForm"),
  budgetBucketName: document.querySelector("#budgetBucketName"),
  monthlyBudgetForm: document.querySelector("#monthlyBudgetForm"),
  monthlyBudgetList: document.querySelector("#monthlyBudgetList"),
  budgetMonthCaption: document.querySelector("#budgetMonthCaption"),
  localCurrencyBalance: document.querySelector("#localCurrencyBalance"),
  localCurrencyInitial: document.querySelector("#localCurrencyInitial"),
  localCurrencyBonusRate: document.querySelector("#localCurrencyBonusRate"),
  localCurrencySettingsForm: document.querySelector("#localCurrencySettingsForm"),
  localCurrencyTransactionForm: document.querySelector("#localCurrencyTransactionForm"),
  localCurrencyDate: document.querySelector("#localCurrencyDate"),
  localCurrencyKind: document.querySelector("#localCurrencyKind"),
  localCurrencyAmount: document.querySelector("#localCurrencyAmount"),
  localCurrencyMemo: document.querySelector("#localCurrencyMemo"),
  localCurrencyList: document.querySelector("#localCurrencyList"),
  userPanelCurrent: document.querySelector("#userPanelCurrent"),
  currentUser: document.querySelector("#currentUser"),
  saveCurrentUser: document.querySelector("#saveCurrentUser"),
  userForm: document.querySelector("#userForm"),
  editingUserName: document.querySelector("#editingUserName"),
  userNameInput: document.querySelector("#userNameInput"),
  saveUser: document.querySelector("#saveUser"),
  resetUser: document.querySelector("#resetUser"),
  userList: document.querySelector("#userList"),
  cardForm: document.querySelector("#cardForm"),
  cardNameInput: document.querySelector("#cardNameInput"),
  cardStartDay: document.querySelector("#cardStartDay"),
  cardPaymentDay: document.querySelector("#cardPaymentDay"),
  cardSettings: document.querySelector("#cardSettings"),
  expenseCategoryForm: document.querySelector("#expenseCategoryForm"),
  expenseMajor: document.querySelector("#expenseMajor"),
  expenseMinor: document.querySelector("#expenseMinor"),
  expenseMajorOptions: document.querySelector("#expenseMajorOptions"),
  expenseMinorOptions: document.querySelector("#expenseMinorOptions"),
  expenseCategoryTree: document.querySelector("#expenseCategoryTree"),
  incomeCategoryForm: document.querySelector("#incomeCategoryForm"),
  incomeMajor: document.querySelector("#incomeMajor"),
  incomeMinor: document.querySelector("#incomeMinor"),
  incomeMajorOptions: document.querySelector("#incomeMajorOptions"),
  incomeMinorOptions: document.querySelector("#incomeMinorOptions"),
  expenseMajorSuggest: document.querySelector("#expenseMajorSuggest"),
  expenseMinorSuggest: document.querySelector("#expenseMinorSuggest"),
  incomeMajorSuggest: document.querySelector("#incomeMajorSuggest"),
  incomeMinorSuggest: document.querySelector("#incomeMinorSuggest"),
  incomeCategoryTree: document.querySelector("#incomeCategoryTree"),
  categoryModal: document.querySelector("#categoryModal"),
  quickCategoryForm: document.querySelector("#quickCategoryForm"),
  quickCategoryType: document.querySelector("#quickCategoryType"),
  quickMajor: document.querySelector("#quickMajor"),
  quickMinor: document.querySelector("#quickMinor"),
  exportData: document.querySelector("#exportData"),
  exportExcel: document.querySelector("#exportExcel"),
  importData: document.querySelector("#importData"),
  syncUrl: document.querySelector("#syncUrl"),
  syncToken: document.querySelector("#syncToken"),
  syncAuto: document.querySelector("#syncAuto"),
  saveSyncConfig: document.querySelector("#saveSyncConfig"),
  syncNow: document.querySelector("#syncNow"),
  syncPull: document.querySelector("#syncPull"),
  syncPush: document.querySelector("#syncPush"),
  syncStatus: document.querySelector("#syncStatus"),
  syncLastSync: document.querySelector("#syncLastSync")
};

const guideSteps = [
  {
    view: "calendarView",
    selector: ".month-picker",
    title: "달력: 월 이동",
    text: "상단의 이전/다음 버튼으로 달을 바꾸고, 연도와 월을 직접 선택할 수 있습니다."
  },
  {
    view: "calendarView",
    selector: ".summary-strip",
    title: "달력: 월 합계",
    text: "선택한 달의 지출과 수입 합계가 바로 보입니다. 미지정 버튼을 누르면 예산 항목이 비어 있는 지출만 모아볼 수 있습니다."
  },
  {
    view: "calendarView",
    selector: "#searchButton",
    title: "공통: 검색",
    text: "메모, 정보, 카테고리, 금액으로 입력 내역을 찾아 바로 수정할 수 있습니다."
  },
  {
    view: "calendarView",
    selector: "#calendarGrid",
    title: "달력: 날짜 칸",
    text: "날짜 칸을 누르면 그날 내역 목록이 뜹니다. 목록에서 일반 내역을 누르면 수정 화면으로 들어갑니다."
  },
  {
    view: "calendarView",
    selector: ".bottom-nav",
    title: "하단 메뉴",
    text: "달력, 입력, 분석, 설정은 하단 메뉴에서 이동합니다. 한 손으로 누르기 쉽게 아래에 고정했습니다."
  },
  {
    view: "entryView",
    selector: "#quickTemplateButton",
    title: "입력: 퀵 입력",
    text: "자주 쓰는 버스, 카페, 식비 같은 내역은 퀵 입력에서 날짜만 골라 빠르게 넣을 수 있습니다."
  },
  {
    view: "entryView",
    selector: "#entryForm .segmented",
    title: "입력: 지출/수입 선택",
    text: "지출과 수입 중 하나를 먼저 선택하면 그에 맞는 카테고리 목록이 바뀝니다."
  },
  {
    view: "entryView",
    selector: "#entryForm",
    title: "입력: 내역 작성",
    text: "날짜, 분류, 금액, 정보, 예산 항목, 메모를 입력합니다. 정보에는 카드, 현금, 계좌이체, 지역화폐 등이 들어갑니다."
  },
  {
    view: "entryView",
    selector: "#saveTemplate",
    title: "입력: 퀵 입력 저장",
    text: "현재 입력한 내용을 퀵 입력으로 저장합니다. 퀵 입력은 현재 선택된 사용자별로 따로 저장됩니다."
  },
  {
    view: "analysisView",
    selector: ".delta-panel",
    title: "분석: 이전 달 대비",
    text: "이번 달 지출과 수입이 이전 달보다 얼마나 늘었는지 가장 먼저 확인합니다."
  },
  {
    view: "analysisView",
    selector: "#aiAnalysisButton",
    title: "분석: AI 분석",
    text: "외부 API 없이 입력된 내역을 기기 안에서 집계해 소비 패턴, 예산 위험, 절약 포인트를 정리합니다."
  },
  {
    view: "analysisView",
    selector: "#monthlyReportButton",
    title: "분석: 월별 리포트 저장",
    text: "현재 보고 있는 달의 지출, 전월 대비, 예산 현황, 다음 달 소비 추천을 PDF로 저장합니다."
  },
  {
    view: "analysisView",
    selector: ".analysis-pair",
    title: "분석: 소비 카테고리",
    text: "원형 그래프 아래 카테고리 금액을 누르면 해당 월의 상세 사용 내역이 열립니다."
  },
  {
    view: "analysisView",
    selector: "#cardTotalList",
    title: "분석: 카드 결제 대금",
    text: "현재 사용자 소유 카드만 보입니다. 특정 카드를 누르면 그 결제 대금에 포함된 사용 내역을 볼 수 있습니다."
  },
  {
    view: "analysisView",
    selector: ".local-currency-analysis-panel",
    title: "분석: 지역화폐",
    text: "지역화폐 잔액, 사용, 충전, 보너스, 지원금을 확인합니다. 영역을 누르면 사용과 충전 내역을 함께 볼 수 있습니다."
  },
  {
    view: "analysisView",
    selector: "#budgetAnalysisList",
    title: "분석: 예산 항목",
    text: "생활비, 식비, 용돈처럼 배정한 돈이 얼마나 남았는지 봅니다. 항목을 누르면 그 예산으로 쓴 내역이 열립니다."
  },
  {
    view: "settingsView",
    selector: ".fixed-settings-panel .settings-folder-head",
    title: "설정: 목록과 추가",
    text: "각 설정은 목록 버튼으로 저장된 항목을 보고, 추가 버튼으로 새 항목을 입력합니다."
  },
  {
    view: "settingsView",
    selector: ".user-settings-panel .settings-folder-head",
    title: "설정: 사용자",
    text: "영철, 경진처럼 입력자를 고릅니다. 카드와 퀵 입력, 지역화폐는 선택한 사용자 기준으로 따로 관리됩니다."
  },
  {
    view: "settingsView",
    selector: ".sync-panel .settings-folder-head",
    title: "설정: 동기화",
    text: "공유 사용을 위해 동기화 URL과 비밀번호를 저장합니다. 앱 시작 시, 입력 시, 앱을 닫을 때, 5분마다 새 데이터를 확인합니다."
  },
  {
    view: "settingsView",
    selector: ".data-panel .settings-folder-head",
    title: "설정: 백업",
    text: "데이터 관리는 JSON 백업과 엑셀 내보내기를 담당합니다. 배포 전후로 백업해두면 안전합니다."
  }
];

init();

function init() {
  setupMonthSelectors();
  bindEvents();
  resetEntryForm(toDateKey(new Date()));
  resetFixedForm();
  resetCardForm();
  resetLocalCurrencyForm();
  renderAll();
  setupSettingsFolders();
  showView(loadActiveView(), { skipStore: true });
  registerServiceWorker();
  syncOnStart();
  setInterval(() => queueBackgroundPull("periodic"), SYNC_PULL_INTERVAL_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      queueBackgroundPull("exit");
    } else {
      queueBackgroundPull("resume");
    }
  });
  window.addEventListener("pagehide", () => queueBackgroundPull("exit"));
  setTimeout(showGuideOnLaunch, 500);
}

function loadState() {
  const fallback = normalizeState({});
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return fallback;

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return fallback;
  }
}

function loadCurrentUser() {
  const saved = canonicalUser(localStorage.getItem(USER_KEY));
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const userList = normalizeUsers(raw.users);
    return userList.includes(saved) ? saved : userList[0];
  } catch {
    return defaultUsers.includes(saved) ? saved : defaultUsers[0];
  }
}

function normalizeState(raw) {
  const normalizedUsers = normalizeUsers(raw.users);
  const normalizedBudgetBuckets = normalizeBudgetBuckets(raw.budgetBuckets, raw.monthlyBudgets, raw.entries, raw.templates);
  const normalizedCards = raw.cards?.length
    ? normalizePrimaryCards(raw.cards.map((card) => normalizeCard(card, normalizedUsers)))
    : normalizePrimaryCards(clone(defaultCards).map((card) => normalizeCard(card, normalizedUsers)));
  return {
    users: normalizedUsers,
    budgetBuckets: normalizedBudgetBuckets,
    categories: normalizeCategories(raw.categories),
    entries: (raw.entries || []).map((entry) => normalizeEntry(entry, normalizedUsers, normalizedBudgetBuckets)).filter(Boolean),
    cards: normalizedCards,
    templates: raw.templates?.length ? raw.templates.map((template) => normalizeTemplate(template, normalizedUsers, normalizedBudgetBuckets)) : clone(defaultTemplates).map((template) => normalizeTemplate(template, normalizedUsers, normalizedBudgetBuckets)),
    monthlyBudgets: normalizeMonthlyBudgets(raw.monthlyBudgets, normalizedBudgetBuckets),
    localCurrency: normalizeLocalCurrency(raw.localCurrency, normalizedUsers),
    updatedAt: raw.updatedAt || ""
  };
}

function normalizeUsers(rawUsers) {
  const source = Array.isArray(rawUsers) && rawUsers.length ? rawUsers : defaultUsers;
  const normalized = unique(source.map(canonicalUser).map((user) => String(user || "").trim()).filter(Boolean));
  return normalized.length ? normalized : [...defaultUsers];
}

function normalizeCategories(categories = {}) {
  const isNested = categories.expense || categories.income;
  const expenseSource = isNested ? categories.expense : categories;
  return {
    expense: mergeCategoryMaps(defaultExpenseCategories, expenseSource || {}),
    income: mergeCategoryMaps(defaultIncomeCategories, categories.income || {})
  };
}

function mergeCategoryMaps(base, extra) {
  const merged = clone(base);
  Object.entries(extra || {}).forEach(([major, minors]) => {
    if (!major || !Array.isArray(minors)) return;
    merged[major] = unique([...(merged[major] || []), ...minors.filter(Boolean)]);
  });
  return merged;
}

function normalizeBudgetBuckets(rawBuckets, monthlyBudgets = {}, entries = [], templates = []) {
  if (Array.isArray(rawBuckets)) {
    return unique(rawBuckets.map((bucket) => String(bucket || "").trim()).filter(Boolean));
  }

  const discovered = [];
  Object.values(monthlyBudgets || {}).forEach((values) => {
    discovered.push(...Object.keys(values || {}));
  });
  [...(entries || []), ...(templates || [])].forEach((item) => {
    if (item?.budget) discovered.push(item.budget);
  });
  return unique([...defaultBudgetBuckets, ...discovered].map((bucket) => String(bucket || "").trim()).filter(Boolean));
}

function normalizeEntry(entry, userList = getUsers(), bucketList = getBudgetBuckets()) {
  if (!entry || !entry.date) return null;
  const type = entry.type === "fixed" ? "fixed-expense" : entry.type;
  const owner = normalizeOwner(entry.owner, userList);
  const createdBy = normalizeOwner(entry.createdBy || entry.owner, userList);
  return {
    ...entry,
    id: entry.id || makeId(),
    type,
    owner,
    createdBy,
    modifiedBy: entry.modifiedBy ? normalizeOwner(entry.modifiedBy, userList) : "",
    budget: bucketList.includes(entry.budget) ? entry.budget : "",
    startDate: type.startsWith("fixed-") ? entry.startDate || entry.date : entry.startDate,
    excludedMonths: type.startsWith("fixed-") ? normalizeExcludedMonths(entry.excludedMonths) : undefined
  };
}

function normalizeExcludedMonths(months) {
  if (!Array.isArray(months)) return [];
  return unique(months.map((value) => String(value || "").trim()).filter((value) => /^\d{4}-\d{2}$/.test(value)));
}

function normalizeTemplate(template, userList = getUsers(), bucketList = getBudgetBuckets()) {
  const normalizedType = template.type === "income" || template.type === "fixed-income" ? "income" : "expense";
  return {
    ...template,
    id: template.id || makeId(),
    owner: normalizeOwner(template.owner, userList),
    budget: bucketList.includes(template.budget) ? template.budget : "",
    type: normalizedType
  };
}

function normalizeMonthlyBudgets(monthlyBudgets = {}, bucketList = getBudgetBuckets()) {
  const normalized = {};
  Object.entries(monthlyBudgets || {}).forEach(([month, values]) => {
    normalized[month] = {};
    bucketList.forEach((bucket) => {
      normalized[month][bucket] = Number(values?.[bucket] || 0);
    });
  });
  return normalized;
}

function normalizeLocalCurrency(raw = {}, userList = getUsers()) {
  const settings = {};
  userList.forEach((user) => {
    const userSettings = raw.settings?.[user] || {};
    settings[user] = {
      initialBalance: Number(userSettings.initialBalance ?? raw.initialBalances?.[user] ?? 0),
      bonusRate: Number(userSettings.bonusRate ?? raw.bonusRate ?? LOCAL_CURRENCY_DEFAULT_RATE)
    };
  });

  const transactions = (raw.transactions || [])
    .map((item) => normalizeLocalCurrencyTransaction(item, userList))
    .filter(Boolean);

  return { settings, transactions };
}

function normalizeLocalCurrencyTransaction(item, userList = getUsers()) {
  if (!item || !item.date) return null;
  const kind = ["charge", "support"].includes(item.kind) ? item.kind : "charge";
  const amount = Number(item.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return {
    id: item.id || makeId(),
    owner: normalizeOwner(item.owner, userList),
    date: item.date,
    kind,
    amount,
    bonus: Number(item.bonus || 0),
    memo: item.memo || "",
    createdAt: item.createdAt || new Date().toISOString()
  };
}

function normalizeCard(card, userList = getUsers()) {
  return {
    id: card.id || makeId(),
    name: card.name || "새 카드",
    owner: normalizeOwner(card.owner, userList),
    billingStartDay: clampDay(card.billingStartDay || 1),
    paymentDay: clampDay(card.paymentDay || 25),
    primary: Boolean(card.primary)
  };
}

function normalizePrimaryCards(cards) {
  const seen = new Set();
  return cards.map((card) => {
    if (!card.primary) return card;
    if (seen.has(card.owner)) return { ...card, primary: false };
    seen.add(card.owner);
    return card;
  });
}

function canonicalUser(user) {
  return legacyUserMap[user] || user;
}

function getUsers() {
  return state?.users?.length ? state.users : defaultUsers;
}

function getBudgetBuckets() {
  return state?.budgetBuckets || defaultBudgetBuckets;
}

function getLocalCurrencySettings(owner = currentUser) {
  if (!state.localCurrency) state.localCurrency = normalizeLocalCurrency({}, getUsers());
  if (!state.localCurrency.settings) state.localCurrency.settings = {};
  if (!state.localCurrency.settings[owner]) {
    state.localCurrency.settings[owner] = { initialBalance: 0, bonusRate: LOCAL_CURRENCY_DEFAULT_RATE };
  }
  return state.localCurrency.settings[owner];
}

function normalizeOwner(owner, userList = getUsers()) {
  const normalized = canonicalUser(owner);
  if (userList.includes(normalized)) return normalized;
  const current = canonicalUser(currentUser);
  return userList.includes(current) ? current : userList[0];
}

function withNewEntryMetadata(payload) {
  const owner = payload.owner || currentUser;
  return {
    ...payload,
    id: makeId(),
    owner,
    createdBy: currentUser,
    createdAt: new Date().toISOString()
  };
}

function withEditedEntryMetadata(entry, payload) {
  const owner = entry.owner || payload.owner || currentUser;
  return {
    ...entry,
    ...payload,
    id: entry.id,
    owner,
    createdBy: entry.createdBy || owner,
    modifiedBy: currentUser,
    modifiedAt: new Date().toISOString()
  };
}

function ensureCurrentUser(user) {
  const normalized = canonicalUser(user);
  return getUsers().includes(normalized) ? normalized : getUsers()[0];
}

function saveState(options = {}) {
  if (options.touch !== false) state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!options.skipSync) scheduleSyncPush();
}

function bindEvents() {
  els.prevMonth.addEventListener("click", () => moveMonth(-1));
  els.nextMonth.addEventListener("click", () => moveMonth(1));
  els.yearSelect.addEventListener("change", () => {
    selectedYear = Number(els.yearSelect.value);
    renderAll();
  });
  els.monthSelect.addEventListener("change", () => {
    selectedMonth = Number(els.monthSelect.value);
    renderAll();
  });

  els.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.view === "entryView") {
        resetEntryForm(toDateKey(new Date()));
        queueBackgroundPull("entry");
      }
      showView(button.dataset.view);
    });
  });

  document.querySelectorAll("[data-entry-type]").forEach((button) => {
    button.addEventListener("click", () => setEntryType(button.dataset.entryType));
  });
  document.querySelectorAll("[data-fixed-type]").forEach((button) => {
    button.addEventListener("click", () => setFixedType(button.dataset.fixedType));
  });

  els.majorCategory.addEventListener("change", () => populateMinorSelect());
  els.fixedMajorCategory.addEventListener("change", () => populateFixedMinorSelect());
  els.fixedRepeatUnit.addEventListener("change", populateFixedRepeatInterval);
  els.entryForm.addEventListener("submit", handleEntrySubmit);
  els.fixedForm.addEventListener("submit", handleFixedSubmit);
  els.budgetBucketForm.addEventListener("submit", handleBudgetBucketSubmit);
  els.monthlyBudgetForm.addEventListener("submit", handleMonthlyBudgetSubmit);
  els.localCurrencySettingsForm.addEventListener("submit", handleLocalCurrencySettingsSubmit);
  els.localCurrencyTransactionForm.addEventListener("submit", handleLocalCurrencyTransactionSubmit);
  els.currentUser.addEventListener("change", () => {
    currentUser = els.currentUser.value;
    renderAll();
  });
  els.saveCurrentUser.addEventListener("click", saveCurrentUser);
  els.userForm.addEventListener("submit", handleUserSubmit);
  els.resetUser.addEventListener("click", resetUserForm);
  els.cardForm.addEventListener("submit", handleCardSubmit);
  els.resetEntry.addEventListener("click", () => resetEntryForm());
  els.resetFixed.addEventListener("click", () => resetFixedForm());
  els.saveTemplate.addEventListener("click", saveCurrentTemplate);
  els.quickTemplateButton.addEventListener("click", openQuickTemplateModal);
  els.aiAnalysisButton?.addEventListener("click", toggleAiAnalysis);
  els.monthlyReportButton?.addEventListener("click", exportMonthlyReportPdf);
  els.closeQuickTemplateModal.addEventListener("click", () => els.quickTemplateModal.close());
  els.closeSettingsListModal.addEventListener("click", () => els.settingsListModal.close());
  els.settingsListModal.addEventListener("close", restoreSettingsListModal);
  els.searchButton?.addEventListener("click", openSearchModal);
  els.closeSearchModal?.addEventListener("click", () => els.searchModal.close());
  els.searchInput?.addEventListener("input", renderSearchResults);
  els.closeAnalysisDetailModal.addEventListener("click", () => els.analysisDetailModal.close());
  els.guideNo?.addEventListener("click", () => els.guideModal.close());
  els.guideDisable?.addEventListener("click", disableGuideOnLaunch);
  els.guideYes?.addEventListener("click", () => startGuideTour());
  els.currentGuideButton?.addEventListener("click", () => startGuideTour(getActiveViewId()));
  els.missingBudgetButton?.addEventListener("click", openMissingBudgetEntries);
  els.guideTourPrev?.addEventListener("click", () => showGuideStep(guideStepIndex - 1));
  els.guideTourNext?.addEventListener("click", () => {
    const steps = activeGuideSteps.length ? activeGuideSteps : guideSteps;
    if (guideStepIndex >= steps.length - 1) {
      endGuideTour();
      return;
    }
    showGuideStep(guideStepIndex + 1);
  });
  els.guideTourExit?.addEventListener("click", endGuideTour);
  window.addEventListener("resize", () => {
    if (!els.guideTour?.hidden) positionGuideStep();
  });
  window.addEventListener("scroll", () => {
    if (!els.guideTour?.hidden) positionGuideStep();
  }, true);
  els.cancelDeleteConfirm.addEventListener("click", () => closeDeleteConfirm(false));
  els.confirmDeleteConfirm.addEventListener("click", () => closeDeleteConfirm(true));
  els.deleteConfirmModal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDeleteConfirm(false);
  });
  els.modalForm.addEventListener("submit", handleModalSubmit);
  els.closeDayModal.addEventListener("click", () => els.dayModal.close());
  els.closeDayModalFooter.addEventListener("click", () => els.dayModal.close());
  els.dayModalAdd.addEventListener("click", () => {
    const date = els.dayModal.dataset.date;
    els.dayModal.close();
    if (date) openEntryForDate(date);
  });
  els.cancelTemplatePick.addEventListener("click", cancelTemplatePick);
  bindCategorySuggest("expense");
  bindCategorySuggest("income");
  els.expenseCategoryForm.addEventListener("submit", (event) => handleCategorySubmit(event, "expense"));
  els.incomeCategoryForm.addEventListener("submit", (event) => handleCategorySubmit(event, "income"));
  els.quickCategoryForm.addEventListener("submit", handleQuickCategory);
  els.exportExcel.addEventListener("click", exportExcel);
  els.exportData.addEventListener("click", exportData);
  els.importData.addEventListener("change", importData);
  els.saveSyncConfig.addEventListener("click", saveSyncConfig);
  els.syncNow.addEventListener("click", () => syncNow({ quiet: false }));
  els.syncPull.addEventListener("click", () => pullSync({ quiet: false }));
  els.syncPush.addEventListener("click", () => pushSync({ quiet: false }));
  els.syncAuto.addEventListener("change", () => {
    localStorage.setItem(SYNC_AUTO_KEY, els.syncAuto.checked ? "true" : "false");
    updateSyncStatus(els.syncAuto.checked ? "자동 올리기를 켰습니다." : "자동 올리기를 껐습니다.", "neutral");
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".category-form")) hideCategorySuggests();
  });
}

function setupMonthSelectors() {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear - 5; year <= currentYear + 5; year += 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = `${year}년`;
    els.yearSelect.append(option);
  }

  for (let month = 0; month < 12; month += 1) {
    const option = document.createElement("option");
    option.value = String(month);
    option.textContent = `${month + 1}월`;
    els.monthSelect.append(option);
  }
}

function moveMonth(delta) {
  const next = new Date(selectedYear, selectedMonth + delta, 1);
  selectedYear = next.getFullYear();
  selectedMonth = next.getMonth();
  ensureYearOption(selectedYear);
  renderAll();
}

function ensureYearOption(year) {
  if ([...els.yearSelect.options].some((option) => Number(option.value) === year)) return;
  const option = document.createElement("option");
  option.value = String(year);
  option.textContent = `${year}년`;
  els.yearSelect.append(option);
}

function setEntryType(type) {
  entryType = type;
  document.querySelectorAll("[data-entry-type]").forEach((button) => {
    button.classList.toggle("active", button.dataset.entryType === type);
  });
  populateCategorySelects();
}

function setFixedType(type) {
  fixedType = type;
  document.querySelectorAll("[data-fixed-type]").forEach((button) => {
    button.classList.toggle("active", button.dataset.fixedType === type);
  });
  populateFixedCategorySelects();
}

function renderMissingBudgetButton() {
  if (!els.missingBudgetButton) return;
  const count = getMissingBudgetEntriesForMonth(selectedYear, selectedMonth).length;
  els.missingBudgetButton.innerHTML = `<span>미지정</span><strong>${count}건</strong>`;
  els.missingBudgetButton.setAttribute("aria-label", `${selectedYear}년 ${selectedMonth + 1}월 예산 항목 미지정 지출 ${count}건 보기`);
  els.missingBudgetButton.classList.toggle("has-items", count > 0);
}

function openMissingBudgetEntries() {
  const entries = getMissingBudgetEntriesForMonth(selectedYear, selectedMonth);
  openAnalysisEntryDetail(
    "예산 항목 미지정 지출",
    entries,
    ["date", "category", "amount", "info", "memo"],
    getMonthRangeLabel(selectedYear, selectedMonth),
    "",
    { onEntrySelect: openEditableAnalysisEntry }
  );
}

function getMissingBudgetEntriesForMonth(year, month) {
  return getCountingEntries(getVisibleEntriesForMonth(year, month))
    .filter((entry) => isSameMonth(entry.date, year, month))
    .filter((entry) => isConsumptionEntry(entry) && !entry.budget)
    .sort((a, b) => a.date.localeCompare(b.date) || String(a.memo || "").localeCompare(String(b.memo || "")));
}

function openSearchModal() {
  if (!els.searchModal) return;
  els.searchInput.value = "";
  renderSearchResults();
  els.searchModal.showModal();
  requestAnimationFrame(() => els.searchInput.focus());
}

function renderSearchResults() {
  if (!els.searchResults) return;
  const query = els.searchInput.value.trim();
  const entries = getSearchResults(query);
  els.searchResults.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = query ? "검색된 내역이 없습니다." : "현재 월에 표시할 내역이 없습니다.";
    els.searchResults.append(empty);
    return;
  }

  entries.slice(0, 80).forEach((entry) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `search-result-row ${entryClass(entry)}`;
    row.innerHTML = `
      <span>${escapeHtml(formatShortMonthDay(entry.date))}</span>
      <div>
        <strong>${escapeHtml(entry.memo || entry.minor || "내역")}</strong>
        <small>${escapeHtml(typeLabels[entry.syntheticType || entry.type] || typeLabels[entry.type] || "")} · ${escapeHtml(entry.major || "-")} / ${escapeHtml(entry.minor || "-")} · ${escapeHtml(entry.info || "-")}${entry.budget ? ` · ${escapeHtml(entry.budget)}` : ""}</small>
      </div>
      <b>${formatMoney(entry.amount)}</b>
    `;
    row.addEventListener("click", () => {
      els.searchModal.close();
      openEditableAnalysisEntry(entry);
    });
    els.searchResults.append(row);
  });

  if (entries.length > 80) {
    const more = document.createElement("p");
    more.className = "search-caption";
    more.textContent = `검색 결과가 많아 최근 80건만 보여줍니다. 검색어를 더 자세히 입력해 주세요.`;
    els.searchResults.append(more);
  }
}

function getSearchResults(query) {
  const normalizedQuery = query.toLowerCase();
  const currentMonthEntries = getCountingEntries(getVisibleEntriesForMonth(selectedYear, selectedMonth))
    .filter((entry) => isSameMonth(entry.date, selectedYear, selectedMonth));
  const allEditableEntries = [
    ...state.entries.filter((entry) => !isFixedEntry(entry)),
    ...state.entries.filter(isFixedEntry).flatMap((entry) => expandFixedEntry(entry, selectedYear, selectedMonth))
  ].filter((entry) => !entry.isCardPayment && entry.type !== "card-payment");
  const source = query ? allEditableEntries : currentMonthEntries;
  const seen = new Set();
  return source
    .filter((entry) => {
      const key = entry.id;
      if (seen.has(key)) return false;
      seen.add(key);
      if (!normalizedQuery) return true;
      return getEntrySearchText(entry).includes(normalizedQuery);
    })
    .sort((a, b) => b.date.localeCompare(a.date) || String(a.memo || "").localeCompare(String(b.memo || "")));
}

function getEntrySearchText(entry) {
  return [
    entry.date,
    entry.major,
    entry.minor,
    entry.amount,
    entry.info,
    entry.budget,
    entry.memo,
    entry.owner,
    typeLabels[entry.syntheticType || entry.type]
  ].join(" ").toLowerCase();
}

function categoryTypeFor(entryKind) {
  return entryKind.includes("income") ? "income" : "expense";
}

function categoriesFor(entryKind) {
  return state.categories[categoryTypeFor(entryKind)] || {};
}

function populateCategorySelects() {
  fillMajorSelect(els.majorCategory, categoriesFor(entryType), els.majorCategory.value);
  populateMinorSelect();
}

function populateMinorSelect() {
  fillMinorSelect(els.minorCategory, categoriesFor(entryType), els.majorCategory.value, els.minorCategory.value);
}

function populateFixedCategorySelects() {
  fillMajorSelect(els.fixedMajorCategory, categoriesFor(fixedType), els.fixedMajorCategory.value);
  populateFixedMinorSelect();
}

function populateFixedMinorSelect() {
  fillMinorSelect(els.fixedMinorCategory, categoriesFor(fixedType), els.fixedMajorCategory.value, els.fixedMinorCategory.value);
}

function fillMajorSelect(select, categories, previous) {
  select.innerHTML = "";
  Object.keys(categories).forEach((major) => {
    const option = document.createElement("option");
    option.value = major;
    option.textContent = major;
    select.append(option);
  });
  if (previous && categories[previous]) select.value = previous;
}

function fillMinorSelect(select, categories, major, previous) {
  select.innerHTML = "";
  (categories[major] || []).forEach((minor) => {
    const option = document.createElement("option");
    option.value = minor;
    option.textContent = minor;
    select.append(option);
  });
  if ((categories[major] || []).includes(previous)) select.value = previous;
}

function populateFixedRepeatInterval() {
  const unit = els.fixedRepeatUnit.value;
  const max = unit === "day" ? 31 : unit === "week" ? 20 : 12;
  const previous = Number(els.fixedRepeatInterval.value) || 1;
  els.fixedRepeatInterval.innerHTML = "";
  for (let value = 1; value <= max; value += 1) {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    els.fixedRepeatInterval.append(option);
  }
  els.fixedRepeatInterval.value = String(Math.min(previous, max));
}

function renderAll() {
  currentUser = ensureCurrentUser(currentUser);
  renderUserSettings();
  renderSyncSettings();
  els.yearSelect.value = String(selectedYear);
  els.monthSelect.value = String(selectedMonth);
  populateCategorySelects();
  populateFixedCategorySelects();
  renderPaymentSelects();
  renderBudgetSelects();
  renderCalendar();
  renderAnalysis();
  renderMonthlyBudgetSettings();
  renderLocalCurrencySettings();
  renderFixedEntries();
  renderCards();
  renderCategories();
  renderTemplates();
  renderCategoryOptions();
  renderTemplatePickBanner();
  renderMissingBudgetButton();
}

function setupSettingsFolders() {
  document.querySelectorAll("#settingsView .settings-panel").forEach((panel) => {
    if (panel.dataset.folderReady) return;
    panel.dataset.folderReady = "true";
    panel.classList.add("settings-folder", "is-collapsed");

    const head = ensureSettingsFolderHead(panel);
    const body = document.createElement("div");
    body.className = "settings-folder-body";
    Array.from(panel.childNodes).forEach((node) => {
      if (node !== head) body.append(node);
    });
    panel.append(body);

    const actions = document.createElement("div");
    actions.className = "settings-folder-actions";

    const list = getSettingsListElement(panel);
    if (list) {
      const placeholder = document.createComment("settings-list-placeholder");
      list.before(placeholder);
      list.classList.add("settings-list-hidden");
      const listButton = document.createElement("button");
      listButton.className = "ghost-button settings-list-toggle";
      listButton.type = "button";
      listButton.textContent = "목록";
      listButton.addEventListener("click", () => openSettingsListModal(panel, list, placeholder, true));
      actions.append(listButton);
    }

    const folderButton = document.createElement("button");
    folderButton.className = "ghost-button settings-folder-toggle";
    folderButton.type = "button";
    folderButton.textContent = getSettingsFolderOpenLabel(panel);
    folderButton.addEventListener("click", () => setSettingsFolder(panel, panel.classList.contains("is-collapsed")));
    actions.append(folderButton);
    const title = head.querySelector(":scope > h2");
    if (title?.nextSibling) {
      head.insertBefore(actions, title.nextSibling);
    } else {
      head.append(actions);
    }
  });
}

function getSettingsListElement(panel) {
  if (panel.classList.contains("budget-settings-panel")) return panel.querySelector("#monthlyBudgetForm");
  if (panel.classList.contains("card-settings-panel")) return panel.querySelector("#cardSettings");
  if (panel.classList.contains("local-currency-settings-panel")) return panel.querySelector("#localCurrencyList");
  return panel.querySelector(".fixed-list, .user-list, .category-column");
}

function confirmDelete(message = "삭제하면 되돌릴 수 없습니다.") {
  if (deleteConfirmResolve) closeDeleteConfirm(false);
  els.deleteConfirmMessage.textContent = message;
  els.deleteConfirmModal.showModal();
  return new Promise((resolve) => {
    deleteConfirmResolve = resolve;
  });
}

function showGuideOnLaunch() {
  if (!els.guideModal || els.guideModal.open) return;
  if (localStorage.getItem(GUIDE_DONE_KEY) === "disabled") return;
  els.guideModal.showModal();
}

function disableGuideOnLaunch() {
  localStorage.setItem(GUIDE_DONE_KEY, "disabled");
  els.guideModal.close();
}

function startGuideTour(viewId = "") {
  if (els.guideModal?.open) els.guideModal.close();
  if (!els.guideTour) return;
  closeGuideBlockingDialogs();
  activeGuideSteps = viewId ? guideSteps.filter((step) => step.view === viewId) : [...guideSteps];
  if (!activeGuideSteps.length) activeGuideSteps = [...guideSteps];
  els.guideTour.hidden = false;
  document.body.classList.add("guide-tour-active");
  showGuideStep(0);
}

function showGuideStep(index) {
  if (!els.guideTour || els.guideTour.hidden) return;
  const steps = activeGuideSteps.length ? activeGuideSteps : guideSteps;
  guideStepIndex = Math.max(0, Math.min(index, steps.length - 1));
  const step = steps[guideStepIndex];
  if (step.view) showView(step.view, { skipStore: true });
  closeGuideBlockingDialogs();

  els.guideTourStep.textContent = `${guideStepIndex + 1} / ${steps.length}`;
  els.guideTourTitle.textContent = step.title;
  els.guideTourText.textContent = step.text;
  els.guideTourPrev.disabled = guideStepIndex === 0;
  els.guideTourNext.textContent = guideStepIndex === steps.length - 1 ? "완료" : "다음";

  window.setTimeout(positionGuideStep, 120);
}

function closeGuideBlockingDialogs() {
  closeSettingsListModalIfOpen();
  document.querySelectorAll("dialog[open]").forEach((dialog) => {
    if (dialog === els.guideModal) return;
    dialog.close();
  });
}

function positionGuideStep() {
  if (!els.guideTour || els.guideTour.hidden) return;
  const steps = activeGuideSteps.length ? activeGuideSteps : guideSteps;
  const step = steps[guideStepIndex];
  let target = document.querySelector(step.selector);
  if (!target) target = document.querySelector(".bottom-nav") || document.body;

  if (activeGuideTarget && activeGuideTarget !== target) activeGuideTarget.classList.remove("guide-target-active");
  activeGuideTarget = target;
  activeGuideTarget.classList.add("guide-target-active");
  target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });

  window.setTimeout(() => {
    const rect = target.getBoundingClientRect();
    const margin = 12;
    const highlightPad = 6;
    const cardWidth = Math.min(340, window.innerWidth - margin * 2);

    els.guideTourHighlight.style.left = `${Math.max(margin, rect.left - highlightPad)}px`;
    els.guideTourHighlight.style.top = `${Math.max(margin, rect.top - highlightPad)}px`;
    els.guideTourHighlight.style.width = `${Math.min(window.innerWidth - margin * 2, rect.width + highlightPad * 2)}px`;
    els.guideTourHighlight.style.height = `${rect.height + highlightPad * 2}px`;

    els.guideTourCard.style.width = `${cardWidth}px`;
    els.guideTourCard.style.left = `${Math.max(margin, Math.min(window.innerWidth - cardWidth - margin, rect.left + rect.width / 2 - cardWidth / 2))}px`;
    els.guideTourCard.style.top = "0px";
    const cardHeight = els.guideTourCard.offsetHeight;
    const belowTop = rect.bottom + 22;
    const canPlaceBelow = belowTop + cardHeight <= window.innerHeight - margin;
    const top = canPlaceBelow ? belowTop : Math.max(margin, rect.top - cardHeight - 22);
    els.guideTourCard.style.top = `${top}px`;

    els.guideTourArrow.textContent = canPlaceBelow ? "▲" : "▼";
    els.guideTourArrow.style.left = `${Math.max(margin, Math.min(window.innerWidth - margin - 24, rect.left + rect.width / 2 - 12))}px`;
    els.guideTourArrow.style.top = `${canPlaceBelow ? rect.bottom + 2 : top + cardHeight - 2}px`;
  }, 180);
}

function endGuideTour() {
  if (!els.guideTour) return;
  els.guideTour.hidden = true;
  document.body.classList.remove("guide-tour-active");
  if (activeGuideTarget) activeGuideTarget.classList.remove("guide-target-active");
  activeGuideTarget = null;
  activeGuideSteps = [];
}

function closeDeleteConfirm(result) {
  if (!deleteConfirmResolve) return;
  const resolve = deleteConfirmResolve;
  deleteConfirmResolve = null;
  if (els.deleteConfirmModal.open) els.deleteConfirmModal.close();
  resolve(result);
}

function openSettingsListModal(panel, list, placeholder, restoreHidden) {
  restoreSettingsListModal();
  activeSettingsList = { list, placeholder, restoreHidden };
  els.settingsListTitle.textContent = `${getSettingsPanelTitle(panel)} 목록`;
  els.settingsListContent.innerHTML = "";
  list.classList.remove("settings-list-hidden");
  els.settingsListContent.append(list);
  els.settingsListModal.showModal();
}

function restoreSettingsListModal() {
  if (!activeSettingsList) return;
  const { list, placeholder, restoreHidden } = activeSettingsList;
  if (placeholder.parentNode) placeholder.parentNode.insertBefore(list, placeholder.nextSibling);
  if (restoreHidden) list.classList.add("settings-list-hidden");
  activeSettingsList = null;
  els.settingsListContent.innerHTML = "";
}

function closeSettingsListModalIfOpen() {
  if (els.settingsListModal.open) els.settingsListModal.close();
}

function getSettingsPanelTitle(panel) {
  const title = panel.querySelector(":scope > .settings-folder-head h2") || panel.querySelector("h2");
  if (!title) return "설정";
  const badge = title.querySelector(".settings-title-badge");
  const fullText = title.textContent.trim();
  return badge ? fullText.replace(badge.textContent.trim(), "").trim() : fullText;
}

function ensureSettingsFolderHead(panel) {
  let head = panel.querySelector(":scope > .panel-head");
  if (head) {
    head.classList.add("settings-folder-head");
    return head;
  }

  head = document.createElement("div");
  head.className = "panel-head settings-folder-head";
  const title = panel.querySelector(":scope > h2");
  if (title) {
    panel.insertBefore(head, title);
    head.append(title);
  } else {
    panel.prepend(head);
  }
  return head;
}

function openSettingsFolder(panel) {
  setSettingsFolder(panel, true);
}

function setSettingsFolder(panel, isOpen) {
  panel.classList.toggle("is-collapsed", !isOpen);
  const button = panel.querySelector(":scope > .settings-folder-head .settings-folder-toggle");
  if (button) button.textContent = isOpen ? "접기" : getSettingsFolderOpenLabel(panel);
}

function getSettingsFolderOpenLabel(panel) {
  return panel.classList.contains("fixed-settings-panel") ||
    panel.classList.contains("budget-settings-panel") ||
    panel.classList.contains("card-settings-panel") ||
    panel.classList.contains("category-settings-panel") ||
    panel.classList.contains("user-settings-panel")
    ? "추가"
    : "열기";
}

function renderUserSettings() {
  const users = getUsers();
  if (els.userPanelCurrent) els.userPanelCurrent.textContent = `현재: ${currentUser}`;
  els.currentUser.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = user;
    els.currentUser.append(option);
  });
  els.currentUser.value = currentUser;

  els.userList.innerHTML = "";
  users.forEach((user) => {
    const row = document.createElement("div");
    row.className = "user-row";

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = user;
    const detail = document.createElement("small");
    detail.textContent = user === currentUser ? "현재 선택된 사용자" : "등록된 사용자";
    info.append(name, detail);

    const actions = document.createElement("div");
    actions.className = "user-actions";

    const selectButton = document.createElement("button");
    selectButton.className = user === currentUser ? "primary-button" : "ghost-button";
    selectButton.type = "button";
    selectButton.textContent = user === currentUser ? "선택됨" : "선택";
    selectButton.disabled = user === currentUser;
    selectButton.addEventListener("click", () => selectUserFromList(user));

    const editButton = document.createElement("button");
    editButton.className = "ghost-button";
    editButton.type = "button";
    editButton.textContent = "수정";
    editButton.addEventListener("click", () => {
      closeSettingsListModalIfOpen();
      const panel = document.querySelector(".user-settings-panel");
      if (panel) openSettingsFolder(panel);
      editUser(user);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "danger-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", () => deleteUser(user));

    actions.append(selectButton, editButton, deleteButton);
    row.append(info, actions);
    els.userList.append(row);
  });
}

function selectUserFromList(user) {
  currentUser = ensureCurrentUser(user);
  localStorage.setItem(USER_KEY, currentUser);
  closeSettingsListModalIfOpen();
  renderAll();
}

function saveCurrentUser() {
  currentUser = ensureCurrentUser(els.currentUser.value);
  localStorage.setItem(USER_KEY, currentUser);
  renderAll();
  alert(`${currentUser} 사용자로 저장했습니다. 앱을 다시 켜도 이 사용자로 시작합니다.`);
}

function handleUserSubmit(event) {
  event.preventDefault();
  const previousName = canonicalUser(els.editingUserName.value.trim());
  const nextName = canonicalUser(els.userNameInput.value.trim());
  if (!nextName) {
    alert("사용자 이름을 입력해 주세요.");
    return;
  }

  const users = getUsers();
  if (previousName) {
    if (!users.includes(previousName)) {
      resetUserForm();
      renderAll();
      return;
    }
    if (users.includes(nextName) && previousName !== nextName) {
      alert("이미 등록된 사용자 이름입니다.");
      return;
    }
    state.users = users.map((user) => (user === previousName ? nextName : user));
    migrateUserOwner(previousName, nextName);
    if (currentUser === previousName) currentUser = nextName;
    if (canonicalUser(localStorage.getItem(USER_KEY)) === previousName) {
      localStorage.setItem(USER_KEY, nextName);
    }
  } else {
    if (users.includes(nextName)) {
      alert("이미 등록된 사용자 이름입니다.");
      return;
    }
    state.users = [...users, nextName];
  }

  state.users = normalizeUsers(state.users);
  saveState();
  resetUserForm();
  renderAll();
}

function editUser(user) {
  els.editingUserName.value = user;
  els.userNameInput.value = user;
  els.saveUser.textContent = "수정";
  els.userNameInput.focus();
}

async function deleteUser(user) {
  const users = getUsers();
  if (users.length <= 1) {
    alert("사용자는 최소 1명은 있어야 합니다.");
    return;
  }

  const fallbackUser = users.find((item) => item !== user);
  const linkedCount =
    state.entries.filter((entry) => entry.owner === user || entry.createdBy === user || entry.modifiedBy === user).length +
    state.cards.filter((card) => card.owner === user).length +
    state.templates.filter((template) => template.owner === user).length +
    (state.localCurrency?.transactions || []).filter((item) => item.owner === user).length;
  const message = linkedCount
    ? `"${user}"에 연결된 내역, 카드, 퀵 입력 ${linkedCount}개를 "${fallbackUser}" 사용자로 옮기고 삭제할까요?`
    : `"${user}" 사용자를 삭제할까요?`;
  if (!(await confirmDelete(message))) return;

  migrateUserOwner(user, fallbackUser);
  state.users = users.filter((item) => item !== user);
  if (currentUser === user) currentUser = fallbackUser;
  if (canonicalUser(localStorage.getItem(USER_KEY)) === user) {
    localStorage.setItem(USER_KEY, currentUser);
  }
  saveState();
  resetUserForm();
  renderAll();
}

function resetUserForm() {
  els.editingUserName.value = "";
  els.userNameInput.value = "";
  els.saveUser.textContent = "추가";
}

function migrateUserOwner(previousName, nextName) {
  state.entries = state.entries.map((entry) => ({
    ...entry,
    owner: entry.owner === previousName ? nextName : entry.owner,
    createdBy: entry.createdBy === previousName ? nextName : entry.createdBy,
    modifiedBy: entry.modifiedBy === previousName ? nextName : entry.modifiedBy
  }));
  state.cards = state.cards.map((card) => (card.owner === previousName ? { ...card, owner: nextName } : card));
  state.templates = state.templates.map((template) => (template.owner === previousName ? { ...template, owner: nextName } : template));
  if (state.localCurrency?.settings?.[previousName]) {
    state.localCurrency.settings[nextName] = state.localCurrency.settings[previousName];
    delete state.localCurrency.settings[previousName];
  }
  if (state.localCurrency?.transactions) {
    state.localCurrency.transactions = state.localCurrency.transactions.map((item) => (item.owner === previousName ? { ...item, owner: nextName } : item));
  }
}

function renderSyncSettings() {
  if (!els.syncUrl) return;
  if (document.activeElement !== els.syncUrl) els.syncUrl.value = localStorage.getItem(SYNC_URL_KEY) || "";
  if (document.activeElement !== els.syncToken) els.syncToken.value = localStorage.getItem(SYNC_TOKEN_KEY) || "";
  els.syncAuto.checked = getSyncAutoEnabled();
  const lastSync = localStorage.getItem(SYNC_LAST_KEY);
  els.syncLastSync.textContent = `마지막 동기화: ${lastSync ? formatDateTime(lastSync) : "없음"}`;
}

function saveSyncConfig() {
  const url = els.syncUrl.value.trim();
  const token = els.syncToken.value.trim();
  if (!url || !token) {
    updateSyncStatus("Apps Script URL과 비밀키를 모두 입력해 주세요.", "warning");
    return;
  }

  try {
    new URL(url);
  } catch {
    updateSyncStatus("Apps Script URL 형식을 확인해 주세요.", "warning");
    return;
  }

  localStorage.setItem(SYNC_URL_KEY, url);
  localStorage.setItem(SYNC_TOKEN_KEY, token);
  localStorage.setItem(SYNC_AUTO_KEY, els.syncAuto.checked ? "true" : "false");
  updateSyncStatus("동기화 설정을 저장했습니다.", "success");
  renderSyncSettings();
}

function getSyncConfig() {
  const url = (localStorage.getItem(SYNC_URL_KEY) || "").trim();
  const token = (localStorage.getItem(SYNC_TOKEN_KEY) || "").trim();
  return url && token ? { url, token } : null;
}

function getSyncAutoEnabled() {
  return localStorage.getItem(SYNC_AUTO_KEY) !== "false";
}

function scheduleSyncPush() {
  if (isApplyingRemote || !getSyncAutoEnabled() || !getSyncConfig()) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    pushSync({ quiet: true });
  }, SYNC_DEBOUNCE_MS);
}

function syncOnStart() {
  if (!getSyncConfig()) return;
  queueBackgroundPull("start");
}

function queueBackgroundPull(reason = "background") {
  if (!getSyncConfig()) return Promise.resolve(false);
  if (backgroundPullPromise) return backgroundPullPromise;
  backgroundPullPromise = pullSync({ quiet: true, onlyIfRemoteNewer: true, reason })
    .catch(() => false)
    .finally(() => {
      backgroundPullPromise = null;
    });
  return backgroundPullPromise;
}

async function syncNow({ quiet = false } = {}) {
  const config = getSyncConfig();
  if (!config) {
    updateSyncStatus("동기화 설정을 먼저 저장해 주세요.", "warning");
    return;
  }

  try {
    if (!quiet) updateSyncStatus("공유 데이터를 확인하는 중입니다...", "neutral");
    const remote = await loadRemoteSnapshot(config);
    if (!remote.ok) throw new Error(remote.error || "공유 데이터를 읽지 못했습니다.");

    const remoteState = remote.state || remote.data;
    if (!remoteState) {
      await pushSync({ quiet });
      return;
    }

    const remoteUpdatedAt = remote.updatedAt || remoteState.updatedAt || "";
    const localUpdatedAt = state.updatedAt || "";
    if (isRemoteNewer(remoteUpdatedAt, localUpdatedAt) || !localUpdatedAt) {
      applyRemoteState(remoteState, remoteUpdatedAt);
      updateSyncStatus("공유 데이터를 불러왔습니다.", "success");
    } else if (isRemoteNewer(localUpdatedAt, remoteUpdatedAt)) {
      await pushSync({ quiet });
    } else {
      localStorage.setItem(SYNC_LAST_KEY, new Date().toISOString());
      updateSyncStatus("이미 최신 상태입니다.", "success");
      renderSyncSettings();
    }
  } catch (error) {
    updateSyncStatus(`동기화 실패: ${error.message}`, "warning");
  }
}

async function pullSync({ quiet = false, onlyIfRemoteNewer = false, reason = "" } = {}) {
  const config = getSyncConfig();
  if (!config) {
    if (!quiet) updateSyncStatus("동기화 설정을 먼저 저장해 주세요.", "warning");
    return false;
  }

  try {
    if (!quiet) updateSyncStatus("공유 데이터를 불러오는 중입니다...", "neutral");
    const remote = await loadRemoteSnapshot(config);
    if (!remote.ok) throw new Error(remote.error || "공유 데이터를 읽지 못했습니다.");

    const remoteState = remote.state || remote.data;
    if (!remoteState) {
      lastSuccessfulPullAt = Date.now();
      if (!quiet) updateSyncStatus("아직 공유 데이터가 없습니다. 먼저 올리기를 눌러 주세요.", "neutral");
      return true;
    }

    const remoteUpdatedAt = remote.updatedAt || remoteState.updatedAt || "";
    const localUpdatedAt = state.updatedAt || "";
    if (onlyIfRemoteNewer && localUpdatedAt && !isRemoteNewer(remoteUpdatedAt, localUpdatedAt)) {
      lastSuccessfulPullAt = Date.now();
      if (reason === "start" || reason === "periodic" || reason === "resume") renderSyncSettings();
      return true;
    }
    if (localUpdatedAt && isRemoteNewer(localUpdatedAt, remoteUpdatedAt)) {
      lastSuccessfulPullAt = Date.now();
      if (!quiet) updateSyncStatus("이 기기의 데이터가 더 최신입니다. 올리기를 누르면 공유 데이터에 반영됩니다.", "warning");
      return true;
    }

    applyRemoteState(remoteState, remoteUpdatedAt);
    lastSuccessfulPullAt = Date.now();
    updateSyncStatus("공유 데이터를 불러왔습니다.", "success");
    return true;
  } catch (error) {
    if (!quiet) updateSyncStatus(`불러오기 실패: ${error.message}`, "warning");
    return false;
  }
}

async function pushSync({ quiet = false } = {}) {
  const config = getSyncConfig();
  if (!config) {
    if (!quiet) updateSyncStatus("동기화 설정을 먼저 저장해 주세요.", "warning");
    return false;
  }

  try {
    if (!quiet) updateSyncStatus("공유 데이터에 올리는 중입니다...", "neutral");
    if (!state.updatedAt) state.updatedAt = new Date().toISOString();
    const body = new FormData();
    body.append("token", config.token);
    body.append("payload", JSON.stringify({ state, updatedAt: state.updatedAt }));
    await fetch(config.url, {
      method: "POST",
      mode: "no-cors",
      body
    });
    localStorage.setItem(SYNC_LAST_KEY, new Date().toISOString());
    updateSyncStatus("공유 데이터에 올렸습니다.", "success");
    renderSyncSettings();
    return true;
  } catch (error) {
    if (!quiet) updateSyncStatus(`올리기 실패: ${error.message}`, "warning");
    return false;
  }
}

async function prepareInputSync() {
  if (!getSyncConfig()) return true;
  clearTimeout(syncTimer);
  updateSyncStatus("공유 데이터 확인 후 저장합니다. 화면은 바로 이어서 사용할 수 있습니다.", "neutral");
  const pull = queueBackgroundPull("input");
  if (Date.now() - lastSuccessfulPullAt > SYNC_RECENT_PULL_MS) {
    await waitForSyncWindow(pull, SYNC_INPUT_WAIT_MS);
  }
  return true;
}

async function saveInputState(options = {}) {
  const { mergeRemote = true } = options;
  const shouldPush = Boolean(getSyncConfig());
  saveState({ skipSync: shouldPush });
  if (shouldPush) queueInputSync({ mergeRemote });
}

function waitForSyncWindow(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(false), timeoutMs))
  ]);
}

function queueInputSync({ mergeRemote = true } = {}) {
  inputSyncQueue = inputSyncQueue
    .catch(() => {})
    .then(() => syncLocalChangesWithRemote({ mergeRemote }))
    .catch((error) => {
      updateSyncStatus(`자동 동기화 실패: ${error.message}`, "warning");
    });
  return inputSyncQueue;
}

async function syncLocalChangesWithRemote({ mergeRemote = true } = {}) {
  const config = getSyncConfig();
  if (!config) return false;
  clearTimeout(syncTimer);
  updateSyncStatus("입력 내용을 공유 데이터와 맞추는 중입니다...", "neutral");

  if (mergeRemote) {
    const localSnapshot = clone(state);
    const remote = await loadRemoteSnapshot(config);
    if (!remote.ok) throw new Error(remote.error || "공유 데이터를 읽지 못했습니다.");
    const remoteState = remote.state || remote.data;
    if (remoteState) {
      state = mergeLedgerStates(localSnapshot, remoteState);
      state.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      lastSuccessfulPullAt = Date.now();
      renderAll();
    }
  }

  return pushSync({ quiet: true });
}

function mergeLedgerStates(localRaw, remoteRaw) {
  const users = unique([...(remoteRaw.users || defaultUsers), ...(localRaw.users || defaultUsers)].map(canonicalUser));
  const budgetBuckets = unique([...(remoteRaw.budgetBuckets || defaultBudgetBuckets), ...(localRaw.budgetBuckets || defaultBudgetBuckets)]);
  const remote = normalizeState({ ...remoteRaw, users, budgetBuckets });
  const local = normalizeState({ ...localRaw, users, budgetBuckets });
  return normalizeState({
    users,
    budgetBuckets,
    categories: mergeNestedCategories(remote.categories, local.categories),
    entries: mergeById(remote.entries, local.entries),
    cards: mergeById(remote.cards, local.cards),
    templates: mergeById(remote.templates, local.templates),
    monthlyBudgets: mergeMonthlyBudgetMaps(remote.monthlyBudgets, local.monthlyBudgets),
    localCurrency: mergeLocalCurrencyState(remote.localCurrency, local.localCurrency, users),
    updatedAt: new Date().toISOString()
  });
}

function mergeNestedCategories(remoteCategories = {}, localCategories = {}) {
  return {
    expense: mergeCategoryMaps(remoteCategories.expense || {}, localCategories.expense || {}),
    income: mergeCategoryMaps(remoteCategories.income || {}, localCategories.income || {})
  };
}

function mergeById(remoteItems = [], localItems = []) {
  const merged = new Map();
  remoteItems.forEach((item) => merged.set(item.id, item));
  localItems.forEach((item) => {
    const previous = merged.get(item.id);
    if (!previous || itemTimestamp(item) >= itemTimestamp(previous)) merged.set(item.id, item);
  });
  return [...merged.values()];
}

function itemTimestamp(item = {}) {
  const timestamp = Date.parse(item.modifiedAt || item.createdAt || item.updatedAt || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function mergeMonthlyBudgetMaps(remoteBudgets = {}, localBudgets = {}) {
  const merged = clone(remoteBudgets || {});
  Object.entries(localBudgets || {}).forEach(([key, values]) => {
    merged[key] = { ...(merged[key] || {}), ...(values || {}) };
  });
  return merged;
}

function mergeLocalCurrencyState(remoteLocal = {}, localLocal = {}, users = getUsers()) {
  const settings = {};
  users.forEach((user) => {
    settings[user] = {
      ...(remoteLocal.settings?.[user] || {}),
      ...(localLocal.settings?.[user] || {})
    };
  });
  return {
    settings,
    transactions: mergeById(remoteLocal.transactions || [], localLocal.transactions || [])
  };
}

function loadRemoteSnapshot(config) {
  return new Promise((resolve, reject) => {
    const callbackName = `familyLedgerSync${Date.now()}${Math.random().toString(16).slice(2)}`;
    const script = document.createElement("script");
    const endpoint = new URL(config.url);
    endpoint.searchParams.set("action", "load");
    endpoint.searchParams.set("callback", callbackName);
    endpoint.searchParams.set("token", config.token);

    const cleanup = () => {
      delete window[callbackName];
      script.remove();
      clearTimeout(timer);
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("응답 시간이 초과되었습니다."));
    }, 12000);

    window[callbackName] = (payload) => {
      cleanup();
      resolve(payload);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Apps Script URL에 연결할 수 없습니다."));
    };
    script.src = endpoint.toString();
    document.head.append(script);
  });
}

function applyRemoteState(remoteState, remoteUpdatedAt = "") {
  isApplyingRemote = true;
  state = normalizeState(remoteState);
  if (remoteUpdatedAt) state.updatedAt = remoteUpdatedAt;
  saveState({ skipSync: true, touch: false });
  localStorage.setItem(SYNC_LAST_KEY, new Date().toISOString());
  isApplyingRemote = false;
  renderAll();
}

function isRemoteNewer(remoteUpdatedAt, localUpdatedAt) {
  if (!remoteUpdatedAt) return false;
  if (!localUpdatedAt) return true;
  return new Date(remoteUpdatedAt).getTime() > new Date(localUpdatedAt).getTime();
}

function updateSyncStatus(message, tone = "neutral") {
  if (!els.syncStatus) return;
  els.syncStatus.textContent = message;
  els.syncStatus.dataset.tone = tone;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

function renderCalendar() {
  els.calendarGrid.innerHTML = "";
  weekdays.forEach((day, index) => {
    const head = document.createElement("div");
    head.className = `weekday${index === 0 ? " sunday" : ""}${index === 6 ? " saturday" : ""}`;
    head.textContent = day;
    els.calendarGrid.append(head);
  });

  const firstDate = new Date(selectedYear, selectedMonth, 1);
  const startDate = new Date(selectedYear, selectedMonth, 1 - firstDate.getDay());
  const visibleEntries = getVisibleEntriesForMonth(selectedYear, selectedMonth);
  const entriesByDate = groupBy(visibleEntries, "date");
  const todayKey = toDateKey(new Date());

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const key = toDateKey(date);
    const inMonth = date.getMonth() === selectedMonth;
    const cellEntries = entriesByDate[key] || [];
    const holiday = getHoliday(key);
    const dayOfWeek = date.getDay();
    const cell = document.createElement("div");
    cell.className = `day-cell${inMonth ? "" : " muted"}${key === todayKey ? " today" : ""}${dayOfWeek === 0 ? " sunday" : ""}${dayOfWeek === 6 ? " saturday" : ""}${holiday ? " holiday" : ""}`;
    cell.dataset.date = key;
    cell.tabIndex = 0;
    cell.setAttribute("role", "button");
    cell.setAttribute("aria-label", `${key} 내역 보기`);
    cell.addEventListener("click", () => openDayModal(key));
    cell.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openDayModal(key);
    });

    const head = document.createElement("div");
    head.className = "day-head";
    head.innerHTML = `<span class="day-number">${date.getDate()}</span>`;
    const addButton = document.createElement("button");
    addButton.className = "day-add";
    addButton.type = "button";
    addButton.title = "이 날짜에 입력";
    addButton.textContent = "+";
    addButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openDayModal(key);
    });
    head.append(addButton);
    cell.append(head);

    if (holiday) {
      const holidayBadge = document.createElement("div");
      holidayBadge.className = "holiday-badge";
      holidayBadge.textContent = holiday;
      cell.append(holidayBadge);
    }

    const countableEntries = getCountingEntries(cellEntries);
    const dayExpense = sumConsumption(countableEntries);
    const fixedExpense = sumFixedExpense(countableEntries);
    const dayIncome = sumIncome(countableEntries);
    const cardPayment = sumCardPayments(cellEntries);
    if (dayExpense || fixedExpense || dayIncome || cardPayment) {
      const totalList = document.createElement("div");
      totalList.className = "day-total-list";
      if (dayExpense) totalList.append(createDayTotalRow("expense", dayExpense));
      if (fixedExpense) totalList.append(createDayTotalRow("fixed-expense", fixedExpense));
      if (dayIncome) totalList.append(createDayTotalRow("income", dayIncome));
      if (cardPayment) totalList.append(createDayTotalRow("card-payment", cardPayment));
      cell.append(totalList);
    }

    els.calendarGrid.append(cell);
  }

  const monthEntries = getCountingEntries(visibleEntries).filter((entry) => isSameMonth(entry.date, selectedYear, selectedMonth));
  const income = sumIncome(monthEntries);
  const expense = sumExpense(monthEntries);
  els.monthIncome.textContent = formatMoney(income);
  els.monthExpense.textContent = formatMoney(expense);
  if (els.monthBalance) els.monthBalance.textContent = formatMoney(income - expense);
}

function createDayTotalRow(type, amount) {
  const row = document.createElement("div");
  row.className = `day-total-row ${type}`;
  row.innerHTML = `<b>${formatCalendarTotalMoney(amount)}</b>`;
  return row;
}

async function openDayModal(dateKey) {
  if (pendingTemplate) {
    const template = pendingTemplate;
    const saved = await addTemplateEntryForDate(template, dateKey);
    if (saved) {
      pendingTemplate = null;
      renderTemplatePickBanner();
      showView("calendarView");
    }
    return;
  }

  const date = parseDate(dateKey);
  const dayEntries = getVisibleEntriesForMonth(date.getFullYear(), date.getMonth()).filter((entry) => entry.date === dateKey);
  els.dayModal.dataset.date = dateKey;
  els.dayModalTitle.textContent = formatDayTitle(dateKey);
  renderDayModalEntries(dayEntries);
  els.dayModal.showModal();
}

function renderDayModalEntries(entries) {
  els.dayModalList.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "이 날짜에 입력된 내역이 없습니다.";
    els.dayModalList.append(empty);
    return;
  }

  entries.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `day-entry-row ${entryClass(entry)}`;
    button.innerHTML = `
      <div>
        <strong>${escapeHtml(entry.memo)}</strong>
        <small>${typeLabels[entry.syntheticType || entry.type] || typeLabels[entry.type] || ""} · ${escapeHtml(entry.major)} · ${escapeHtml(entry.minor)}${entry.info ? " · " + escapeHtml(entry.info) : ""}${entry.budget ? " · " + escapeHtml(entry.budget) : ""}</small>
      </div>
      <b>${formatMoney(entry.amount)}</b>
    `;
    button.addEventListener("click", () => {
      els.dayModal.close();
      openEntryModal(entry);
    });
    els.dayModalList.append(button);
  });
}

async function openEntryForDate(dateKey) {
  if (pendingTemplate) {
    const template = pendingTemplate;
    const saved = await addTemplateEntryForDate(template, dateKey);
    if (saved) {
      pendingTemplate = null;
      renderTemplatePickBanner();
      showView("calendarView");
    }
    return;
  }
  selectedDate = parseDate(dateKey);
  selectedYear = selectedDate.getFullYear();
  selectedMonth = selectedDate.getMonth();
  ensureYearOption(selectedYear);
  renderAll();
  resetEntryForm(dateKey);
  showView("entryView");
}

function getVisibleEntriesForMonth(year, month) {
  const baseEntries = state.entries.filter((entry) => !isFixedEntry(entry));
  const fixedOccurrences = state.entries
    .filter(isFixedEntry)
    .flatMap((entry) => expandFixedEntry(entry, year, month));
  const cardPayments = [-1, 0, 1].flatMap((offset) => {
    const paymentMonth = new Date(year, month + offset, 1);
    return getCardPaymentEntries(paymentMonth.getFullYear(), paymentMonth.getMonth());
  });
  return [...baseEntries, ...fixedOccurrences, ...cardPayments].sort((a, b) => a.date.localeCompare(b.date));
}

function expandFixedEntry(entry, year, month) {
  if ((entry.excludedMonths || []).includes(monthKey(year, month))) return [];
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const start = parseDate(entry.startDate || entry.date);
  const unit = entry.repeat?.unit || "month";
  const interval = Number(entry.repeat?.interval || 1);
  const occurrences = [];
  let cursor = new Date(start);

  while (cursor <= monthEnd) {
    if (cursor >= monthStart) {
      const adjusted = adjustHoliday(cursor, entry.repeat?.holidayRule || "previous");
      occurrences.push({
        ...entry,
        id: `${entry.id}:${toDateKey(adjusted)}`,
        sourceId: entry.id,
        date: toDateKey(adjusted),
        syntheticType: entry.type
      });
    }
    cursor = addRepeatInterval(cursor, unit, interval, start.getDate());
  }

  return occurrences;
}

function addRepeatInterval(date, unit, interval, anchorDay) {
  const next = new Date(date);
  if (unit === "day") {
    next.setDate(next.getDate() + interval);
  } else if (unit === "week") {
    next.setDate(next.getDate() + interval * 7);
  } else {
    next.setMonth(next.getMonth() + interval, 1);
    next.setDate(Math.min(anchorDay, daysInMonth(next.getFullYear(), next.getMonth())));
  }
  return next;
}

function adjustHoliday(date, rule) {
  const adjusted = new Date(date);
  const day = adjusted.getDay();
  if (day !== 0 && day !== 6 && !getHoliday(toDateKey(adjusted))) return adjusted;

  if (rule === "next") {
    return getNextBusinessDay(adjusted);
  } else {
    do {
      adjusted.setDate(adjusted.getDate() - 1);
    } while (isNonBusinessDay(adjusted));
  }
  return adjusted;
}

function getCardPaymentEntries(year, month) {
  return state.cards
    .map((card) => {
      const total = getCardBillingTotal(card, year, month);
      if (total <= 0) return null;
      const paymentDate = getNextBusinessDay(new Date(year, month, Math.min(card.paymentDay, daysInMonth(year, month))));
      return {
        id: `card:${card.id}:${year}-${month + 1}`,
        date: toDateKey(paymentDate),
        type: "card-payment",
        syntheticType: "card-payment",
        major: "카드",
        minor: "대금",
        amount: total,
        memo: `${card.owner} ${card.name} 대금`,
        info: card.name,
        owner: card.owner,
        isCardPayment: true
      };
    })
    .filter(Boolean);
}

function getCardBillingTotal(card, year, month) {
  return getCardBillingEntries(card, year, month).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function getCardBillingEntries(card, year, month) {
  const start = new Date(year, month - 1, card.billingStartDay);
  const end = new Date(year, month, card.billingStartDay);
  end.setDate(end.getDate() - 1);
  return getBillableExpenseEntries(start, end)
    .filter((entry) => entry.owner === card.owner && entry.info === card.name)
    .sort((a, b) => a.date.localeCompare(b.date) || String(a.memo || "").localeCompare(String(b.memo || "")));
}

function getBillableExpenseEntries(start, end) {
  const oneTimeExpenses = state.entries.filter((entry) => entry.type === "expense");
  const fixedExpenses = state.entries
    .filter((entry) => entry.type === "fixed-expense")
    .flatMap((entry) => monthsInRange(start, end).flatMap(({ year, month }) => expandFixedEntry(entry, year, month)));
  return [...oneTimeExpenses, ...fixedExpenses].filter((entry) => {
    const date = parseDate(entry.date);
    return date >= start && date <= end;
  });
}

async function handleEntrySubmit(event) {
  event.preventDefault();
  const payload = readEntryForm();
  if (!payload) return;
  const submitter = event.submitter;
  if (submitter) submitter.disabled = true;

  try {
    if (!(await prepareInputSync())) return;

    if (els.editingEntryId.value) {
      const id = els.editingEntryId.value;
      const exists = state.entries.some((entry) => entry.id === id);
      if (!exists) {
        alert("공유 데이터를 불러오는 사이에 이 내역이 삭제되었거나 변경되었습니다. 다시 확인해 주세요.");
        renderAll();
        return;
      }
      state.entries = state.entries.map((entry) => (entry.id === id ? withEditedEntryMetadata(entry, payload) : entry));
    } else {
      state.entries.push(withNewEntryMetadata(payload));
    }

    selectedDate = parseDate(payload.date);
    selectedYear = selectedDate.getFullYear();
    selectedMonth = selectedDate.getMonth();
    await saveInputState();
    resetEntryForm(payload.date);
    renderAll();
    showView("calendarView");
  } finally {
    if (submitter) submitter.disabled = false;
  }
}

function readEntryForm() {
  const date = els.entryDate.value;
  const amount = Number(els.entryAmount.value);
  const major = els.majorCategory.value;
  const minor = els.minorCategory.value;
  const memo = els.entryMemo.value.trim();
  const info = els.entryInfo.value;
  const budget = els.entryBudget.value;

  if (!date || !amount || !major || !minor || !memo || !info) {
    alert("비어 있는 칸이 있습니다. 날짜, 카테고리, 금액, 메모, 정보를 모두 입력해 주세요.");
    return null;
  }

  return {
    type: entryType,
    owner: currentUser,
    date,
    major,
    minor,
    amount,
    memo,
    info,
    budget
  };
}

function resetEntryForm(date = toDateKey(new Date(selectedYear, selectedMonth, 1))) {
  editingTemplateId = "";
  els.saveTemplate.textContent = "퀵 입력 저장";
  els.editingEntryId.value = "";
  els.entryDate.value = date;
  els.entryAmount.value = "";
  els.entryMemo.value = "";
  els.entryBudget.value = "";
  setEntryType(entryType === "income" ? "income" : "expense");
  renderPaymentSelects({ resetEntry: true });
  renderBudgetSelects();
}

function openEntryModal(entry) {
  if (entry.isCardPayment) {
    alert("카드 대금은 참고용 표시입니다. 지출 합계와 분석에는 중복 반영되지 않습니다.");
    return;
  }
  if (isFixedEntry(entry)) {
    openFixedEntryEditor(entry.sourceId || entry.id);
    return;
  }

  const sourceEntry = state.entries.find((item) => item.id === entry.id);
  if (!sourceEntry) return;

  els.modalBody.innerHTML = "";
  els.modalUserMeta.textContent = entryUserLabel(sourceEntry);
  els.modalBody.append(createModalFields(sourceEntry));
  els.entryModal.dataset.entryId = sourceEntry.id;
  els.entryModal.showModal();
}

function openFixedEntryEditor(id) {
  const sourceEntry = state.entries.find((item) => item.id === id);
  if (!sourceEntry) return;
  showView("settingsView");
  editFixedEntry(sourceEntry.id);
  requestAnimationFrame(() => {
    const panel = document.querySelector(".fixed-settings-panel");
    if (panel) openSettingsFolder(panel);
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    els.fixedMemo.focus();
  });
}

function createModalFields(entry) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <label><span>날짜</span><input name="date" type="date" value="${entry.date}" required></label>
    <div class="grid-two">
      <label><span>대분류</span><select name="major" required></select></label>
      <label><span>소분류</span><select name="minor" required></select></label>
    </div>
    <div class="grid-two">
      <label><span>금액</span><input name="amount" type="number" min="0" step="1" value="${entry.amount}" required></label>
      <label><span>정보</span><select name="info" required></select></label>
    </div>
    <label><span>예산 항목</span><select name="budget"></select></label>
    <label><span>메모</span><input name="memo" value="${escapeAttr(entry.memo)}" required></label>
  `;

  const categories = categoriesFor(entry.type);
  const majorSelect = wrap.querySelector('[name="major"]');
  const minorSelect = wrap.querySelector('[name="minor"]');
  const infoSelect = wrap.querySelector('[name="info"]');
  const budgetSelect = wrap.querySelector('[name="budget"]');
  fillMajorSelect(majorSelect, categories, entry.major);
  const fillMinor = () => fillMinorSelect(minorSelect, categories, majorSelect.value, entry.minor);
  fillMinor();
  majorSelect.addEventListener("change", fillMinor);
  fillPaymentSelect(infoSelect, entry.info);
  fillBudgetSelect(budgetSelect, entry.budget);
  return wrap;
}

async function handleModalSubmit(event) {
  event.preventDefault();
  const action = event.submitter?.value;
  const id = els.entryModal.dataset.entryId;
  if (!id || action === "cancel") {
    els.entryModal.close();
    return;
  }

  if (action === "delete") {
    if (!(await confirmDelete("이 내역을 삭제하면 되돌릴 수 없습니다."))) return;
    if (!(await prepareInputSync())) return;
    state.entries = state.entries.filter((entry) => entry.id !== id);
  }

  if (action === "save") {
    const formData = new FormData(els.modalForm);
    if (!(await prepareInputSync())) return;
    const exists = state.entries.some((entry) => entry.id === id);
    if (!exists) {
      alert("공유 데이터를 불러오는 사이에 이 내역이 삭제되었거나 변경되었습니다. 다시 확인해 주세요.");
      els.entryModal.close();
      renderAll();
      return;
    }
    state.entries = state.entries.map((entry) => {
      if (entry.id !== id) return entry;
      return withEditedEntryMetadata(entry, {
        date: formData.get("date"),
        major: formData.get("major"),
        minor: formData.get("minor"),
        amount: Number(formData.get("amount")),
        memo: formData.get("memo").trim(),
        info: formData.get("info"),
        budget: formData.get("budget") || ""
      });
    });
  }

  await saveInputState({ mergeRemote: action !== "delete" });
  els.entryModal.close();
  renderAll();
}

async function saveCurrentTemplate() {
  const payload = readEntryForm();
  if (!payload) return;
  if (!(await prepareInputSync())) return;

  if (editingTemplateId) {
    state.templates = state.templates.map((template) => (template.id === editingTemplateId ? { ...template, ...payload, id: template.id } : template));
    editingTemplateId = "";
    els.saveTemplate.textContent = "퀵 입력 저장";
    alert("퀵 입력을 수정했습니다.");
  } else {
    state.templates.push({ ...payload, id: makeId() });
    alert("퀵 입력 목록에 추가했습니다.");
  }

  await saveInputState();
  renderTemplates();
}

function renderTemplates() {
  if (els.templateList) renderTemplateList(els.templateList);
  if (els.quickTemplateModal.open) renderTemplateList(els.quickTemplateList);
}

function openQuickTemplateModal() {
  renderTemplateList(els.quickTemplateList);
  els.quickTemplateModal.showModal();
}

function closeQuickTemplateModal() {
  if (els.quickTemplateModal.open) els.quickTemplateModal.close();
}

function renderTemplateList(target) {
  target.innerHTML = "";
  const visibleTemplates = state.templates.filter((template) => template.owner === currentUser);
  if (!visibleTemplates.length) {
    target.innerHTML = '<div class="empty-state">현재 사용자에게 저장된 퀵 입력이 없습니다.</div>';
    return;
  }

  visibleTemplates.forEach((template) => {
    target.append(createTemplateCard(template));
  });
}

function createTemplateCard(template) {
  const type = template.type === "income" ? "income" : "expense";
  const card = document.createElement("div");
  card.className = `template-card ${type}`;
  card.innerHTML = `
      <div class="template-body">
        <strong>${escapeHtml(template.memo)}</strong>
        <span>${typeLabels[type]} · ${escapeHtml(template.major)} · ${escapeHtml(template.minor)}</span>
        <span>${escapeHtml(template.info || "정보 없음")} · ${escapeHtml(template.budget || "미지정")} · ${formatMoney(template.amount)}</span>
      </div>
    `;
  const button = document.createElement("button");
  button.className = "primary-button";
  button.type = "button";
  button.textContent = "입력";
  button.addEventListener("click", () => {
    closeQuickTemplateModal();
    startTemplateDatePick(template);
  });
  const editButton = document.createElement("button");
  editButton.className = "ghost-button";
  editButton.type = "button";
  editButton.textContent = "수정";
  editButton.addEventListener("click", () => {
    closeQuickTemplateModal();
    editTemplate(template.id);
  });
  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "삭제";
  deleteButton.addEventListener("click", () => deleteTemplate(template.id));
  const actions = document.createElement("div");
  actions.className = "template-actions";
  actions.append(button, editButton, deleteButton);
  card.append(actions);
  return card;
}

function editTemplate(templateId) {
  const template = state.templates.find((item) => item.id === templateId);
  if (!template) return;
  editingTemplateId = template.id;
  pendingTemplate = null;
  renderTemplatePickBanner();

  setEntryType(template.type === "income" ? "income" : "expense");
  els.entryDate.value = template.date || toDateKey(new Date(selectedYear, selectedMonth, selectedDate.getDate()));
  els.majorCategory.value = template.major;
  populateMinorSelect();
  els.minorCategory.value = template.minor;
  els.entryAmount.value = template.amount;
  fillPaymentSelect(els.entryInfo, template.info);
  fillBudgetSelect(els.entryBudget, template.budget || "");
  els.entryMemo.value = template.memo;
  els.saveTemplate.textContent = "퀵 입력 수정 완료";
  showView("entryView");
}

function startTemplateDatePick(template) {
  pendingTemplate = template;
  renderTemplatePickBanner();
  showView("calendarView");
}

function cancelTemplatePick() {
  pendingTemplate = null;
  renderTemplatePickBanner();
}

function renderTemplatePickBanner() {
  if (!els.templatePickBanner) return;
  els.templatePickBanner.hidden = !pendingTemplate;
  if (!pendingTemplate) return;
  els.templatePickTitle.textContent = `${pendingTemplate.memo} 날짜 선택`;
  els.templatePickText.textContent = "달력에서 저장할 날짜를 누르면 바로 입력됩니다.";
}

async function deleteTemplate(templateId) {
  const template = state.templates.find((item) => item.id === templateId);
  if (!template) return;
  if (!(await confirmDelete(`퀵 입력 "${template.memo}"을(를) 삭제합니다.`))) return;
  state.templates = state.templates.filter((item) => item.id !== templateId);
  if (pendingTemplate?.id === templateId) pendingTemplate = null;
  if (editingTemplateId === templateId) {
    editingTemplateId = "";
    els.saveTemplate.textContent = "퀵 입력 저장";
  }
  saveState();
  renderAll();
}

async function addTemplateEntryForDate(template, date) {
  if (!(await prepareInputSync())) return false;
  const type = template.type === "income" ? "income" : "expense";
  state.entries.push({
    id: makeId(),
    type,
    date,
    owner: currentUser,
    major: template.major,
    minor: template.minor,
    amount: Number(template.amount || 0),
    memo: template.memo,
    info: template.info,
    budget: template.budget || "",
    createdBy: currentUser,
    createdAt: new Date().toISOString()
  });
  selectedDate = parseDate(date);
  selectedYear = selectedDate.getFullYear();
  selectedMonth = selectedDate.getMonth();
  await saveInputState();
  resetEntryForm(date);
  renderAll();
  return true;
}

async function handleFixedSubmit(event) {
  event.preventDefault();
  const payload = readFixedForm();
  if (!payload) return;
  const id = els.fixedEditingId.value;
  const submitter = event.submitter;
  if (submitter) submitter.disabled = true;

  try {
    if (!(await prepareInputSync())) return;

    if (id) {
      const exists = state.entries.some((entry) => entry.id === id);
      if (!exists) {
        alert("공유 데이터를 불러오는 사이에 이 고정 내역이 삭제되었거나 변경되었습니다. 다시 확인해 주세요.");
        renderAll();
        return;
      }
      state.entries = state.entries.map((entry) => (entry.id === id ? withEditedEntryMetadata(entry, payload) : entry));
    } else {
      state.entries.push(withNewEntryMetadata(payload));
    }

    await saveInputState();
    resetFixedForm();
    renderAll();
  } finally {
    if (submitter) submitter.disabled = false;
  }
}

function readFixedForm() {
  const date = els.fixedDate.value;
  const amount = Number(els.fixedAmount.value);
  const major = els.fixedMajorCategory.value;
  const minor = els.fixedMinorCategory.value;
  const memo = els.fixedMemo.value.trim();
  const info = els.fixedInfo.value;
  const budget = els.fixedBudget.value;

  if (!date || !amount || !major || !minor || !memo || !info) {
    alert("고정 내역의 시작 날짜, 카테고리, 금액, 메모, 정보를 모두 입력해 주세요.");
    return null;
  }

  return {
    type: fixedType,
    owner: currentUser,
    date,
    startDate: date,
    major,
    minor,
    amount,
    memo,
    info,
    budget,
    repeat: {
      unit: els.fixedRepeatUnit.value,
      interval: Number(els.fixedRepeatInterval.value),
      holidayRule: els.fixedHolidayRule.value
    }
  };
}

function resetFixedForm() {
  els.fixedEditingId.value = "";
  els.fixedDate.value = toDateKey(new Date(selectedYear, selectedMonth, 1));
  els.fixedAmount.value = "";
  els.fixedMemo.value = "";
  els.fixedBudget.value = "";
  populateFixedRepeatInterval();
  els.fixedRepeatUnit.value = "month";
  populateFixedRepeatInterval();
  els.fixedRepeatInterval.value = "1";
  els.fixedHolidayRule.value = "previous";
  setFixedType(fixedType);
  renderPaymentSelects();
  renderBudgetSelects();
}

function renderFixedEntries() {
  els.fixedList.innerHTML = "";
  const fixedEntries = state.entries.filter(isFixedEntry);
  if (!fixedEntries.length) {
    els.fixedList.innerHTML = '<div class="empty-state">저장된 고정 내역이 없습니다.</div>';
    return;
  }

  fixedEntries.forEach((entry) => {
    const excluded = (entry.excludedMonths || []).includes(monthKey(selectedYear, selectedMonth));
    const row = document.createElement("div");
    row.className = `fixed-card ${entry.type}`;
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(entry.memo)}</strong>
        <small>${typeLabels[entry.type]} · ${escapeHtml(entry.major)} · ${escapeHtml(entry.minor)} · ${entry.budget ? escapeHtml(entry.budget) + " · " : ""}${formatMoney(entry.amount)}</small>
        <small>${entry.startDate || entry.date} 시작 · ${repeatLabel(entry.repeat)}</small>
      </div>
    `;
    const includeLabel = document.createElement("label");
    includeLabel.className = "fixed-month-toggle";
    includeLabel.innerHTML = `
      <input type="checkbox" ${excluded ? "" : "checked"} />
      <span>${selectedMonth + 1}월 포함</span>
    `;
    includeLabel.querySelector("input").addEventListener("change", (event) => {
      toggleFixedMonthInclusion(entry.id, event.target.checked);
    });
    const editButton = document.createElement("button");
    editButton.className = "ghost-button";
    editButton.type = "button";
    editButton.textContent = "수정";
    editButton.addEventListener("click", () => {
      closeSettingsListModalIfOpen();
      const panel = document.querySelector(".fixed-settings-panel");
      if (panel) openSettingsFolder(panel);
      editFixedEntry(entry.id);
    });
    const deleteButton = document.createElement("button");
    deleteButton.className = "danger-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", async () => {
      if (!(await confirmDelete(`고정 내역 "${entry.memo}"을(를) 삭제합니다.`))) return;
      state.entries = state.entries.filter((item) => item.id !== entry.id);
      saveState();
      renderAll();
    });
    row.append(includeLabel, editButton, deleteButton);
    els.fixedList.append(row);
  });
}

async function toggleFixedMonthInclusion(id, included) {
  if (!(await prepareInputSync())) {
    renderAll();
    return;
  }

  const entry = state.entries.find((item) => item.id === id);
  if (!entry) {
    alert("공유 데이터를 불러오는 사이에 이 고정 내역이 삭제되었거나 변경되었습니다.");
    renderAll();
    return;
  }

  const key = monthKey(selectedYear, selectedMonth);
  const excludedMonths = new Set(entry.excludedMonths || []);
  if (included) {
    excludedMonths.delete(key);
  } else {
    excludedMonths.add(key);
  }

  state.entries = state.entries.map((item) => (
    item.id === id
      ? withEditedEntryMetadata(item, { excludedMonths: [...excludedMonths].sort() })
      : item
  ));
  await saveInputState();
  renderAll();
}

function editFixedEntry(id) {
  const entry = state.entries.find((item) => item.id === id);
  if (!entry) return;
  setFixedType(entry.type);
  els.fixedEditingId.value = entry.id;
  els.fixedDate.value = entry.startDate || entry.date;
  els.fixedMajorCategory.value = entry.major;
  populateFixedMinorSelect();
  els.fixedMinorCategory.value = entry.minor;
  els.fixedAmount.value = entry.amount;
  fillPaymentSelect(els.fixedInfo, entry.info);
  fillBudgetSelect(els.fixedBudget, entry.budget);
  els.fixedMemo.value = entry.memo;
  els.fixedRepeatUnit.value = entry.repeat?.unit || "month";
  populateFixedRepeatInterval();
  els.fixedRepeatInterval.value = String(entry.repeat?.interval || 1);
  els.fixedHolidayRule.value = entry.repeat?.holidayRule || "previous";
}

function renderAnalysis() {
  const label = `${selectedYear}년 ${selectedMonth + 1}월`;
  els.analysisMonthLabel.textContent = label;
  const monthEntries = getCountingEntries(getVisibleEntriesForMonth(selectedYear, selectedMonth)).filter((entry) => isSameMonth(entry.date, selectedYear, selectedMonth));
  const previousDate = new Date(selectedYear, selectedMonth - 1, 1);
  const previousEntries = getCountingEntries(getVisibleEntriesForMonth(previousDate.getFullYear(), previousDate.getMonth())).filter((entry) => isSameMonth(entry.date, previousDate.getFullYear(), previousDate.getMonth()));
  const expenses = monthEntries.filter(isConsumptionEntry);
  const majorTotals = totalBy(expenses, "major");
  const topMajor = Object.entries(majorTotals).sort((a, b) => b[1] - a[1])[0]?.[0];
  const minorTotals = totalBy(expenses.filter((entry) => entry.major === topMajor), "minor");

  renderPie(els.majorChart, els.majorLegend, majorTotals, (major) => {
    const entries = expenses.filter((entry) => entry.major === major);
    openAnalysisEntryDetail(`${major} 사용 내역`, entries, ["date", "category", "amount", "info", "memo", "budget"]);
  });
  renderPie(els.minorChart, els.minorLegend, minorTotals, (minor) => {
    const entries = expenses.filter((entry) => entry.major === topMajor && entry.minor === minor);
    openAnalysisEntryDetail(`${topMajor || "소분류"} / ${minor} 사용 내역`, entries, ["date", "category", "amount", "info", "memo", "budget"]);
  });

  els.cardTotalList.innerHTML = "";
  let cardGrandTotal = 0;
  const analysisCards = state.cards.filter((card) => card.owner === currentUser);
  if (!analysisCards.length) {
    els.cardTotalList.innerHTML = `<div class="empty-state">${escapeHtml(currentUser)} 소유 카드가 없습니다.</div>`;
  }
  analysisCards.forEach((card) => {
    const total = getCardBillingTotal(card, selectedYear, selectedMonth);
    cardGrandTotal += total;
    const row = document.createElement("div");
    row.className = "card-row clickable-row";
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `${card.name} 카드 사용내역 보기`);
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(card.name)}</strong>
        <small>소유자별 계산 · 전월 ${card.billingStartDay}일 - 당월 ${Math.max(card.billingStartDay - 1, 1)}일 / 결제 ${card.paymentDay}일</small>
      </div>
      <strong>${formatMoney(total)}</strong>
    `;
    const openCardDetail = () => {
      const entries = getCardBillingEntries(card, selectedYear, selectedMonth);
      openAnalysisEntryDetail(`${card.name} 결제 대금 사용내역`, entries, ["date", "category", "amount", "info", "memo", "budget"], getCardBillingRangeLabel(card, selectedYear, selectedMonth));
    };
    row.addEventListener("click", openCardDetail);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCardDetail();
      }
    });
    els.cardTotalList.append(row);
  });
  if (els.cardPaymentGrandTotal) els.cardPaymentGrandTotal.textContent = formatMoney(cardGrandTotal);

  setDelta(els.expenseDelta, sumConsumption(monthEntries) - sumConsumption(previousEntries));
  setDelta(els.incomeDelta, sumIncome(monthEntries) - sumIncome(previousEntries));
  renderLocalCurrencyAnalysis();
  renderBudgetAnalysis();
  if (els.aiAnalysisPanel && !els.aiAnalysisPanel.hidden) renderAiAnalysis();
}

function toggleAiAnalysis() {
  if (!els.aiAnalysisPanel) return;
  const willOpen = els.aiAnalysisPanel.hidden;
  els.aiAnalysisPanel.hidden = !willOpen;
  els.aiAnalysisButton?.classList.toggle("active", willOpen);
  if (willOpen) {
    renderAiAnalysis();
    els.aiAnalysisPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function renderAiAnalysis() {
  if (!els.aiAnalysisContent) return;
  const report = buildLocalAiAnalysis(selectedYear, selectedMonth);
  els.aiAnalysisContent.innerHTML = "";

  const summary = document.createElement("div");
  summary.className = "ai-summary-grid";
  summary.innerHTML = `
    <div><span>이번 달 지출</span><strong>${formatMoney(report.totalExpense)}</strong></div>
    <div><span>입력 건수</span><strong>${report.entryCount}건</strong></div>
    <div><span>최근 3개월 평균</span><strong>${formatMoney(report.previousAverage)}</strong></div>
  `;
  els.aiAnalysisContent.append(summary);

  const list = document.createElement("div");
  list.className = "ai-insight-list";
  report.insights.forEach((insight) => {
    const item = document.createElement("article");
    item.className = `ai-insight ${insight.tone || "neutral"}`;
    item.innerHTML = `
      <strong>${escapeHtml(insight.title)}</strong>
      <p>${escapeHtml(insight.body)}</p>
      ${insight.meta ? `<small>${escapeHtml(insight.meta)}</small>` : ""}
    `;
    list.append(item);
  });
  els.aiAnalysisContent.append(list);
}

function exportMonthlyReportPdf() {
  const report = buildMonthlyReport(selectedYear, selectedMonth);
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    alert("PDF 저장 창을 열 수 없습니다. 브라우저의 팝업 차단을 해제한 뒤 다시 시도해 주세요.");
    return;
  }

  reportWindow.document.write(buildMonthlyReportHtml(report));
  reportWindow.document.close();
  reportWindow.focus();
  setTimeout(() => reportWindow.print(), 350);
}

function buildMonthlyReport(year, month) {
  const monthEntries = getCountingEntries(getVisibleEntriesForMonth(year, month)).filter((entry) => isSameMonth(entry.date, year, month));
  const previousDate = new Date(year, month - 1, 1);
  const previousEntries = getCountingEntries(getVisibleEntriesForMonth(previousDate.getFullYear(), previousDate.getMonth()))
    .filter((entry) => isSameMonth(entry.date, previousDate.getFullYear(), previousDate.getMonth()));
  const expenses = monthEntries.filter(isConsumptionEntry);
  const incomes = monthEntries.filter(isIncomeEntry);
  const previousExpenses = previousEntries.filter(isConsumptionEntry);
  const previousIncomes = previousEntries.filter(isIncomeEntry);
  const majorTotals = Object.entries(totalBy(expenses, "major")).sort((a, b) => b[1] - a[1]);
  const topMajor = majorTotals[0]?.[0] || "";
  const minorTotals = topMajor ? Object.entries(totalBy(expenses.filter((entry) => entry.major === topMajor), "minor")).sort((a, b) => b[1] - a[1]) : [];
  const budgets = getBudgetBuckets().map((bucket) => {
    const key = monthKey(year, month);
    const allocation = Number((state.monthlyBudgets[key] || {})[bucket] || 0);
    const carryover = getBudgetCarryover(year, month, bucket);
    const spent = getBudgetUsageForMonth(year, month, bucket);
    return { bucket, allocation, carryover, spent, remaining: allocation + carryover - spent };
  }).filter((item) => item.allocation || item.carryover || item.spent);
  const cardTotals = state.cards
    .filter((card) => card.owner === currentUser)
    .map((card) => ({ name: card.name, total: getCardBillingTotal(card, year, month) }))
    .filter((card) => card.total > 0);
  const localCurrency = getLocalCurrencyMonthSummary(year, month, currentUser);
  const aiReport = buildLocalAiAnalysis(year, month);
  const missingBudgetEntries = getMissingBudgetEntriesForMonth(year, month);

  return {
    year,
    month,
    range: getMonthRangeLabel(year, month),
    owner: currentUser,
    totalExpense: sumConsumption(expenses),
    totalIncome: sumIncome(incomes),
    previousExpense: sumConsumption(previousExpenses),
    previousIncome: sumIncome(previousIncomes),
    entryCount: expenses.length + incomes.length,
    majorTotals,
    minorTotals,
    budgets,
    cardTotals,
    localCurrency,
    missingBudgetCount: missingBudgetEntries.length,
    insights: aiReport.insights,
    recommendations: buildReportRecommendations({ expenses, majorTotals, budgets, missingBudgetEntries, localCurrency, previousTotal: sumConsumption(previousExpenses), currentTotal: sumConsumption(expenses) })
  };
}

function buildReportRecommendations(report) {
  const recommendations = [];
  const [topMajor, topMajorAmount] = report.majorTotals[0] || [];
  if (topMajor && topMajorAmount > 0) {
    recommendations.push(`${topMajor} 지출이 가장 큽니다. 다음 달에는 이 항목에서 10%만 줄여도 약 ${formatMoney(Math.round(topMajorAmount * 0.1))}을 더 남길 수 있어요.`);
  }
  const overBudget = report.budgets.filter((item) => item.remaining < 0).sort((a, b) => a.remaining - b.remaining)[0];
  if (overBudget) {
    recommendations.push(`${overBudget.bucket} 예산을 ${formatMoney(Math.abs(overBudget.remaining))} 초과했습니다. 다음 달 배정액을 현실화하거나 이 항목 사용 전에 잔액을 먼저 확인하는 흐름이 좋아요.`);
  }
  const nearBudget = report.budgets.filter((item) => item.remaining >= 0 && item.allocation + item.carryover > 0 && item.spent / (item.allocation + item.carryover) >= 0.8).sort((a, b) => b.spent - a.spent)[0];
  if (!overBudget && nearBudget) {
    recommendations.push(`${nearBudget.bucket}는 사용 가능 금액의 ${Math.round(nearBudget.spent / (nearBudget.allocation + nearBudget.carryover) * 100)}%를 사용했습니다. 다음 달 중순에 한 번 더 점검하면 초과를 막기 좋아요.`);
  }
  if (report.missingBudgetEntries.length) {
    recommendations.push(`예산 항목 미지정 지출이 ${report.missingBudgetEntries.length}건 있습니다. 이 내역을 정리하면 생활비/식비/용돈별 남은 돈 계산이 더 정확해집니다.`);
  }
  if (report.localCurrency.balance > 0) {
    recommendations.push(`지역화폐 잔액이 ${formatMoney(report.localCurrency.balance)} 남아 있습니다. 다음 달 식비나 생활비 중 사용 가능한 곳에 우선 배정하면 현금 지출을 줄일 수 있어요.`);
  }
  if (!recommendations.length) {
    recommendations.push("이번 달은 큰 위험 신호가 적습니다. 다음 달에도 지출 입력 후 미지정 예산 항목만 빠르게 정리해 주세요.");
  }
  return recommendations;
}

function buildMonthlyReportHtml(report) {
  const expenseDelta = report.totalExpense - report.previousExpense;
  const incomeDelta = report.totalIncome - report.previousIncome;
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>${report.year}년 ${report.month + 1}월 우리집 가계부 리포트</title>
    <style>
      @page { size: A4; margin: 14mm; }
      * { box-sizing: border-box; }
      body { color: #1d2a24; font-family: "Segoe UI", "Noto Sans KR", sans-serif; margin: 0; }
      h1 { font-size: 24px; margin: 0 0 6px; }
      h2 { border-bottom: 2px solid #d9e2dc; font-size: 16px; margin: 24px 0 10px; padding-bottom: 6px; }
      p { color: #6d7d73; margin: 0 0 8px; }
      .summary { display: grid; gap: 8px; grid-template-columns: repeat(4, 1fr); margin-top: 16px; }
      .box { background: #f5f7f4; border: 1px solid #d9e2dc; border-radius: 8px; padding: 10px; }
      .box span { color: #6d7d73; display: block; font-size: 11px; font-weight: 800; margin-bottom: 4px; }
      .box strong { display: block; font-size: 16px; }
      table { border-collapse: collapse; font-size: 11px; margin-top: 8px; width: 100%; }
      th, td { border: 1px solid #d9e2dc; padding: 7px 8px; text-align: left; }
      th { background: #edf3ee; }
      td.amount, th.amount { text-align: right; white-space: nowrap; }
      ul { margin: 8px 0 0; padding-left: 18px; }
      li { margin-bottom: 6px; }
      .muted { color: #6d7d73; }
    </style>
  </head>
  <body>
    <h1>${report.year}년 ${report.month + 1}월 우리집 가계부 리포트</h1>
    <p>${escapeHtml(report.range)} · 현재 사용자 ${escapeHtml(report.owner)}</p>
    <section class="summary">
      <div class="box"><span>지출</span><strong>${formatMoney(report.totalExpense)}</strong></div>
      <div class="box"><span>수입</span><strong>${formatMoney(report.totalIncome)}</strong></div>
      <div class="box"><span>전월 대비 지출</span><strong>${formatSignedMoney(expenseDelta)}</strong></div>
      <div class="box"><span>전월 대비 수입</span><strong>${formatSignedMoney(incomeDelta)}</strong></div>
    </section>
    ${buildReportTable("소비 카테고리", ["카테고리", "금액"], report.majorTotals.slice(0, 8).map(([label, amount]) => [label, amount]))}
    ${buildReportTable("상위 대분류의 소분류", ["소분류", "금액"], report.minorTotals.slice(0, 8).map(([label, amount]) => [label, amount]))}
    ${buildBudgetReportTable(report.budgets)}
    ${buildReportTable("카드 결제 대금", ["카드", "금액"], report.cardTotals.map((item) => [item.name, item.total]))}
    <h2>지역화폐</h2>
    <p>잔액 ${formatMoney(report.localCurrency.balance)} · 사용 ${formatMoney(report.localCurrency.spent)} · 충전 ${formatMoney(report.localCurrency.charge)} · 보너스 ${formatMoney(report.localCurrency.bonus)} · 지원 ${formatMoney(report.localCurrency.support)}</p>
    <h2>자동 분석</h2>
    <ul>${report.insights.map((insight) => `<li><strong>${escapeHtml(insight.title)}</strong><br><span class="muted">${escapeHtml(insight.body)}</span></li>`).join("")}</ul>
    <h2>다음 달 소비 추천</h2>
    <ul>${report.recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
  </body>
</html>`;
}

function buildReportTable(title, headers, rows) {
  if (!rows.length) return `<h2>${escapeHtml(title)}</h2><p>표시할 내역이 없습니다.</p>`;
  return `
    <h2>${escapeHtml(title)}</h2>
    <table>
      <thead><tr>${headers.map((header, index) => `<th class="${index === 1 ? "amount" : ""}">${escapeHtml(header)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr><td>${escapeHtml(row[0])}</td><td class="amount">${formatMoney(row[1])}</td></tr>`).join("")}</tbody>
    </table>
  `;
}

function buildBudgetReportTable(budgets) {
  if (!budgets.length) return `<h2>예산 항목 현황</h2><p>표시할 예산 항목이 없습니다.</p>`;
  return `
    <h2>예산 항목 현황</h2>
    <table>
      <thead><tr><th>예산 항목</th><th class="amount">배정</th><th class="amount">이월</th><th class="amount">사용</th><th class="amount">남은 돈</th></tr></thead>
      <tbody>${budgets.map((item) => `
        <tr>
          <td>${escapeHtml(item.bucket)}</td>
          <td class="amount">${formatMoney(item.allocation)}</td>
          <td class="amount">${formatMoney(item.carryover)}</td>
          <td class="amount">${formatMoney(item.spent)}</td>
          <td class="amount">${formatMoney(item.remaining)}</td>
        </tr>
      `).join("")}</tbody>
    </table>
  `;
}

function formatSignedMoney(value) {
  return `${value >= 0 ? "+" : ""}${formatMoney(value)}`;
}

function buildLocalAiAnalysis(year, month) {
  const currentExpenses = getActualExpenseEntriesForMonth(year, month);
  const previousDate = new Date(year, month - 1, 1);
  const previousExpenses = getActualExpenseEntriesForMonth(previousDate.getFullYear(), previousDate.getMonth());
  const previousMonths = [1, 2, 3].map((offset) => new Date(year, month - offset, 1));
  const previousTotals = previousMonths.map((date) => sumConsumption(getActualExpenseEntriesForMonth(date.getFullYear(), date.getMonth())));
  const monthsWithData = previousTotals.filter((value) => value > 0);
  const previousAverage = monthsWithData.length ? Math.round(monthsWithData.reduce((sum, value) => sum + value, 0) / monthsWithData.length) : 0;
  const totalExpense = sumConsumption(currentExpenses);
  const previousTotal = sumConsumption(previousExpenses);
  const insights = [];

  if (!currentExpenses.length) {
    insights.push({
      tone: "neutral",
      title: "이번 달 입력이 아직 부족해요",
      body: "지출 내역이 쌓이면 많이 쓰는 카테고리, 반복되는 지출, 예산 위험 항목을 자동으로 짚어드릴게요.",
      meta: "외부 API 없이 현재 기기에 저장된 데이터만 사용합니다."
    });
    return { totalExpense, previousAverage, entryCount: currentExpenses.length, insights };
  }

  if (previousTotal > 0) {
    const diff = totalExpense - previousTotal;
    const percent = Math.round(Math.abs(diff) / previousTotal * 100);
    insights.push({
      tone: diff > 0 ? "warning" : "good",
      title: diff > 0 ? "지난달보다 지출 속도가 빨라졌어요" : "지난달보다 지출이 줄었어요",
      body: `${month + 1}월 지출은 지난달보다 ${formatMoney(Math.abs(diff))} ${diff > 0 ? "늘었고" : "줄었고"}, 비율로는 약 ${percent}% 차이입니다.`,
      meta: `지난달 ${formatMoney(previousTotal)} → 이번 달 ${formatMoney(totalExpense)}`
    });
  } else if (previousAverage > 0) {
    const diff = totalExpense - previousAverage;
    insights.push({
      tone: diff > 0 ? "warning" : "good",
      title: "최근 3개월 평균과 비교했어요",
      body: `이번 달 지출은 최근 3개월 평균보다 ${formatMoney(Math.abs(diff))} ${diff > 0 ? "높습니다" : "낮습니다"}.`,
      meta: `최근 3개월 평균 ${formatMoney(previousAverage)}`
    });
  }

  const majorTotals = Object.entries(totalBy(currentExpenses, "major")).sort((a, b) => b[1] - a[1]);
  const [topMajor, topMajorAmount] = majorTotals[0] || [];
  if (topMajor) {
    const share = totalExpense ? Math.round(topMajorAmount / totalExpense * 100) : 0;
    const topMajorEntries = currentExpenses.filter((entry) => entry.major === topMajor);
    const topMinor = Object.entries(totalBy(topMajorEntries, "minor")).sort((a, b) => b[1] - a[1])[0];
    insights.push({
      tone: share >= 45 ? "warning" : "neutral",
      title: `${topMajor} 지출 비중이 가장 커요`,
      body: `${topMajor}에 ${formatMoney(topMajorAmount)}을 사용해 이번 달 지출의 약 ${share}%를 차지합니다.${topMinor ? ` 그중 ${topMinor[0]}이 ${formatMoney(topMinor[1])}으로 가장 큽니다.` : ""}`,
      meta: "분석 탭의 카테고리 금액을 누르면 상세 내역을 확인할 수 있어요."
    });
  }

  const budgetInsights = getBudgetAiInsights(year, month);
  insights.push(...budgetInsights);

  const repeated = getRepeatedExpenseInsight(currentExpenses);
  if (repeated) insights.push(repeated);

  const savingTarget = getSavingTargetInsight(majorTotals, totalExpense);
  if (savingTarget) insights.push(savingTarget);

  const localCurrency = getLocalCurrencyMonthSummary(year, month, currentUser);
  if (localCurrency.spent > 0 || localCurrency.charge > 0 || localCurrency.support > 0) {
    insights.push({
      tone: "neutral",
      title: "지역화폐 흐름도 같이 봤어요",
      body: `이번 달 지역화폐 사용은 ${formatMoney(localCurrency.spent)}, 충전은 ${formatMoney(localCurrency.charge)}, 지원금은 ${formatMoney(localCurrency.support)}입니다.`,
      meta: `현재 잔액 ${formatMoney(localCurrency.balance)}`
    });
  }

  if (currentExpenses.length < 10) {
    insights.push({
      tone: "neutral",
      title: "데이터가 더 쌓이면 분석이 똑똑해져요",
      body: "최소 2~3개월 이상 기록이 쌓이면 특정 요일, 특정 정보, 반복 메모 기준으로 더 안정적인 절약 포인트를 찾을 수 있습니다.",
      meta: `현재 이번 달 지출 입력 ${currentExpenses.length}건`
    });
  }

  return { totalExpense, previousAverage, entryCount: currentExpenses.length, insights: insights.slice(0, 7) };
}

function getActualExpenseEntriesForMonth(year, month) {
  return getCountingEntries(getVisibleEntriesForMonth(year, month))
    .filter((entry) => isSameMonth(entry.date, year, month))
    .filter(isConsumptionEntry);
}

function getBudgetAiInsights(year, month) {
  const key = monthKey(year, month);
  const monthBudget = getMonthlyBudget(key);
  const results = getBudgetBuckets()
    .map((bucket) => {
      const allocation = Number(monthBudget[bucket] || 0);
      const carryover = getBudgetCarryover(year, month, bucket);
      const available = allocation + carryover;
      const spent = getBudgetUsageForMonth(year, month, bucket);
      return { bucket, allocation, carryover, available, spent, remaining: available - spent };
    })
    .filter((item) => item.available > 0 || item.spent > 0);

  const over = results.filter((item) => item.remaining < 0).sort((a, b) => a.remaining - b.remaining)[0];
  if (over) {
    return [{
      tone: "danger",
      title: `${over.bucket} 예산을 넘겼어요`,
      body: `${over.bucket}는 사용 가능 금액 ${formatMoney(over.available)}보다 ${formatMoney(Math.abs(over.remaining))} 더 사용했습니다.`,
      meta: `배정 ${formatMoney(over.allocation)} · 이월 ${formatMoney(over.carryover)} · 사용 ${formatMoney(over.spent)}`
    }];
  }

  const near = results
    .filter((item) => item.available > 0 && item.spent / item.available >= 0.8)
    .sort((a, b) => b.spent / b.available - a.spent / a.available)[0];
  if (near) {
    return [{
      tone: "warning",
      title: `${near.bucket} 예산이 거의 다 찼어요`,
      body: `${near.bucket}는 사용 가능 금액의 약 ${Math.round(near.spent / near.available * 100)}%를 사용했습니다. 남은 기간에는 이 항목을 먼저 조심하면 좋아요.`,
      meta: `남은 돈 ${formatMoney(near.remaining)}`
    }];
  }

  const best = results.filter((item) => item.available > 0 && item.remaining > 0).sort((a, b) => b.remaining - a.remaining)[0];
  return best ? [{
    tone: "good",
    title: `${best.bucket} 예산은 여유가 있어요`,
    body: `${best.bucket}는 아직 ${formatMoney(best.remaining)} 남았습니다. 이번 달 말까지 유지하면 다음 달로 이월되는 힘이 생깁니다.`,
    meta: `사용 ${formatMoney(best.spent)} / 가능 ${formatMoney(best.available)}`
  }] : [];
}

function getRepeatedExpenseInsight(entries) {
  const groups = entries.reduce((acc, entry) => {
    const key = `${entry.memo || "메모 없음"}|${entry.info || ""}`;
    if (!acc[key]) acc[key] = { memo: entry.memo || "메모 없음", info: entry.info || "", count: 0, amount: 0 };
    acc[key].count += 1;
    acc[key].amount += Number(entry.amount || 0);
    return acc;
  }, {});
  const repeated = Object.values(groups).filter((item) => item.count >= 2).sort((a, b) => b.amount - a.amount)[0];
  if (!repeated) return null;
  return {
    tone: repeated.amount >= 50000 ? "warning" : "neutral",
    title: "반복되는 지출이 보여요",
    body: `${repeated.memo} 내역이 이번 달 ${repeated.count}번 반복되어 총 ${formatMoney(repeated.amount)} 사용됐습니다. 소액 반복 지출은 월 합계로 보면 꽤 커질 수 있어요.`,
    meta: repeated.info ? `정보: ${repeated.info}` : ""
  };
}

function getSavingTargetInsight(majorTotals, totalExpense) {
  const fixedLike = new Set(["주거/통신", "세금/이자", "저축"]);
  const target = majorTotals.find(([major, amount]) => amount > 0 && !fixedLike.has(major));
  if (!target || !totalExpense) return null;
  const [major, amount] = target;
  const tenPercent = Math.round(amount * 0.1);
  if (tenPercent <= 0) return null;
  return {
    tone: "good",
    title: "저축을 늘릴 수 있는 현실적인 목표",
    body: `${major}에서 10%만 줄이면 이번 달 기준 약 ${formatMoney(tenPercent)}을 추가로 남길 수 있습니다. 크게 줄이기보다 가장 큰 유동 지출 하나만 작게 줄이는 전략이 좋습니다.`,
    meta: `${major} 현재 ${formatMoney(amount)}`
  };
}

function renderLocalCurrencyAnalysis() {
  if (!els.localCurrencyAnalysisBalance) return;
  const summary = getLocalCurrencyMonthSummary(selectedYear, selectedMonth, currentUser);
  els.localCurrencyAnalysisBalance.textContent = formatMoney(summary.balance);
  els.localCurrencyAnalysisSpent.textContent = formatMoney(summary.spent);
  els.localCurrencyAnalysisCharge.textContent = formatMoney(summary.charge);
  els.localCurrencyAnalysisBonus.textContent = formatMoney(summary.bonus);
  els.localCurrencyAnalysisSupport.textContent = formatMoney(summary.support);
  const panel = document.querySelector(".local-currency-analysis-panel");
  if (!panel) return;
  panel.classList.add("clickable-row");
  panel.tabIndex = 0;
  panel.setAttribute("role", "button");
  panel.setAttribute("aria-label", "지역화폐 사용 및 충전 내역 보기");
  const openDetail = () => {
    const entries = getLocalCurrencyDetailEntries(selectedYear, selectedMonth, currentUser);
    const spent = entries.filter((entry) => entry.detailTone === "expense").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const added = entries.filter((entry) => entry.detailTone === "charge" || entry.detailTone === "support").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    openAnalysisEntryDetail(
      "지역화폐 사용/충전 내역",
      entries,
      ["date", "kind", "category", "amount", "info", "memo", "budget"],
      getMonthRangeLabel(selectedYear, selectedMonth),
      `총 ${entries.length}건 / 사용 ${formatMoney(spent)} / 충전·지원 ${formatMoney(added)}`
    );
  };
  panel.onclick = openDetail;
  panel.onkeydown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail();
    }
  };
}

function renderBudgetAnalysis() {
  els.budgetAnalysisRange.textContent = `${selectedYear}년 ${selectedMonth + 1}월 1일~말일 기준`;
  els.budgetAnalysisList.innerHTML = "";
  const key = monthKey(selectedYear, selectedMonth);
  const monthBudget = getMonthlyBudget(key);
  const buckets = getBudgetBuckets();

  if (!buckets.length) {
    els.budgetAnalysisList.innerHTML = '<div class="empty-state">예산 항목이 없습니다. 설정에서 항목을 추가해 주세요.</div>';
    return;
  }

  buckets.forEach((bucket) => {
    const allocation = Number(monthBudget[bucket] || 0);
    const spent = getBudgetUsageForMonth(selectedYear, selectedMonth, bucket);
    const carryover = getBudgetCarryover(selectedYear, selectedMonth, bucket);
    const available = allocation + carryover;
    const remaining = available - spent;
    const row = document.createElement("div");
    row.className = `budget-analysis-row clickable-row${remaining < 0 ? " negative" : ""}`;
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `${bucket} 예산 항목 사용내역 보기`);
    row.innerHTML = `
      <div class="budget-name">
        <strong>${escapeHtml(bucket)}</strong>
        <small>배정 + 누적 이월 - 이번 달 사용</small>
      </div>
      <div class="budget-metrics">
        <div><span>배정</span><b>${formatMoney(allocation)}</b></div>
        <div><span>사용</span><b>${formatMoney(spent)}</b></div>
        <div><span>이월</span><b>${formatMoney(carryover)}</b></div>
        <div><span>남은 돈</span><b>${formatMoney(remaining)}</b></div>
      </div>
    `;
    const openBudgetDetail = () => {
      const entries = getBudgetEntriesForMonth(selectedYear, selectedMonth, bucket);
      openAnalysisEntryDetail(`${bucket} 예산 항목 사용내역`, entries, ["date", "category", "amount", "info", "memo", "budget"]);
    };
    row.addEventListener("click", openBudgetDetail);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openBudgetDetail();
      }
    });
    els.budgetAnalysisList.append(row);
  });
}

function getBudgetUsageForMonth(year, month, bucket) {
  return getBudgetEntriesForMonth(year, month, bucket)
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function getBudgetEntriesForMonth(year, month, bucket) {
  return getCountingEntries(getVisibleEntriesForMonth(year, month))
    .filter((entry) => isSameMonth(entry.date, year, month))
    .filter((entry) => isConsumptionEntry(entry) && entry.budget === bucket)
    .sort((a, b) => a.date.localeCompare(b.date) || String(a.memo || "").localeCompare(String(b.memo || "")));
}

function getBudgetCarryover(year, month, bucket) {
  let carryover = 0;
  const start = getBudgetStartMonth(year, month);
  const cursor = new Date(start.year, start.month, 1);
  const end = new Date(year, month, 1);
  while (cursor < end) {
    const key = monthKey(cursor.getFullYear(), cursor.getMonth());
    const allocation = Number((state.monthlyBudgets[key] || {})[bucket] || 0);
    const spent = getBudgetUsageForMonth(cursor.getFullYear(), cursor.getMonth(), bucket);
    carryover += allocation - spent;
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return carryover;
}

function getBudgetStartMonth(year, month) {
  const candidates = [new Date(year, month, 1)];
  Object.keys(state.monthlyBudgets || {}).forEach((key) => {
    if (Object.values(state.monthlyBudgets[key] || {}).some((value) => Number(value || 0) > 0)) {
      candidates.push(parseMonthKey(key));
    }
  });
  state.entries.forEach((entry) => {
    if (entry.budget && isConsumptionEntry(entry)) {
      candidates.push(new Date(parseDate(entry.startDate || entry.date).getFullYear(), parseDate(entry.startDate || entry.date).getMonth(), 1));
    }
  });
  const earliest = candidates.sort((a, b) => a - b)[0];
  return { year: earliest.getFullYear(), month: earliest.getMonth() };
}

function getLocalCurrencyTransactions(owner = currentUser) {
  return (state.localCurrency?.transactions || []).filter((item) => item.owner === owner);
}

function getLocalCurrencyTransactionIncrease(item) {
  return Number(item.amount || 0) + Number(item.bonus || 0);
}

function getLocalCurrencyStartDate(owner = currentUser) {
  const dates = [new Date()];
  getLocalCurrencyTransactions(owner).forEach((item) => dates.push(parseDate(item.date)));
  state.entries.forEach((entry) => {
    if (entry.owner === owner && entry.info === LOCAL_CURRENCY_PAYMENT) dates.push(parseDate(entry.startDate || entry.date));
  });
  return dates.sort((a, b) => a - b)[0];
}

function getLocalCurrencyExpenseEntries(start, end, owner = currentUser) {
  const oneTimeExpenses = state.entries.filter((entry) => entry.type === "expense" && entry.owner === owner && entry.info === LOCAL_CURRENCY_PAYMENT);
  const fixedExpenses = state.entries
    .filter((entry) => entry.type === "fixed-expense" && entry.owner === owner && entry.info === LOCAL_CURRENCY_PAYMENT)
    .flatMap((entry) => monthsInRange(start, end).flatMap(({ year, month }) => expandFixedEntry(entry, year, month)));

  return [...oneTimeExpenses, ...fixedExpenses].filter((entry) => {
    const date = parseDate(entry.date);
    return date >= start && date <= end;
  });
}

function getLocalCurrencyDetailEntries(year, month, owner = currentUser) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  const expenses = getLocalCurrencyExpenseEntries(start, end, owner)
    .filter((entry) => isSameMonth(entry.date, year, month))
    .map((entry) => ({
      ...entry,
      detailKind: "사용",
      detailTone: "expense"
    }));
  const transactions = getLocalCurrencyTransactions(owner)
    .filter((item) => {
      const date = parseDate(item.date);
      return date >= start && date <= end;
    })
    .map((item) => {
      const isSupport = item.kind === "support";
      const bonusText = !isSupport && item.bonus ? `충전 ${formatMoney(item.amount)} + 보너스 ${formatMoney(item.bonus)}` : "";
      return {
        id: item.id,
        type: "local-currency-transaction",
        date: item.date,
        major: "지역화폐",
        minor: isSupport ? "경기기후동행" : "충전",
        amount: getLocalCurrencyTransactionIncrease(item),
        info: isSupport ? "지원금" : "충전",
        memo: [item.memo, bonusText].filter(Boolean).join(" · ") || "-",
        budget: "잔액",
        detailKind: isSupport ? "지원" : "충전",
        detailTone: isSupport ? "support" : "charge"
      };
    });

  return [...expenses, ...transactions].sort((a, b) => a.date.localeCompare(b.date) || String(a.detailKind || "").localeCompare(String(b.detailKind || "")));
}

function getLocalCurrencySpentBetween(start, end, owner = currentUser) {
  return getLocalCurrencyExpenseEntries(start, end, owner).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function getLocalCurrencyBalance(owner = currentUser, asOf = new Date()) {
  const settings = getLocalCurrencySettings(owner);
  const end = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate(), 23, 59, 59);
  const start = getLocalCurrencyStartDate(owner);
  const added = getLocalCurrencyTransactions(owner)
    .filter((item) => parseDate(item.date) <= end)
    .reduce((sum, item) => sum + getLocalCurrencyTransactionIncrease(item), 0);
  const spent = getLocalCurrencySpentBetween(start, end, owner);
  return Number(settings.initialBalance || 0) + added - spent;
}

function getLocalCurrencyMonthSummary(year, month, owner = currentUser) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  const transactions = getLocalCurrencyTransactions(owner).filter((item) => {
    const date = parseDate(item.date);
    return date >= start && date <= end;
  });
  return {
    balance: getLocalCurrencyBalance(owner, end),
    spent: getLocalCurrencySpentBetween(start, end, owner),
    charge: transactions.filter((item) => item.kind === "charge").reduce((sum, item) => sum + Number(item.amount || 0), 0),
    bonus: transactions.reduce((sum, item) => sum + Number(item.bonus || 0), 0),
    support: transactions.filter((item) => item.kind === "support").reduce((sum, item) => sum + Number(item.amount || 0), 0)
  };
}

function renderPie(chart, legend, totals, onSelect) {
  const entries = Object.entries(totals).filter(([, value]) => value > 0);
  chart.style.background = "#edf3ee";
  legend.innerHTML = "";

  if (!entries.length) {
    legend.innerHTML = '<li><span></span><span>데이터 없음</span><b>0원</b></li>';
    return;
  }

  const sum = entries.reduce((total, [, value]) => total + value, 0);
  let start = 0;
  const gradient = entries
    .map(([, value], index) => {
      const end = start + (value / sum) * 100;
      const slice = `${palette[index % palette.length]} ${start}% ${end}%`;
      start = end;
      return slice;
    })
    .join(", ");
  chart.style.background = `conic-gradient(${gradient})`;

  entries.forEach(([label, value], index) => {
    const item = document.createElement("li");
    if (onSelect) {
      item.classList.add("clickable-legend");
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", `${label} 사용내역 보기`);
      item.addEventListener("click", () => onSelect(label));
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(label);
        }
      });
    }
    item.innerHTML = `<i style="background:${palette[index % palette.length]}"></i><span>${escapeHtml(label)}</span><b>${formatMoney(value)}</b>`;
    legend.append(item);
  });
}

function openAnalysisEntryDetail(title, entries, columns, caption = getMonthRangeLabel(selectedYear, selectedMonth), summaryText = "", options = {}) {
  els.analysisDetailTitle.textContent = title;
  els.analysisDetailContent.innerHTML = "";

  const description = document.createElement("p");
  description.className = "analysis-detail-caption";
  const total = entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  description.innerHTML = `
    <span>${escapeHtml(caption)}</span>
    <strong>${escapeHtml(summaryText || `총 ${entries.length}건 / ${formatMoney(total)}`)}</strong>
  `;
  els.analysisDetailContent.append(description);

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "해당 내역이 없습니다.";
    els.analysisDetailContent.append(empty);
    els.analysisDetailModal.showModal();
    return;
  }

  const list = document.createElement("div");
  list.className = "analysis-detail-list";
  const templateColumns = getAnalysisDetailGrid(columns);
  list.append(createAnalysisDetailHeader(columns, templateColumns));
  entries.forEach((entry) => list.append(createAnalysisDetailRow(entry, columns, templateColumns, options.onEntrySelect)));
  els.analysisDetailContent.append(list);
  els.analysisDetailModal.showModal();
}

function createAnalysisDetailHeader(columns, templateColumns) {
  const row = document.createElement("div");
  row.className = "analysis-detail-row analysis-detail-head";
  row.style.gridTemplateColumns = templateColumns;
  columns.forEach((column) => {
    const cell = document.createElement("span");
    cell.textContent = analysisDetailColumnLabel(column);
    row.append(cell);
  });
  return row;
}

function createAnalysisDetailRow(entry, columns, templateColumns, onEntrySelect) {
  const row = document.createElement("div");
  row.className = `analysis-detail-row${entry.detailTone ? ` analysis-detail-${entry.detailTone}` : ""}`;
  row.style.gridTemplateColumns = templateColumns;
  if (onEntrySelect) {
    row.classList.add("clickable-row");
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `${entry.memo || entry.minor || "내역"} 수정하기`);
    row.addEventListener("click", () => {
      els.analysisDetailModal.close();
      onEntrySelect(entry);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        els.analysisDetailModal.close();
        onEntrySelect(entry);
      }
    });
  }
  columns.forEach((column) => {
    const cell = document.createElement(column === "amount" ? "b" : "span");
    cell.className = `analysis-detail-cell analysis-detail-cell-${column}`;
    cell.textContent = analysisDetailValue(entry, column);
    cell.title = cell.textContent;
    row.append(cell);
  });
  return row;
}

function openEditableAnalysisEntry(entry) {
  if (!entry || entry.isCardPayment || entry.type === "card-payment") return;
  openEntryModal(entry);
}

function analysisDetailColumnLabel(column) {
  return {
    date: "사용 날짜",
    kind: "구분",
    category: "분류",
    amount: "금액",
    info: "정보",
    memo: "메모",
    budget: "예산항목"
  }[column] || column;
}

function analysisDetailValue(entry, column) {
  if (column === "date") return formatShortMonthDay(entry.date);
  if (column === "kind") return entry.detailKind || typeLabels[entry.type] || "-";
  if (column === "category") return `${entry.major || "-"} / ${entry.minor || "-"}`;
  if (column === "amount") {
    const money = formatMoney(entry.amount);
    if (entry.detailTone === "charge" || entry.detailTone === "support") return `+${money}`;
    if (entry.detailTone === "expense") return `-${money}`;
    return money;
  }
  if (column === "info") return entry.info || "-";
  if (column === "memo") return entry.memo || "-";
  if (column === "budget") return entry.budget || "미지정";
  return "";
}

function getAnalysisDetailGrid(columns) {
  const sizes = {
    date: "0.72fr",
    kind: "0.6fr",
    category: "1.45fr",
    amount: "1.08fr",
    info: "0.92fr",
    memo: "1fr",
    budget: "0.9fr"
  };
  return columns.map((column) => `minmax(0, ${sizes[column] || "1fr"})`).join(" ");
}

function getMonthRangeLabel(year, month) {
  return `${year}년 ${month + 1}월 1일 ~ ${daysInMonth(year, month)}일 기준`;
}

function getCardBillingRangeLabel(card, year, month) {
  const start = new Date(year, month - 1, card.billingStartDay);
  const end = new Date(year, month, card.billingStartDay);
  end.setDate(end.getDate() - 1);
  return `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일 사용분`;
}

function formatShortMonthDay(dateKey) {
  if (!dateKey) return "";
  const date = parseDate(dateKey);
  if (Number.isNaN(date.getTime())) return dateKey;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function setDelta(element, value) {
  element.textContent = `${value >= 0 ? "+" : ""}${formatMoney(value)}`;
  element.classList.toggle("delta-positive", value >= 0);
  element.classList.toggle("delta-negative", value < 0);
}

function renderCards() {
  els.cardSettings.innerHTML = "";
  const visibleCards = state.cards.filter((card) => card.owner === currentUser);
  if (!visibleCards.length) {
    const empty = document.createElement("div");
    empty.className = "empty-card";
    empty.textContent = `${currentUser} 소유 카드가 없습니다. + 버튼으로 카드를 추가해 주세요.`;
    els.cardSettings.append(empty);
    return;
  }

  visibleCards.forEach((card) => {
    const row = document.createElement("div");
    row.className = "card-row card-config-row";
    row.innerHTML = `
      <label>
        <span>소유자</span>
        <select class="card-owner-select" aria-label="카드 소유자">${userOptions(card.owner)}</select>
      </label>
      <label>
        <span>카드사</span>
        <input class="card-name-input" value="${escapeAttr(card.name)}" aria-label="카드사">
      </label>
      <label>
        <span>카드 산정일</span>
        <select class="card-start-select" aria-label="카드 산정일">${dayOptions(card.billingStartDay)}</select>
      </label>
      <label>
        <span>카드 대금 결제일</span>
        <select class="card-payment-select" aria-label="카드 대금 결제일">${dayOptions(card.paymentDay)}</select>
      </label>
    `;
    const primaryLabel = document.createElement("label");
    primaryLabel.className = "primary-card-toggle";
    primaryLabel.innerHTML = `
      <input class="card-primary-input" type="checkbox" ${card.primary ? "checked" : ""} />
      <span>주요 카드</span>
    `;
    const deleteButton = document.createElement("button");
    deleteButton.className = "danger-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", async () => {
      if (!(await confirmDelete(`카드 "${card.name}"을(를) 삭제합니다.`))) return;
      state.cards = state.cards.filter((item) => item.id !== card.id);
      saveState();
      renderAll();
    });
    row.append(primaryLabel, deleteButton);

    const ownerSelect = row.querySelector(".card-owner-select");
    const nameInput = row.querySelector(".card-name-input");
    const startSelect = row.querySelector(".card-start-select");
    const paymentSelect = row.querySelector(".card-payment-select");
    const primaryInput = row.querySelector(".card-primary-input");
    ownerSelect.addEventListener("change", () => {
      card.owner = ownerSelect.value;
      state.cards = normalizePrimaryCards(state.cards);
      saveState();
      renderAll();
    });
    nameInput.addEventListener("change", () => {
      card.name = nameInput.value.trim() || card.name;
      saveState();
      renderAll();
    });
    startSelect.addEventListener("change", () => {
      card.billingStartDay = Number(startSelect.value);
      saveState();
      renderAll();
    });
    paymentSelect.addEventListener("change", () => {
      card.paymentDay = Number(paymentSelect.value);
      saveState();
      renderAll();
    });
    primaryInput.addEventListener("change", () => setPrimaryCard(card.id, primaryInput.checked));
    els.cardSettings.append(row);
  });
}

function setPrimaryCard(cardId, checked) {
  const target = state.cards.find((card) => card.id === cardId);
  if (!target) return;
  state.cards = state.cards.map((card) => {
    if (card.owner !== target.owner) return card;
    return { ...card, primary: checked && card.id === cardId };
  });
  saveState();
  renderAll();
}

function resetCardForm() {
  els.cardNameInput.value = "";
  els.cardStartDay.innerHTML = dayOptions(1);
  els.cardPaymentDay.innerHTML = dayOptions(25);
}

function handleCardSubmit(event) {
  event.preventDefault();
  const name = els.cardNameInput.value.trim();
  if (!name) {
    alert("카드사를 입력해 주세요.");
    return;
  }
  state.cards.push({
    id: makeId(),
    name,
    owner: currentUser,
    billingStartDay: Number(els.cardStartDay.value || 1),
    paymentDay: Number(els.cardPaymentDay.value || 25)
  });
  saveState();
  resetCardForm();
  renderAll();
}

function renderPaymentSelects(options = {}) {
  const { resetEntry = false } = options;
  const currentEntryInfo = getPaymentOptions(currentUser).includes(els.entryInfo.value) ? els.entryInfo.value : "";
  fillPaymentSelect(els.entryInfo, resetEntry ? getDefaultEntryPayment() : currentEntryInfo || getDefaultEntryPayment());
  fillPaymentSelect(els.fixedInfo, els.fixedInfo.value || "계좌이체");
}

function renderBudgetSelects() {
  fillBudgetSelect(els.entryBudget, els.entryBudget.value || "");
  fillBudgetSelect(els.fixedBudget, els.fixedBudget.value || "");
}

function fillBudgetSelect(select, selected = "") {
  if (!select) return;
  const buckets = getBudgetBuckets();
  select.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "미지정";
  select.append(empty);
  buckets.forEach((bucket) => {
    const option = document.createElement("option");
    option.value = bucket;
    option.textContent = bucket;
    select.append(option);
  });
  select.value = buckets.includes(selected) ? selected : "";
}

function fillPaymentSelect(select, selected) {
  const options = getPaymentOptions(currentUser);
  if (selected && !options.includes(selected)) options.push(selected);
  select.innerHTML = "";
  options.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.append(option);
  });
  select.value = selected && options.includes(selected) ? selected : options[0];
}

function getPaymentOptions(owner = currentUser) {
  return unique([...state.cards.filter((card) => card.owner === owner).map((card) => card.name), "현금", "계좌이체", "교통카드", LOCAL_CURRENCY_PAYMENT]);
}

function getDefaultEntryPayment(owner = currentUser) {
  return state.cards.find((card) => card.owner === owner && card.primary)?.name || "현금";
}

function userOptions(selected) {
  return getUsers().map((user) => `<option value="${escapeAttr(user)}"${user === selected ? " selected" : ""}>${escapeHtml(user)}</option>`).join("");
}

function dayOptions(selected) {
  let html = "";
  for (let day = 1; day <= 31; day += 1) {
    html += `<option value="${day}"${day === selected ? " selected" : ""}>${day}일</option>`;
  }
  return html;
}

function renderMonthlyBudgetSettings() {
  const key = monthKey(selectedYear, selectedMonth);
  const values = getMonthlyBudget(key);
  const buckets = getBudgetBuckets();
  els.budgetMonthCaption.textContent = `${selectedYear}년 ${selectedMonth + 1}월 1일 기준 · 만원 단위로 입력`;
  els.monthlyBudgetList.innerHTML = "";

  if (!buckets.length) {
    els.monthlyBudgetList.innerHTML = '<div class="empty-state">예산 항목이 없습니다. 위에서 항목을 추가해 주세요.</div>';
    return;
  }

  buckets.forEach((bucket) => {
    const row = document.createElement("div");
    row.className = "budget-setting-row";
    row.innerHTML = `
      <span>${escapeHtml(bucket)}</span>
      <div>
        <input type="number" min="0" step="1" inputmode="numeric" data-budget-bucket="${escapeAttr(bucket)}" value="${formatBudgetInput(values[bucket] || 0)}" />
        <em>만원</em>
      </div>
      <button class="danger-button budget-delete-button" type="button" data-budget-delete="${escapeAttr(bucket)}">삭제</button>
    `;
    els.monthlyBudgetList.append(row);
  });

  els.monthlyBudgetList.querySelectorAll("[data-budget-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteBudgetBucket(button.dataset.budgetDelete));
  });
}

function resetLocalCurrencyForm() {
  if (!els.localCurrencyDate) return;
  els.localCurrencyDate.value = toDateKey(new Date());
  els.localCurrencyKind.value = "charge";
  els.localCurrencyAmount.value = "";
  els.localCurrencyMemo.value = "";
}

function renderLocalCurrencySettings() {
  if (!els.localCurrencyBalance) return;
  const settings = getLocalCurrencySettings(currentUser);
  if (document.activeElement !== els.localCurrencyInitial) els.localCurrencyInitial.value = String(settings.initialBalance || 0);
  if (document.activeElement !== els.localCurrencyBonusRate) els.localCurrencyBonusRate.value = String(settings.bonusRate ?? LOCAL_CURRENCY_DEFAULT_RATE);
  els.localCurrencyBalance.textContent = formatMoney(getLocalCurrencyBalance(currentUser));
  renderLocalCurrencyList();
}

function renderLocalCurrencyList() {
  els.localCurrencyList.innerHTML = "";
  const transactions = getLocalCurrencyTransactions(currentUser).sort((a, b) => b.date.localeCompare(a.date));
  if (!transactions.length) {
    els.localCurrencyList.innerHTML = '<div class="empty-state">지역화폐 충전/추가 내역이 없습니다.</div>';
    return;
  }

  transactions.forEach((item) => {
    const row = document.createElement("div");
    row.className = "local-currency-row";
    row.innerHTML = `
      <div>
        <strong>${item.kind === "charge" ? "충전" : "경기기후동행"}</strong>
        <small>${item.date} · ${escapeHtml(item.memo || "메모 없음")}</small>
      </div>
      <div class="local-currency-amounts">
        <span>${formatMoney(item.amount)}</span>
        ${item.bonus ? `<small>보너스 ${formatMoney(item.bonus)}</small>` : ""}
      </div>
    `;
    const deleteButton = document.createElement("button");
    deleteButton.className = "danger-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", async () => {
      if (!(await confirmDelete("지역화폐 내역을 삭제합니다."))) return;
      state.localCurrency.transactions = state.localCurrency.transactions.filter((tx) => tx.id !== item.id);
      saveState();
      renderAll();
    });
    row.append(deleteButton);
    els.localCurrencyList.append(row);
  });
}

function handleLocalCurrencySettingsSubmit(event) {
  event.preventDefault();
  const settings = getLocalCurrencySettings(currentUser);
  settings.initialBalance = Number(els.localCurrencyInitial.value || 0);
  settings.bonusRate = Number(els.localCurrencyBonusRate.value || 0);
  saveState();
  renderAll();
  alert("지역화폐 설정을 저장했습니다.");
}

function handleLocalCurrencyTransactionSubmit(event) {
  event.preventDefault();
  const amount = Number(els.localCurrencyAmount.value || 0);
  if (!els.localCurrencyDate.value || amount <= 0) {
    alert("날짜와 금액을 입력해 주세요.");
    return;
  }
  const kind = els.localCurrencyKind.value === "support" ? "support" : "charge";
  const settings = getLocalCurrencySettings(currentUser);
  const bonus = kind === "charge" ? Math.round(amount * Number(settings.bonusRate || 0) / 100) : 0;
  state.localCurrency.transactions.push({
    id: makeId(),
    owner: currentUser,
    date: els.localCurrencyDate.value,
    kind,
    amount,
    bonus,
    memo: els.localCurrencyMemo.value.trim(),
    createdAt: new Date().toISOString()
  });
  saveState();
  resetLocalCurrencyForm();
  renderAll();
}

function handleMonthlyBudgetSubmit(event) {
  event.preventDefault();
  const key = monthKey(selectedYear, selectedMonth);
  state.monthlyBudgets[key] = {};
  els.monthlyBudgetList.querySelectorAll("[data-budget-bucket]").forEach((input) => {
    state.monthlyBudgets[key][input.dataset.budgetBucket] = Math.round(Number(input.value || 0) * 10000);
  });
  saveState();
  renderAll();
  alert(`${selectedYear}년 ${selectedMonth + 1}월 예산 배정액을 저장했습니다.`);
}

function getMonthlyBudget(key) {
  if (!state.monthlyBudgets[key]) {
    state.monthlyBudgets[key] = {};
  }
  getBudgetBuckets().forEach((bucket) => {
    if (!Object.prototype.hasOwnProperty.call(state.monthlyBudgets[key], bucket)) state.monthlyBudgets[key][bucket] = 0;
  });
  return state.monthlyBudgets[key];
}

function handleBudgetBucketSubmit(event) {
  event.preventDefault();
  const bucket = els.budgetBucketName.value.trim();
  if (!bucket) {
    alert("추가할 예산 항목 이름을 입력해 주세요.");
    return;
  }
  if (getBudgetBuckets().includes(bucket)) {
    alert("이미 있는 예산 항목입니다.");
    return;
  }

  state.budgetBuckets = [...getBudgetBuckets(), bucket];
  Object.keys(state.monthlyBudgets || {}).forEach((key) => {
    state.monthlyBudgets[key][bucket] = 0;
  });
  els.budgetBucketName.value = "";
  saveState();
  renderAll();
}

async function deleteBudgetBucket(bucket) {
  if (!bucket) return;
  const linkedCount =
    state.entries.filter((entry) => entry.budget === bucket).length +
    state.templates.filter((template) => template.budget === bucket).length;
  const message = linkedCount
    ? `"${bucket}" 예산 항목을 삭제할까요? 연결된 입력/퀵 입력 ${linkedCount}개의 예산 항목은 미지정으로 바뀝니다.`
    : `"${bucket}" 예산 항목을 삭제할까요?`;
  if (!(await confirmDelete(message))) return;

  state.budgetBuckets = getBudgetBuckets().filter((item) => item !== bucket);
  Object.keys(state.monthlyBudgets || {}).forEach((key) => {
    delete state.monthlyBudgets[key][bucket];
  });
  state.entries = state.entries.map((entry) => (entry.budget === bucket ? { ...entry, budget: "" } : entry));
  state.templates = state.templates.map((template) => (template.budget === bucket ? { ...template, budget: "" } : template));
  saveState();
  renderAll();
}

function formatBudgetInput(value) {
  const manwon = Number(value || 0) / 10000;
  return Number.isInteger(manwon) ? String(manwon) : String(Math.round(manwon * 10) / 10);
}

function handleCategorySubmit(event, type) {
  event.preventDefault();
  const majorInput = type === "income" ? els.incomeMajor : els.expenseMajor;
  const minorInput = type === "income" ? els.incomeMinor : els.expenseMinor;
  addCategory(majorInput.value, minorInput.value, type);
  minorInput.value = "";
  renderCategoryOptions(type);
}

function renderCategories() {
  renderCategoryColumn("expense", els.expenseCategoryTree);
  renderCategoryColumn("income", els.incomeCategoryTree);
}

function renderCategoryColumn(type, target) {
  target.innerHTML = "";
  Object.entries(state.categories[type]).forEach(([major, minors]) => {
    const group = document.createElement("div");
    group.className = "category-group";
    group.innerHTML = `
      <div class="category-title">
        <span>${escapeHtml(major)}</span>
        <small>${minors.length}개</small>
      </div>
      <div class="minor-list"></div>
    `;
    const minorList = group.querySelector(".minor-list");
    minors.forEach((minor) => {
      const pill = document.createElement("span");
      pill.className = "minor-pill";
      pill.innerHTML = `<span>${escapeHtml(minor)}</span>`;
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.title = "소분류 삭제";
      deleteButton.textContent = "×";
      deleteButton.addEventListener("click", () => deleteMinorCategory(type, major, minor));
      pill.append(deleteButton);
      minorList.append(pill);
    });
    target.append(group);
  });
}

function renderCategoryOptions(type) {
  if (!type || type === "expense") renderCategoryOptionSet("expense", els.expenseMajor, els.expenseMajorOptions, els.expenseMinorOptions);
  if (!type || type === "income") renderCategoryOptionSet("income", els.incomeMajor, els.incomeMajorOptions, els.incomeMinorOptions);
}

function renderCategoryOptionSet(type, majorInput, majorOptions, minorOptions) {
  const categories = state.categories[type] || {};
  const major = majorInput.value.trim();
  fillDatalist(majorOptions, Object.keys(categories));
  fillDatalist(minorOptions, categories[major] || []);
}

function bindCategorySuggest(type) {
  const { majorInput, minorInput } = categorySuggestElements(type);

  majorInput.addEventListener("focus", () => showCategorySuggest(type, "major", { filter: false }));
  majorInput.addEventListener("click", () => showCategorySuggest(type, "major", { filter: false }));
  majorInput.addEventListener("input", () => {
    renderCategoryOptions(type);
    showCategorySuggest(type, "major", { filter: true });
  });
  majorInput.addEventListener("change", () => renderCategoryOptions(type));

  minorInput.addEventListener("focus", () => showCategorySuggest(type, "minor", { filter: false }));
  minorInput.addEventListener("click", () => showCategorySuggest(type, "minor", { filter: false }));
  minorInput.addEventListener("input", () => showCategorySuggest(type, "minor", { filter: true }));
}

function categorySuggestElements(type) {
  return type === "income"
    ? {
        majorInput: els.incomeMajor,
        minorInput: els.incomeMinor,
        majorMenu: els.incomeMajorSuggest,
        minorMenu: els.incomeMinorSuggest
      }
    : {
        majorInput: els.expenseMajor,
        minorInput: els.expenseMinor,
        majorMenu: els.expenseMajorSuggest,
        minorMenu: els.expenseMinorSuggest
      };
}

function showCategorySuggest(type, field, options = {}) {
  const { majorInput, minorInput, majorMenu, minorMenu } = categorySuggestElements(type);
  const isMajor = field === "major";
  const input = isMajor ? majorInput : minorInput;
  const menu = isMajor ? majorMenu : minorMenu;
  const categories = state.categories[type] || {};
  const baseValues = isMajor ? Object.keys(categories) : categories[majorInput.value.trim()] || [];
  const query = options.filter ? input.value.trim().toLowerCase() : "";
  const values = baseValues.filter((value) => !query || value.toLowerCase().includes(query));

  hideCategorySuggests(menu);
  menu.innerHTML = "";
  if (!values.length) {
    menu.classList.remove("open");
    return;
  }

  values.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = value;
    button.addEventListener("pointerdown", (event) => event.preventDefault());
    button.addEventListener("click", () => {
      input.value = value;
      if (isMajor) {
        minorInput.value = "";
        renderCategoryOptions(type);
        setTimeout(() => {
          minorInput.focus();
          showCategorySuggest(type, "minor", { filter: false });
        }, 0);
      }
      hideCategorySuggests();
    });
    menu.append(button);
  });
  menu.classList.add("open");
}

function hideCategorySuggests(exceptMenu = null) {
  [els.expenseMajorSuggest, els.expenseMinorSuggest, els.incomeMajorSuggest, els.incomeMinorSuggest].forEach((menu) => {
    if (!menu || menu === exceptMenu) return;
    menu.classList.remove("open");
  });
}

function addCategory(majorRaw, minorRaw, type = "expense") {
  const major = majorRaw.trim();
  const minor = minorRaw.trim();
  if (!major || !minor) {
    alert("대분류와 소분류를 모두 입력해 주세요.");
    return;
  }
  const target = state.categories[type] || state.categories.expense;
  if (!target[major]) target[major] = [];
  if (!target[major].includes(minor)) target[major].push(minor);
  saveState();
  renderAll();
}

async function deleteMinorCategory(type, major, minor) {
  if (!(await confirmDelete(`"${major} > ${minor}" 소분류를 삭제합니다.`))) return;
  const target = state.categories[type] || state.categories.expense;
  target[major] = (target[major] || []).filter((item) => item !== minor);
  if (!target[major].length) delete target[major];
  saveState();
  renderAll();
}

function handleQuickCategory(event) {
  event.preventDefault();
  const action = event.submitter?.value;
  if (action === "save") {
    const type = els.quickCategoryType.value;
    addCategory(els.quickMajor.value, els.quickMinor.value, type);
    if (type === entryType) {
      els.majorCategory.value = els.quickMajor.value.trim();
      populateMinorSelect();
      els.minorCategory.value = els.quickMinor.value.trim();
    }
  }
  els.categoryModal.close();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  downloadBlob(blob, `우리집-가계부-${APP_RELEASE_VERSION}-백업-${toDateKey(new Date())}.json`);
}

function exportExcel() {
  const rows = buildLedgerExportRows();
  if (rows.length <= 1) {
    alert("엑셀로 내보낼 입력 내역이 없습니다.");
    return;
  }
  const blob = createXlsxBlob(rows);
  downloadBlob(blob, `우리집-가계부-${APP_RELEASE_VERSION}-내역-${toDateKey(new Date())}.xlsx`);
}

function buildLedgerExportRows() {
  const entries = state.entries
    .filter((entry) => ["expense", "income", "fixed-expense", "fixed-income"].includes(entry.type))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || String(a.createdAt || "").localeCompare(String(b.createdAt || "")) || String(a.memo || "").localeCompare(String(b.memo || "")));

  return [
    ["날짜", "대분류", "소분류", "금액", "정보", "예산항목", "메모"],
    ...entries.map((entry) => [
      entry.date || "",
      entry.major || "",
      entry.minor || "",
      Number(entry.amount || 0),
      entry.info || "",
      entry.budget || "",
      entry.memo || ""
    ])
  ];
}

function createXlsxBlob(rows) {
  const now = new Date().toISOString();
  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`,
    "docProps/app.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>우리집 가계부</Application>
</Properties>`,
    "docProps/core.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>우리집 가계부 내역</dc:title>
  <dc:creator>우리집 가계부</dc:creator>
  <cp:lastModifiedBy>우리집 가계부</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="내역" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    "xl/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>
</styleSheet>`,
    "xl/worksheets/sheet1.xml": createSheetXml(rows)
  };
  return createZipBlob(files, XLSX_MIME);
}

function createSheetXml(rows) {
  const widths = [13, 18, 18, 13, 18, 18, 34];
  const columns = widths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join("");
  const sheetRows = rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 1;
      const cells = row.map((value, columnIndex) => createCellXml(value, rowNumber, columnIndex + 1)).join("");
      return `<row r="${rowNumber}">${cells}</row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>${columns}</cols>
  <sheetData>${sheetRows}</sheetData>
</worksheet>`;
}

function createCellXml(value, rowNumber, columnNumber) {
  const ref = `${columnName(columnNumber)}${rowNumber}`;
  const style = rowNumber === 1 ? ' s="1"' : "";
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${ref}"${style}><v>${value}</v></c>`;
  }
  return `<c r="${ref}" t="inlineStr"${style}><is><t>${escapeXml(value ?? "")}</t></is></c>`;
}

function createZipBlob(files, type) {
  const encoder = new TextEncoder();
  const parts = [];
  const centralParts = [];
  const now = getDosDateTime(new Date());
  let offset = 0;
  let centralSize = 0;

  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = typeof content === "string" ? encoder.encode(content) : content;
    const crc = crc32(data);
    const localHeader = createLocalFileHeader(nameBytes, data, crc, now);
    const centralHeader = createCentralDirectoryHeader(nameBytes, data, crc, now, offset);

    parts.push(localHeader, nameBytes, data);
    centralParts.push(centralHeader, nameBytes);

    offset += localHeader.length + nameBytes.length + data.length;
    centralSize += centralHeader.length + nameBytes.length;
  });

  parts.push(...centralParts, createEndOfCentralDirectory(Object.keys(files).length, centralSize, offset));
  return new Blob(parts, { type });
}

function createLocalFileHeader(nameBytes, data, crc, timestamp) {
  const header = new Uint8Array(30);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, timestamp.time, true);
  view.setUint16(12, timestamp.date, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, data.length, true);
  view.setUint32(22, data.length, true);
  view.setUint16(26, nameBytes.length, true);
  return header;
}

function createCentralDirectoryHeader(nameBytes, data, crc, timestamp, offset) {
  const header = new Uint8Array(46);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, timestamp.time, true);
  view.setUint16(14, timestamp.date, true);
  view.setUint32(16, crc, true);
  view.setUint32(20, data.length, true);
  view.setUint32(24, data.length, true);
  view.setUint16(28, nameBytes.length, true);
  view.setUint32(42, offset, true);
  return header;
}

function createEndOfCentralDirectory(fileCount, centralSize, centralOffset) {
  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, fileCount, true);
  view.setUint16(10, fileCount, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  return header;
}

function getDosDateTime(date) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  };
}

function crc32(data) {
  let crc = 0xffffffff;
  for (let index = 0; index < data.length; index += 1) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ data[index]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createCrc32Table() {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
}

function columnName(index) {
  let name = "";
  while (index > 0) {
    const remainder = (index - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    index = Math.floor((index - 1) / 26);
  }
  return name;
}

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;"
  })[char]);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = normalizeState(JSON.parse(reader.result));
      saveState();
      renderAll();
      alert("데이터를 가져왔습니다.");
    } catch {
      alert("JSON 파일을 읽을 수 없습니다.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function loadActiveView() {
  const savedView = localStorage.getItem(VIEW_KEY);
  return viewIds.includes(savedView) ? savedView : "calendarView";
}

function showView(viewId, options = {}) {
  const activeView = viewIds.includes(viewId) ? viewId : "calendarView";
  if (!options.skipStore) localStorage.setItem(VIEW_KEY, activeView);
  els.views.forEach((view) => view.classList.toggle("active", view.id === activeView));
  els.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === activeView));
  if (activeView === "analysisView") renderAnalysis();
}

function getActiveViewId() {
  return document.querySelector(".view.active")?.id || loadActiveView();
}

function getCountingEntries(entries) {
  return entries.filter((entry) => !entry.isCardPayment && entry.type !== "card-payment");
}

function isFixedEntry(entry) {
  return entry.type === "fixed-expense" || entry.type === "fixed-income";
}

function isExpenseEntry(entry) {
  return entry.type === "expense" || entry.type === "fixed-expense" || entry.syntheticType === "fixed-expense";
}

function isConsumptionEntry(entry) {
  return entry.type === "expense";
}

function isIncomeEntry(entry) {
  return entry.type === "income" || entry.type === "fixed-income" || entry.syntheticType === "fixed-income";
}

function entryClass(entry) {
  if (entry.isCardPayment || entry.type === "card-payment") return "card-payment";
  if (entry.syntheticType) return entry.syntheticType;
  return entry.type;
}

function entryUserLabel(entry) {
  const createdBy = entry.createdBy || entry.owner || "사용자 없음";
  if (entry.modifiedBy) return `최초 ${createdBy} · 수정 ${entry.modifiedBy}`;
  return `최초 ${createdBy}`;
}

function sumExpense(entries) {
  return entries.filter(isExpenseEntry).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function sumConsumption(entries) {
  return entries.filter(isConsumptionEntry).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function sumFixedExpense(entries) {
  return entries
    .filter((entry) => entry.type === "fixed-expense" || entry.syntheticType === "fixed-expense")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function sumIncome(entries) {
  return entries.filter(isIncomeEntry).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function sumCardPayments(entries) {
  return entries
    .filter((entry) => entry.isCardPayment || entry.type === "card-payment" || entry.syntheticType === "card-payment")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function totalBy(items, key) {
  return items.reduce((acc, item) => {
    const label = item[key] || "기타";
    acc[label] = (acc[label] || 0) + Number(item.amount || 0);
    return acc;
  }, {});
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    acc[value] = acc[value] || [];
    acc[value].push(item);
    return acc;
  }, {});
}

function monthsInRange(start, end) {
  const months = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const final = new Date(end.getFullYear(), end.getMonth(), 1);
  while (cursor <= final) {
    months.push({ year: cursor.getFullYear(), month: cursor.getMonth() });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

function repeatLabel(repeat = {}) {
  const unitLabel = repeat.unit === "day" ? "일" : repeat.unit === "week" ? "주" : "월";
  const interval = repeat.interval || 1;
  const holiday = repeat.holidayRule === "next" ? "휴일 후일" : "휴일 전일";
  return `${interval}${unitLabel}마다 · ${holiday}`;
}

function getHoliday(dateKey) {
  const year = Number(dateKey.slice(0, 4));
  const holidays = getKoreanHolidays(year);
  return holidays[dateKey] || "";
}

function getKoreanHolidays(year) {
  const holidays = {};
  addHoliday(holidays, `${year}-01-01`, "신정");
  addHoliday(holidays, `${year}-03-01`, "삼일절");
  addHoliday(holidays, `${year}-05-05`, "어린이날");
  addHoliday(holidays, `${year}-06-06`, "현충일");
  addHoliday(holidays, `${year}-08-15`, "광복절");
  addHoliday(holidays, `${year}-10-03`, "개천절");
  addHoliday(holidays, `${year}-10-09`, "한글날");
  addHoliday(holidays, `${year}-12-25`, "성탄절");

  if (year >= 2026) {
    addHoliday(holidays, `${year}-05-01`, "근로자의 날");
    addHoliday(holidays, `${year}-07-17`, "제헌절");
  }

  (holidayData[year] || []).forEach(([date, name]) => addHoliday(holidays, date, name));
  return holidays;
}

function addHoliday(map, date, name) {
  map[date] = map[date] ? `${map[date]} · ${name}` : name;
}

function isNonBusinessDay(date) {
  const day = date.getDay();
  return day === 0 || day === 6 || Boolean(getHoliday(toDateKey(date)));
}

function getNextBusinessDay(date) {
  const adjusted = new Date(date);
  while (isNonBusinessDay(adjusted)) {
    adjusted.setDate(adjusted.getDate() + 1);
  }
  return adjusted;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function parseMonthKey(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function isSameMonth(dateKey, year, month) {
  const date = parseDate(dateKey);
  return date.getFullYear() === year && date.getMonth() === month;
}

function clampDay(value) {
  return Math.min(Math.max(Number(value) || 1, 1), 31);
}

function fillDatalist(datalist, values) {
  datalist.innerHTML = "";
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    datalist.append(option);
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("ko-KR")}원`;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "없음";
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDayTitle(dateKey) {
  const date = parseDate(dateKey);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
}

function formatCompactMoney(value) {
  const number = Number(value || 0);
  if (number >= 1000000) return `${Math.round(number / 10000).toLocaleString("ko-KR")}만`;
  return number.toLocaleString("ko-KR");
}

function formatCalendarTotalMoney(value) {
  const number = Number(value || 0);
  if (number >= 10000) {
    const manwon = Math.round(number / 1000) / 10;
    return `${manwon.toLocaleString("ko-KR")}만`;
  }
  return number.toLocaleString("ko-KR");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
