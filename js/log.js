// GET DATE FROM URL
const params = new URLSearchParams(window.location.search);
let selectedDate = params.get("date");

if (!selectedDate) {
  selectedDate = new Date().toISOString().split("T")[0];
}

// LOAD EXISTING LOGS
let logs = JSON.parse(localStorage.getItem("logs")) || [];

// CHECK IF DATA EXISTS
const existing = logs.find(log => log.date === selectedDate);

// PREFILL FORM
if (existing) {
  document.getElementById("flow").value = existing.flow || "";
  document.getElementById("mood").value = existing.mood || "";
  document.getElementById("pads").value = existing.pads || "";

  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = existing.symptoms?.includes(cb.value);
  });
}

document.getElementById("logTitle").innerText = "Log for " + selectedDate;


// =======================
// 💾 SAVE FUNCTION (FIXED)
// =======================
function saveLog() {
  let flow = document.getElementById("flow").value;
  const mood = document.getElementById("mood").value;
  const pads = document.getElementById("pads").value;

  // 🔥 FORCE CLEAN VALUE
  flow = flow ? flow.toLowerCase() : "none";

  const symptomElements = document.querySelectorAll('input[type="checkbox"]:checked');
  const symptoms = [];
  symptomElements.forEach(el => symptoms.push(el.value));

  const entry = {
    date: selectedDate,
    flow,
    mood,
    pads,
    symptoms
  };

  // remove old entry
  logs = logs.filter(log => log.date !== selectedDate);
  logs.push(entry);

  // 🔥 SAVE CLEAN DATA
  localStorage.setItem("logs", JSON.stringify(logs));

  alert("Saved ✅");

  // 🔥 FORCE REFRESH (VERY IMPORTANT)
  window.location.href = "calendar.html";
}