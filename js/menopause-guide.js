// TOGGLE
function toggleSection(header) {
  const content = header.nextElementSibling;
  content.style.display =
    content.style.display === "block" ? "none" : "block";
}

// SEARCH
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll(".section").forEach(section => {
      section.style.display =
        section.innerText.toLowerCase().includes(query)
          ? "block"
          : "none";
    });
  });
}

// COLLAPSE ALL
document.querySelectorAll(".section .content").forEach(el => {
  el.style.display = "none";
});

// =======================
// 🧠 PERSONALIZATION
// =======================

function getLogs() {
  return JSON.parse(localStorage.getItem("logs")) || [];
}

function detectStatus() {
  const logs = getLogs();
  const age = Number(localStorage.getItem("age")) || 0;

  if (!logs.length) return "unknown";

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  if (!periodLogs.length) return "unknown";

  const lastDate = new Date(periodLogs[periodLogs.length - 1].date);
  const monthsAbsent = (new Date() - lastDate) / (1000 * 60 * 60 * 24 * 30);

  if (monthsAbsent >= 12) return "post";
  if (age >= 40) return "pre";

  return "normal";
}

// APPLY PERSONALIZATION
function personalizeGuide() {
  const status = detectStatus();
  const messageEl = document.getElementById("personalMessage");

  if (!messageEl) return;

  // MESSAGE
  if (status === "post") {
    messageEl.innerText =
      "🌸 You are likely in post-menopause. Focus on long-term health and wellness.";
  } else if (status === "pre") {
    messageEl.innerText =
      "⚠️ You may be approaching menopause. Pay attention to body changes.";
  } else {
    messageEl.innerText =
      "✅ Your cycle looks stable. Stay informed and keep tracking.";
  }

  // HIGHLIGHT RELEVANT SECTIONS
  document.querySelectorAll(".section").forEach(section => {
    const type = section.getAttribute("data-type");

    if (type === status) {
      section.style.border = "2px solid #ff4d6d";
    }
  });
}

personalizeGuide();

function generateImportantTips() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const age = Number(localStorage.getItem("age")) || 0;

  const listEl = document.getElementById("importantList");
  if (!listEl) return;

  let tips = [];

  // AGE BASED
  if (age >= 40) {
    tips.push("You may be approaching menopause — track changes closely");
  }

  // LOG BASED
  const lastLog = logs[logs.length - 1];

  if (lastLog) {
    const { symptoms = [], mood, flow } = lastLog;

    if (symptoms.includes("cramps")) {
      tips.push("Manage cramps with rest and warm compress");
    }

    if (symptoms.includes("fatigue")) {
      tips.push("Your body needs more rest — don’t overwork yourself");
    }

    if (flow === "heavy") {
      tips.push("Heavy flow detected — stay prepared and hydrated");
    }

    if (mood === "sad" || mood === "irritated") {
      tips.push("Emotional changes noticed — prioritize mental care");
    }
  }

  // FALLBACK
  if (tips.length === 0) {
    tips.push("Keep tracking your cycle to unlock personalized insights");
  }

  // RENDER
  listEl.innerHTML = "";
  tips.forEach(tip => {
    const li = document.createElement("li");
    li.innerText = tip;
    listEl.appendChild(li);
  });
}

generateImportantTips();

function detectPatterns() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const listEl = document.getElementById("importantList");

  if (!logs.length || !listEl) return;

  let patternTips = [];

  // LAST 5 DAYS
  const recent = logs.slice(-5);

  let crampsCount = 0;
  let fatigueCount = 0;
  let heavyFlowCount = 0;
  let moodCount = 0;

  recent.forEach(log => {
    const symptoms = log.symptoms || [];

    if (symptoms.includes("cramps")) crampsCount++;
    if (symptoms.includes("fatigue")) fatigueCount++;
    if (log.flow === "heavy") heavyFlowCount++;
    if (log.mood === "sad" || log.mood === "irritated") moodCount++;
  });

  // DETECT PATTERNS
  if (crampsCount >= 3) {
    patternTips.push("Frequent cramps detected in recent days");
  }

  if (fatigueCount >= 3) {
    patternTips.push("You’ve been feeling fatigued repeatedly — prioritize rest");
  }

  if (heavyFlowCount >= 2) {
    patternTips.push("Heavy flow appears frequently — monitor closely");
  }

  if (moodCount >= 3) {
    patternTips.push("Repeated mood changes detected — take emotional care");
  }

  // ADD TO UI
  patternTips.forEach(tip => {
    const li = document.createElement("li");
    li.innerText = "📊 " + tip;
    listEl.appendChild(li);
  });
}

// RUN IT
detectPatterns();

function smartAlerts() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  if (!logs.length) return;

  const recent = logs.slice(-3);

  let cramps = 0;
  let fatigue = 0;
  let heavy = 0;

  recent.forEach(log => {
    const symptoms = log.symptoms || [];

    if (symptoms.includes("cramps")) cramps++;
    if (symptoms.includes("fatigue")) fatigue++;
    if (log.flow === "heavy") heavy++;
  });

  let message = "";

  if (cramps === 3) {
    message = "⚠️ You’ve had cramps for 3 days. Consider rest or care.";
  } else if (fatigue === 3) {
    message = "😴 Your body is showing repeated fatigue. Take it easy today.";
  } else if (heavy >= 2) {
    message = "🩸 Frequent heavy flow detected. Stay prepared.";
  }

  if (message) {
    showAlert(message);
  }
}

function showAlert(message) {
  const alertBox = document.createElement("div");

  alertBox.innerText = message;
  alertBox.style.position = "fixed";
  alertBox.style.top = "20px";
  alertBox.style.left = "50%";
  alertBox.style.transform = "translateX(-50%)";
  alertBox.style.background = "#ff4d6d";
  alertBox.style.color = "#fff";
  alertBox.style.padding = "12px 16px";
  alertBox.style.borderRadius = "10px";
  alertBox.style.zIndex = "99999";
  alertBox.style.fontSize = "14px";

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 4000);
}

smartAlerts();

function predictiveAlerts() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  if (logs.length < 5) return;

  const recent = logs.slice(-5);

  let cramps = 0;
  let fatigue = 0;
  let heavy = 0;

  recent.forEach(log => {
    const symptoms = log.symptoms || [];

    if (symptoms.includes("cramps")) cramps++;
    if (symptoms.includes("fatigue")) fatigue++;
    if (log.flow === "heavy") heavy++;
  });

  let prediction = "";

  if (cramps >= 3) {
    prediction = "🔮 You may experience cramps again soon. Prepare early.";
  } else if (fatigue >= 3) {
    prediction = "🔮 Your body shows fatigue trend. Plan to rest.";
  } else if (heavy >= 2) {
    prediction = "🔮 Heavy flow may occur soon. Stay prepared.";
  }

  if (prediction) {
    showAlert(prediction);
  }
}

predictiveAlerts();

function weeklyReport() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const reportEl = document.getElementById("weeklyReport");

  if (!reportEl || !logs.length) return;

  const last7 = logs.slice(-7);

  let total = last7.length;
  let cramps = 0;
  let fatigue = 0;
  let heavy = 0;
  let goodMood = 0;
  let badMood = 0;

  last7.forEach(log => {
    const symptoms = log.symptoms || [];

    if (symptoms.includes("cramps")) cramps++;
    if (symptoms.includes("fatigue")) fatigue++;
    if (log.flow === "heavy") heavy++;
    if (log.mood === "happy") goodMood++;
    if (log.mood === "sad" || log.mood === "irritated") badMood++;
  });

  // FIND TOP SYMPTOM
  let top = "None";

  if (cramps >= fatigue && cramps > 0) top = "Cramps";
  else if (fatigue > 0) top = "Fatigue";

  // CLEAR UI
  reportEl.innerHTML = "";

  function addItem(text) {
    const li = document.createElement("li");
    li.innerText = text;
    reportEl.appendChild(li);
  }

  addItem(`Total logs: ${total}`);
  addItem(`Most common symptom: ${top}`);
  addItem(`Heavy flow days: ${heavy}`);
  addItem(`Good mood days: ${goodMood}`);
  addItem(`Low mood days: ${badMood}`);

  // SMART SUMMARY
  let summary = "";

  if (badMood > goodMood) {
    summary = "⚠️ You had more low moods this week — prioritize self-care.";
  } else if (fatigue >= 3) {
    summary = "😴 Fatigue was common — your body needs rest.";
  } else {
    summary = "✅ Your week looks stable — keep tracking!";
  }

  addItem(summary);
}

// RUN
weeklyReport();