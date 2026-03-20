let logs = JSON.parse(localStorage.getItem("logs")) || [];

// FILTER PERIOD DAYS
const periodLogs = logs.filter(log => log.flow !== "none");

// COUNT PERIOD DAYS
document.getElementById("periodCount").innerText = periodLogs.length;

// TOTAL PADS
let totalPads = 0;
logs.forEach(log => {
  totalPads += Number(log.pads || 0);
});
document.getElementById("padsUsed").innerText = totalPads;

// CALCULATE CYCLE LENGTH
function calculateCycleLengths() {
  let dates = periodLogs
    .map(log => new Date(log.date))
    .sort((a, b) => a - b);

  let cycles = [];

  for (let i = 1; i < dates.length; i++) {
    let diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    cycles.push(diff);
  }

  if (cycles.length === 0) return "--";

  let avg = Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length);
  return avg + " days";
}

document.getElementById("avgCycle").innerText = calculateCycleLengths();

// HEALTH NOTE
function getHealthNote() {
  if (periodLogs.length < 2) return "Not enough data yet";

  const avg = parseInt(calculateCycleLengths());

  if (avg < 21) return "Cycle seems short, monitor closely";
  if (avg > 35) return "Cycle seems long, consider checkup";

  return "Your cycle looks normal 👍";
}

document.getElementById("healthNote").innerText = getHealthNote();