// ===== 로컬스토리지 키 상수 =====
const STORAGE_KEY_TODOS  = 'todos';
const STORAGE_KEY_NEXTID = 'nextId';

// ===== 상태 =====
// todos 배열: 각 항목은 { id, text, completed, date } 구조
let todos = [];

// 고유 id 생성용 카운터
let nextId = 1;

// 현재 선택된 필터: 'all' | 'active' | 'completed'
let currentFilter = 'all';

// 현재 선택된 날짜 (YYYY-MM-DD 문자열)
let selectedDate = getTodayStr();

// ===== DOM 참조 =====
const todoInput      = document.getElementById('todoInput');
const addBtn         = document.getElementById('addBtn');
const todoList       = document.getElementById('todoList');
const warningMsg     = document.getElementById('warningMsg');
const emptyMsg       = document.getElementById('emptyMsg');
const filterTabs     = document.querySelectorAll('.filter-tab');
const prevWeekBtn    = document.getElementById('prevWeekBtn');
const nextWeekBtn    = document.getElementById('nextWeekBtn');
const weekRangeLabel = document.getElementById('weekRangeLabel');
const weekDaysEl     = document.getElementById('weekDays');
const todayBtn       = document.getElementById('todayBtn');

// ===== 이벤트 등록 =====

addBtn.addEventListener('click', handleAddTodo);

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo();
});

todoInput.addEventListener('input', () => {
  hideWarning();
});

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    currentFilter = tab.dataset.filter;
    updateFilterTabs();
    renderTodos();
  });
});

prevWeekBtn.addEventListener('click', () => moveDate(-7));
nextWeekBtn.addEventListener('click', () => moveDate(7));

todayBtn.addEventListener('click', () => {
  selectedDate = getTodayStr();
  renderTodos();
});

// ===== 로컬스토리지 =====

function saveTodos() {
  localStorage.setItem(STORAGE_KEY_TODOS,  JSON.stringify(todos));
  localStorage.setItem(STORAGE_KEY_NEXTID, JSON.stringify(nextId));
}

function loadTodos() {
  const savedTodos  = localStorage.getItem(STORAGE_KEY_TODOS);
  const savedNextId = localStorage.getItem(STORAGE_KEY_NEXTID);

  if (savedTodos)  todos  = JSON.parse(savedTodos);
  if (savedNextId) nextId = JSON.parse(savedNextId);
}

// ===== 날짜 유틸 함수 =====

function getTodayStr() {
  return toDateStr(new Date());
}

function toDateStr(date) {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateStrToDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function moveDate(offset) {
  const date = dateStrToDate(selectedDate);
  date.setDate(date.getDate() + offset);
  selectedDate = toDateStr(date);
  renderTodos();
}

// ===== 주간 뷰 =====

function getMondayOfWeek(dateStr) {
  const date = dateStrToDate(dateStr);
  const dow = date.getDay(); // 0=일, 1=월, ..., 6=토
  const diff = dow === 0 ? -6 : 1 - dow;
  date.setDate(date.getDate() + diff);
  return date;
}

function getWeekDates(dateStr) {
  const monday = getMondayOfWeek(dateStr);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(toDateStr(d));
  }
  return dates;
}

function formatWeekRange(startStr, endStr) {
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [, em, ed]   = endStr.split('-').map(Number);
  if (sm === em) {
    return `${sy}년 ${sm}월 ${sd}일 - ${ed}일`;
  }
  return `${sy}년 ${sm}월 ${sd}일 - ${em}월 ${ed}일`;
}

function updateWeekNav() {
  const weekDates = getWeekDates(selectedDate);
  const today = getTodayStr();
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

  weekRangeLabel.textContent = formatWeekRange(weekDates[0], weekDates[6]);
  todayBtn.classList.toggle('hidden', selectedDate === today);

  weekDaysEl.innerHTML = '';
  weekDates.forEach((dateStr) => {
    const count = todos.filter((t) => t.date === dateStr).length;
    const dateObj = dateStrToDate(dateStr);
    const dow = dateObj.getDay();
    const d = dateObj.getDate();
    const m = dateObj.getMonth() + 1;

    const btn = document.createElement('button');
    btn.className = 'day-cell';
    if (dateStr === today)         btn.classList.add('today');
    if (dateStr === selectedDate)  btn.classList.add('selected');
    if (dow === 6)                 btn.classList.add('saturday');
    if (dow === 0)                 btn.classList.add('sunday');
    btn.dataset.date = dateStr;
    btn.setAttribute('aria-label', `${m}월 ${d}일 할 일 ${count}개`);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'day-name';
    nameSpan.textContent = DAY_NAMES[dow];

    const numSpan = document.createElement('span');
    numSpan.className = 'day-num';
    numSpan.textContent = d;

    const countSpan = document.createElement('span');
    countSpan.className = 'day-count';
    countSpan.textContent = count > 0 ? count : '';

    btn.appendChild(nameSpan);
    btn.appendChild(numSpan);
    btn.appendChild(countSpan);

    btn.addEventListener('click', () => {
      selectedDate = dateStr;
      renderTodos();
    });

    weekDaysEl.appendChild(btn);
  });
}

// ===== 기능 함수 =====

function handleAddTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    showWarning();
    todoInput.focus();
    return;
  }

  addTodo(text);
  todoInput.value = '';
  hideWarning();
  todoInput.focus();
}

function addTodo(text) {
  todos.push({
    id: nextId++,
    text,
    completed: false,
    date: selectedDate,
  });
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function toggleComplete(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function updateTodoText(id, newText) {
  const text = newText.trim();
  if (!text) return;

  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, text } : todo
  );
  saveTodos();
  renderTodos();
}

// ===== 필터링 =====

function getFilteredTodos() {
  const todosForDate = todos.filter((todo) => todo.date === selectedDate);

  switch (currentFilter) {
    case 'active':
      return todosForDate.filter((todo) => !todo.completed);
    case 'completed':
      return todosForDate.filter((todo) => todo.completed);
    default:
      return todosForDate;
  }
}

function getEmptyMessage() {
  switch (currentFilter) {
    case 'active':    return '진행 중인 할 일이 없습니다.';
    case 'completed': return '완료된 할 일이 없습니다.';
    default:          return '이 날의 할 일이 없습니다.';
  }
}

function updateFilterTabs() {
  filterTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === currentFilter);
  });
}

// ===== 렌더링 =====

function renderTodos() {
  updateWeekNav();
  todoList.innerHTML = '';

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    emptyMsg.textContent = getEmptyMessage();
    emptyMsg.classList.remove('hidden');
    return;
  }

  emptyMsg.classList.add('hidden');

  filteredTodos.forEach((todo) => {
    const li = createTodoItem(todo);
    todoList.appendChild(li);
  });
}

function createTodoItem(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (todo.completed ? ' completed' : '');
  li.dataset.id = todo.id;

  const textSpan = document.createElement('span');
  textSpan.className = 'todo-text';
  textSpan.textContent = todo.text;

  const actions = document.createElement('div');
  actions.className = 'item-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-edit';
  editBtn.textContent = '수정';
  editBtn.addEventListener('click', () => enterEditMode(li, todo));

  const doneBtn = document.createElement('button');
  doneBtn.className = 'btn btn-done';
  doneBtn.textContent = todo.completed ? '취소' : '완료';
  doneBtn.addEventListener('click', () => toggleComplete(todo.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-delete';
  deleteBtn.textContent = '삭제';
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  actions.appendChild(editBtn);
  actions.appendChild(doneBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(textSpan);
  li.appendChild(actions);

  return li;
}

function enterEditMode(li, todo) {
  const textSpan = li.querySelector('.todo-text');
  li.removeChild(textSpan);

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'todo-edit-input';
  editInput.value = todo.text;
  editInput.maxLength = 100;

  const actions = li.querySelector('.item-actions');
  const editBtn = actions.querySelector('.btn-edit');

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-save';
  saveBtn.textContent = '저장';

  const saveEdit = () => {
    const newText = editInput.value.trim();
    if (!newText) {
      editInput.focus();
      return;
    }
    updateTodoText(todo.id, newText);
  };

  saveBtn.addEventListener('click', saveEdit);

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') renderTodos();
  });

  actions.replaceChild(saveBtn, editBtn);
  li.insertBefore(editInput, actions);
  editInput.focus();
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);
}

// ===== 경고 메시지 제어 =====

function showWarning() {
  warningMsg.classList.remove('hidden');
}

function hideWarning() {
  warningMsg.classList.add('hidden');
}

// ===== 초기화 =====
loadTodos();
renderTodos();
