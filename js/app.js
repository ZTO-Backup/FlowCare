// =======================
// 🧰 HELPERS
// =======================
function getLogs() {
  return JSON.parse(localStorage.getItem("logs")) || [];
}

function saveLogs(logs) {
  localStorage.setItem("logs", JSON.stringify(logs));
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

// =======================
// ⚙️ SETTINGS
// =======================

const cycleLength = Number(localStorage.getItem("cycleLength")) || 28;
const username = localStorage.getItem("username") || "Queen";

// =======================
// 👋 GREETING
// =======================

const greetingEl = document.getElementById("greeting");
if (greetingEl) {
  greetingEl.innerText = `Hi, ${username} 👋`;
}

// =======================
// 🩸 CYCLE CALCULATION
// =======================

function getLastPeriodDate() {
  const logs = getLogs();

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return periodLogs.length ? periodLogs[0].date : null;
}

function calculateCycle() {
  const lastPeriodDate = getLastPeriodDate();

  const nextEl = document.getElementById("nextPeriod");
  const dayEl = document.getElementById("cycleDay");
  const ovuEl = document.getElementById("ovulation");


  if (!nextEl || !dayEl || !ovuEl) return;

  if (!lastPeriodDate) {
    nextEl.innerText = "Log period first";
    dayEl.innerText = "--";
    ovuEl.innerText = "--";
    return;
  }

  const lastDate = new Date(lastPeriodDate);
  const today = new Date();

  const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  const nextPeriodDate = new Date(lastDate);
  nextPeriodDate.setDate(lastDate.getDate() + cycleLength);

  const daysLeft = Math.ceil((nextPeriodDate - today) / (1000 * 60 * 60 * 24));

  const ovulationDay = cycleLength - 14;
  const ovulationIn = ovulationDay - cycleDay;

  dayEl.innerText = "Day " + cycleDay;
  nextEl.innerText = daysLeft + " days";
  ovuEl.innerText = ovulationIn > 0 ? ovulationIn + " days" : "Passed";
}

// =======================
// 📦 PADS SUMMARY
// =======================

function updatePadsUsed() {
  const logs = getLogs();

  let total = 0;
  logs.forEach(log => {
    total += Number(log.pads || 0);
  });

  const el = document.getElementById("padsUsed");
  if (el) el.innerText = "Pads used: " + total;
}

// =======================
// 💡 ADVICE ENGINE
// =======================

function showAdvice() {
  const logs = getLogs();
  const todayLog = logs.find(log => log.date === getToday());

  const el = document.getElementById("tip");
  if (!el) return;

  let advice = "You're doing great today 💖";

  if (!todayLog) {
    advice = "Log your symptoms to get personalized tips 💡";
  } else {
    const { symptoms = [], mood, flow } = todayLog;

    if (symptoms.includes("cramps")) {
      advice = "Try warm compress or rest for cramps 🤍";
    } else if (symptoms.includes("fatigue")) {
      advice = "Your body needs rest 🛌";
    } else if (symptoms.includes("headache")) {
      advice = "Stay hydrated 💧";
    } else if (mood === "sad" || mood === "irritated") {
      advice = "Take a break 💛";
    } else if (flow === "heavy") {
      advice = "Stay prepared with pads 🧻";
    }
  }

  el.innerText = advice;
}

// =======================
// 🧰 KIT REMINDER
// =======================

function showKitReminder() {
  const logs = getLogs();

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!periodLogs.length) return;

  const lastDate = new Date(periodLogs[0].date);

  const nextPeriod = new Date(lastDate);
  nextPeriod.setDate(lastDate.getDate() + cycleLength);

  const today = new Date();
  const diffDays = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));

  const el = document.getElementById("kitCard");
  if (el && diffDays <= 2 && diffDays >= 0) {
    el.style.display = "block";
  }
}

// =======================
// 📢 ADAPTIVE MARQUEE
// =======================

const textEl = document.getElementById("marqueeText");

function getAdaptiveMessages() {
  const logs = getLogs();
  const todayLog = logs.find(log => log.date === getToday());

  let set = new Set();

  set.add("Drink water 💧");
  set.add("Your cycle is unique 💖");

  if (!todayLog) {
    set.add("Track daily 📊");
    return [...set];
  }

  const { symptoms = [], mood, flow } = todayLog;

  if (flow === "heavy") {
    set.add("Carry extra pads 🧻");
  }

  if (symptoms.includes("cramps")) {
    set.add("Use warm compress 🔥");
  }

  if (symptoms.includes("fatigue")) {
    set.add("Rest more today 🛌");
  }

  if (symptoms.includes("headache")) {
    set.add("Stay hydrated 💧");
  }

  if (mood === "sad" || mood === "irritated") {
    set.add("Take a break 💛");
  }

  set.add("Hygiene matters 🧼");

  return [...set];
}

function startMarquee() {
  if (!textEl) return;

  let i = 0;

  function update() {
    const messages = getAdaptiveMessages();

    textEl.innerText = messages[i];

    textEl.style.animation = "none";
    void textEl.offsetWidth;
    textEl.style.animation = "scrollText 12s linear";

    i = (i + 1) % messages.length;
  }

  update();
  setInterval(update, 12000);
}

// =======================
// 👤 PROFILE IMAGE
// =======================

function initProfileImage() {
  const img = document.getElementById("profileImg");
  const input = document.getElementById("profileInput");

  if (!img || !input) return;

  const saved = localStorage.getItem("profileImg");
  if (saved) img.src = saved;

  img.onclick = () => input.click();

  input.addEventListener("change", function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      localStorage.setItem("profileImg", reader.result);
      img.src = reader.result;
    };

    if (file) reader.readAsDataURL(file);
  });
}

function sendPush(title, body) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: "icon-192.png"
    });
  }
}

// =======================
// 🚀 INIT
// =======================

calculateCycle();
updatePadsUsed();
showAdvice();
showKitReminder();
startMarquee();
initProfileImage();

window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("splashScreen");

    if (splash) {
      splash.classList.add("hide");

      setTimeout(() => {
        splash.remove();
      }, 500);
    }
  }, 2000);
});