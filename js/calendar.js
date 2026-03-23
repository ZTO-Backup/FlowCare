const calendarEl = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const selectedDateText = document.getElementById("selectedDate");

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let logs = JSON.parse(localStorage.getItem("logs")) || [];

// =======================
// 🧠 SMART AI CYCLE LENGTH
// =======================
function getSmartCycleLength() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodDates = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (periodDates.length < 2) return 28;

  let cycles = [];

  for (let i = 1; i < periodDates.length; i++) {
    const diff = (periodDates[i] - periodDates[i - 1]) / (1000 * 60 * 60 * 24);

    if (diff > 15 && diff < 45) {
      cycles.push(diff);
    }
  }

  if (!cycles.length) return 28;

  const avg = cycles.reduce((a, b) => a + b, 0) / cycles.length;

  return Math.round(avg);
}

// =======================
// 📅 RENDER CALENDAR
// =======================
function renderCalendar() {
  calendarEl.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const date = new Date(currentYear, currentMonth);
  monthYear.innerText = date.toLocaleString('default', { month: 'long', year: 'numeric' });

  // empty spaces
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    calendarEl.appendChild(emptyDiv);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    const log = logs.find(l => l.date === dateStr);

    let dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.innerText = day;

    // 🩸 PERIOD
    if (log && log.flow !== "none") {
      dayDiv.classList.add("period");
    }

    // 🌼 FERTILITY COLOR
    const fertility = getFertilityColor(dateStr);

    if (fertility === "fertile") {
      dayDiv.style.background = "#ff4d6d";
      dayDiv.style.color = "#fff";
    }

    else if (fertility === "ovulation") {
      dayDiv.style.background = "#ffb84d";
      dayDiv.style.color = "#000";
      dayDiv.innerHTML += "<br>🌼";
    }

    else if (fertility === "safe") {
      dayDiv.style.background = "#4caf50";
      dayDiv.style.color = "#fff";
    }

    dayDiv.onclick = (e) => selectDate(dateStr, e);

    calendarEl.appendChild(dayDiv);
  }
}

// =======================
// 📌 SELECT DATE
// =======================
function selectDate(date, event) {
  selectedDateText.innerText = "Selected: " + date;

  document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));

  event.target.classList.add("active");

  document.getElementById("logBtn").onclick = () => {
    window.location.href = `log.html?date=${date}`;
  };
}

// =======================
// ⬅➡ NAVIGATION
// =======================
function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}

renderCalendar();

// =======================
// 🌼 FERTILITY ENGINE (AI)
// =======================
function getFertilityColor(dateStr) {
  const cycleLength = getSmartCycleLength();

  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (!periodLogs.length) return "safe";

  // 🧠 FIND TRUE LAST PERIOD START
  let lastStart = periodLogs[0];

  for (let i = periodLogs.length - 1; i > 0; i--) {
    const diff = (periodLogs[i] - periodLogs[i - 1]) / (1000 * 60 * 60 * 24);

    if (diff > 1) {
      lastStart = periodLogs[i];
      break;
    }
  }

  const current = new Date(dateStr);

  if (current < lastStart) return "safe";

  const diffDays = Math.floor((current - lastStart) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "safe";

  const cycleDay = (diffDays % cycleLength) + 1;

  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 4;
  const fertileEnd = ovulationDay + 1;

  if (cycleDay === ovulationDay) return "ovulation";

  if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
    return "fertile";
  }

  return "safe";
}