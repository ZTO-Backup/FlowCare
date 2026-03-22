function getLogs() {
  return JSON.parse(localStorage.getItem("logs")) || [];
}

function analyzeMenopause() {
  const logs = getLogs();
  const age = Number(localStorage.getItem("age")) || 0;

  const statusEl = document.getElementById("menoStatus");
  const infoEl = document.getElementById("menoInfo");
  const adviceEl = document.getElementById("menoAdvice");

  if (!logs.length) {
    statusEl.innerText = "No data yet";
    infoEl.innerText = "Track your cycle to get insights.";
    return;
  }

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  // Calculate cycle gaps
  let irregularCount = 0;

  for (let i = 1; i < periodLogs.length; i++) {
    const diff = new Date(periodLogs[i].date) - new Date(periodLogs[i-1].date);
    const days = diff / (1000 * 60 * 60 * 24);

    if (days > 35 || days < 21) {
      irregularCount++;
    }
  }

  const lastPeriod = periodLogs[periodLogs.length - 1];

  if (!lastPeriod) return;

  const lastDate = new Date(lastPeriod.date);
  const today = new Date();
  const monthsAbsent = (today - lastDate) / (1000 * 60 * 60 * 24 * 30);

  // 🌸 POST MENOPAUSE
  if (monthsAbsent >= 12) {
    statusEl.innerText = "🌸 Post-Menopause";

    infoEl.innerText =
      "No period for over 12 months. Fertility has ended.";

    adviceEl.innerText =
      "Focus on bone health, calcium intake, regular medical checkups.";
    return;
  }

  // ⚠️ PERIMENOPAUSE
  if (age >= 40 && irregularCount >= 3) {
    statusEl.innerText = "⚠️ Perimenopause";

    infoEl.innerText =
      "Hormonal changes are causing irregular cycles.";

    adviceEl.innerText =
      "Expect hot flashes, mood changes. Prioritize rest and nutrition.";
    return;
  }

  // 🟡 EARLY SIGNAL
  if (age >= 35 && irregularCount >= 2) {
    statusEl.innerText = "🟡 Early Signs";

    infoEl.innerText =
      "Your cycle shows early signs of hormonal shift.";

    adviceEl.innerText =
      "Track consistently and manage stress.";
    return;
  }

  // ✅ NORMAL
  statusEl.innerText = "✅ Normal Cycle";

  infoEl.innerText =
    "Your cycle pattern is stable.";

  adviceEl.innerText =
    "Keep tracking for better insights.";
}

analyzeMenopause();