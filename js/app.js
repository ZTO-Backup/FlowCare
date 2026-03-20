// LOAD SETTINGS
let cycleLength = Number(localStorage.getItem("cycleLength")) || 28;
let username = localStorage.getItem("username") || "Queen";

// Load logs
let logs = JSON.parse(localStorage.getItem("logs")) || [];

// Get last period start (first day user logged "flow")
function getLastPeriodDate() {
  const periodLogs = logs
    .filter(log => log.flow !== "none")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return periodLogs.length ? periodLogs[0].date : null;
}

// Greeting
document.getElementById("greeting").innerText = `Hi, ${username} 👋`;

function calculateCycle() {
  const lastPeriodDate = getLastPeriodDate();

  if (!lastPeriodDate) {
    document.getElementById("nextPeriod").innerText = "Log period first";
    document.getElementById("cycleDay").innerText = "--";
    document.getElementById("ovulation").innerText = "--";
    return;
  }

  const lastDate = new Date(lastPeriodDate);
  const today = new Date();

  const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  // Next period
  const nextPeriodDate = new Date(lastDate);
  nextPeriodDate.setDate(lastDate.getDate() + cycleLength);

  const daysLeft = Math.ceil((nextPeriodDate - today) / (1000 * 60 * 60 * 24));

  // Ovulation
  const ovulationDay = cycleLength - 14;
  const ovulationIn = ovulationDay - cycleDay;

  // Display
  document.getElementById("cycleDay").innerText = "Day " + cycleDay;
  document.getElementById("nextPeriod").innerText = daysLeft + " days";
  document.getElementById("ovulation").innerText =
    ovulationIn > 0 ? ovulationIn + " days" : "Passed";

  updatePadsUsed();
}

// Pads summary
function updatePadsUsed() {
  let totalPads = 0;

  logs.forEach(log => {
    totalPads += Number(log.pads || 0);
  });

  const tip = document.getElementById("tip");
  tip.innerText = "Pads used this cycle: " + totalPads;
}

calculateCycle();