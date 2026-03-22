// LOAD SAVED SETTINGS
const savedName = localStorage.getItem("username");
const savedCycle = localStorage.getItem("cycleLength");
const notifEnabled = localStorage.getItem("notifications");

// SET VALUES
if (savedName) document.getElementById("username").value = savedName;
if (savedCycle) document.getElementById("cycleLength").value = savedCycle;
if (notifEnabled === "true") document.getElementById("notifToggle").checked = true;

// SAVE NAME
document.getElementById("username").addEventListener("input", (e) => {
  localStorage.setItem("username", e.target.value);
});

// SAVE CYCLE LENGTH
document.getElementById("cycleLength").addEventListener("input", (e) => {
  localStorage.setItem("cycleLength", e.target.value);
});

const ageInput = document.getElementById("ageInput");

if (ageInput) {
  ageInput.value = localStorage.getItem("age") || "";

    ageInput.addEventListener("input", () => {
        localStorage.setItem("age", ageInput.value);
          });
          }

// TOGGLE NOTIFICATIONS
document.getElementById("notifToggle").addEventListener("change", (e) => {
  localStorage.setItem("notifications", e.target.checked);

  if (e.target.checked) {
    Notification.requestPermission();
  }
});

// RESET DATA
function resetData() {
  if (confirm("Are you sure? This will delete all data.")) {
    localStorage.clear();
    location.reload();
  }
}

// SIMPLE PIN (basic for now)
function setPIN() {
  const pin = prompt("Enter a 4-digit PIN:");
  if (pin) {
    localStorage.setItem("appPIN", pin);
    alert("PIN saved 🔒");
  }
}