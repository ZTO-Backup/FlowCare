let selectedDate = null;

let logs = JSON.parse(localStorage.getItem("logs")) || [];

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
    return { cycleLength: 28, confidence: "low", irregular: true };
  }

  let cycles = [];

  for (let i = 1; i < periodDates.length; i++) {
    const diff = (periodDates[i] - periodDates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff > 15 && diff < 45) cycles.push(diff);
  }

  if (!cycles.length) {
    return { cycleLength: 28, confidence: "low", irregular: true };
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
// GLOBALS (SAFE INIT)
// =======================
let calendarEl, monthYear, selectedDateText;

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// =======================
// CALENDAR
// =======================
function renderCalendar() {
  if (!calendarEl) return;

  calendarEl.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const date = new Date(currentYear, currentMonth);
  if (monthYear) {
    monthYear.innerText = date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  for (let i = 0; i < firstDay; i++) {
    calendarEl.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    const log = logs.find(l => l.date === dateStr);

    let dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.innerText = day;

    if (log && log.flow !== "none") {
      dayDiv.classList.add("period");
    }

    const fertility = getFertilityColor(dateStr);

    if (fertility === "fertile") {
      dayDiv.style.background = "#ff4d6d";
      dayDiv.style.color = "#fff";
    } else if (fertility === "ovulation") {
      dayDiv.style.background = "#ffb84d";
      dayDiv.style.color = "#000";
      dayDiv.innerHTML += "<br><span class='ovum'>*</span>";
    } else if (fertility === "safe") {
      dayDiv.style.background = "#4caf50";
      dayDiv.style.color = "#fff";
    }

    dayDiv.onclick = (e) => selectDate(dateStr, e);

    calendarEl.appendChild(dayDiv);
  }
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
      message: "Not enough data yet",
      level: "unknown"
    };
  }

  const lastStart = periodLogs[periodLogs.length - 1];
  const current = new Date(dateStr);

  const diffDays = Math.floor((current - lastStart) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  const ovulationDay = cycleLength - 14;

  // 🔥 LOGIC
  if (cycleDay === ovulationDay) {
    return {
      message: "Ovulation day 🌼 — highest fertility",
      level: "high"
    };
  }

  if (cycleDay >= ovulationDay - 4 && cycleDay <= ovulationDay + 1) {
    return {
      message: "Fertile window 💖 — high chance",
      level: "medium"
    };
  }

  if (cycleDay <= 5) {
    return {
      message: "Menstrual phase 🩸 — low fertility",
      level: "low"
    };
  }

  if (cycleDay >= ovulationDay + 3) {
    return {
      message: "Safe phase 🟢 — low risk",
      level: "low"
    };
  }

  return {
    message: "Cycle ongoing 🌿",
    level: "normal"
  };
}

// =======================
// SELECT DATE
// =======================
function selectDate(date, event) {
  selectedDate = date;

  if (selectedDateText) {
    selectedDateText.innerText = "Selected: " + date;
  }

  document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
  event.currentTarget.classList.add("active");

  const info = getFertilityDetails(date);

  const infoEl = document.getElementById("dayInfo");
  if (infoEl) {
    infoEl.innerText = info.message;
  }

  showCycleWarning();
  showAdvancedInsights();
  showCycleInfo();
}

// =======================
// NAVIGATION
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
// FERTILITY LOGIC
// =======================
function getFertilityColor(dateStr) {
  const ai = getAIInsights();
  const cycleLength = ai.cycleLength;

  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (!periodLogs.length) return "unknown";

  const lastStart = periodLogs[periodLogs.length - 1];
  const current = new Date(dateStr);

  const diffDays = Math.floor((current - lastStart) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  const ovulationDay = cycleLength - 14;

  if (cycleDay === ovulationDay) return "ovulation";
  if (cycleDay >= ovulationDay - 4 && cycleDay <= ovulationDay + 1) return "fertile";
  if (cycleDay <= 5 || cycleDay >= ovulationDay + 3) return "safe";

  return "unknown";
}

// =======================
// WARNING (FIXED)
// =======================
function showCycleWarning() {
  const ai = getAIInsights();
  const el = document.getElementById("cycleWarning");
  if (!el) return;
  
  const username = localStorage.getItem("username") || "Queen";
  
  let message = "";
  
  if (ai.confidence === "low") {
    message = `Hey ${username} 💖 keep logging, I’m still learning your rhythm 🌸`;
  }
  else if (ai.irregular) {
    message = `Hmm ${username} 💭 your cycle is a bit unpredictable, I’ve got you though 💕`;
  }
  else {
    message = `You’re in sync today ${username} ✨ your body is doing amazing 💖`;
  }
  
  el.innerText = message;
}

function getDailyAffirmation() {
  const username = localStorage.getItem("username") || "Queen";
  
  const messages = [
    `Take it easy today ${username} 🌸`,
    `${username}, your body deserves kindness 💖`,
    `Stay hydrated and gentle with yourself 💧`,
    `You’re doing better than you think ✨`,
    `Rest if you need to, ${username} 💕`,
    `You’re glowing today ${username} 😌`,
    `Little steps matter, ${username} 🌿`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

// =======================
// ADVANCED INSIGHTS
// =======================
function getAdvancedInsights() {
  const ai = getAIInsights();
  const cycleLength = ai.cycleLength;

  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (!periodLogs.length) {
    return { nextSafe: "Log data", bestDays: "-", chance: "-" };
  }

  const lastStart = periodLogs[periodLogs.length - 1];
  const today = new Date();

  const diffDays = Math.floor((today - lastStart) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  const ovulationDay = cycleLength - 14;

  return {
    nextSafe: cycleDay < ovulationDay ? "Safe phase coming soon" : "You are in safe phase",
    bestDays: `${ovulationDay - 2}-${ovulationDay}`,
    chance:
      cycleDay === ovulationDay ? "90%" :
      cycleDay >= ovulationDay - 4 && cycleDay <= ovulationDay + 1 ? "60-80%" :
      "10-30%"
  };
}

function getPetName() {
  const username = localStorage.getItem("username") || "Queen";

  if (Math.random() < 0.15) return `Hey ${username}, `;
  return Math.random() < 0.25 ? "Love, " : "";
}

function showAdvancedInsights() {
  const textEl = document.getElementById("marqueeText");
  const cloneEl = document.getElementById("marqueeClone");
  
  if (!textEl || !cloneEl) return;
  
  const data = getAdvancedInsights();
  const pet = getPetName();
  const affirmation = getDailyAffirmation();
  const personality = getPersonalityMessage();
  
  let messages = [
    `🟢 ${pet}${data.nextSafe}`,
    `❤️ Best days: ${data.bestDays}`,
    `📊 Chance today: ${data.chance}`,
    `💖 ${affirmation}`,
    `🌸 ${personality}`
  ];
  
  // shuffle for natural feel
  messages = messages.sort(() => Math.random() - 0.5);
  
  const fullText = messages.join("   •   ");
  
  textEl.innerText = fullText;
  cloneEl.innerText = fullText;
}

// =======================
// CYCLE INFO (RESTORED)
// =======================
function getCycleInfo() {
  const ai = getAIInsights();
  const cycleLength = ai.cycleLength;

  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  if (!periodLogs.length) return { cycleDay: "-", daysLeft: "-" };

  const lastStart = periodLogs[periodLogs.length - 1];
  const today = new Date();

  const diffDays = Math.floor((today - lastStart) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  return {
    cycleDay,
    daysLeft: cycleLength - cycleDay
  };
}

function showCycleInfo() {
  const data = getCycleInfo();

  const d = document.getElementById("cycleDay");
  const p = document.getElementById("nextPeriod");

  if (d) d.innerText = `📅 Cycle day: ${data.cycleDay}`;
  if (p) p.innerText = `🩸 Next period in ${data.daysLeft} days`;
}

// 🔔 Permission
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      console.log("Permission:", permission);
    });
  }
}

// =======================
// 🧠 SMART ALERT SYSTEM
// =======================

function checkSmartAlerts() {
  const data = getCycleInfo();
  const ai = getAIInsights();

  if (data.cycleDay === "-" || data.daysLeft === "-") return;

  const cycleDay = data.cycleDay;
  const cycleLength = ai.cycleLength;

  const ovulationDay = cycleLength - 14;

  const username = localStorage.getItem("username") || "Queen";

  const todayKey = new Date().toDateString();
  const lastAlert = localStorage.getItem("lastAlertDate");

  // 🚫 prevent multiple alerts same day
  if (lastAlert === todayKey) return;

  // 🔴 Fertile window coming
  if (cycleDay === ovulationDay - 5) {
    sendPush(
      "👀 Heads up",
      `Hey ${username} 💖 your fertile window starts soon. Stay ready 😉`
    );
  }

  // 🌼 Ovulation day
  else if (cycleDay === ovulationDay) {
    sendPush(
      "🌼 Ovulation Today",
      `Hey ${username} 💖 today is your peak fertility. Be mindful ❤️`
    );
  }

  // 🩸 Period incoming
  else if (data.daysLeft === 2) {
    sendPush(
      "🩸 Incoming",
      `Hey ${username} 💖 your period is likely in 2 days.`
    );
  }

  // ✅ save last alert date
  localStorage.setItem("lastAlertDate", todayKey);
}

function trackUserActivity() {
  const today = new Date().toDateString();
  
  const lastVisit = localStorage.getItem("lastVisit");
  let streak = parseInt(localStorage.getItem("streak") || "0");
  
  if (lastVisit) {
    const last = new Date(lastVisit);
    const diff = (new Date(today) - last) / (1000 * 60 * 60 * 24);
    
    if (diff === 1) {
      streak += 1; // continues streak
    } else if (diff > 1) {
      streak = 1; // reset streak
    }
  } else {
    streak = 1;
  }
  
  localStorage.setItem("lastVisit", today);
  localStorage.setItem("streak", streak);
}

function getPersonalityMessage() {
  const username = localStorage.getItem("username") || "Queen";
  const streak = parseInt(localStorage.getItem("streak") || "1");
  
  // 🎯 personality logic
  if (streak >= 5) {
    return `🔥 ${username}, you’ve been consistent for ${streak} days. I’m impressed 💖`;
  }
  
  if (streak >= 3) {
    return `✨ ${username}, you’re building a good rhythm. Keep going 💕`;
  }
  
  if (streak === 1) {
    return `Welcome back ${username} 💖 let’s keep track today`;
  }
  
  return `${username}, I’m here with you 🌸`;
}

// =======================
// INIT (SAFE)
// =======================
document.addEventListener("DOMContentLoaded", () => {
  calendarEl = document.getElementById("calendar");
  monthYear = document.getElementById("monthYear");
  selectedDateText = document.getElementById("selectedDate");
  
  trackUserActivity();
  renderCalendar();
  showCycleWarning();
  showAdvancedInsights();
  showCycleInfo();
  
  const btn = document.getElementById("logBtn");

if (btn) {
  btn.addEventListener("click", () => {
    if (!selectedDate) {
      alert("Please select a day first");
      return;
    }
    
    window.location.href = `log.html?date=${selectedDate}`;
  });
}

});
// ⏰ Run after everything loads
setTimeout(() => {
  requestNotificationPermission();
  checkSmartAlerts();
}, 1500);