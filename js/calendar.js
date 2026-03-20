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

  monthYear.innerText = `${today.toLocaleString('default', { month: 'long' })} ${currentYear}`;

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

renderCalendar();