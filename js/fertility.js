function getLogs() {
  return JSON.parse(localStorage.getItem("logs")) || [];
}

function getLastPeriodDate() {
  const logs = getLogs();

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  return periodLogs.length ? periodLogs[0].date : null;
}

function fertilitySystem() {
  const cycleLength = Number(localStorage.getItem("cycleLength")) || 28;

  const lastPeriod = getLastPeriodDate();

  const dayEl = document.getElementById("cycleDayFert");
  const statusEl = document.getElementById("fertilityStatus");
  const adviceEl = document.getElementById("fertilityAdvice");

  if (!lastPeriod) {
    dayEl.innerText = "--";
    statusEl.innerText = "No data";
    adviceEl.innerText = "Log your period to get insights";
    return;
  }

  const lastDate = new Date(lastPeriod);
  const today = new Date();

  const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  dayEl.innerText = "Day " + cycleDay;

  // 🌼 OVULATION (approx)
  const ovulationDay = cycleLength - 14;

  // 🔴 FERTILE WINDOW
  const fertileStart = ovulationDay - 4;
  const fertileEnd = ovulationDay + 1;

  if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
    statusEl.innerText = "🔴 High Fertility";

    adviceEl.innerText =
      "High chance of pregnancy. Avoid unprotected sex if not planning.";
  }

  else if (cycleDay === ovulationDay) {
    statusEl.innerText = "🌼 Ovulation Day";

    adviceEl.innerText =
      "Peak fertility today. Pregnancy chances are highest.";
  }

  else if (cycleDay < fertileStart || cycleDay > fertileEnd) {
    statusEl.innerText = "🟢 Low Fertility";

    adviceEl.innerText =
      "Lower chance of pregnancy, but not 100% safe.";
  }

  // ❤️ LIBIDO INSIGHT
  if (cycleDay >= ovulationDay - 2 && cycleDay <= ovulationDay + 2) {
    adviceEl.innerText += " Libido may be higher during this time ❤️";
  }
}

fertilitySystem();