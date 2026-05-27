const STORAGE_KEY = "family-ledger-state-v1";
const USER_KEY = "family-ledger-current-user-v1";
const VIEW_KEY = "family-ledger-active-view-v1";
const SYNC_URL_KEY = "family-ledger-sync-url-v1";
const SYNC_TOKEN_KEY = "family-ledger-sync-token-v1";
const SYNC_AUTO_KEY = "family-ledger-sync-auto-v1";
const SYNC_LAST_KEY = "family-ledger-sync-last-v1";
const SYNC_DEBOUNCE_MS = 1500;
const viewIds = ["calendarView", "entryView", "analysisView", "settingsView"];

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

const els = {
  yearSelect: document.querySelector("#yearSelect"),
  monthSelect: document.querySelector("#monthSelect"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth"),
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
  deleteConfirmModal: document.querySelector("#deleteConfirmModal"),
  deleteConfirmMessage: document.querySelector("#deleteConfirmMessage"),
  cancelDeleteConfirm: document.querySelector("#cancelDeleteConfirm"),
  confirmDeleteConfirm: document.querySelector("#confirmDeleteConfirm"),
  entryModal: document.querySelector("#entryModal"),
  modalForm: document.querySelector("#modalForm"),
  modalBody: document.querySelector("#modalBody"),
  dayModal: document.querySelector("#dayModal"),
  dayModalTitle: document.querySelector("#dayModalTitle"),
  dayModalList: document.querySelector("#dayModalList"),
  dayModalAdd: document.querySelector("#dayModalAdd"),
  closeDayModal: document.querySelector("#closeDayModal"),
  closeDayModalFooter: document.querySelector("#closeDayModalFooter"),
  analysisMonthLabel: document.querySelector("#analysisMonthLabel"),
  majorChart: document.querySelector("#majorChart"),
  majorLegend: document.querySelector("#majorLegend"),
  minorChart: document.querySelector("#minorChart"),
  minorLegend: document.querySelector("#minorLegend"),
  cardPaymentGrandTotal: document.querySelector("#cardPaymentGrandTotal"),
  cardTotalList: document.querySelector("#cardTotalList"),
  expenseDelta: document.querySelector("#expenseDelta"),
  incomeDelta: document.querySelector("#incomeDelta"),
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

init();

function init() {
  setupMonthSelectors();
  bindEvents();
  resetEntryForm(toDateKey(new Date()));
  resetFixedForm();
  resetCardForm();
  renderAll();
  setupSettingsFolders();
  showView(loadActiveView(), { skipStore: true });
  registerServiceWorker();
  syncOnStart();
  setInterval(() => pullSync({ quiet: true, onlyIfRemoteNewer: true }), 10 * 60 * 1000);
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
  return {
    users: normalizedUsers,
    budgetBuckets: normalizedBudgetBuckets,
    categories: normalizeCategories(raw.categories),
    entries: (raw.entries || []).map((entry) => normalizeEntry(entry, normalizedUsers, normalizedBudgetBuckets)).filter(Boolean),
    cards: raw.cards?.length ? raw.cards.map((card) => normalizeCard(card, normalizedUsers)) : clone(defaultCards).map((card) => normalizeCard(card, normalizedUsers)),
    templates: raw.templates?.length ? raw.templates.map((template) => normalizeTemplate(template, normalizedUsers, normalizedBudgetBuckets)) : clone(defaultTemplates).map((template) => normalizeTemplate(template, normalizedUsers, normalizedBudgetBuckets)),
    monthlyBudgets: normalizeMonthlyBudgets(raw.monthlyBudgets, normalizedBudgetBuckets),
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
  return {
    ...entry,
    id: entry.id || makeId(),
    type,
    owner: normalizeOwner(entry.owner, userList),
    budget: bucketList.includes(entry.budget) ? entry.budget : "",
    startDate: type.startsWith("fixed-") ? entry.startDate || entry.date : entry.startDate
  };
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

function normalizeCard(card, userList = getUsers()) {
  return {
    id: card.id || makeId(),
    name: card.name || "새 카드",
    owner: normalizeOwner(card.owner, userList),
    billingStartDay: clampDay(card.billingStartDay || 1),
    paymentDay: clampDay(card.paymentDay || 25)
  };
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

function normalizeOwner(owner, userList = getUsers()) {
  const normalized = canonicalUser(owner);
  if (userList.includes(normalized)) return normalized;
  const current = canonicalUser(currentUser);
  return userList.includes(current) ? current : userList[0];
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
      if (button.dataset.view === "entryView") resetEntryForm(toDateKey(new Date()));
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
  els.closeQuickTemplateModal.addEventListener("click", () => els.quickTemplateModal.close());
  els.closeSettingsListModal.addEventListener("click", () => els.settingsListModal.close());
  els.settingsListModal.addEventListener("close", restoreSettingsListModal);
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
  renderFixedEntries();
  renderCards();
  renderCategories();
  renderTemplates();
  renderCategoryOptions();
  renderTemplatePickBanner();
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
    folderButton.textContent = "열기";
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
  return panel.querySelector(":scope > .settings-folder-head h2")?.textContent.trim() || panel.querySelector("h2")?.textContent.trim() || "설정";
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
  if (button) button.textContent = isOpen ? "접기" : "열기";
}

function renderUserSettings() {
  const users = getUsers();
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

    actions.append(editButton, deleteButton);
    row.append(info, actions);
    els.userList.append(row);
  });
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
    state.entries.filter((entry) => entry.owner === user).length +
    state.cards.filter((card) => card.owner === user).length +
    state.templates.filter((template) => template.owner === user).length;
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
  state.entries = state.entries.map((entry) => (entry.owner === previousName ? { ...entry, owner: nextName } : entry));
  state.cards = state.cards.map((card) => (card.owner === previousName ? { ...card, owner: nextName } : card));
  state.templates = state.templates.map((template) => (template.owner === previousName ? { ...template, owner: nextName } : template));
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
  pullSync({ quiet: true, onlyIfRemoteNewer: true });
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

async function pullSync({ quiet = false, onlyIfRemoteNewer = false } = {}) {
  const config = getSyncConfig();
  if (!config) {
    if (!quiet) updateSyncStatus("동기화 설정을 먼저 저장해 주세요.", "warning");
    return;
  }

  try {
    if (!quiet) updateSyncStatus("공유 데이터를 불러오는 중입니다...", "neutral");
    const remote = await loadRemoteSnapshot(config);
    if (!remote.ok) throw new Error(remote.error || "공유 데이터를 읽지 못했습니다.");

    const remoteState = remote.state || remote.data;
    if (!remoteState) {
      if (!quiet) updateSyncStatus("아직 공유 데이터가 없습니다. 먼저 올리기를 눌러 주세요.", "neutral");
      return;
    }

    const remoteUpdatedAt = remote.updatedAt || remoteState.updatedAt || "";
    const localUpdatedAt = state.updatedAt || "";
    if (onlyIfRemoteNewer && localUpdatedAt && !isRemoteNewer(remoteUpdatedAt, localUpdatedAt)) return;
    if (localUpdatedAt && isRemoteNewer(localUpdatedAt, remoteUpdatedAt)) {
      updateSyncStatus("이 기기의 데이터가 더 최신입니다. 올리기를 누르면 공유 데이터에 반영됩니다.", "warning");
      return;
    }

    applyRemoteState(remoteState, remoteUpdatedAt);
    updateSyncStatus("공유 데이터를 불러왔습니다.", "success");
  } catch (error) {
    if (!quiet) updateSyncStatus(`불러오기 실패: ${error.message}`, "warning");
  }
}

async function pushSync({ quiet = false } = {}) {
  const config = getSyncConfig();
  if (!config) {
    if (!quiet) updateSyncStatus("동기화 설정을 먼저 저장해 주세요.", "warning");
    return;
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
  } catch (error) {
    if (!quiet) updateSyncStatus(`올리기 실패: ${error.message}`, "warning");
  }
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

    cellEntries.slice(0, 4).forEach((entry) => {
      const chip = document.createElement("button");
      chip.className = `entry-chip ${entryClass(entry)}`;
      chip.type = "button";
      chip.innerHTML = `<span>${escapeHtml(entry.memo)}</span><b>${formatCompactMoney(entry.amount)}</b>`;
      chip.addEventListener("click", (event) => {
        event.stopPropagation();
        openDayModal(key);
      });
      cell.append(chip);
    });

    if (cellEntries.length > 4) {
      const more = document.createElement("div");
      more.className = "more-chip";
      more.textContent = `+${cellEntries.length - 4}개`;
      cell.append(more);
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

function openDayModal(dateKey) {
  if (pendingTemplate) {
    addTemplateEntryForDate(pendingTemplate, dateKey);
    pendingTemplate = null;
    renderTemplatePickBanner();
    showView("calendarView");
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
        <small>${escapeHtml(entryOwnerLabel(entry))} · ${typeLabels[entry.syntheticType || entry.type] || typeLabels[entry.type] || ""} · ${escapeHtml(entry.major)} · ${escapeHtml(entry.minor)}${entry.info ? " · " + escapeHtml(entry.info) : ""}${entry.budget ? " · " + escapeHtml(entry.budget) : ""}</small>
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

function openEntryForDate(dateKey) {
  if (pendingTemplate) {
    addTemplateEntryForDate(pendingTemplate, dateKey);
    pendingTemplate = null;
    renderTemplatePickBanner();
    showView("calendarView");
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
  const start = new Date(year, month - 1, card.billingStartDay);
  const end = new Date(year, month, card.billingStartDay);
  end.setDate(end.getDate() - 1);
  return getBillableExpenseEntries(start, end)
    .filter((entry) => entry.owner === card.owner && entry.info === card.name)
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
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

function handleEntrySubmit(event) {
  event.preventDefault();
  const payload = readEntryForm();
  if (!payload) return;

  if (els.editingEntryId.value) {
    const id = els.editingEntryId.value;
    state.entries = state.entries.map((entry) => (entry.id === id ? { ...entry, ...payload, id } : entry));
  } else {
    state.entries.push({ ...payload, id: makeId(), createdAt: new Date().toISOString() });
  }

  selectedDate = parseDate(payload.date);
  selectedYear = selectedDate.getFullYear();
  selectedMonth = selectedDate.getMonth();
  saveState();
  resetEntryForm(payload.date);
  renderAll();
  showView("calendarView");
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
  renderPaymentSelects();
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
    state.entries = state.entries.filter((entry) => entry.id !== id);
  }

  if (action === "save") {
    const formData = new FormData(els.modalForm);
    state.entries = state.entries.map((entry) => {
      if (entry.id !== id) return entry;
      return {
        ...entry,
        date: formData.get("date"),
        major: formData.get("major"),
        minor: formData.get("minor"),
        amount: Number(formData.get("amount")),
        memo: formData.get("memo").trim(),
        info: formData.get("info"),
        budget: formData.get("budget") || ""
      };
    });
  }

  saveState();
  els.entryModal.close();
  renderAll();
}

function saveCurrentTemplate() {
  const payload = readEntryForm();
  if (!payload) return;

  if (editingTemplateId) {
    state.templates = state.templates.map((template) => (template.id === editingTemplateId ? { ...template, ...payload, id: template.id } : template));
    editingTemplateId = "";
    els.saveTemplate.textContent = "퀵 입력 저장";
    alert("퀵 입력을 수정했습니다.");
  } else {
    state.templates.push({ ...payload, id: makeId() });
    alert("퀵 입력 목록에 추가했습니다.");
  }

  saveState();
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
  if (!state.templates.length) {
    target.innerHTML = '<div class="empty-state">저장된 퀵 입력이 없습니다.</div>';
    return;
  }

  state.templates.forEach((template) => {
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

function addTemplateEntryForDate(template, date) {
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
    createdAt: new Date().toISOString()
  });
  selectedDate = parseDate(date);
  selectedYear = selectedDate.getFullYear();
  selectedMonth = selectedDate.getMonth();
  saveState();
  resetEntryForm(date);
  renderAll();
}

function handleFixedSubmit(event) {
  event.preventDefault();
  const payload = readFixedForm();
  if (!payload) return;
  const id = els.fixedEditingId.value;

  if (id) {
    state.entries = state.entries.map((entry) => (entry.id === id ? { ...entry, ...payload, id } : entry));
  } else {
    state.entries.push({ ...payload, id: makeId(), createdAt: new Date().toISOString() });
  }

  saveState();
  resetFixedForm();
  renderAll();
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
    const row = document.createElement("div");
    row.className = `fixed-card ${entry.type}`;
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(entry.memo)}</strong>
        <small>${typeLabels[entry.type]} · ${escapeHtml(entry.major)} · ${escapeHtml(entry.minor)} · ${entry.budget ? escapeHtml(entry.budget) + " · " : ""}${formatMoney(entry.amount)}</small>
        <small>${entry.startDate || entry.date} 시작 · ${repeatLabel(entry.repeat)}</small>
      </div>
    `;
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
    row.append(editButton, deleteButton);
    els.fixedList.append(row);
  });
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

  renderPie(els.majorChart, els.majorLegend, majorTotals);
  renderPie(els.minorChart, els.minorLegend, minorTotals);

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
    row.className = "card-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(card.name)}</strong>
        <small>소유자별 계산 · 전월 ${card.billingStartDay}일 - 당월 ${Math.max(card.billingStartDay - 1, 1)}일 / 결제 ${card.paymentDay}일</small>
      </div>
      <strong>${formatMoney(total)}</strong>
    `;
    els.cardTotalList.append(row);
  });
  if (els.cardPaymentGrandTotal) els.cardPaymentGrandTotal.textContent = formatMoney(cardGrandTotal);

  setDelta(els.expenseDelta, sumConsumption(monthEntries) - sumConsumption(previousEntries));
  setDelta(els.incomeDelta, sumIncome(monthEntries) - sumIncome(previousEntries));
  renderBudgetAnalysis();
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
    row.className = `budget-analysis-row${remaining < 0 ? " negative" : ""}`;
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
    els.budgetAnalysisList.append(row);
  });
}

function getBudgetUsageForMonth(year, month, bucket) {
  return getCountingEntries(getVisibleEntriesForMonth(year, month))
    .filter((entry) => isSameMonth(entry.date, year, month))
    .filter((entry) => isConsumptionEntry(entry) && entry.budget === bucket)
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
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

function renderPie(chart, legend, totals) {
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
    item.innerHTML = `<i style="background:${palette[index % palette.length]}"></i><span>${escapeHtml(label)}</span><b>${formatMoney(value)}</b>`;
    legend.append(item);
  });
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
    row.append(deleteButton);

    const ownerSelect = row.querySelector(".card-owner-select");
    const nameInput = row.querySelector(".card-name-input");
    const startSelect = row.querySelector(".card-start-select");
    const paymentSelect = row.querySelector(".card-payment-select");
    ownerSelect.addEventListener("change", () => {
      card.owner = ownerSelect.value;
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
    els.cardSettings.append(row);
  });
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

function renderPaymentSelects() {
  fillPaymentSelect(els.entryInfo, els.entryInfo.value || "현금");
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
  const options = unique([...state.cards.filter((card) => card.owner === currentUser).map((card) => card.name), "현금", "계좌이체", "교통카드"]);
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
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `우리집-가계부-${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
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

function entryOwnerLabel(entry) {
  return entry.owner || "사용자 없음";
}

function sumExpense(entries) {
  return entries.filter(isExpenseEntry).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function sumConsumption(entries) {
  return entries.filter(isConsumptionEntry).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function sumIncome(entries) {
  return entries.filter(isIncomeEntry).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
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
