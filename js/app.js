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

function showAdvice() {
  let logs = JSON.parse(localStorage.getItem("logs")) || [];

  const today = new Date().toISOString().split("T")[0];

  const todayLog = logs.find(log => log.date === today);

  let advice = "You're doing great today 💖";

  if (!todayLog) {
    advice = "Log your symptoms to get personalized tips 💡";
  } else {
    const { symptoms, mood, flow } = todayLog;

    if (symptoms && symptoms.includes("cramps")) {
      advice = "Try warm water, rest, or light stretching for cramps 🤍";
    } else if (symptoms && symptoms.includes("fatigue")) {
      advice = "Your body needs rest. Take it easy today 🛌";
    } else if (symptoms && symptoms.includes("headache")) {
      advice = "Stay hydrated and avoid stress triggers 💧";
    } else if (mood === "sad" || mood === "irritated") {
      advice = "Take a break, listen to music, or talk to someone 💛";
    } else if (flow === "heavy") {
      advice = "Stay prepared and keep extra pads with you 🧻";
    }
  }

  document.getElementById("tip").innerText = advice;
}

showAdvice();

function showKitReminder() {
  let logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow !== "none")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!periodLogs.length) return;

  const lastDate = new Date(periodLogs[0].date);
  const cycleLength = Number(localStorage.getItem("cycleLength")) || 28;

  const nextPeriod = new Date(lastDate);
  nextPeriod.setDate(lastDate.getDate() + cycleLength);

  const today = new Date();
  const diffDays = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 2 && diffDays >= 0) {
    document.getElementById("kitCard").style.display = "block";
  }
}

showKitReminder();

const messages = [
  "Drink water 💧",
  "Your cycle is unique 💖",
  "Rest when needed 🛌",
  "Track daily for better insights 📊"
];

let i = 0;
setInterval(() => {
  document.getElementById("marqueeText").innerText = messages[i];
  i = (i + 1) % messages.length;
}, 5000);

const profileImg = document.getElementById("profileImg");
const profileInput = document.getElementById("profileInput");

// load saved image
const savedImg = localStorage.getItem("profileImg");
if (savedImg) {
  profileImg.src = savedImg;
}

// click image → open file picker
profileImg.onclick = () => profileInput.click();

// save image
profileInput.addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    localStorage.setItem("profileImg", reader.result);
    profileImg.src = reader.result;
  };

  if (file) reader.readAsDataURL(file);
});