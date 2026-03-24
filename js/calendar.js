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
  
  // 📊 CHECK IRREGULARITY
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

const calendarEl = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const selectedDateText = document.getElementById("selectedDate");

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let logs = JSON.parse(localStorage.getItem("logs")) || [];

function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}

// =======================
// ðŸ§  SMART AI CYCLE LENGTH
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
// ðŸ“… RENDER CALENDAR
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
    
    // ðŸ©¸ PERIOD
    if (log && log.flow !== "none") {
      dayDiv.classList.add("period");
    }
    
    // ðŸŒ¼ FERTILITY COLOR
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
    
    dayDiv.onclick = (e) => selectDate(dateStr, e);
    
    calendarEl.appendChild(dayDiv);
  }
}

// =======================
// ðŸ“Œ SELECT DATE
// =======================
function selectDate(date, event) {
selectedDateText.innerText = "Selected: " + date;

document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
event.target.classList.add("active");

const info = getFertilityDetails(date);

document.getElementById("dayInfo").innerText =
`${info.message} (Risk Level: ${info.level})`;

document.getElementById("logBtn").onclick = () => {
window.location.href = `log.html?date=${date}`;
  };
    }


// =======================
// â¬…âž¡ NAVIGATION
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
// ðŸŒ¼ FERTILITY ENGINE (AI)
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
  
  
// 🌼 Ovulation (1 day)
if (cycleDay === ovulationDay) return "ovulation";

// 🔴 Fertile window (tightened)
if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
  return "fertile";
  }

  // 🟢 SAFE ZONES (REAL LIFE LOGIC)
  if (cycleDay <= 5) return "safe";            // early safe
  if (cycleDay >= ovulationDay + 3) return "safe"; // post ovulation safe

  // 🤷 UNKNOWN (for middle uncertain days)
  return "unknown";
}

function getFertilityDetails(dateStr) {
  const ai = getAIInsights();
  const cycleLength = ai.cycleLength;

  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (!periodLogs.length) {
    return {
      status: "unknown",
      message: "Not enough data",
      level: "LOW"
    };
  }

  let lastStart = periodLogs[0];

  for (let i = periodLogs.length - 1; i > 0; i--) {
    const diff = (periodLogs[i] - periodLogs[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff > 1) {
      lastStart = periodLogs[i];
      break;
    }
  }

  const current = new Date(dateStr);
  const diffDays = Math.floor((current - lastStart) / (1000 * 60 * 60 * 24));

  const cycleDay = (diffDays % cycleLength) + 1;

  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 4;
  const fertileEnd = ovulationDay + 1;

  // 🌼 Ovulation
  if (cycleDay === ovulationDay) {
    return {
      status: "ovulation",
      message: "Ovulation day — highest chance of pregnancy",
      level: "VERY HIGH"
    };
  }

  // 🔴 Fertile
  if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
    return {
      status: "fertile",
      message: "Fertile window — high chance of pregnancy",
      level: "HIGH"
    };
  }

  // 🟢 Early Safe
  if (cycleDay <= 5) {
    return {
      status: "safe",
      message: "Early cycle — relatively safe",
      level: "MEDIUM"
    };
  }

  // 🟢 Late Safe
  if (cycleDay >= ovulationDay + 3) {
    return {
      status: "safe",
      message: "Post ovulation — safer period",
      level: "HIGH"
    };
  }

  return {
    status: "unknown",
    message: "Uncertain phase — be cautious",
    level: "LOW"
  };
}

function showCycleWarning() {
  const ai = getAIInsights();

  const warningEl = document.getElementById("cycleWarning");
  const confidenceEl = document.getElementById("confidenceText");

  if (!warningEl) return;

  if (ai.confidence === "low") {
    warningEl.innerText = "⚠️ Not enough data yet.";
    confidenceEl.innerText = "Confidence: Low";
  }

  else if (ai.irregular) {
    warningEl.innerText = "⚠️ Cycle irregular.";
    confidenceEl.innerText = "Confidence: Medium";
  }

  else {
    warningEl.innerText = "✅ Cycle stable.";
    confidenceEl.innerText = "Confidence: High";
  }
}

function getAdvancedInsights() {
  const ai = getAIInsights();
  const cycleLength = ai.cycleLength;

  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (!periodLogs.length) {
    return {
      nextSafe: "Log data to get insights",
      bestDays: "-",
      chance: "-"
    };
  }

  let lastStart = periodLogs[periodLogs.length - 1];

  const today = new Date();
  const diffDays = Math.floor((today - lastStart) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 4;
  const fertileEnd = ovulationDay + 1;

  // 🔮 NEXT SAFE DAY
  let nextSafe = "";

  if (cycleDay < ovulationDay) {
    nextSafe = `Safe days likely after day ${ovulationDay + 2}`;
  } else {
    nextSafe = "You are likely in a safe phase";
  }

  // ❤️ BEST DAYS
  const bestStart = ovulationDay - 2;
  const bestEnd = ovulationDay;

  const bestDays = `Best intimacy days: Day ${bestStart} - ${bestEnd}`;

  // 📊 PREGNANCY CHANCE
  let chance = "";

  if (cycleDay === ovulationDay) chance = "90% (Peak)";
  else if (cycleDay >= fertileStart && cycleDay <= fertileEnd) chance = "60% - 80%";
  else if (cycleDay <= 5) chance = "20%";
  else if (cycleDay >= ovulationDay + 3) chance = "10%";
  else chance = "30%";

  return {
    nextSafe,
    bestDays,
    chance
  };
}

function getPetName() {
  const username = localStorage.getItem("username") || "Queen";

  const names = [
    "Love",
    "Sweetheart",
    "My dear",
    "Baby"
  ];

  // separate username greeting (rarer)
  if (Math.random() < 0.15) {
    return `Hey ${username}, `;
  }

  return Math.random() < 0.25
    ? names[Math.floor(Math.random() * names.length)] + ", "
    : "";
}

function showAdvancedInsights() {
  const data = getAdvancedInsights();
  const pet = getPetName();

  const el = document.getElementById("marqueeText");
  if (!el) return;

  const message = 
    `🟢 ${pet}${data.nextSafe}   •   ❤️ ${data.bestDays}   •   📊 ${pet}Chance today: ${data.chance}`;

  el.innerText = message;
}
function getCycleInfo() {
  const ai = getAIInsights();
  const cycleLength = ai.cycleLength;

  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (!periodLogs.length) {
    return {
      cycleDay: "-",
      daysLeft: "-"
    };
  }

  const lastStart = periodLogs[periodLogs.length - 1];
  const today = new Date();

  const diffDays = Math.floor((today - lastStart) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  const daysLeft = cycleLength - cycleDay;

  return {
    cycleDay,
    daysLeft
  };
}

function showCycleInfo() {
  const data = getCycleInfo();

  const cycleDayEl = document.getElementById("cycleDay");
  const nextPeriodEl = document.getElementById("nextPeriod");

  if (!cycleDayEl) return;

  cycleDayEl.innerText = `📅 Cycle day: ${data.cycleDay}`;
  nextPeriodEl.innerText = `🩸 Next period in ${data.daysLeft} days`;
}

function checkSmartAlerts() {
  const data = getCycleInfo();
  const ai = getAIInsights();

  const cycleDay = data.cycleDay;
  const cycleLength = ai.cycleLength;

  const ovulationDay = cycleLength - 14;

  const username = localStorage.getItem("username") || "Queen";

  // 🔴 fertile window coming
  if (cycleDay === ovulationDay - 5) {
    sendPush(
      "👀 Heads up",
      `Hey ${username} 💖 your fertile window starts soon.`
    );
  }

  // 🌼 ovulation
  if (cycleDay === ovulationDay) {
    sendPush(
      "🌼 Ovulation Today",
      `Hey ${username} 💖 today is your peak fertility.`
    );
  }

  // 🩸 period incoming
  if (data.daysLeft === 2) {
    sendPush(
      "🩸 Incoming",
      `Hey ${username} 💖 your period is likely in a few days.`
    );
  }
}

sendPush("🔥 Working", "Notifications are active boss 💪");

renderCalendar();
showCycleWarning();
showAdvancedInsights(); // 👈 THIS MUST BE THERE
showCycleInfo();
requestNotificationPermission();
checkSmartAlerts();