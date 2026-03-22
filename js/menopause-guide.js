// TOGGLE
function toggleSection(header) {
  const content = header.nextElementSibling;
  content.style.display =
    content.style.display === "block" ? "none" : "block";
}

// SEARCH
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll(".section").forEach(section => {
      section.style.display =
        section.innerText.toLowerCase().includes(query)
          ? "block"
          : "none";
    });
  });
}

// COLLAPSE ALL
document.querySelectorAll(".section .content").forEach(el => {
  el.style.display = "none";
});

// =======================
// 🧠 PERSONALIZATION
// =======================

function getLogs() {
  return JSON.parse(localStorage.getItem("logs")) || [];
}

function detectStatus() {
  const logs = getLogs();
  const age = Number(localStorage.getItem("age")) || 0;

  if (!logs.length) return "unknown";

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  if (!periodLogs.length) return "unknown";

  const lastDate = new Date(periodLogs[periodLogs.length - 1].date);
  const monthsAbsent = (new Date() - lastDate) / (1000 * 60 * 60 * 24 * 30);

  if (monthsAbsent >= 12) return "post";
  if (age >= 40) return "pre";

  return "normal";
}

// APPLY PERSONALIZATION
function personalizeGuide() {
  const status = detectStatus();
  const messageEl = document.getElementById("personalMessage");

  if (!messageEl) return;

  // MESSAGE
  if (status === "post") {
    messageEl.innerText =
      "🌸 You are likely in post-menopause. Focus on long-term health and wellness.";
  } else if (status === "pre") {
    messageEl.innerText =
      "⚠️ You may be approaching menopause. Pay attention to body changes.";
  } else {
    messageEl.innerText =
      "✅ Your cycle looks stable. Stay informed and keep tracking.";
  }

  // HIGHLIGHT RELEVANT SECTIONS
  document.querySelectorAll(".section").forEach(section => {
    const type = section.getAttribute("data-type");

    if (type === status) {
      section.style.border = "2px solid #ff4d6d";
    }
  });
}

personalizeGuide();