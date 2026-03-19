// SAMPLE DATA (later becomes dynamic)
const data = {
  lastPeriodDate: "2026-03-01",
  cycleLength: 28
};

// Greeting
document.getElementById("greeting").innerText = "Hi, Queen 👋";

// Calculate values
function calculateCycle() {
  const lastDate = new Date(data.lastPeriodDate);
  const today = new Date();

  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const cycleDay = diffDays % data.cycleLength;

  // Next period
  const nextPeriodDate = new Date(lastDate);
  nextPeriodDate.setDate(lastDate.getDate() + data.cycleLength);

  const daysLeft = Math.ceil((nextPeriodDate - today) / (1000 * 60 * 60 * 24));

  // Ovulation (approx)
  const ovulationDay = data.cycleLength - 14;
  const ovulationIn = ovulationDay - cycleDay;

  // Display
  document.getElementById("cycleDay").innerText = "Day " + cycleDay;
  document.getElementById("nextPeriod").innerText = daysLeft + " days";
  document.getElementById("ovulation").innerText =
    ovulationIn > 0 ? ovulationIn + " days" : "Passed";
}

calculateCycle();

// Button navigation
function goToLog() {
  alert("Log page coming next 🔥");
}