const calendarEl = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const selectedDateText = document.getElementById("selectedDate");

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let logs = JSON.parse(localStorage.getItem("logs")) || [];

function renderCalendar() {
  calendarEl.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

 const date = new Date(currentYear, currentMonth);
 monthYear.innerText = date.toLocaleString('default', { month: 'long', year: 'numeric' });

  // empty spaces
  for (let i = 0; i < firstDay; i++) {
    calendarEl.innerHTML += `<div></div>`;
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    const log = logs.find(l => l.date === dateStr);

    let className = "day";

    if (log && log.flow !== "none") {
      className += " period";
    }

    calendarEl.innerHTML += `<div class="${className}" onclick="selectDate('${dateStr}')">${day}</div>`;
  }
}

function selectDate(date) {
  selectedDateText.innerText = "Selected: " + date;
  
  // highlight selected
  document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
  
  event.target.classList.add("active");
  
  document.getElementById("logBtn").onclick = () => {
    window.location.href = `log.html?date=${date}`;
  };
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}

renderCalendar();

function getFertilityColor(dateStr) {
  const cycleLength = Number(localStorage.getItem("cycleLength")) || 28;

  const logs = JSON.parse(localStorage.getItem("logs")) || [];

  const periodLogs = logs
    .filter(log => log.flow && log.flow !== "none")
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  if (!periodLogs.length) return "";

  const lastDate = new Date(periodLogs[0].date);
  const current = new Date(dateStr);

  const diffDays = Math.floor((current - lastDate) / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % cycleLength) + 1;

  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 4;
  const fertileEnd = ovulationDay + 1;

  if (cycleDay === ovulationDay) return "ovulation";
  if (cycleDay >= fertileStart && cycleDay <= fertileEnd) return "fertile";
  return "safe";
}