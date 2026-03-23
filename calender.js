// =======================
// 🧠 AI INSIGHTS
// =======================
function getAIInsights() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodDates = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (periodDates.length < 2) {
    return {
      cycleLength: 28,
      confidence: "low",
      irregular: true
    };
  }

  let cycles = [];

  for (let i = 1; i < periodDates.length; i++) {
    const diff = (periodDates[i] - periodDates[i - 1]) / (1000 * 60 * 60 * 24);

    if (diff > 15 && diff < 45) {
      cycles.push(diff);
    }
  }

  if (!cycles.length) {
    return {
      cycleLength: 28,
      confidence: "low",
      irregular: true
    };
  }

  const avg = cycles.reduce((a, b) => a + b, 0) / cycles.length;
  const variation = Math.max(...cycles) - Math.min(...cycles);

  let confidence = "low";
  if (cycles.length >= 3) confidence = "medium";
  if (cycles.length >= 6) confidence = "high";

  return {
    cycleLength: Math.round(avg),
    confidence,
    irregular: variation > 7
  };
}

// =======================
// 📌 DOM
// =======================
const calendarEl = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const selectedDateText = document.getElementById("selectedDate");

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let logs = JSON.parse(localStorage.getItem("logs")) || [];

// =======================
// 📅 RENDER CALENDAR
// =======================
function renderCalendar() {
  calendarEl.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const date = new Date(currentYear, currentMonth);
  monthYear.innerText = date.toLocaleString('default', { month: 'long', year: 'numeric' });

  for (let i = 0; i < firstDay; i++) {
    calendarEl.appendChild(document.createElement("div"));
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

    const fertility = getFertilityColor(dateStr);

    if (fertility === "fertile") {
      dayDiv.style.background = "#ff4d6d";
      dayDiv.style.color = "#fff";
    }

    else if (fertility === "ovulation") {
      dayDiv.style.background = "#ffb84d";
      dayDiv.style.color = "#000";
      dayDiv.innerHTML += "<br><span class='ovum'>*</span>";
    }

    else if (fertility === "safe") {
      dayDiv.style.background = "#4caf50";
      dayDiv.style.color = "#fff";
    }

    else if (fertility === "unknown") {
      dayDiv.style.background = "#ddd";
      dayDiv.style.color = "#555";
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

// =======================
// 🌼 FERTILITY ENGINE
// =======================
function getFertilityColor(dateStr) {
  const ai = getAIInsights();
  const cycleLength = ai.cycleLength;
  const confidence = ai.confidence;

  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (!periodLogs.length) return "unknown";

  let lastStart = periodLogs[0];

  for (let i = periodLogs.length - 1; i > 0; i--) {
    const diff = (periodLogs[i] - periodLogs[i - 1]) / (1000 * 60 * 60 * 24);

    if (diff > 1) {
      lastStart = periodLogs[i];
      break;
    }
  }

  const current = new Date(dateStr);

  if (current < lastStart) return "unknown";

  const diffDays = Math.floor((current - lastStart) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "unknown";

  const cycleDay = (diffDays % cycleLength) + 1;

  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 4;
  const fertileEnd = ovulationDay + 1;

  // 🌼 Ovulation
  if (cycleDay === ovulationDay) return "ovulation";

  // 🔴 Fertile
  if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
    return "fertile";
  }

  // 🔥 LOW DATA BOOST
  if (confidence === "low") {
    if (cycleDay <= 7) return "safe";
  }

  // 🟢 SAFE ZONES
  if (cycleDay <= 7) return "safe";
  if (cycleDay >= ovulationDay + 2) return "safe";

  return "unknown";
}

// =======================
// ⚠️ WARNING SYSTEM
// =======================
function showCycleWarning() {
  const ai = getAIInsights();
  const warningEl = document.getElementById("cycleWarning");

  if (!warningEl) return;

  if (ai.confidence === "low") {
    warningEl.innerText = "⚠️ Not enough data yet. Keep logging for better predictions.";
  }

  else if (ai.irregular) {
    warningEl.innerText = "⚠️ Your cycle seems irregular. Predictions may vary.";
  }

  else {
    warningEl.innerText = "✅ Your cycle looks stable. Predictions are more reliable.";
  }
}

// =======================
// 🚀 INIT
// =======================
renderCalendar();
showCycleWarning();