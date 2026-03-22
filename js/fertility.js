function getLogs() {
  return JSON.parse(localStorage.getItem("logs")) || [];
}

// 📊 GET ALL PERIOD DATES
function getPeriodDates() {
  const logs = getLogs();

  return logs
    .filter(log => log.flow && log.flow !== "none")
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);
}

// 📊 SMART AVERAGE + VARIATION
function analyzeCycle() {
  const dates = getPeriodDates();

  if (dates.length < 2) {
    return { avg: 28, variation: 0 };
  }

  let cycles = [];

  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    cycles.push(diff);
  }

  const avg = cycles.reduce((a, b) => a + b, 0) / cycles.length;

  const variation =
    Math.max(...cycles) - Math.min(...cycles);

  return {
    avg: Math.round(avg),
    variation: Math.round(variation)
  };
}

// 📅 LAST PERIOD
function getLastPeriodDate() {
  const dates = getPeriodDates();
  return dates.length ? dates[dates.length - 1] : null;
}

// 🧠 AI FERTILITY SYSTEM
function fertilitySystem() {
  const { avg: cycleLength, variation } = analyzeCycle();
  const lastPeriod = getLastPeriodDate();

  const dayEl = document.getElementById("cycleDayFert");
  const statusEl = document.getElementById("fertilityStatus");
  const adviceEl = document.getElementById("fertilityAdvice");

  const username = localStorage.getItem("username") || "Queen";

  if (!lastPeriod) {
    dayEl.innerText = "--";
    statusEl.innerText = "No data";
    adviceEl.innerText = "Start logging your period so I can learn your body pattern 💡";
    return;
  }

  const today = new Date();
  const diffDays = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  dayEl.innerText = "Day " + cycleDay;

  // 💖 HUMAN AI MESSAGE
  adviceEl.innerText =
    `Hey ${username} 💖, I’ve been learning your cycle pattern. Here’s what I see right now:`;


  // 🌼 SMART OVULATION (adjusts if irregular)
  let ovulationDay = cycleLength - 14;

  if (variation > 5) {
    ovulationDay = cycleLength - 12; // shift for irregular users
  }

  const fertileStart = ovulationDay - 4;
  const fertileEnd = ovulationDay + 1;

  // 🔴 HIGH FERTILITY
  if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
    statusEl.innerText = "🔴 High Fertility";

    adviceEl.innerText +=
      " You’re in your fertile window. Your body is likely preparing for ovulation, so chances of pregnancy are higher now.";
  }

  // 🌼 OVULATION
  else if (cycleDay === ovulationDay) {
    statusEl.innerText = "🌼 Ovulation Day";

    adviceEl.innerText +=
      " Today looks like your ovulation day 🌼 — this is your peak fertility moment.";
  }

  // 🟢 LOW FERTILITY
  else {
    statusEl.innerText = "🟢 Low Fertility";

    adviceEl.innerText +=
      " This looks like a lower fertility phase. Chances are reduced, but not completely zero.";
  }

  // ❤️ LIBIDO + BODY SIGNALS
  if (cycleDay >= ovulationDay - 2 && cycleDay <= ovulationDay + 2) {
    adviceEl.innerText +=
      " You may also feel more energetic, confident, or experience increased desire around this time ❤️";
  }

  // ⚠️ IRREGULAR CYCLE WARNING
  if (variation > 5) {
    adviceEl.innerText +=
      " I’ve noticed your cycle varies a bit, so predictions may shift slightly. Keep logging to improve accuracy 📊";
  }
}

fertilitySystem();