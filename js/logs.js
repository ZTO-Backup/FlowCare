// =======================
// 🚀 INIT (SAFE)
// =======================
document.addEventListener("DOMContentLoaded", () => {
  
  // GET DATE FROM URL
  const params = new URLSearchParams(window.location.search);
  window.selectedDate = params.get("date");
  
  if (!window.selectedDate) {
    window.selectedDate = new Date().toISOString().split("T")[0];
  }
  
  // LOAD EXISTING LOGS
  window.logs = JSON.parse(localStorage.getItem("logs")) || [];
  
  // CHECK IF DATA EXISTS
  const existing = window.logs.find(log => log.date === window.selectedDate);
  
  // PREFILL FORM
  if (existing) {
    document.getElementById("flow").value = existing.flow || "";
    document.getElementById("mood").value = existing.mood || "";
    document.getElementById("pads").value = existing.pads || "";
    
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = existing.symptoms?.includes(cb.value);
    });
  }
  
  // SET TITLE
  const titleEl = document.getElementById("logTitle");
  if (titleEl) {
    titleEl.innerText = "Log for " + window.selectedDate;
  }
  
});


// =======================
// 💾 SAVE FUNCTION (SAFE)
// =======================
function saveLog() {
  
  let flow = document.getElementById("flow").value;
  const mood = document.getElementById("mood").value;
  const pads = parseInt(document.getElementById("pads").value) || 0;
  
  // CLEAN FLOW VALUE
  flow = flow ? flow.toLowerCase() : "none";
  
  const symptomElements = document.querySelectorAll('input[type="checkbox"]:checked');
  const symptoms = [];
  symptomElements.forEach(el => symptoms.push(el.value));
  
  const entry = {
    date: window.selectedDate,
    flow,
    mood,
    pads,
    symptoms
  };
  
  // REMOVE OLD ENTRY
  window.logs = window.logs.filter(log => log.date !== window.selectedDate);
  
  // ADD NEW ENTRY
  window.logs.push(entry);
  
  // SAVE
  localStorage.setItem("logs", JSON.stringify(window.logs));
  
  // FEEDBACK
  alert("Saved 💖 You're doing great keeping track!");
  
  // REDIRECT
  window.location.href = "calendar.html";
}